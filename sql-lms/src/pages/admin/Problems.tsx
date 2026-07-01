import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import type { Problem } from '../../types'

const DIFFICULTY_STYLE: Record<string, string> = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-700',
}

export default function AdminProblems() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data } = await supabase
      .from('problems')
      .select('*, dataset:datasets(title)')
      .order('created_at', { ascending: false })
    if (data) setProblems(data as Problem[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: string, title: string) {
    if (!confirm(`"${title}" 문제를 삭제할까요?`)) return
    await supabase.from('problems').delete().eq('id', id)
    load()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">문제 관리</h1>
          <p className="text-gray-500 text-sm">총 {problems.length}개 문제</p>
        </div>
        <Link
          to="/admin/problems/new"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
        >
          + 문제 등록
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">제목</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">트랙</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">데이터셋</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">난이도</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400 text-xs">불러오는 중...</td></tr>
            ) : problems.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400 text-xs">등록된 문제가 없습니다.</td></tr>
            ) : problems.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-800 max-w-xs truncate">{p.title}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    p.track === 'syntax' ? 'bg-gray-100 text-gray-600' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {p.track === 'syntax' ? '문법' : '케이스'}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500 text-xs">
                  {(p.dataset as { title?: string } | undefined)?.title ?? '-'}
                </td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${DIFFICULTY_STYLE[p.difficulty]}`}>
                    {p.difficulty}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      to={`/admin/problems/${p.id}/edit`}
                      className="text-xs text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      수정
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id, p.title)}
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
