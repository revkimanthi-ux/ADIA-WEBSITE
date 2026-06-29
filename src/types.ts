export type Page = 'home' | 'about' | 'courses' | 'admissions' | 'gallery' | 'news' | 'contact';

export interface HeaderConfig {
  tel: string;
  admissionsOpen: string;
  email: string;
  facebook: string;
  instagram: string;
  whatsapp: string;
  logoText: string;
  logoSubtitle: string;
}

export interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaPage: Page;
}

export interface Course {
  id: string;
  name: string;
  category: string;
  duration: string;
  intakes: string[];
  feesPerSemester: string;
  overview: string;
  modules: string[];
  prospects: string[];
  imageUrl: string;
}

export interface NewsPost {
  id: string;
  title: string;
  date: string;
  category: 'News' | 'Event' | 'Announcement';
  summary: string;
  content: string;
  imageUrl: string;
  tags?: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'it' | 'hospitality' | 'fashion' | 'beauty' | 'campus';
  imageUrl: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  course: string;
  year: string;
  comment: string;
  avatarUrl: string;
}
