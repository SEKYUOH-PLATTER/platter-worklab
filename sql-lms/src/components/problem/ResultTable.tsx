import type { QueryResult } from '../../types'

interface Props {
  result: QueryResult | null
  error: string | null
  label?: string
  highlightDiff?: Set<string>
}

export default function ResultTable({ result, error, label, highlightDiff }: Props) {
  if (error) {
    return (
      <div className="rounded-lg bg-red-950 border border-red-800 px-4 py-3">
        <p className="text-red-300 text-xs font-mono whitespace-pre-wrap">{error}</p>
      </div>
    )
  }

  if (!result) return null

  if (result.values.length === 0 && result.columns.length === 0) {
    return (
      <div className="rounded-lg bg-gray-800 border border-gray-700 px-4 py-3">
        <p className="text-gray-400 text-xs">결과 없음 (0 rows)</p>
      </div>
    )
  }

  return (
    <div>
      {label && (
        <p className="text-xs text-gray-400 mb-1.5 font-medium">{label}</p>
      )}
      <div className="rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto max-h-72 overflow-y-auto scrollbar-thin">
          <table className="w-full text-xs font-mono">
            <thead className="bg-gray-800 sticky top-0">
              <tr>
                {result.columns.map((col) => (
                  <th key={col} className="px-3 py-2 text-left text-gray-300 font-medium border-b border-gray-700 whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {result.values.map((row, i) => {
                const rowKey = row.join('|')
                const isDiff = highlightDiff?.has(rowKey)
                return (
                  <tr key={i} className={isDiff ? 'bg-red-950' : 'hover:bg-gray-800/50'}>
                    {row.map((cell, j) => (
                      <td key={j} className="px-3 py-1.5 text-gray-300 whitespace-nowrap">
                        {cell === null ? <span className="text-gray-600 italic">NULL</span> : String(cell)}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-800 px-3 py-1.5 border-t border-gray-700">
          <span className="text-xs text-gray-500">{result.values.length} rows</span>
        </div>
      </div>
    </div>
  )
}
