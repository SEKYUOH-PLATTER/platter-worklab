
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  BarChart3, 
  Target, 
  Zap, 
  CheckCircle2, 
  X,
  Users,
  Briefcase,
  GraduationCap,
  Layers,
  Search,
  CheckCircle,
  Quote,
  Building2,
  Building
} from 'lucide-react';
import SEO from '../components/SEO';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const ScrollReveal: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('전체');

  const curriculumCategories = [
    '전체',
    '계층별 교육',
    '직무별 교육',
    '주제별 교육'
  ];

  const curriculumCards = [
    {
      category: '계층별 교육',
      title: '신입사원 AI 기초 & 리터러시',
      items: ['생성형 AI 기초 개념', '프롬프트 입문 시나리오', '기초 업무 자동화 실습'],
      icon: <Users className="text-blue-600" />
    },
    {
      category: '계층별 교육',
      title: '리더를 위한 AI 전략 워크숍',
      items: ['AI 도입 의사결정 프레임워크', '팀 생산성 측정 지표', 'AI 조직 문화 구축'],
      icon: <Target className="text-blue-600" />
    },
    {
      category: '직무별 교육',
      title: '마케터를 위한 AI 콘텐츠 제작',
      items: ['AI 기반 카피라이팅 기법', '이미지/영상 자동 생성 프로세스', 'SNS 데이터 분석 및 보고'],
      icon: <Zap className="text-blue-600" />
    },
    {
      category: '직무별 교육',
      title: 'HR을 위한 데이터 분석 실무',
      items: ['채용 데이터 대시보드 구축', '임직원 근태/성과 시각화', 'AI 면접 질문지 자동 생성'],
      icon: <Briefcase className="text-blue-600" />
    },
    {
      category: '주제별 교육',
      title: '업무 자동화(RPA) 끝장 실습',
      items: ['노코드 툴 활용 업무 설계', '이메일/보고서 자동화', '데이터 크롤링 기초'],
      icon: <Layers className="text-blue-600" />
    },
    {
      category: '주제별 교육',
      title: '영업팀 AI 활용 세일즈 강화',
      items: ['잠재 고객 발굴 자동화', '세일즈 피칭 스크립트 최적화', 'CRM 연동 데이터 관리'],
      icon: <Search className="text-blue-600" />
    },
    {
      category: '직무별 교육',
      title: '전사 데이터 리터러시 기본',
      items: ['데이터 기반 가설 수립', '실무 엑셀 데이터 분석', 'BI 도구 시각화 실습'],
      icon: <BarChart3 className="text-blue-600" />
    },
    {
      category: '주제별 교육',
      title: '노코드 AI 도구 실전 활용',
      items: ['현업 맞춤형 AI 비서 구축', '업무 프로세스 최적화', '최신 AI 트렌드 업데이트'],
      icon: <GraduationCap className="text-blue-600" />
    },
  ];

  const testimonials = [
    {
      text: "단순히 툴 사용법을 넘어서 '어떻게 문제를 정의해야 하는지'를 배웠습니다. 교육 다음 날 바로 실무에 적용해 보고서 작성 시간을 70% 단축했습니다.",
      name: "김민아",
      company: "한성테크",
      title: "마케팅 팀장",
      img: "https://i.pravatar.cc/150?u=a"
    },
    {
      text: "비전공자인 저희 팀원들이 AI를 두려워하지 않고 자신의 업무 파트너로 인식하게 된 것이 가장 큰 수확입니다. 팀의 일하는 문화가 완전히 바뀌었습니다.",
      name: "이준석",
      company: "넥스트이노베이션",
      title: "COO",
      img: "https://i.pravatar.cc/150?u=b"
    },
    {
      text: "데이터 분석이 이렇게 재밌을 수 있다는 걸 처음 알았습니다. 엑셀과 AI의 결합은 정말 강력하네요. 실무 위주의 예제가 특히 도움되었습니다.",
      name: "박지현",
      company: "스타트업 솔루션",
      title: "인사 담당자",
      img: "https://i.pravatar.cc/150?u=c"
    }
  ];

  const companies = [
    "Company A", "Enterprise B", "Tech Solutions C", "Global Inc D",
    "Creative Studio E", "Financial Group F", "Innovate Co G", "Future Works H"
  ];

  const galleryImages = [
    '/images/gallery/edu-2.png',
    '/images/gallery/edu-1.png',
    '/images/gallery/edu-5.png',
    '/images/gallery/edu-3.png',
    '/images/gallery/edu-6.png',
    '/images/gallery/edu-4.png'
  ];

  const filteredCards = activeCategory === '전체' 
    ? curriculumCards 
    : curriculumCards.filter(card => card.category === activeCategory);

  return (
    <article className="w-full overflow-hidden">
      <SEO 
        title="Platter WorkLab" 
        description="Practical growth research for PMs. 비전공자 실무팀을 위한 데이터 기반 일하는 방식 & AI 활용 워크숍."
      />
      
      {/* 1. Hero Section */}
      <section id="top" className="relative bg-slate-900 pt-32 pb-20 md:pt-48 md:pb-40 px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/15 blur-[120px] rounded-full"></div>
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-400 text-xs font-bold mb-8 uppercase tracking-widest">
              <Zap size={14} /> Transform Your Team with AI
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-8 leading-[1.1]">
              PM 없이도 PM처럼 일하는 <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">팀을 만듭니다.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              비전공자 실무팀을 위한 데이터 기반 일하는 방식 & AI 활용 워크숍. <br className="hidden md:block" />
              단순 툴 교육이 아닌, 일을 바라보는 관점을 바꿉니다.
            </p>
            <div className="flex justify-center">
              <Link to="/contact" className="bg-blue-600 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/30 flex items-center gap-2 group">
                제안서 무료로 받기 <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. Insight Section */}
      <section id="about" className="py-24 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">왜 AI 교육을 들어도 실무는 그대로일까요?</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                대부분의 기업 교육은 도구(Tool) 사용법에 그칩니다. <br className="hidden md:block" />
                하지만 AI에게 '무엇을' 질문해야 할지 모르면 무용지물입니다.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-10">
            <ScrollReveal>
              <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 flex flex-col h-full transition-all grayscale hover:grayscale-0 opacity-80 hover:opacity-100">
                <div className="text-slate-400 font-bold mb-6 uppercase tracking-widest text-sm">Existing Training</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-8">기존의 툴 중심 교육</h3>
                <ul className="space-y-5 mb-12">
                  {["기능 나열식 커리큘럼", "현업과 동떨어진 예제", "일회성 교육으로 인한 휘발", "AI 툴 조작법만 익힘"].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 text-slate-500 font-medium">
                      <X className="text-red-400 shrink-0 mt-1" size={20} /> {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto bg-white p-6 rounded-2xl border border-slate-100 text-center text-slate-400 italic text-sm">
                  "배우긴 했는데, 내 업무에 어떻게 쓰지?"
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="relative bg-blue-50 p-10 rounded-3xl border-2 border-blue-600 flex flex-col h-full shadow-2xl shadow-blue-600/10 overflow-hidden">
                <div className="absolute top-6 right-6 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">BEST CHOICE</div>
                <div className="text-blue-600 font-bold mb-6 uppercase tracking-widest text-sm">Platter WorkLab</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-8">플래터의 로직 중심 교육</h3>
                <ul className="space-y-5 mb-12">
                  {["문제 정의 중심의 접근법", "실무 데이터를 활용한 과제", "지속 가능한 업무 루틴 설계", "AI를 통한 의사결정 방식 학습"].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 text-slate-700 font-bold">
                      <CheckCircle2 className="text-blue-600 shrink-0 mt-1" size={20} /> {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto bg-blue-600 p-6 rounded-2xl text-center text-white font-bold text-sm">
                  "내일 바로 업무 시간을 3시간 줄일 수 있겠어요."
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 3. Solution Section */}
      <section className="py-24 bg-blue-50 px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4 block">Core Solution</span>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">AI 실무형 인재를 만드는 3가지 키워드</h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "문제 해결력 이식", 
                desc: "단순히 기술을 가르치지 않습니다. 문제를 어떻게 분해하고 AI와 협업할지 '사고 체계'를 바꿉니다.", 
                icon: <Target className="text-blue-600" size={32} /> 
              },
              { 
                title: "맞춤형 커리큘럼", 
                desc: "회사와 부서의 특성에 맞춰 최적화된 시나리오와 데이터를 기반으로 실제 업무 교육을 설계합니다.", 
                icon: <Zap className="text-blue-600" size={32} /> 
              },
              { 
                title: "생생한 실무 예제", 
                desc: "이론은 짧게, 실습은 길게. 강의장 문을 나서는 순간 바로 실행 가능한 Action Item을 도출합니다.", 
                icon: <BarChart3 className="text-blue-600" size={32} /> 
              }
            ].map((item, i) => (
              <ScrollReveal key={i}>
                <div className="bg-white p-10 rounded-3xl border border-slate-100 hover:shadow-2xl transition-all group h-full">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                    {React.cloneElement(item.icon as React.ReactElement<any>, { className: 'group-hover:text-white transition-colors' })}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed font-medium">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Curriculum Section */}
      <section id="curriculum" className="py-24 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">검증된 실무 강화 커리큘럼</h2>
              <p className="text-slate-600 text-lg">업무 도메인별 최적화된 AI/데이터 리터러시 로드맵을 확인하세요.</p>
            </div>
          </ScrollReveal>

          {/* Filter Tabs */}
          <ScrollReveal>
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              {curriculumCategories.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-8 py-3 rounded-full text-sm font-bold transition-all border ${
                    activeCategory === cat 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/20' 
                    : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredCards.map((card, i) => (
                <motion.div
                  key={card.title}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 hover:border-blue-200 hover:bg-white transition-all h-full group flex flex-col"
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {React.cloneElement(card.icon as React.ReactElement<any>, { size: 24, className: 'group-hover:text-white' })}
                  </div>
                  <div className="text-[10px] font-black text-blue-600 mb-3 uppercase tracking-widest">{card.category}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-6 leading-snug">{card.title}</h3>
                  <ul className="space-y-3 mt-auto border-t border-slate-200 pt-6">
                    {card.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-500 font-medium">
                        <CheckCircle size={14} className="text-blue-500 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* New: Client Logos (Social Proof) Section */}
      <section className="py-24 bg-white px-4 border-t border-slate-50">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">이미 혁신하는 기업들이 함께했습니다.</h2>
              <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full opacity-20"></div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {companies.map((company, i) => (
              <ScrollReveal key={i}>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl h-32 flex flex-col items-center justify-center p-6 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:scale-105 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group cursor-default">
                  <Building2 size={32} className="text-slate-400 group-hover:text-blue-600 transition-colors mb-2" />
                  <span className="text-xs font-bold text-slate-400 group-hover:text-slate-900 uppercase tracking-widest transition-colors">{company}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 bg-slate-50 px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4 block">Gallery</span>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">생생한 교육 현장</h2>
            </div>
          </ScrollReveal>

          {/* Mobile: Swiper Carousel */}
          <div className="block md:hidden">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={16}
              slidesPerView={1.2}
              centeredSlides={true}
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              className="pb-12"
            >
              {galleryImages.map((img, i) => (
                <SwiperSlide key={i}>
                  <div className="rounded-2xl overflow-hidden shadow-lg h-[250px]">
                    <img 
                      src={img} 
                      alt={`교육 현장 ${i + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Desktop: Bento Grid Layout */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-4">
            {galleryImages.map((img, i) => (
              <ScrollReveal key={i}>
                <div className={`rounded-2xl overflow-hidden shadow-lg ${i < 3 ? 'h-[320px]' : 'h-[240px]'}`}>
                  <img 
                    src={img} 
                    alt={`교육 현장 ${i + 1}`} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Testimonials Section */}
      <section className="py-24 bg-blue-50 px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4 block">Testimonials</span>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">수강생들의 생생한 후기</h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((review, i) => (
              <ScrollReveal key={i}>
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-900/5 relative h-full flex flex-col">
                  <Quote className="absolute top-10 right-10 text-blue-50 opacity-50" size={60} />
                  <p className="text-slate-700 leading-relaxed font-medium mb-10 relative z-10 flex-grow">"{review.text}"</p>
                  <div className="flex items-center gap-4 border-t border-slate-50 pt-8">
                    <img src={review.img} alt={review.name} className="w-14 h-14 rounded-full border-2 border-blue-100 shadow-sm" />
                    <div>
                      <div className="font-bold text-slate-900">{review.name}</div>
                      <div className="text-xs text-slate-500 font-bold">{review.company} · {review.title}</div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Final CTA */}
      <section className="py-24 bg-slate-900 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600 opacity-5 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <ScrollReveal>
            <h2 className="text-3xl md:text-6xl font-bold text-white mb-8 leading-tight tracking-tight">
              교육이 끝난 다음 날, <br />팀의 퇴근 시간이 달라집니다.
            </h2>
            <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              지금 바로 무료 상담을 신청하고 우리 회사에 최적화된 <br className="hidden md:block" />
              AI 교육 커리큘럼 제안서를 받아보세요.
            </p>
            <div className="flex justify-center">
              <Link to="/contact" className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 rounded-full text-xl font-bold transition-all shadow-2xl shadow-blue-600/30 group">
                교육 상담하기 <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </article>
  );
};

export default Home;