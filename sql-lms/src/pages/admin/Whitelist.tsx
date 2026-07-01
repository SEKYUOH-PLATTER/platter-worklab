import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import type { EmailWhitelist } from '../../types'

export default function Whitelist() {
  const [list, setList] = useState<EmailWhitelist[]>([])
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    const { data } = await supabase
      .from('email_whitelist')
      .select('*')
      .order('added_at', { ascending: false })
    if (data) setList(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const { error: err } = await supabase
      .from('email_whitelist')
      .insert({ email: email.trim().toLowerCase(), note: note.trim() || null })

    if (err) {
      setError(err.code === '23505' ? '이미 등록된 이메일입니다.' : err.message)
      return
    }
    setEmail('')
    setNote('')
    load()
  }

  async function handleDelete(emailToDelete: string) {
    if (!confirm(`${emailToDelete}을(를) 삭제할까요?`)) return
    await supabase.from('email_whitelist').delete().eq('email', emailToDelete)
    load()
  }

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold text-gray-900 mb-1">수강생 관리</h1>
      <p className="text-gray-500 text-sm mb-6">이메일 화이트리스트에 등록된 수강생만 플랫폼에 접근할 수 있습니다.</p>

      {/* 추가 폼 */}
      <form onSubmit={handleAdd} className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">수강생 추가</h2>
        <div className="flex gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="이메일 주소"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:border-blue-400"
          />
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="메모 (이름, 기수 등)"
            className="w-48 border border-gray-200 rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:border-blue-400"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
          >
            추가
          </button>
        </div>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </form>

      {/* 목록 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">이메일</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">메모</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">등록일</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400 text-xs">불러오는 중...</td></tr>
            ) : list.length === 0 ? (
              <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400 text-xs">등록된 수강생이 없습니다.</td></tr>
            ) : list.map((item) => (
              <tr key={item.email} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-mono text-gray-800">{item.email}</td>
                <td className="px-5 py-3 text-gray-500">{item.note ?? '-'}</td>
                <td className="px-5 py-3 text-gray-400 text-xs">
                  {new Date(item.added_at).toLocaleDateString('ko-KR')}
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => handleDelete(item.email)}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && (
          <div className="px-5 py-2.5 bg-gray-50 border-t border-gray-200">
            <span className="text-xs text-gray-400">총 {list.length}명</span>
          </div>
        )}
      </div>
    </div>
  )
}
