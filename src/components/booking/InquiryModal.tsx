'use client';

import { useState } from 'react';
import { X, Send, Calendar, Users, MessageSquare, Phone, Mail, CheckCircle2, Sparkles, Building, MapPin } from 'lucide-react';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  venueName?: string;
}

export function InquiryModal({ isOpen, onClose, venueName = 'Rent-A-Vibe 2BHK Luxury Party Flat' }: InquiryModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('general');
  const [date, setDate] = useState('');
  const [guestCount, setGuestCount] = useState('15');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // Allow user to read confirmation before closing
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-card w-full max-w-lg p-6 sm:p-8 space-y-5 border border-purple-500/40 bg-slate-900/95 text-white shadow-2xl rounded-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4 animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white font-heading">Inquiry Received!</h3>
              <p className="text-slate-300 text-xs sm:text-sm font-medium max-w-sm mx-auto">
                Thank you, <strong className="text-white">{name}</strong>. Our official venue manager will contact you at <strong className="text-purple-300">{phone || email}</strong> within 15 minutes.
              </p>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl text-xs text-slate-400 font-mono border border-white/10 text-left space-y-1">
              <p><span className="text-slate-500">Venue:</span> {venueName}</p>
              <p><span className="text-slate-500">Inquiry Type:</span> {inquiryType === 'visit' ? 'Pre-booking Site Visit' : inquiryType === 'custom' ? 'Custom Package Setup' : 'General Reservation Inquiry'}</p>
              {date && <p><span className="text-slate-500">Target Date:</span> {date}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="btn-primary w-full py-3 text-sm font-extrabold cursor-pointer"
            >
              Done & Return to Site
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-1.5">
              <span className="badge bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] px-2.5 py-0.5 font-bold uppercase inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400" /> Official Venue Inquiry & Support
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
                Contact Venue Host & Manager
              </h2>
              <p className="text-slate-300 text-xs font-medium">
                Have questions before reserving? Request a site visit or custom party arrangement for {venueName}.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Rohan Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field text-xs py-2.5 bg-slate-950/90 border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Phone / WhatsApp Number</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input-field text-xs py-2.5 pl-9 bg-slate-950/90 border-white/10 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Inquiry Type</label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    className="input-field text-xs py-2.5 bg-slate-950/90 border-white/10 text-white cursor-pointer"
                  >
                    <option value="general">General Venue Inquiry</option>
                    <option value="visit">Schedule Pre-booking Site Visit</option>
                    <option value="custom">Custom Group / Catering Package</option>
                    <option value="rules">House Rules & Sound Policy Query</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Planned Date (Optional)</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="input-field text-xs py-2.5 bg-slate-950/90 border-white/10 text-white cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Your Message or Questions</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ask about check-in timing, parking, sound setup, or schedule a 10-minute flat walkthrough..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="input-field text-xs p-3 bg-slate-950/90 border-white/10 text-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-3.5 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Send className="w-4 h-4" /> Send Direct Inquiry to Venue Manager
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
