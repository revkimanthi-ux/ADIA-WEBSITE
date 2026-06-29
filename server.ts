import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

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
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.get("/api/header-config", (req, res) => {
  res.json({
    tel: "0105086218",
    admissionsOpen: "ADMISSIONS OPEN: JAN 2026",
    email: "info@adiaempowerment.ac.ke",
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    whatsapp: "https://wa.me/254105086218",
    logoText: "ADIA EMPOWERMENT",
    logoSubtitle: "CENTRE • NAIROBI, KENYA"
  });
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
