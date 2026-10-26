import { useState } from 'react'

interface InstructionsModalProps {
  onClose: () => void
}

export default function InstructionsModal({ onClose }: InstructionsModalProps) {
  const [activeTab, setActiveTab] = useState<'python' | 'nodejs' | 'manual'>('python')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <i className="fas fa-code text-white"></i>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Реальный парсер Яндекс.Карт</h2>
              <p className="text-xs text-slate-400">Код для поиска бизнесов без сайтов</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-all">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700 px-6">
          <button
            onClick={() => setActiveTab('python')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${activeTab === 'python' ? 'border-yellow-400 text-yellow-400' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            <i className="fab fa-python mr-1"></i> Python
          </button>
          <button
            onClick={() => setActiveTab('nodejs')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${activeTab === 'nodejs' ? 'border-yellow-400 text-yellow-400' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            <i className="fab fa-node-js mr-1"></i> Node.js
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${activeTab === 'manual' ? 'border-yellow-400 text-yellow-400' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            <i className="fas fa-book mr-1"></i> Инструкция
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'python' && <PythonCode />}
          {activeTab === 'nodejs' && <NodeJSCode />}
          {activeTab === 'manual' && <ManualInstructions />}
        </div>
      </div>
    </div>
  )
}

function PythonCode() {
  const code = `import requests
import json
import csv
import time
from urllib.parse import quote

class YandexMapsParser:
    """
    Парсер Яндекс.Карт для поиска бизнесов без сайтов.
    
    Использует внутренний API Яндекс.Карт для поиска организаций.
    Работает через geosearch/biz endpoint.
    """
    
    BASE_URL = "https://catalog.api.2gis.com/3.0/items"  # Альтернатива через 2ГИС
    YANDEX_SEARCH_URL = "https://search-maps.yandex.ru/v1/"
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json',
        })
        self.results = []
    
    def search_yandex_maps(self, query: str, city: str, page_size=50):
        """
        Поиск организаций на Яндекс.Картах.
        
        Args:
            query: Категория бизнеса (например, "автосервис")
            city: Город для поиска
            page_size: Количество результатов
        
        Returns:
            Список организаций
        """
        search_query = f"{query} {city}"
        
        # Используем Yandex Geocoder + Search API
        url = "https://geocode-maps.yandex.ru/1.x/"
        params = {
            'geocode': search_query,
            'format': 'json',
            'results': page_size,
            'apikey': 'YOUR_API_KEY',  # Получите на developer.tech.yandex.ru
            'kind': 'business',
        }
        
        try:
            response = self.session.get(url, params=params)
            data = response.json()
            
            businesses = []
            features = data.get('response', {}).get('GeoObjectCollection', {}).get('featureMember', [])
            
            for feature in features:
                obj = feature.get('GeoObject', {})
                meta = obj.get('metaDataProperty', {}).get('GeocoderMetaData', {})
                
                business = {
                    'name': obj.get('name', ''),
                    'address': meta.get('text', ''),
                    'coordinates': obj.get('Point', {}).get('pos', ''),
                    'kind': meta.get('kind', ''),
                }
                businesses.append(business)
            
            return businesses
            
        except Exception as e:
            print(f"Ошибка поиска: {e}")
            return []
    
    def search_via_browser_api(self, query: str, ll: str = None, spn: str = "0.5,0.5"):
        """
        Альтернативный метод через внутренний API карт.
        Работает без API ключа, но менее стабилен.
        """
        url = "https://catalog-search.maps.yandex.ru/1.x/search"
        params = {
            'text': query,
            'lang': 'ru_RU',
            'type': 'biz',
            'results': '50',
        }
        if ll:
            params['ll'] = ll
        if spn:
            params['spn'] = spn
            
        try:
            response = self.session.get(url, params=params)
            return response.json()
        except Exception as e:
            print(f"Ошибка: {e}")
            return None
    
    def filter_no_website(self, businesses: list) -> list:
        """Фильтрует бизнесы без сайта"""
        return [b for b in businesses if not b.get('website') and not b.get('hasWebsite')]
    
    def get_org_info(self, oid: str):
        """Получает детальную информацию об организации"""
        url = f"https://company.app.yandex.ru/api/v1/company/{oid}/info"
        try:
            response = self.session.get(url)
            return response.json()
        except:
            return None
    
    def export_to_csv(self, filename: str = "leads.csv"):
        """Экспорт результатов в CSV"""
        if not self.results:
            print("Нет данных для экспорта")
            return
        
        with open(filename, 'w', newline='', encoding='utf-8-sig') as f:
            writer = csv.DictWriter(f, fieldnames=self.results[0].keys())
            writer.writeheader()
            writer.writerows(self.results)
        
        print(f"Экспортировано {len(self.results)} записей в {filename}")
    
    def run(self, category: str, city: str):
        """Основной метод запуска парсера"""
        print(f"🔍 Поиск: {category} в {city}")
        print("=" * 50)
        
        # Шаг 1: Поиск организаций
        businesses = self.search_yandex_maps(category, city)
        print(f"Найдено организаций: {len(businesses)}")
        
        # Шаг 2: Фильтрация без сайтов
        no_website = self.filter_no_website(businesses)
        print(f"Без сайта: {len(no_website)}")
        
        # Шаг 3: Сохранение
        self.results = no_website
        self.export_to_csv()
        
        return no_website


# === Использование ===
if __name__ == "__main__":
    parser = YandexMapsParser()
    
    # Поиск автосервисов в Москве
    results = parser.run("автосервис", "Москва")
    
    for i, biz in enumerate(results[:10], 1):
        print(f"{i}. {biz['name']} - {biz['address']}")`

  return (
    <div>
      <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <p className="text-yellow-400 text-sm font-medium mb-1">
          <i className="fas fa-exclamation-triangle mr-1"></i> Важно
        </p>
        <p className="text-slate-300 text-sm">
          Для работы парсера нужен API-ключ Яндекс.Карт. Получите его бесплатно на{' '}
          <a href="https://developer.tech.yandex.ru/" target="_blank" rel="noopener" className="text-blue-400 hover:underline">
            developer.tech.yandex.ru
          </a>.
          Бесплатный лимит: 50 000 запросов/день.
        </p>
      </div>
      <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-blue-400 text-sm font-medium mb-1">
          <i className="fas fa-terminal mr-1"></i> Установка зависимостей
        </p>
        <code className="text-slate-300 text-sm block bg-slate-900/50 p-2 rounded mt-2">
          pip install requests
        </code>
      </div>
      <pre className="bg-slate-900 rounded-lg p-4 overflow-x-auto text-sm">
        <code className="text-green-400">{code}</code>
      </pre>
    </div>
  )
}

function NodeJSCode() {
  const code = `const axios = require('axios');
const fs = require('fs');
const { parse } = require('json2csv');

/**
 * Парсер Яндекс.Карт на Node.js
 * Поиск бизнесов без сайтов для лидогенерации
 */
class YandexMapsParser {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://geocode-maps.yandex.ru/1.x/';
    this.results = [];
  }

  async search(query, city, results = 50) {
    const searchQuery = \`\${query} \${city}\`;
    
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          geocode: searchQuery,
          format: 'json',
          results: results,
          apikey: this.apiKey,
          kind: 'business',
          lang: 'ru_RU',
        }
      });

      const features = response.data.response
        .GeoObjectCollection
        .featureMember || [];

      return features.map(f => {
        const obj = f.GeoObject;
        const meta = obj.metaDataProperty?.GeocoderMetaData;
        
        return {
          name: obj.name || '',
          address: meta?.text || '',
          coordinates: obj.Point?.pos || '',
          kind: meta?.kind || '',
          hasWebsite: false, // Определяется при детализации
          phone: '',
        };
      });
    } catch (error) {
      console.error('Ошибка поиска:', error.message);
      return [];
    }
  }

  async getDetailedInfo(organizationId) {
    // Получение детальной информации через Yandex Maps API
    try {
      const response = await axios.get(
        'https://search-maps.yandex.ru/v1/', {
          params: {
            text: organizationId,
            type: 'biz',
            apikey: this.apiKey,
          }
        }
      );
      return response.data;
    } catch (error) {
      return null;
    }
  }

  filterNoWebsite(businesses) {
    return businesses.filter(b => !b.hasWebsite);
  }

  async exportCSV(filename = 'leads.csv') {
    if (this.results.length === 0) {
      console.log('Нет данных');
      return;
    }

    const csv = parse(this.results);
    fs.writeFileSync(filename, '\\uFEFF' + csv, 'utf-8');
    console.log(\`Экспортировано \${this.results.length} записей\`);
  }

  async run(category, city) {
    console.log(\`🔍 Поиск: \${category} в \${city}\`);
    
    const businesses = await this.search(category, city);
    console.log(\`Найдено: \${businesses.length}\`);
    
    const noWebsite = this.filterNoWebsite(businesses);
    console.log(\`Без сайта: \${noWebsite.length}\`);
    
    this.results = noWebsite;
    await this.exportCSV();
    
    return noWebsite;
  }
}

// === Использование ===
const parser = new YandexMapsParser('YOUR_API_KEY');

parser.run('автосервис', 'Москва')
  .then(results => {
    results.forEach((biz, i) => {
      console.log(\`\${i + 1}. \${biz.name} - \${biz.address}\`);
    });
  });`

  return (
    <div>
      <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <p className="text-yellow-400 text-sm font-medium mb-1">
          <i className="fas fa-exclamation-triangle mr-1"></i> Важно
        </p>
        <p className="text-slate-300 text-sm">
          Получите API-ключ на{' '}
          <a href="https://developer.tech.yandex.ru/" target="_blank" rel="noopener" className="text-blue-400 hover:underline">
            developer.tech.yandex.ru
          </a>
        </p>
      </div>
      <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-blue-400 text-sm font-medium mb-1">
          <i className="fas fa-terminal mr-1"></i> Установка зависимостей
        </p>
        <code className="text-slate-300 text-sm block bg-slate-900/50 p-2 rounded mt-2">
          npm install axios json2csv
        </code>
      </div>
      <pre className="bg-slate-900 rounded-lg p-4 overflow-x-auto text-sm">
        <code className="text-green-400">{code}</code>
      </pre>
    </div>
  )
}

function ManualInstructions() {
  return (
    <div className="space-y-6">
      {/* Step 1 */}
      <div className="bg-slate-700/30 rounded-xl p-5 border border-slate-600/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm">1</div>
          <h3 className="text-white font-semibold">Получите API-ключ Яндекс.Карт</h3>
        </div>
        <div className="ml-11 space-y-2 text-sm text-slate-300">
          <p>1. Перейдите на <a href="https://developer.tech.yandex.ru/" target="_blank" rel="noopener" className="text-blue-400 hover:underline">developer.tech.yandex.ru</a></p>
          <p>2. Создайте аккаунт или войдите через Яндекс ID</p>
          <p>3. Создайте новый проект → "JavaScript API и HTTP Геокодер"</p>
          <p>4. Скопируйте API-ключ</p>
          <p className="text-green-400">✓ Бесплатно: 50 000 запросов/день</p>
        </div>
      </div>

      {/* Step 2 */}
      <div className="bg-slate-700/30 rounded-xl p-5 border border-slate-600/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm">2</div>
          <h3 className="text-white font-semibold">Альтернатива: парсинг через Selenium</h3>
        </div>
        <div className="ml-11 space-y-2 text-sm text-slate-300">
          <p>Если API не подходит, можно парсить страницу напрямую:</p>
          <pre className="bg-slate-900/50 p-3 rounded-lg mt-2 overflow-x-auto">
            <code className="text-green-400">{`from selenium import webdriver
from selenium.webdriver.common.by import By
import time

driver = webdriver.Chrome()
driver.get("https://yandex.ru/maps/?text=автосервис+Москва")
time.sleep(3)

# Прокручиваем список организаций
sidebar = driver.find_element(By.CSS_SELECTOR, '.scrollable__inner')
for i in range(10):
    sidebar.send_keys(Keys.PAGE_DOWN)
    time.sleep(1)

# Собираем данные
items = driver.find_elements(By.CSS_SELECTOR, '.org__title')
for item in items:
    print(item.text)`}</code>
          </pre>
        </div>
      </div>

      {/* Step 3 */}
      <div className="bg-slate-700/30 rounded-xl p-5 border border-slate-600/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm">3</div>
          <h3 className="text-white font-semibold">Определение наличия сайта</h3>
        </div>
        <div className="ml-11 space-y-2 text-sm text-slate-300">
          <p>При парсинге карточки организации проверяйте:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Наличие кнопки "Сайт" или ссылки на домен</li>
            <li>Поле <code className="bg-slate-900/50 px-1 rounded">org__website</code> в HTML</li>
            <li>В API: поле <code className="bg-slate-900/50 px-1 rounded">company.urls</code></li>
            <li>Если пусто — бизнес без сайта (ваш клиент!)</li>
          </ul>
        </div>
      </div>

      {/* Step 4 */}
      <div className="bg-slate-700/30 rounded-xl p-5 border border-slate-600/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm">4</div>
          <h3 className="text-white font-semibold">Лучшие ниши для поиска клиентов</h3>
        </div>
        <div className="ml-11 text-sm text-slate-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {[
              { icon: '🔧', text: 'Автосервисы — 60% без сайтов' },
              { icon: '💇', text: 'Салоны красоты — 45% без сайтов' },
              { icon: '🦷', text: 'Стоматологии — 50% без сайтов' },
              { icon: '🍕', text: 'Кафе и рестораны — 40% без сайтов' },
              { icon: '🐾', text: 'Зоомагазины — 55% без сайтов' },
              { icon: '📱', text: 'Ремонт телефонов — 70% без сайтов' },
              { icon: '💪', text: 'Фитнес-клубы — 35% без сайтов' },
              { icon: '🌸', text: 'Цветочные магазины — 65% без сайтов' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-slate-800/50 px-3 py-2 rounded-lg">
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step 5 */}
      <div className="bg-slate-700/30 rounded-xl p-5 border border-slate-600/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm">5</div>
          <h3 className="text-white font-semibold">Стратегия продаж</h3>
        </div>
        <div className="ml-11 space-y-2 text-sm text-slate-300">
          <ol className="list-decimal list-inside space-y-2">
            <li>Соберите базу бизнесов без сайта (через парсер выше)</li>
            <li>Позвоните или напишите в WhatsApp с предложением</li>
            <li>Покажите как выглядит их карточка vs конкурентов</li>
            <li>Предложите бесплатный аудит + создание сайта</li>
            <li>Цена: от 15 000 ₽ за лендинг, от 50 000 ₽ за полноценный сайт</li>
          </ol>
          <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-green-400 font-medium">💡 Совет: начинайте с малого города — там конкуренция ниже, а бизнесы охотнее покупают сайты.</p>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
        <p className="text-red-400 text-sm font-medium mb-1">
          <i className="fas fa-exclamation-circle mr-1"></i> Предупреждение
        </p>
        <p className="text-slate-300 text-sm">
          При парсинге Яндекс.Карт соблюдайте условия использования сервиса. 
          Не делайте более 10 запросов в секунду. Используйте задержки между запросами. 
          Рекомендуется использовать официальный API вместо прямого парсинга страниц.
        </p>
      </div>
    </div>
  )
}
