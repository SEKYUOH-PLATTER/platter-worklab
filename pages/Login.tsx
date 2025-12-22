import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, Loader2 } from 'lucide-react';
import SEO from '../components/SEO';

const Login: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (!adminPassword) {
      alert('서버 설정 오류: 비밀번호 환경변수가 없습니다.');
      setError('환경변수 설정 오류');
      setIsLoading(false);
      return;
    }

    if (password === adminPassword) {
      localStorage.setItem('isAdminAuthenticated', 'true');
      navigate('/admin');
    } else {
      alert('비밀번호가 일치하지 않습니다.');
      setError('올바르지 않은 비밀번호입니다.');
      setPassword('');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <SEO title="관리자 로그인" />
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl animate-fade-in">
        <div className="w-16 h-16 bg-blue-600/20 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Lock size={32} />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2 text-center">Platter Admin</h1>
        <p className="text-slate-500 text-center mb-8">보안 구역입니다. 계속하려면 암호를 입력하세요.</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <input 
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              disabled={isLoading}
              className={`w-full bg-slate-800 border ${error ? 'border-red-500' : 'border-slate-700'} text-white rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50`}
            />
            {error && (
              <div className="absolute -bottom-6 left-0 flex items-center gap-1 text-red-500 text-xs font-medium">
                <AlertCircle size={12} /> {error}
              </div>
            )}
          </div>
          
          <button 
            type="submit"
            disabled={isLoading || !password}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all mt-4 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> 로그인 중...
              </>
            ) : (
              '접속하기'
            )}
          </button>
        </form>
        
        <p className="mt-8 text-center text-slate-600 text-[10px] uppercase tracking-widest font-bold">
          Platter WorkLab Internal System
        </p>
      </div>
    </div>
  );
};

export default Login;
