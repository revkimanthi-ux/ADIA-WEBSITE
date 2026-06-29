import { useState, useEffect } from "react";
import { Page, HeaderConfig } from "./types";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import FloatingAssistant from "./components/FloatingAssistant";

// Import different sub-views
import HomeView from "./components/HomeView";
import AboutView from "./components/AboutView";
import CoursesView from "./components/CoursesView";
import AdmissionsView from "./components/AdmissionsView";
import GalleryView from "./components/GalleryView";
import NewsView from "./components/NewsView";
import ContactView from "./components/ContactView";

const DEFAULT_HEADER_CONFIG: HeaderConfig = {
  tel: "0105086218",
  admissionsOpen: "ADMISSIONS OPEN: JAN 2026",
  email: "info@adiaempowerment.ac.ke",
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  whatsapp: "https://wa.me/254105086218",
  logoText: "ADIA EMPOWERMENT",
  logoSubtitle: "CENTRE • NAIROBI, KENYA"
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("it");
  const [headerConfig, setHeaderConfig] = useState<HeaderConfig>(DEFAULT_HEADER_CONFIG);

  useEffect(() => {
    fetch("/api/header-config")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch header config");
        return res.json();
      })
      .then((data) => {
        if (data && data.tel) {
          setHeaderConfig(data);
        }
      })
      .catch((err) => console.warn("Could not load header configurations from backend, using defaults:", err));
  }, []);

  // Router dispatcher
  const renderCurrentView = () => {
    switch (currentPage) {
      case "home":
        return <HomeView setCurrentPage={setCurrentPage} setSelectedCourseId={setSelectedCourseId} />;
      case "about":
        return <AboutView setCurrentPage={setCurrentPage} />;
      case "courses":
        return (
          <CoursesView
            setCurrentPage={setCurrentPage}
            selectedCourseId={selectedCourseId}
            setSelectedCourseId={setSelectedCourseId}
          />
        );
      case "admissions":
        return <AdmissionsView setCurrentPage={setCurrentPage} />;
      case "gallery":
        return <GalleryView />;
      case "news":
        return <NewsView />;
      case "contact":
        return <ContactView />;
      default:
        return <HomeView setCurrentPage={setCurrentPage} setSelectedCourseId={setSelectedCourseId} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-navy flex flex-col justify-between font-sans selection:bg-brand-gold selection:text-brand-navy">
      {/* 1. Header Navigation System */}
      <Navigation
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        selectedCourseId={selectedCourseId}
        setSelectedCourseId={setSelectedCourseId}
        headerConfig={headerConfig}
      />

      {/* 2. Main Content Canvas */}
      <main className="flex-grow w-full relative">
        {renderCurrentView()}
      </main>

      {/* 3. Footer Section */}
      <Footer
        setCurrentPage={setCurrentPage}
        setSelectedCourseId={setSelectedCourseId}
        headerConfig={headerConfig}
      />

      {/* 4. Floating AI Chat Assistant */}
      <FloatingAssistant />
    </div>
  );
}

