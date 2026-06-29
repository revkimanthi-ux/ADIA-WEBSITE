import { useState, useEffect } from "react";
import { NEWS_DATA } from "../data";
import { NewsPost } from "../types";
import { Search, Calendar, Tag, ChevronRight, X, Clock, HelpCircle, RefreshCw } from "lucide-react";

export default function NewsView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "News" | "Event" | "Announcement">("all");
  const [activePost, setActivePost] = useState<NewsPost | null>(null);
  const [newsPosts, setNewsPosts] = useState<NewsPost[]>(NEWS_DATA);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch news");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setNewsPosts(data);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn("Using default static news data:", err);
        setIsLoading(false);
      });
  }, []);

  const filteredPosts = newsPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full page-enter">
      {/* Page Header */}
      <section className="bg-[#091232] border-b border-[#1A2E6E] py-16 px-4 md:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-15" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800')` }} />
        <div className="relative max-w-4xl mx-auto flex flex-col items-center gap-3 z-10">
          <span className="text-brand-gold font-bold uppercase tracking-widest text-xs">Stay Informed</span>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-none uppercase">
            NEWS & ANNOUNCEMENTS
          </h1>
          <div className="w-20 h-1 bg-brand-gold rounded mt-1" />
          <p className="text-sm md:text-base text-white/80 max-w-2xl mt-2 font-light">
            Stay updated with our latest workshops, academic intake announcements, local catering projects, and proud graduate trade exhibitions in Nairobi.
          </p>
        </div>
      </section>

      {/* Main Content containing Filters + Blog Cards */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        {/* Search & Category Filter Header Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#0c163b] border border-[#1e2f75] p-5 rounded-xl mb-12">
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search news and posts..."
              className="w-full bg-brand-navy border border-[#1e2f75] focus:border-brand-gold text-white placeholder-white/40 text-xs pl-9 pr-4 py-2.5 rounded-lg focus:outline-none"
            />
            <Search size={14} className="absolute left-3 top-3.5 text-white/40" />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {["all", "News", "Event", "Announcement"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as any)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#1A2E6E] text-brand-gold border border-brand-gold/60"
                    : "text-white/75 hover:text-brand-gold hover:bg-white/5 border border-transparent"
                }`}
              >
                {cat === "all" ? "All Updates" : cat + "s"}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Post List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-[#0c163b] border border-[#1e2f75] hover:border-brand-gold rounded-xl overflow-hidden shadow-lg flex flex-col group transition-all duration-300 hover:-translate-y-1"
            >
              {/* Cover Image */}
              <div className="h-48 w-full relative overflow-hidden bg-brand-navy">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 filter brightness-95"
                />
                <div className="absolute top-3 left-3 bg-brand-navy border border-brand-gold/30 text-brand-gold font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded">
                  {post.category}
                </div>
              </div>

              {/* Text Area */}
              <div className="p-6 flex-1 flex flex-col text-left items-start">
                <div className="flex items-center gap-1.5 text-xs text-white/40 mb-2">
                  <Calendar size={12} className="text-brand-gold/60" />
                  <span>{post.date}</span>
                </div>

                <h3 className="font-sans font-bold text-base text-white line-clamp-2 leading-snug group-hover:text-brand-gold transition-colors mb-3">
                  {post.title}
                </h3>

                <p className="text-xs text-white/70 line-clamp-3 leading-relaxed mb-5 font-light">
                  {post.summary}
                </p>

                {/* Read button */}
                <button
                  onClick={() => setActivePost(post)}
                  className="mt-auto inline-flex items-center gap-1 text-xs font-bold text-brand-gold hover:text-[#e2c062] group/btn cursor-pointer"
                >
                  <span>Read Full Article</span>
                  <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="py-24 text-center flex flex-col items-center justify-center gap-3">
            <HelpCircle size={36} className="text-white/20" />
            <p className="text-sm text-white/50 font-light">No announcements matches your current search filters.</p>
          </div>
        )}
      </section>

      {/* 3. DETAILED READING POPUP MODAL */}
      {activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Overlay mask */}
          <div className="fixed inset-0 bg-black/85 backdrop-blur-xs" onClick={() => setActivePost(null)} />

          {/* Modal Container */}
          <div className="relative bg-[#0c163b] border border-[#1e2f75] rounded-xl overflow-hidden max-w-2xl w-full shadow-2xl z-10 flex flex-col max-h-[90vh] text-left animate-scaleUp">
            {/* Header image frame */}
            <div className="h-56 md:h-64 w-full relative overflow-hidden bg-brand-navy flex-shrink-0">
              <img
                src={activePost.imageUrl}
                alt={activePost.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c163b] to-black/35" />
              <div className="absolute bottom-4 left-6 right-6">
                <span className="bg-brand-gold text-brand-navy font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded inline-block mb-2">
                  {activePost.category}
                </span>
                <h2 className="font-sans font-bold text-lg md:text-xl text-white leading-tight">
                  {activePost.title}
                </h2>
              </div>
              <button
                onClick={() => setActivePost(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white hover:text-brand-gold flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content body Scrollable */}
            <div className="p-6 overflow-y-auto flex flex-col gap-4 bg-[#0c163b]">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-white/55 border-b border-white/5 pb-3">
                <div className="flex items-center gap-1.5">
                  <Clock size={12} className="text-brand-gold" />
                  <span>Published on: <strong className="text-white">{activePost.date}</strong></span>
                </div>
                {activePost.tags && (
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <Tag size={12} className="text-brand-gold/60" />
                    {activePost.tags.map((tag, idx) => (
                      <span key={idx} className="bg-brand-navy text-[10px] text-brand-gold px-2 py-0.5 rounded-full border border-brand-gold/15 font-semibold">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Main content paragraph */}
              <div className="text-xs md:text-sm text-white/90 leading-relaxed font-light space-y-4">
                {activePost.content.split("\n\n").map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              <div className="border-t border-white/5 pt-5 mt-4 text-center flex flex-col items-center gap-1">
                <span className="text-[10px] text-white/40">ADIA Empowerment Centre | Nairobi, Kenya</span>
                <span className="text-[9px] text-brand-gold uppercase tracking-wider font-semibold">Empowering Communities Through Skill Development</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
