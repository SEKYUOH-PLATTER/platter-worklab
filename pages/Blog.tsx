
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import { BlogPost } from '../types';
import SEO from '../components/SEO';

const mockPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'ai-prompt-engineering-tips',
    title: '비전공자도 10분 만에 마스터하는 프롬프트 엔지니어링',
    keyword: 'AI 활용',
    summary: 'AI에게 어떻게 질문해야 원하는 답변을 얻을 수 있을까요? 실무에서 바로 쓰이는 질문의 공식 3가지를 소개합니다.',
    content: '상세 내용 본문입니다...',
    date: '2024.11.20',
    thumbnail: 'https://picsum.photos/seed/ai1/600/400'
  },
  {
    id: '2',
    slug: 'data-driven-marketing',
    title: '데이터로 증명하는 마케팅 전략: 숫자가 성과를 만든다',
    keyword: '데이터 분석',
    summary: '감에 의존하는 마케팅은 이제 그만. 고객의 행동 데이터를 분석하여 전환율을 200% 높이는 핵심 지표 설정법.',
    content: '상세 내용 본문입니다...',
    date: '2024.11.18',
    thumbnail: 'https://picsum.photos/seed/data1/600/400'
  },
  {
    id: '3',
    slug: 'excel-automation-workflow',
    title: '퇴근 시간을 앞당기는 엑셀 보고서 자동화 레시피',
    keyword: '업무 효율',
    summary: '매주 5시간씩 걸리던 엑셀 정기 보고서. 피벗 테이블과 파워 쿼리를 활용해 5분 만에 끝내는 노하우를 공개합니다.',
    content: '상세 내용 본문입니다...',
    date: '2024.11.15',
    thumbnail: 'https://picsum.photos/seed/excel1/600/400'
  },
  {
    id: '4',
    slug: 'future-of-work-with-ai',
    title: '2025년, 일하는 방식은 어떻게 변할 것인가?',
    keyword: '트렌드',
    summary: 'AI가 직업을 대체하는 것이 아니라, AI를 쓰는 사람이 못 쓰는 사람을 대체합니다. 변화하는 일의 미래를 진단합니다.',
    content: '상세 내용 본문입니다...',
    date: '2024.11.12',
    thumbnail: 'https://picsum.photos/seed/future1/600/400'
  },
  {
    id: '5',
    slug: 'python-for-non-coders',
    title: '코딩 모르는 팀장님이 파이썬을 배워야 하는 이유',
    keyword: '파이썬',
    summary: '개발자가 되라는 것이 아닙니다. 기술을 이해하고 효율을 높이는 도구로서의 파이썬 활용 가이드를 제시합니다.',
    content: '상세 내용 본문입니다...',
    date: '2024.11.08',
    thumbnail: 'https://picsum.photos/seed/python1/600/400'
  },
  {
    id: '6',
    slug: 'team-collaboration-tools',
    title: '협업의 밀도를 높이는 팀워크 툴 활용 전략',
    keyword: '조직 문화',
    summary: '도입만 하고 안 쓰는 툴은 그만. 슬랙, 노션, AI 협업 툴을 조직에 안착시키고 소통 비용을 줄이는 방법.',
    content: '상세 내용 본문입니다...',
    date: '2024.11.05',
    thumbnail: 'https://picsum.photos/seed/collab1/600/400'
  }
];

const Blog: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  if (selectedPost) {
    return (
      <article className="pt-32 pb-24 px-4 max-w-4xl mx-auto animate-fade-in">
        <SEO 
          title={selectedPost.title} 
          description={selectedPost.summary} 
          ogImage={selectedPost.thumbnail}
          ogType="article"
        />
        
        <button 
          onClick={() => setSelectedPost(null)}
          className="flex items-center gap-2 text-blue-600 font-bold mb-8 hover:gap-3 transition-all"
        >
          <ArrowLeft size={20} /> 목록으로 돌아가기
        </button>
        
        <header>
          <img src={selectedPost.thumbnail} alt={selectedPost.title} className="w-full h-[400px] object-cover rounded-3xl mb-12 shadow-2xl" />
          
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">{selectedPost.keyword}</span>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Calendar size={14} /> {selectedPost.date}
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <User size={14} /> 플래터 연구소
            </div>
            <button className="ml-auto text-slate-400 hover:text-blue-600 transition-colors">
              <Share2 size={20} />
            </button>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">{selectedPost.title}</h1>
        </header>
        
        <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed space-y-6 mb-16">
          <p className="text-xl font-medium text-slate-900 bg-slate-50 p-6 rounded-2xl border-l-4 border-blue-600">{selectedPost.summary}</p>
          <p>여기에 블로그의 상세 내용이 들어갑니다. 플래터 워크랩의 블로그는 실무자들에게 꼭 필요한 인사이트를 전달하기 위해 작성됩니다. 다양한 기술적 팁과 사고 방식을 다룹니다.</p>
          <p>데이터 기반으로 일하는 방식은 단순히 툴을 다루는 능력이 아니라, 문제를 바라보고 해결하는 전체적인 로직의 변화를 의미합니다. AI는 그 과정에서 우리의 생산성을 극대화해주는 아주 훌륭한 파트너가 될 것입니다.</p>
          <h3 className="text-2xl font-bold text-slate-900 pt-4">실무 적용 포인트</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>명확한 문제 정의를 우선하세요.</li>
            <li>데이터 수집의 자동화부터 시작하세요.</li>
            <li>AI와의 대화에서 구체적인 컨텍스트를 제공하세요.</li>
          </ul>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">이 주제에 대해 더 자세히 배우고 싶나요?</h3>
          <p className="text-slate-400 mb-8">플래터 워크랩의 맞춤형 커리큘럼으로 실무 역량을 한 단계 높여보세요.</p>
          <Link 
            to="/" 
            onClick={() => window.scrollTo(0, 0)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            교육 자세히 알아보기 <ChevronRight size={20} />
          </Link>
        </div>
      </article>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <SEO title="인사이트 & 블로그" description="일의 밀도를 높이는 실무 연구소의 지식 창고입니다. 최신 AI 트렌드와 데이터 분석 노하우를 확인하세요." />
      
      {/* Blog Hero */}
      <section className="bg-slate-900 pt-40 pb-24 px-4 text-center">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">인사이트 & 블로그</h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">일의 밀도를 높이는 실무 연구소의 지식 창고입니다.</p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockPosts.map((post) => (
            <article 
              key={post.id} 
              className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all hover:-translate-y-2 group cursor-pointer"
              onClick={() => {
                setSelectedPost(post);
                window.scrollTo(0, 0);
              }}
            >
              <div className="h-56 relative overflow-hidden">
                <img 
                  src={post.thumbnail} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                    {post.keyword}
                  </span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-4">
                  <Calendar size={14} /> {post.date}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                  {post.summary}
                </p>
                <div className="flex items-center text-blue-600 font-bold text-sm">
                  자세히 보기 <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
        
        {/* Pagination Placeholder */}
        <div className="mt-16 flex justify-center gap-2">
          {[1, 2, 3].map(n => (
            <button key={n} className={`w-10 h-10 rounded-lg font-bold flex items-center justify-center transition-all ${n === 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white text-slate-400 border border-slate-200 hover:border-blue-400'}`}>
              {n}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Blog;