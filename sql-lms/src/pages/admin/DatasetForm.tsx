import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { createDatabase, getSchema } from '../../lib/sqljs'
import type { SchemaTable } from '../../types'

const DOMAINS = ['ecommerce','saas','fintech','logistics','media','hr','community','syntax_common']

export default function DatasetForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({ domain: '', title: '', description: '', setup_sql: '' })
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState<SchemaTable[]>([])
  const [previewError, setPreviewError] = useState('')
  const [previewing, setPreviewing] = useState(false)

  useEffect(() => {
    if (!isEdit || !id) return
    supabase.from('datasets').select('*').eq('id', id).single().then(({ data }) => {
      if (data) setForm({ domain: data.domain, title: data.title, description: data.description ?? '', setup_sql: data.setup_sql })
    })
  }, [id, isEdit])

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handlePreview() {
    if (!form.setup_sql.trim()) return
    setPreviewing(true)
    setPreview([])
    setPreviewError('')
    try {
      const db = await createDatabase(form.setup_sql)
      setPreview(getSchema(db))
      db.close()
    } catch (e) {
      setPreviewError(e instanceof Error ? e.message : String(e))
    } finally {
      setPreviewing(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload = {
      domain: form.domain,
      title: form.title,
      description: form.description || null,
      setup_sql: form.setup_sql,
      updated_at: new Date().toISOString(),
    }

    if (isEdit) {
      await supabase.from('datasets').update(payload).eq('id', id!)
    } else {
      await supabase.from('datasets').insert(payload)
    }
    setSaving(false)
    navigate('/admin/datasets')
  }

  const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
  const labelCls = "block text-xs font-medium text-gray-500 mb-1.5"
  const codeCls = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-xs font-mono bg-gray-900 text-green-300 focus:outline-none focus:border-blue-400 resize-none"

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-xl font-bold text-gray-900 mb-6">
        {isEdit ? '데이터셋 수정' : '데이터셋 등록'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">기본 정보</h2>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>도메인</label>
              <select required value={form.domain} onChange={(e) => set('domain', e.target.value)} className={inputCls}>
                <option value="">선택하세요</option>
                {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>제목</label>
              <input required value={form.title} onChange={(e) => set('title', e.target.value)} className={inputCls} placeholder="이커머스 기본 데이터셋" />
            </div>
          </div>

          <div>
            <label className={labelCls}>설명 (선택)</label>
            <input value={form.description} onChange={(e) => set('description', e.target.value)} className={inputCls} placeholder="테이블 구성 설명" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700">setup_sql (DDL + INSERT)</h2>
            <button
              type="button"
              onClick={handlePreview}
              disabled={previewing || !form.setup_sql.trim()}
              className="text-xs text-blue-500 hover:text-blue-700 disabled:opacity-40 transition-colors"
            >
              {previewing ? '분석 중...' : '▶ 스키마 미리보기'}
            </button>
          </div>

          <textarea
            required
            value={form.setup_sql}
            onChange={(e) => set('setup_sql', e.target.value)}
            rows={16}
            placeholder="CREATE TABLE orders (...);\nINSERT INTO orders VALUES (...);"
            className={codeCls}
          />

          {previewError && (
            <p className="text-red-400 text-xs font-mono bg-red-950 p-2 rounded">{previewError}</p>
          )}

          {preview.length > 0 && (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 space-y-2">
              <p className="text-xs font-medium text-gray-500">{preview.length}개 테이블 감지</p>
              {preview.map((t) => (
                <div key={t.name}>
                  <p className="text-xs font-mono font-semibold text-blue-600">{t.name}</p>
                  <p className="text-xs text-gray-400 font-mono pl-2">
                    {t.columns.map((c) => `${c.name} (${c.type})`).join(', ')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-sm rounded-lg transition-colors"
          >
            {saving ? '저장 중...' : isEdit ? '수정 저장' : '데이터셋 등록'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/datasets')}
            className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm rounded-lg transition-colors"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  )
}
