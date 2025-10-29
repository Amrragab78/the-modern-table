"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, UtensilsCrossed } from "lucide-react";
import { Playfair_Display, Inter } from "next/font/google";
import Link from "next/link";
import { menu } from "../../data/menuData";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400","600","700"] });
const inter = Inter({ subsets: ["latin"], weight: ["300","400","500","600"] });

export default function DiningMenuPage() {
  const categories = [
    { key: 'appetizers' as const, label: 'Appetizers' },
    { key: 'seafood' as const, label: 'Seafood' },
    { key: 'meats' as const, label: 'Meats' },
    { key: 'pasta' as const, label: 'Pasta' },
    { key: 'desserts' as const, label: 'Desserts' },
    { key: 'beverages' as const, label: 'Beverages' }
  ];

  return (
    <div className="min-h-screen bg-[#F2F2F2] text-[#051622] overflow-hidden relative">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#F2F2F2] via-white to-[#F2F2F2] z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(229,199,119,0.05),transparent_50%)]"></div>
      </div>

      {/* Navbar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 w-full z-50 bg-[#051622]/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(229,199,119,0.1)] border-b border-[#E5C777]/30"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex justify-between items-center">
          <Link href="/page-neo">
            <motion.div 
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <UtensilsCrossed className="text-[#E5C777]" size={28} />
              <h1 className={`${playfair.className} text-2xl md:text-3xl font-normal tracking-[0.2em] text-[#F2F2F2]`}>
                RESTAURANT <span className="text-[#E5C777] font-bold">OS</span>
              </h1>
            </motion.div>
          </Link>
          
          <Link href="/page-neo">
            <motion.button
              className={`${inter.className} flex items-center gap-2 text-[#E5C777] hover:text-[#8DA9C4] transition-colors`}
              whileHover={{ x: -5 }}
            >
              <ArrowLeft size={20} />
              Back to Menu
            </motion.button>
          </Link>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className={`${playfair.className} text-6xl md:text-7xl font-bold mb-4 text-[#051622]`}>
              Dining Menu
            </h1>
            <div className="flex justify-center mt-6">
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[#E5C777] to-transparent"></div>
            </div>
          </motion.div>

          {/* Categories */}
          {categories.map((category, categoryIndex) => (
            <motion.section
              key={category.key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              className="mb-16"
            >
              {/* Category Title */}
              <div className="text-center mb-10">
                <h2 className={`${playfair.className} text-4xl md:text-5xl font-bold text-[#051622] mb-4`}>
                  {category.label}
                </h2>
                <div className="flex justify-center">
                  <div className="w-24 h-0.5 bg-[#E5C777]"></div>
                </div>
              </div>

              {/* Dishes */}
              <div className="space-y-10">
                {menu[category.key].map((dish, dishIndex) => (
                  <motion.div
                    key={dishIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: categoryIndex * 0.1 + dishIndex * 0.05 }}
                    className="border-b border-[#E5C777]/20 pb-8 last:border-0"
                  >
                    {/* Dish Name and Price */}
                    <div className="flex justify-between items-start mb-4">
                      <h3 className={`${playfair.className} text-2xl md:text-3xl font-semibold text-[#051622] text-center flex-1`}>
                        {dish.name}
                      </h3>
                      <span className={`${playfair.className} text-2xl md:text-3xl font-bold text-[#051622] ml-6 whitespace-nowrap`}>
                        {dish.price}
                      </span>
                    </div>

                    {/* Description */}
                    <p className={`${inter.className} text-[#051622]/70 text-center text-sm md:text-base leading-relaxed max-w-3xl mx-auto`}>
                      {dish.desc}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Section Divider */}
              {categoryIndex < categories.length - 1 && (
                <div className="flex justify-center mt-16">
                  <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-[#E5C777]/30 to-transparent"></div>
                </div>
              )}
            </motion.section>
          ))}

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center mt-16 pt-8 border-t border-[#E5C777]/20"
          >
            <p className={`${inter.className} text-[#051622]/60 text-sm`}>
              All prices subject to applicable taxes
            </p>
            <p className={`${inter.className} text-[#051622]/50 text-xs mt-2`}>
              Please inform your server of any dietary restrictions or allergies
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
