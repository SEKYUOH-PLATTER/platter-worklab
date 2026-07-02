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

    const { data: whitelist } = await supabase
      .from('email_whitelist')
      .select('email')
      .eq('email', data.session.user.email ?? '')
      .single()

    if (!whitelist) {
      await supabase.auth.signOut()
      setError('등록되지 않은 이메일입니다. 관리자에게 문의해 주세요.')
      setLoading(false)
      return
    }

    navigate('/learn', { replace: true })
  }

  const inputCls =
    'h-[42px] rounded-lg border border-[#D8DAE0] px-3 text-sm text-[#18181B] outline-none ' +
    'focus:border-[#4F46E5] focus:ring-[3px] focus:ring-[#4F46E5]/[0.12] placeholder-[#B0B4BC]'

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F8FA] px-6">
      <div className="flex w-full max-w-[400px] flex-col gap-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#4F46E5] text-[13px] font-extrabold tracking-[0.02em] text-white shadow-[0_4px_12px_rgba(79,70,229,0.25)]">
            SQL
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <h1 className="text-[22px] font-bold tracking-[-0.01em] text-[#18181B]">
              AI로 배우는 원데이 SQL
            </h1>
            <p className="text-sm text-[#6B7280]">수강생 전용 학습 플랫폼</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-[18px] rounded-[14px] border border-[#E7E8EC] bg-white p-8 shadow-[0_1px_3px_rgba(16,24,40,0.05)]"
        >
          {error && (
            <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2.5 text-[13px] text-[#B91C1C]">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#374151]">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className={inputCls}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#374151]">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className={inputCls}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-1 flex h-11 items-center justify-center rounded-lg bg-[#4F46E5] text-sm font-semibold text-white transition-colors hover:bg-[#4338CA] disabled:opacity-60"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p className="text-center text-[13px] text-[#9CA3AF]">
          수강 승인된 이메일로만 로그인할 수 있습니다
        </p>
      </div>
    </div>
  )
}
