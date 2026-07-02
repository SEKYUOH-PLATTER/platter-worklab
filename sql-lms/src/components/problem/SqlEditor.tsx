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
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      onRun()
    }
  }

  return (
    <div className="flex flex-col gap-3.5">
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        rows={7}
        placeholder="-- AI가 생성한 SQL을 여기에 붙여넣으세요"
        className="min-h-[150px] resize-y rounded-lg border border-[#E1E3E8] bg-[#FAFAFB] px-4 py-3.5
                   font-mono text-[13px] leading-[1.7] text-[#18181B] outline-none
                   placeholder-[#B0B4BC] focus:border-[#4F46E5] focus:ring-[3px] focus:ring-[#4F46E5]/[0.12]"
      />

      <div className="flex gap-2">
        <button
          onClick={onRun}
          disabled={running || !value.trim()}
          className="flex h-[38px] items-center rounded-lg bg-[#4F46E5] px-[18px] text-[13.5px] font-semibold
                     text-white transition-colors hover:bg-[#4338CA] disabled:opacity-40"
        >
          {running ? '실행 중...' : '▶ 실행'}
        </button>
        <button
          onClick={onGrade}
          disabled={grading || !value.trim()}
          className="flex h-[38px] items-center rounded-lg border border-[#D8DAE0] bg-white px-[18px] text-[13.5px]
                     font-semibold text-[#374151] transition-colors hover:bg-[#F3F4F6] disabled:opacity-40"
        >
          {grading ? '채점 중...' : '채점'}
        </button>
      </div>
    </div>
  )
}
