import { useState } from "react";
import { Page, Course, HeaderConfig } from "../types";
import { COURSES_DATA } from "../data";
import { Phone, Mail, Facebook, Instagram, MessageSquare, Menu, X, ChevronDown } from "lucide-react";

interface NavigationProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  selectedCourseId: string;
  setSelectedCourseId: (id: string) => void;
  headerConfig: HeaderConfig;
}

export function AdiaLogo({
  light = false,
  logoText = "ADIA EMPOWERMENT",
  logoSubtitle = "CENTRE • NAIROBI, KENYA"
}: {
  light?: boolean;
  logoText?: string;
  logoSubtitle?: string;
}) {
  const textColor = light ? "text-white" : "text-[#0D1B4B]";
  const subColor = "text-[#C9A84C]";

  return (
    <div className="flex items-center gap-4">
      <svg
        className="w-14 h-14 filter drop-shadow-sm flex-shrink-0"
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top Crown Crest */}
        <path
          d="M 188 45 L 250 67 L 312 45 M 250 32 V 67"
          stroke="#C9A84C"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Left Wreath / Wheat Leaves */}
        <path
          d="M 192 465 C 105 450, 65 350, 65 115"
          stroke="#C9A84C"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path d="M 65 115 L 48 135 M 65 115 L 82 135" stroke="#C9A84C" strokeWidth="6" strokeLinecap="round" />
        <path d="M 65 155 L 48 175 M 65 155 L 82 175" stroke="#C9A84C" strokeWidth="6" strokeLinecap="round" />
        <path d="M 65 195 L 48 215 M 65 195 L 82 215" stroke="#C9A84C" strokeWidth="6" strokeLinecap="round" />
        <path d="M 66 235 L 49 255 M 66 235 L 83 255" stroke="#C9A84C" strokeWidth="6" strokeLinecap="round" />
        <path d="M 69 275 L 52 295 M 69 275 L 86 295" stroke="#C9A84C" strokeWidth="6" strokeLinecap="round" />
        <path d="M 75 315 L 58 335 M 75 315 L 92 335" stroke="#C9A84C" strokeWidth="6" strokeLinecap="round" />

        {/* Right Wreath / Wheat Leaves */}
        <path
          d="M 308 465 C 395 450, 435 350, 435 115"
          stroke="#C9A84C"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path d="M 435 115 L 418 135 M 435 115 L 452 135" stroke="#C9A84C" strokeWidth="6" strokeLinecap="round" />
        <path d="M 435 155 L 418 175 M 435 155 L 452 175" stroke="#C9A84C" strokeWidth="6" strokeLinecap="round" />
        <path d="M 435 195 L 418 215 M 435 195 L 452 215" stroke="#C9A84C" strokeWidth="6" strokeLinecap="round" />
        <path d="M 434 235 L 417 255 M 434 235 L 451 255" stroke="#C9A84C" strokeWidth="6" strokeLinecap="round" />
        <path d="M 431 275 L 414 295 M 431 275 L 448 295" stroke="#C9A84C" strokeWidth="6" strokeLinecap="round" />
        <path d="M 425 315 L 408 335 M 425 315 L 442 335" stroke="#C9A84C" strokeWidth="6" strokeLinecap="round" />

        {/* Central Shield */}
        <path
          d="M 110 100 H 390 V 270 C 390 380, 250 450, 250 460 C 250 450, 110 380, 110 270 Z"
          fill="#0A1435"
          stroke="#C9A84C"
          strokeWidth="10"
          strokeLinejoin="round"
        />

        {/* Shield Internal Dividers */}
        <path d="M 250 100 V 260" stroke="#C9A84C" strokeWidth="8" />
        <path d="M 250 260 L 110 330" stroke="#C9A84C" strokeWidth="8" />
        <path d="M 250 260 L 390 330" stroke="#C9A84C" strokeWidth="8" />

        {/* Letters A, T, C */}
        <text
          x="180"
          y="180"
          fill="#C9A84C"
          fontSize="50"
          fontFamily="'Inter', 'Space Grotesk', sans-serif"
          fontWeight="900"
          textAnchor="middle"
        >
          A
        </text>
        <text
          x="142"
          y="245"
          fill="#C9A84C"
          fontSize="50"
          fontFamily="'Inter', 'Space Grotesk', sans-serif"
          fontWeight="900"
          textAnchor="middle"
        >
          T
        </text>
        <text
          x="218"
          y="245"
          fill="#C9A84C"
          fontSize="50"
          fontFamily="'Inter', 'Space Grotesk', sans-serif"
          fontWeight="900"
          textAnchor="middle"
        >
          C
        </text>

        {/* Stylized Book in Top-Right Section */}
        <g transform="translate(285, 135) scale(1.1)">
          {/* Book Outline Cover */}
          <path
            d="M 12 5 h 46 c 5 0, 8 3, 8 8 v 54 c 0 3, -3 6, -6 6 H 12 Z"
            fill="none"
            stroke="#C9A84C"
            strokeWidth="8"
            strokeLinejoin="round"
          />
          {/* Spine / Inner Line */}
          <path d="M 22 5 v 68" stroke="#C9A84C" strokeWidth="8" strokeLinecap="round" />
          {/* Pages bottom curved shape */}
          <path d="M 22 61 c 10 4, 30 4, 40 0 v 6 c -10 4, -30 4, -40 0 Z" fill="#C9A84C" />
        </g>

        {/* Flame / Person in Bottom Section */}
        <g transform="translate(15, -10) scale(0.95)">
          {/* Head */}
          <circle cx="215" cy="355" r="18" fill="#C9A84C" />
          {/* Body swoosh 1 */}
          <path
            d="M 245 470 C 220 440, 215 410, 235 375 C 245 360, 255 345, 250 320 C 245 325, 240 325, 235 315 C 240 310, 250 310, 255 318 C 260 325, 260 345, 257 365 C 250 395, 260 430, 267 460 Z"
            fill="#C9A84C"
          />
          {/* Second smaller swoosh */}
          <path d="M 247 450 C 250 430, 255 410, 261 397 C 263 403, 261 420, 255 440 Z" fill="#C9A84C" />
          {/* Small crown above the hand */}
          <path d="M 238 313 L 235 304 L 240 307 L 245 304 L 248 313 Z" fill="#C9A84C" />
        </g>
      </svg>
      <div className="text-left">
        <h1 className={`${textColor} text-xl md:text-2xl font-bold tracking-tighter leading-none uppercase`}>
          {logoText}
        </h1>
        <p className={`${subColor} text-[9px] md:text-[10px] tracking-[0.3em] font-bold mt-1`}>
          {logoSubtitle}
        </p>
      </div>
    </div>
  );
}

export default function Navigation({ currentPage, setCurrentPage, selectedCourseId, setSelectedCourseId, headerConfig }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);

  const navItems: { label: string; page: Page }[] = [
    { label: "Home", page: "home" },
    { label: "About Us", page: "about" },
    { label: "Admissions", page: "admissions" },
    { label: "Gallery", page: "gallery" },
    { label: "News", page: "news" },
    { label: "Contact", page: "contact" },
  ];

  const handleNavClick = (page: Page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    setCoursesDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCourseClick = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentPage("courses");
    setMobileMenuOpen(false);
    setCoursesDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="w-full relative z-50">
      {/* 1. TOP BAR - Clean Minimalism */}
      <div className="h-12 md:h-10 bg-[#0A1435] border-b border-white/10 flex flex-col md:flex-row items-center justify-between px-4 md:px-12 text-[10px] md:text-[11px] uppercase tracking-widest font-semibold py-2 md:py-0 gap-2">
        <div className="flex gap-4 md:gap-6 items-center text-[#C9A84C]">
          <a href={`tel:${headerConfig.tel}`} className="hover:underline">TEL: {headerConfig.tel}</a>
          <span className="text-white/30">|</span>
          <span>{headerConfig.admissionsOpen}</span>
        </div>
        <div className="flex gap-4 text-white/75">
          <a href={`mailto:${headerConfig.email}`} className="hover:text-[#C9A84C] transition-colors">EMAIL</a>
          <a href={headerConfig.facebook} target="_blank" rel="noreferrer" className="hover:text-[#C9A84C] transition-colors">FACEBOOK</a>
          <a href={headerConfig.instagram} target="_blank" rel="noreferrer" className="hover:text-[#C9A84C] transition-colors">INSTAGRAM</a>
          <a href={headerConfig.whatsapp} target="_blank" rel="noreferrer" className="hover:text-[#C9A84C] transition-colors">WHATSAPP</a>
        </div>
      </div>

      {/* 2. MAIN NAV BAR - White Minimalist Header */}
      <div className="w-full bg-white border-b-4 border-[#C9A84C] px-4 md:px-12 py-3 md:h-24 flex justify-between items-center shadow-md">
        {/* LOGO */}
        <div className="cursor-pointer" onClick={() => handleNavClick("home")}>
          <AdiaLogo logoText={headerConfig.logoText} logoSubtitle={headerConfig.logoSubtitle} />
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-6">
          {/* Home */}
          <button
            id="nav-home"
            onClick={() => handleNavClick("home")}
            className={`py-2 text-[13px] font-bold uppercase tracking-wider transition-colors duration-200 border-b-2 ${
              currentPage === "home"
                ? "border-[#C9A84C] text-[#C9A84C]"
                : "border-transparent text-[#0D1B4B] hover:text-[#C9A84C]"
            }`}
          >
            HOME
          </button>

          {/* About Us */}
          <button
            id="nav-about"
            onClick={() => handleNavClick("about")}
            className={`py-2 text-[13px] font-bold uppercase tracking-wider transition-colors duration-200 border-b-2 ${
              currentPage === "about"
                ? "border-[#C9A84C] text-[#C9A84C]"
                : "border-transparent text-[#0D1B4B] hover:text-[#C9A84C]"
            }`}
          >
            ABOUT US
          </button>

          {/* Courses */}
          <button
            id="nav-courses"
            onClick={() => handleNavClick("courses")}
            className={`py-2 text-[13px] font-bold uppercase tracking-wider transition-colors duration-200 border-b-2 ${
              currentPage === "courses"
                ? "border-[#C9A84C] text-[#C9A84C]"
                : "border-transparent text-[#0D1B4B] hover:text-[#C9A84C]"
            }`}
          >
            COURSES
          </button>

          {/* Regular pages */}
          {navItems.slice(2).map((item) => (
            <button
              key={item.page}
              id={`nav-${item.page}`}
              onClick={() => handleNavClick(item.page)}
              className={`py-2 text-[13px] font-bold uppercase tracking-wider transition-colors duration-200 border-b-2 ${
                currentPage === item.page
                  ? "border-[#C9A84C] text-[#C9A84C]"
                  : "border-transparent text-[#0D1B4B] hover:text-[#C9A84C]"
              }`}
            >
              {item.label.toUpperCase()}
            </button>
          ))}

          {/* Quick Apply CTA */}
          <button
            onClick={() => handleNavClick("admissions")}
            className="bg-[#0D1B4B] text-[#C9A84C] px-6 py-2 border border-[#C9A84C] text-[12px] font-bold tracking-widest uppercase hover:bg-[#C9A84C] hover:text-white transition-all duration-300"
          >
            APPLY NOW
          </button>
        </nav>

        {/* MOBILE HAMBURGER BUTTON */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-[#0D1B4B] hover:text-[#C9A84C] p-2"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* 3. MOBILE MENU SLIDE-IN DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          {/* Overlay background */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />

          {/* Drawer Body */}
          <div className="relative ml-auto w-4/5 max-w-sm h-full bg-[#0D1B4B] shadow-2xl border-l border-white/10 p-6 flex flex-col overflow-y-auto">
            <div className="flex justify-between items-center pb-6 border-b border-white/10">
              <span className="font-bold text-[#C9A84C] uppercase tracking-wider text-sm">ADIA Navigation</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-[#C9A84C]">
                <X size={24} />
              </button>
            </div>

            {/* Menu Links */}
            <div className="flex flex-col gap-2 mt-6">
              <button
                onClick={() => handleNavClick("home")}
                className={`w-full text-left py-3 px-4 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-between ${
                  currentPage === "home" ? "bg-[#1A2E6E] text-[#C9A84C] border-r-4 border-[#C9A84C]" : "text-white/90 hover:bg-white/5"
                }`}
              >
                Home
              </button>

              <button
                onClick={() => handleNavClick("about")}
                className={`w-full text-left py-3 px-4 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-between ${
                  currentPage === "about" ? "bg-[#1A2E6E] text-[#C9A84C] border-r-4 border-[#C9A84C]" : "text-white/90 hover:bg-white/5"
                }`}
              >
                About Us
              </button>

              <button
                onClick={() => handleNavClick("courses")}
                className={`w-full text-left py-3 px-4 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-between ${
                  currentPage === "courses" ? "bg-[#1A2E6E] text-[#C9A84C] border-r-4 border-[#C9A84C]" : "text-white/90 hover:bg-white/5"
                }`}
              >
                Courses
              </button>

              {navItems.slice(2).map((item) => (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`w-full text-left py-3 px-4 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-between ${
                    currentPage === item.page ? "bg-[#1A2E6E] text-[#C9A84C] border-r-4 border-[#C9A84C]" : "text-white/90 hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Quick CTAs inside drawer */}
            <div className="mt-auto pt-6 border-t border-white/10">
              <button
                onClick={() => handleNavClick("admissions")}
                className="w-full bg-[#C9A84C] hover:bg-[#e2c062] text-[#0D1B4B] font-bold uppercase text-xs tracking-wider py-3 rounded text-center block"
              >
                Apply Online
              </button>
              <div className="flex flex-col items-center gap-1 text-[11px] text-white/50 mt-4 text-center">
                <span>Call Admissions Support:</span>
                <a href={`tel:${headerConfig.tel}`} className="text-[#C9A84C] font-bold text-xs hover:underline">
                  {headerConfig.tel}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
