import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Calendar, User, ArrowLeft, Share2, Loader2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import DOMPurify from 'dompurify';
import { BlogPost as BlogPostType } from '../types';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabaseClient';

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError('게시물을 찾을 수 없습니다.');
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('posts')
          .select('*')
          .eq('id', parseInt(id))
          .single();

        if (fetchError) throw fetchError;

        if (data) {
          setPost(data);
          
          await supabase
            .from('posts')
            .update({ view_count: (data.view_count || 0) + 1 })
            .eq('id', data.id);
        } else {
          setError('게시물을 찾을 수 없습니다.');
        }
      } catch (err: any) {
        console.error('Failed to fetch post:', err);
        setError('게시물을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    window.scrollTo(0, 0);
  }, [id]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy.MM.dd', { locale: ko });
    } catch {
      return dateString;
    }
  };

  const handleShare = async () => {
    if (!post) return;
    
    const currentUrl = window.location.href;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">{error || '게시물을 찾을 수 없습니다.'}</h1>
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all"
          >
            <ArrowLeft size={20} /> 블로그 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const contentWithBreaks = post.content.replace(/\n/g, '<br>');
  const cleanHtml = DOMPurify.sanitize(contentWithBreaks);

  return (
    <div className="bg-slate-50 min-h-screen">
      <SEO 
        title={post.title} 
        description={post.content.substring(0, 160).replace(/<[^>]*>/g, '')} 
        ogImage={post.thumbnail_url}
        ogType="article"
      />
      
      <article className="pt-32 pb-24 px-4 max-w-4xl mx-auto animate-fade-in">
        <Link 
          to="/blog"
          className="flex items-center gap-2 text-blue-600 font-bold mb-8 hover:gap-3 transition-all"
        >
          <ArrowLeft size={20} /> 목록으로 돌아가기
        </Link>
        
        <header>
          {post.thumbnail_url && (
            <img src={post.thumbnail_url} alt={post.title} className="w-full h-[400px] object-cover rounded-3xl mb-12 shadow-2xl" />
          )}
          
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">{post.category}</span>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Calendar size={14} /> {formatDate(post.created_at)}
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <User size={14} /> 플래터 연구소
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Eye size={14} /> {post.view_count} views
            </div>
            <button 
              onClick={handleShare}
              className="ml-auto text-slate-400 hover:text-blue-600 transition-colors"
              title="공유하기"
            >
              <Share2 size={20} />
            </button>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">{post.title}</h1>
        </header>
        
        <div 
          className="prose prose-lg max-w-none text-slate-700 leading-relaxed mb-16 ql-editor prose-p:my-3 prose-headings:mt-6 prose-headings:mb-3"
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
    </div>
  );
};

export default BlogPost;
