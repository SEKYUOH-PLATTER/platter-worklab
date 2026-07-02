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
      <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3">
        <p className="whitespace-pre-wrap font-mono text-xs text-[#B91C1C]">{error}</p>
      </div>
    )
  }

  if (!result) return null

  if (result.values.length === 0 && result.columns.length === 0) {
    return (
      <div className="rounded-lg border border-[#E7E8EC] bg-white px-4 py-3">
        <p className="text-xs text-[#9CA3AF]">결과 없음 (0 rows)</p>
      </div>
    )
  }

  return (
    <div>
      {label && <p className="mb-1.5 text-xs font-medium text-[#6B7280]">{label}</p>}
      <div className="overflow-hidden rounded-lg border border-[#E7E8EC]">
        <div className="scrollbar-thin max-h-72 overflow-auto">
          <table className="w-full font-mono text-xs">
            <thead className="sticky top-0 bg-[#F9FAFB]">
              <tr>
                {result.columns.map((col) => (
                  <th
                    key={col}
                    className="whitespace-nowrap border-b border-[#F0F1F4] px-3 py-2 text-left font-semibold text-[#6B7280]"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F7F8FA] bg-white">
              {result.values.map((row, i) => {
                const rowKey = row.join('|')
                const isDiff = highlightDiff?.has(rowKey)
                return (
                  <tr key={i} className={isDiff ? 'bg-[#FEF2F2]' : 'hover:bg-[#FAFAFB]'}>
                    {row.map((cell, j) => (
                      <td key={j} className="whitespace-nowrap px-3 py-1.5 text-[#374151]">
                        {cell === null ? <span className="italic text-[#C4C8CF]">NULL</span> : String(cell)}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="border-t border-[#F0F1F4] bg-[#F9FAFB] px-3 py-1.5">
          <span className="text-xs text-[#9CA3AF]">{result.values.length} rows</span>
        </div>
      </div>
    </div>
  )
}
