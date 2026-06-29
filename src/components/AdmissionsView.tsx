import React, { useState } from "react";
import { Page } from "../types";
import { CheckCircle, Calendar, FileText, Download, DollarSign, Send, Ticket } from "lucide-react";

interface AdmissionsViewProps {
  setCurrentPage: (page: Page) => void;
}

export default function AdmissionsView({ setCurrentPage }: AdmissionsViewProps) {
  // Form submission state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    selectedCourse: "it",
    prevEducation: "KCSE Certificate",
    additionalNotes: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.email) {
      setValidationError("Please fill out all required fields.");
      return;
    }
    setValidationError("");

    // Generate simulated reference ticket number
    const refCode = "ADIA-" + Math.floor(100000 + Math.random() * 90000);
    setTicketNumber(refCode);
    setSubmitted(true);
  };

  const handleDownload = () => {
    setIsDownloading(true);
    setDownloadSuccess(false);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);
    }, 1500);
  };

  return (
    <div className="w-full page-enter bg-[#0D1B4B]">
      {/* Page Header */}
      <section className="bg-white border-b-4 border-[#C9A84C] py-20 px-6 md:px-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-5" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800')` }} />
        <div className="relative max-w-4xl mx-auto flex flex-col items-center gap-3 z-10">
          <span className="text-[#C9A84C] font-bold uppercase tracking-[0.4em] text-xs">Join Us Today</span>
          <h1 className="font-sans font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#0D1B4B] tracking-tight leading-none uppercase">
            Admissions portal
          </h1>
          <div className="w-20 h-1 bg-[#C9A84C] rounded mt-2" />
          <p className="text-xs md:text-sm text-[#0D1B4B]/80 max-w-2xl mt-4 font-medium leading-relaxed">
            Review requirements, check fee rates, download structural brochures, or submit your instant digital enrollment application.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 text-left bg-[#0D1B4B]">
        {/* Left column - General admissions details, requirements, fees table */}
        <div className="lg:col-span-7 flex flex-col gap-12">
          {/* Section 1 - How to apply & Requirements */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest border-b border-white/10 pb-3">
              Admissions Requirements
            </h3>
            <p className="text-xs text-white/70 leading-relaxed font-light">
              We operate an inclusive, merit-supportive entry policy. All applicants with a passion for creative trade, computer technologies, or wellness are warmly encouraged to enroll.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {[
                "A copy of National ID card or Birth Certificate",
                "KCSE certificate / result slip (or life experience equivalent)",
                "Two recent passport-sized photographs",
                "An open mind and commitment to attend practical sessions",
                "Completed Application Form",
                "Basic non-refundable registration fee of 1,000 KES"
              ].map((req, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <CheckCircle className="text-[#C9A84C] mt-0.5 flex-shrink-0" size={14} />
                  <span className="text-xs text-white/80 font-light">{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2 - Fee Structure Table */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest border-b border-white/10 pb-3">
              Programmes Fee Structure
            </h3>
            <p className="text-xs text-white/60 leading-relaxed font-light">
              ADIA Empowerment Centre strives to maintain affordable rates for all Nairobi community members. Below is the total tuition cost per semester. (Installment payments are supported).
            </p>

            <div className="overflow-x-auto border border-white/10 rounded-none mt-2">
              <table className="w-full text-left text-xs text-white/90 border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-[#C9A84C] font-bold uppercase tracking-wider">
                    <th className="p-4">Programme Name</th>
                    <th className="p-4">Duration</th>
                    <th className="p-4">Tuition / Sem</th>
                    <th className="p-4">Lab / Materials</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-white/[0.02]">
                  {[
                    { name: "Information Technology (IT)", duration: "6 Months", tuition: "18,500 KES", lab: "Free" },
                    { name: "Hospitality & Catering", duration: "6 Months", tuition: "22,500 KES", lab: "Included" },
                    { name: "Fashion & Design", duration: "6 Months", tuition: "19,500 KES", lab: "Included" },
                    { name: "Beauty & Cosmetology", duration: "6 Months", tuition: "21,000 KES", lab: "Included" },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold text-white uppercase tracking-wider">{row.name}</td>
                      <td className="p-4">{row.duration}</td>
                      <td className="p-4 font-bold text-[#C9A84C]">{row.tuition}</td>
                      <td className="p-4 text-emerald-400 font-semibold">{row.lab}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3 - Intake Calendar & download block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-none flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[#C9A84C]">
                <Calendar size={16} />
                <h4 className="font-bold text-xs uppercase tracking-widest">Academic Calendar</h4>
              </div>
              <ul className="text-xs text-white/70 leading-relaxed font-light space-y-2.5 mt-2">
                <li><span className="font-bold text-white">● Jan-Jun Session:</span> Admissions close Dec 15</li>
                <li><span className="font-bold text-white">● May-Oct Session:</span> Admissions close Apr 15</li>
                <li><span className="font-bold text-white">● Sep-Feb Session:</span> Admissions close Aug 15</li>
              </ul>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-none flex flex-col justify-between gap-4">
              <div className="flex items-center gap-2 text-[#C9A84C]">
                <FileText size={16} />
                <h4 className="font-bold text-xs uppercase tracking-widest">Download PDF Form</h4>
              </div>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                Prefer to print, write offline, and submit physically to our P.O. Box? Download the blank application form.
              </p>
              <div>
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full bg-[#C9A84C] hover:bg-[#b0913b] text-[#0D1B4B] font-bold text-xs uppercase tracking-widest py-3 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Download size={14} />
                  <span>{isDownloading ? "Downloading..." : "Download Form"}</span>
                </button>
                {downloadSuccess && (
                  <p className="text-[10px] text-emerald-400 mt-2 text-center font-semibold">
                    ✓ Form downloaded successfully (simulated PDF)
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Interactive application form */}
        <div className="lg:col-span-5">
          <div className="bg-white/5 border border-white/10 rounded-none p-6 shadow-xl sticky top-6">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-[#C9A84C] font-bold text-xs uppercase tracking-widest">Online Application</h3>
                  <p className="text-[10px] text-white/50 font-light mt-1 uppercase tracking-wider">Submit details to reserve a tuition slot.</p>
                </div>

                {validationError && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs p-3 font-semibold uppercase tracking-wider">
                    {validationError}
                  </div>
                )}

                {/* Full Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase tracking-widest font-bold text-white/60">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your first and last name"
                    className="bg-[#0D1B4B] border border-white/10 focus:border-[#C9A84C] text-white text-xs px-3 py-3 rounded-none focus:outline-none placeholder-white/30 uppercase tracking-wider"
                  />
                </div>

                {/* Email address */}
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase tracking-widest font-bold text-white/60">Contact Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="bg-[#0D1B4B] border border-white/10 focus:border-[#C9A84C] text-white text-xs px-3 py-3 rounded-none focus:outline-none placeholder-white/30 uppercase tracking-wider"
                  />
                </div>

                {/* Phone number */}
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase tracking-widest font-bold text-white/60">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g., 0712345678 or 0105086218"
                    className="bg-[#0D1B4B] border border-white/10 focus:border-[#C9A84C] text-white text-xs px-3 py-3 rounded-none focus:outline-none placeholder-white/30 uppercase tracking-wider"
                  />
                </div>

                {/* Selected Course */}
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase tracking-widest font-bold text-white/60">Programme of Interest *</label>
                  <select
                    value={formData.selectedCourse}
                    onChange={(e) => setFormData({ ...formData, selectedCourse: e.target.value })}
                    className="bg-[#0D1B4B] border border-white/10 focus:border-[#C9A84C] text-white text-xs px-3 py-3 rounded-none focus:outline-none cursor-pointer uppercase tracking-wider"
                  >
                    <option value="it">Information Technology (IT)</option>
                    <option value="hospitality">Hospitality & Catering</option>
                    <option value="fashion">Fashion & Design</option>
                    <option value="beauty">Beauty & Cosmetology</option>
                  </select>
                </div>

                {/* Previous Education Level */}
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase tracking-widest font-bold text-white/60">Highest Educational Level *</label>
                  <select
                    value={formData.prevEducation}
                    onChange={(e) => setFormData({ ...formData, prevEducation: e.target.value })}
                    className="bg-[#0D1B4B] border border-white/10 focus:border-[#C9A84C] text-white text-xs px-3 py-3 rounded-none focus:outline-none cursor-pointer uppercase tracking-wider"
                  >
                    <option value="KCSE Certificate">KCSE Certificate / Result Slip</option>
                    <option value="KCPE Certificate">KCPE Certificate</option>
                    <option value="Diploma / Degree">Pre-existing Diploma / Certificate</option>
                    <option value="Other">Other / Interested Individual</option>
                  </select>
                </div>

                {/* Additional notes */}
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase tracking-widest font-bold text-white/60">Additional notes (Sponsorship, etc.)</label>
                  <textarea
                    rows={3}
                    value={formData.additionalNotes}
                    onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                    placeholder="e.g., Interested in early-bird scholarships or morning sessions..."
                    className="bg-[#0D1B4B] border border-white/10 focus:border-[#C9A84C] text-white text-xs px-3 py-3 rounded-none focus:outline-none resize-none placeholder-white/30 uppercase tracking-wider"
                  />
                </div>

                {/* Form submit button */}
                <button
                  type="submit"
                  className="bg-[#C9A84C] hover:bg-[#b0913b] text-[#0D1B4B] font-bold uppercase text-xs tracking-widest py-4 transition-colors flex items-center justify-center gap-2 mt-2 cursor-pointer"
                >
                  <Send size={14} />
                  <span>Submit Enrollment Request</span>
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center text-center py-10 gap-5">
                <div className="w-16 h-16 rounded-none bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <Ticket size={24} />
                </div>
                <div>
                  <h3 className="font-sans font-extrabold text-lg text-white uppercase tracking-wider">Application Received</h3>
                  <p className="text-xs text-white/60 font-light mt-2 max-w-xs leading-relaxed">
                    Thank you, <span className="font-bold text-white uppercase">{formData.fullName}</span>. Your ADIA application has been logged into our registrar database.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-none p-5 w-full flex flex-col gap-2 items-center">
                  <span className="text-[9px] uppercase tracking-widest font-bold text-[#C9A84C]">YOUR ENROLLMENT TICKET</span>
                  <span className="font-mono text-lg font-bold tracking-widest text-emerald-400">{ticketNumber}</span>
                  <span className="text-[10px] text-white/40 mt-1 leading-relaxed">Please keep this code safe. Our administration team will call you at <span className="text-white font-bold">{formData.phone}</span> to finalize intake registration.</span>
                </div>

                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      fullName: "",
                      email: "",
                      phone: "",
                      selectedCourse: "it",
                      prevEducation: "KCSE Certificate",
                      additionalNotes: ""
                    });
                  }}
                  className="bg-transparent hover:bg-white/5 text-[#C9A84C] font-bold uppercase text-xs tracking-widest py-3 px-6 border border-[#C9A84C]/30 hover:border-[#C9A84C] transition-colors mt-4 cursor-pointer"
                >
                  Apply For Another Program
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
