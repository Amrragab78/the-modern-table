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
    <div className={`${inter.className} min-h-screen bg-[var(--brand-ivory)]`}>
      {/* Navbar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 w-full z-50 bg-[var(--brand-ivory)]/95 backdrop-blur-sm border-b border-[var(--brand-border)]"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex justify-between items-center">
          <Link href="/page-neo/hideaway-preview">
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
          
          <Link href="/page-neo/hideaway-preview">
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
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className={`${playfair.className} text-4xl md:text-5xl font-bold text-[var(--brand-espresso)] mb-6`}>
              Contact Us
            </h1>
            <div className="rule mx-auto"></div>
            <p className={`${inter.className} text-lg text-[var(--brand-muted)] mt-6`}>
              We'd love to hear from you
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="paper-alt rounded-2xl p-8 border border-[var(--brand-border)]"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[var(--brand-sand)] flex items-center justify-center shrink-0">
                  <MapPin className="text-[var(--brand-gold)]" size={20} />
                </div>
                <div>
                  <h3 className={`${playfair.className} text-2xl font-bold text-[var(--brand-espresso)] mb-2`}>
                    Location
                  </h3>
                  <p className={`${inter.className} text-[var(--brand-muted)]`}>
                    Downtown – Your City, USA
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Phone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="paper-alt rounded-2xl p-8 border border-[var(--brand-border)]"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[var(--brand-sand)] flex items-center justify-center shrink-0">
                  <Phone className="text-[var(--brand-gold)]" size={20} />
                </div>
                <div>
                  <h3 className={`${playfair.className} text-2xl font-bold text-[var(--brand-espresso)] mb-2`}>
                    Phone
                  </h3>
                  <a 
                    href="tel:+15550000000"
                    className={`${inter.className} text-[var(--brand-muted)] hover:text-[var(--brand-gold)] transition-colors`}
                  >
                    (555) 000-0000
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="paper-alt rounded-2xl p-8 border border-[var(--brand-border)]"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[var(--brand-sand)] flex items-center justify-center shrink-0">
                  <Mail className="text-[var(--brand-gold)]" size={20} />
                </div>
                <div>
                  <h3 className={`${playfair.className} text-2xl font-bold text-[var(--brand-espresso)] mb-2`}>
                    Email
                  </h3>
                  <a 
                    href="mailto:info@themoderntable.restaurant"
                    className={`${inter.className} text-[var(--brand-muted)] hover:text-[var(--brand-gold)] transition-colors break-all`}
                  >
                    info@themoderntable.restaurant
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Hours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="paper-alt rounded-2xl p-8 border border-[var(--brand-border)]"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[var(--brand-sand)] flex items-center justify-center shrink-0">
                  <Clock className="text-[var(--brand-gold)]" size={20} />
                </div>
                <div>
                  <h3 className={`${playfair.className} text-2xl font-bold text-[var(--brand-espresso)] mb-2`}>
                    Hours
                  </h3>
                  <div className={`${inter.className} text-[var(--brand-muted)] text-sm space-y-1`}>
                    <p>Tuesday - Thursday: 5:00 PM - 10:00 PM</p>
                    <p>Friday - Saturday: 5:00 PM - 11:00 PM</p>
                    <p>Sunday: 4:00 PM - 9:00 PM</p>
                    <p className="text-[var(--brand-gold)]">Monday: Closed</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
