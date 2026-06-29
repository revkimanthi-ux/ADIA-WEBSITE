
  import React, { useState, useEffect } from "react";
import { Page, CarouselSlide, HeaderConfig, NewsPost, GalleryItem } from "../types";
import { 
  Lock, Layout, Phone, Globe, Image as ImageIcon, FileText, CheckCircle, 
  Trash2, Edit3, Plus, ArrowUp, ArrowDown, Save, Eye, EyeOff, ShieldAlert, Activity, LogOut, Clock, ShieldCheck, RefreshCw, AlertCircle, X, ExternalLink, HelpCircle
} from "lucide-react";

interface AdminViewProps {
  setCurrentPage: (page: Page) => void;
}

const POPULAR_UNSPLASH_SUGGESTIONS = [
  { name: "IT Studies Lab", url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200" },
  { name: "Culinary Cookery", url: "https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?auto=format&fit=crop&q=80&w=1200" },
  { name: "Baking & Pastry", url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1200" },
  { name: "Tailoring & Apparel", url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1200" },
  { name: "Cosmetology & Hair", url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200" },
  { name: "Salon Beauty Practice", url: "https://images.unsplash.com/photo-1605497746444-11d6118d867c?auto=format&fit=crop&q=80&w=1200" },
  { name: "Student Workspaces", url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200" },
  { name: "Graduation Gown Day", url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200" }
];

export default function AdminView({ setCurrentPage }: AdminViewProps) {
  // Admin Login & Advanced Security State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [forcePasswordChange, setForcePasswordChange] = useState(false);
  const [username, setUsername] = useState("admin");
  const [passcode, setPasscode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [cooldownTime, setCooldownTime] = useState(0);

  // Session inactivity auto-logout tracking
  const [sessionExpiry, setSessionExpiry] = useState<number | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);

  // Security Audit Records & active sessions
  const [securityLogs, setSecurityLogs] = useState<any[]>([]);
  const [activeSessionsCount, setActiveSessionsCount] = useState(1);

  // Passcode change Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPasscode: "",
    newPasscode: "",
    confirmNewPasscode: ""
  });

  // Content States
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [headerConfig, setHeaderConfig] = useState<HeaderConfig>({
    tel: "",
    admissionsOpen: "",
    email: "",
    facebook: "",
    instagram: "",
    whatsapp: "",
    logoText: "",
    logoSubtitle: ""
  });
  const [news, setNews] = useState<NewsPost[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  // UI Active states (added security log tab)
  const [activeTab, setActiveTab] = useState<"slides" | "info" | "gallery" | "news" | "security">("slides");
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Forms editing states
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [slideForm, setSlideForm] = useState<Partial<CarouselSlide>>({
    title: "",
    subtitle: "",
    imageUrl: "",
    ctaText: "",
    ctaPage: "courses"
  });

  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newsForm, setNewsForm] = useState<Partial<NewsPost>>({
    title: "",
    category: "News",
    summary: "",
    content: "",
    imageUrl: "",
    tags: []
  });
  const [newsTagsString, setNewsTagsString] = useState("");

  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [galleryForm, setGalleryForm] = useState<Partial<GalleryItem>>({
    title: "",
    category: "it",
    description: "",
    imageUrl: ""
  });

  const [isUploadingImage, setIsUploadingImage] = useState<"slide" | "gallery" | "news" | null>(null);

  const handleImageLocalUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "slide" | "gallery" | "news") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(type);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Data = reader.result as string;
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: file.name,
            fileData: base64Data,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");

        if (type === "slide") {
          setSlideForm(prev => ({ ...prev, imageUrl: data.url }));
        } else if (type === "gallery") {
          setGalleryForm(prev => ({ ...prev, imageUrl: data.url }));
        } else if (type === "news") {
          setNewsForm(prev => ({ ...prev, imageUrl: data.url }));
        }
        triggerStatus("success", `Image "${file.name}" uploaded and linked successfully!`);
      } catch (err: any) {
        triggerStatus("error", err.message || "Failed to upload image.");
      } finally {
        setIsUploadingImage(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Load session tokens if already authenticated in this session tab
  useEffect(() => {
    const token = sessionStorage.getItem("adia_admin_token");
    const expiresAt = sessionStorage.getItem("adia_admin_expires");
    const storedUsername = sessionStorage.getItem("adia_admin_username") || "admin";
    const isDefault = sessionStorage.getItem("adia_admin_is_default") === "true";
    
    if (token && expiresAt) {
      const expiryNum = parseInt(expiresAt, 10);
      if (expiryNum > Date.now()) {
        setIsAuthenticated(true);
        setSessionExpiry(expiryNum);
        setUsername(storedUsername);
        if (isDefault) {
          setForcePasswordChange(true);
        }
      } else {
        sessionStorage.clear();
      }
    }
  }, []);

  // Cooldown rate-limiting timer countdown
  useEffect(() => {
    if (cooldownTime <= 0) return;
    const timer = setInterval(() => {
      setCooldownTime((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownTime]);

  // Handle active session timeout countdown
  useEffect(() => {
    if (!isAuthenticated || !sessionExpiry) {
      setSecondsRemaining(null);
      return;
    }

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((sessionExpiry - Date.now()) / 1000));
      setSecondsRemaining(remaining);
      
      if (remaining <= 0) {
        handleLogout();
        triggerStatus("error", "Your session has expired due to 30 minutes of inactivity. Please sign in again.");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, sessionExpiry]);

  // Helper: Retrieve security authorization headers
  const getAuthHeaders = () => {
    const token = sessionStorage.getItem("adia_admin_token");
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  };

  // Helper: Refresh Security logs & session state
  const refreshSecurityLogs = () => {
    const token = sessionStorage.getItem("adia_admin_token");
    if (!token) return;
    fetch("/api/admin/security-logs", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((data) => {
        if (data) {
          setSecurityLogs(data.logs || []);
          setActiveSessionsCount(data.activeSessionsCount || 1);
        }
      })
      .catch((err) => console.warn("Could not load security records:", err));
  };

  // Fetch all backend dynamic configurations
  useEffect(() => {
    if (!isAuthenticated) return;
    const token = sessionStorage.getItem("adia_admin_token");
    if (!token) return;

    const headers = {
      "Authorization": `Bearer ${token}`
    };

    // Load Slides
    fetch("/api/slides")
      .then((res) => {
        if (res.status === 401) {
          handleLogout();
          return;
        }
        return res.json();
      })
      .then((data) => { if (data) setSlides(data); })
      .catch((err) => console.error("Error loading slides in admin panel:", err));

    // Load Header Config
    fetch("/api/header-config")
      .then((res) => res.json())
      .then((data) => setHeaderConfig(data))
      .catch((err) => console.error("Error loading header config in admin panel:", err));

    // Load News
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => setNews(data))
      .catch((err) => console.error("Error loading news in admin panel:", err));

    // Load Gallery
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => setGallery(data))
      .catch((err) => console.error("Error loading gallery in admin panel:", err));

    // Load Security audit logs
    fetch("/api/admin/security-logs", { headers })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch logs");
      })
      .then((data) => {
        setSecurityLogs(data.logs || []);
        setActiveSessionsCount(data.activeSessionsCount || 1);
      })
      .catch((err) => console.warn("Could not load security records:", err));
  }, [isAuthenticated]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldownTime > 0) return;
    
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, passcode })
      });
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 429) {
          setCooldownTime(60);
        }
        throw new Error(data.error || "Login failed");
      }
      
      // Save secure login credentials inside session storage
      sessionStorage.setItem("adia_admin_token", data.token);
      sessionStorage.setItem("adia_admin_expires", data.expiresAt.toString());
      sessionStorage.setItem("adia_admin_username", data.username);
      
      if (data.isDefaultPasscode) {
        sessionStorage.setItem("adia_admin_is_default", "true");
        setForcePasswordChange(true);
      } else {
        sessionStorage.removeItem("adia_admin_is_default");
        setForcePasswordChange(false);
      }
      
      setIsAuthenticated(true);
      setSessionExpiry(data.expiresAt);
      setPasscode("");
      setLoginError("");
    } catch (err: any) {
      setLoginError(err.message || "An error occurred during authentication.");
    }
  };

  const handleLogout = async () => {
    const token = sessionStorage.getItem("adia_admin_token");
    if (token) {
      try {
        await fetch("/api/admin/logout", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
      } catch (e) {
        console.warn("Logout request failed:", e);
      }
    }
    setIsAuthenticated(false);
    setSessionExpiry(null);
    setSecondsRemaining(null);
    sessionStorage.clear();
  };

  const handlePasscodeChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPasscode !== passwordForm.confirmNewPasscode) {
      triggerStatus("error", "New passcode and confirmation do not match.");
      return;
    }
    if (passwordForm.newPasscode.length < 4) {
      triggerStatus("error", "New passcode must be at least 4 characters long.");
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/change-passcode", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          currentPasscode: passwordForm.currentPasscode,
          newPasscode: passwordForm.newPasscode
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update passcode");
      
      triggerStatus("success", "Administrative security passcode changed and written to backend disk successfully!");
      setPasswordForm({ currentPasscode: "", newPasscode: "", confirmNewPasscode: "" });
      refreshSecurityLogs();
    } catch (err: any) {
      triggerStatus("error", err.message || "Failed to change passcode.");
    } finally {
      setIsSaving(false);
    }
  };

  // Status message utility
  const triggerStatus = (type: "success" | "error", text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  // --- SLIDE CRUD HANDLERS ---
  const handleSaveSlidesBackend = async (updatedSlides: CarouselSlide[]) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/slides", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ slides: updatedSlides })
      });
      if (!res.ok) {
        if (res.status === 401) {
          handleLogout();
          throw new Error("Session expired. Please log in again.");
        }
        throw new Error("Failed to save slides to server");
      }
      const data = await res.json();
      setSlides(data.slides);
      triggerStatus("success", "Hero slides synchronized successfully with backend disk storage.");
      refreshSecurityLogs();
    } catch (err: any) {
      triggerStatus("error", err.message || "Failed to update slides.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSlideFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideForm.title || !slideForm.imageUrl || !slideForm.subtitle) {
      triggerStatus("error", "Please fill in slide Title, Subtitle and direct image URL.");
      return;
    }

    let updatedList = [...slides];
    if (editingSlideId) {
      // Editing
      updatedList = updatedList.map((s) => 
        s.id === editingSlideId 
          ? { ...(s as CarouselSlide), ...slideForm, id: editingSlideId } as CarouselSlide
          : s
      );
      setEditingSlideId(null);
    } else {
      // Adding new slide
      const newSlide: CarouselSlide = {
        id: `slide-${Date.now()}`,
        title: slideForm.title.toUpperCase(),
        subtitle: slideForm.subtitle,
        imageUrl: slideForm.imageUrl,
        ctaText: (slideForm.ctaText || "LEARN MORE").toUpperCase(),
        ctaPage: (slideForm.ctaPage || "courses") as Page
      };
      updatedList.push(newSlide);
    }

    setSlideForm({ title: "", subtitle: "", imageUrl: "", ctaText: "", ctaPage: "courses" });
    handleSaveSlidesBackend(updatedList);
  };

  const handleEditSlideInit = (slide: CarouselSlide) => {
    setEditingSlideId(slide.id);
    setSlideForm(slide);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleDeleteSlide = (id: string) => {
    if (!window.confirm("Are you sure you want to remove this slide? This is immediately saved to the backend.")) return;
    const filtered = slides.filter((s) => s.id !== id);
    handleSaveSlidesBackend(filtered);
  };

  const handleMoveSlide = (idx: number, direction: "up" | "down") => {
    const updated = [...slides];
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;

    // Swap elements
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;

    handleSaveSlidesBackend(updated);
  };

  // --- GENERAL INFO HANDLER ---
  const handleSaveInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/header-config", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ headerConfig })
      });
      if (!res.ok) {
        if (res.status === 401) {
          handleLogout();
          throw new Error("Session expired. Please log in again.");
        }
        throw new Error("Failed to save header configuration");
      }
      const data = await res.json();
      setHeaderConfig(data.headerConfig);
      triggerStatus("success", "General school contacts and details updated successfully!");
      refreshSecurityLogs();
    } catch (err: any) {
      triggerStatus("error", err.message || "Failed to update configuration.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- GALLERY CRUD HANDLERS ---
  const handleSaveGalleryBackend = async (updatedGallery: GalleryItem[]) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ gallery: updatedGallery })
      });
      if (!res.ok) {
        if (res.status === 401) {
          handleLogout();
          throw new Error("Session expired. Please log in again.");
        }
        throw new Error("Failed to save gallery to database file");
      }
      const data = await res.json();
      setGallery(data.gallery);
      triggerStatus("success", "Campus gallery photo album updated and saved successfully!");
      refreshSecurityLogs();
    } catch (err: any) {
      triggerStatus("error", err.message || "Failed to sync gallery.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGalleryFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.title || !galleryForm.imageUrl || !galleryForm.description) {
      triggerStatus("error", "Please provide a Photo Title, Description and direct Image URL.");
      return;
    }

    let updatedList = [...gallery];
    if (editingGalleryId) {
      updatedList = updatedList.map((item) =>
        item.id === editingGalleryId
          ? { ...item, ...galleryForm, id: editingGalleryId } as GalleryItem
          : item
      );
      setEditingGalleryId(null);
    } else {
      const newItem: GalleryItem = {
        id: `g-${Date.now()}`,
        title: galleryForm.title,
        category: (galleryForm.category || "it") as any,
        description: galleryForm.description,
        imageUrl: galleryForm.imageUrl
      };
      updatedList.unshift(newItem); // Put newer photos first
    }

    setGalleryForm({ title: "", category: "it", description: "", imageUrl: "" });
    handleSaveGalleryBackend(updatedList);
  };

  const handleEditGalleryInit = (item: GalleryItem) => {
    setEditingGalleryId(item.id);
    setGalleryForm(item);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleDeleteGalleryItem = (id: string) => {
    if (!window.confirm("Delete this photo from the campus gallery?")) return;
    const filtered = gallery.filter((item) => item.id !== id);
    handleSaveGalleryBackend(filtered);
  };

  // --- NEWS CRUD HANDLERS ---
  const handleSaveNewsBackend = async (updatedNews: NewsPost[]) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ news: updatedNews })
      });
      if (!res.ok) {
        if (res.status === 401) {
          handleLogout();
          throw new Error("Session expired. Please log in again.");
        }
        throw new Error("Failed to save news to server storage file");
      }
      const data = await res.json();
      setNews(data.news);
      triggerStatus("success", "News & Announcements database synchronized successfully.");
      refreshSecurityLogs();
    } catch (err: any) {
      triggerStatus("error", err.message || "Failed to update news posts.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleNewsFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.title || !newsForm.summary || !newsForm.content || !newsForm.imageUrl) {
      triggerStatus("error", "Please fill in the News Title, Cover Image, Summary and Full Article Content.");
      return;
    }

    const tagsArray = newsTagsString
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    let updatedList = [...news];
    if (editingNewsId) {
      updatedList = updatedList.map((post) =>
        post.id === editingNewsId
          ? { 
              ...post, 
              ...newsForm, 
              tags: tagsArray, 
              id: editingNewsId, 
              date: newsForm.date || post.date 
            } as NewsPost
          : post
      );
      setEditingNewsId(null);
    } else {
      // Create readable current date
      const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      const todayString = new Date().toLocaleDateString("en-US", dateOptions);

      const newPost: NewsPost = {
        id: `news-${Date.now()}`,
        title: newsForm.title,
        date: todayString,
        category: (newsForm.category || "News") as any,
        summary: newsForm.summary,
        content: newsForm.content,
        imageUrl: newsForm.imageUrl,
        tags: tagsArray
      };
      updatedList.unshift(newPost); // Put newer posts first
    }

    setNewsForm({ title: "", category: "News", summary: "", content: "", imageUrl: "", tags: [] });
    setNewsTagsString("");
    handleSaveNewsBackend(updatedList);
  };

  const handleEditNewsInit = (post: NewsPost) => {
    setEditingNewsId(post.id);
    setNewsForm(post);
    setNewsTagsString(post.tags ? post.tags.join(", ") : "");
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleDeleteNewsPost = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this news post?")) return;
    const filtered = news.filter((post) => post.id !== id);
    handleSaveNewsBackend(filtered);
  };

  // Render Login Panel
  if (!isAuthenticated) {
    return (
      <div className="w-full page-enter py-20 bg-brand-navy flex items-center justify-center min-h-[75vh] px-4">
        <div className="max-w-md w-full bg-[#0c163b] border border-brand-gold/30 rounded-xl p-8 shadow-2xl text-left relative overflow-hidden">
          {cooldownTime > 0 && (
            <div className="absolute inset-0 bg-[#090e24]/95 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-50 animate-fade-in">
              <ShieldAlert size={48} className="text-red-500 animate-bounce mb-4" />
              <h3 className="font-sans font-bold text-lg text-white uppercase tracking-wider mb-2">Security Lockout Active</h3>
              <p className="text-xs text-white/70 max-w-xs leading-relaxed mb-6">
                Too many consecutive failed administrative authentication attempts have triggered an automated security block.
              </p>
              <div className="bg-[#0c163b] border border-red-500/30 px-6 py-3 rounded-lg font-mono text-brand-gold font-bold">
                Retry available in: <span className="text-white text-lg">{cooldownTime}s</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
            <div className="p-3 bg-brand-gold/10 text-brand-gold rounded-lg">
              <Lock size={24} />
            </div>
            <div>
              <h1 className="font-sans font-bold text-lg text-white uppercase tracking-wider flex items-center gap-2">
                <span>SECURE CMS ACCESS</span>
                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded tracking-widest uppercase">SSL</span>
              </h1>
              <p className="text-[11px] text-white/50 uppercase tracking-widest font-semibold mt-0.5">ADIA Empowerment Centre</p>
            </div>
          </div>

          <p className="text-xs text-white/70 leading-relaxed mb-6 font-light">
            Access to this portal requires validated administrator credentials. All session activity is recorded inside the security logs.
          </p>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-1.5">
                Staff Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                className="w-full bg-brand-navy border border-[#1e2f75] focus:border-brand-gold text-white text-xs px-4 py-3 rounded-lg focus:outline-none placeholder-white/35 font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-1.5">
                Administrative Security Passcode
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter secure passcode..."
                  className="w-full bg-brand-navy border border-[#1e2f75] focus:border-brand-gold text-white text-xs px-4 py-3 rounded-lg focus:outline-none pr-10 placeholder-white/35 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="flex items-start gap-2 text-[11px] text-red-400 bg-red-950/20 border border-red-900/35 p-3 rounded">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5 animate-pulse" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-brand-gold hover:bg-white text-brand-navy font-bold text-xs uppercase tracking-widest py-3.5 transition-all duration-300 shadow-lg cursor-pointer flex items-center justify-center gap-2 border border-brand-gold hover:border-white"
            >
              <ShieldCheck size={14} />
              <span>Authenticate Session</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full page-enter">
      {/* Admin Header */}
      <section className="bg-[#091232] border-b border-[#1A2E6E] py-10 px-4 md:px-8 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-10 relative">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-brand-gold font-bold uppercase tracking-widest text-[10px] bg-brand-gold/10 px-2.5 py-0.5 border border-brand-gold/20">
                Authorized Mode
              </span>
              <span className="text-emerald-400 font-bold uppercase tracking-widest text-[10px] bg-emerald-500/10 px-2.5 py-0.5 border border-emerald-500/25">
                ● Connected to server disk
              </span>
            </div>
            <h1 className="font-sans font-bold text-2xl sm:text-3xl text-white tracking-tight leading-none uppercase">
              WEBSITE CONTENT MANAGER (CMS)
            </h1>
            <p className="text-xs text-white/60 font-light mt-1 max-w-2xl">
              Add, remove, and update page elements directly. Changes are stored inside the backend container database and reflect on the live user interface instantly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {secondsRemaining !== null && (
              <div className="flex items-center gap-2 bg-[#0c163b] border border-[#1e2f75] px-3.5 py-2 rounded text-[11px] text-white/80 font-mono">
                <Clock size={12} className="text-brand-gold animate-pulse" />
                <span>Session Expiry: {Math.floor(secondsRemaining / 60)}:{(secondsRemaining % 60).toString().padStart(2, "0")}</span>
              </div>
            )}
            <button
              onClick={() => {
                setCurrentPage("home");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-4 py-2.5 bg-white/5 border border-white/10 hover:border-brand-gold hover:text-brand-gold text-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
            >
              Back to Live Site
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 bg-red-950/40 border border-red-900/30 hover:bg-red-900/30 text-red-200 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogOut size={12} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main CMS Layout */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        {/* Status Messages */}
        {statusMessage && (
          <div className={`mb-8 p-4 rounded-lg flex items-start gap-3 border ${
            statusMessage.type === "success" 
              ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
              : "bg-red-950/20 border-red-500/30 text-red-200"
          }`}>
            <CheckCircle className="flex-shrink-0 mt-0.5 text-brand-gold" size={16} />
            <p className="text-xs leading-relaxed font-semibold">{statusMessage.text}</p>
          </div>
        )}

        {forcePasswordChange ? (
          <div className="max-w-md mx-auto bg-[#0c163b] border border-brand-gold p-8 rounded-xl space-y-6 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center">
                <ShieldAlert size={24} />
              </div>
              <h2 className="text-brand-gold font-extrabold text-lg uppercase tracking-wider">
                First-time Login Security Requirement
              </h2>
              <p className="text-xs text-white/70 leading-relaxed font-light">
                For administrative safety, you must change your default administrative security passcode (<code className="bg-black/40 px-1 py-0.5 rounded text-brand-gold">adia2026</code>) to a custom secret passcode before accessing the CMS portal.
              </p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (passwordForm.newPasscode !== passwordForm.confirmNewPasscode) {
                  triggerStatus("error", "New passcode and confirmation do not match.");
                  return;
                }
                if (passwordForm.newPasscode.length < 4) {
                  triggerStatus("error", "New passcode must be at least 4 characters long.");
                  return;
                }
                if (passwordForm.newPasscode === "adia2026") {
                  triggerStatus("error", "You cannot reuse the default passcode. Please specify a new secure one.");
                  return;
                }
                setIsSaving(true);
                try {
                  const res = await fetch("/api/admin/change-passcode", {
                    method: "POST",
                    headers: getAuthHeaders(),
                    body: JSON.stringify({
                      currentPasscode: passwordForm.currentPasscode,
                      newPasscode: passwordForm.newPasscode
                    })
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.error || "Failed to update passcode");
                  
                  triggerStatus("success", "Passcode updated successfully! You can now access the CMS portal.");
                  setPasswordForm({ currentPasscode: "", newPasscode: "", confirmNewPasscode: "" });
                  sessionStorage.removeItem("adia_admin_is_default");
                  setForcePasswordChange(false);
                  refreshSecurityLogs();
                } catch (err: any) {
                  triggerStatus("error", err.message || "Failed to change passcode.");
                } finally {
                  setIsSaving(false);
                }
              }}
              className="space-y-4 text-left"
            >
              <div>
                <label className="block text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">
                  Current Default Passcode
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.currentPasscode}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPasscode: e.target.value })}
                  placeholder="e.g. adia2026"
                  className="w-full bg-[#0c163b] border border-[#1e2f75] text-xs px-3 py-3 rounded-lg focus:border-brand-gold focus:outline-none text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">
                  New Custom Passcode
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.newPasscode}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPasscode: e.target.value })}
                  placeholder="Choose at least 4 characters..."
                  className="w-full bg-[#0c163b] border border-[#1e2f75] text-xs px-3 py-3 rounded-lg focus:border-brand-gold focus:outline-none text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">
                  Confirm New Passcode
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirmNewPasscode}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPasscode: e.target.value })}
                  placeholder="Verify new passcode..."
                  className="w-full bg-[#0c163b] border border-[#1e2f75] text-xs px-3 py-3 rounded-lg focus:border-brand-gold focus:outline-none text-white font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3 bg-brand-gold hover:bg-white text-brand-navy font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-6"
              >
                <Save size={14} />
                <span>{isSaving ? "SAVING NEW PASSCODE..." : "UPDATE & ACTIVATE CMS"}</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
          {/* Side Menu Tab Controls */}
          <div className="w-full lg:w-64 flex-shrink-0 flex flex-row lg:flex-col gap-1 overflow-x-auto bg-[#0c163b] border border-[#1e2f75] p-2 rounded-xl lg:overflow-x-visible">
            {[
              { id: "slides", label: "Hero Carousel Slides", icon: Layout },
              { id: "info", label: "Contact & Header Info", icon: Phone },
              { id: "gallery", label: "Campus Gallery Album", icon: ImageIcon },
              { id: "news", label: "News & Announcements", icon: FileText },
              { id: "security", label: "Security & Portal Logs", icon: ShieldAlert }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-left transition-all rounded-lg cursor-pointer flex-shrink-0 lg:flex-shrink-1 ${
                    activeTab === tab.id
                      ? "bg-brand-gold text-brand-navy shadow-md"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={14} className="flex-shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* CMS Workspace Panel */}
          <div className="flex-grow bg-[#0c163b] border border-[#1e2f75] p-6 sm:p-8 rounded-xl text-left relative min-h-[500px]">
            {isSaving && (
              <div className="absolute inset-0 bg-brand-navy/60 backdrop-blur-xs flex items-center justify-center z-40 rounded-xl">
                <div className="flex flex-col items-center gap-3 text-[#C9A84C]">
                  <RefreshCw className="animate-spin" size={32} />
                  <p className="text-xs uppercase tracking-widest font-bold">Synchronizing disk storage...</p>
                </div>
              </div>
            )}

            {/* TAB 1: HERO CAROUSEL SLIDES */}
            {activeTab === "slides" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-brand-gold font-bold text-lg uppercase tracking-wide flex items-center gap-2">
                    <span>Hero Slides Manager</span>
                    <span className="text-[10px] text-white/40 normal-case font-light">({slides.length} slides loaded)</span>
                  </h2>
                  <p className="text-[11px] text-white/50 font-light mt-1">
                    Slides rotate on the home page hero carousel. Each slide contains a background photo, title, subtitle, and an action button link.
                  </p>
                </div>

                {/* Form to Create/Edit */}
                <form onSubmit={handleSlideFormSubmit} className="bg-brand-navy border border-white/10 p-6 rounded-lg space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white border-b border-white/5 pb-2">
                    {editingSlideId ? "✏️ Edit Existing Slide Specs" : "➕ Append A New Hero Slide"}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-1">
                        Slide Heading/Title (All Caps)
                      </label>
                      <input
                        type="text"
                        value={slideForm.title || ""}
                        onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                        placeholder="e.g. SHAPING NAIROBI'S COMPUTER SPECIALISTS"
                        className="w-full bg-[#0c163b] border border-[#1e2f75] text-xs px-3 py-2 rounded focus:border-brand-gold focus:outline-none text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-1">
                        CTA Button Link Label
                      </label>
                      <input
                        type="text"
                        value={slideForm.ctaText || ""}
                        onChange={(e) => setSlideForm({ ...slideForm, ctaText: e.target.value })}
                        placeholder="e.g. EXPLORE IT COURSES"
                        className="w-full bg-[#0c163b] border border-[#1e2f75] text-xs px-3 py-2 rounded focus:border-brand-gold focus:outline-none text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-1">
                      Brief Subtitle/Narrative (Elegant Description)
                    </label>
                    <textarea
                      value={slideForm.subtitle || ""}
                      onChange={(e) => setSlideForm({ ...slideForm, subtitle: e.target.value })}
                      placeholder="e.g. Acquire industry-certified skills and launch your own entrepreneurial digital brand with help from mentors."
                      rows={2}
                      className="w-full bg-[#0c163b] border border-[#1e2f75] text-xs px-3 py-2 rounded focus:border-brand-gold focus:outline-none text-white font-light"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-1">
                        Slide Image Address URL
                      </label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={slideForm.imageUrl || ""}
                          onChange={(e) => setSlideForm({ ...slideForm, imageUrl: e.target.value })}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="w-full bg-[#0c163b] border border-[#1e2f75] text-xs px-3 py-2 rounded focus:border-brand-gold focus:outline-none text-white font-mono"
                        />
                        <div className="relative border border-dashed border-[#1e2f75] hover:border-brand-gold rounded p-2 text-center transition-colors cursor-pointer flex items-center justify-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageLocalUpload(e, "slide")}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <span className="text-[10px] text-white/70">
                            {isUploadingImage === "slide" ? "⏳ Uploading..." : "📁 Choose Local File to Upload"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-1">
                        Button Action Page
                      </label>
                      <select
                        value={slideForm.ctaPage || "courses"}
                        onChange={(e) => setSlideForm({ ...slideForm, ctaPage: e.target.value as any })}
                        className="w-full bg-[#0c163b] border border-[#1e2f75] text-xs px-3 py-2 rounded focus:border-brand-gold focus:outline-none text-white font-semibold"
                      >
                        <option value="courses">Programs & Courses page</option>
                        <option value="admissions">Admissions Portal</option>
                        <option value="about">About Us page</option>
                        <option value="news">News & Events feed</option>
                        <option value="contact">Contact page</option>
                      </select>
                    </div>
                  </div>

                  {/* IMAGE HELPER DROPDOWN */}
                  <div className="border border-white/5 rounded p-3 bg-black/10">
                    <span className="block text-[9px] font-bold text-[#C9A84C] uppercase tracking-widest mb-2 flex items-center gap-1">
                      <HelpCircle size={10} />
                      <span>Quick Image Helper: Select a high-res photo suggestion from our vocational collection:</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {POPULAR_UNSPLASH_SUGGESTIONS.map((img, i) => (
                        <button
                          type="button"
                          key={i}
                          onClick={() => setSlideForm({ ...slideForm, imageUrl: img.url })}
                          className="bg-[#0c163b] hover:bg-white hover:text-[#0D1B4B] text-[9px] text-white border border-[#1e2f75] px-2 py-1 select-none font-semibold transition-colors"
                        >
                          {img.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-white/5 justify-end">
                    {editingSlideId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSlideId(null);
                          setSlideForm({ title: "", subtitle: "", imageUrl: "", ctaText: "", ctaPage: "courses" });
                        }}
                        className="px-4 py-2 bg-transparent text-white hover:bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-wider cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-6 py-2 bg-brand-gold hover:bg-white text-brand-navy hover:text-brand-navy font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save size={12} />
                      <span>{editingSlideId ? "Update Slide Specs" : "Add Slide To Slider"}</span>
                    </button>
                  </div>
                </form>

                {/* Slides List Grid */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">Active Slide Lineup</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {slides.map((slide, index) => (
                      <div key={slide.id} className="bg-brand-navy border border-white/10 rounded overflow-hidden flex flex-col justify-between">
                        <div className="relative h-28 bg-black/30 overflow-hidden">
                          <img
                            src={slide.imageUrl}
                            alt={slide.title}
                            className="w-full h-full object-cover filter brightness-[0.75] select-none pointer-events-none"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-2 left-2 bg-[#0D1B4B]/95 border border-[#C9A84C]/35 text-[#C9A84C] font-mono text-[9px] px-2 py-0.5 rounded">
                            Pos: {index + 1}
                          </div>
                          <div className="absolute bottom-2 left-3 right-3 text-left">
                            <span className="text-brand-gold text-[8px] uppercase tracking-wider block font-semibold">CTA: {slide.ctaPage}</span>
                            <h4 className="font-sans font-bold text-xs text-white uppercase line-clamp-1 leading-tight">{slide.title}</h4>
                          </div>
                        </div>

                        <div className="p-3 flex items-center justify-between gap-1 border-t border-white/5 bg-[#0a1130]">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveSlide(index, "up")}
                              disabled={index === 0}
                              className="p-1.5 border border-white/10 text-white/55 hover:text-brand-gold hover:border-brand-gold rounded disabled:opacity-20 cursor-pointer"
                              title="Move Up"
                            >
                              <ArrowUp size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveSlide(index, "down")}
                              disabled={index === slides.length - 1}
                              className="p-1.5 border border-white/10 text-white/55 hover:text-brand-gold hover:border-brand-gold rounded disabled:opacity-20 cursor-pointer"
                              title="Move Down"
                            >
                              <ArrowDown size={12} />
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleEditSlideInit(slide)}
                              className="p-1.5 border border-white/10 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500 rounded flex items-center gap-1 text-[10px] uppercase font-bold cursor-pointer"
                            >
                              <Edit3 size={12} />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSlide(slide.id)}
                              className="p-1.5 border border-white/10 text-red-400 hover:bg-red-500/10 hover:border-red-500 rounded flex items-center gap-1 text-[10px] uppercase font-bold cursor-pointer"
                            >
                              <Trash2 size={12} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: GENERAL CONTACT & HEADER INFO */}
            {activeTab === "info" && (
              <form onSubmit={handleSaveInfoSubmit} className="space-y-8">
                <div>
                  <h2 className="text-brand-gold font-bold text-lg uppercase tracking-wide flex items-center gap-2">
                    <span>Contact & Website Core Settings</span>
                  </h2>
                  <p className="text-[11px] text-white/50 font-light mt-1">
                    Edit vital details that are placed globally in the top bar, footer, and navigation. 
                  </p>
                </div>

                <div className="bg-brand-navy border border-white/10 p-6 rounded-lg space-y-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white border-b border-white/5 pb-2">
                    📞 Contact Details & Intakes
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-1">
                        Active Admissions Ribbon Banner text
                      </label>
                      <input
                        type="text"
                        value={headerConfig.admissionsOpen || ""}
                        onChange={(e) => setHeaderConfig({ ...headerConfig, admissionsOpen: e.target.value })}
                        placeholder="e.g. ADMISSIONS OPEN: SEPT 2026 INTAKE"
                        className="w-full bg-[#0c163b] border border-[#1e2f75] text-xs px-3 py-2 rounded focus:border-brand-gold focus:outline-none text-white font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-1">
                        Contact Telephone Phone Number
                      </label>
                      <input
                        type="text"
                        value={headerConfig.tel || ""}
                        onChange={(e) => setHeaderConfig({ ...headerConfig, tel: e.target.value })}
                        placeholder="e.g. 0105086218"
                        className="w-full bg-[#0c163b] border border-[#1e2f75] text-xs px-3 py-2 rounded focus:border-brand-gold focus:outline-none text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-1">
                        Official Inquiry Email Address
                      </label>
                      <input
                        type="email"
                        value={headerConfig.email || ""}
                        onChange={(e) => setHeaderConfig({ ...headerConfig, email: e.target.value })}
                        placeholder="e.g. info@adiaempowerment.ac.ke"
                        className="w-full bg-[#0c163b] border border-[#1e2f75] text-xs px-3 py-2 rounded focus:border-brand-gold focus:outline-none text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-1">
                        WhatsApp API Direct Link
                      </label>
                      <input
                        type="text"
                        value={headerConfig.whatsapp || ""}
                        onChange={(e) => setHeaderConfig({ ...headerConfig, whatsapp: e.target.value })}
                        placeholder="https://wa.me/..."
                        className="w-full bg-[#0c163b] border border-[#1e2f75] text-xs px-3 py-2 rounded focus:border-brand-gold focus:outline-none text-white font-mono"
                      />
                    </div>
                  </div>

                  <h3 className="text-xs font-bold uppercase tracking-widest text-white border-b border-white/5 pt-4 pb-2">
                    🌐 Social Media Addresses
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-1">
                        Facebook Page URL
                      </label>
                      <input
                        type="text"
                        value={headerConfig.facebook || ""}
                        onChange={(e) => setHeaderConfig({ ...headerConfig, facebook: e.target.value })}
                        placeholder="https://facebook.com/..."
                        className="w-full bg-[#0c163b] border border-[#1e2f75] text-xs px-3 py-2 rounded focus:border-brand-gold focus:outline-none text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-1">
                        Instagram Account URL
                      </label>
                      <input
                        type="text"
                        value={headerConfig.instagram || ""}
                        onChange={(e) => setHeaderConfig({ ...headerConfig, instagram: e.target.value })}
                        placeholder="https://instagram.com/..."
                        className="w-full bg-[#0c163b] border border-[#1e2f75] text-xs px-3 py-2 rounded focus:border-brand-gold focus:outline-none text-white font-mono"
                      />
                    </div>
                  </div>

                  <h3 className="text-xs font-bold uppercase tracking-widest text-white border-b border-white/5 pt-4 pb-2">
                    ✍️ Brand Identity & Logo Wording
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-1">
                        Primary Logo text
                      </label>
                      <input
                        type="text"
                        value={headerConfig.logoText || ""}
                        onChange={(e) => setHeaderConfig({ ...headerConfig, logoText: e.target.value })}
                        placeholder="e.g. ADIA EMPOWERMENT"
                        className="w-full bg-[#0c163b] border border-[#1e2f75] text-xs px-3 py-2 rounded focus:border-brand-gold focus:outline-none text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-1">
                        Logo Subtitle text
                      </label>
                      <input
                        type="text"
                        value={headerConfig.logoSubtitle || ""}
                        onChange={(e) => setHeaderConfig({ ...headerConfig, logoSubtitle: e.target.value })}
                        placeholder="e.g. CENTRE • NAIROBI, KENYA"
                        className="w-full bg-[#0c163b] border border-[#1e2f75] text-xs px-3 py-2 rounded focus:border-brand-gold focus:outline-none text-white font-semibold"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-brand-gold hover:bg-white text-brand-navy font-bold text-xs tracking-widest uppercase transition-colors duration-300 shadow-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save size={14} />
                    <span>Synchronize Contacts Configuration</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: CAMPUS GALLERY ALBUM */}
            {activeTab === "gallery" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-brand-gold font-bold text-lg uppercase tracking-wide flex items-center gap-2">
                    <span>Campus Gallery Photo Archivist</span>
                    <span className="text-[10px] text-white/40 normal-case font-light">({gallery.length} images saved)</span>
                  </h2>
                  <p className="text-[11px] text-white/50 font-light mt-1">
                    Add photos of actual culinary baking, hair styling, IT lab classes, or graduations. Ensure Unsplash links are secure (start with https://).
                  </p>
                </div>

                {/* Form to Create/Edit */}
                <form onSubmit={handleGalleryFormSubmit} className="bg-brand-navy border border-white/10 p-6 rounded-lg space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white border-b border-white/5 pb-2">
                    {editingGalleryId ? "✏️ Edit Existing Photo Meta" : "➕ Upload/Catalogue A New Photo"}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-1">
                        Photo Subject/Caption Title
                      </label>
                      <input
                        type="text"
                        value={galleryForm.title || ""}
                        onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                        placeholder="e.g. IT Lab Interactive Class"
                        className="w-full bg-[#0c163b] border border-[#1e2f75] text-xs px-3 py-2 rounded focus:border-brand-gold focus:outline-none text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-1">
                        Category Classification
                      </label>
                      <select
                        value={galleryForm.category || "it"}
                        onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value as any })}
                        className="w-full bg-[#0c163b] border border-[#1e2f75] text-xs px-3 py-2 rounded focus:border-brand-gold focus:outline-none text-white font-semibold"
                      >
                        <option value="it">Information Technology (IT)</option>
                        <option value="hospitality">Hospitality & Catering</option>
                        <option value="fashion">Fashion & Design</option>
                        <option value="beauty">Beauty & Cosmetology</option>
                        <option value="campus">Campus & Graduation Life</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-1">
                      Short Narrative (Tells visitors what's happening)
                    </label>
                    <input
                      type="text"
                      value={galleryForm.description || ""}
                      onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                      placeholder="e.g. Students learning computer architecture and troubleshooting during our Saturday extra session."
                      className="w-full bg-[#0c163b] border border-[#1e2f75] text-xs px-3 py-2 rounded focus:border-brand-gold focus:outline-none text-white font-light"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-1">
                      Direct Secure Image Address Link (https://)
                    </label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={galleryForm.imageUrl || ""}
                        onChange={(e) => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full bg-[#0c163b] border border-[#1e2f75] text-xs px-3 py-2 rounded focus:border-brand-gold focus:outline-none text-white font-mono"
                      />
                      <div className="relative border border-dashed border-[#1e2f75] hover:border-brand-gold rounded p-2 text-center transition-colors cursor-pointer flex items-center justify-center gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageLocalUpload(e, "gallery")}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <span className="text-[10px] text-white/70">
                          {isUploadingImage === "gallery" ? "⏳ Uploading..." : "📁 Choose Local File to Upload"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* IMAGE DROPDOWN HELPER */}
                  <div className="border border-white/5 rounded p-3 bg-black/10">
                    <span className="block text-[9px] font-bold text-[#C9A84C] uppercase tracking-widest mb-2 flex items-center gap-1">
                      <HelpCircle size={10} />
                      <span>Quick Image Helper: Select a high-res photo suggestion from our vocational collection:</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {POPULAR_UNSPLASH_SUGGESTIONS.map((img, i) => (
                        <button
                          type="button"
                          key={i}
                          onClick={() => setGalleryForm({ ...galleryForm, imageUrl: img.url })}
                          className="bg-[#0c163b] hover:bg-white hover:text-[#0D1B4B] text-[9px] text-white border border-[#1e2f75] px-2 py-1 select-none font-semibold transition-colors"
                        >
                          {img.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-white/5 justify-end">
                    {editingGalleryId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingGalleryId(null);
                          setGalleryForm({ title: "", category: "it", description: "", imageUrl: "" });
                        }}
                        className="px-4 py-2 bg-transparent text-white hover:bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-wider cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-6 py-2 bg-brand-gold hover:bg-white text-brand-navy hover:text-brand-navy font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save size={12} />
                      <span>{editingGalleryId ? "Update Photo Specs" : "Insert Photo to Album"}</span>
                    </button>
                  </div>
                </form>

                {/* Gallery lineup list */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">Live Catalogued Photos</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {gallery.map((item) => (
                      <div key={item.id} className="bg-brand-navy border border-white/10 rounded overflow-hidden flex flex-col justify-between group">
                        <div className="relative aspect-square bg-black/20 overflow-hidden">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover filter brightness-90"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-2 left-2 bg-[#0D1B4B]/90 text-brand-gold text-[8px] font-semibold uppercase px-2 py-0.5 rounded border border-brand-gold/10">
                            {item.category}
                          </div>
                        </div>
                        <div className="p-2 bg-[#0a1130] flex flex-col gap-2">
                          <p className="text-[10px] text-white font-semibold truncate leading-tight">{item.title}</p>
                          <div className="flex items-center gap-1 mt-1 justify-end border-t border-white/5 pt-2">
                            <button
                              type="button"
                              onClick={() => handleEditGalleryInit(item)}
                              className="p-1 border border-white/5 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500 rounded text-[9px] uppercase font-bold cursor-pointer flex-1 py-1"
                              title="Edit Details"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteGalleryItem(item.id)}
                              className="p-1 border border-[#ff0000]/10 text-red-400 hover:bg-red-500/10 hover:border-red-500 rounded text-[9px] uppercase font-bold cursor-pointer flex-1 py-1"
                              title="Delete Photo"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: NEWS & ANNOUNCEMENTS */}
            {activeTab === "news" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-brand-gold font-bold text-lg uppercase tracking-wide flex items-center gap-2">
                    <span>News & Event Publisher</span>
                    <span className="text-[10px] text-white/40 normal-case font-light">({news.length} posts published)</span>
                  </h2>
                  <p className="text-[11px] text-white/50 font-light mt-1">
                    Publish student achievements, upcoming semester intakes, vocational exhibitions, or important calendar announcements.
                  </p>
                </div>

                {/* Form to Create/Edit */}
                <form onSubmit={handleNewsFormSubmit} className="bg-brand-navy border border-white/10 p-6 rounded-lg space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white border-b border-white/5 pb-2">
                    {editingNewsId ? "✏️ Edit Existing Article" : "➕ Draft and Publish A New Article"}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-1">
                        Article Headline/Title
                      </label>
                      <input
                        type="text"
                        value={newsForm.title || ""}
                        onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                        placeholder="e.g. September 2026 Scholarships Now Open"
                        className="w-full bg-[#0c163b] border border-[#1e2f75] text-xs px-3 py-2 rounded focus:border-brand-gold focus:outline-none text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-1">
                        Classification Category
                      </label>
                      <select
                        value={newsForm.category || "News"}
                        onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value as any })}
                        className="w-full bg-[#0c163b] border border-[#1e2f75] text-xs px-3 py-2 rounded focus:border-brand-gold focus:outline-none text-white font-semibold"
                      >
                        <option value="News">School News</option>
                        <option value="Event">Institutional Event</option>
                        <option value="Announcement">Official Announcement</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-1">
                      Brief Summary / Sub-headline (Shown on cards list)
                    </label>
                    <input
                      type="text"
                      value={newsForm.summary || ""}
                      onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })}
                      placeholder="e.g. ADIA Empowerment Centre is offering partial sponsorships for our Sept 2026 beauty and computing modules."
                      className="w-full bg-[#0c163b] border border-[#1e2f75] text-xs px-3 py-2 rounded focus:border-brand-gold focus:outline-none text-white font-light"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-1">
                        Direct Cover Image URL Address
                      </label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={newsForm.imageUrl || ""}
                          onChange={(e) => setNewsForm({ ...newsForm, imageUrl: e.target.value })}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="w-full bg-[#0c163b] border border-[#1e2f75] text-xs px-3 py-2 rounded focus:border-brand-gold focus:outline-none text-white font-mono"
                        />
                        <div className="relative border border-dashed border-[#1e2f75] hover:border-brand-gold rounded p-2 text-center transition-colors cursor-pointer flex items-center justify-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageLocalUpload(e, "news")}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <span className="text-[10px] text-white/70">
                            {isUploadingImage === "news" ? "⏳ Uploading..." : "📁 Choose Local File to Upload"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-1">
                        Search Metadata tags (Comma-separated)
                      </label>
                      <input
                        type="text"
                        value={newsTagsString}
                        onChange={(e) => setNewsTagsString(e.target.value)}
                        placeholder="e.g. Intake, Scholarship, IT"
                        className="w-full bg-[#0c163b] border border-[#1e2f75] text-xs px-3 py-2 rounded focus:border-brand-gold focus:outline-none text-white"
                      />
                    </div>
                  </div>

                  {/* IMAGE HELPER DROPDOWN */}
                  <div className="border border-white/5 rounded p-3 bg-black/10">
                    <span className="block text-[9px] font-bold text-[#C9A84C] uppercase tracking-widest mb-2 flex items-center gap-1">
                      <HelpCircle size={10} />
                      <span>Quick Image Helper: Select a cover photo suggestion from our collection:</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {POPULAR_UNSPLASH_SUGGESTIONS.map((img, i) => (
                        <button
                          type="button"
                          key={i}
                          onClick={() => setNewsForm({ ...newsForm, imageUrl: img.url })}
                          className="bg-[#0c163b] hover:bg-white hover:text-[#0D1B4B] text-[9px] text-white border border-[#1e2f75] px-2 py-1 select-none font-semibold transition-colors"
                        >
                          {img.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-1">
                      Full Article Content Body (Split paragraphs with blank double-lines)
                    </label>
                    <textarea
                      value={newsForm.content || ""}
                      onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                      placeholder="Enter the full text of the article here. Add details about dates, venues, intakes, contact forms, or modules."
                      rows={6}
                      className="w-full bg-[#0c163b] border border-[#1e2f75] text-xs px-3 py-2 rounded focus:border-brand-gold focus:outline-none text-white font-light font-mono leading-relaxed"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-white/5 justify-end">
                    {editingNewsId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingNewsId(null);
                          setNewsForm({ title: "", category: "News", summary: "", content: "", imageUrl: "", tags: [] });
                          setNewsTagsString("");
                        }}
                        className="px-4 py-2 bg-transparent text-white hover:bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-wider cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-6 py-2 bg-brand-gold hover:bg-white text-brand-navy hover:text-brand-navy font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save size={12} />
                      <span>{editingNewsId ? "Update News Post" : "Publish Article"}</span>
                    </button>
                  </div>
                </form>

                {/* News articles lineup */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">Published Articles Feed</h3>
                  <div className="space-y-3">
                    {news.map((post) => (
                      <div key={post.id} className="bg-brand-navy border border-white/10 rounded p-4 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                        <div className="flex items-center gap-4 text-left">
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-16 h-16 object-cover rounded border border-white/10 flex-shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="text-[8px] bg-brand-gold/15 text-brand-gold font-bold px-2 py-0.5 rounded border border-brand-gold/20 uppercase tracking-wider">
                              {post.category}
                            </span>
                            <h4 className="font-sans font-bold text-xs text-white uppercase mt-1 leading-tight">{post.title}</h4>
                            <p className="text-[10px] text-white/50 mt-0.5">Published on: {post.date}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 w-full md:w-auto justify-end border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                          <button
                            type="button"
                            onClick={() => handleEditNewsInit(post)}
                            className="p-2 px-3 border border-white/10 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500 rounded text-[10px] uppercase font-bold cursor-pointer flex items-center gap-1"
                          >
                            <Edit3 size={11} />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteNewsPost(post.id)}
                            className="p-2 px-3 border border-white/10 text-red-400 hover:bg-red-500/10 hover:border-red-500 rounded text-[10px] uppercase font-bold cursor-pointer flex items-center gap-1"
                          >
                            <Trash2 size={11} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: SECURITY & PORTAL LOGS */}
            {activeTab === "security" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-brand-gold font-bold text-lg uppercase tracking-wide flex items-center gap-2">
                    <ShieldCheck size={18} />
                    <span>Administrative Security Center</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20 uppercase font-bold rounded">Active Protection</span>
                  </h2>
                  <p className="text-[11px] text-white/50 font-light mt-1">
                    Manage your admin login settings, observe active sessions, and review structural security log history.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Password Modification Form */}
                  <div className="bg-brand-navy border border-white/10 p-5 rounded-lg space-y-4 lg:col-span-1">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white border-b border-white/5 pb-2 flex items-center gap-1.5">
                      <Lock size={12} className="text-brand-gold" />
                      <span>Change Passcode</span>
                    </h3>

                    <form onSubmit={handlePasscodeChangeSubmit} className="space-y-3">
                      <div>
                        <label className="block text-[9px] font-bold text-white/60 uppercase tracking-widest mb-1">
                          Current Passcode
                        </label>
                        <input
                          type="password"
                          required
                          value={passwordForm.currentPasscode}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPasscode: e.target.value })}
                          placeholder="Current..."
                          className="w-full bg-[#0c163b] border border-[#1e2f75] text-xs px-3 py-2 rounded focus:border-brand-gold focus:outline-none text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-white/60 uppercase tracking-widest mb-1">
                          New Passcode
                        </label>
                        <input
                          type="password"
                          required
                          value={passwordForm.newPasscode}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPasscode: e.target.value })}
                          placeholder="At least 4 chars..."
                          className="w-full bg-[#0c163b] border border-[#1e2f75] text-xs px-3 py-2 rounded focus:border-brand-gold focus:outline-none text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-white/60 uppercase tracking-widest mb-1">
                          Confirm New Passcode
                        </label>
                        <input
                          type="password"
                          required
                          value={passwordForm.confirmNewPasscode}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPasscode: e.target.value })}
                          placeholder="Verify..."
                          className="w-full bg-[#0c163b] border border-[#1e2f75] text-xs px-3 py-2 rounded focus:border-brand-gold focus:outline-none text-white font-mono"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 bg-brand-gold hover:bg-white text-brand-navy font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-4"
                      >
                        <Save size={12} />
                        <span>Update Passcode</span>
                      </button>
                    </form>
                  </div>

                  {/* Active Statistics Card */}
                  <div className="space-y-6 lg:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-brand-navy border border-white/10 p-4 rounded-lg flex items-center gap-4">
                        <div className="p-3 bg-brand-gold/10 text-brand-gold rounded-md">
                          <Activity size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Active Sessions</p>
                          <p className="text-xl font-bold text-white font-mono">{activeSessionsCount}</p>
                        </div>
                      </div>

                      <div className="bg-brand-navy border border-white/10 p-4 rounded-lg flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-md">
                          <ShieldCheck size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Security System</p>
                          <p className="text-xs font-bold text-emerald-400 font-mono uppercase">Validated (SSL)</p>
                        </div>
                      </div>
                    </div>

                    {/* Security Activity Logs Feed */}
                    <div className="bg-brand-navy border border-white/10 p-5 rounded-lg">
                      <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-1.5">
                          <Activity size={12} className="text-brand-gold" />
                          <span>Audit & Security Logs</span>
                        </h3>
                        <button
                          type="button"
                          onClick={refreshSecurityLogs}
                          className="text-[9px] uppercase tracking-wider text-brand-gold hover:text-white cursor-pointer font-bold flex items-center gap-1"
                        >
                          <RefreshCw size={10} className="animate-spin-slow" />
                          <span>Refresh Logs</span>
                        </button>
                      </div>

                      <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                        {securityLogs.length === 0 ? (
                          <p className="text-[10px] text-white/40 italic py-4">No audit logging events recorded yet in this container session.</p>
                        ) : (
                          securityLogs.map((log) => (
                            <div key={log.id} className="text-left bg-black/10 border border-white/5 p-2 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase ${
                                    log.status === "SUCCESS" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                    log.status === "FAILED" ? "bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse" :
                                    log.status === "PASSWORD_CHANGED" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                                    "bg-white/10 text-white/70"
                                  }`}>
                                    {log.status}
                                  </span>
                                  <span className="text-[10px] text-white font-mono">User: {log.username}</span>
                                </div>
                                <p className="text-[8px] text-white/40 font-mono">IP: {log.ip} | Agent: {log.userAgent.substring(0, 45)}...</p>
                              </div>
                              <span className="text-[9px] text-[#C9A84C] font-mono whitespace-nowrap">{log.timestamp}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        )}
      </section>
    </div>
  );
}
