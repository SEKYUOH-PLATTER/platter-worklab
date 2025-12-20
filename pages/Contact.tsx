import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { supabase } from '../lib/supabaseClient';
import { ContactForm } from '../types';
import SEO from '../components/SEO';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactForm>({
    companyName: '',
    employees: '',
    contactName: '',
    jobTitle: '',
    department: '',
    email: '',
    phone: '',
    needs: '',
    agreement: false
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSpamCheckPassed, setIsSpamCheckPassed] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => setCooldown(c => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const isFormValid = 
    formData.companyName && 
    formData.contactName && 
    formData.email && 
    formData.phone && 
    formData.agreement &&
    isSpamCheckPassed &&
    cooldown === 0 &&
    !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    const now = Date.now();
    if (now - lastSubmitTime < 10000) {
      setCooldown(10);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert([{
          company_name: formData.companyName,
          contact_person: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          message: formData.needs,
          employee_count: formData.employees,
          job_title: formData.jobTitle,
        }]);

      if (error) {
        throw error;
      }

      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey) {
        try {
          await emailjs.send(serviceId, templateId, {
            company_name: formData.companyName,
            employee_count: formData.employees,
            contact_name: formData.contactName,
            job_title: formData.jobTitle,
            email: formData.email,
            phone: formData.phone,
            message: formData.needs,
          }, publicKey);
        } catch (emailError) {
          console.warn('Email notification failed:', emailError);
        }
      }

      setLastSubmitTime(Date.now());
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      console.error('Contact submission error:', error);
      setSubmitError(error.message || 'Failed to submit. Please try again.');
      alert('Error: ' + (error.message || 'Failed to submit'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (submitted) {
    return (
      <div className="pt-40 pb-32 px-4 max-w-7xl mx-auto text-center min-h-[70vh] flex flex-col justify-center items-center animate-fade-in">
        <SEO title="문의 완료" />
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">문의가 성공적으로 접수되었습니다.</h1>
        <p className="text-slate-600 text-lg mb-8">24시간 이내에 담당자가 남겨주신 연락처로 연락 드리겠습니다.<br />플래터 워크랩에 관심을 가져주셔서 감사합니다.</p>
        <button 
          onClick={() => window.location.href = '#/'}
          className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
        >
          메인으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-4 bg-slate-50 min-h-screen">
      <SEO title="교육 문의" description="플래터 워크랩 교육 문의. 문의를 남겨주시면 24시간 이내에 전문가가 최적의 커리큘럼을 제안해 드립니다." />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/3">
            <h1 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">플래터 워크랩 <br />교육 문의</h1>
            <p className="text-slate-600 mb-12 leading-relaxed">
              도구 학습을 넘어, 일하는 관점을 바꾸는 실무 교육을 제안합니다. 
              문의를 남겨주시면 기업 상황에 맞는 커리큘럼 샘플과 함께 24시간 이내에 연락 드리겠습니다.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Email</h3>
                  <p className="text-slate-500">contact@platter.lab</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Phone</h3>
                  <p className="text-slate-500">02-1234-5678</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Address</h3>
                  <p className="text-slate-500">서울시 강남구 테헤란로 123, 10층</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-2/3 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 relative">
            {cooldown > 0 && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-[2.5rem]">
                <AlertCircle size={48} className="text-amber-500 mb-4" />
                <h3 className="text-xl font-bold text-slate-900">잠시만 기다려 주세요</h3>
                <p className="text-slate-600 mt-2">중복 제출 방지를 위해 {cooldown}초 후에 다시 시도해 주세요.</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
                  <AlertCircle size={20} />
                  {submitError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">회사명 *</label>
                  <input 
                    name="companyName"
                    required
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                    placeholder="플래터 컴퍼니"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">전체 직원 수</label>
                  <select 
                    name="employees"
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                  >
                    <option value="">선택하세요</option>
                    <option value="1-10">10명 미만</option>
                    <option value="10-50">10명 - 50명</option>
                    <option value="50-200">50명 - 200명</option>
                    <option value="200+">200명 이상</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">문의자 성함 *</label>
                  <input 
                    name="contactName"
                    required
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                    placeholder="홍길동"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">직함 / 부서</label>
                  <input 
                    name="jobTitle"
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                    placeholder="마케팅 팀장"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">이메일 *</label>
                  <input 
                    name="email"
                    type="email"
                    required
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                    placeholder="contact@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">연락처 *</label>
                  <input 
                    name="phone"
                    required
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                    placeholder="010-1234-5678"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">교육 니즈 (관심 커리큘럼 등)</label>
                <textarea 
                  name="needs"
                  rows={4}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none" 
                  placeholder="예: 전 부사원 대상의 기초 AI 활용 교육이 필요합니다."
                ></textarea>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      id="spamcheck"
                      checked={isSpamCheckPassed}
                      onChange={(e) => setIsSpamCheckPassed(e.target.checked)}
                      className="w-6 h-6 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                    />
                  </div>
                  <label htmlFor="spamcheck" className="text-sm font-bold text-slate-700 cursor-pointer">
                    로봇이 아닙니다
                  </label>
                </div>
                <div className="flex flex-col items-end opacity-50 grayscale scale-75">
                  <ShieldCheck size={24} className="text-slate-400" />
                  <span className="text-[8px] font-bold uppercase tracking-widest mt-1">reCAPTCHA v2</span>
                </div>
              </div>

              <div className="flex items-center gap-3 py-2">
                <input 
                  id="agreement"
                  name="agreement"
                  type="checkbox"
                  required
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500" 
                />
                <label htmlFor="agreement" className="text-sm text-slate-600">
                  <span className="text-red-500">*</span> 개인정보 수집 및 이용에 동의합니다.
                </label>
              </div>

              <button 
                type="submit"
                disabled={!isFormValid}
                className={`w-full py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                  isFormValid 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-600/20 active:scale-[0.98]' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> 제출 중...
                  </>
                ) : (
                  <>
                    문의 신청하기 <Send size={20} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
