import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { createDatabase, runQuery } from '../../lib/sqljs'
import type { Dataset, Chapter, QueryResult } from '../../types'

export default function ProblemForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [chapters, setChapters] = useState<Chapter[]>([])

  const [form, setForm] = useState({
    title: '',
    track: 'case',
    domain: '',
    dataset_id: '',
    chapter_id: '',
    difficulty: 'easy',
    description: '',
    extra_setup_sql: '',
    solution_sql: '',
    grading_mode: 'unordered',
    tags: '',
  })

  const [saving, setSaving] = useState(false)
  const [testResult, setTestResult] = useState<QueryResult | null>(null)
  const [testError, setTestError] = useState('')
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    async function load() {
      const [{ data: ds }, { data: ch }] = await Promise.all([
        supabase.from('datasets').select('*').order('domain'),
        supabase.from('chapters').select('*').order('order_num'),
      ])
      if (ds) setDatasets(ds)
      if (ch) setChapters(ch)

      if (isEdit && id) {
        const { data: p } = await supabase
          .from('problems')
          .select('*, problem_solutions(*)')
          .eq('id', id)
          .single()
        if (p) {
          setForm({
            title: p.title,
            track: p.track,
            domain: p.domain ?? '',
            dataset_id: p.dataset_id ?? '',
            chapter_id: p.chapter_id ?? '',
            difficulty: p.difficulty,
            description: p.description ?? '',
            extra_setup_sql: p.extra_setup_sql ?? '',
            solution_sql: (p.problem_solutions as { solution_sql?: string } | null)?.solution_sql ?? '',
            grading_mode: p.grading_mode,
            tags: (p.tags ?? []).join(', '),
          })
        }
      }
    }
    load()
  }, [id, isEdit])

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleTest() {
    if (!form.dataset_id || !form.solution_sql.trim()) return
    setTesting(true)
    setTestResult(null)
    setTestError('')
    try {
      const dataset = datasets.find((d) => d.id === form.dataset_id)
      if (!dataset) throw new Error('데이터셋을 찾을 수 없습니다.')
      const db = await createDatabase(dataset.setup_sql, form.extra_setup_sql || null)
      const result = runQuery(db, form.solution_sql)
      setTestResult(result)
      db.close()
    } catch (e) {
      setTestError(e instanceof Error ? e.message : String(e))
    } finally {
      setTesting(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const problemData = {
      title: form.title,
      track: form.track,
      domain: form.domain || null,
      dataset_id: form.dataset_id || null,
      chapter_id: form.chapter_id || null,
      difficulty: form.difficulty,
      description: form.description,
      extra_setup_sql: form.extra_setup_sql || null,
      grading_mode: form.grading_mode,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    }

    let problemId = id
    if (isEdit) {
      await supabase.from('problems').update(problemData).eq('id', id!)
    } else {
      const { data } = await supabase.from('problems').insert(problemData).select('id').single()
      problemId = data?.id
    }

    if (problemId && form.solution_sql.trim()) {
      await supabase.from('problem_solutions').upsert({
        problem_id: problemId,
        solution_sql: form.solution_sql,
      })
    }

    setSaving(false)
    navigate('/admin/problems')
  }

  const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
  const labelCls = "block text-xs font-medium text-gray-500 mb-1.5"
  const codeCls = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-xs font-mono bg-gray-900 text-green-300 focus:outline-none focus:border-blue-400 resize-none"

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-xl font-bold text-gray-900 mb-6">
        {isEdit ? '문제 수정' : '문제 등록'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">기본 정보</h2>

          <div>
            <label className={labelCls}>제목</label>
            <input required value={form.title} onChange={(e) => set('title', e.target.value)} className={inputCls} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>트랙</label>
              <select value={form.track} onChange={(e) => set('track', e.target.value)} className={inputCls}>
                <option value="syntax">문법 실습</option>
                <option value="case">실전 케이스</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>난이도</label>
              <select value={form.difficulty} onChange={(e) => set('difficulty', e.target.value)} className={inputCls}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>채점 모드</label>
              <select value={form.grading_mode} onChange={(e) => set('grading_mode', e.target.value)} className={inputCls}>
                <option value="unordered">unordered (순서 무관)</option>
                <option value="ordered">ordered (순서 포함)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>데이터셋</label>
              <select value={form.dataset_id} onChange={(e) => set('dataset_id', e.target.value)} className={inputCls}>
                <option value="">선택하세요</option>
                {datasets.map((d) => (
                  <option key={d.id} value={d.id}>{d.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>챕터 (선택)</label>
              <select value={form.chapter_id} onChange={(e) => set('chapter_id', e.target.value)} className={inputCls}>
                <option value="">없음</option>
                {chapters.map((c) => (
                  <option key={c.id} value={c.id}>{c.order_num}. {c.title}</option>
                ))}
              </select>
            </div>
          </div>

          {form.track === 'case' && (
            <div>
              <label className={labelCls}>도메인</label>
              <select value={form.domain} onChange={(e) => set('domain', e.target.value)} className={inputCls}>
                <option value="">선택하세요</option>
                {['ecommerce','saas','fintech','logistics','media','hr','community'].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className={labelCls}>태그 (쉼표 구분)</label>
            <input value={form.tags} onChange={(e) => set('tags', e.target.value)} className={inputCls} placeholder="join, group_by, window" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">문제 내용</h2>

          <div>
            <label className={labelCls}>문제 설명</label>
            <textarea
              required
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={6}
              className={inputCls + ' resize-none'}
            />
          </div>

          <div>
            <label className={labelCls}>추가 setup SQL (선택 — 이 문제에만 필요한 추가 테이블)</label>
            <textarea
              value={form.extra_setup_sql}
              onChange={(e) => set('extra_setup_sql', e.target.value)}
              rows={4}
              placeholder="-- 공용 데이터셋 외에 이 문제에만 필요한 DDL/INSERT"
              className={codeCls}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelCls + ' mb-0'}>정답 쿼리 (solution_sql)</label>
              <button
                type="button"
                onClick={handleTest}
                disabled={testing || !form.dataset_id || !form.solution_sql.trim()}
                className="text-xs text-blue-500 hover:text-blue-700 disabled:opacity-40 transition-colors"
              >
                {testing ? '실행 중...' : '▶ 테스트 실행'}
              </button>
            </div>
            <textarea
              required
              value={form.solution_sql}
              onChange={(e) => set('solution_sql', e.target.value)}
              rows={5}
              placeholder="SELECT ..."
              className={codeCls}
            />
            {testError && (
              <p className="text-red-400 text-xs font-mono mt-2 bg-red-950 p-2 rounded">{testError}</p>
            )}
            {testResult && (
              <div className="mt-2 text-xs text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                {testResult.values.length}행 반환 — 컬럼: {testResult.columns.join(', ')}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-sm rounded-lg transition-colors"
          >
            {saving ? '저장 중...' : isEdit ? '수정 저장' : '문제 등록'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/problems')}
            className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm rounded-lg transition-colors"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  )
}
