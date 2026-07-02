import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { createDatabase, runQuery, getSchema, closeDatabase } from '../lib/sqljs'
import type { Database } from 'sql.js'
import type { Problem as ProblemType, QueryResult, GradeResult, SchemaTable, OutputColumn } from '../types'
import Navbar from '../components/Navbar'
import SqlEditor from '../components/problem/SqlEditor'
import ResultTable from '../components/problem/ResultTable'
import GradingFeedback from '../components/problem/GradingFeedback'
import SchemaExplorer from '../components/problem/SchemaExplorer'
import OutputGridDesigner from '../components/problem/OutputGridDesigner'
import PromptCopyButton from '../components/problem/PromptCopyButton'

type ProblemMode = 'workflow' | 'direct'

const DIFF: Record<string, { label: string; color: string; bg: string }> = {
  easy: { label: 'Easy', color: '#15803D', bg: '#ECFDF5' },
  medium: { label: 'Medium', color: '#B45309', bg: '#FFFBEB' },
  hard: { label: 'Hard', color: '#B91C1C', bg: '#FEF2F2' },
}

const DOMAIN_LABEL: Record<string, string> = {
  ecommerce: '이커머스', saas: 'SaaS', fintech: '핀테크', logistics: '물류',
  media: '미디어', hr: 'HR', community: '커뮤니티',
}

function StepHeader({ n, title, hint }: { n: number; title: string; hint?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#4F46E5] text-xs font-bold text-white">
        {n}
      </span>
      <span className="text-[15px] font-bold text-[#18181B]">{title}</span>
      {hint && <span className="text-[12.5px] text-[#9CA3AF]">{hint}</span>}
    </div>
  )
}

const CARD = 'rounded-xl border border-[#E7E8EC] bg-white px-6 py-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]'

export default function Problem() {
  const { id } = useParams<{ id: string }>()
  const [problem, setProblem] = useState<ProblemType | null>(null)
  const [loading, setLoading] = useState(true)
  const dbRef = useRef<Database | null>(null)

  const [sql, setSql] = useState('')
  const [runResult, setRunResult] = useState<QueryResult | null>(null)
  const [runError, setRunError] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const [grading, setGrading] = useState(false)
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null)
  const [mode, setMode] = useState<ProblemMode>('workflow')

  const [schema, setSchema] = useState<SchemaTable[]>([])
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(new Set())
  const [outputColumns, setOutputColumns] = useState<OutputColumn[]>([])
  const [sortOrder, setSortOrder] = useState('')
  const [expectedRows, setExpectedRows] = useState('')

  useEffect(() => {
    async function load() {
      if (!id) return
      const { data } = await supabase
        .from('problems')
        .select('*, dataset:datasets(*), chapter:chapters(*)')
        .eq('id', id)
        .single()

      if (!data) { setLoading(false); return }
      setProblem(data as ProblemType)
      if (data.track === 'syntax') setMode('direct')

      try {
        const dataset = (data as ProblemType).dataset
        if (dataset) {
          const db = await createDatabase(dataset.setup_sql, data.extra_setup_sql)
          dbRef.current = db
          setSchema(getSchema(db))
        }
      } catch (e) {
        console.error('DB 초기화 실패:', e)
      }
      setLoading(false)
    }
    load()
    return () => {
      if (dbRef.current) closeDatabase(dbRef.current)
    }
  }, [id])

  const handleRun = useCallback(() => {
    if (!dbRef.current || !sql.trim()) return
    setRunning(true)
    setRunError(null)
    setRunResult(null)
    setGradeResult(null)
    try {
      const result = runQuery(dbRef.current, sql)
      setRunResult(result)
    } catch (e) {
      setRunError(e instanceof Error ? e.message : String(e))
    } finally {
      setRunning(false)
    }
  }, [sql])

  const handleGrade = useCallback(async () => {
    if (!id || !sql.trim()) return
    setGrading(true)
    setGradeResult(null)
    const { data, error } = await supabase.functions.invoke('grade_submission', {
      body: { problem_id: id, submitted_sql: sql },
    })
    if (error) {
      setGradeResult({ is_correct: false, actual_rows: null, expected_rows: null, error: error.message })
    } else {
      setGradeResult(data as GradeResult)
    }
    setGrading(false)
  }, [id, sql])

  function toggleColumn(key: string) {
    setSelectedColumns((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F8FA]">
        <p className="text-sm text-[#9CA3AF]">로딩 중...</p>
      </div>
    )
  }

  if (!problem) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F8FA]">
        <p className="text-sm text-[#9CA3AF]">문제를 찾을 수 없습니다.</p>
      </div>
    )
  }

  const diff = DIFF[problem.difficulty] ?? DIFF.easy
  const domainLabel = problem.domain ? DOMAIN_LABEL[problem.domain] ?? problem.domain : null
  const isWorkflow = problem.track === 'case' && mode === 'workflow'

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#18181B]">
      <Navbar />

      {/* 문제 헤더 */}
      <header className="sticky top-14 z-[9] flex flex-col gap-2 border-b border-[#E7E8EC] bg-white px-6 py-3.5">
        <div className="flex items-center gap-1.5 text-[12.5px] text-[#9CA3AF]">
          <Link to="/learn" className="text-[#6B7280] hover:text-[#4F46E5]">문제 목록</Link>
          <span>/</span>
          <span>{problem.track === 'syntax' ? '문법 실습' : '실전 케이스'}</span>
          {domainLabel && (<><span>/</span><span className="text-[#4B5563]">{domainLabel}</span></>)}
        </div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-[19px] font-bold tracking-[-0.01em]">{problem.title}</h1>
          <span
            className="rounded-md px-[9px] py-[3px] text-xs font-semibold"
            style={{ color: diff.color, background: diff.bg }}
          >
            {diff.label}
          </span>
          {problem.track === 'case' && (
            <div className="ml-auto flex gap-1">
              {(['workflow', 'direct'] as ProblemMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                    mode === m ? 'bg-[#EEF2FF] text-[#4338CA]' : 'text-[#6B7280] hover:bg-[#F3F4F6]'
                  }`}
                >
                  {m === 'workflow' ? 'AI 워크플로우' : '직접 작성'}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <div
        className="mx-auto grid max-w-[1240px] items-start gap-5 px-6 pb-12 pt-5"
        style={{ gridTemplateColumns: isWorkflow ? '300px 1fr' : '1fr' }}
      >
        {/* 좌측: 스키마 탐색기 */}
        {isWorkflow && (
          <div className="sticky top-[112px]">
            <SchemaExplorer
              schema={schema}
              selectedColumns={selectedColumns}
              onToggle={toggleColumn}
              datasetLabel={problem.dataset?.title}
            />
          </div>
        )}

        {/* 우측: 메인 */}
        <main className="flex min-w-0 flex-col gap-4">
          {/* 문제 설명 */}
          <div className={`${CARD} flex flex-col gap-2.5`}>
            <span className="text-xs font-bold tracking-[0.06em] text-[#9CA3AF]">문제</span>
            <p className="whitespace-pre-wrap text-[14.5px] leading-[1.65] text-[#374151]">
              {problem.description}
            </p>
            {problem.tags && problem.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {problem.tags.map((t) => (
                  <span key={t} className="rounded-md bg-[#F3F4F6] px-2 py-[3px] text-xs text-[#4B5563]">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Track B — AI 워크플로우 */}
          {isWorkflow ? (
            <>
              <div className={`${CARD} flex flex-col gap-3`}>
                <StepHeader n={1} title="필요한 컬럼 선택" />
                {selectedColumns.size === 0 ? (
                  <p className="text-[13.5px] text-[#9CA3AF]">← 왼쪽 스키마 탐색기에서 필요한 컬럼을 체크하세요.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {[...selectedColumns].map((col) => (
                      <span
                        key={col}
                        className="rounded-md border border-[#E0E7FF] bg-[#EEF2FF] px-[9px] py-1 font-mono text-[12.5px] font-medium text-[#4338CA]"
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className={`${CARD} flex flex-col gap-3.5`}>
                <StepHeader n={2} title="받을 표 그리기" hint="원하는 결과 표의 컬럼명을 직접 적어 보세요" />
                <OutputGridDesigner
                  columns={outputColumns}
                  onChange={setOutputColumns}
                  sortOrder={sortOrder}
                  onSortOrderChange={setSortOrder}
                  expectedRows={expectedRows}
                  onExpectedRowsChange={setExpectedRows}
                />
              </div>

              <div className={`${CARD} flex flex-col gap-3.5`}>
                <StepHeader n={3} title="AI에게 쿼리 요청" hint="프롬프트를 복사해 사용하는 AI에게 붙여넣으세요" />
                <PromptCopyButton
                  problemDescription={problem.description ?? ''}
                  schema={schema}
                  selectedColumns={selectedColumns}
                  outputColumns={outputColumns}
                  sortOrder={sortOrder}
                  expectedRows={expectedRows}
                />
              </div>

              <div className={`${CARD} flex flex-col gap-3.5`}>
                <StepHeader n={4} title="쿼리 붙여넣고 실행" />
                <SqlEditor
                  value={sql}
                  onChange={setSql}
                  onRun={handleRun}
                  onGrade={handleGrade}
                  running={running}
                  grading={grading}
                />
              </div>
            </>
          ) : (
            <>
              {problem.track === 'case' && schema.length > 0 && (
                <div className={`${CARD} flex flex-col gap-3`}>
                  <span className="text-xs font-bold tracking-[0.06em] text-[#9CA3AF]">사용 가능한 테이블</span>
                  <div className="flex flex-col gap-2">
                    {schema.map((table) => (
                      <div key={table.name}>
                        <p className="mb-1 font-mono text-[13px] font-semibold text-[#4338CA]">{table.name}</p>
                        <p className="pl-2 font-mono text-xs text-[#9CA3AF]">
                          {table.columns.map((c) => `${c.name} (${c.type})`).join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className={`${CARD} flex flex-col gap-3.5`}>
                <SqlEditor
                  value={sql}
                  onChange={setSql}
                  onRun={handleRun}
                  onGrade={handleGrade}
                  running={running}
                  grading={grading}
                />
              </div>
            </>
          )}

          {/* 실행 결과 */}
          {(runResult || runError) && (
            <div className={`${CARD} flex flex-col gap-3`}>
              <span className="text-[13.5px] font-bold text-[#18181B]">실행 결과</span>
              <ResultTable result={runResult} error={runError} />
            </div>
          )}

          {/* 채점 결과 */}
          {gradeResult && <GradingFeedback result={gradeResult} />}
        </main>
      </div>
    </div>
  )
}
