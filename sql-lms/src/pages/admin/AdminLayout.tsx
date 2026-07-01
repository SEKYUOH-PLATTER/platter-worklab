import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'

const navItems = [
  { to: '/admin/problems', label: '문제 관리' },
  { to: '/admin/datasets', label: '데이터셋 관리' },
  { to: '/admin/whitelist', label: '수강생 관리' },
]

export default function AdminLayout() {
  const navigate = useNavigate()

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 사이드바 */}
      <aside className="w-52 bg-gray-900 flex flex-col flex-shrink-0">
        <div className="px-4 py-5 border-b border-gray-800">
          <p className="text-white text-sm font-semibold">SQL LMS</p>
          <p className="text-gray-500 text-xs mt-0.5">어드민</p>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-2 py-3 border-t border-gray-800 space-y-0.5">
          <NavLink
            to="/learn"
            className="block px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            ← 학습 화면
          </NavLink>
          <button
            onClick={handleSignOut}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            로그아웃
          </button>
        </div>
      </aside>

      {/* 본문 */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
