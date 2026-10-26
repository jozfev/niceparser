import { useState } from 'react'

interface InstructionsModalProps {
  onClose: () => void
}

export default function InstructionsModal({ onClose }: InstructionsModalProps) {
  const [activeTab, setActiveTab] = useState<'quickstart' | 'python' | 'nodejs' | 'manual'>('quickstart')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <i className="fas fa-code text-white"></i>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Как запустить парсер</h2>
              <p className="text-xs text-slate-400">Пошаговая инструкция</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-all">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700 px-6 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('quickstart')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${activeTab === 'quickstart' ? 'border-yellow-400 text-yellow-400' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            <i className="fas fa-rocket mr-1"></i> Быстрый старт
          </button>
          <button
            onClick={() => setActiveTab('python')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${activeTab === 'python' ? 'border-yellow-400 text-yellow-400' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            <i className="fab fa-python mr-1"></i> Python
          </button>
          <button
            onClick={() => setActiveTab('nodejs')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${activeTab === 'nodejs' ? 'border-yellow-400 text-yellow-400' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            <i className="fab fa-node-js mr-1"></i> Node.js
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${activeTab === 'manual' ? 'border-yellow-400 text-yellow-400' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            <i className="fas fa-book mr-1"></i> Альтернативы
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'quickstart' && <QuickStart />}
          {activeTab === 'python' && <PythonCode />}
          {activeTab === 'nodejs' && <NodeJSCode />}
          {activeTab === 'manual' && <ManualInstructions />}
        </div>
      </div>
    </div>
  )
}

function CodeBlock({ title, code, lang = 'bash' }: { title: string; code: string; lang?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between bg-slate-900 px-4 py-2 rounded-t-lg border border-slate-700 border-b-0">
        <span className="text-xs text-slate-400 font-mono">{title}</span>
        <button
          onClick={handleCopy}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          {copied ? (
            <><i className="fas fa-check text-green-400"></i> Скопировано</>
          ) : (
            <><i className="fas fa-copy"></i> Копировать</>
          )}
        </button>
      </div>
      <pre className="bg-slate-900 rounded-b-lg p-4 overflow-x-auto text-sm border border-slate-700 border-t-0">
        <code className="text-green-400 font-mono">{code}</code>
      </pre>
    </div>
  )
}

function QuickStart() {
  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-blue-400 text-sm font-medium mb-1">
          <i className="fas fa-info-circle mr-1"></i> Что вам понадобится
        </p>
        <p className="text-slate-300 text-sm">
          Python 3.8+, интернет и 5 минут времени. Парсер работает через официальный API Яндекс.Карт (бесплатно).
        </p>
      </div>

      {/* Step 1 */}
      <div className="bg-slate-700/30 rounded-xl p-5 border border-slate-600/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm">1</div>
          <h3 className="text-white font-semibold">Создайте папку проекта</h3>
        </div>
        <div className="ml-11">
          <p className="text-slate-300 text-sm mb-3">Откройте терминал (CMD / PowerShell / Terminal) и выполните:</p>
          <CodeBlock
            title="terminal"
            code={`mkdir yandex-parser
cd yandex-parser`}
          />
        </div>
      </div>

      {/* Step 2 */}
      <div className="bg-slate-700/30 rounded-xl p-5 border border-slate-600/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm">2</div>
          <h3 className="text-white font-semibold">Получите API-ключ (бесплатно)</h3>
        </div>
        <div className="ml-11 space-y-2 text-sm text-slate-300">
          <ol className="list-decimal list-inside space-y-2">
            <li>Перейдите на <a href="https://developer.tech.yandex.ru/" target="_blank" rel="noopener" className="text-blue-400 hover:underline">developer.tech.yandex.ru</a></li>
            <li>Войдите через Яндекс ID</li>
            <li>Нажмите «Подключить API» → выберите «HTTP Геокодер»</li>
            <li>Создайте ключ и скопируйте его</li>
          </ol>
          <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-green-400 text-xs">✓ Бесплатно: 50 000 запросов/день — хватит на тысячи лидов</p>
          </div>
        </div>
      </div>

      {/* Step 3 */}
      <div className="bg-slate-700/30 rounded-xl p-5 border border-slate-600/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm">3</div>
          <h3 className="text-white font-semibold">Установите зависимости</h3>
        </div>
        <div className="ml-11">
          <CodeBlock
            title="terminal"
            code={`pip install requests`}
          />
          <p className="text-slate-400 text-xs mt-1">Если нет Python — скачайте с <a href="https://python.org" target="_blank" rel="noopener" className="text-blue-400 hover:underline">python.org</a></p>
        </div>
      </div>

      {/* Step 4 */}
      <div className="bg-slate-700/30 rounded-xl p-5 border border-slate-600/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm">4</div>
          <h3 className="text-white font-semibold">Создайте файл парсера</h3>
        </div>
        <div className="ml-11">
          <p className="text-slate-300 text-sm mb-3">Создайте файл <code className="bg-slate-900/50 px-2 py-0.5 rounded text-yellow-400">parser.py</code> и вставьте код из вкладки «Python» (или скопируйте ниже):</p>
          <CodeBlock
            title="terminal — создать файл"
            code={`# Windows:
type nul > parser.py

# Mac/Linux:
touch parser.py

# Или просто откройте в любом редакторе (VS Code, Notepad++)`}
          />
        </div>
      </div>

      {/* Step 5 */}
      <div className="bg-slate-700/30 rounded-xl p-5 border border-slate-600/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm">5</div>
          <h3 className="text-white font-semibold">Замените YOUR_API_KEY на свой ключ</h3>
        </div>
        <div className="ml-11">
          <p className="text-slate-300 text-sm mb-3">В файле parser.py найдите строку:</p>
          <CodeBlock
            title="parser.py — строка для замены"
            code={`'apikey': 'YOUR_API_KEY',  # ← замените на свой ключ`}
          />
        </div>
      </div>

      {/* Step 6 */}
      <div className="bg-slate-700/30 rounded-xl p-5 border border-slate-600/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">6</div>
          <h3 className="text-white font-semibold">Запустите!</h3>
        </div>
        <div className="ml-11">
          <CodeBlock
            title="terminal"
            code={`python parser.py`}
          />
          <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-green-400 text-sm font-medium">🎉 Готово!</p>
            <p className="text-slate-300 text-xs mt-1">
              В папке появится файл <code className="bg-slate-900/50 px-1 rounded">leads.csv</code> со списком бизнесов без сайтов.
              Откройте его в Excel или Google Sheets.
            </p>
          </div>
        </div>
      </div>

      {/* What's next */}
      <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
        <p className="text-purple-400 text-sm font-medium mb-2">
          <i className="fas fa-lightbulb mr-1"></i> Что делать дальше?
        </p>
        <ul className="text-slate-300 text-sm space-y-1">
          <li>• Откройте <code className="bg-slate-900/50 px-1 rounded">leads.csv</code> в Excel</li>
          <li>• Звоните по телефонам из списка</li>
          <li>• Предлагайте создание сайта / лендинга</li>
          <li>• Средняя цена: 15 000–50 000 ₽ за сайт</li>
          <li>• Конверсия из звонка в клиента: ~10-15%</li>
        </ul>
      </div>
    </div>
  )
}

function PythonCode() {
  const code = `#!/usr/bin/env python3
"""
Парсер Яндекс.Карт — поиск бизнесов без сайтов.
Использует Yandex Geocode API (бесплатно, 50 000 запросов/день).
"""

import requests
import csv
import time
import json
from datetime import datetime

# ==================== НАСТРОЙКИ ====================
API_KEY = 'YOUR_API_KEY'  # ← ВСТАВЬТЕ СВОЙ КЛЮЧ СЮДА
CATEGORY = 'автосервис'    # Что ищем
CITY = 'Москва'            # Где ищем
MAX_RESULTS = 50           # Макс. результатов за запрос
# ===================================================


class YandexMapsParser:
    """Парсер Яндекс.Карт для поиска лидов без сайтов."""
    
    def __init__(self, api_key):
        self.api_key = api_key
        self.session = requests.Session()
        self.results = []
    
    def search(self, query, city, results=50):
        """
        Поиск организаций через Yandex Geocode API.
        
        Документация: https://yandex.ru/dev/maps/geocoder/
        """
        search_text = f"{query} {city}"
        url = "https://geocode-maps.yandex.ru/1.x/"
        
        params = {
            'geocode': search_text,
            'format': 'json',
            'results': results,
            'apikey': self.api_key,
            'kind': 'business',
            'lang': 'ru_RU',
            'rspn': 1,
        }
        
        print(f"🔍 Ищу: '{search_text}'...")
        
        try:
            response = self.session.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            collection = data.get('response', {}).get('GeoObjectCollection', {})
            features = collection.get('featureMember', [])
            
            businesses = []
            for feature in features:
                obj = feature.get('GeoObject', {})
                meta = obj.get('metaDataProperty', {}).get('GeocoderMetaData', {})
                
                # Извлекаем данные
                name = obj.get('name', 'Без названия')
                address = meta.get('text', '')
                coords = obj.get('Point', {}).get('pos', '')
                
                # Проверяем наличие сайта в metaData
                company_meta = obj.get('metaDataProperty', {}).get('CompanyMetaData', {})
                url_field = company_meta.get('url', '')
                has_website = bool(url_field)
                
                # Телефон
                phone = ''
                phones = company_meta.get('Phones', [])
                if phones:
                    phone = phones[0].get('formatted', '')
                
                # Часы работы
                hours = ''
                working = company_meta.get('WorkingHours', [])
                if working:
                    hours = working[0].get('text', '')
                
                business = {
                    'name': name,
                    'address': address,
                    'phone': phone,
                    'has_website': has_website,
                    'website': url_field if has_website else '',
                    'hours': hours,
                    'coordinates': coords,
                    'category': query,
                    'city': city,
                }
                businesses.append(business)
            
            print(f"✅ Найдено: {len(businesses)} организаций")
            return businesses
            
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 429:
                print("⚠️ Превышен лимит запросов. Подождите минуту.")
            else:
                print(f"❌ HTTP ошибка: {e}")
        except Exception as e:
            print(f"❌ Ошибка: {e}")
        
        return []
    
    def filter_no_website(self, businesses):
        """Оставляет только бизнесы БЕЗ сайта."""
        no_site = [b for b in businesses if not b['has_website']]
        print(f"🎯 Без сайта: {len(no_site)} из {len(businesses)}")
        return no_site
    
    def search_multiple_cities(self, category, cities):
        """Поиск в нескольких городах."""
        all_results = []
        for city in cities:
            print(f"\\n{'='*50}")
            print(f"📍 Город: {city}")
            print(f"{'='*50}")
            results = self.search(category, city)
            all_results.extend(results)
            time.sleep(1)  # Задержка между запросами
        return all_results
    
    def export_csv(self, businesses, filename=None):
        """Экспорт в CSV файл."""
        if not filename:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M')
            filename = f'leads_{timestamp}.csv'
        
        if not businesses:
            print("⚠️ Нет данных для экспорта")
            return filename
        
        fieldnames = ['name', 'address', 'phone', 'has_website', 
                      'website', 'hours', 'category', 'city']
        
        with open(filename, 'w', newline='', encoding='utf-8-sig') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            for b in businesses:
                writer.writerow({k: b[k] for k in fieldnames})
        
        print(f"\\n💾 Сохранено: {filename}")
        print(f"   Записей: {len(businesses)}")
        return filename
    
    def print_results(self, businesses, limit=20):
        """Выводит результаты в консоль."""
        print(f"\\n{'='*60}")
        print(f"  БИЗНЕСЫ БЕЗ САЙТА (потенциальные клиенты)")
        print(f"{'='*60}")
        
        for i, b in enumerate(businesses[:limit], 1):
            print(f"\\n{i}. 📌 {b['name']}")
            print(f"   📍 {b['address']}")
            if b['phone']:
                print(f"   📞 {b['phone']}")
            if b['hours']:
                print(f"   🕐 {b['hours']}")
        
        if len(businesses) > limit:
            print(f"\\n   ... и ещё {len(businesses) - limit} записей")
    
    def run(self, category, city):
        """Полный цикл: поиск → фильтр → экспорт."""
        print(f"\\n{'🚀'*20}")
        print(f"  ПАРСЕР ЯНДЕКС.КАРТ")
        print(f"  Категория: {category}")
        print(f"  Город: {city}")
        print(f"{'🚀'*20}\\n")
        
        # 1. Поиск
        businesses = self.search(category, city)
        
        if not businesses:
            print("❌ Ничего не найдено. Проверьте API-ключ и запрос.")
            return []
        
        # 2. Фильтрация
        no_website = self.filter_no_website(businesses)
        
        # 3. Вывод
        self.print_results(no_website)
        
        # 4. Экспорт
        self.export_csv(no_website)
        
        self.results = no_website
        return no_website


# ==================== ЗАПУСК ====================
if __name__ == "__main__":
    # Создаём парсер
    parser = YandexMapsParser(API_KEY)
    
    # Вариант 1: Поиск в одном городе
    results = parser.run(CATEGORY, CITY)
    
    # Вариант 2: Поиск в нескольких городах (раскомментируйте)
    # cities = ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург']
    # all_results = parser.search_multiple_cities(CATEGORY, cities)
    # no_website = parser.filter_no_website(all_results)
    # parser.print_results(no_website)
    # parser.export_csv(no_website)
    
    print(f"\\n✅ Готово! Всего лидов: {len(results)}")`

  return (
    <div>
      <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <p className="text-yellow-400 text-sm font-medium mb-1">
          <i className="fas fa-exclamation-triangle mr-1"></i> Не забудьте!
        </p>
        <p className="text-slate-300 text-sm">
          Замените <code className="bg-slate-900/50 px-1 rounded text-yellow-400">YOUR_API_KEY</code> на свой ключ 
          и настройте <code className="bg-slate-900/50 px-1 rounded text-yellow-400">CATEGORY</code> и <code className="bg-slate-900/50 px-1 rounded text-yellow-400">CITY</code> под свои нужды.
        </p>
      </div>
      <CodeBlock title="parser.py" code={code} />
    </div>
  )
}

function NodeJSCode() {
  const code = `// parser.js — Парсер Яндекс.Карт на Node.js
const axios = require('axios');
const fs = require('fs');

// ==================== НАСТРОЙКИ ====================
const API_KEY = 'YOUR_API_KEY';  // ← ВСТАВЬТЕ СВОЙ КЛЮЧ
const CATEGORY = 'автосервис';
const CITY = 'Москва';
// ===================================================

async function searchBusinesses(query, city) {
  const searchText = \`\${query} \${city}\`;
  console.log(\`🔍 Ищу: "\${searchText}"...\`);
  
  try {
    const response = await axios.get('https://geocode-maps.yandex.ru/1.x/', {
      params: {
        geocode: searchText,
        format: 'json',
        results: 50,
        apikey: API_KEY,
        kind: 'business',
        lang: 'ru_RU',
      }
    });
    
    const features = response.data.response
      .GeoObjectCollection
      .featureMember || [];
    
    const businesses = features.map(f => {
      const obj = f.GeoObject;
      const meta = obj.metaDataProperty?.GeocoderMetaData;
      const company = obj.metaDataProperty?.CompanyMetaData;
      
      return {
        name: obj.name || 'Без названия',
        address: meta?.text || '',
        phone: company?.Phones?.[0]?.formatted || '',
        has_website: !!company?.url,
        website: company?.url || '',
        hours: company?.WorkingHours?.[0]?.text || '',
        coordinates: obj.Point?.pos || '',
      };
    });
    
    console.log(\`✅ Найдено: \${businesses.length} организаций\`);
    return businesses;
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    return [];
  }
}

function filterNoWebsite(businesses) {
  const filtered = businesses.filter(b => !b.has_website);
  console.log(\`🎯 Без сайта: \${filtered.length} из \${businesses.length}\`);
  return filtered;
}

function exportCSV(businesses, filename) {
  if (!filename) {
    const date = new Date().toISOString().slice(0, 10);
    filename = \`leads_\${date}.csv\`;
  }
  
  const headers = ['name', 'address', 'phone', 'has_website', 'website', 'hours'];
  const rows = businesses.map(b => headers.map(h => \`"\${b[h] || ''}"\`).join(','));
  const csv = '\\uFEFF' + [headers.join(','), ...rows].join('\\n');
  
  fs.writeFileSync(filename, csv, 'utf-8');
  console.log(\`💾 Сохранено: \${filename} (\${businesses.length} записей)\`);
}

// ==================== ЗАПУСК ====================
async function main() {
  console.log('\\n🚀 ПАРСЕР ЯНДЕКС.КАРТ\\n');
  
  const businesses = await searchBusinesses(CATEGORY, CITY);
  const noWebsite = filterNoWebsite(businesses);
  
  console.log('\\n' + '='.repeat(60));
  console.log('  БИЗНЕСЫ БЕЗ САЙТА');
  console.log('='.repeat(60));
  
  noWebsite.slice(0, 20).forEach((b, i) => {
    console.log(\`\\n\${i + 1}. 📌 \${b.name}\`);
    console.log(\`   📍 \${b.address}\`);
    if (b.phone) console.log(\`   📞 \${b.phone}\`);
  });
  
  exportCSV(noWebsite);
  console.log(\`\\n✅ Готово! Лидов: \${noWebsite.length}\`);
}

main();`

  return (
    <div>
      <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-blue-400 text-sm font-medium mb-1">
          <i className="fas fa-terminal mr-1"></i> Установка
        </p>
        <CodeBlock title="terminal" code={`mkdir yandex-parser\ncd yandex-parser\nnpm init -y\nnpm install axios`} />
      </div>
      <CodeBlock title="parser.js" code={code} />
      <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
        <p className="text-green-400 text-sm font-medium">Запуск:</p>
        <CodeBlock title="terminal" code="node parser.js" />
      </div>
    </div>
  )
}

function ManualInstructions() {
  return (
    <div className="space-y-6">
      {/* Selenium option */}
      <div className="bg-slate-700/30 rounded-xl p-5 border border-slate-600/30">
        <div className="flex items-center gap-3 mb-3">
          <i className="fas fa-robot text-purple-400 text-xl"></i>
          <h3 className="text-white font-semibold">Вариант A: Selenium (без API-ключа)</h3>
        </div>
        <p className="text-slate-300 text-sm mb-3">
          Парсит страницу Яндекс.Карт напрямую через браузер. Не нужен API-ключ, но менее стабилен.
        </p>
        <CodeBlock
          title="terminal — установка"
          code={`pip install selenium webdriver-manager`}
        />
        <CodeBlock
          title="selenium_parser.py"
          code={`from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time, csv

# Настройка браузера
options = webdriver.ChromeOptions()
options.add_argument('--headless')  # Без окна браузера
driver = webdriver.Chrome(
    service=Service(ChromeDriverManager().install()),
    options=options
)

# Открываем Яндекс.Карты
query = "автосервис Москва"
driver.get(f"https://yandex.ru/maps/?text={query}")
time.sleep(5)

# Прокручиваем список для загрузки всех результатов
sidebar = driver.find_element(By.CSS_SELECTOR, '[class*="scrollable"]')
for i in range(15):
    sidebar.send_keys(Keys.PAGE_DOWN)
    time.sleep(1.5)

# Собираем карточки организаций
cards = driver.find_elements(By.CSS_SELECTOR, '[class*="org__"]')
results = []

for card in cards:
    try:
        name = card.find_element(By.CSS_SELECTOR, '[class*="org__title"]').text
        # Проверяем наличие ссылки на сайт
        try:
            website = card.find_element(By.CSS_SELECTOR, '[class*="org__website"]')
            has_site = True
        except:
            has_site = False
        
        if not has_site:
            results.append({'name': name, 'has_website': False})
    except:
        continue

print(f"Найдено без сайта: {len(results)}")
driver.quit()

# Экспорт
with open('leads.csv', 'w', encoding='utf-8-sig', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=['name', 'has_website'])
    writer.writeheader()
    writer.writerows(results)`}
        />
      </div>

      {/* 2GIS alternative */}
      <div className="bg-slate-700/30 rounded-xl p-5 border border-slate-600/30">
        <div className="flex items-center gap-3 mb-3">
          <i className="fas fa-map-marked-alt text-green-400 text-xl"></i>
          <h3 className="text-white font-semibold">Вариант B: 2ГИС API (альтернатива)</h3>
        </div>
        <p className="text-slate-300 text-sm mb-3">
          2ГИС тоже даёт данные об организациях. Бесплатный API:{' '}
          <a href="https://dev.2gis.ru/" target="_blank" rel="noopener" className="text-blue-400 hover:underline">dev.2gis.ru</a>
        </p>
        <CodeBlock
          title="2gis_parser.py"
          code={`import requests

API_KEY = 'YOUR_2GIS_KEY'
url = "https://catalog.api.2gis.com/3.0/items"

params = {
    'q': 'автосервис',
    'city': 'Москва',
    'page': 1,
    'size': 25,
    'key': API_KEY,
    'fields': 'items.point,items.name,items.address_name,'
              'items.contact_groups,items.external_content',
}

response = requests.get(url, params=params)
data = response.json()

for item in data.get('result', {}).get('items', []):
    name = item.get('name', '')
    address = item.get('address_name', '')
    
    # Проверяем сайт в external_content
    has_site = False
    for content in item.get('external_content', []):
        if content.get('subtype') == 'website':
            has_site = True
            break
    
    if not has_site:
        print(f"🎯 {name} — {address} — БЕЗ САЙТА")`}
        />
      </div>

      {/* Google Maps */}
      <div className="bg-slate-700/30 rounded-xl p-5 border border-slate-600/30">
        <div className="flex items-center gap-3 mb-3">
          <i className="fab fa-google text-red-400 text-xl"></i>
          <h3 className="text-white font-semibold">Вариант C: Google Maps ( Places API)</h3>
        </div>
        <p className="text-slate-300 text-sm mb-3">
          Google Places API тоже работает. $200 бесплатного кредита каждый месяц.
        </p>
        <CodeBlock
          title="terminal"
          code={`pip install googlemaps`}
        />
        <CodeBlock
          title="google_parser.py"
          code={`import googlemaps

gmaps = googlemaps.Client(key='YOUR_GOOGLE_KEY')

results = gmaps.places_nearby(
    location=(55.7558, 37.6173),  # Москва
    radius=5000,
    keyword='автосервис',
    language='ru'
)

for place in results.get('results', []):
    name = place.get('name')
    website = place.get('website', '')
    
    if not website:
        print(f"🎯 {name} — БЕЗ САЙТА")`}
        />
      </div>

      {/* Best niches */}
      <div className="bg-slate-700/30 rounded-xl p-5 border border-slate-600/30">
        <div className="flex items-center gap-3 mb-3">
          <i className="fas fa-chart-line text-yellow-400 text-xl"></i>
          <h3 className="text-white font-semibold">Лучшие ниши для поиска клиентов</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {[
            { icon: '📱', text: 'Ремонт телефонов', pct: '70% без сайтов' },
            { icon: '🌸', text: 'Цветочные магазины', pct: '65% без сайтов' },
            { icon: '🔧', text: 'Автосервисы', pct: '60% без сайтов' },
            { icon: '🐾', text: 'Зоомагазины', pct: '55% без сайтов' },
            { icon: '🦷', text: 'Стоматологии', pct: '50% без сайтов' },
            { icon: '💇', text: 'Салоны красоты', pct: '45% без сайтов' },
            { icon: '🍕', text: 'Кафе', pct: '40% без сайтов' },
            { icon: '💪', text: 'Фитнес-клубы', pct: '35% без сайтов' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between bg-slate-800/50 px-3 py-2 rounded-lg">
              <span className="text-slate-300">{item.icon} {item.text}</span>
              <span className="text-green-400 text-xs">{item.pct}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Warning */}
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
        <p className="text-red-400 text-sm font-medium mb-1">
          <i className="fas fa-exclamation-circle mr-1"></i> Важно
        </p>
        <p className="text-slate-300 text-sm">
          Соблюдайте условия использования сервисов. Не делайте более 10 запросов в секунду. 
          Используйте задержки (<code className="bg-slate-900/50 px-1 rounded">time.sleep(1)</code>). 
          Официальный API — самый надёжный и легальный способ.
        </p>
      </div>
    </div>
  )
}
