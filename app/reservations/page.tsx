"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { UtensilsCrossed, ArrowLeft, Phone } from "lucide-react";
import { Playfair_Display, Inter } from "next/font/google";
import Link from "next/link";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

export default function ReservationsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    notes: ""
  });
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmed(true);
  };

  return (
    <div 
      className={`${inter.className} min-h-screen w-full relative bg-cover bg-center bg-no-repeat bg-fixed`}
      style={{
        backgroundImage: "url('https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=2400')",
        filter: "brightness(0.75)"
      }}
    >
      {/* Cream Overlay */}
      <div className="absolute inset-0 bg-[rgba(251,247,242,0.45)] backdrop-blur-[1px] pointer-events-none" />
      
      {/* Navbar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 w-full z-50 bg-[var(--brand-ivory)]/95 backdrop-blur-sm border-b border-[var(--brand-border)] relative"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex justify-between items-center">
          <Link href="/page-neo">
            <motion.div 
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <UtensilsCrossed className="text-[var(--brand-gold)]" size={24} />
              <h1 className={`${playfair.className} text-xl md:text-2xl font-semibold text-[var(--brand-espresso)]`}>
                The Modern Table
              </h1>
            </motion.div>
          </Link>
          
          <Link href="/page-neo">
            <motion.button
              className="flex items-center gap-2 text-[var(--brand-espresso)] hover:text-[var(--brand-pine)] transition-colors"
              whileHover={{ x: -5 }}
            >
              <ArrowLeft size={20} />
              <span className="hidden md:inline">Back</span>
            </motion.button>
          </Link>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="pt-40 pb-40 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="paper rounded-2xl p-12 md:p-16 shadow-lg"
          >
            <h1 className={`${playfair.className} text-4xl md:text-5xl font-bold text-[var(--brand-espresso)] mb-6`}>
              Reservations
            </h1>
            <div className="rule mx-auto mb-8"></div>
            
            {!isConfirmed ? (
              <>
                <p className={`${inter.className} text-xl text-[var(--brand-muted)] mb-8 leading-relaxed max-w-2xl mx-auto`}>
                  Reserve your table for an unforgettable dining experience
                </p>

                {/* Reservation Form */}
                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 mb-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-left">
                      <label className={`${inter.className} block text-sm font-medium text-[var(--brand-espresso)] mb-2`}>
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-[var(--brand-border)] bg-white text-[var(--brand-espresso)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)] transition-all"
                        placeholder="Your full name"
                      />
                    </div>

                    <div className="text-left">
                      <label className={`${inter.className} block text-sm font-medium text-[var(--brand-espresso)] mb-2`}>
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-[var(--brand-border)] bg-white text-[var(--brand-espresso)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)] transition-all"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div className="text-left">
                      <label className={`${inter.className} block text-sm font-medium text-[var(--brand-espresso)] mb-2`}>
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-[var(--brand-border)] bg-white text-[var(--brand-espresso)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)] transition-all"
                        placeholder="(555) 000-0000"
                      />
                    </div>

                    <div className="text-left">
                      <label className={`${inter.className} block text-sm font-medium text-[var(--brand-espresso)] mb-2`}>
                        Party Size *
                      </label>
                      <select
                        name="guests"
                        required
                        value={formData.guests}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-[var(--brand-border)] bg-white text-[var(--brand-espresso)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)] transition-all"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                        ))}
                      </select>
                    </div>

                    <div className="text-left">
                      <label className={`${inter.className} block text-sm font-medium text-[var(--brand-espresso)] mb-2`}>
                        Date *
                      </label>
                      <input
                        type="date"
                        name="date"
                        required
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-[var(--brand-border)] bg-white text-[var(--brand-espresso)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)] transition-all"
                      />
                    </div>

                    <div className="text-left">
                      <label className={`${inter.className} block text-sm font-medium text-[var(--brand-espresso)] mb-2`}>
                        Time *
                      </label>
                      <select
                        name="time"
                        required
                        value={formData.time}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-[var(--brand-border)] bg-white text-[var(--brand-espresso)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)] transition-all"
                      >
                        <option value="">Select time</option>
                        <option value="5:00 PM">5:00 PM</option>
                        <option value="5:30 PM">5:30 PM</option>
                        <option value="6:00 PM">6:00 PM</option>
                        <option value="6:30 PM">6:30 PM</option>
                        <option value="7:00 PM">7:00 PM</option>
                        <option value="7:30 PM">7:30 PM</option>
                        <option value="8:00 PM">8:00 PM</option>
                        <option value="8:30 PM">8:30 PM</option>
                        <option value="9:00 PM">9:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-left">
                    <label className={`${inter.className} block text-sm font-medium text-[var(--brand-espresso)] mb-2`}>
                      Special Requests (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-[var(--brand-border)] bg-white text-[var(--brand-espresso)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)] transition-all resize-none"
                      placeholder="Dietary restrictions, special occasions, seating preferences..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full md:w-auto px-12 py-4 rounded-full bg-[var(--brand-espresso)] text-[var(--brand-ivory)] font-semibold text-lg hover:bg-[var(--brand-pine)] transition-colors shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Request Reservation
                  </motion.button>
                </form>

                {/* Call Option */}
                <div className="mb-12">
                  <p className={`${inter.className} text-[var(--brand-muted)] mb-4`}>
                    Prefer to speak with us directly?
                  </p>
                  <motion.a
                    href="tel:+15550000000"
                    className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-[var(--brand-gold)] text-[var(--brand-espresso)] font-semibold hover:bg-[var(--brand-gold)]/90 transition-colors shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Phone size={20} />
                    (555) 000-0000
                  </motion.a>
                </div>

                {/* Gold Rule Separator */}
                <div className="w-full h-px bg-[var(--brand-gold)] my-12"></div>

                {/* Reservation Policy & No-Show Fees */}
                <div className="text-left max-w-2xl mx-auto">
                  <h2 className={`${playfair.className} text-2xl font-semibold text-[var(--brand-espresso)] mb-4 text-center`}>
                    Reservation Policy & No-Show Fees
                  </h2>
                  <p className={`${inter.className} text-[var(--brand-muted)] text-sm leading-relaxed text-center`}>
                    All reservations are subject to availability. A credit card may be required for parties of 5+ guests. No-show or same-day cancellations may incur a $25 per person fee. We kindly ask guests to arrive on time to ensure the best dining experience.
                  </p>
                </div>

                <p className={`${inter.className} text-sm text-[var(--brand-muted)] mt-12`}>
                  Open Tuesday - Sunday | Closed Monday
                </p>
              </>
            ) : (
              /* Confirmation Message */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto py-8"
              >
                <div className="mb-8">
                  <h2 className={`${playfair.className} text-3xl md:text-4xl font-bold text-[var(--brand-espresso)] mb-4`}>
                    Thank You! 🎉
                  </h2>
                  <p className={`${inter.className} text-xl text-[var(--brand-espresso)] leading-relaxed`}>
                    Your reservation request has been received, <span className="font-semibold text-[var(--brand-gold)]">{formData.name}</span>.
                  </p>
                  <p className={`${inter.className} text-lg text-[var(--brand-muted)] mt-4`}>
                    One of our team members will contact you shortly to confirm availability.
                  </p>
                </div>

                <div className="bg-[var(--brand-sand)] rounded-lg p-6 mb-8">
                  <p className={`${inter.className} text-sm text-[var(--brand-muted)] italic`}>
                    Reservations are not finalized until confirmed by a staff member.
                  </p>
                </div>

                <motion.button
                  onClick={() => {
                    setIsConfirmed(false);
                    setFormData({
                      name: "",
                      email: "",
                      phone: "",
                      date: "",
                      time: "",
                      guests: "2",
                      notes: ""
                    });
                  }}
                  className="px-8 py-3 rounded-full border-2 border-[var(--brand-espresso)] text-[var(--brand-espresso)] font-semibold hover:bg-[var(--brand-espresso)] hover:text-[var(--brand-ivory)] transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Make Another Reservation
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
