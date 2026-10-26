interface FiltersProps {
  filters: {
    noWebsite: boolean
    minRating: number
    maxRating: number
    minReviews: number
    sortBy: 'rating' | 'reviews' | 'name'
  }
  setFilters: (filters: FiltersProps['filters']) => void
}

export default function Filters({ filters, setFilters }: FiltersProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center gap-2 mb-3">
        <i className="fas fa-sliders-h text-purple-400"></i>
        <span className="text-white font-medium text-sm">Фильтры и сортировка</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* No Website Toggle */}
        <div className="flex items-center gap-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filters.noWebsite}
              onChange={(e) => setFilters({ ...filters, noWebsite: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500"></div>
          </label>
          <span className="text-slate-300 text-sm">Без сайта</span>
        </div>

        {/* Min Rating */}
        <div>
          <label className="block text-xs text-slate-400 mb-1">Мин. рейтинг</label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={filters.minRating}
            onChange={(e) => setFilters({ ...filters, minRating: parseFloat(e.target.value) })}
            className="w-full accent-yellow-400"
          />
          <span className="text-xs text-slate-500">{filters.minRating}+</span>
        </div>

        {/* Max Rating */}
        <div>
          <label className="block text-xs text-slate-400 mb-1">Макс. рейтинг</label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={filters.maxRating}
            onChange={(e) => setFilters({ ...filters, maxRating: parseFloat(e.target.value) })}
            className="w-full accent-yellow-400"
          />
          <span className="text-xs text-slate-500">до {filters.maxRating}</span>
        </div>

        {/* Min Reviews */}
        <div>
          <label className="block text-xs text-slate-400 mb-1">Мин. отзывов</label>
          <input
            type="number"
            min="0"
            value={filters.minReviews}
            onChange={(e) => setFilters({ ...filters, minReviews: parseInt(e.target.value) || 0 })}
            className="w-full bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
          />
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-xs text-slate-400 mb-1">Сортировка</label>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as FiltersProps['filters']['sortBy'] })}
            className="w-full bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400/50 appearance-none cursor-pointer"
          >
            <option value="rating">По рейтингу ↑</option>
            <option value="reviews">По отзывам ↑</option>
            <option value="name">По названию</option>
          </select>
        </div>
      </div>
    </div>
  )
}
