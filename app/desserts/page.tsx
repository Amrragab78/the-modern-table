"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { UtensilsCrossed, ArrowLeft } from "lucide-react";
import { Playfair_Display, Inter } from "next/font/google";
import Link from "next/link";
import { menu } from "../data/menuData";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400","600","700"] });
const inter = Inter({ subsets: ["latin"], weight: ["300","400","500","600"] });

export default function DessertsPage() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const dishes = menu.desserts;

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-black z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.03),transparent_50%)]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37] rounded-full mix-blend-multiply filter blur-[128px] opacity-5 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#B87333] rounded-full mix-blend-multiply filter blur-[128px] opacity-5 animate-blob animation-delay-2000"></div>
      </div>

      {/* Navbar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(212,175,55,0.1)] border-b border-[#D4AF37]/30"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex justify-between items-center">
          <Link href="/">
            <motion.div 
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="relative">
                <UtensilsCrossed className="text-[#D4AF37] relative z-10" size={28} />
                <div className="absolute inset-0 bg-[#D4AF37] blur-xl opacity-50"></div>
              </div>
              <h1 className={`${playfair.className} text-2xl md:text-3xl font-normal tracking-[0.2em] text-[#f3f3f3]`}>
                RESTAURANT <span className="text-[#D4AF37] font-bold">OS</span>
              </h1>
            </motion.div>
          </Link>
          <Link href="/">
            <motion.button
              className={`${inter.className} flex items-center gap-2 text-[#D4AF37] hover:text-[#FFD700] transition-colors`}
              whileHover={{ x: -5 }}
            >
              <ArrowLeft size={20} />
              Back to Home
            </motion.button>
          </Link>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className={`${inter.className} text-sm tracking-[0.3em] text-[#D4AF37] font-medium mb-4 block`}>
              MENU
            </span>
            <h1 className={`${playfair.className} text-6xl md:text-7xl font-bold mb-6`}>
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">
                Divine Desserts
              </span>
            </h1>
            <p className={`${inter.className} text-gray-400 text-lg max-w-2xl mx-auto`}>
              Sweet conclusions to perfect your dining experience
            </p>
          </motion.div>

          {/* Dishes Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dishes.map((dish, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                onHoverStart={() => setHoveredItem(i)}
                onHoverEnd={() => setHoveredItem(null)}
                className="group relative cursor-pointer"
              >
                {/* Card Container */}
                <div className="relative h-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-black border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all duration-500">
                  {/* Image Section */}
                  <div className="relative h-72 overflow-hidden">
                    <motion.img 
                      src={dish.img} 
                      alt={dish.name} 
                      loading="lazy" 
                      className="w-full h-full object-cover"
                      animate={{ scale: hoveredItem === i ? 1.1 : 1 }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#D4AF37]/90 backdrop-blur-sm">
                      <span className={`${inter.className} text-xs font-semibold text-black tracking-wide`}>
                        {dish.category}
                      </span>
                    </div>

                    {/* Hover Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/20 to-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredItem === i ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    ></motion.div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className={`${playfair.className} text-2xl font-bold text-white group-hover:text-[#D4AF37] transition-colors`}>
                        {dish.name}
                      </h3>
                      <span className={`${playfair.className} text-2xl font-bold text-[#D4AF37] shrink-0`}>
                        {dish.price}
                      </span>
                    </div>
                    <p className={`${inter.className} text-gray-400 text-sm leading-relaxed`}>
                      {dish.desc}
                    </p>

                    {/* Decorative Line */}
                    <motion.div 
                      className="h-0.5 bg-gradient-to-r from-[#D4AF37] to-transparent"
                      initial={{ width: "0%" }}
                      animate={{ width: hoveredItem === i ? "100%" : "0%" }}
                      transition={{ duration: 0.5 }}
                    ></motion.div>
                  </div>

                  {/* Glow Effect */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: "radial-gradient(circle at center, rgba(212,175,55,0.1), transparent 70%)"
                    }}
                  ></motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Global Styles */}
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
