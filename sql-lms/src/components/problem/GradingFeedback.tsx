import type { GradeResult } from '../../types'
import ResultTable from './ResultTable'

interface Props {
  result: GradeResult | null
}

export default function GradingFeedback({ result }: Props) {
  if (!result) return null

  if (result.error) {
    return (
      <div className="rounded-xl border border-red-800 bg-red-950/50 p-4">
        <p className="text-red-400 text-sm font-medium mb-1">오류 발생</p>
        <p className="text-red-300 text-xs font-mono">{result.error}</p>
      </div>
    )
  }

  if (result.is_correct) {
    return (
      <div className="rounded-xl border border-green-800 bg-green-950/50 p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-green-400 font-semibold text-sm">정답입니다!</p>
          <p className="text-green-600 text-xs mt-0.5">
            {result.actual_rows?.values.length ?? 0}개 행 반환
          </p>
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
    <div className="rounded-xl border border-red-800 bg-red-950/30 p-4 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-red-700 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p className="text-red-400 font-semibold text-sm">오답입니다. 결과를 비교해보세요.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ResultTable
          result={result.actual_rows}
          error={null}
          label="내 쿼리 결과"
          highlightDiff={extraKeys}
        />
        <ResultTable
          result={result.expected_rows}
          error={null}
          label="기대 결과"
          highlightDiff={missingKeys}
        />
      </div>
    </div>
  )
}
