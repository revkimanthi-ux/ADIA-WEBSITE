import React, { useState } from "react";
import { Phone, Mail, MapPin, Send, MessageSquare, Clock, Globe, ThumbsUp, Map } from "lucide-react";

export default function ContactView() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
    }, 1200);
  };

  return (
    <div className="w-full page-enter">
      {/* Page Header */}
      <section className="bg-[#091232] border-b border-[#1A2E6E] py-16 px-4 md:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-15" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800')` }} />
        <div className="relative max-w-4xl mx-auto flex flex-col items-center gap-3 z-10">
          <span className="text-brand-gold font-bold uppercase tracking-widest text-xs">Reach Out</span>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-none uppercase">
            CONTACT US
          </h1>
          <div className="w-20 h-1 bg-brand-gold rounded mt-1" />
          <p className="text-sm md:text-base text-white/80 max-w-2xl mt-2 font-light">
            Have questions about student life, installment fees, or location access? Write to us, give us a call, or locate us on the map.
          </p>
        </div>
      </section>

      {/* Main Grid: Info Left, Form Right */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
        {/* Info Column (Left) */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <span className="text-brand-gold font-bold uppercase tracking-widest text-[10px]">Administrative Desk</span>
            <h2 className="font-sans font-bold text-2xl text-white tracking-tight uppercase leading-none">
              Contact Information
            </h2>
            <div className="w-12 h-1 bg-brand-gold rounded mt-1" />
            <p className="text-xs text-white/70 leading-relaxed font-light mt-1.5">
              ADIA Empowerment Centre welcomes all visitors. Our administrative offices in Nairobi are open Monday to Friday.
            </p>
          </div>

          {/* Location details card list */}
          <div className="flex flex-col gap-4">
            {/* Institution Name */}
            <div className="bg-[#0c163b] border border-[#1e2f75] p-4 rounded-xl flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#1a2e6e] text-brand-gold flex items-center justify-center flex-shrink-0">
                <Globe size={18} />
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-brand-gold">Institution Name</h4>
                <p className="text-sm text-white font-semibold mt-1">ADIA Empowerment Centre</p>
              </div>
            </div>

            {/* P.O. Box Address */}
            <div className="bg-[#0c163b] border border-[#1e2f75] p-4 rounded-xl flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#1a2e6e] text-brand-gold flex items-center justify-center flex-shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-brand-gold">Mailing Address</h4>
                <p className="text-sm text-white font-semibold mt-1">P.O. Box 22870-00100</p>
                <p className="text-xs text-white/60 mt-0.5">Nairobi, Kenya</p>
              </div>
            </div>

            {/* Telephone Call */}
            <div className="bg-[#0c163b] border border-[#1e2f75] p-4 rounded-xl flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#1a2e6e] text-brand-gold flex items-center justify-center flex-shrink-0">
                <Phone size={18} />
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-brand-gold">Call Admissions Office</h4>
                <a href="tel:0105086218" className="text-sm text-white font-bold mt-1 block hover:text-brand-gold hover:underline transition-colors">
                  0105086218
                </a>
                <p className="text-[10px] text-white/50 mt-0.5">Safaricom line | Available 8:00 AM - 5:00 PM</p>
              </div>
            </div>

            {/* Office Hours */}
            <div className="bg-[#0c163b] border border-[#1e2f75] p-4 rounded-xl flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#1a2e6e] text-brand-gold flex items-center justify-center flex-shrink-0">
                <Clock size={18} />
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-brand-gold">Administrative Hours</h4>
                <p className="text-xs text-white/90 mt-1 font-medium">Monday - Friday: 8:00 AM to 5:00 PM</p>
                <p className="text-xs text-white/90 mt-0.5 font-medium">Saturday: 9:00 AM to 1:00 PM</p>
                <p className="text-xs text-red-400 mt-0.5 font-medium">Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form & Google Map (Right) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Section 1 - Form Card */}
          <div className="bg-[#0c163b] border border-[#1e2f75] rounded-xl p-6 shadow-xl">
            {!success ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="border-b border-white/5 pb-3">
                  <h3 className="text-brand-gold font-bold text-sm uppercase tracking-wider">Send Us A Message</h3>
                  <p className="text-[11px] text-white/60 font-light mt-0.5">We respond within 24 business hours.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-white/80">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your name"
                      className="bg-brand-navy border border-[#1e2f75] focus:border-brand-gold text-white text-xs px-3 py-2.5 rounded-md focus:outline-none"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-white/80">Email address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. name@example.com"
                      className="bg-brand-navy border border-[#1e2f75] focus:border-brand-gold text-white text-xs px-3 py-2.5 rounded-md focus:outline-none"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-white/80">Inquiry Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="bg-brand-navy border border-[#1e2f75] focus:border-brand-gold text-white text-xs px-3 py-2.5 rounded-md focus:outline-none cursor-pointer"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Syllabus & Course Modules">Syllabus & Course Modules</option>
                    <option value="Fees Installment queries">Fees Installment Queries</option>
                    <option value="Sponsorship & Partnership">Sponsorship & Partnership</option>
                  </select>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-white/80">Your Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your inquiry in detail..."
                    className="bg-brand-navy border border-[#1e2f75] focus:border-brand-gold text-white text-xs px-3 py-2.5 rounded-md focus:outline-none resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-brand-gold hover:bg-[#e2c062] text-brand-navy font-bold uppercase text-xs tracking-widest py-3 rounded shadow transition-all flex items-center justify-center gap-1.5 mt-2 cursor-pointer disabled:opacity-50"
                >
                  <Send size={14} />
                  <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center py-8 text-center gap-4 animate-scaleUp">
                <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                  <ThumbsUp size={24} />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-lg text-white uppercase">Message Dispatched!</h3>
                  <p className="text-xs text-white/70 max-w-xs leading-relaxed mt-1 font-light">
                    Thanks <span className="font-semibold text-white">{formData.name}</span>. Your message regarding <span className="italic">"{formData.subject}"</span> has been sent. We will get back to you shortly.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
                  }}
                  className="bg-transparent hover:bg-white/5 text-brand-gold font-bold uppercase text-[10px] tracking-widest px-5 py-2 rounded border border-brand-gold/30 hover:border-brand-gold transition-all mt-2"
                >
                  Write Another Message
                </button>
              </div>
            )}
          </div>

          {/* Section 2 - Map frame container */}
          <div className="bg-[#0c163b] border border-[#1e2f75] rounded-xl overflow-hidden shadow-xl p-2 bg-brand-navy flex flex-col gap-2">
            <div className="px-4 py-2 flex justify-between items-center bg-[#091232] rounded-lg">
              <span className="text-[10px] text-brand-gold tracking-widest font-bold uppercase flex items-center gap-1.5">
                <Map size={12} className="text-brand-gold" />
                <span>Nairobi Campus Location</span>
              </span>
              <a
                href="https://maps.app.goo.gl/o3Xm3Qzni8YG7F5E6"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-bold text-white hover:text-brand-gold underline uppercase"
              >
                Open Google Maps Pin
              </a>
            </div>

            {/* Embedded Iframe */}
            <div className="h-64 rounded-lg overflow-hidden border border-[#1e2f75]">
              <iframe
                title="ADIA Empowerment Centre Nairobi Pin"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.22822455823!2d36.817223!3d-1.2921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d4997%3A0x6ecab23b8217036!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2ske!4v1719620000000!5m2!1sen!2ske"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="filter brightness-90 contrast-[95%] grayscale-[10%]"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
