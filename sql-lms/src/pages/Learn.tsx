import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'
import type { Problem, Difficulty, Track } from '../types'

const DOMAINS = [
  { value: 'ecommerce', label: '이커머스' },
  { value: 'saas', label: 'SaaS' },
  { value: 'fintech', label: '핀테크' },
  { value: 'logistics', label: '물류' },
  { value: 'media', label: '미디어' },
  { value: 'hr', label: 'HR' },
  { value: 'community', label: '커뮤니티' },
]

const DIFF: Record<Difficulty, { label: string; color: string; bg: string }> = {
  easy: { label: 'Easy', color: '#15803D', bg: '#ECFDF5' },
  medium: { label: 'Medium', color: '#B45309', bg: '#FFFBEB' },
  hard: { label: 'Hard', color: '#B91C1C', bg: '#FEF2F2' },
}

const TRACKS: { value: Track | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'syntax', label: '문법 실습' },
  { value: 'case', label: '실전 케이스' },
]

export default function Learn() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [track, setTrack] = useState<Track | 'all'>('all')
  const [domains, setDomains] = useState<string[]>([])
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)

  useEffect(() => {
    async function load() {
      const [{ data: problemData }, { data: userData }] = await Promise.all([
        supabase
          .from('problems')
          .select('*, dataset:datasets(title), chapter:chapters(title, order_num)')
          .order('created_at'),
        supabase.auth.getUser(),
      ])

      if (problemData) setProblems(problemData as Problem[])

      if (userData.user) {
        const { data: subs } = await supabase
          .from('submissions')
          .select('problem_id')
          .eq('user_id', userData.user.id)
          .eq('is_correct', true)
        if (subs) setSolvedIds(new Set(subs.map((s) => s.problem_id)))
      }
      setLoading(false)
    }
    load()
  }, [])

  const filtered = problems.filter((p) => {
    if (track !== 'all' && p.track !== track) return false
    if (domains.length > 0 && (!p.domain || !domains.includes(p.domain))) return false
    if (difficulty && p.difficulty !== difficulty) return false
    return true
  })

  const trackCount = (t: Track | 'all') =>
    t === 'all' ? problems.length : problems.filter((p) => p.track === t).length

  const hasFilter = track !== 'all' || domains.length > 0 || !!difficulty
  const resetFilters = () => {
    setTrack('all')
    setDomains([])
    setDifficulty(null)
  }

  function toggleDomain(value: string) {
    setDomains((prev) => (prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value]))
  }

  const progress = problems.length > 0 ? (solvedIds.size / problems.length) * 100 : 0

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#18181B]">
      <Navbar />

      <div className="mx-auto flex max-w-[1120px] items-start gap-8 px-6 py-8">
        {/* ── Sidebar filters ─────────────────────────────── */}
        <aside className="sticky top-[88px] flex w-56 flex-none flex-col gap-7">
          {/* Track */}
          <div className="flex flex-col gap-2.5">
            <div className="text-xs font-bold tracking-[0.06em] text-[#9CA3AF]">트랙</div>
            <div className="flex flex-col gap-1">
              {TRACKS.map((t) => {
                const sel = track === t.value
                return (
                  <button
                    key={t.value}
                    onClick={() => setTrack(t.value)}
                    className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-[13.5px] transition-colors ${
                      sel ? 'bg-[#EEF2FF] font-semibold text-[#4338CA]' : 'font-medium text-[#4B5563] hover:bg-[#F3F4F6]'
                    }`}
                  >
                    {t.label}
                    <span className={`text-xs font-medium ${sel ? 'text-[#6366F1]' : 'text-[#9CA3AF]'}`}>
                      {trackCount(t.value)}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Domain */}
          <div className="flex flex-col gap-2.5">
            <div className="text-xs font-bold tracking-[0.06em] text-[#9CA3AF]">도메인</div>
            <div className="flex flex-wrap gap-1.5">
              {DOMAINS.map((d) => {
                const sel = domains.includes(d.value)
                return (
                  <button
                    key={d.value}
                    onClick={() => toggleDomain(d.value)}
                    className={`rounded-full border px-[11px] py-1.5 text-[12.5px] transition-colors ${
                      sel
                        ? 'border-[#C7D2FE] bg-[#EEF2FF] font-semibold text-[#4338CA]'
                        : 'border-[#E1E3E8] bg-white font-medium text-[#4B5563] hover:bg-[#F9FAFB]'
                    }`}
                  >
                    {d.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Difficulty */}
          <div className="flex flex-col gap-2.5">
            <div className="text-xs font-bold tracking-[0.06em] text-[#9CA3AF]">난이도</div>
            <div className="flex gap-1.5">
              {(Object.keys(DIFF) as Difficulty[]).map((d) => {
                const sel = difficulty === d
                return (
                  <button
                    key={d}
                    onClick={() => setDifficulty(sel ? null : d)}
                    className={`rounded-full border px-[11px] py-1.5 text-[12.5px] transition-colors ${
                      sel
                        ? 'border-[#C7D2FE] bg-[#EEF2FF] font-semibold text-[#4338CA]'
                        : 'border-[#E1E3E8] bg-white font-medium text-[#4B5563] hover:bg-[#F9FAFB]'
                    }`}
                  >
                    {DIFF[d].label}
                  </button>
                )
              })}
            </div>
          </div>

          {hasFilter && (
            <button
              onClick={resetFilters}
              className="self-start text-[13px] font-medium text-[#4F46E5]"
            >
              필터 초기화
            </button>
          )}
        </aside>

        {/* ── Main content ────────────────────────────────── */}
        <main className="flex min-w-0 flex-1 flex-col gap-5">
          {/* Progress */}
          <div className="flex flex-col gap-3 rounded-xl border border-[#E7E8EC] bg-white px-6 py-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-[#374151]">나의 진행률</span>
              <span className="text-sm text-[#6B7280]">
                해결 <strong className="font-bold text-[#4F46E5]">{solvedIds.size}</strong> / {problems.length}문제
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#EEF0F3]">
              <div className="h-full rounded-full bg-[#4F46E5]" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Count row */}
          <div className="flex items-center justify-between px-0.5">
            <span className="text-[13px] text-[#6B7280]">
              문제 <strong className="text-[#374151]">{filtered.length}</strong>개
            </span>
            <span className="text-[13px] text-[#9CA3AF]">기본 순서</span>
          </div>

          {/* Problem list */}
          {loading ? (
            <div className="rounded-[10px] border border-[#E7E8EC] bg-white p-10 text-center text-sm text-[#9CA3AF]">
              불러오는 중...
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-[10px] border border-dashed border-[#D8DAE0] bg-white p-10 text-center text-sm text-[#9CA3AF]">
              조건에 맞는 문제가 없습니다
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filtered.map((p) => {
                const solved = solvedIds.has(p.id)
                const domainLabel = DOMAINS.find((d) => d.value === p.domain)?.label ?? p.domain
                return (
                  <Link
                    key={p.id}
                    to={`/problem/${p.id}`}
                    className="group flex items-center gap-3.5 rounded-[10px] border border-[#E7E8EC] bg-white px-[18px] py-3.5 transition-all hover:border-[#C7D2FE] hover:shadow-[0_2px_8px_rgba(16,24,40,0.06)]"
                  >
                    {/* Check */}
                    {solved ? (
                      <span className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full bg-[#16A34A] text-xs font-bold text-white">
                        ✓
                      </span>
                    ) : (
                      <span className="h-[22px] w-[22px] flex-none rounded-full border-[1.5px] border-[#D8DAE0]" />
                    )}

                    <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <span className="text-[15px] font-semibold tracking-[-0.01em] text-[#18181B]">
                        {p.title}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span
                          className="rounded-md px-2 py-[3px] text-xs font-semibold"
                          style={{ color: DIFF[p.difficulty].color, background: DIFF[p.difficulty].bg }}
                        >
                          {DIFF[p.difficulty].label}
                        </span>
                        <span className="rounded-md bg-[#F3F4F6] px-2 py-[3px] text-xs font-medium text-[#4B5563]">
                          {p.track === 'syntax' ? '문법 실습' : '실전 케이스'}
                        </span>
                        {p.domain && (
                          <span className="rounded-md bg-[#EEF2FF] px-2 py-[3px] text-xs font-medium text-[#4338CA]">
                            {domainLabel}
                          </span>
                        )}
                      </span>
                    </span>

                    <span className="text-base text-[#C4C8CF]">›</span>
                  </Link>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
