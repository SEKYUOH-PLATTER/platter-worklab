import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import type { Dataset } from '../../types'

export default function AdminDatasets() {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data } = await supabase.from('datasets').select('*').order('domain')
    if (data) setDatasets(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: string, title: string) {
    if (!confirm(`"${title}" 데이터셋을 삭제할까요?\n이 데이터셋을 사용하는 문제에 영향을 줄 수 있습니다.`)) return
    await supabase.from('datasets').delete().eq('id', id)
    load()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">데이터셋 관리</h1>
          <p className="text-gray-500 text-sm">도메인별 공용 예제 데이터셋을 관리합니다.</p>
        </div>
        <Link
          to="/admin/datasets/new"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
        >
          + 데이터셋 등록
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">제목</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">도메인</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">설명</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">수정일</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400 text-xs">불러오는 중...</td></tr>
            ) : datasets.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400 text-xs">등록된 데이터셋이 없습니다.</td></tr>
            ) : datasets.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-800">{d.title}</td>
                <td className="px-5 py-3">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-mono">{d.domain}</span>
                </td>
                <td className="px-5 py-3 text-gray-500 text-xs max-w-xs truncate">{d.description ?? '-'}</td>
                <td className="px-5 py-3 text-gray-400 text-xs">
                  {new Date(d.updated_at).toLocaleDateString('ko-KR')}
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      to={`/admin/datasets/${d.id}/edit`}
                      className="text-xs text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      수정
                    </Link>
                    <button
                      onClick={() => handleDelete(d.id, d.title)}
                      className="text-xs text-red-400 hover:text-red-600 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
