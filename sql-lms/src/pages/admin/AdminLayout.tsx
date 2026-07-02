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

  const bottomLink =
    'block rounded-lg px-3 py-2 text-[13px] font-medium text-[#4B5563] transition-colors hover:bg-[#F3F4F6]'

  return (
    <div className="flex min-h-screen bg-[#F7F8FA] text-[#18181B]">
      {/* 사이드바 */}
      <aside className="sticky top-0 flex min-h-screen w-[220px] flex-none flex-col border-r border-[#E7E8EC] bg-white px-3 py-5">
        <div className="flex items-center gap-2.5 px-2.5 pb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#4F46E5] text-[9px] font-extrabold text-white">
            SQL
          </span>
          <div className="flex flex-col">
            <span className="text-[13.5px] font-bold tracking-[-0.01em]">원데이 SQL</span>
            <span className="text-[11px] text-[#9CA3AF]">관리자 콘솔</span>
          </div>
        </div>

        <nav className="flex flex-col gap-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-[9px] text-left text-[13.5px] transition-colors ${
                  isActive
                    ? 'bg-[#EEF2FF] font-semibold text-[#4338CA]'
                    : 'font-medium text-[#4B5563] hover:bg-[#F3F4F6]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-0.5 border-t border-[#F0F1F4] pt-3">
          <NavLink to="/learn" className={bottomLink}>
            ← 학습 페이지로
          </NavLink>
          <button onClick={handleSignOut} className={`w-full text-left ${bottomLink}`}>
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
