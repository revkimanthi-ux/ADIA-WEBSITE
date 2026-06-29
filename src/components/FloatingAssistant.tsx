import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Minus, Send, Bot, User, Phone, CornerDownLeft } from "lucide-react";

interface Message {
  sender: "bot" | "user";
  text: string;
  time: string;
}

export default function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello! Welcome to ADIA Empowerment Centre. How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = { sender: "user", text: textToSend, time: userTime };
    setMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setIsTyping(true);

    try {
      // Map our standard internal message format to history for server endpoint if desired
      const payload = {
        message: textToSend,
        history: messages.map((m) => ({
          role: m.sender === "bot" ? "model" : "user",
          parts: [{ text: m.text }],
        })),
      };

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("API call failed");
      }

      const data = await response.json();
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.response, time: botTime },
      ]);
    } catch (err) {
      console.error("Failed to connect to backend chat proxy:", err);
      // Offline simulated response
      setTimeout(() => {
        const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "Hello! Thank you for reaching out. We are currently experiencing high server volume. For immediate answers on admissions, syllabus, or fees, please contact our administrator directly on: **0105086218**.",
            time: botTime,
          },
        ]);
      }, 1000);
    } finally {
      setIsTyping(false);
    }
  };

  const quickPrompts = [
    "Tell me about IT course",
    "How do I apply?",
    "What are the fees?",
    "Where are you located?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans flex flex-col items-end">
      {/* 1. CLOSED FLOATING ACTION BUTTON */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="bg-brand-gold hover:bg-[#e2c062] text-brand-navy w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer border-2 border-white group animate-bounce"
          title="Chat with ADIA Assistant"
          id="assistant-fab"
        >
          <MessageSquare size={24} className="group-hover:rotate-6 transition-transform" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
          </span>
        </button>
      )}

      {/* 2. CHAT WINDOW PANEL */}
      {isOpen && !isMinimized && (
        <div className="w-80 sm:w-96 h-[500px] bg-brand-navy border border-[#1e2f75] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-slideUp">
          {/* Header Bar (Prestige Gold) */}
          <div className="bg-brand-gold text-brand-navy px-4 py-3.5 flex justify-between items-center border-b border-[#af913c]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-brand-navy text-brand-gold flex items-center justify-center font-bold">
                <Bot size={18} />
              </div>
              <div>
                <h4 className="font-bold text-xs tracking-wider uppercase leading-none">ADIA AI Assistant</h4>
                <span className="text-[9px] font-medium text-brand-navy/70 uppercase tracking-widest mt-0.5 inline-block">Online Support</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 hover:bg-black/10 rounded transition-colors text-brand-navy"
                title="Minimize chat"
              >
                <Minus size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-black/10 rounded transition-colors text-brand-navy"
                title="Close chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 bg-brand-navy flex flex-col gap-3 scrollbar-thin">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 max-w-[85%] ${
                  msg.sender === "user" ? "self-end flex-row-reverse" : "self-start"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs ${
                    msg.sender === "user" ? "bg-brand-gold text-brand-navy font-semibold" : "bg-[#1A2E6E] text-brand-gold"
                  }`}
                >
                  {msg.sender === "user" ? <User size={12} /> : <Bot size={12} />}
                </div>
                <div className="flex flex-col">
                  <div
                    className={`px-3 py-2.5 rounded-lg text-xs leading-relaxed whitespace-pre-line ${
                      msg.sender === "user"
                        ? "bg-brand-gold text-brand-navy font-medium rounded-tr-none"
                        : "bg-[#101F57] text-white/95 rounded-tl-none border border-[#1e2f75]"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-white/40 mt-1 self-end">{msg.time}</span>
                </div>
              </div>
            ))}

            {/* Pulsing Dots typing indicator */}
            {isTyping && (
              <div className="flex gap-2 self-start max-w-[85%]">
                <div className="w-7 h-7 rounded-full flex-shrink-0 bg-[#1A2E6E] text-brand-gold flex items-center justify-center text-xs">
                  <Bot size={12} />
                </div>
                <div className="px-3.5 py-2.5 rounded-lg bg-[#101F57] border border-[#1e2f75] rounded-tl-none flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Panel */}
          {messages.length === 1 && !isTyping && (
            <div className="px-4 py-2 bg-[#091232] border-t border-white/5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-gold mb-1.5">Common Questions</p>
              <div className="flex flex-wrap gap-1.5">
                {quickPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(p)}
                    className="text-[11px] bg-brand-navy border border-brand-gold/30 hover:border-brand-gold text-white/90 hover:text-brand-gold px-2.5 py-1.5 rounded-full transition-all duration-200 text-left cursor-pointer"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(message);
            }}
            className="p-3 bg-[#091232] border-t border-[#1e2f75] flex gap-2 items-center"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about courses, intakes, fees..."
              className="flex-1 bg-brand-navy border border-[#1e2f75] text-white placeholder-white/40 text-xs px-3 py-2.5 rounded-md focus:outline-none focus:border-brand-gold"
            />
            <button
              type="submit"
              disabled={!message.trim() || isTyping}
              className="bg-brand-gold text-brand-navy hover:bg-[#e2c062] p-2.5 rounded-md disabled:opacity-40 transition-all flex items-center justify-center cursor-pointer"
              title="Send message"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}

      {/* 3. MINIMIZED STATE BAR */}
      {isOpen && isMinimized && (
        <div
          onClick={() => setIsMinimized(false)}
          className="bg-brand-gold hover:bg-[#e2c062] text-brand-navy px-4 py-2.5 rounded-lg shadow-2xl border border-white flex items-center gap-3 cursor-pointer animate-pulse transition-all"
        >
          <Bot size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">ADIA Assistant (Active)</span>
          <X
            size={14}
            className="hover:scale-125 transition-transform p-0.5 hover:bg-black/10 rounded"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
