import React, { useState, useEffect, useRef } from "react";
import { Page, CarouselSlide } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Edit3, 
  X, 
  Upload, 
  RefreshCw, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

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

const SAMPLE_PHOTOS = [
  { name: "IT Lab", url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200" },
  { name: "Catering & Baking", url: "https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?auto=format&fit=crop&q=80&w=1200" },
  { name: "Fashion & Tailoring", url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1200" },
  { name: "Cosmetology & Beauty", url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200" },
  { name: "Nairobi Campus Study", url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200" },
  { name: "Graduation Ceremony", url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200" }
];

export default function HeroCarousel({ setCurrentPage, setSelectedCourseId }: HeroCarouselProps) {
  // 1. CAROUSEL SLIDES STATE (Loaded from localStorage or defaults)
  const [slides, setSlides] = useState<CarouselSlide[]>(() => {
    const saved = localStorage.getItem("adia_carousel_slides");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error loading saved slides", e);
      }
    }
    return DEFAULT_SLIDES;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<number>(1); // 1 = next, -1 = prev
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "true" || params.get("configure") === "true") {
      setIsAdmin(true);
    }
  }, []);

  // 2. CAROUSEL MANAGER MODAL STATE
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  
  // Slide Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formSubtitle, setFormSubtitle] = useState("");
  const [imageOption, setImageOption] = useState<"url" | "sample" | "upload">("sample");
  const [formImageUrl, setFormImageUrl] = useState(SAMPLE_PHOTOS[0].url);
  const [formCtaText, setFormCtaText] = useState("LEARN MORE");
  const [formCtaPage, setFormCtaPage] = useState<Page>("courses");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persistence write-back
  useEffect(() => {
    localStorage.setItem("adia_carousel_slides", JSON.stringify(slides));
  }, [slides]);

  // Handle active slide safety check (if slides are deleted)
  useEffect(() => {
    if (currentIndex >= slides.length) {
      setCurrentIndex(Math.max(0, slides.length - 1));
    }
  }, [slides, currentIndex]);

  // 3. AUTO ROTATION TIMER
  useEffect(() => {
    if (isPaused || isManagerOpen || slides.length <= 1) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused, isManagerOpen, slides.length]);

  // 4. NAVIGATION HANDLERS
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
    // If the slide redirects to "courses" and it relates to specific keywords, set standard course selection
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

  // 5. CAROUSEL MANAGER LOGIC
  const openManager = () => {
    setIsManagerOpen(true);
    resetForm();
  };

  const resetForm = () => {
    setEditingSlideId(null);
    setFormTitle("");
    setFormSubtitle("");
    setImageOption("sample");
    setFormImageUrl(SAMPLE_PHOTOS[0].url);
    setFormCtaText("LEARN MORE");
    setFormCtaPage("courses");
    setErrorMessage("");
    setSuccessMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEditSlide = (slide: CarouselSlide) => {
    setEditingSlideId(slide.id);
    setFormTitle(slide.title);
    setFormSubtitle(slide.subtitle);
    setFormCtaText(slide.ctaText);
    setFormCtaPage(slide.ctaPage);
    
    // Attempt to match image option
    const sampleMatch = SAMPLE_PHOTOS.find(p => p.url === slide.imageUrl);
    if (sampleMatch) {
      setImageOption("sample");
      setFormImageUrl(slide.imageUrl);
    } else if (slide.imageUrl.startsWith("data:image")) {
      setImageOption("upload");
      setFormImageUrl(slide.imageUrl);
    } else {
      setImageOption("url");
      setFormImageUrl(slide.imageUrl);
    }
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleDeleteSlide = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (slides.length <= 1) {
      setErrorMessage("Cannot delete. The carousel must contain at least 1 slide.");
      return;
    }
    
    if (confirm("Are you sure you want to delete this slide from the carousel?")) {
      const updated = slides.filter(s => s.id !== id);
      setSlides(updated);
      setSuccessMessage("Slide deleted successfully.");
      if (editingSlideId === id) {
        resetForm();
      }
    }
  };

  const handleMoveSlide = (idx: number, moveDirection: "up" | "down", e: React.MouseEvent) => {
    e.stopPropagation();
    const swapIdx = moveDirection === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= slides.length) return;
    
    const updated = [...slides];
    const temp = updated[idx];
    updated[idx] = updated[swapIdx];
    updated[swapIdx] = temp;
    setSlides(updated);
    setCurrentIndex(0); // sync carousel pointer
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setErrorMessage("Image file is too large. Please select an image under 3MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setFormImageUrl(reader.result);
        setSuccessMessage("Image uploaded successfully as preview.");
        setErrorMessage("");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSlideForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setErrorMessage("Slide Title is required.");
      return;
    }
    if (!formSubtitle.trim()) {
      setErrorMessage("Slide Subtitle/Description is required.");
      return;
    }
    if (!formImageUrl.trim()) {
      setErrorMessage("An Image is required. Please select, upload, or paste a URL.");
      return;
    }

    if (editingSlideId) {
      // Edit existing slide
      const updated = slides.map(s => {
        if (s.id === editingSlideId) {
          return {
            ...s,
            title: formTitle.toUpperCase(),
            subtitle: formSubtitle,
            imageUrl: formImageUrl,
            ctaText: formCtaText.toUpperCase(),
            ctaPage: formCtaPage
          };
        }
        return s;
      });
      setSlides(updated);
      setSuccessMessage("Slide updated successfully!");
    } else {
      // Create new slide
      const newSlide: CarouselSlide = {
        id: "slide-" + Date.now(),
        title: formTitle.toUpperCase(),
        subtitle: formSubtitle,
        imageUrl: formImageUrl,
        ctaText: formCtaText.toUpperCase(),
        ctaPage: formCtaPage
      };
      setSlides([...slides, newSlide]);
      setSuccessMessage("New slide added successfully!");
    }

    // Reset form field inputs
    const prevEditingId = editingSlideId;
    resetForm();
    if (prevEditingId) {
      // If was editing, close form
      setEditingSlideId(null);
    }
  };

  const handleResetDefaults = () => {
    if (confirm("Reset the carousel to ADIA's default institutional slides? Any custom slides will be overwritten.")) {
      setSlides(DEFAULT_SLIDES);
      setCurrentIndex(0);
      resetForm();
      setSuccessMessage("Reset to original institutional slides.");
    }
  };

  // 6. FRAMER MOTION TRANSITION SETTINGS
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

      {/* CAROUSEL BODY CONTENT SCREEN */}
      {slides.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center p-12 text-center text-white/70">
          <AlertCircle size={48} className="text-[#C9A84C] mb-4" />
          <p className="text-lg">No slides loaded. Please click settings to add slides.</p>
          <button 
            onClick={openManager}
            className="mt-4 bg-[#C9A84C] text-[#0D1B4B] px-6 py-2.5 font-bold text-xs tracking-widest uppercase hover:bg-white transition-colors cursor-pointer"
          >
            Create Slide
          </button>
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
                  {/* Image transition fallback spinner */}
                  <div className="absolute inset-0 bg-brand-navy flex items-center justify-center -z-10">
                    <RefreshCw className="text-[#C9A84C] animate-spin" size={24} />
                  </div>
                  <img
                    src={activeSlide.imageUrl}
                    alt={activeSlide.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter brightness-[0.85] grayscale-[10%] select-none pointer-events-none"
                  />
                  {/* Subtle golden diagonal divider highlight */}
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

      {/* FLOAT MANAGE CAROUSEL BUTTON (CLEAN MINIMAL SETTINGS PIN) */}
      {isAdmin && (
        <div className="absolute top-4 right-4 z-40">
          <button
            onClick={openManager}
            title="Manage Slideshow"
            className="flex items-center gap-2 px-3 py-1.5 bg-[#0D1B4B]/70 hover:bg-[#C9A84C] text-[#C9A84C] hover:text-[#0D1B4B] border border-[#C9A84C]/45 hover:border-transparent text-[10px] tracking-widest uppercase font-bold backdrop-blur-md transition-all duration-300 shadow-md cursor-pointer"
          >
            <Settings size={12} className="animate-spin-slow" />
            <span>Configure Slider</span>
          </button>
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

      {/* 7. CAROUSEL CONSOLE & IMAGE ADDER DRAWER / MODAL */}
      <AnimatePresence>
        {isManagerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0D1B4B] border-2 border-[#C9A84C] w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden text-white"
            >
              {/* MODAL HEADER */}
              <div className="flex items-center justify-between border-b border-white/15 px-6 py-4 bg-[#0A1435]">
                <div className="flex items-center gap-2">
                  <Settings className="text-[#C9A84C] animate-spin-slow" size={20} />
                  <h3 className="text-sm md:text-base font-bold tracking-widest uppercase">
                    ADIA SLIDER CONFIGURATION PANEL
                  </h3>
                </div>
                <button
                  onClick={() => setIsManagerOpen(false)}
                  className="text-white/60 hover:text-white hover:bg-white/10 p-1 rounded transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* MODAL MAIN CONTENT */}
              <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/15">
                
                {/* LEFT PANE: SLIDES LIST (lg:col-span-5) */}
                <div className="lg:col-span-5 p-6 overflow-y-auto max-h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold text-[#C9A84C] tracking-widest uppercase">
                      ACTIVE CAROUSEL SLIDES ({slides.length})
                    </h4>
                    <button
                      onClick={resetForm}
                      className="text-[10px] font-bold text-white/50 hover:text-[#C9A84C] uppercase flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={12} /> Add New Form
                    </button>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                    {slides.map((s, idx) => {
                      const isEditing = editingSlideId === s.id;
                      return (
                        <div
                          key={s.id}
                          onClick={() => handleEditSlide(s)}
                          className={`group p-3 border text-left cursor-pointer flex items-center gap-3 transition-all relative ${
                            isEditing 
                              ? "border-[#C9A84C] bg-white/5" 
                              : "border-white/10 bg-[#0A1435] hover:border-white/20"
                          }`}
                        >
                          {/* Image Thumbnail */}
                          <div className="w-16 h-12 bg-black/40 flex-shrink-0 border border-white/10 overflow-hidden relative">
                            <img
                              src={s.imageUrl}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 right-0 bg-[#0D1B4B] text-[8px] font-bold text-white/80 px-1">
                              #{idx + 1}
                            </div>
                          </div>

                          {/* Text Detail */}
                          <div className="flex-1 min-w-0">
                            <h5 className="text-[11px] font-bold tracking-wide truncate uppercase text-white">
                              {s.title || "UNTITLED SLIDE"}
                            </h5>
                            <p className="text-[10px] text-white/60 truncate mt-0.5">
                              {s.subtitle || "No subtitle provided."}
                            </p>
                            <span className="text-[9px] font-semibold text-[#C9A84C] bg-[#C9A84C]/10 px-1.5 py-0.5 uppercase mt-1 inline-block">
                              CTA: {s.ctaPage}
                            </span>
                          </div>

                          {/* Control Actions overlay/buttons */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => handleMoveSlide(idx, "up", e)}
                              disabled={idx === 0}
                              className="p-1 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 cursor-pointer"
                              title="Move Up"
                            >
                              <ArrowUp size={12} />
                            </button>
                            <button
                              onClick={(e) => handleMoveSlide(idx, "down", e)}
                              disabled={idx === slides.length - 1}
                              className="p-1 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 cursor-pointer"
                              title="Move Down"
                            >
                              <ArrowDown size={12} />
                            </button>
                            <button
                              onClick={(e) => handleDeleteSlide(s.id, e)}
                              className="p-1 hover:bg-red-950/40 text-white/50 hover:text-red-400 cursor-pointer"
                              title="Delete Slide"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-white/15 pt-4 mt-4">
                    <button
                      onClick={handleResetDefaults}
                      className="w-full border border-white/10 text-white/60 hover:text-white hover:bg-white/5 hover:border-white/20 py-2 text-[10px] font-semibold tracking-widest uppercase transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <RefreshCw size={10} />
                      Reset to Defaults
                    </button>
                  </div>
                </div>

                {/* RIGHT PANE: ADD / EDIT SLIDE FORM (lg:col-span-7) */}
                <div className="lg:col-span-7 p-6 flex flex-col justify-between">
                  <form onSubmit={handleSaveSlideForm} className="space-y-4 text-left">
                    <div>
                      <h4 className="text-xs font-bold text-[#C9A84C] tracking-widest uppercase mb-4">
                        {editingSlideId ? "EDITING SLIDE" : "CREATE NEW SLIDE"}
                      </h4>
                    </div>

                    {/* SLIDE TITLE */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-white/70 block">
                        Slide Title / Headline
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. EMPOWERING COMS THROUGH SKILL DEVELOPMENT"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="w-full bg-[#0A1435] border border-white/10 px-3 py-2 text-xs uppercase text-white focus:outline-none focus:border-[#C9A84C]"
                      />
                    </div>

                    {/* SLIDE SUBTITLE / DESC */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-white/70 block">
                        Slide Subtitle / Paragraph Description
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Provide a compelling 1-2 sentence overview for this vocational category..."
                        value={formSubtitle}
                        onChange={(e) => setFormSubtitle(e.target.value)}
                        className="w-full bg-[#0A1435] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                      />
                    </div>

                    {/* IMAGE SOURCE OPTIONS (Pre-sets / URL / Upload) */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-white/70 block">
                        Slide Photo / Image Source
                      </label>
                      
                      <div className="grid grid-cols-3 gap-2 bg-[#0A1435] p-1 border border-white/10">
                        <button
                          type="button"
                          onClick={() => setImageOption("sample")}
                          className={`py-1.5 text-[9px] font-bold tracking-wider uppercase transition-colors cursor-pointer ${
                            imageOption === "sample" 
                              ? "bg-[#C9A84C] text-[#0D1B4B]" 
                              : "text-white/60 hover:text-white"
                          }`}
                        >
                          Sample Presets
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageOption("upload")}
                          className={`py-1.5 text-[9px] font-bold tracking-wider uppercase transition-colors cursor-pointer ${
                            imageOption === "upload" 
                              ? "bg-[#C9A84C] text-[#0D1B4B]" 
                              : "text-white/60 hover:text-white"
                          }`}
                        >
                          Upload Photo
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageOption("url")}
                          className={`py-1.5 text-[9px] font-bold tracking-wider uppercase transition-colors cursor-pointer ${
                            imageOption === "url" 
                              ? "bg-[#C9A84C] text-[#0D1B4B]" 
                              : "text-white/60 hover:text-white"
                          }`}
                        >
                          Custom URL
                        </button>
                      </div>

                      {/* CONDITIONAL OPTION 1: SAMPLE PRESETS */}
                      {imageOption === "sample" && (
                        <div className="space-y-1.5 bg-[#0A1435]/50 p-3 border border-white/5">
                          <span className="text-[9px] text-white/50 uppercase tracking-widest block font-semibold">
                            Select Nairobi Vocational Training Preset:
                          </span>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {SAMPLE_PHOTOS.map((p) => {
                              const isSelected = formImageUrl === p.url;
                              return (
                                <button
                                  type="button"
                                  key={p.name}
                                  onClick={() => {
                                    setFormImageUrl(p.url);
                                    setSuccessMessage("");
                                  }}
                                  className={`p-1 text-left border relative flex items-center gap-1.5 group cursor-pointer ${
                                    isSelected 
                                      ? "border-[#C9A84C] bg-[#C9A84C]/10" 
                                      : "border-white/10 hover:border-white/20 bg-[#0A1435]"
                                  }`}
                                >
                                  <img
                                    src={p.url}
                                    alt=""
                                    referrerPolicy="no-referrer"
                                    className="w-8 h-6 object-cover border border-white/10"
                                  />
                                  <span className="text-[8px] font-bold uppercase tracking-tight text-white/90 truncate">
                                    {p.name}
                                  </span>
                                  {isSelected && (
                                    <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-[#C9A84C] rounded-full" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* CONDITIONAL OPTION 2: UPLOAD IMAGE */}
                      {imageOption === "upload" && (
                        <div className="bg-[#0A1435]/50 p-3 border border-white/5 space-y-3">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="bg-[#0D1B4B] hover:bg-white/10 border border-white/20 px-4 py-2 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                            >
                              <Upload size={12} />
                              Choose Local Image
                            </button>
                            <span className="text-[9px] text-white/40">
                              PNG, JPG or WEBP formats under 3MB.
                            </span>
                          </div>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept="image/*"
                            className="hidden"
                          />
                          {formImageUrl.startsWith("data:image") && (
                            <div className="flex items-center gap-2 bg-[#0D1B4B] p-2 border border-white/10 w-fit">
                              <ImageIcon size={14} className="text-[#C9A84C]" />
                              <span className="text-[9px] text-white/80 font-mono truncate max-w-xs">
                                Local base64 image buffered
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* CONDITIONAL OPTION 3: CUSTOM IMAGE URL */}
                      {imageOption === "url" && (
                        <div className="space-y-1">
                          <input
                            type="text"
                            placeholder="Enter external https:// image web address..."
                            value={formImageUrl.startsWith("data:image") ? "" : formImageUrl}
                            onChange={(e) => setFormImageUrl(e.target.value)}
                            className="w-full bg-[#0A1435] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                          />
                          <p className="text-[9px] text-white/40">
                            Must be a secure (https://) direct photo link (e.g. from Unsplash or Pinterest).
                          </p>
                        </div>
                      )}
                    </div>

                    {/* BOTTOM FIELDS: CTA TEXT & TARGET PAGE */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-white/70 block">
                          CTA Button Text
                        </label>
                        <input
                          type="text"
                          placeholder="EXPLORE PROGRAMS"
                          value={formCtaText}
                          onChange={(e) => setFormCtaText(e.target.value)}
                          className="w-full bg-[#0A1435] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C] uppercase"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-white/70 block">
                          CTA Target Page
                        </label>
                        <select
                          value={formCtaPage}
                          onChange={(e) => setFormCtaPage(e.target.value as Page)}
                          className="w-full bg-[#0A1435] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                        >
                          <option value="courses">School Programs</option>
                          <option value="admissions">Online Admissions</option>
                          <option value="about">About Institute</option>
                          <option value="gallery">Photo Gallery</option>
                          <option value="news">News & Updates</option>
                          <option value="contact">Contact reception</option>
                          <option value="home">Home Page</option>
                        </select>
                      </div>
                    </div>

                    {/* MESSAGES BAR */}
                    {errorMessage && (
                      <div className="bg-red-950/40 border border-red-500/35 p-3 flex items-start gap-2">
                        <AlertCircle className="text-red-400 mt-0.5 flex-shrink-0" size={14} />
                        <span className="text-[10px] text-red-200 leading-tight">{errorMessage}</span>
                      </div>
                    )}

                    {successMessage && (
                      <div className="bg-emerald-950/40 border border-emerald-500/35 p-3 flex items-start gap-2">
                        <CheckCircle2 className="text-emerald-400 mt-0.5 flex-shrink-0" size={14} />
                        <span className="text-[10px] text-emerald-200 leading-tight">{successMessage}</span>
                      </div>
                    )}
                  </form>

                  {/* FORM ACTION CONTROL BUTTONS */}
                  <div className="flex gap-3 border-t border-white/15 pt-4 mt-6">
                    <button
                      type="button"
                      onClick={handleSaveSlideForm}
                      className="flex-1 bg-[#C9A84C] hover:bg-white text-[#0D1B4B] font-bold py-3 text-xs tracking-widest uppercase transition-colors text-center cursor-pointer"
                    >
                      {editingSlideId ? "Update Slide Specs" : "Add Slide To Slider"}
                    </button>
                    {editingSlideId && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="border border-white/20 hover:bg-white/5 hover:text-white px-4 text-xs font-bold tracking-widest uppercase cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

              </div>

              {/* MODAL FOOTER */}
              <div className="border-t border-white/15 px-6 py-4 bg-[#0A1435] flex justify-between items-center text-[10px] text-white/50">
                <span>Configure individual slides. Slide changes will be retained in local storage.</span>
                <button
                  onClick={() => setIsManagerOpen(false)}
                  className="bg-[#C9A84C]/10 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0D1B4B] border border-[#C9A84C]/30 hover:border-transparent px-5 py-2 font-bold tracking-widest uppercase transition-colors cursor-pointer"
                >
                  Close Console
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
