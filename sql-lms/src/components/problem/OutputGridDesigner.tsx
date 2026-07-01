import { useCallback } from 'react'
import type { OutputColumn } from '../../types'

interface Props {
  columns: OutputColumn[]
  onChange: (columns: OutputColumn[]) => void
  sortOrder: string
  onSortOrderChange: (v: string) => void
  expectedRows: string
  onExpectedRowsChange: (v: string) => void
}

export default function OutputGridDesigner({
  columns, onChange, sortOrder, onSortOrderChange, expectedRows, onExpectedRowsChange
}: Props) {
  const addColumn = useCallback(() => {
    onChange([...columns, { id: crypto.randomUUID(), name: '', sampleValue: '' }])
  }, [columns, onChange])

  const removeColumn = useCallback((id: string) => {
    onChange(columns.filter((c) => c.id !== id))
  }, [columns, onChange])

  const updateColumn = useCallback((id: string, field: keyof OutputColumn, value: string) => {
    onChange(columns.map((c) => c.id === id ? { ...c, [field]: value } : c))
  }, [columns, onChange])

  return (
    <div className="space-y-3">
      {/* 표 */}
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            {/* 헤더 행: 컬럼명 입력 */}
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {columns.map((col) => (
                  <th key={col.id} className="p-0 border-r border-gray-200 last:border-r-0">
                    <div className="flex items-center">
                      <input
                        value={col.name}
                        onChange={(e) => updateColumn(col.id, 'name', e.target.value)}
                        placeholder="컬럼명"
                        className="w-full px-2 py-2 bg-transparent font-mono font-medium
                                   text-gray-700 placeholder-gray-300 focus:outline-none
                                   focus:bg-blue-50 min-w-[80px]"
                      />
                      <button
                        onClick={() => removeColumn(col.id)}
                        className="px-1.5 text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                      >
                        ×
                      </button>
                    </div>
                  </th>
                ))}
                <th className="p-1">
                  <button
                    onClick={addColumn}
                    className="px-2 py-1 text-blue-500 hover:text-blue-600 font-medium
                               hover:bg-blue-50 rounded transition-colors whitespace-nowrap"
                  >
                    + 컬럼 추가
                  </button>
                </th>
              </tr>
            </thead>

            {/* 샘플 행 */}
            <tbody>
              <tr className="bg-white">
                {columns.map((col) => (
                  <td key={col.id} className="p-0 border-r border-gray-100 last:border-r-0">
                    <input
                      value={col.sampleValue}
                      onChange={(e) => updateColumn(col.id, 'sampleValue', e.target.value)}
                      placeholder="예시 값"
                      className="w-full px-2 py-2 bg-transparent font-mono text-gray-500
                                 placeholder-gray-200 focus:outline-none focus:bg-yellow-50 min-w-[80px]"
                    />
                  </td>
                ))}
                <td />
              </tr>
            </tbody>
          </table>
        </div>

        {columns.length === 0 && (
          <div className="py-6 text-center">
            <button
              onClick={addColumn}
              className="text-sm text-blue-500 hover:text-blue-600 font-medium"
            >
              + 첫 번째 컬럼 추가
            </button>
          </div>
        )}
      </div>

      {/* 정렬 기준 + 예상 행 수 */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">정렬 기준</label>
          <input
            value={sortOrder}
            onChange={(e) => onSortOrderChange(e.target.value)}
            placeholder="예: 월 오름차순, user_id DESC"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs
                       text-gray-700 placeholder-gray-300 focus:outline-none focus:border-blue-400"
          />
        </div>
        <div className="w-28">
          <label className="block text-xs text-gray-500 mb-1">예상 행 수</label>
          <input
            value={expectedRows}
            onChange={(e) => onExpectedRowsChange(e.target.value)}
            placeholder="예: 24"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs
                       text-gray-700 placeholder-gray-300 focus:outline-none focus:border-blue-400"
          />
        </div>
      </div>
    </div>
  )
}
