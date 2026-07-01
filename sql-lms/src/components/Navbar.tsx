import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const navigate = useNavigate()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
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
    <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
      <Link to="/learn" className="font-semibold text-sm tracking-wide">
        AI로 배우는 원데이 SQL
      </Link>
      <div className="flex items-center gap-4 text-sm">
        {isAdmin && (
          <Link to="/admin" className="text-gray-400 hover:text-white transition-colors">
            어드민
          </Link>
        )}
        <button
          onClick={handleSignOut}
          className="text-gray-400 hover:text-white transition-colors"
        >
          로그아웃
        </button>
      </div>
    </nav>
  )
}
