import { useState } from 'react'
import type { SchemaTable } from '../../types'

interface Props {
  schema: SchemaTable[]
  selectedColumns: Set<string>
  onToggle: (tableCol: string) => void
  datasetLabel?: string
}

export default function SchemaExplorer({ schema, selectedColumns, onToggle, datasetLabel }: Props) {
  const [openTables, setOpenTables] = useState<Set<string>>(new Set(schema.map((t) => t.name)))

  function toggleTable(name: string) {
    setOpenTables((prev) => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#E7E8EC] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div className="flex items-center justify-between border-b border-[#F0F1F4] px-4 py-3.5">
        <span className="text-[13.5px] font-bold text-[#18181B]">스키마 탐색기</span>
        {datasetLabel && <span className="text-[11.5px] text-[#9CA3AF]">{datasetLabel}</span>}
      </div>

      <div className="flex flex-col py-2">
        {schema.map((table) => {
          const open = openTables.has(table.name)
          return (
            <div key={table.name} className="flex flex-col">
              <button
                onClick={() => toggleTable(table.name)}
                className="flex items-center gap-2 px-4 py-2 text-left"
              >
                <span className="flex h-4 w-4 items-center justify-center rounded bg-[#EEF2FF] text-[9px] font-extrabold text-[#4F46E5]">
                  T
                </span>
                <span className="font-mono text-[13px] font-semibold text-[#18181B]">{table.name}</span>
                <span className="text-[11px] text-[#9CA3AF]">{table.columns.length}개 컬럼</span>
                <span className={`ml-auto text-[10px] text-[#C4C8CF] transition-transform ${open ? 'rotate-90' : ''}`}>
                  ›
                </span>
              </button>

              {open && (
                <div className="flex flex-col px-2 pb-1.5">
                  {table.columns.map((col) => {
                    const key = `${table.name}.${col.name}`
                    const selected = selectedColumns.has(key)
                    return (
                      <label
                        key={col.name}
                        className="flex cursor-pointer items-center gap-2 rounded-md py-[5px] pl-8 pr-2 hover:bg-[#F7F8FA]"
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => onToggle(key)}
                          className="m-0 h-3.5 w-3.5 accent-[#4F46E5]"
                        />
                        <span className="font-mono text-[12.5px] text-[#374151]">{col.name}</span>
                        <span className="ml-auto font-mono text-[11px] text-[#B0B4BC]">{col.type}</span>
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
