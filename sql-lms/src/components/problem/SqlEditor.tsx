import { useRef } from 'react'

interface Props {
  value: string
  onChange: (v: string) => void
  onRun: () => void
  onGrade: () => void
  running: boolean
  grading: boolean
}

export default function SqlEditor({ value, onChange, onRun, onGrade, running, grading }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null)

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Tab 키 → 2칸 공백 삽입
    if (e.key === 'Tab') {
      e.preventDefault()
      const el = e.currentTarget
      const start = el.selectionStart
      const end = el.selectionEnd
      const next = value.substring(0, start) + '  ' + value.substring(end)
      onChange(next)
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 2
      })
    }
    // Ctrl+Enter / Cmd+Enter → 실행
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      onRun()
    }
  }

  return (
    <div className="rounded-xl overflow-hidden border border-gray-700">
      {/* 에디터 헤더 */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
        <span className="text-xs text-gray-400 font-mono">SQL</span>
        <span className="text-xs text-gray-600">Ctrl+Enter로 실행</span>
      </div>

      {/* 텍스트 에디터 */}
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        className="w-full bg-gray-900 text-green-300 font-mono text-sm
                   px-4 py-4 resize-none focus:outline-none leading-relaxed
                   placeholder-gray-600 scrollbar-thin"
        rows={8}
        placeholder="-- 여기에 SQL을 작성하거나 붙여넣으세요"
      />

      {/* 버튼 영역 */}
      <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
        <button
          onClick={onRun}
          disabled={running || !value.trim()}
          className="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-40
                     text-white text-sm rounded-lg transition-colors font-medium"
        >
          {running ? '실행 중...' : '▶ 실행'}
        </button>
        <button
          onClick={onGrade}
          disabled={grading || !value.trim()}
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40
                     text-white text-sm rounded-lg transition-colors font-medium"
        >
          {grading ? '채점 중...' : '채점하기'}
        </button>
      </div>
    </div>
  )
}
