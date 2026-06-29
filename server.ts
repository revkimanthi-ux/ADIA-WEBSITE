import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Lazy-initialize Gemini AI client safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ GEMINI_API_KEY is not defined. The AI assistant will operate in simulation mode.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// System instructions for the ADIA Floating Assistant
const ADIA_SYSTEM_INSTRUCTION = `
You are the official ADIA Empowerment Centre floating AI Chat Assistant. 
Your goal is to greet visitors with warmth and credibility, and guide them with complete and accurate information about ADIA Empowerment Centre, a prestigious skills development and vocational training centre in Nairobi, Kenya.

Brand Promise: "Empowering Communities Through Skill Development"

Key Institution Details:
- Name: ADIA Empowerment Centre
- P.O. Box: 22870-00100, Nairobi, Kenya
- Tel / Contact Number: 0105086218 (Keep this handy and offer it if you cannot answer a specific query or for custom registration assistance)
- Location: Nairobi, Kenya. Map pin link: https://maps.app.goo.gl/o3Xm3Qzni8YG7F5E6 (Located conveniently in Nairobi with accessible facilities)

Intake Dates & Admissions:
- Intakes open three times a year: January, May, and September. Applications are currently active.
- Fees: Affordable and flexible payment structures, ranging from 15,000 KES to 25,000 KES per semester depending on the course.
- Requirements: High school KCSE certificate or equivalent interest in life skills. All are welcome to apply!
- Application Form: Downloadable directly on our Admissions portal on the website, or apply online instantly through our "Apply Now" forms.

Programmes Offered (6-Month Certificate Courses with excellent career prospects):
1. Information Technology (IT)
   - Overview: Learn essential computer packages, web design, troubleshooting, database management, and digital marketing.
   - Modules: Word processing, spreadsheet calculations, HTML/CSS/JS, basic hardware maintenance, SEO and marketing.
   - Prospects: IT assistant, digital marketer, office administrator, junior web designer.
2. Hospitality & Catering
   - Overview: Master culinary arts, baking, pastry production, food and beverage operations, and service skills.
   - Modules: Professional food production, baking essentials, kitchen hygiene and sanitation, mixology, guest service.
   - Prospects: Assistant chef, professional baker, catering manager, hospitality supervisor.
3. Fashion & Design
   - Overview: Develop expertise in garment drafting, dressmaking, creative design illustration, and tailoring.
   - Modules: Pattern construction, sewing operations, textiles selection, fashion illustration, tailoring entrepreneurship.
   - Prospects: Fashion designer, professional tailor, design house entrepreneur, apparel supervisor.
4. Beauty & Cosmetology
   - Overview: Focuses on professional hair styling, skincare therapy, makeup artistry, and salon business management.
   - Modules: Hair styling and chemical treatment, facial therapeutics, bridal and media makeup, nail technology, salon management.
   - Prospects: Hair stylist, professional makeup artist, beauty therapist, beauty salon owner.

Behavior Rules:
1. Greet visitors with: "Hello! Welcome to ADIA Empowerment Centre. How can I help you today?" if they say hello or start a conversation.
2. Be extremely helpful, warm, professional, encouraging, and informative.
3. Highlight our Brand Promise ("Empowering Communities Through Skill Development").
4. IMPORTANT: If you are asked a specific query that you do not have exact details for (e.g., highly custom financial aid packages, direct personal admissions statuses, or offline board decisions), immediately provide our official telephone contact: 0105086218 for immediate support.
5. Keep your responses structured, clean, and concise using markdown for readability. Do not output excessive paragraphs.
`;

// API routes for full-stack functionality
const DATA_STORE_PATH = path.join(process.cwd(), "data_store.json");

// Helper to load or initialize data store
function loadDataStore() {
  const defaults = {
    adminPasscode: "adia2026",
    headerConfig: {
      tel: "0105086218",
      admissionsOpen: "ADMISSIONS OPEN: JAN 2026",
      email: "info@adiaempowerment.ac.ke",
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      whatsapp: "https://wa.me/254105086218",
      logoText: "ADIA EMPOWERMENT",
      logoSubtitle: "CENTRE • NAIROBI, KENYA"
    },
    slides: [
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
    ],
    news: [
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
    ],
    gallery: [
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
    ]
  };

  try {
    if (fs.existsSync(DATA_STORE_PATH)) {
      const data = fs.readFileSync(DATA_STORE_PATH, "utf-8");
      const parsed = JSON.parse(data);
      if (!parsed.adminPasscode) {
        parsed.adminPasscode = "adia2026";
        fs.writeFileSync(DATA_STORE_PATH, JSON.stringify(parsed, null, 2), "utf-8");
      }
      return parsed;
    } else {
      fs.writeFileSync(DATA_STORE_PATH, JSON.stringify(defaults, null, 2), "utf-8");
      return defaults;
    }
  } catch (err) {
    console.error("Error reading data store file:", err);
    return defaults;
  }
}

function saveToStore(key: string, data: any) {
  try {
    const store = loadDataStore();
    store[key] = data;
    fs.writeFileSync(DATA_STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error(`Error saving ${key} to data store:`, err);
    return false;
  }
}

// In-memory administrative security state
interface SessionInfo {
  username: string;
  expiresAt: number;
}

interface SecurityLogEntry {
  id: string;
  timestamp: string;
  username: string;
  status: "SUCCESS" | "FAILED" | "PASSWORD_CHANGED" | "LOGOUT";
  ip: string;
  userAgent: string;
}

const activeSessions = new Map<string, SessionInfo>();
const securityLogs: SecurityLogEntry[] = [];
const failedAttempts = new Map<string, { count: number; lockedUntil: number }>();

// Helper to log administrative security events
function addSecurityLog(username: string, status: "SUCCESS" | "FAILED" | "PASSWORD_CHANGED" | "LOGOUT", req: express.Request) {
  const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "Unknown IP";
  const userAgent = req.headers["user-agent"] || "Unknown User Agent";
  
  securityLogs.unshift({
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toLocaleString("en-US", { timeZone: "Africa/Nairobi" }), // local institutional time
    username: username || "anonymous",
    status,
    ip,
    userAgent
  });

  // Keep logs capped at latest 50 entries
  if (securityLogs.length > 50) {
    securityLogs.pop();
  }
}

// Session Validator Middleware
function validateAdminSession(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access Denied: Unauthenticated administrative session." });
  }
  const token = authHeader.substring(7);
  const session = activeSessions.get(token);
  if (!session) {
    return res.status(401).json({ error: "Access Denied: Invalid or expired administrative session." });
  }
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    addSecurityLog(session.username, "LOGOUT", req);
    return res.status(401).json({ error: "Access Denied: Administrative session has expired." });
  }
  // Slide expiration (extend by another 30 mins)
  session.expiresAt = Date.now() + 30 * 60 * 1000;
  next();
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Secure Admin Login API
app.post("/api/admin/login", (req, res) => {
  const { username, passcode } = req.body;
  const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "global";
  
  // Rate-limiting check
  const attempt = failedAttempts.get(ip);
  if (attempt && attempt.lockedUntil > Date.now()) {
    const waitSeconds = Math.ceil((attempt.lockedUntil - Date.now()) / 1000);
    return res.status(429).json({
      error: `Too many login attempts. Access temporarily locked. Please wait ${waitSeconds} seconds.`
    });
  }

  const store = loadDataStore();
  const validPasscode = process.env.ADMIN_PASSCODE || store.adminPasscode || "adia2026";
  const validUsername = "admin";

  if (username === validUsername && passcode === validPasscode) {
    // Reset failures on success
    failedAttempts.delete(ip);

    // Generate session token
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    const expiresAt = Date.now() + 30 * 60 * 1000; // 30 minutes
    
    activeSessions.set(token, {
      username: validUsername,
      expiresAt
    });

    addSecurityLog(validUsername, "SUCCESS", req);
    return res.json({
      success: true,
      token,
      username: validUsername,
      expiresAt,
      isDefaultPasscode: validPasscode === "adia2026"
    });
  } else {
    // Increment failure counter
    const currentCount = attempt ? attempt.count + 1 : 1;
    let lockedUntil = 0;
    if (currentCount >= 5) {
      lockedUntil = Date.now() + 60 * 1000; // 60 seconds lockout
    }
    failedAttempts.set(ip, {
      count: currentCount,
      lockedUntil
    });

    addSecurityLog(username || "unknown", "FAILED", req);
    
    if (currentCount >= 5) {
      return res.status(429).json({
        error: "Too many failed login attempts. Administrative portal is locked for 60 seconds."
      });
    } else {
      return res.status(401).json({
        error: `Invalid credentials. ${5 - currentCount} attempts remaining before security lockout.`
      });
    }
  }
});

// Secure Password Change API
app.post("/api/admin/change-passcode", validateAdminSession, (req, res) => {
  const { currentPasscode, newPasscode } = req.body;
  if (!currentPasscode || !newPasscode) {
    return res.status(400).json({ error: "Current passcode and new passcode are required." });
  }

  const store = loadDataStore();
  const validPasscode = process.env.ADMIN_PASSCODE || store.adminPasscode || "adia2026";

  if (currentPasscode !== validPasscode) {
    return res.status(400).json({ error: "Current passcode is incorrect." });
  }

  if (newPasscode.length < 4) {
    return res.status(400).json({ error: "New passcode must be at least 4 characters long." });
  }

  const success = saveToStore("adminPasscode", newPasscode);
  if (success) {
    addSecurityLog("admin", "PASSWORD_CHANGED", req);
    res.json({ success: true, message: "Administrative passcode updated successfully on disk." });
  } else {
    res.status(500).json({ error: "Failed to write new passcode to disk." });
  }
});

// GET Security logs
app.get("/api/admin/security-logs", validateAdminSession, (req, res) => {
  res.json({
    logs: securityLogs,
    activeSessionsCount: activeSessions.size
  });
});

// Secure Sign Out API
app.post("/api/admin/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const session = activeSessions.get(token);
    if (session) {
      addSecurityLog(session.username, "LOGOUT", req);
      activeSessions.delete(token);
    }
  }
  res.json({ success: true });
});

app.get("/api/header-config", (req, res) => {
  const store = loadDataStore();
  res.json(store.headerConfig);
});

app.post("/api/header-config", validateAdminSession, (req, res) => {
  const { headerConfig } = req.body;
  if (!headerConfig) {
    return res.status(400).json({ error: "headerConfig is required" });
  }
  const success = saveToStore("headerConfig", headerConfig);
  if (success) {
    res.json({ success: true, headerConfig });
  } else {
    res.status(500).json({ error: "Failed to save configuration" });
  }
});

app.get("/api/slides", (req, res) => {
  const store = loadDataStore();
  res.json(store.slides);
});

app.post("/api/slides", validateAdminSession, (req, res) => {
  const { slides } = req.body;
  if (!slides || !Array.isArray(slides)) {
    return res.status(400).json({ error: "slides array is required" });
  }
  const success = saveToStore("slides", slides);
  if (success) {
    res.json({ success: true, slides });
  } else {
    res.status(500).json({ error: "Failed to save slides" });
  }
});

app.get("/api/news", (req, res) => {
  const store = loadDataStore();
  res.json(store.news);
});

app.post("/api/news", validateAdminSession, (req, res) => {
  const { news } = req.body;
  if (!news || !Array.isArray(news)) {
    return res.status(400).json({ error: "news array is required" });
  }
  const success = saveToStore("news", news);
  if (success) {
    res.json({ success: true, news });
  } else {
    res.status(500).json({ error: "Failed to save news" });
  }
});

app.get("/api/gallery", (req, res) => {
  const store = loadDataStore();
  res.json(store.gallery);
});

app.post("/api/gallery", validateAdminSession, (req, res) => {
  const { gallery } = req.body;
  if (!gallery || !Array.isArray(gallery)) {
    return res.status(400).json({ error: "gallery array is required" });
  }
  const success = saveToStore("gallery", gallery);
  if (success) {
    res.json({ success: true, gallery });
  } else {
    res.status(500).json({ error: "Failed to save gallery" });
  }
});

// File upload endpoint for admin media and applicant files
app.post("/api/upload", (req, res) => {
  const { fileName, fileData } = req.body;
  if (!fileName || !fileData) {
    return res.status(400).json({ error: "fileName and fileData are required" });
  }

  try {
    const matches = fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: "Invalid base64 data format" });
    }

    const fileBuffer = Buffer.from(matches[2], "base64");
    const uploadsDir = path.join(process.cwd(), "uploads");

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const ext = path.extname(fileName) || ".jpg";
    const baseName = path.basename(fileName, ext).replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const uniqueFileName = `${baseName}-${Date.now()}${ext}`;
    const filePath = path.join(uploadsDir, uniqueFileName);

    fs.writeFileSync(filePath, fileBuffer);

    res.json({
      success: true,
      url: `/uploads/${uniqueFileName}`
    });
  } catch (err: any) {
    console.error("Error saving file:", err);
    res.status(500).json({ error: err.message || "Failed to save file" });
  }
});

// Chat proxy endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message parameter is required." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Graceful fallback simulation if API key is missing
      console.log("Simulating assistant response due to missing GEMINI_API_KEY");
      let reply = "Hello! Welcome to ADIA Empowerment Centre. I am currently running in offline preview mode. How can I help you today? You can inquire about our IT, Hospitality, Fashion, or Beauty programmes, or reach us at 0105086218.";
      const msgLower = message.toLowerCase();
      if (msgLower.includes("course") || msgLower.includes("programme") || msgLower.includes("learn")) {
        reply = "ADIA Empowerment Centre offers four main professional programmes:\n1. **Information Technology (IT)**\n2. **Hospitality & Catering**\n3. **Fashion & Design**\n4. **Beauty & Cosmetology**\n\nEach programme is 6 months long with intakes in January, May, and September. Would you like to know more about a specific one?";
      } else if (msgLower.includes("contact") || msgLower.includes("number") || msgLower.includes("phone") || msgLower.includes("call")) {
        reply = "You can reach ADIA Empowerment Centre at our official phone number: **0105086218** or write to us at P.O. Box 22870-00100, Nairobi, Kenya.";
      } else if (msgLower.includes("admission") || msgLower.includes("apply") || msgLower.includes("fee") || msgLower.includes("cost")) {
        reply = "To apply, you can fill out our application form directly under the Admissions section. Requirements include a high school certificate or equivalent interest. Semesters cost between 15,000 KES and 25,000 KES. Call us on **0105086218** for full details!";
      } else if (msgLower.includes("where") || msgLower.includes("location") || msgLower.includes("map")) {
        reply = "We are located in Nairobi, Kenya. Our official Google Maps location is: [Google Maps Pin](https://maps.app.goo.gl/o3Xm3Qzni8YG7F5E6). Come visit us!";
      }
      return res.json({ response: reply });
    }

    // Format chat contents with system instruction and history
    // We construct a combined request with history or use the simple chat API.
    // Let's use the chat session mapping to conform with @google/genai
    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: ADIA_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
      // Optionally we can seed history if passed from the frontend
      history: history || [],
    });

    const response = await chat.sendMessage({ message });
    res.json({ response: response.text });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({ error: error.message || "An error occurred with the AI assistant." });
  }
});

// Configure Vite middleware in development, and serve static build in production
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite HMR...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode serving static dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 ADIA Empowerment Centre server running at http://localhost:${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error("Failed to start Vite Dev Server:", err);
});
