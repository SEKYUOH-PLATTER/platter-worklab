import { useState } from 'react'
import type { SchemaTable } from '../../types'

interface Props {
  schema: SchemaTable[]
  selectedColumns: Set<string>
  onToggle: (tableCol: string) => void
}

export default function SchemaExplorer({ schema, selectedColumns, onToggle }: Props) {
  const [openTables, setOpenTables] = useState<Set<string>>(
    new Set(schema.map((t) => t.name))
  )

  function toggleTable(name: string) {
    setOpenTables((prev) => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-thin bg-gray-900 rounded-xl border border-gray-700">
      <div className="px-3 py-2.5 border-b border-gray-700">
        <p className="text-xs font-medium text-gray-300">스키마 탐색기</p>
      </div>

      <div className="p-2 space-y-1">
        {schema.map((table) => (
          <div key={table.name}>
            <button
              onClick={() => toggleTable(table.name)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg
                         hover:bg-gray-800 transition-colors text-left"
            >
              <svg
                className={`w-3 h-3 text-gray-500 transition-transform flex-shrink-0 ${
                  openTables.has(table.name) ? 'rotate-90' : ''
                }`}
                fill="currentColor" viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
              </svg>
              <svg className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 10h18M3 6h18M3 14h18M3 18h18" />
              </svg>
              <span className="text-xs font-mono text-gray-200 font-medium">{table.name}</span>
            </button>

            {openTables.has(table.name) && (
              <div className="ml-3 mt-0.5 space-y-0.5">
                {table.columns.map((col) => {
                  const key = `${table.name}.${col.name}`
                  const selected = selectedColumns.has(key)
                  return (
                    <button
                      key={col.name}
                      onClick={() => onToggle(key)}
                      className={`w-full flex items-center gap-2 px-2 py-1 rounded-md text-left
                                  transition-colors ${selected ? 'bg-blue-900/50' : 'hover:bg-gray-800'}`}
                    >
                      <div className={`w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center ${
                        selected ? 'bg-blue-500 border-blue-500' : 'border-gray-600'
                      }`}>
                        {selected && (
                          <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-xs font-mono ${selected ? 'text-blue-300' : 'text-gray-400'}`}>
                        {col.name}
                      </span>
                      <span className="text-xs text-gray-600 ml-auto flex-shrink-0">{col.type}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
