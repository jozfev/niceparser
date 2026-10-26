#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Парсер Яндекс.Карт: поиск заведений БЕЗ сайтов.

Как это работает
----------------
Яндекс.Карты подгружают результаты поиска по внутреннему API, который
недоступен без ключа (и закрыт CORS для браузера). Поэтому парсер работает
через Playwright: открывает реальную страницу поиска в Яндекс.Картах и
«перехватывает» ответы внутреннего API (эндпоинт `search/list`) — в них
содержится вся карточка организации: название, адрес, телефон, рейтинг,
отзывы и поле `urls` (ссылки на сайты заведения).

Организации без сайта — это те, у кого список `urls` пуст (в карточке нет
кнопки/ссылки на сайт). Именно они попадают в результат.

Требования
----------
    pip install playwright
    playwright install chromium

Использование
-------------
    # Москва, автосервисы, собрать ~300 карточек, экспорт в CSV
    python yandex_maps_parser.py --city "Москва" --query "автосервис" \
        --max-cards 300 --out moscow_autoservice.csv

    # Только организации с рейтингом >= 4 и хотя бы 1 отзыв
    python yandex_maps_parser.py --city "Казань" --query "стоматология" \
        --min-rating 4 --min-reviews 1

    # Открыть браузер (видно, что происходит) + сохранить сырой JSON
    python yandex_maps_parser.py --city "Санкт-Петербург" --query "барбершоп" \
        --headed --json raw.json

    # Проверить работу без браузера (на тестовом дампе ответа API)
    python yandex_maps_parser.py --demo

Антибот
-------
Иногда Яндекс показывает капчу. Если она появится, парсер сохранит скриншот
captcha.png и попросит пройти её вручную (в режиме --headed), либо завершится
с понятной ошибкой в headless-режиме.
"""

from __future__ import annotations

import argparse
import asyncio
import csv
import json
import sys
import time
from dataclasses import dataclass, field, asdict
from typing import Any, Iterable, Optional


# --------------------------------------------------------------------------- #
#  Модель данных
# --------------------------------------------------------------------------- #

@dataclass
class Organization:
    id: str
    name: str
    address: str
    phones: list[str] = field(default_factory=list)
    rating: Optional[float] = None
    reviews: int = 0
    websites: list[str] = field(default_factory=list)
    categories: list[str] = field(default_factory=list)
    yandex_maps_url: str = ""
    has_website: bool = False

    def to_row(self) -> dict[str, Any]:
        return {
            "name": self.name,
            "address": self.address,
            "phones": "; ".join(self.phones),
            "rating": self.rating if self.rating is not None else "",
            "reviews": self.reviews,
            "categories": "; ".join(self.categories),
            "websites": "; ".join(self.websites),
            "has_website": "да" if self.has_website else "нет",
            "yandex_maps_url": self.yandex_maps_url,
        }


CSV_FIELDS = list(Organization(id="", name="", address="").to_row().keys())


# --------------------------------------------------------------------------- #
#  Разбор ответов внутреннего API Яндекс.Карт
# --------------------------------------------------------------------------- #

def _first(d: dict, *keys: str, default: Any = None) -> Any:
    """Вернуть первое непустое значение из dict по списку ключей."""
    for k in keys:
        v = d.get(k)
        if v not in (None, "", [], {}):
            return v
    return default


def _extract_address(item: dict) -> str:
    addr = item.get("address") or item.get("formattedAddress") or ""
    if isinstance(addr, dict):
        addr = _first(addr, "full_address", "formatted", "geocoder_address", default="")
    if not addr:
        items = (item.get("addresses") or {}).get("items") or []
        if items:
            a = items[0]
            addr = a.get("full_address") or a.get("formatted") or ""
    return str(addr).strip()


def _extract_phones(item: dict) -> list[str]:
    phones: list[str] = []
    for p in (item.get("phones") or {}).get("items") or []:
        num = p.get("number") or p.get("raw") or p.get("formatted")
        if num:
            phones.append(str(num))
    return phones


def _extract_websites(item: dict) -> list[str]:
    sites: list[str] = []
    for u in (item.get("urls") or {}).get("items") or []:
        link = u.get("link") or u.get("url") or u.get("uri")
        if link:
            sites.append(str(link))
    # иногда сайты лежат в отдельных полях
    for key in ("business_site", "site"):
        v = item.get(key)
        if isinstance(v, str) and v.startswith("http"):
            sites.append(v)
    return sorted(set(sites))


def _extract_rating(item: dict) -> tuple[Optional[float], int]:
    rate = item.get("rate")
    if isinstance(rate, dict):
        stars = rate.get("stars", rate.get("rating"))
        count = rate.get("count", rate.get("reviews_count"))
    else:
        stars = item.get("rating")
        rc = item.get("review_counter")
        count = rc.get("value") if isinstance(rc, dict) else item.get("reviews_count")
    try:
        stars_f = float(stars) if stars is not None else None
    except (TypeError, ValueError):
        stars_f = None
    try:
        count_i = int(count) if count is not None else 0
    except (TypeError, ValueError):
        count_i = 0
    return stars_f, count_i


def parse_search_response(payload: dict) -> list[Organization]:
    """Разобрать один ответ эндпоинта search/list в список организаций."""
    orgs: list[Organization] = []
    results = payload.get("results") or (payload.get("data") or {}).get("results") or []
    for item in results:
        if not isinstance(item, dict):
            continue
        oid = str(_first(item, "id", "org_id", default=""))
        name = str(_first(item, "title", "name", "display_name", default="")).strip()
        if not name:
            continue
        websites = _extract_websites(item)
        rating, reviews = _extract_rating(item)
        categories = [c.get("name", "") for c in item.get("categories") or []
                      if isinstance(c, dict) and c.get("name")]
        maps_url = item.get("url") or ""
        if not maps_url and oid:
            point = item.get("geometry") or item.get("point") or {}
            if isinstance(point, dict) and "x" in point and "y" in point:
                maps_url = (f"https://yandex.ru/maps/?ll={point['x']}%2C{point['y']}"
                            f"&z=17&oid={oid}")
        orgs.append(Organization(
            id=oid,
            name=name,
            address=_extract_address(item),
            phones=_extract_phones(item),
            rating=rating,
            reviews=reviews,
            websites=websites,
            categories=categories,
            yandex_maps_url=str(maps_url),
            has_website=bool(websites),
        ))
    return orgs


# --------------------------------------------------------------------------- #
#  Фильтрация
# --------------------------------------------------------------------------- #

def apply_filters(orgs: Iterable[Organization], *, only_no_website: bool,
                  min_rating: float = 0, min_reviews: int = 0) -> list[Organization]:
    out: list[Organization] = []
    for o in orgs:
        if only_no_website and o.has_website:
            continue
        if min_rating > 0 and (o.rating is None or o.rating < min_rating):
            continue
        if min_reviews > 0 and o.reviews < min_reviews:
            continue
        out.append(o)
    return out


# --------------------------------------------------------------------------- #
#  Экспорт
# --------------------------------------------------------------------------- #

def save_csv(orgs: list[Organization], path: str) -> None:
    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        w.writeheader()
        for o in orgs:
            w.writerow(o.to_row())


def save_json(orgs: list[Organization], path: str) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump([asdict(o) for o in orgs], f, ensure_ascii=False, indent=2)


# --------------------------------------------------------------------------- #
#  Парсинг через Playwright (перехват сетевого трафика)
# --------------------------------------------------------------------------- #

# Подстроки, по которым узнаём нужные ответы API Яндекса
API_MARKERS = ("search/list", "/api/list/")


async def parse_with_playwright(city: str, query: str, max_cards: int,
                                headed: bool, captcha_shot: str = "captcha.png",
                                scroll_pause: float = 1.2) -> list[Organization]:
    from playwright.async_api import async_playwright, TimeoutError as PWTimeout

    search_term = f"{query} {city}" if city else query
    url = f"https://yandex.ru/maps/?text={search_term}"

    collected: dict[str, Organization] = {}

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=not headed)
        ctx = await browser.new_context(
            locale="ru-RU",
            viewport={"width": 1366, "height": 900},
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
            ),
        )
        page = await ctx.new_page()

        async def on_response(resp):
            req_url = resp.url
            if "yandex" not in req_url:
                return
            if not any(m in req_url for m in API_MARKERS):
                return
            try:
                body = await resp.json()
            except Exception:
                return
            for org in parse_search_response(body):
                collected.setdefault(org.id, org)

        tasks: set[asyncio.Task] = set()

        def sync_handler(resp):
            t = asyncio.ensure_future(on_response(resp))
            tasks.add(t)
            t.add_done_callback(tasks.discard)

        page.on("response", sync_handler)

        print(f"→ Открываю поиск: {search_term!r}")
        await page.goto(url, wait_until="domcontentloaded", timeout=60_000)

        # Ждём появления списка результатов
        try:
            await page.wait_for_selector(
                "[class*='search-list'], [class*='organizations-view']",
                timeout=30_000)
        except PWTimeout:
            pass

        # Прокручиваем список, пока не наберём нужное число карточек
        start = time.time()
        last_count = -1
        stagnant = 0
        while len(collected) < max_cards and time.time() - start < 240:
            await page.mouse.wheel(0, 4000)
            try:
                btn = page.locator("button", has_text="Показать ещё")
                if await btn.count():
                    await btn.first.click(timeout=2_000)
            except Exception:
                pass
            await page.wait_for_timeout(int(scroll_pause * 1000))
            if len(collected) == last_count:
                stagnant += 1
                if stagnant >= 12:
                    print("⚠ Результаты перестали добавляться — останавливаюсь.")
                    break
            else:
                stagnant = 0
                last_count = len(collected)
            print(f"  собрано карточек: {len(collected)}", end="\r", flush=True)
        print()

        # Проверка на капчу
        if await page.locator("[class*='captcha'], iframe[src*='captcha']").count():
            await page.screenshot(path=captcha_shot)
            if headed:
                print(f"🧩 Капча! Пройдите её в окне браузера, затем нажмите Enter…")
                await asyncio.get_event_loop().run_in_executor(None, input)
                await page.reload(wait_until="domcontentloaded")
                await page.wait_for_timeout(3_000)
            else:
                await browser.close()
                raise RuntimeError(
                    f"Яндекс показал капчу (скриншот: {captcha_shot}). "
                    "Запустите с флагом --headed и пройдите её вручную."
                )

        # Догружаем недочитанные ответы
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)
        await browser.close()

    return list(collected.values())


def run_playwright(**kwargs) -> list[Organization]:
    return asyncio.run(parse_with_playwright(**kwargs))


# --------------------------------------------------------------------------- #
#  Демо-режим (без браузера) — проверка парсера на фиктивном дампе
# --------------------------------------------------------------------------- #

DEMO_PAYLOAD = {
    "results": [
        {
            "id": "101", "title": "АвтоМастер",
            "address": {"full_address": "Москва, ул. Мясницкая, 13с1"},
            "phones": {"items": [{"number": "+7 (903) 123-45-67"}]},
            "rate": {"stars": 4.6, "count": 87},
            "urls": {"items": []},
            "categories": [{"name": "Автосервис"}],
        },
        {
            "id": "102", "title": "МоторСервис",
            "address": {"full_address": "Москва, Ленинградский пр., 33"},
            "urls": {"items": [{"link": "https://motorservice.example.com"}]},
            "rate": {"stars": 4.1, "count": 12},
        },
        {
            "id": "103", "title": "Шиномонтаж у Васи",
            "address": {"full_address": "Москва, Профсоюзная ул., 12"},
            "phones": {"items": [{"number": "+7 (916) 000-11-22"}]},
            "rate": {"stars": 3.8, "count": 5},
            "urls": {"items": []},
        },
    ]
}


def run_demo(args) -> int:
    orgs = parse_search_response(DEMO_PAYLOAD)
    print(f"Всего организаций в дампе: {len(orgs)}")
    for o in orgs:
        mark = "🌐 есть сайт" if o.has_website else "❌ нет сайта"
        print(f"  - {o.name}: {mark}; рейтинг={o.rating}; отзывов={o.reviews}")
    result = apply_filters(orgs, only_no_website=not args.all,
                           min_rating=args.min_rating, min_reviews=args.min_reviews)
    print(f"\nБез сайтов (после фильтров): {len(result)}")
    if args.out:
        save_csv(result, args.out)
        print(f"Сохранено в {args.out}")
    return 0


# --------------------------------------------------------------------------- #
#  CLI
# --------------------------------------------------------------------------- #

def build_argparser() -> argparse.ArgumentParser:
    ap = argparse.ArgumentParser(
        description="Поиск заведений без сайтов в Яндекс.Картах",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    ap.add_argument("--city", default="Москва", help="город поиска")
    ap.add_argument("--query", "-q", default="автосервис", help="категория/запрос")
    ap.add_argument("--max-cards", type=int, default=200,
                    help="сколько карточек собрать максимум")
    ap.add_argument("--out", "-o", default="no_website.csv", help="куда сохранить CSV")
    ap.add_argument("--json", dest="json_out", default=None,
                    help="сохранить результат также в JSON")
    ap.add_argument("--min-rating", type=float, default=0,
                    help="минимальный рейтинг (0 = любой)")
    ap.add_argument("--min-reviews", type=int, default=0, help="минимум отзывов")
    ap.add_argument("--all", action="store_true",
                    help="не фильтровать «без сайта» (вывести все найденные)")
    ap.add_argument("--headed", action="store_true", help="показать окно браузера")
    ap.add_argument("--demo", action="store_true",
                    help="тест без браузера на фиктивном дампе")
    return ap


def main(argv: Optional[list[str]] = None) -> int:
    args = build_argparser().parse_args(argv)

    if args.demo:
        return run_demo(args)

    try:
        orgs = run_playwright(
            city=args.city, query=args.query,
            max_cards=args.max_cards, headed=args.headed,
        )
    except ImportError:
        print("Не найден Playwright. Установите:\n"
              "  pip install playwright && playwright install chromium",
              file=sys.stderr)
        return 2
    except RuntimeError as e:
        print(f"Ошибка: {e}", file=sys.stderr)
        return 3

    print(f"\nВсего собрано организаций: {len(orgs)}")
    result = apply_filters(orgs, only_no_website=not args.all,
                           min_rating=args.min_rating,
                           min_reviews=args.min_reviews)
    print(f"Из них без сайта (после фильтров): {len(result)}")

    save_csv(result, args.out)
    print(f"CSV сохранён: {args.out}")
    if args.json_out:
        save_json(result, args.json_out)
        print(f"JSON сохранён: {args.json_out}")

    # Краткая сводка
    for o in result[:10]:
        print(f"  • {o.name} | {o.address} | ★{o.rating} ({o.reviews} отв.) | "
              f"тел: {', '.join(o.phones) or '—'}")
    if len(result) > 10:
        print(f"  … и ещё {len(result) - 10}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
