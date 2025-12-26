import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, Loader2, Eye } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { BlogPost } from '../types';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabaseClient';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
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

  return (
    <div className="bg-slate-50 min-h-screen">
      <SEO title="인사이트 & 블로그" description="일의 밀도를 높이는 실무 연구소의 지식 창고입니다. 최신 AI 트렌드와 데이터 분석 노하우를 확인하세요." />
      
      <section className="bg-slate-900 pt-40 pb-24 px-4 text-center">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">플래터 워크랩 AI & Data 블로그</h1>
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
                <Link 
                  key={post.id} 
                  to={`/blog/${post.id}`}
                  className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all hover:-translate-y-2 group block"
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
                </Link>
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
