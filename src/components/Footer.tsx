import { Page, HeaderConfig } from "../types";
import { AdiaLogo } from "./Navigation";
import { Phone, Mail, MapPin, ArrowRight, Facebook, Instagram, MessageSquare, ExternalLink } from "lucide-react";

interface FooterProps {
  setCurrentPage: (page: Page) => void;
  setSelectedCourseId: (id: string) => void;
  headerConfig: HeaderConfig;
}

export default function Footer({ setCurrentPage, setSelectedCourseId, headerConfig }: FooterProps) {
  const handleNavClick = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCourseClick = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentPage("courses");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0A1435] border-t-4 border-[#C9A84C] text-white pt-20">
      {/* Upper Grid Layout */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16">
        {/* Brand Lockup Column */}
        <div className="flex flex-col gap-5">
          <div className="transform -translate-x-2">
            <AdiaLogo
              light={true}
              logoText={headerConfig.logoText}
              logoSubtitle={headerConfig.logoSubtitle}
            />
          </div>
          <p className="text-xs text-white/60 leading-relaxed font-light mt-2">
            Providing industry-aligned vocational education and hands-on skill development to build careers, foster entrepreneurship, and uplift families across Kenya.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <a
              href={headerConfig.facebook}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-none border border-white/20 hover:border-[#C9A84C] text-white hover:text-[#C9A84C] flex items-center justify-center transition-all duration-300 bg-white/5"
              aria-label="Facebook"
            >
              <Facebook size={14} />
            </a>
            <a
              href={headerConfig.instagram}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-none border border-white/20 hover:border-[#C9A84C] text-white hover:text-[#C9A84C] flex items-center justify-center transition-all duration-300 bg-white/5"
              aria-label="Instagram"
            >
              <Instagram size={14} />
            </a>
            <a
              href={headerConfig.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-none border border-white/20 hover:border-[#C9A84C] text-white hover:text-[#C9A84C] flex items-center justify-center transition-all duration-300 bg-white/5"
              aria-label="WhatsApp"
            >
              <MessageSquare size={14} />
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="flex flex-col gap-4 pl-0 lg:pl-8">
          <h3 className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest border-b border-white/10 pb-3">
            Quick Links
          </h3>
          <ul className="flex flex-col gap-3 mt-2">
            {[
              { label: "Home", page: "home" as Page },
              { label: "About Us", page: "about" as Page },
              { label: "Admissions", page: "admissions" as Page },
              { label: "Gallery", page: "gallery" as Page },
              { label: "News & Events", page: "news" as Page },
              { label: "Contact Us", page: "contact" as Page },
            ].map((link) => (
              <li key={link.page}>
                <button
                  onClick={() => handleNavClick(link.page)}
                  className="flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-[#C9A84C] hover:translate-x-1.5 transition-all duration-300 text-left uppercase tracking-wider"
                >
                  <span>{link.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Programmes list Column */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest border-b border-white/10 pb-3">
            Our Programmes
          </h3>
          <ul className="flex flex-col gap-3 mt-2">
            {[
              { name: "Information Technology (IT)", id: "it" },
              { name: "Hospitality & Catering", id: "hospitality" },
              { name: "Fashion & Design", id: "fashion" },
              { name: "Beauty & Cosmetology", id: "beauty" },
            ].map((course) => (
              <li key={course.id}>
                <button
                  onClick={() => handleCourseClick(course.id)}
                  className="flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-[#C9A84C] hover:translate-x-1.5 transition-all duration-300 text-left uppercase tracking-wider"
                >
                  <span>{course.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Block + Google Map Thumbnail Column */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest border-b border-white/10 pb-3">
            Contact Details
          </h3>
          <div className="flex flex-col gap-3 text-xs text-white/70 mt-2">
            <div className="flex items-start gap-3">
              <MapPin size={14} className="text-[#C9A84C] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-white uppercase tracking-wider">ADIA Empowerment Centre</p>
                <p className="text-[11px] text-white/50 mt-1">P.O. Box 22870-00100, Nairobi, Kenya</p>
              </div>
            </div>
            <a href={`tel:${headerConfig.tel}`} className="flex items-center gap-3 hover:text-[#C9A84C] transition-colors mt-1">
              <Phone size={14} className="text-[#C9A84C] flex-shrink-0" />
              <span className="font-semibold">{headerConfig.tel}</span>
            </a>
            <a href={`mailto:${headerConfig.email}`} className="flex items-center gap-3 hover:text-[#C9A84C] transition-colors">
              <Mail size={14} className="text-[#C9A84C] flex-shrink-0" />
              <span className="font-semibold">{headerConfig.email}</span>
            </a>

            {/* Google Map Thumbnail */}
            <div className="mt-4 group relative rounded-none border border-white/10 h-24 overflow-hidden bg-black/20">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=300"
                alt="Map Thumbnail"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 filter brightness-75 grayscale"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <a
                  href="https://maps.app.goo.gl/o3Xm3Qzni8YG7F5E6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0D1B4B]/95 hover:bg-[#0D1B4B] border border-[#C9A84C] text-[#C9A84C] font-bold text-[9px] uppercase tracking-wider px-3 py-2 transition-all shadow-lg"
                >
                  <span>View On Google Maps</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prestige Gold Bottom Bar */}
      <div className="w-full bg-[#070E25] border-t border-white/5 py-6 px-6 md:px-12 text-center text-[10px] text-white/40 font-semibold tracking-wider uppercase">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>
            © 2026 ADIA Empowerment Centre. All rights reserved. |{" "}
            <button
              onClick={() => {
                setCurrentPage("admin");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-brand-gold hover:text-white underline cursor-pointer bg-transparent border-none p-0 inline font-semibold uppercase tracking-wider text-[10px]"
            >
              Staff Portal
            </button>
          </p>
          <p className="flex items-center gap-2">
            <span className="text-[#C9A84C]">●</span> Brand Promise: Empowering Communities Through Skill Development
          </p>
        </div>
      </div>
    </footer>
  );
}
