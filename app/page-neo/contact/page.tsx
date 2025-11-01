"use client";

import React from "react";
import { motion } from "framer-motion";
import { UtensilsCrossed, ArrowLeft, MapPin, Phone, Mail, Clock } from "lucide-react";
import { Playfair_Display, Inter } from "next/font/google";
import Link from "next/link";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

export default function ContactPage() {
  return (
    <div className={`${inter.className} min-h-screen bg-[var(--brand-sand)] relative overflow-hidden`}>
      {/* Warm Background Texture */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-ivory)] via-[var(--brand-sand)] to-[var(--brand-ivory)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,178,109,0.08),transparent_50%)]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D9B26D] rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-blob"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#1F3A34] rounded-full mix-blend-multiply filter blur-[128px] opacity-5 animate-blob animation-delay-2000"></div>
      </div>

      {/* Navbar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 w-full z-50 bg-[var(--brand-ivory)]/95 backdrop-blur-md border-b border-[var(--brand-border)] shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex justify-between items-center">
          <Link href="/page-neo/hideaway-preview">
            <motion.div 
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <UtensilsCrossed className="text-[var(--brand-gold)]" size={26} />
              <h1 className={`${playfair.className} text-xl md:text-2xl font-bold text-[var(--brand-espresso)]`}>
                The Modern Table
              </h1>
            </motion.div>
          </Link>
          
          <Link href="/page-neo/hideaway-preview">
            <motion.button
              className={`${inter.className} flex items-center gap-2 text-[var(--brand-espresso)] hover:text-[var(--brand-gold)] transition-colors font-medium`}
              whileHover={{ x: -5 }}
            >
              <ArrowLeft size={20} />
              <span className="hidden md:inline">Back</span>
            </motion.button>
          </Link>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className={`${playfair.className} text-5xl md:text-6xl font-bold text-[var(--brand-espresso)] mb-6`}>
              Contact Us
            </h1>
            {/* Gold accent underline */}
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[var(--brand-gold)] to-transparent mx-auto mb-6"></div>
            <p className={`${inter.className} text-xl text-[var(--brand-espresso)] opacity-80 max-w-2xl mx-auto`}>
              We'd love to hear from you. Reach out to The Modern Table.
            </p>
          </motion.div>

          {/* Contact Cards Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Location Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group"
            >
              <div className="h-full rounded-2xl p-8 bg-white/50 backdrop-blur-sm border border-[var(--brand-border)] shadow-lg hover:shadow-xl hover:border-[var(--brand-gold)]/30 transition-all duration-300">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--brand-gold)] to-[#D9B26D] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-md">
                    <MapPin className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`${playfair.className} text-2xl font-bold text-[var(--brand-espresso)] mb-3`}>
                      Location
                    </h3>
                    <p className={`${inter.className} text-[var(--brand-espresso)] opacity-70 leading-relaxed`}>
                      Downtown – Your City, USA
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Phone Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group"
            >
              <div className="h-full rounded-2xl p-8 bg-white/50 backdrop-blur-sm border border-[var(--brand-border)] shadow-lg hover:shadow-xl hover:border-[var(--brand-gold)]/30 transition-all duration-300">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--brand-gold)] to-[#D9B26D] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-md">
                    <Phone className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`${playfair.className} text-2xl font-bold text-[var(--brand-espresso)] mb-3`}>
                      Phone
                    </h3>
                    <a 
                      href="tel:+15550000000"
                      className={`${inter.className} text-[var(--brand-espresso)] opacity-70 hover:text-[var(--brand-gold)] hover:opacity-100 transition-all leading-relaxed inline-block`}
                    >
                      (555) 000-0000
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Email Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group"
            >
              <div className="h-full rounded-2xl p-8 bg-white/50 backdrop-blur-sm border border-[var(--brand-border)] shadow-lg hover:shadow-xl hover:border-[var(--brand-gold)]/30 transition-all duration-300">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--brand-gold)] to-[#D9B26D] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-md">
                    <Mail className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`${playfair.className} text-2xl font-bold text-[var(--brand-espresso)] mb-3`}>
                      Email
                    </h3>
                    <a 
                      href="mailto:info@themoderntable.restaurant"
                      className={`${inter.className} text-[var(--brand-espresso)] opacity-70 hover:text-[var(--brand-gold)] hover:opacity-100 transition-all leading-relaxed break-all inline-block`}
                    >
                      info@themoderntable.restaurant
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Hours Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="group"
            >
              <div className="h-full rounded-2xl p-8 bg-white/50 backdrop-blur-sm border border-[var(--brand-border)] shadow-lg hover:shadow-xl hover:border-[var(--brand-gold)]/30 transition-all duration-300">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--brand-gold)] to-[#D9B26D] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-md">
                    <Clock className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`${playfair.className} text-2xl font-bold text-[var(--brand-espresso)] mb-3`}>
                      Hours
                    </h3>
                    <div className={`${inter.className} text-[var(--brand-espresso)] opacity-70 space-y-2 leading-relaxed`}>
                      <p>Tuesday - Thursday: 5:00 PM - 10:00 PM</p>
                      <p>Friday - Saturday: 5:00 PM - 11:00 PM</p>
                      <p>Sunday: 4:00 PM - 9:00 PM</p>
                      <p className="text-[var(--brand-gold)] font-semibold opacity-100">Monday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-16"
          >
            <Link href="/page-neo/reservations">
              <motion.button
                className={`${inter.className} inline-flex items-center gap-3 px-10 py-4 rounded-full bg-[var(--brand-gold)] text-[var(--brand-espresso)] font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Make a Reservation
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx global>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 20s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
