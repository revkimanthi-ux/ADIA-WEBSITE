import { Page, Course } from "../types";
import { COURSES_DATA } from "../data";
import { Clock, Calendar, DollarSign, Briefcase, GraduationCap, CheckCircle, ArrowRight } from "lucide-react";

interface CoursesViewProps {
  setCurrentPage: (page: Page) => void;
  selectedCourseId: string;
  setSelectedCourseId: (id: string) => void;
}

export default function CoursesView({ setCurrentPage, selectedCourseId, setSelectedCourseId }: CoursesViewProps) {
  const currentCourse = COURSES_DATA.find((c) => c.id === selectedCourseId) || COURSES_DATA[0];

  const handleApplyClick = () => {
    // Navigate to admissions, scroll to top
    setCurrentPage("admissions");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full page-enter bg-[#0D1B4B]">
      {/* Page Header (Clean Minimalism style) */}
      <section className="bg-white border-b-4 border-[#C9A84C] py-20 px-6 md:px-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-5" style={{ backgroundImage: `url('${currentCourse.imageUrl}')` }} />
        <div className="relative max-w-4xl mx-auto flex flex-col items-center gap-3 z-10">
          <span className="text-[#C9A84C] font-bold uppercase tracking-[0.4em] text-xs">Explore Programmes</span>
          <h1 className="font-sans font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#0D1B4B] tracking-tight leading-none uppercase">
            ACADEMIC CURRICULUM
          </h1>
          <div className="w-20 h-1 bg-[#C9A84C] rounded mt-2" />
          <p className="text-xs md:text-sm text-[#0D1B4B]/80 max-w-2xl mt-4 font-medium leading-relaxed">
            Providing high-value, fast-track, 6-month vocational certificates designed to secure livelihoods and empower independent entrepreneurship.
          </p>
        </div>
      </section>

      {/* Main Layout containing Side Tabs + Course Content */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 bg-[#0D1B4B]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Side Tabs Column */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <h3 className="text-[#C9A84C] font-bold text-xs uppercase tracking-widest border-b border-white/10 pb-4 text-left">
              Our Programmes
            </h3>
            <div className="flex flex-col gap-2">
              {COURSES_DATA.map((course) => (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourseId(course.id)}
                  className={`w-full text-left p-4 rounded-none border transition-all duration-300 flex flex-col gap-1 cursor-pointer ${
                    selectedCourseId === course.id
                      ? "bg-white/10 border-[#C9A84C] text-[#C9A84C] shadow-lg"
                      : "bg-white/5 border-white/10 text-white/80 hover:border-white/30"
                  }`}
                >
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#C9A84C] block">
                    {course.category}
                  </span>
                  <span className="font-bold text-xs md:text-sm tracking-wider uppercase">
                    {course.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Support Callout Box */}
            <div className="mt-4 bg-white/5 border border-white/10 p-6 rounded-none text-left flex flex-col gap-3">
              <h4 className="font-bold text-xs text-[#C9A84C] uppercase tracking-widest">Admissions Support</h4>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                Have questions about program entry requirements, fee discounts, or intake dates? Contact our office today:
              </p>
              <a href="tel:0105086218" className="font-bold text-xs text-white hover:text-[#C9A84C] flex items-center gap-2 mt-1 transition-colors uppercase tracking-widest">
                <span>Call Support: 0105086218</span>
              </a>
            </div>
          </div>

          {/* Active Course Content Details Column */}
          <div className="lg:col-span-8 flex flex-col gap-10 text-left">
            {/* Image Banner */}
            <div className="relative h-64 md:h-80 w-full rounded-none border border-white/10 overflow-hidden bg-black/20">
              <img
                src={currentCourse.imageUrl}
                alt={currentCourse.name}
                loading="lazy"
                className="w-full h-full object-cover filter grayscale contrast-125 brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B4B] via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex flex-col items-start">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A84C] mb-1">
                  {currentCourse.category}
                </span>
                <h2 className="font-sans font-extrabold text-xl md:text-3xl text-white uppercase tracking-wider">
                  {currentCourse.name}
                </h2>
              </div>
            </div>

            {/* Highlighted Stat Cards (Duration, Intakes, Fees) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-none flex items-center gap-3">
                <div className="w-10 h-10 bg-[#C9A84C] text-[#0D1B4B] flex items-center justify-center">
                  <Clock size={16} />
                </div>
                <div>
                  <span className="text-[9px] text-white/40 uppercase tracking-widest block leading-none">Course Duration</span>
                  <span className="text-xs font-bold text-white uppercase tracking-wider mt-1.5 block">{currentCourse.duration}</span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-none flex items-center gap-3">
                <div className="w-10 h-10 bg-[#C9A84C] text-[#0D1B4B] flex items-center justify-center">
                  <Calendar size={16} />
                </div>
                <div>
                  <span className="text-[9px] text-white/40 uppercase tracking-widest block leading-none">Active Intakes</span>
                  <span className="text-xs font-bold text-white uppercase tracking-wider mt-1.5 block">{currentCourse.intakes.join(", ")}</span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-none flex items-center gap-3">
                <div className="w-10 h-10 bg-[#C9A84C] text-[#0D1B4B] flex items-center justify-center">
                  <DollarSign size={16} />
                </div>
                <div>
                  <span className="text-[9px] text-white/40 uppercase tracking-widest block leading-none">Tuition Cost</span>
                  <span className="text-xs font-bold text-[#C9A84C] uppercase tracking-wider mt-1.5 block">{currentCourse.feesPerSemester}</span>
                </div>
              </div>
            </div>

            {/* Course Description */}
            <div className="flex flex-col gap-3">
              <h3 className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest border-b border-white/10 pb-3">
                Programme Overview
              </h3>
              <p className="text-xs text-white/70 leading-relaxed font-light">
                {currentCourse.overview}
              </p>
            </div>

            {/* Modules / Units Covered */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest border-b border-white/10 pb-3">
                Syllabus & Units Covered
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                {currentCourse.modules.map((mod, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/5 p-4 rounded-none flex items-start gap-3">
                    <CheckCircle className="text-[#C9A84C] mt-0.5 flex-shrink-0" size={14} />
                    <span className="text-xs text-white/80 leading-relaxed font-light">{mod}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Prospects */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest border-b border-white/10 pb-3">
                Career Opportunities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                {currentCourse.prospects.map((prospect, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-none flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#C9A84C]/10 border border-[#C9A84C]/35 text-[#C9A84C] flex items-center justify-center flex-shrink-0">
                      <Briefcase size={12} />
                    </div>
                    <span className="text-xs text-white font-medium uppercase tracking-wider leading-tight">{prospect}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA bar */}
            <div className="bg-white/5 border-2 border-[#C9A84C] rounded-none p-6 flex flex-col md:flex-row justify-between items-center gap-6 mt-4 shadow-lg">
              <div className="flex flex-col items-start gap-1">
                <span className="text-[9px] text-[#C9A84C] uppercase tracking-[0.2em] font-bold">Launch your career</span>
                <p className="text-xs text-white/70 font-light leading-snug">Registration for the next intake is currently active. Secure your slot today!</p>
              </div>
              <button
                onClick={handleApplyClick}
                className="w-full md:w-auto bg-[#C9A84C] hover:bg-[#b0913b] text-[#0D1B4B] font-bold uppercase text-xs tracking-widest px-6 py-3 transition-colors cursor-pointer"
              >
                Enroll Online Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
