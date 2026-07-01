import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'
import type { Problem, Difficulty, Track } from '../types'

const DOMAINS = [
  { value: 'ecommerce', label: '이커머스' },
  { value: 'saas', label: 'SaaS / 앱' },
  { value: 'fintech', label: '핀테크 / 금융' },
  { value: 'logistics', label: '물류 / 운영' },
  { value: 'media', label: '미디어 / 콘텐츠' },
  { value: 'hr', label: 'HR / 인사' },
  { value: 'community', label: '커뮤니티' },
]

const DIFFICULTIES: { value: Difficulty; label: string; color: string }[] = [
  { value: 'easy', label: 'Easy', color: 'bg-green-100 text-green-700' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'hard', label: 'Hard', color: 'bg-red-100 text-red-700' },
]

export default function Learn() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [trackFilter, setTrackFilter] = useState<Track | 'all'>('all')
  const [domainFilter, setDomainFilter] = useState<string[]>([])
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty[]>([])

  useEffect(() => {
    async function load() {
      const [{ data: problemData }, { data: userData }] = await Promise.all([
        supabase.from('problems').select('*, dataset:datasets(title), chapter:chapters(title, order_num)').order('created_at'),
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
    if (trackFilter !== 'all' && p.track !== trackFilter) return false
    if (domainFilter.length > 0 && (!p.domain || !domainFilter.includes(p.domain))) return false
    if (difficultyFilter.length > 0 && !difficultyFilter.includes(p.difficulty)) return false
    return true
  })

  function toggleDomain(domain: string) {
    setDomainFilter((prev) =>
      prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]
    )
  }

  function toggleDifficulty(d: Difficulty) {
    setDifficultyFilter((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">문제 목록</h1>
        <p className="text-gray-500 text-sm mb-6">
          {filtered.length}개 문제 · 완료 {solvedIds.size}개
        </p>

        {/* 필터 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 space-y-3">
          {/* Track */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-gray-500 w-14">트랙</span>
            {(['all', 'syntax', 'case'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTrackFilter(t)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  trackFilter === t
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t === 'all' ? '전체' : t === 'syntax' ? '문법 실습' : '실전 케이스'}
              </button>
            ))}
          </div>

          {/* Domain (케이스 트랙일 때만) */}
          {trackFilter !== 'syntax' && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-gray-500 w-14">도메인</span>
              {DOMAINS.map((d) => (
                <button
                  key={d.value}
                  onClick={() => toggleDomain(d.value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    domainFilter.includes(d.value)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          )}

          {/* Difficulty */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-gray-500 w-14">난이도</span>
            {DIFFICULTIES.map((d) => (
              <button
                key={d.value}
                onClick={() => toggleDifficulty(d.value)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  difficultyFilter.includes(d.value)
                    ? d.color + ' ring-2 ring-offset-1 ring-current'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* 문제 목록 */}
        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">불러오는 중...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">해당 조건의 문제가 없습니다.</div>
        ) : (
          <div className="space-y-2">
            {filtered.map((problem) => {
              const diff = DIFFICULTIES.find((d) => d.value === problem.difficulty)!
              const solved = solvedIds.has(problem.id)
              return (
                <Link
                  key={problem.id}
                  to={`/problem/${problem.id}`}
                  className="flex items-center gap-4 bg-white rounded-xl border border-gray-200
                             px-4 py-3.5 hover:border-blue-300 hover:shadow-sm transition-all group"
                >
                  {/* 완료 표시 */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    solved ? 'bg-green-500 border-green-500' : 'border-gray-300'
                  }`}>
                    {solved && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {problem.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">
                        {problem.track === 'syntax' ? '문법 실습' : '실전 케이스'}
                      </span>
                      {problem.domain && (
                        <>
                          <span className="text-gray-200">·</span>
                          <span className="text-xs text-gray-400">
                            {DOMAINS.find((d) => d.value === problem.domain)?.label ?? problem.domain}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${diff.color}`}>
                    {diff.label}
                  </span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
