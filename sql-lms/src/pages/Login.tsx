import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/learn', { replace: true })
    })
  }, [navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError || !data.session) {
      setError('이메일 또는 비밀번호를 확인해주세요.')
      setLoading(false)
      return
    }

    // 화이트리스트 확인 (RLS가 서버에서 강제하지만 UX를 위해 클라이언트에서도 확인)
    const { data: whitelist } = await supabase
      .from('email_whitelist')
      .select('email')
      .eq('email', data.session.user.email ?? '')
      .single()

    if (!whitelist) {
      await supabase.auth.signOut()
      setError('접근 권한이 없습니다. 강사에게 문의하세요.')
      setLoading(false)
      return
    }

    navigate('/learn', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-white text-xl font-semibold">AI로 배우는 원데이 SQL</h1>
          <p className="text-gray-400 text-sm mt-1">수강생 전용 학습 플랫폼</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1.5">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2.5 text-sm
                         border border-gray-600 focus:border-blue-500 focus:outline-none
                         focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1.5">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2.5 text-sm
                         border border-gray-600 focus:border-blue-500 focus:outline-none
                         focus:ring-1 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-900/30 border border-red-800 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800
                       text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}
