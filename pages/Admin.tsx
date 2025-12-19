
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Quill from 'quill';
import DOMPurify from 'dompurify';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  LogOut, 
  Image as ImageIcon,
  Send,
  Eye,
  Trash2,
  X,
  Calendar,
  User,
  ExternalLink
} from 'lucide-react';
import SEO from '../components/SEO';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('posts');
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [keyword, setKeyword] = useState('AI 활용');
  const [imageUrl, setImageUrl] = useState('');
  const [summary, setSummary] = useState('');
  
  const quillRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<Quill | null>(null);

  useEffect(() => {
    if (activeTab === 'new' && quillRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(quillRef.current, {
        theme: 'snow',
        placeholder: '실무자들에게 도움이 될 인사이트를 작성해 주세요...',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
          ],
        }
      });
    }
    
    return () => {
      if (activeTab !== 'new') {
        quillInstance.current = null;
      }
    };
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/login');
  };

  const handlePublish = () => {
    if (!quillInstance.current) return;
    setIsPublishing(true);
    
    const editorContent = quillInstance.current.root.innerHTML;
    const cleanHtml = DOMPurify.sanitize(editorContent);
    
    console.log("Publishing Post:", {
      title,
      keyword,
      imageUrl,
      summary,
      content: cleanHtml
    });
    
    setTimeout(() => {
      setIsPublishing(false);
      setActiveTab('posts');
      alert('게시물이 성공적으로 발행되었습니다.');
      // Reset form
      setTitle('');
      setImageUrl('');
      setSummary('');
    }, 1500);
  };

  const PreviewModal = () => {
    if (!showPreview) return null;
    const content = quillInstance.current?.root.innerHTML || '';
    const cleanHtml = DOMPurify.sanitize(content);

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowPreview(false)}></div>
        <div className="bg-white w-full max-w-4xl h-full max-h-[90vh] rounded-[2.5rem] shadow-2xl relative z-10 flex flex-col overflow-hidden animate-fade-in">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
              <Eye size={18} /> 미리보기 모드
            </div>
            <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
              <X size={24} />
            </button>
          </div>
          
          <div className="flex-grow overflow-y-auto p-8 md:p-12">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">{keyword}</span>
                <div className="text-slate-400 text-sm flex items-center gap-1">
                  <Calendar size={14} /> 2024.12.01
                </div>
                <div className="text-slate-400 text-sm flex items-center gap-1">
                  <User size={14} /> 플래터 연구소
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">{title || '제목 없음'}</h1>
              {imageUrl && <img src={imageUrl} alt="Preview" className="w-full h-64 md:h-96 object-cover rounded-3xl mb-10 shadow-lg" />}
              <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed ql-editor !p-0" dangerouslySetInnerHTML={{ __html: cleanHtml }}></div>
            </div>
          </div>
          
          <div className="p-6 border-t border-slate-100 bg-slate-50 text-center">
            <button onClick={() => setShowPreview(false)} className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all">
              닫기
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      <SEO title="관리자 대시보드" />
      
      {/* Admin Sidebar - Fixed Full Height */}
      <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col h-full z-20 shrink-0">
        <div className="p-8">
          <Link to="/" className="text-xl font-bold text-white mb-8 block hover:text-blue-400 transition-colors">
            Platter WorkLab
          </Link>
          <div className="flex items-center gap-3 p-4 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-600/30">
            <LayoutDashboard size={22} />
            <span className="font-bold">Admin Console</span>
          </div>
        </div>
        
        <nav className="flex-grow space-y-2 px-6">
          <button 
            onClick={() => setActiveTab('posts')}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl font-bold transition-all ${activeTab === 'posts' ? 'bg-slate-800 text-white shadow-inner' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
          >
            <FileText size={20} /> 블로그 관리
          </button>
          <button 
            onClick={() => setActiveTab('new')}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl font-bold transition-all ${activeTab === 'new' ? 'bg-slate-800 text-white shadow-inner' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
          >
            <PlusCircle size={20} /> 새 글 작성
          </button>
        </nav>
        
        <div className="p-8 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-white font-bold">A</div>
            <div>
              <div className="text-white text-sm font-bold">Administrator</div>
              <div className="text-slate-500 text-xs">Super User</div>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-4 rounded-xl font-bold text-red-400 hover:bg-red-400/10 transition-all">
            <LogOut size={20} /> 안전 로그아웃
          </button>
        </div>
      </aside>

      {/* Admin Content - Scrollable */}
      <main className="flex-grow h-full overflow-y-auto bg-slate-50 relative">
        <div className="p-8 md:p-12 max-w-6xl mx-auto">
          {activeTab === 'posts' && (
            <div className="animate-fade-in">
              <header className="flex justify-between items-end mb-10">
                <div>
                  <h1 className="text-4xl font-bold text-slate-900 tracking-tight">블로그 게시물 관리</h1>
                  <p className="text-slate-500 mt-2 text-lg">플랫폼에 등록된 콘텐츠의 성과를 확인하고 관리하세요.</p>
                </div>
                <button onClick={() => setActiveTab('new')} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95">
                  <PlusCircle size={20} /> 새 글 작성
                </button>
              </header>
              
              <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100">
                      <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">게시물 제목</th>
                      <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">조회수</th>
                      <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">등록 날짜</th>
                      <th className="px-8 py-6"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {[
                      { title: '비전공자 프롬프트 엔지니어링 마스터', views: '1,245', date: '2024.11.20', keyword: 'AI 활용' },
                      { title: '데이터 마케팅 전략: 숫자가 성과를 만든다', views: '852', date: '2024.11.18', keyword: '데이터 분석' },
                      { title: '엑셀 보고서 자동화 레시피 10선', views: '2,104', date: '2024.11.15', keyword: '업무 효율' },
                      { title: '2025년, 일하는 방식은 어떻게 변할까', views: '450', date: '2024.11.12', keyword: '트렌드' },
                      { title: '팀장님을 위한 파이썬 실무 가이드', views: '98', date: '2024.11.08', keyword: '파이썬' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{row.title}</div>
                          <div className="inline-block mt-2 px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded uppercase tracking-widest">{row.keyword}</div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-slate-600 font-medium">
                            <span className="text-blue-600 font-bold">{row.views}</span> views
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm text-slate-400 font-medium">{row.date}</td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                            <button className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 rounded-xl transition-all shadow-sm">
                              <ExternalLink size={18} />
                            </button>
                            <button className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 rounded-xl transition-all shadow-sm">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'new' && (
            <div className="animate-fade-in">
              <header className="flex justify-between items-center mb-10">
                <div>
                  <h1 className="text-4xl font-bold text-slate-900 tracking-tight">새 블로그 게시물 작성</h1>
                  <p className="text-slate-500 mt-2 text-lg">전문적인 인사이트를 전파하고 잠재 고객과 소통하세요.</p>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setActiveTab('posts')} className="px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-white border border-transparent hover:border-slate-200 transition-all active:scale-95">취소</button>
                  <button 
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 flex items-center gap-2 disabled:opacity-50 active:scale-95"
                  >
                    {isPublishing ? '게시 중...' : <><Send size={20} /> 게시하기</>}
                  </button>
                </div>
              </header>

              <div className="grid lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-900 ml-1">게시물 제목</label>
                      <input 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white text-2xl font-bold transition-all" 
                        placeholder="독자의 시선을 끄는 제목을 입력하세요" 
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-900 ml-1">본문 에디터</label>
                      <div className="min-h-[500px] border border-slate-100 rounded-2xl overflow-hidden shadow-inner bg-white">
                        <div ref={quillRef} className="!border-none"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8 sticky top-8">
                    <h3 className="font-bold text-slate-900 text-xl border-b border-slate-50 pb-6">콘텐츠 상세 설정</h3>
                    
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">카테고리 분류</label>
                      <input 
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white font-bold text-slate-700 transition-all"
                        placeholder="예: AI 활용, Insight, News"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Thumbnail Image URL</label>
                      <div className="relative">
                        <input 
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 pl-12 outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white text-sm transition-all" 
                          placeholder="https://images.unsplash.com/..." 
                        />
                        <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 ml-1 leading-relaxed">
                        * Enter a direct image link (e.g., Unsplash). File upload feature will be implemented later.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">게시물 요약 (SEO)</label>
                      <textarea 
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        rows={4} 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white text-sm resize-none leading-relaxed transition-all" 
                        placeholder="SNS나 검색 엔진에 노출될 간결한 요약문을 입력하세요." 
                      />
                    </div>

                    <div className="pt-6 border-t border-slate-50">
                      <button 
                        onClick={() => setShowPreview(true)}
                        className="w-full flex items-center justify-center gap-3 py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98]"
                      >
                        <Eye size={20} /> 실시간 미리보기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Modals */}
      <PreviewModal />
    </div>
  );
};

// Internal Link component replacement for local logic
const Link = ({ to, children, className }: any) => {
  const navigate = useNavigate();
  return (
    <a 
      href={`#${to}`} 
      onClick={(e) => { e.preventDefault(); navigate(to); }}
      className={className}
    >
      {children}
    </a>
  );
};

export default Admin;
