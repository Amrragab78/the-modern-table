"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UtensilsCrossed, ArrowLeft, Loader2 } from "lucide-react";
import { Playfair_Display, Inter } from "next/font/google";
import Link from "next/link";
import { createClientHelper } from "@/lib/supabase";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  available: boolean;
  created_at: string;
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClientHelper();
      
      const { data, error: fetchError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('available', true)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setMenuItems(data || []);
    } catch (err: any) {
      console.error('Error fetching menu items:', err);
      setError('Failed to load menu items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${inter.className} min-h-screen bg-[#FBF7F2]`}>
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,178,109,0.05),transparent_50%)]"></div>

      {/* Navbar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-[#FBF7F2]/95 backdrop-blur-sm border-b border-[#E5D9CC] shadow-sm z-10"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex justify-between items-center">
          <Link href="/">
            <motion.div 
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <UtensilsCrossed className="text-[#D9B26D]" size={24} />
              <h1 className={`${playfair.className} text-xl md:text-2xl font-bold text-[#3B2F2F]`} style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                THE MODERN TABLE
              </h1>
            </motion.div>
          </Link>
          
          <Link href="/">
            <motion.button
              className="flex items-center gap-2 text-[#3B2F2F] hover:text-[#D9B26D] transition-colors"
              whileHover={{ x: -5 }}
            >
              <ArrowLeft size={20} />
              <span className="hidden md:inline">Back to Home</span>
            </motion.button>
          </Link>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative pt-16 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className={`${playfair.className} text-4xl md:text-5xl font-bold text-[#3B2F2F] mb-4`}>
              Our Menu
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#D9B26D] to-transparent mx-auto mb-6"></div>
            <p className="text-lg text-[#6E6862] max-w-2xl mx-auto">
              Discover our carefully curated selection of dishes, crafted with the finest ingredients
            </p>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="text-[#D9B26D] animate-spin mb-4" size={48} />
              <p className={`${inter.className} text-[#6E6862]`}>Loading menu items...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center"
            >
              <p className={`${inter.className} text-red-800 mb-4`}>{error}</p>
              <button
                onClick={fetchMenuItems}
                className="px-6 py-3 bg-[#D9B26D] text-white rounded-lg hover:bg-[#C4A05E] transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && !error && menuItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <UtensilsCrossed className="text-[#D9B26D] mx-auto mb-4 opacity-30" size={64} />
              <p className={`${inter.className} text-[#6E6862] text-xl`}>
                No menu items available at the moment.
              </p>
            </motion.div>
          )}

          {/* Menu Grid */}
          {!loading && !error && menuItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white/50 backdrop-blur-sm border border-[#E5D9CC] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-[#D9B26D]/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className={`${playfair.className} text-2xl font-bold text-[#3B2F2F] mb-2`}>
                      {item.name}
                    </h3>
                    
                    <p className={`${inter.className} text-[#6E6862] text-sm mb-4 line-clamp-3`}>
                      {item.description}
                    </p>

                    {/* Price */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#E5D9CC]">
                      <span className={`${playfair.className} text-3xl font-bold text-[#D9B26D]`}>
                        ${item.price.toFixed(2)}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-[#3B2F2F] text-white rounded-lg hover:bg-[#D9B26D] transition-colors text-sm font-medium"
                      >
                        Order Now
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-[#E5D9CC] bg-[#FBF7F2]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className={`${inter.className} text-[#6E6862] text-sm`}>
            © {new Date().getFullYear()} The Modern Table. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
