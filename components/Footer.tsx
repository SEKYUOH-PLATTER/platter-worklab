
import React from 'react';

const Footer: React.FC = () => {
  return (
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
          <div className="text-sm">
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-1">
              <li>Email: contact@platter.lab</li>
              <li>Phone: 02-1234-5678</li>
              <li>Address: 서울시 강남구 테헤란로 123</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-800 text-xs flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2024 Platter WorkLab. All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors underline underline-offset-4">이용약관</a>
            <a href="#" className="hover:text-white transition-colors underline underline-offset-4">개인정보처리방침</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
