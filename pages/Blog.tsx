import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, User, ArrowLeft, Share2, Loader2, Eye } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import DOMPurify from 'dompurify';
import { BlogPost } from '../types';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabaseClient';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  const fetchPosts = useCallback(async (pageNum: number) => {
    if (loading) return;
    setLoading(true);
    
    const limit = 6;
    const from = (pageNum - 1) * limit;
    const to = from + limit - 1;
    
    try {
      const { data, error, count } = await supabase
        .from('posts')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) throw error;
      
      if (pageNum === 1) {
        setPosts(data || []);
      } else {
        setPosts(prev => [...prev, ...(data || [])]);
      }
      setHasMore((count || 0) > from + (data?.length || 0));
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [loading]);

  const fetchPost = async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setSelectedPost(data);
        window.scrollTo(0, 0);
        
        await supabase
          .from('posts')
          .update({ view_count: (data.view_count || 0) + 1 })
          .eq('id', id);
      }
    } catch (error) {
      console.error('Failed to fetch post:', error);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  useEffect(() => {
    if (inView && hasMore && !loading && !initialLoad) {
      setPage(prev => prev + 1);
    }
  }, [inView, hasMore, loading, initialLoad]);

  useEffect(() => {
    if (page > 1) {
      fetchPosts(page);
    }
  }, [page]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy.MM.dd', { locale: ko });
    } catch {
      return dateString;
    }
  };

  const handleShare = async () => {
    if (!selectedPost) return;
    
    const currentUrl = window.location.href;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: selectedPost.title,
          url: currentUrl,
        });
      } else {
        await navigator.clipboard.writeText(currentUrl);
        alert('링크가 복사되었습니다.');
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Share failed:', error);
      }
    }
  };

  if (selectedPost) {
    const cleanHtml = DOMPurify.sanitize(selectedPost.content);
    
    return (
      <article className="pt-32 pb-24 px-4 max-w-4xl mx-auto animate-fade-in">
        <SEO 
          title={selectedPost.title} 
          description={selectedPost.content.substring(0, 160).replace(/<[^>]*>/g, '')} 
          ogImage={selectedPost.thumbnail_url}
          ogType="article"
        />
        
        <button 
          onClick={() => setSelectedPost(null)}
          className="flex items-center gap-2 text-blue-600 font-bold mb-8 hover:gap-3 transition-all"
        >
          <ArrowLeft size={20} /> 목록으로 돌아가기
        </button>
        
        <header>
          {selectedPost.thumbnail_url && (
            <img src={selectedPost.thumbnail_url} alt={selectedPost.title} className="w-full h-[400px] object-cover rounded-3xl mb-12 shadow-2xl" />
          )}
          
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">{selectedPost.category}</span>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Calendar size={14} /> {formatDate(selectedPost.created_at)}
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <User size={14} /> 플래터 연구소
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Eye size={14} /> {selectedPost.view_count} views
            </div>
            <button 
              onClick={handleShare}
              className="ml-auto text-slate-400 hover:text-blue-600 transition-colors"
              title="공유하기"
            >
              <Share2 size={20} />
            </button>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">{selectedPost.title}</h1>
        </header>
        
        <div 
          className="prose prose-lg max-w-none text-slate-700 leading-relaxed space-y-6 mb-16 ql-editor"
          dangerouslySetInnerHTML={{ __html: cleanHtml }}
        />

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
      
      <section className="bg-slate-900 pt-40 pb-24 px-4 text-center">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">플래터 워크랩 AI & Data 기업교육 블그</h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">일의 밀도를 높이는 AI와 데이터 인사이트를 확인해보세요.</p>
        </div>
      </section>

      <section className="py-20 px-4 max-w-7xl mx-auto">
        {initialLoad ? (
          <div className="flex justify-center py-20">
            <Loader2 size={48} className="animate-spin text-blue-600" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">아직 등록된 게시물이 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article 
                  key={post.id} 
                  className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all hover:-translate-y-2 group cursor-pointer"
                  onClick={() => fetchPost(post.id)}
                >
                  <div className="h-56 relative overflow-hidden">
                    {post.thumbnail_url ? (
                      <img 
                        src={post.thumbnail_url} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700" />
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-4 text-slate-400 text-xs mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} /> {formatDate(post.created_at)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye size={14} /> {post.view_count}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <div className="flex items-center text-blue-600 font-bold text-sm">
                      자세히 보기 <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
            
            {hasMore && (
              <div ref={loadMoreRef} className="flex justify-center py-10">
                {loading && <Loader2 size={32} className="animate-spin text-blue-600" />}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Blog;
