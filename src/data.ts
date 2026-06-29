import { Course, NewsPost, GalleryItem, Testimonial } from "./types";

export const COURSES_DATA: Course[] = [
  {
    id: "it",
    name: "Information Technology (IT)",
    category: "School of Computing & Digital Studies",
    duration: "7 Months (Inclusive Attachment)",
    intakes: ["January to August", "April to December", "September to April"],
    feesPerSemester: "",
    overview: "In an increasingly digital world, computational literacy and technical proficiency are vital. Our Information Technology programme provides a robust foundation in key computing concepts, visual web development, digital marketing platforms, and basic hardware repair. This hands-on course is structured to make students competitive and independent in the digital workforce or ready to start an entrepreneurial tech support brand.",
    modules: [
      "Introduction to Computers & Office Applications (Word, Excel, Access)",
      "Web Design Foundations (HTML5, CSS3, JavaScript Basics)",
      "Database Management & Operations",
      "Digital Marketing & Social Media Strategy",
      "Computer Maintenance, Troubleshooting & Hardware Support",
      "Professional Ethics, Communication, and Freelance Entrepreneurship"
    ],
    prospects: [
      "Junior Web Designer",
      "IT Support Technician / Helpdesk Assistant",
      "Digital Marketing & Social Media Coordinator",
      "Administrative & Office Assistant",
      "Digital Cafe / Tech Centre Manager"
    ],
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "hospitality",
    name: "Hospitality & Catering",
    category: "School of Culinary Arts & Hospitality Management",
    duration: "7 Months (Inclusive Attachment)",
    intakes: ["January to August", "April to December", "September to April"],
    feesPerSemester: "",
    overview: "The hospitality sector is one of the fastest-growing industries in East Africa. Our Hospitality & Catering programme teaches professional kitchen safety, advanced culinary arts, pastry baking, table service rules, and customer experience etiquette. Mentored by industry chefs, students acquire robust, practical training using professional-grade kitchen facilities, ensuring readiness for top hotels, catering businesses, or luxury lodges.",
    modules: [
      "Introduction to Hospitality Industry & Professional Hygiene",
      "Culinary Arts & Food Production (Appetizers, Mains, Sides)",
      "Baking, Breadmaking & Pastry Production",
      "Food & Beverage Service Technique & Banqueting",
      "Menu Planning, Food Costing & Stock Control",
      "Kitchen Safety Management & Customer Relations"
    ],
    prospects: [
      "Commis Chef in major hotels and restaurants",
      "Professional Baker & Pastry Designer",
      "Event Catering Manager / Food Truck Owner",
      "Restaurant Captain / Front-of-House Supervisor",
      "In-house Corporate Caterer"
    ],
    imageUrl: "https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "fashion",
    name: "Fashion & Design",
    category: "School of Apparel, Fashion & Creative Arts",
    duration: "7 Months (Inclusive Attachment)",
    intakes: ["January to August", "April to December", "September to April"],
    feesPerSemester: "",
    overview: "Unleash your creativity and shape the future of apparel. Our Fashion & Design curriculum balances raw aesthetic drawing with core manual tailoring skills. Students learn precise pattern drafting, garment assembly for children and adults, custom embroidery, and the business strategies needed to establish a successful clothing line or high-end tailoring studio in Nairobi and beyond.",
    modules: [
      "Introduction to Fashion Design, Textiles & Fiber Studies",
      "Industrial & Manual Sewing Machine Operation & Safety",
      "Pattern Drafting & Garment Customization",
      "Garment Construction (Skirts, Trousers, Shirts, African Wear)",
      "Fashion Illustration & Portfolio Creation",
      "Apparel Business Planning, Marketing, and Studio Management"
    ],
    prospects: [
      "Bespoke Tailor & Dressmaker",
      "Apparel Designer & Pattern Drafter",
      "Fashion Stylist & Costume Consultant",
      "Creative Director / Clothing Line Entrepreneur",
      "Quality Controller in Garment Manufacturing"
    ],
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "beauty",
    name: "Beauty & Cosmetology",
    category: "School of Personal Care & Wellness",
    duration: "7 Months (Inclusive Attachment)",
    intakes: ["January to August", "April to December", "September to April"],
    feesPerSemester: "",
    overview: "Beauty is a vibrant, resilient, and multi-billion shilling industry. The Beauty & Cosmetology course provides deep, practical expertise in modern hair chemical styling, skincare therapy, nail extensions, massage, and bridal makeup artistry. Graduates enter the salon and wellness industry equipped with the skills to run premium salons, join wellness centers, or start successful freelance beauty operations.",
    modules: [
      "Professional Salon Ethics, Hygiene & Client consultation",
      "Hairdressing: Cuts, Chemical Styling, Braiding & Weaving",
      "Skincare, Facials & Massages",
      "Nail Technology: Manicures, Pedicures, Acrylics & Gel Art",
      "Professional Makeup Artistry (Everyday, Bridal, Media)",
      "Salon Business Management, Branding & Client Acquisition"
    ],
    prospects: [
      "Expert Hair Stylist / Master Braider",
      "Certified Skincare Consultant / Facialist",
      "Professional Nail Technician",
      "Bridal & Editorial Makeup Artist",
      "Spa Assistant / Beauty Salon Owner"
    ],
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800"
  }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: "t1",
    name: "Grace Mutuku",
    course: "Fashion & Design Graduate",
    year: "Class of 2025",
    comment: "ADIA gave me more than just technical sewing skills; they taught me how to draft professional patterns and run a real business. Today, I operate 'Mutuku Creations' in Nairobi, styling wedding parties and corporate ladies. Choosing ADIA was my life's best turning point!",
    avatarUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "t2",
    name: "Brian Otieno",
    course: "Information Technology Graduate",
    year: "Class of 2024",
    comment: "I arrived with basic phone knowledge but graduated as a confident computer support technician and web designer. The practical focus at ADIA is unmatched. I secured an internship at a tech shop in CBD within a week of graduation, and now work full-time.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "t3",
    name: "Esther Wanjiku",
    course: "Hospitality & Catering Student",
    year: "Current Student (September Intake)",
    comment: "The training kitchen is phenomenal! We learn real culinary skills under Chef David, practicing menu costing, baking, and plating. The atmosphere here is extremely supportive, and my dream of working in a five-star hotel is coming closer every single day.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
  }
];

export const GALLERY_DATA: GalleryItem[] = [
  {
    id: "g1",
    title: "IT Lab Interactive Training",
    category: "it",
    description: "Students designing local business web templates in our high-speed IT Lab.",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "g2",
    title: "Catering Baking Session",
    category: "hospitality",
    description: "Hands-on pastry baking and cake decoration workshop under professional supervision.",
    imageUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "g3",
    title: "Garment Pattern Assembly",
    category: "fashion",
    description: "A Fashion student finishing measurements on a bespoke dress pattern.",
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "g4",
    title: "Bridal Makeup Practice",
    category: "beauty",
    description: "Beauty students mastering high-definition bridal and events makeup techniques.",
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "g5",
    title: "Student Graduation Day",
    category: "campus",
    description: "Celebrating our proud graduates ready to impact Nairobi's vocational landscape.",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "g6",
    title: "Catering Plating Practical",
    category: "hospitality",
    description: "Fine dining setups and culinary presentation techniques by our catering department.",
    imageUrl: "https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "g7",
    title: "Hair Styling Lab",
    category: "beauty",
    description: "Creative hair styling and salon practice on mannequins in our wellness room.",
    imageUrl: "https://images.unsplash.com/photo-1605497746444-11d6118d867c?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "g8",
    title: "Hardware Maintenance Lab",
    category: "it",
    description: "IT students diagnostic check and component troubleshooting under instructor mentorship.",
    imageUrl: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=600"
  }
];

export const NEWS_DATA: NewsPost[] = [
  {
    id: "news-1",
    title: "September 2026 Admissions Open: Early Bird Discount Available",
    date: "June 25, 2026",
    category: "Announcement",
    summary: "ADIA Empowerment Centre has officially opened applications for our highly sought-after September 2026 intake. Learn about early-bird scholarship discounts.",
    content: "We are thrilled to announce that applications for the upcoming September 2026 Intake are now officially open. To encourage local youth empowerment, ADIA is offering a 10% 'Early Bird' tuition waiver for all candidates who submit their complete application forms and pay the deposit before July 31st, 2026. This promotion applies to all our flagship 6-month programmes, including IT, Hospitality & Catering, Fashion & Design, and Beauty & Cosmetology. Prospective students are encouraged to apply online or pick up a hardcopy form at our Nairobi reception.",
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800",
    tags: ["Intake", "Scholarships", "Admissions"]
  },
  {
    id: "news-2",
    title: "ADIA Hospitality Students Lead Catering for Nairobi Youth Summit",
    date: "June 18, 2026",
    category: "News",
    summary: "Our School of Culinary Arts & Hospitality Management successfully catered a 3-day regional youth delegation with stellar remarks.",
    content: "Congratulations to our Hospitality & Catering department! Last weekend, thirty-five of our catering students, under the supervision of Chef Instructor David, designed, prepared, and served the entire menu for the Nairobi Regional Youth Summit. The 3-day delegation hosted over 250 local and international leaders. Delegates praised the high quality of standard continental bites, local Kenyan dishes, and prompt customer service. This high-profile service project highlights ADIA's commitment to giving students raw, practical, and highly real-world training environments before graduation.",
    imageUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800",
    tags: ["Catering", "Summit", "StudentSuccess"]
  },
  {
    id: "news-3",
    title: "Annual Vocational Skills Expo & Graduation Ceremony",
    date: "May 10, 2026",
    category: "Event",
    summary: "Join us for the ADIA Skills Expo featuring bespoke fashion runway designs, gourmet tastings, and IT innovations by graduating students.",
    content: "The general public, community sponsors, and parents are warmly invited to the ADIA annual Skills Expo and Graduation Ceremony on Friday, July 10th, 2026. The expo begins at 9:00 AM on our campus grounds, showcasing live web creations, custom-tailored African wear collections on the runway, facial skin analysis clinics, and premium bakeries. The graduation ceremony will follow in the afternoon, celebrating over 120 skilled youth entering the workforce. Come witness firsthand the life-changing impact of empowerment!",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
    tags: ["Graduation", "Expo", "Showcase"]
  }
];
