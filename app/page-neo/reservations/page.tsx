"use client";

import React from "react";
import { motion } from "framer-motion";
import { UtensilsCrossed, ArrowLeft, Phone } from "lucide-react";
import { Playfair_Display, Inter } from "next/font/google";
import Link from "next/link";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

export default function ReservationsPage() {
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
            
            <p className={`${inter.className} text-xl text-[var(--brand-muted)] mb-12 leading-relaxed max-w-2xl mx-auto`}>
              Online reservations coming soon — please call us to reserve your table
            </p>

            <motion.a
              href="tel:+15550000000"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[var(--brand-espresso)] text-[var(--brand-ivory)] font-semibold text-lg hover:bg-[var(--brand-pine)] transition-colors shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Phone size={20} />
              (555) 000-0000
            </motion.a>

            <p className={`${inter.className} text-sm text-[var(--brand-muted)] mt-8`}>
              Open Tuesday - Sunday | Closed Monday
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
