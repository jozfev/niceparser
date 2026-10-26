interface ExportButtonProps {
  onExport: () => void
  count: number
}

export default function ExportButton({ onExport, count }: ExportButtonProps) {
  return (
    <button
      onClick={onExport}
      className="flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300 rounded-lg transition-all text-sm border border-green-500/20"
    >
      <i className="fas fa-file-csv"></i>
      <span>Экспорт CSV ({count})</span>
    </button>
  )
}
