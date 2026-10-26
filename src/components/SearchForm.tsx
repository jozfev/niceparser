import { useState } from 'react'

interface SearchFormProps {
  onSearch: (category: string, city: string) => void
  isLoading: boolean
}

const categories = [
  'Автосервис',
  'Салон красоты',
  'Ремонт телефонов',
  'Стоматология',
  'Кафе',
  'Цветочный магазин',
  'Зоомагазин',
  'Фитнес-клуб',
  'Фотостудия',
  'Юридические услуги',
]

const cities = [
  'Москва',
  'Санкт-Петербург',
  'Новосибирск',
  'Екатеринбург',
  'Казань',
  'Краснодар',
]

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [category, setCategory] = useState('')
  const [city, setCity] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (category && city) {
      onSearch(category, city)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          <i className="fas fa-tag text-yellow-400 mr-1"></i>
          Категория бизнеса
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all appearance-none cursor-pointer"
        >
          <option value="">Выберите категорию</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          <i className="fas fa-city text-blue-400 mr-1"></i>
          Город
        </label>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all appearance-none cursor-pointer"
        >
          <option value="">Выберите город</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="flex items-end">
        <button
          type="submit"
          disabled={!category || !city || isLoading}
          className="w-full sm:w-auto px-8 py-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-lg hover:from-yellow-500 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Поиск...
            </>
          ) : (
            <>
              <i className="fas fa-search"></i>
              Найти
            </>
          )}
        </button>
      </div>
    </form>
  )
}
