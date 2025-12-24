import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="bg-white w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl relative z-10 flex flex-col overflow-hidden animate-fade-in">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-6">
          <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
            {content}
          </div>
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
          <button 
            onClick={onClose} 
            className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

const PRIVACY_POLICY = `[개인정보처리방침]

1. 개인정보의 수집 및 이용 목적
플래터 워크랩은 기업 교육 및 컨설팅 문의 응대를 위해 필요한 최소한의 개인정보를 수집합니다.

2. 수집하는 개인정보의 항목
- 필수항목: 회사명, 담당자명, 이메일, 휴대전화번호, 직함

3. 개인정보의 보유 및 이용 기간
수집된 개인정보는 문의 처리 및 상담 이력 관리를 위해 3년간 보관 후 지체 없이 파기합니다.

4. 문의처
개인정보 관련 문의는 홈페이지 내 문의하기 또는 대표 이메일로 연락 주시기 바랍니다.`;

const TERMS_OF_SERVICE = `[이용약관]

제1조 (목적)
본 약관은 플래터 워크랩(이하 "회사")이 제공하는 웹사이트 및 제반 서비스의 이용 조건을 규정함을 목적으로 합니다.

제2조 (저작권의 귀속)
사이트 내 모든 콘텐츠(블로그 아티클, 교육 커리큘럼 등)의 저작권은 회사에 있으며, 사전 승인 없이 무단 복제 및 배포를 금합니다.

제3조 (면책)
회사는 이용자가 본 사이트의 정보를 활용하여 발생한 결과에 대해 법적인 책임을 지지 않습니다.`;

const Footer: React.FC = () => {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  return (
    <>
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Platter WorkLab</h2>
              <p className="text-slate-400 max-w-sm leading-relaxed text-sm">
                데이터와 AI로 일하는 방식을 혁신합니다.<br />
                일의 밀도를 높이는 실무 연구소 플래터 워크랩.
              </p>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-xs flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© 2025 Platter WorkLab. All Rights Reserved.</p>
            <div className="flex gap-6">
              <button 
                onClick={() => setShowTerms(true)}
                className="hover:text-white transition-colors underline underline-offset-4"
              >
                이용약관
              </button>
              <button 
                onClick={() => setShowPrivacy(true)}
                className="hover:text-white transition-colors underline underline-offset-4"
              >
                개인정보처리방침
              </button>
            </div>
          </div>
        </div>
      </footer>

      <Modal 
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        title="개인정보처리방침"
        content={PRIVACY_POLICY}
      />
      <Modal 
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        title="이용약관"
        content={TERMS_OF_SERVICE}
      />
    </>
  );
};

export default Footer;
