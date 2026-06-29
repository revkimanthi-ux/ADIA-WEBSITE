import { Page } from "../types";
import { CheckCircle, Sparkles, Compass, Target, Heart, ShieldAlert, Users } from "lucide-react";

interface AboutViewProps {
  setCurrentPage: (page: Page) => void;
}

export default function AboutView({ setCurrentPage }: AboutViewProps) {
  return (
    <div className="w-full page-enter bg-[#0D1B4B]">
      {/* Page Header (Clean Minimalism - Elegant Header) */}
      <section className="bg-white border-b-4 border-[#C9A84C] py-20 px-6 md:px-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-5" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800')` }} />
        <div className="relative max-w-4xl mx-auto flex flex-col items-center gap-3 z-10">
          <span className="text-[#C9A84C] font-bold uppercase tracking-[0.4em] text-xs">Learn About Us</span>
          <h1 className="font-sans font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#0D1B4B] tracking-tight leading-none uppercase">
            WHO WE ARE
          </h1>
          <div className="w-20 h-1 bg-[#C9A84C] rounded mt-2" />
          <p className="text-xs md:text-sm text-[#0D1B4B]/80 max-w-2xl mt-4 font-medium leading-relaxed">
            ADIA Empowerment Centre is a premier, fully-equipped vocational institute in Nairobi, Kenya, offering certified training built on practical mastery and character development.
          </p>
        </div>
      </section>

      {/* Mission & Vision Bento Cards (Clean High Contrast Cards) */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 bg-[#0D1B4B]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="bg-white/5 border border-white/10 p-8 text-left flex flex-col gap-5 hover:border-[#C9A84C] transition-colors duration-300">
            <div className="w-12 h-12 bg-white/5 border border-[#C9A84C] text-[#C9A84C] flex items-center justify-center">
              <Target size={20} />
            </div>
            <h3 className="font-sans font-extrabold text-lg text-white tracking-widest uppercase">
              Our Mission
            </h3>
            <p className="text-xs text-white/70 leading-relaxed font-light">
              To empower young men and women across communities with high-quality, industry-relevant technical and vocational skills, transforming them into self-reliant professionals, skilled employees, and ethical entrepreneurs.
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-white/5 border border-white/10 p-8 text-left flex flex-col gap-5 hover:border-[#C9A84C] transition-colors duration-300">
            <div className="w-12 h-12 bg-white/5 border border-[#C9A84C] text-[#C9A84C] flex items-center justify-center">
              <Compass size={20} />
            </div>
            <h3 className="font-sans font-extrabold text-lg text-white tracking-widest uppercase">
              Our Vision
            </h3>
            <p className="text-xs text-white/70 leading-relaxed font-light">
              To be the leading vocational empowerment hub in East Africa, recognized for cultivating excellence, practical ingenuity, sustainable innovation, and community-centered development.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Grid - Sophisticated pure white background section */}
      <section className="w-full bg-white border-y border-gray-100 py-24 px-6 md:px-12 text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Text Left */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <span className="text-[#C9A84C] font-bold uppercase tracking-widest text-xs">A Journey of Impact</span>
            <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-[#0D1B4B] tracking-tight uppercase">
              Our Story & Heritage
            </h2>
            <div className="w-16 h-1 bg-[#C9A84C] rounded" />
            
            <p className="text-xs text-[#0D1B4B]/70 leading-relaxed font-medium">
              Established in Nairobi with the central goal of bridging the vocational gap, **ADIA Empowerment Centre** began as a modest community training circle. We noticed that although many high school graduates had high ambitions, they lacked the tangible technical competencies required to navigate the modern job market or safely establish service businesses.
            </p>

            <p className="text-xs text-[#0D1B4B]/70 leading-relaxed font-medium">
              By crafting intensive, 6-month hands-on programmes in highly resilient consumer industries—such as Information Technology, Commercial Food Service, Custom Tailoring, and Cosmetology—ADIA designed an educational model focusing entirely on practical projects rather than abstract theory.
            </p>

            <p className="text-xs text-[#0D1B4B]/70 leading-relaxed font-medium">
              Today, ADIA has grown into a highly respected training centre. We are proud of our modern laboratories, active industrial chef stations, master hairdressing clinics, and tailoring studios that help dozens of youth enter the market with pride every year.
            </p>
          </div>

          {/* Graphic Right */}
          <div className="lg:col-span-5 relative">
            <div className="relative p-2 bg-[#0D1B4B] border border-gray-200">
              <img
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600"
                alt="Students collaborating"
                loading="lazy"
                className="w-full aspect-[4/3] object-cover filter grayscale contrast-125"
              />
              <div className="absolute bottom-5 left-5 right-5 bg-[#0D1B4B] border border-[#C9A84C]/35 p-4 text-center shadow-lg">
                <span className="font-sans font-extrabold text-lg text-[#C9A84C] block uppercase tracking-wide">100% Accredited</span>
                <span className="text-[9px] text-white/50 uppercase tracking-widest block mt-1">Approved Technical Syllabi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership message section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Leadership Photo Card */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="bg-white/5 border border-white/10 p-6 w-full max-w-xs shadow-xl text-center flex flex-col items-center">
              <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-[#C9A84C] bg-[#0D1B4B] mb-5">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300"
                  alt="Rev. Charles Kimanthi"
                  className="w-full h-full object-cover filter grayscale brightness-95"
                />
              </div>
              <h4 className="font-sans font-bold text-base text-white uppercase tracking-wider leading-tight">Rev. Charles Kimanthi</h4>
              <span className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest block mt-2">Executive Director</span>
              <span className="text-[9px] text-white/40 block mt-1">ADIA Empowerment Centre</span>
            </div>
          </div>

          {/* Director's message Text */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            <span className="text-[#C9A84C] font-bold uppercase tracking-widest text-xs">Director's Welcome Message</span>
            <h3 className="font-sans font-extrabold text-xl sm:text-2xl text-white tracking-tight uppercase">
              "We Build Competence, Confidence & Character"
            </h3>
            <div className="w-16 h-1 bg-[#C9A84C] rounded" />

            <div className="text-xs text-white/70 leading-relaxed font-light space-y-4">
              <p>
                "Welcome to ADIA Empowerment Centre. As we serve our community in Nairobi, our fundamental philosophy revolves around active, hand-delivered empowerment. We believe that true dignity and resilience emerge when an individual possesses a tangible, highly polished skill in their hands."
              </p>
              <p>
                "At ADIA, we don't believe in passive lecture halls. Our training involves continuous practice. Whether you are coding websites, assembling garments for an export order, catering massive youth summits, or designing masterclass styling layouts, you are continuously building the core competencies required to succeed in the real world."
              </p>
              <p>
                "We invite all ambitious youth, community members, and career-shapers to join our upcoming intake. Together, let's turn potential into professional excellence."
              </p>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <div className="flex flex-col">
                <span className="font-bold text-xs text-white uppercase tracking-wider">Rev. Charles Kimanthi</span>
                <span className="text-[10px] text-[#C9A84C] font-semibold tracking-wider uppercase">Nairobi Administration Principal</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values banner */}
      <section className="w-full bg-[#0A1435] border-t border-white/10 py-20 px-6 md:px-12 text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[#C9A84C] font-bold uppercase tracking-widest text-xs">Our Anchors</span>
            <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight">Our Core Values</h2>
            <div className="w-12 h-1 bg-[#C9A84C] rounded mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full mt-2">
            {[
              { title: "Empowerment", desc: "Equipping individuals with sustainable skills to create their own paths.", icon: <Sparkles size={16} className="text-[#0D1B4B]" /> },
              { title: "Integrity", desc: "Upholding high moral ethics, honesty, and accountability in training.", icon: <Heart size={16} className="text-[#0D1B4B]" /> },
              { title: "Practical Excellence", desc: "Prioritizing 100% hands-on training to guarantee competence.", icon: <CheckCircle size={16} className="text-[#0D1B4B]" /> },
              { title: "Community Service", desc: "Uplifting Nairobi families and local trade with affordable access.", icon: <Users size={16} className="text-[#0D1B4B]" /> }
            ].map((v, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-6 flex flex-col items-center gap-4 text-center">
                <div className="w-9 h-9 bg-[#C9A84C] flex items-center justify-center font-bold">
                  {v.icon}
                </div>
                <h4 className="font-bold text-xs text-white uppercase tracking-widest">{v.title}</h4>
                <p className="text-[11px] text-white/60 leading-relaxed font-light">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
