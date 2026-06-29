import { useState, useEffect } from "react";
import { GALLERY_DATA } from "../data";
import { GalleryItem } from "../types";
import { Camera, Layers, X, Info, Image, RefreshCw } from "lucide-react";

export default function GalleryView() {
  const [filter, setFilter] = useState<"all" | "it" | "hospitality" | "fashion" | "beauty" | "campus">("all");
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(GALLERY_DATA);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch gallery");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setGalleryItems(data);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn("Using default static gallery data:", err);
        setIsLoading(false);
      });
  }, []);

  const filterButtons: { label: string; value: typeof filter }[] = [
    { label: "All Photos", value: "all" },
    { label: "IT Studies", value: "it" },
    { label: "Hospitality & Catering", value: "hospitality" },
    { label: "Fashion & Design", value: "fashion" },
    { label: "Beauty & Cosmetology", value: "beauty" },
    { label: "Campus Life", value: "campus" }
  ];

  const filteredData = filter === "all"
    ? galleryItems
    : galleryItems.filter((item) => item.category === filter);

  return (
    <div className="w-full page-enter">
      {/* Page Header */}
      <section className="bg-[#091232] border-b border-[#1A2E6E] py-16 px-4 md:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-15" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800')` }} />
        <div className="relative max-w-4xl mx-auto flex flex-col items-center gap-3 z-10">
          <span className="text-brand-gold font-bold uppercase tracking-widest text-xs">A Visual Journey</span>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-none uppercase">
            CAMPUS GALLERY
          </h1>
          <div className="w-20 h-1 bg-brand-gold rounded mt-1" />
          <p className="text-sm md:text-base text-white/80 max-w-2xl mt-2 font-light">
            Discover a visual window into our training spaces, students' practical kitchen sessions, bespoke fashion runway drafts, and proud graduation successes in Nairobi.
          </p>
        </div>
      </section>

      {/* Gallery Filters & Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        {/* Category Filter Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filterButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full border transition-all duration-300 cursor-pointer ${
                filter === btn.value
                  ? "bg-brand-gold border-brand-gold text-brand-navy shadow-lg"
                  : "bg-[#0c163b] border-[#1e2f75] text-white/80 hover:border-brand-gold/45"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Gallery Image Grid (lazy-loaded WebP optimized layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredData.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group bg-[#0c163b] border border-[#1e2f75] hover:border-brand-gold rounded-xl overflow-hidden shadow-md cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative aspect-square overflow-hidden bg-brand-navy">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                />
                
                {/* Visual Hover Mask */}
                <div className="absolute inset-0 bg-brand-navy/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-left">
                  <span className="text-[9px] font-bold text-brand-gold uppercase tracking-widest mb-1 block">
                    {item.category === "it" ? "IT Studies" : item.category === "hospitality" ? "Hospitality" : item.category}
                  </span>
                  <h4 className="font-sans font-bold text-sm text-white leading-tight mb-2">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-white/70 leading-normal line-clamp-2 font-light">
                    {item.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-gold uppercase mt-4">
                    <span>View photo</span>
                    <Camera size={10} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center gap-3">
            <Image size={40} className="text-white/20" />
            <p className="text-sm text-white/50 font-light">No media items cataloged in this section yet.</p>
          </div>
        )}
      </section>

      {/* 3. FULL LIGHTBOX MODAL */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay mask */}
          <div className="fixed inset-0 bg-black/90 backdrop-blur-xs" onClick={() => setActiveItem(null)} />

          {/* Modal Card content */}
          <div className="relative bg-[#0c163b] border border-brand-gold/40 rounded-xl overflow-hidden max-w-3xl w-full shadow-2xl z-10 flex flex-col md:flex-row animate-scaleUp">
            {/* Close Button */}
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white hover:text-brand-gold flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>

            {/* Photo Left */}
            <div className="md:w-3/5 bg-black flex items-center justify-center">
              <img
                src={activeItem.imageUrl}
                alt={activeItem.title}
                className="w-full h-auto max-h-[400px] md:max-h-[500px] object-contain"
              />
            </div>

            {/* Texts Right */}
            <div className="md:w-2/5 p-6 flex flex-col justify-center text-left bg-[#0c163b]">
              <span className="text-[9px] font-bold text-brand-gold uppercase tracking-widest mb-1.5 block">
                {activeItem.category === "it" ? "School of Computing" : activeItem.category === "hospitality" ? "Culinary Arts" : activeItem.category === "fashion" ? "Apparel & Design" : activeItem.category}
              </span>
              <h3 className="font-sans font-bold text-lg text-white mb-3 leading-tight uppercase">
                {activeItem.title}
              </h3>
              <div className="w-10 h-0.5 bg-brand-gold rounded mb-4" />
              <p className="text-xs text-white/80 leading-relaxed font-light mb-6">
                {activeItem.description}
              </p>
              
              <div className="flex gap-2.5 items-center border-t border-white/5 pt-4 text-white/50 text-[10px]">
                <Info size={12} className="text-brand-gold" />
                <span>ADIA Campus Archive | Nairobi, Kenya</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
