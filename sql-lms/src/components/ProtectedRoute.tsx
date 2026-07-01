import { useEffect, useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function ProtectedRoute() {
  const [status, setStatus] = useState<'loading' | 'allowed' | 'denied'>('loading')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setStatus('denied')
        return
      }
      // RLS가 whitelist를 서버에서 강제하므로 세션만 확인
      setStatus('allowed')
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setStatus(session ? 'allowed' : 'denied')
    })

    return () => subscription.unsubscribe()
  }, [])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400 text-sm">로딩 중...</div>
      </div>
    )
  }

  return status === 'allowed' ? <Outlet /> : <Navigate to="/login" replace />
}
