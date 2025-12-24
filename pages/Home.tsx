import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import SEO from "../components/SEO";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Marquee from "react-fast-marquee";

const ScrollReveal: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
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
  const [activeCategory, setActiveCategory] = useState("전체");

  const curriculumCategories = [
    "전체",
    "계층별 교육",
    "직무별 교육",
    "주제별 교육",
  ];

  const curriculumCards = [
    {
      category: "계층별 교육",
      title: "신입사원 AI 기초 & 리터러시",
      items: [
        "생성형 AI 기초 개념",
        "프롬프트 입문 시나리오",
        "기초 업무 자동화 실습",
      ],
      icon: <Users className="text-blue-600" />,
    },
    {
      category: "계층별 교육",
      title: "리더를 위한 AI 전략 워크숍",
      items: [
        "AI 도입 의사결정 프레임워크",
        "팀 생산성 측정 지표",
        "AI 조직 문화 구축",
      ],
      icon: <Target className="text-blue-600" />,
    },
    {
      category: "직무별 교육",
      title: "마케터를 위한 AI 콘텐츠 제작",
      items: [
        "AI 기반 카피라이팅 기법",
        "이미지/영상 자동 생성 프로세스",
        "SNS 데이터 분석 및 보고",
      ],
      icon: <Zap className="text-blue-600" />,
    },
    {
      category: "직무별 교육",
      title: "HR을 위한 데이터 분석 실무",
      items: [
        "채용 데이터 대시보드 구축",
        "임직원 근태/성과 시각화",
        "AI 면접 질문지 자동 생성",
      ],
      icon: <Briefcase className="text-blue-600" />,
    },
    {
      category: "주제별 교육",
      title: "업무 자동화(RPA) 끝장 실습",
      items: [
        "노코드 툴 활용 업무 설계",
        "이메일/보고서 자동화",
        "데이터 크롤링 기초",
      ],
      icon: <Layers className="text-blue-600" />,
    },
    {
      category: "주제별 교육",
      title: "영업팀 AI 활용 세일즈 강화",
      items: [
        "잠재 고객 발굴 자동화",
        "세일즈 피칭 스크립트 최적화",
        "CRM 연동 데이터 관리",
      ],
      icon: <Search className="text-blue-600" />,
    },
    {
      category: "직무별 교육",
      title: "전사 데이터 리터러시 기본",
      items: [
        "데이터 기반 가설 수립",
        "실무 엑셀 데이터 분석",
        "BI 도구 시각화 실습",
      ],
      icon: <BarChart3 className="text-blue-600" />,
    },
    {
      category: "주제별 교육",
      title: "노코드 AI 도구 실전 활용",
      items: [
        "현업 맞춤형 AI 비서 구축",
        "업무 프로세스 최적화",
        "최신 AI 트렌드 업데이트",
      ],
      icon: <GraduationCap className="text-blue-600" />,
    },
  ];

  const testimonials = [
    {
      text: "단순히 툴 사용법을 넘어서 '어떻게 문제를 정의해야 하는지'를 배웠습니다. 교육 다음 날 바로 실무에 적용해 보고서 작성 시간을 70% 단축했습니다.",
      name: "김민아",
      company: "한성테크",
      title: "마케팅 팀장",
      img: "https://i.pravatar.cc/150?u=a",
    },
    {
      text: "비전공자인 저희 팀원들이 AI를 두려워하지 않고 자신의 업무 파트너로 인식하게 된 것이 가장 큰 수확입니다. 팀의 일하는 문화가 완전히 바뀌었습니다.",
      name: "이준석",
      company: "넥스트이노베이션",
      title: "COO",
      img: "https://i.pravatar.cc/150?u=b",
    },
    {
      text: "데이터 분석이 이렇게 재밌을 수 있다는 걸 처음 알았습니다. 엑셀과 AI의 결합은 정말 강력하네요. 실무 위주의 예제가 특히 도움되었습니다.",
      name: "박지현",
      company: "스타트업 솔루션",
      title: "인사 담당자",
      img: "https://i.pravatar.cc/150?u=c",
    },
  ];

  const clientLogos = [
    "/images/logos/logo_1.png",
    "/images/logos/logo_2.png",
    "/images/logos/logo_3.png",
    "/images/logos/logo_4.png",
    "/images/logos/logo_5.png",
    "/images/logos/logo_6.png",
    "/images/logos/logo_7.png",
    "/images/logos/logo_8.png",
    "/images/logos/logo_9.png",
    "/images/logos/logo_10.png",
  ];

  const galleryImages = [
    "/images/gallery/edu_1.jpg",
    "/images/gallery/edu_2.jpg",
    "/images/gallery/edu_3.jpg",
    "/images/gallery/edu_4.jpg",
    "/images/gallery/edu_5.png",
    "/images/gallery/edu_6.jpg",
  ];

  const filteredCards =
    activeCategory === "전체"
      ? curriculumCards
      : curriculumCards.filter((card) => card.category === activeCategory);

  return (
    <article className="w-full overflow-hidden">
      <SEO
        title="Platter WorkLab"
        description="Practical growth research for PMs. 비전공자 실무팀을 위한 데이터 기반 일하는 방식 & AI 활용 워크숍."
      />

      {/* 1. Hero Section */}
      <section
        id="top"
        className="relative bg-slate-900 pt-32 pb-20 md:pt-48 md:pb-40 px-4"
      >
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
              개발 지식 없는 우리 팀, <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                내일부터 바로 쓰는 AI 실무 교육
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              이론만 듣고 끝나는 강의는 멈추세요.{" "}
              <br className="hidden md:block" />
              AI와 데이터로 일의 밀도를 혁신하는 실무 연구소, 플래터
              워크랩입니다.
            </p>
            <div className="flex justify-center">
              <Link
                to="/contact"
                className="bg-blue-600 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/30 flex items-center gap-2 group"
              >
                무료 커리큘럼 제안받기{" "}
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
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
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                왜 많은 기업 교육이 현업에 적용되지 않을까요?
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                트렌드 특강만으로는 실무가 바뀌지 않습니다. 복잡한 코딩이나
                어려운 이론은 뺍니다. <br className="hidden md:block" />
                비개발자 직군이 당장 업무 효율을 높일 수 있는{" "}
                <strong>'검증된 방법론'</strong>만 전달합니다.
              </p>
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                {["#눈높이교육", "#맞춤커리큘럼", "#실무해결"].map((tag, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-bold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-10">
            <ScrollReveal>
              <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 flex flex-col h-full transition-all grayscale hover:grayscale-0 opacity-80 hover:opacity-100">
                <div className="text-slate-400 font-bold mb-6 uppercase tracking-widest text-sm">
                  Existing Training
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-8">
                  기존의 툴 중심 교육
                </h3>
                <ul className="space-y-5 mb-12">
                  {[
                    "기능 나열식 커리큘럼",
                    "현업과 동떨어진 예제",
                    "일회성 교육으로 인한 휘발",
                    "AI 툴 조작법만 익힘",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-4 text-slate-500 font-medium"
                    >
                      <X className="text-red-400 shrink-0 mt-1" size={20} />{" "}
                      {item}
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
                <div className="absolute top-6 right-6 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  BEST CHOICE
                </div>
                <div className="text-blue-600 font-bold mb-6 uppercase tracking-widest text-sm">
                  Platter WorkLab
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-8">
                  플래터 워크랩의 실무 중심 교육
                </h3>
                <ul className="space-y-5 mb-12">
                  {[
                    "문제 정의 중심의 접근법",
                    "실무 데이터를 활용한 과제",
                    "수강생 실습을 통한 결과물 창출",
                    "AI를 통한 의사결정 방식 학습",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-4 text-slate-700 font-bold"
                    >
                      <CheckCircle2
                        className="text-blue-600 shrink-0 mt-1"
                        size={20}
                      />{" "}
                      {item}
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
              <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4 block">
                Core Solution
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                우리 회사에 지금 필요한 교육은 무엇인가요?
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "전사 임직원 특강",
                desc: "'AI가 일을 대신해주진 않지만, AI를 쓰는 사람이 당신을 대체합니다.' 생성형 AI의 기본 개념부터 업무 활용 마인드셋까지.",
                icon: <Target className="text-blue-600" size={32} />,
              },
              {
                title: "칼퇴를 부르는 업무 자동화",
                desc: "지겨운 반복 작업, 엑셀 VBA와 Python, 챗봇을 활용해 버튼 하나로 끝내는 워크플로우 설계와 업무 자동화 파이프라인 구축 실습.",
                icon: <Zap className="text-blue-600" size={32} />,
              },
              {
                title: "AI를 활용한 실전 데이터 분석",
                desc: "데이터 분석가 없이도 괜찮습니다. 복잡한 툴 대신 AI를 활용해 스스로 데이터를 추출하고 인사이트를 찾는 실전 데이터 리터러시.",
                icon: <BarChart3 className="text-blue-600" size={32} />,
              },
            ].map((item, i) => (
              <ScrollReveal key={i}>
                <div className="bg-white p-10 rounded-3xl border border-slate-100 hover:shadow-2xl transition-all group h-full">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                    {React.cloneElement(item.icon as React.ReactElement<any>, {
                      className: "group-hover:text-white transition-colors",
                    })}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {item.desc}
                  </p>
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
              <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4 block">
                Curriculums
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                검증된 실무 강화 커리큘럼
              </h2>
              <p className="text-slate-600 text-lg">
                업무 도메인별 최적화된 AI/데이터 리터러시 로드맵을 확인하세요.
              </p>
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
                      ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/20"
                      : "bg-white border-slate-200 text-slate-500 hover:border-blue-300"
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
                    {React.cloneElement(card.icon as React.ReactElement<any>, {
                      size: 24,
                      className: "group-hover:text-white",
                    })}
                  </div>
                  <div className="text-[10px] font-black text-blue-600 mb-3 uppercase tracking-widest">
                    {card.category}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-6 leading-snug">
                    {card.title}
                  </h3>
                  <ul className="space-y-3 mt-auto border-t border-slate-200 pt-6">
                    {card.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-slate-500 font-medium"
                      >
                        <CheckCircle
                          size={14}
                          className="text-blue-500 shrink-0 mt-0.5"
                        />
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
              <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4 block">
                Training References
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                주요 출강 레퍼런스
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                스타트업부터 대기업까지, 다양한 현장의 실무자들과 함께 성과를
                만들고 있습니다.
              </p>
            </div>
          </ScrollReveal>

          <Marquee
            speed={80}
            gradient={true}
            gradientColor="white"
            gradientWidth={100}
            pauseOnHover={true}
          >
            {clientLogos.map((logo, i) => (
              <div key={i} className="mx-8 w-40 h-24 flex items-center justify-center">
                <img
                  src={logo}
                  alt={`클라이언트 로고 ${i + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 bg-slate-50 px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4 block">
                WORKSHOP SKETCH
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                교육이 곧 성과의 시작이 됩니다
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                실습 위주의 교육을 통해 참여자가 직접 성과를 만들어내는 교육을
                제공합니다.
              </p>
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
                <div
                  className={`rounded-2xl overflow-hidden shadow-lg ${i < 3 ? "h-[320px]" : "h-[240px]"}`}
                >
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

      {/* 5. Reviews Section */}
      <section className="py-24 bg-blue-50 px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4 block">
                Real Reviews
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                담당자와 수강생이 증명하는 높은 만족도
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                교육의 퀄리티는 수강생의 후기로 증명합니다.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((review, i) => (
              <ScrollReveal key={i}>
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-900/5 relative h-full flex flex-col">
                  <Quote
                    className="absolute top-10 right-10 text-blue-50 opacity-50"
                    size={60}
                  />
                  <p className="text-slate-700 leading-relaxed font-medium mb-10 relative z-10 flex-grow">
                    "{review.text}"
                  </p>
                  <div className="flex items-center gap-4 border-t border-slate-50 pt-8">
                    <img
                      src={review.img}
                      alt={review.name}
                      className="w-14 h-14 rounded-full border-2 border-blue-100 shadow-sm"
                    />
                    <div>
                      <div className="font-bold text-slate-900">
                        {review.name}
                      </div>
                      <div className="text-xs text-slate-500 font-bold">
                        {review.company} · {review.title}
                      </div>
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
              교육이 끝난 다음 날, <br />
              팀의 퇴근 시간이 달라집니다.
            </h2>
            <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              지금 바로 교육 문의를 신청하고 <br className="hidden md:block" />
              우리 기업 상황에 딱 맞는 맞춤형 커리큘럼을 무료로 제안받아보세요.
            </p>
            <div className="flex justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 rounded-full text-xl font-bold transition-all shadow-2xl shadow-blue-600/30 group"
              >
                교육 문의하기{" "}
                <ArrowRight
                  size={24}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </article>
  );
};

export default Home;
