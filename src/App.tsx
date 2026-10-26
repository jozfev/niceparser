import { useState, useCallback } from 'react'
import SearchForm from './components/SearchForm'
import ResultsTable from './components/ResultsTable'
import Filters from './components/Filters'
import StatsPanel from './components/StatsPanel'
import InstructionsModal from './components/InstructionsModal'
import ExportButton from './components/ExportButton'
import { generateBusinesses, Business } from './utils/mockData'
import { exportToCSV } from './utils/export'

function App() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [filters, setFilters] = useState({
    noWebsite: true,
    minRating: 0,
    maxRating: 5,
    minReviews: 0,
    sortBy: 'rating' as 'rating' | 'reviews' | 'name',
  })
  const [showInstructions, setShowInstructions] = useState(false)

  const handleSearch = useCallback((category: string, city: string) => {
    setIsLoading(true)
    setHasSearched(true)
    
    // Simulate API call delay
    setTimeout(() => {
      const results = generateBusinesses(category, city)
      setBusinesses(results)
      setIsLoading(false)
    }, 1500)
  }, [])

  const filteredBusinesses = businesses.filter((b) => {
    if (filters.noWebsite && b.hasWebsite) return false
    if (b.rating < filters.minRating) return false
    if (b.rating > filters.maxRating) return false
    if (b.reviews < filters.minReviews) return false
    return true
  }).sort((a, b) => {
    if (filters.sortBy === 'rating') return a.rating - b.rating
    if (filters.sortBy === 'reviews') return a.reviews - b.reviews
    return a.name.localeCompare(b.name)
  })

  const handleExport = () => {
    exportToCSV(filteredBusinesses)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 backdrop-blur-sm bg-slate-900/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                <i className="fas fa-map-marker-alt text-white text-lg"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">LeadFinder</h1>
                <p className="text-xs text-slate-400">Поиск клиентов на Яндекс.Картах</p>
              </div>
            </div>
            <button
              onClick={() => setShowInstructions(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all text-sm"
            >
              <i className="fas fa-code"></i>
              <span className="hidden sm:inline">Инструкция парсера</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <i className="fas fa-search text-yellow-400"></i>
              <h2 className="text-lg font-semibold text-white">Параметры поиска</h2>
            </div>
            <SearchForm onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </div>

        {/* Stats */}
        {hasSearched && !isLoading && (
          <StatsPanel 
            total={businesses.length} 
            filtered={filteredBusinesses.length}
            noWebsite={businesses.filter(b => !b.hasWebsite).length}
          />
        )}

        {/* Filters */}
        {hasSearched && !isLoading && businesses.length > 0 && (
          <div className="mb-6">
            <Filters filters={filters} setFilters={setFilters} />
          </div>
        )}

        {/* Results */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-slate-700 border-t-yellow-400 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fas fa-map-marker-alt text-yellow-400 text-lg"></i>
              </div>
            </div>
            <p className="mt-4 text-slate-400">Ищем бизнесы на Яндекс.Картах...</p>
            <p className="text-sm text-slate-500 mt-1">Анализируем наличие сайтов и контакты</p>
          </div>
        )}

        {!isLoading && hasSearched && filteredBusinesses.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-4 border-b border-slate-700/50 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <i className="fas fa-building text-blue-400"></i>
                <span className="text-white font-medium">
                  Найдено: {filteredBusinesses.length} бизнесов
                </span>
              </div>
              <ExportButton onExport={handleExport} count={filteredBusinesses.length} />
            </div>
            <ResultsTable businesses={filteredBusinesses} />
          </div>
        )}

        {!isLoading && hasSearched && filteredBusinesses.length === 0 && businesses.length > 0 && (
          <div className="text-center py-16">
            <i className="fas fa-filter text-4xl text-slate-600 mb-4"></i>
            <p className="text-slate-400 text-lg">Нет результатов по текущим фильтрам</p>
            <p className="text-slate-500 text-sm mt-1">Попробуйте изменить параметры фильтрации</p>
          </div>
        )}

        {!hasSearched && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-slate-800/50 rounded-full flex items-center justify-center border border-slate-700/50">
              <i className="fas fa-crosshairs text-4xl text-yellow-400/70"></i>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Начните поиск</h3>
            <p className="text-slate-400 max-w-md mx-auto">
              Выберите категорию бизнеса и город для поиска потенциальных клиентов 
              без сайтов на Яндекс.Картах
            </p>
            
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
                <i className="fas fa-search text-2xl text-yellow-400 mb-2"></i>
                <h4 className="text-white font-medium text-sm">1. Выберите нишу</h4>
                <p className="text-slate-500 text-xs mt-1">Укажите категорию бизнеса</p>
              </div>
              <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
                <i className="fas fa-map text-2xl text-blue-400 mb-2"></i>
                <h4 className="text-white font-medium text-sm">2. Укажите город</h4>
                <p className="text-slate-500 text-xs mt-1">Выберите целевой регион</p>
              </div>
              <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
                <i className="fas fa-download text-2xl text-green-400 mb-2"></i>
                <h4 className="text-white font-medium text-sm">3. Экспорт контактов</h4>
                <p className="text-slate-500 text-xs mt-1">Скачайте CSV с данными</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              LeadFinder — инструмент для поиска клиентов
            </p>
            <div className="flex items-center gap-4 text-slate-500 text-sm">
              <span className="flex items-center gap-1">
                <i className="fas fa-shield-alt text-green-400"></i>
                Данные обновлены
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Instructions Modal */}
      {showInstructions && (
        <InstructionsModal onClose={() => setShowInstructions(false)} />
      )}
    </div>
  )
}

export default App
