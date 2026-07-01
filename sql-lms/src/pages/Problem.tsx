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

const DIFFICULTY_STYLE: Record<string, string> = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-700',
}
const DIFFICULTY_LABEL: Record<string, string> = { easy: 'Easy', medium: 'Medium', hard: 'Hard' }

export default function Problem() {
  const { id } = useParams<{ id: string }>()
  const [problem, setProblem] = useState<ProblemType | null>(null)
  const [loading, setLoading] = useState(true)
  const dbRef = useRef<Database | null>(null)

  // 에디터 상태
  const [sql, setSql] = useState('')
  const [runResult, setRunResult] = useState<QueryResult | null>(null)
  const [runError, setRunError] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const [grading, setGrading] = useState(false)
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null)
  const [mode, setMode] = useState<ProblemMode>('workflow')

  // Track B 상태
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

      // 케이스 트랙은 workflow 기본, 문법 트랙은 direct 기본
      if (data.track === 'syntax') setMode('direct')

      // sql.js DB 초기화
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
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-500 text-sm">로딩 중...</p>
      </div>
    )
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-500 text-sm">문제를 찾을 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Navbar />

      {/* 문제 헤더 */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <Link to="/learn" className="hover:text-gray-300 transition-colors">문제 목록</Link>
            <span>/</span>
            <span className="text-gray-300">{problem.title}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-white font-semibold text-lg">{problem.title}</h1>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${DIFFICULTY_STYLE[problem.difficulty]}`}>
              {DIFFICULTY_LABEL[problem.difficulty]}
            </span>
            <span className="text-xs text-gray-500">
              {problem.track === 'syntax' ? '문법 실습' : '실전 케이스'}
            </span>
          </div>

          {/* 모드 탭 (케이스 트랙만) */}
          {problem.track === 'case' && (
            <div className="flex gap-1 mt-3">
              {(['workflow', 'direct'] as ProblemMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    mode === m
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                  }`}
                >
                  {m === 'workflow' ? 'AI 워크플로우' : '직접 작성'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 본문 */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full px-6 py-6 gap-6">

        {/* 좌측: 스키마 탐색기 (케이스 + workflow 모드) */}
        {problem.track === 'case' && mode === 'workflow' && (
          <div className="w-56 flex-shrink-0">
            <SchemaExplorer
              schema={schema}
              selectedColumns={selectedColumns}
              onToggle={toggleColumn}
            />
          </div>
        )}

        {/* 우측: 메인 영역 */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* 문제 설명 */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
            <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
              {problem.description}
            </p>
          </div>

          {/* Track B - AI 워크플로우 */}
          {problem.track === 'case' && mode === 'workflow' && (
            <>
              {/* STEP 1: 컬럼 선택 */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                  <h3 className="text-white text-sm font-medium">필요한 컬럼 선택</h3>
                </div>
                {selectedColumns.size === 0 ? (
                  <p className="text-gray-500 text-xs">← 좌측 스키마 탐색기에서 필요한 컬럼을 체크하세요.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {[...selectedColumns].map((col) => (
                      <span key={col} className="px-2 py-1 bg-blue-900/50 border border-blue-700 rounded-md text-xs font-mono text-blue-300">
                        {col}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* STEP 2: 아웃풋 설계 */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                  <h3 className="text-white text-sm font-medium">받을 표 그리기</h3>
                  <span className="text-gray-500 text-xs ml-1">원하는 결과물의 컬럼과 예시 값을 입력하세요.</span>
                </div>
                <OutputGridDesigner
                  columns={outputColumns}
                  onChange={setOutputColumns}
                  sortOrder={sortOrder}
                  onSortOrderChange={setSortOrder}
                  expectedRows={expectedRows}
                  onExpectedRowsChange={setExpectedRows}
                />
              </div>

              {/* STEP 3: AI 프롬프트 */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">3</span>
                  <h3 className="text-white text-sm font-medium">AI에게 쿼리 요청</h3>
                </div>
                <p className="text-gray-400 text-xs mb-3">
                  아래 버튼으로 프롬프트를 복사한 후 ChatGPT, Claude 등에 붙여넣으세요.
                  받은 쿼리를 STEP 4 에디터에 붙여넣고 실행하면 됩니다.
                </p>
                <PromptCopyButton
                  problemDescription={problem.description ?? ''}
                  schema={schema}
                  selectedColumns={selectedColumns}
                  outputColumns={outputColumns}
                  sortOrder={sortOrder}
                  expectedRows={expectedRows}
                />
              </div>

              {/* STEP 4: 쿼리 실행 */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">4</span>
                  <h3 className="text-white text-sm font-medium">쿼리 붙여넣고 실행</h3>
                </div>
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

          {/* Track A / 직접 작성 모드 */}
          {(problem.track === 'syntax' || mode === 'direct') && (
            <div className="space-y-4">
              {/* 스키마 설명 (직접 작성 모드) */}
              {problem.track === 'case' && schema.length > 0 && (
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                  <h3 className="text-gray-300 text-xs font-medium mb-3">사용 가능한 테이블</h3>
                  <div className="space-y-2">
                    {schema.map((table) => (
                      <div key={table.name}>
                        <p className="font-mono text-blue-300 text-xs font-medium mb-1">{table.name}</p>
                        <p className="text-gray-500 text-xs font-mono pl-2">
                          {table.columns.map((c) => `${c.name} (${c.type})`).join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <SqlEditor
                value={sql}
                onChange={setSql}
                onRun={handleRun}
                onGrade={handleGrade}
                running={running}
                grading={grading}
              />
            </div>
          )}

          {/* 실행 결과 */}
          {(runResult || runError) && (
            <ResultTable result={runResult} error={runError} label="실행 결과" />
          )}

          {/* 채점 결과 */}
          {gradeResult && <GradingFeedback result={gradeResult} />}
        </div>
      </div>
    </div>
  )
}
