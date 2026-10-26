import { Business } from './mockData'

export function exportToCSV(businesses: Business[]) {
  const headers = ['Название', 'Категория', 'Адрес', 'Телефон', 'Рейтинг', 'Отзывы', 'Есть сайт', 'Часы работы']
  const rows = businesses.map((b) => [
    `"${b.name}"`,
    `"${b.category}"`,
    `"${b.address}"`,
    `"${b.phone}"`,
    b.rating.toString(),
    b.reviews.toString(),
    b.hasWebsite ? 'Да' : 'Нет',
    `"${b.workingHours}"`,
  ])

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `leads_${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
