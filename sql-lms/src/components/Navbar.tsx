import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const navigate = useNavigate()
  const [isAdmin, setIsAdmin] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
      setEmail(session.user.email ?? '')
      const { data } = await supabase
        .from('user_profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single()
      setIsAdmin(data?.is_admin ?? false)
    })
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-[#E7E8EC] bg-white px-6">
      <Link to="/learn" className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#4F46E5] text-[9px] font-extrabold text-white">
          SQL
        </span>
        <span className="text-[15px] font-bold tracking-[-0.01em] text-[#18181B]">
          AI로 배우는 원데이 SQL
        </span>
      </Link>

      <div className="flex items-center gap-4">
        {email && <span className="hidden text-[13px] text-[#6B7280] sm:inline">{email}</span>}
        {isAdmin && (
          <Link
            to="/admin"
            className="rounded-lg border border-[#D8DAE0] bg-white px-3.5 py-[7px] text-[13px] font-medium text-[#4B5563] transition-colors hover:bg-[#F3F4F6]"
          >
            어드민
          </Link>
        )}
        <button
          onClick={handleSignOut}
          className="rounded-lg border border-[#D8DAE0] bg-white px-3.5 py-[7px] text-[13px] font-medium text-[#4B5563] transition-colors hover:bg-[#F3F4F6]"
        >
          로그아웃
        </button>
      </div>
    </header>
  )
}
