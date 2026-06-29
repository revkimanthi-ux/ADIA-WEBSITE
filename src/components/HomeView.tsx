import { Page } from "../types";
import { COURSES_DATA, TESTIMONIALS_DATA, NEWS_DATA } from "../data";
import { ArrowRight, Award, Users, BookOpen, Clock, Play, Sparkles, CheckCircle } from "lucide-react";
import HeroCarousel from "./HeroCarousel";

interface HomeViewProps {
  setCurrentPage: (page: Page) => void;
  setSelectedCourseId: (id: string) => void;
}

export default function HomeView({ setCurrentPage, setSelectedCourseId }: HomeViewProps) {
  const handleCourseClick = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentPage("courses");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full page-enter bg-[#0D1B4B]">
      {/* 1. HERO SECTION - CONTENT SLIDER WITH SPLIT LAYOUT */}
      <HeroCarousel setCurrentPage={setCurrentPage} setSelectedCourseId={setSelectedCourseId} />

      {/* 2. NUMBERS / STATS BAR - Clean Minimalism */}
      <section className="bg-[#0A1435] border-y border-[#C9A84C] py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 w-full md:w-auto">
            <div className="flex flex-col items-start">
              <span className="text-3xl md:text-4xl font-extrabold text-white leading-tight">1,200+</span>
              <span className="text-[9px] md:text-[10px] text-[#C9A84C] uppercase tracking-widest font-bold mt-1">ALUMNI SUCCESS</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-3xl md:text-4xl font-extrabold text-white leading-tight">98%</span>
              <span className="text-[9px] md:text-[10px] text-[#C9A84C] uppercase tracking-widest font-bold mt-1">PLACEMENT RATE</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-3xl md:text-4xl font-extrabold text-white leading-tight">15+</span>
              <span className="text-[9px] md:text-[10px] text-[#C9A84C] uppercase tracking-widest font-bold mt-1">CORE MODULES</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-3xl md:text-4xl font-extrabold text-white leading-tight">100%</span>
              <span className="text-[9px] md:text-[10px] text-[#C9A84C] uppercase tracking-widest font-bold mt-1">PRACTICAL FOCUS</span>
            </div>
          </div>
          <div className="text-left md:text-right text-[10px] text-white/50 leading-relaxed tracking-wider font-semibold border-t md:border-t-0 border-white/10 pt-4 md:pt-0 w-full md:w-auto">
            ADMINISTRATION BLDG, NAIROBI, KENYA<br />
            SUPPORTING SUSTAINABLE VOCATIONAL INITIATIVES
          </div>
        </div>
      </section>

      {/* 3. PROGRAMMES SHOWCASE (Clean Minimalism White Highlight Grid) */}
      <section className="bg-white border-b border-gray-100 py-24 px-6 md:px-12 text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-3 mb-16">
          <span className="text-[#C9A84C] uppercase tracking-[0.4em] text-[10px] md:text-xs font-bold block">
            Vocational Studies
          </span>
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-[#0D1B4B] tracking-tight leading-none uppercase">
            Flagship Course Programmes
          </h2>
          <div className="w-16 h-1 bg-[#C9A84C] rounded mt-2" />
          <p className="text-xs sm:text-sm text-[#0D1B4B]/70 leading-relaxed max-w-xl mt-2 font-medium">
            Explore our fast-track, certified 6-month educational tracks curated specifically for the local Nairobi trade and services sectors.
          </p>
        </div>

        {/* Clean White Highlights Grid Style */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-gray-200 divide-y md:divide-y-0 md:divide-x divide-gray-200 bg-white">
          {COURSES_DATA.map((course, idx) => (
            <div
              key={course.id}
              onClick={() => handleCourseClick(course.id)}
              className={`p-8 flex flex-col justify-between text-left min-h-[300px] cursor-pointer group transition-all duration-300 ${
                idx % 2 === 1 ? "bg-[#F8F9FA]" : "bg-white"
              } hover:bg-[#0D1B4B]`}
            >
              <div>
                <span className="text-[9px] font-bold text-[#C9A84C] uppercase tracking-widest block mb-4">
                  {course.category} • {course.duration}
                </span>
                <h3 className="text-[#0D1B4B] font-extrabold text-xl leading-snug uppercase tracking-tight group-hover:text-white transition-colors duration-300">
                  {course.name}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed font-medium mt-4 group-hover:text-white/70 transition-colors duration-300 line-clamp-4">
                  {course.overview}
                </p>
              </div>
              <span className="text-[#C9A84C] text-[11px] font-extrabold tracking-widest mt-8 flex items-center gap-1">
                LEARN MORE <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <button
            onClick={() => handleNavClick("admissions")}
            className="bg-[#0D1B4B] text-[#C9A84C] border border-[#C9A84C] px-10 py-4 font-bold text-xs tracking-widest uppercase hover:bg-[#C9A84C] hover:text-white transition-all duration-300 cursor-pointer"
          >
            How To Enroll Online
          </button>
        </div>
      </section>

      {/* 4. WHY CHOOSE ADIA SECTION - Beautiful Contrast */}
      <section className="bg-[#0D1B4B] py-24 px-6 md:px-12 border-b border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left illustration / key list */}
          <div className="flex flex-col items-start gap-6 text-left">
            <span className="text-[#C9A84C] font-bold uppercase tracking-widest text-xs">Excellence in Training</span>
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-white tracking-tight leading-none uppercase">
              Why Choose ADIA?
            </h2>
            <div className="w-16 h-1 bg-[#C9A84C] rounded" />
            <p className="text-sm text-white/70 leading-relaxed font-light">
              We structure our training differently from general schools. At ADIA, we prioritize actual workspaces, physical execution, and job preparedness.
            </p>

            <div className="flex flex-col gap-6 mt-4">
              {[
                { title: "Fully Equipped Practical Labs", desc: "Our students use industrial sewing machines, professional baking facilities, cosmetology models, and diagnostic IT computer rigs." },
                { title: "Affordable & Flexible Payment Structures", desc: "No massive upfront demands. Tuition fee schedules are structured in affordable and transparent installments." },
                { title: "Experienced Industry Instructors", desc: "Learn directly under chefs, certified technologists, and styling salon operators with active market networks." },
                { title: "Entrepreneurship & Freelance Coaching", desc: "We don't just teach the skill. Every module incorporates foundational accounting, branding, customer care, and business start-up rules." }
              ].map((point, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <CheckCircle className="text-[#C9A84C] flex-shrink-0 mt-0.5" size={16} />
                  <div>
                    <h4 className="font-bold text-sm text-white uppercase tracking-wide">{point.title}</h4>
                    <p className="text-xs text-white/60 leading-relaxed mt-1 font-light">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right graphics panel */}
          <div className="relative flex justify-center">
            <div className="grid grid-cols-2 gap-4 w-full max-w-md relative">
              <div className="space-y-4">
                <div className="rounded-none overflow-hidden border border-white/10 aspect-square">
                  <img src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400" alt="Sewing practice" className="w-full h-full object-cover filter brightness-90 grayscale-[20%]" />
                </div>
                <div className="rounded-none border-2 border-[#C9A84C] bg-[#C9A84C] p-6 text-[#0D1B4B] flex flex-col justify-end aspect-[4/3]">
                  <span className="text-3xl font-extrabold tracking-tighter">100%</span>
                  <span className="text-[9px] uppercase font-bold tracking-widest mt-1">PRACTICAL MASTERCLASS</span>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-none border border-white/10 bg-white/5 p-6 text-[#C9A84C] flex flex-col justify-end aspect-[4/3]">
                  <span className="text-3xl font-extrabold tracking-tighter text-white">6 MOS</span>
                  <span className="text-[9px] uppercase font-bold tracking-widest mt-1">FAST-TRACK PATHWAY</span>
                </div>
                <div className="rounded-none overflow-hidden border border-white/10 aspect-square">
                  <img src="https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?auto=format&fit=crop&q=80&w=400" alt="Kitchen practice" className="w-full h-full object-cover filter brightness-90 grayscale-[20%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION - Elegant light gray section */}
      <section className="bg-[#F8F9FA] py-24 px-6 md:px-12 text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-3 mb-16">
          <span className="text-[#C9A84C] font-bold uppercase tracking-widest text-xs">Success Stories</span>
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-[#0D1B4B] tracking-tight leading-none uppercase">
            What Our Graduates Say
          </h2>
          <div className="w-16 h-1 bg-[#C9A84C] rounded mt-2" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS_DATA.map((t) => (
            <div
              key={t.id}
              className="bg-white border border-gray-100 p-8 shadow-sm text-left flex flex-col justify-between hover:border-[#C9A84C] transition-colors duration-300"
            >
              <p className="text-xs text-gray-600 italic leading-relaxed font-medium mb-8">
                "{t.comment}"
              </p>
              <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-[#C9A84C] bg-[#0D1B4B] flex-shrink-0">
                  <img src={t.avatarUrl} alt={t.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#0D1B4B] uppercase tracking-wide">{t.name}</h4>
                  <span className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest block mt-1">
                    {t.course}
                  </span>
                  <span className="text-[9px] text-gray-400 block mt-0.5">
                    CLASS OF {t.year}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. NEWS & EVENTS PREVIEW */}
      <section className="bg-[#0D1B4B] py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="flex flex-col items-start gap-3 text-left">
              <span className="text-[#C9A84C] font-bold uppercase tracking-widest text-xs">Stay Updated</span>
              <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-white tracking-tight leading-none uppercase">
                Latest News & Events
              </h2>
              <div className="w-16 h-1 bg-[#C9A84C] rounded" />
            </div>
            <button
              onClick={() => handleNavClick("news")}
              className="bg-transparent hover:bg-white/5 text-[#C9A84C] font-bold uppercase text-xs tracking-widest px-8 py-3.5 border border-[#C9A84C] transition-all cursor-pointer"
            >
              View All Posts
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {NEWS_DATA.slice(0, 3).map((post) => (
              <div
                key={post.id}
                className="bg-white/5 border border-white/10 hover:border-[#C9A84C] overflow-hidden flex flex-col group transition-all duration-300"
              >
                <div className="h-48 w-full relative overflow-hidden bg-black/20">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300 filter brightness-90 grayscale-[15%]"
                  />
                  <div className="absolute top-3 left-3 bg-[#0D1B4B] border border-[#C9A84C]/35 text-[#C9A84C] font-bold text-[9px] uppercase tracking-wider px-2.5 py-1">
                    {post.category}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col text-left items-start">
                  <span className="text-[10px] text-white/50 mb-2 font-medium">{post.date.toUpperCase()}</span>
                  <h3 className="font-extrabold text-base text-white line-clamp-2 leading-snug group-hover:text-[#C9A84C] transition-colors mb-3 uppercase tracking-wide">
                    {post.title}
                  </h3>
                  <p className="text-xs text-white/60 line-clamp-3 leading-relaxed mb-6 font-light">
                    {post.summary}
                  </p>
                  <button
                    onClick={() => handleNavClick("news")}
                    className="mt-auto text-xs font-bold text-[#C9A84C] hover:underline cursor-pointer tracking-wider uppercase"
                  >
                    Read Full Story →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
