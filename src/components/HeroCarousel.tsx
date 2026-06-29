import React, { useState, useEffect } from "react";
import { Page, CarouselSlide } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, RefreshCw, AlertCircle } from "lucide-react";

interface HeroCarouselProps {
  setCurrentPage: (page: Page) => void;
  setSelectedCourseId: (id: string) => void;
}

const DEFAULT_SLIDES: CarouselSlide[] = [
  {
    id: "slide-1",
    title: "SHAPING EAST AFRICA'S DIGITAL FRONTIER",
    subtitle: "Acquire certified technical and software expertise in our high-speed computing labs in Nairobi.",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200",
    ctaText: "EXPLORE IT COURSES",
    ctaPage: "courses"
  },
  {
    id: "slide-2",
    title: "MASTER THE ART OF CULINARY EXCELLENCE",
    subtitle: "Learn professional culinary arts, pastry baking, and hospitality management under master chefs.",
    imageUrl: "https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?auto=format&fit=crop&q=80&w=1200",
    ctaText: "CULINARY PROGRAMS",
    ctaPage: "courses"
  },
  {
    id: "slide-3",
    title: "EMPOWER YOUR CREATIVE APPAREL VISION",
    subtitle: "From custom pattern drafting to professional garment construction, launch your own bespoke tailoring brand.",
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1200",
    ctaText: "FASHION DESIGN COURSES",
    ctaPage: "courses"
  },
  {
    id: "slide-4",
    title: "YOUR GATEWAY TO THE BEAUTY INDUSTRY",
    subtitle: "Gain certified skills in advanced chemical hair styling, aesthetics, skin therapy, and professional makeup.",
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200",
    ctaText: "BEAUTY & COSMETOLOGY",
    ctaPage: "courses"
  }
];

export default function HeroCarousel({ setCurrentPage, setSelectedCourseId }: HeroCarouselProps) {
  const [slides, setSlides] = useState<CarouselSlide[]>(DEFAULT_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<number>(1); // 1 = next, -1 = prev

  // Load slides from the backend API
  useEffect(() => {
    fetch("/api/slides")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch slides");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSlides(data);
        }
      })
      .catch((err) => {
        console.warn("Could not load slides from backend, using static defaults:", err);
      });
  }, []);

  // Safe bounds check
  useEffect(() => {
    if (currentIndex >= slides.length) {
      setCurrentIndex(Math.max(0, slides.length - 1));
    }
  }, [slides, currentIndex]);

  // Auto rotation timer
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const handlePrev = () => {
    if (slides.length <= 1) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (slides.length <= 1) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handleDotClick = (idx: number) => {
    if (idx === currentIndex) return;
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  const handleCtaClick = (page: Page) => {
    if (page === "courses") {
      const activeSlide = slides[currentIndex];
      const titleLower = (activeSlide?.title || "").toLowerCase();
      if (titleLower.includes("culinary") || titleLower.includes("baking") || titleLower.includes("catering")) {
        setSelectedCourseId("hospitality");
      } else if (titleLower.includes("fashion") || titleLower.includes("tailor") || titleLower.includes("apparel")) {
        setSelectedCourseId("fashion");
      } else if (titleLower.includes("beauty") || titleLower.includes("cosmetology") || titleLower.includes("hair")) {
        setSelectedCourseId("beauty");
      } else {
        setSelectedCourseId("it");
      }
    }
    
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0
    })
  };

  const activeSlide = slides[currentIndex];

  return (
    <section 
      id="hero-carousel"
      className="relative w-full overflow-hidden bg-[#0D1B4B] min-h-[450px] md:h-[550px] lg:h-[600px] border-b border-white/10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* BACKGROUND ABSTRACT DESIGN BLURS */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A84C]/5 rounded-full blur-3xl -mr-20 -mt-20 z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -ml-20 -mb-20 z-0 pointer-events-none" />

      {slides.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center p-12 text-center text-white/70">
          <AlertCircle size={48} className="text-[#C9A84C] mb-4" />
          <p className="text-lg">No slides loaded.</p>
        </div>
      ) : (
        <div className="relative h-full w-full">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            {activeSlide && (
              <motion.div
                key={activeSlide.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 220, damping: 28 },
                  opacity: { duration: 0.25 }
                }}
                className="grid grid-cols-1 md:grid-cols-2 h-full w-full"
              >
                {/* LEFT SPLIT PANEL: IMAGE */}
                <div className="relative h-[220px] md:h-full overflow-hidden bg-brand-navy border-r-0 md:border-r border-white/10">
                  <div className="absolute inset-0 bg-brand-navy flex items-center justify-center -z-10">
                    <RefreshCw className="text-[#C9A84C] animate-spin" size={24} />
                  </div>
                  <img
                    src={activeSlide.imageUrl}
                    alt={activeSlide.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter brightness-[0.85] grayscale-[10%] select-none pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent via-[#0D1B4B]/30 to-[#0D1B4B]/95 pointer-events-none" />
                </div>

                {/* RIGHT SPLIT PANEL: TEXT CONTENT */}
                <div className="flex flex-col justify-center items-start text-left p-8 md:p-12 lg:p-16 bg-[#0D1B4B] relative z-10 md:min-h-full">
                  <div className="max-w-xl">
                    <span className="text-[#C9A84C] uppercase tracking-[0.4em] text-[10px] md:text-xs font-bold mb-3 block">
                      Institutional Excellence
                    </span>
                    
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.05] text-white mb-4 uppercase tracking-tighter">
                      {activeSlide.title}
                    </h1>

                    <div className="w-12 h-1 bg-[#C9A84C] mb-6 rounded" />

                    <p className="text-xs sm:text-sm md:text-base text-white/70 mb-8 leading-relaxed italic border-l border-[#C9A84C] pl-4 font-light">
                      {activeSlide.subtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() => handleCtaClick(activeSlide.ctaPage)}
                        className="bg-[#C9A84C] text-[#0D1B4B] px-8 py-3.5 font-bold text-xs tracking-widest uppercase hover:bg-white hover:text-[#0D1B4B] transition-all duration-300 shadow-lg text-center cursor-pointer"
                      >
                        {activeSlide.ctaText}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* MANUAL NAVIGATION CHEVRONS */}
      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-10 h-10 border border-white/20 hover:border-[#C9A84C] hover:bg-[#0D1B4B]/80 text-white hover:text-[#C9A84C] bg-[#0D1B4B]/35 transition-all duration-200 cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-10 h-10 border border-white/20 hover:border-[#C9A84C] hover:bg-[#0D1B4B]/80 text-white hover:text-[#C9A84C] bg-[#0D1B4B]/35 transition-all duration-200 cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* CAROUSEL BOTTOM DOTS */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 bg-[#0D1B4B]/60 backdrop-blur-sm px-4 py-2 border border-white/10 rounded-none">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={`h-2 transition-all duration-300 cursor-pointer ${
                idx === currentIndex 
                  ? "w-8 bg-[#C9A84C]" 
                  : "w-2 bg-white/40 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
