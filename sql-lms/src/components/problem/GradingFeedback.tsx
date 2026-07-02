import type { GradeResult } from '../../types'
import ResultTable from './ResultTable'

interface Props {
  result: GradeResult | null
}

export default function GradingFeedback({ result }: Props) {
  if (!result) return null

  if (result.error) {
    return (
      <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4">
        <p className="mb-1 text-sm font-semibold text-[#991B1B]">오류 발생</p>
        <p className="font-mono text-xs text-[#B91C1C]">{result.error}</p>
      </div>
    )
  }

  if (result.is_correct) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-6 py-[18px]">
        <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#16A34A] text-[13px] font-bold text-white">
          ✓
        </span>
        <div className="flex flex-col gap-1">
          <span className="text-[14.5px] font-bold text-[#166534]">정답입니다!</span>
          <span className="text-[13.5px] leading-6 text-[#15803D]">
            기준 답과 결과가 모두 일치합니다 ({result.actual_rows?.values.length ?? 0}행). 다음 문제로 넘어가 보세요.
          </span>
        </div>
      </div>
    )
  }

  // 오답: 내 결과 vs 기대 결과 나란히 표시
  const actualKeys = new Set(result.actual_rows?.values.map((r) => r.join('|')) ?? [])
  const expectedKeys = new Set(result.expected_rows?.values.map((r) => r.join('|')) ?? [])
  const missingKeys = new Set([...expectedKeys].filter((k) => !actualKeys.has(k)))
  const extraKeys = new Set([...actualKeys].filter((k) => !expectedKeys.has(k)))

  return (
    <div className="flex flex-col gap-3.5 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-6 py-[18px]">
      <div className="flex items-start gap-3">
        <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#DC2626] text-[13px] font-bold text-white">
          ×
        </span>
        <div className="flex flex-col gap-1">
          <span className="text-[14.5px] font-bold text-[#991B1B]">오답입니다 — 결과를 비교해 보세요</span>
          <span className="text-[13.5px] leading-6 text-[#B91C1C]">
            내 결과와 기준 답이 다릅니다. 아래 표에서 빨간 행이 차이가 나는 부분입니다.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ResultTable result={result.actual_rows} error={null} label="내 쿼리 결과" highlightDiff={extraKeys} />
        <ResultTable result={result.expected_rows} error={null} label="기준 답" highlightDiff={missingKeys} />
      </div>
    </div>
  )
}
