import { Business } from '../utils/mockData'

interface ResultsTableProps {
  businesses: Business[]
}

export default function ResultsTable({ businesses }: ResultsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-700/30 text-slate-300">
            <th className="px-4 py-3 text-left font-medium">#</th>
            <th className="px-4 py-3 text-left font-medium">Название</th>
            <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Адрес</th>
            <th className="px-4 py-3 text-left font-medium">Телефон</th>
            <th className="px-4 py-3 text-center font-medium">Рейтинг</th>
            <th className="px-4 py-3 text-center font-medium hidden sm:table-cell">Отзывы</th>
            <th className="px-4 py-3 text-center font-medium">Сайт</th>
            <th className="px-4 py-3 text-center font-medium">Я.Карты</th>
            <th className="px-4 py-3 text-center font-medium hidden lg:table-cell">Часы работы</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/30">
          {businesses.map((b, idx) => (
            <tr key={b.id} className="hover:bg-slate-700/20 transition-colors">
              <td className="px-4 py-3 text-slate-500">{idx + 1}</td>
              <td className="px-4 py-3">
                <div className="font-medium text-white">{b.name}</div>
                <div className="text-xs text-slate-500 md:hidden">{b.address}</div>
              </td>
              <td className="px-4 py-3 text-slate-400 hidden md:table-cell max-w-[200px] truncate">
                {b.address}
              </td>
              <td className="px-4 py-3">
                <a href={`tel:${b.phone}`} className="text-blue-400 hover:text-blue-300 transition-colors">
                  {b.phone}
                </a>
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-1">
                  <i className="fas fa-star text-yellow-400 text-xs"></i>
                  <span className="text-white font-medium">{b.rating}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-center text-slate-400 hidden sm:table-cell">
                {b.reviews}
              </td>
              <td className="px-4 py-3 text-center">
                {b.hasWebsite ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/10 text-green-400 rounded-full text-xs">
                    <i className="fas fa-check"></i> Есть
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/10 text-red-400 rounded-full text-xs">
                    <i className="fas fa-times"></i> Нет
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-center">
                <a
                  href={b.yandexUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-8 h-8 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 rounded-lg transition-all group"
                  title="Открыть на Яндекс.Картах"
                >
                  <i className="fas fa-map-marked-alt group-hover:scale-110 transition-transform"></i>
                </a>
              </td>
              <td className="px-4 py-3 text-center text-slate-500 text-xs hidden lg:table-cell">
                {b.workingHours}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
