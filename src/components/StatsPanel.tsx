interface StatsPanelProps {
  total: number
  filtered: number
  noWebsite: number
}

export default function StatsPanel({ total, filtered, noWebsite }: StatsPanelProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
          <i className="fas fa-building text-blue-400"></i>
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{total}</p>
          <p className="text-xs text-slate-400">Всего найдено</p>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
          <i className="fas fa-globe-slash text-red-400"></i>
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{noWebsite}</p>
          <p className="text-xs text-slate-400">Без сайта (потенциал)</p>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
          <i className="fas fa-filter text-green-400"></i>
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{filtered}</p>
          <p className="text-xs text-slate-400">По фильтрам</p>
        </div>
      </div>
    </div>
  )
}
