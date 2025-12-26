import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Quill from 'quill';
import DOMPurify from 'dompurify';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
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
  ExternalLink,
  MessageSquare,
  Loader2,
  Mail,
  Phone,
  Building2
} from 'lucide-react';
import SEO from '../components/SEO';
import { BlogPost, Contact } from '../types';
import { supabase } from '../lib/supabaseClient';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('posts');
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('AI 활용');
  const [imageUrl, setImageUrl] = useState('');
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  const quillRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<Quill | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'posts') {
      fetchPosts();
    } else if (activeTab === 'inquiries') {
      fetchContacts();
    }
  }, [activeTab]);

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

  const handlePublish = async () => {
    if (!quillInstance.current || !title) return;
    setIsPublishing(true);
    
    const editorContent = quillInstance.current.root.innerHTML;
    const cleanHtml = DOMPurify.sanitize(editorContent);
    
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            title,
            category,
            thumbnail_url: imageUrl,
            content: cleanHtml,
            view_count: 0
          }
        ])
        .select();

      if (error) throw error;

      alert('게시물이 성공적으로 발행되었습니다.');
      setTitle('');
      setImageUrl('');
      setCategory('AI 활용');
      if (quillInstance.current) {
        quillInstance.current.root.innerHTML = '';
      }
      setActiveTab('posts');
    } catch (error: any) {
      alert('게시 실패: ' + error.message);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (error: any) {
      alert('삭제 실패: ' + error.message);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy.MM.dd HH:mm', { locale: ko });
    } catch {
      return dateString;
    }
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
                <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">{category}</span>
                <div className="text-slate-400 text-sm flex items-center gap-1">
                  <Calendar size={14} /> {format(new Date(), 'yyyy.MM.dd')}
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

  const ContactDetailModal = () => {
    if (!selectedContact) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedContact(null)}></div>
        <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-fade-in">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2 text-slate-700 font-bold text-lg">
              <MessageSquare size={20} /> 문의 상세
            </div>
            <button onClick={() => setSelectedContact(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
              <X size={24} />
            </button>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="flex items-center gap-3">
              <Building2 size={20} className="text-blue-600" />
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">회사명</p>
                <p className="text-lg font-bold text-slate-900">{selectedContact.company_name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <User size={20} className="text-blue-600" />
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">담당자</p>
                <p className="text-lg font-bold text-slate-900">{selectedContact.contact_person}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-blue-600" />
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">이메일</p>
                <a href={`mailto:${selectedContact.email}`} className="text-lg font-bold text-blue-600 hover:underline">{selectedContact.email}</a>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone size={20} className="text-blue-600" />
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">연락처</p>
                <a href={`tel:${selectedContact.phone}`} className="text-lg font-bold text-blue-600 hover:underline">{selectedContact.phone}</a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">직원 수</p>
                <p className="text-slate-700 font-medium">{selectedContact.employee_count || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">직함</p>
                <p className="text-slate-700 font-medium">{selectedContact.job_title || '-'}</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400 font-bold uppercase mb-2">문의 내용</p>
              <p className="text-slate-700 bg-slate-50 p-4 rounded-xl">{selectedContact.message || '내용 없음'}</p>
            </div>
            
            <div className="text-xs text-slate-400 text-right">
              접수일: {formatDate(selectedContact.created_at)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      <SEO title="관리자 대시보드" />
      
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
          <button 
            onClick={() => setActiveTab('inquiries')}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl font-bold transition-all ${activeTab === 'inquiries' ? 'bg-slate-800 text-white shadow-inner' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
          >
            <MessageSquare size={20} /> 문의 내역
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
              
              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 size={48} className="animate-spin text-blue-600" />
                </div>
              ) : posts.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-20 text-center">
                  <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500 text-lg">등록된 게시물이 없습니다.</p>
                  <button onClick={() => setActiveTab('new')} className="mt-6 text-blue-600 font-bold hover:underline">
                    첫 게시물 작성하기
                  </button>
                </div>
              ) : (
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
                      {posts.map((post) => (
                        <tr key={post.id} className="hover:bg-blue-50/30 transition-colors group">
                          <td className="px-8 py-6">
                            <div className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{post.title}</div>
                            <div className="inline-block mt-2 px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded uppercase tracking-widest">{post.category}</div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2 text-slate-600 font-medium">
                              <span className="text-blue-600 font-bold">{post.view_count.toLocaleString()}</span> views
                            </div>
                          </td>
                          <td className="px-8 py-6 text-sm text-slate-400 font-medium">{formatDate(post.created_at)}</td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                              <button className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 rounded-xl transition-all shadow-sm">
                                <ExternalLink size={18} />
                              </button>
                              <button 
                                onClick={() => handleDeletePost(post.id)}
                                className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 rounded-xl transition-all shadow-sm"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'inquiries' && (
            <div className="animate-fade-in">
              <header className="mb-10">
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight">문의 내역</h1>
                <p className="text-slate-500 mt-2 text-lg">접수된 교육 문의를 확인하고 관리하세요.</p>
              </header>
              
              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 size={48} className="animate-spin text-blue-600" />
                </div>
              ) : contacts.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-20 text-center">
                  <MessageSquare size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500 text-lg">접수된 문의가 없습니다.</p>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50 overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-100">
                        <th className="px-6 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">회사명</th>
                        <th className="px-6 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">담당자</th>
                        <th className="px-6 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">직원 수</th>
                        <th className="px-6 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">직함</th>
                        <th className="px-6 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">연락처</th>
                        <th className="px-6 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">접수일</th>
                        <th className="px-6 py-6"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {contacts.map((contact) => (
                        <tr key={contact.id} className="hover:bg-blue-50/30 transition-colors group cursor-pointer" onClick={() => setSelectedContact(contact)}>
                          <td className="px-6 py-6">
                            <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{contact.company_name}</div>
                          </td>
                          <td className="px-6 py-6 text-slate-600">{contact.contact_person}</td>
                          <td className="px-6 py-6 text-slate-500 text-sm">{contact.employee_count || '-'}</td>
                          <td className="px-6 py-6 text-slate-500 text-sm">{contact.job_title || '-'}</td>
                          <td className="px-6 py-6 text-slate-600 text-sm">{contact.email}</td>
                          <td className="px-6 py-6 text-sm text-slate-400 font-medium">{formatDate(contact.created_at)}</td>
                          <td className="px-6 py-6 text-right">
                            <button className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 rounded-xl transition-all shadow-sm opacity-0 group-hover:opacity-100">
                              <Eye size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
                    disabled={isPublishing || !title}
                    className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 flex items-center gap-2 disabled:opacity-50 active:scale-95"
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 size={20} className="animate-spin" /> 게시 중...
                      </>
                    ) : (
                      <>
                        <Send size={20} /> 게시하기
                      </>
                    )}
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
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
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
      
      <PreviewModal />
      <ContactDetailModal />
    </div>
  );
};

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
