"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, UtensilsCrossed } from "lucide-react";
import { Playfair_Display, Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { createClientHelper } from "@/lib/supabase";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400","600","700"] });
const inter = Inter({ subsets: ["latin"], weight: ["300","400","500","600"] });

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

type CategoryKey = 'appetizers' | 'seafood' | 'meats' | 'pasta' | 'desserts' | 'beverages';

type MenuByCategory = {
  [K in CategoryKey]: MenuItem[];
};

export default function DiningMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menu, setMenu] = useState<MenuByCategory>({
    appetizers: [],
    seafood: [],
    meats: [],
    pasta: [],
    desserts: [],
    beverages: []
  });

  const categories = [
    { key: 'appetizers' as const, label: 'APPETIZERS', id: 'appetizers' },
    { key: 'seafood' as const, label: 'SEAFOOD', id: 'seafood' },
    { key: 'meats' as const, label: 'MEATS', id: 'meats' },
    { key: 'pasta' as const, label: 'PASTA', id: 'pasta' },
    { key: 'desserts' as const, label: 'DESSERTS', id: 'desserts' },
    { key: 'beverages' as const, label: 'BEVERAGES', id: 'beverages' }
  ];

  // Fetch menu items and organize by category
  useEffect(() => {
    fetchMenuItems();

    // Set up Realtime subscription
    const supabase = createClientHelper();
    const channel = supabase
      .channel('dining_menu_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'menu_items'
        },
        (payload) => {
          console.log('Dining menu realtime change detected:', payload);
          fetchMenuItems();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMenuItems = async () => {
    try {
      const supabase = createClientHelper();
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('available', true)
        .eq('is_draft', false)
        .or(`(publish_at.is.null,publish_at.lte.${now})`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setMenuItems(data || []);
      organizeMenuByCategory(data || []);
    } catch (err: any) {
      console.error('Error fetching menu items:', err?.message || err);
    }
  };

  const organizeMenuByCategory = (items: MenuItem[]) => {
    const organized: MenuByCategory = {
      appetizers: [],
      seafood: [],
      meats: [],
      pasta: [],
      desserts: [],
      beverages: []
    };

    items.forEach((item) => {
      const categoryKey = item.category.toLowerCase() as CategoryKey;
      if (organized[categoryKey]) {
        organized[categoryKey].push(item);
      }
    });

    setMenu(organized);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 180; // Account for sticky header + category bar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--brand-ivory)] text-[var(--brand-espresso)] overflow-hidden relative">
      {/* Navbar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 w-full z-50 bg-[var(--brand-ivory)]/95 backdrop-blur-xl shadow-sm border-b border-[var(--brand-border)]"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex justify-between items-center">
          <Link href="/">
            <motion.div 
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <UtensilsCrossed className="text-[var(--brand-gold)]" size={28} />
              <h1 className={`${playfair.className} text-2xl md:text-3xl font-bold tracking-[0.18em] text-[var(--brand-espresso)]`}>
                THE MODERN TABLE
              </h1>
            </motion.div>
          </Link>
          
          <Link href="/">
            <motion.button
              className="group relative inline-flex items-center gap-3 px-8 py-3 rounded-full bg-[var(--brand-gold)] text-[var(--brand-espresso)] font-semibold text-base overflow-hidden shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowRight size={20} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
              <span className="relative z-10">Back to Home</span>
            </motion.button>
          </Link>
        </div>
      </motion.header>

      {/* Hero Banner */}
      <div className="relative w-full h-[60vh] md:h-[70vh] mt-[88px] overflow-hidden">
        <Image
          src="https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=2400"
          alt="Fine dining dish"
          fill
          className="object-cover"
          priority
        />
        {/* Dark to transparent gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent"></div>
        
        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`${playfair.className} text-6xl md:text-8xl font-bold text-white mb-4`}
          >
            MENU
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`${inter.className} text-xl md:text-2xl text-white/90 font-light tracking-wide`}
          >
            Explore Our Culinary Selection
          </motion.p>
        </div>
      </div>

      {/* Sticky Horizontal Category Navigation */}
      <div className="sticky top-[88px] z-40 bg-[var(--brand-sand)] border-b-2 border-[var(--brand-gold)] shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-8 justify-center items-center min-w-max">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => scrollToSection(category.id)}
                className={`${inter.className} text-sm md:text-base font-semibold text-[var(--brand-espresso)] hover:text-[var(--brand-gold)] transition-all duration-300 whitespace-nowrap tracking-wider cursor-pointer border-b-2 border-transparent hover:border-[var(--brand-gold)] pb-1`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Menu Sections */}
          {categories.map((category, categoryIndex) => (
            <section
              key={category.key}
              id={category.id}
              className="mb-24 scroll-mt-32"
            >
              {/* Section Title with Gold Underline */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2 className={`${playfair.className} text-4xl md:text-5xl font-bold text-[var(--brand-espresso)] mb-4`}>
                  {category.label}
                </h2>
                <div className="flex justify-center">
                  <div className="w-32 h-1 bg-[var(--brand-gold)]"></div>
                </div>
              </motion.div>

              {/* 3-Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {menu[category.key].map((dish, dishIndex) => (
                  <motion.div
                    key={dishIndex}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: dishIndex * 0.1 }}
                    className="bg-white rounded-lg overflow-hidden border border-[var(--brand-border)] shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    {/* Food Image */}
                    <div className="relative w-full h-56 overflow-hidden">
                      <Image
                        src={dish.image_url}
                        alt={dish.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      {/* Dish Name and Price */}
                      <div className="flex justify-between items-start mb-3">
                        <h3 className={`${playfair.className} text-2xl font-semibold text-[var(--brand-espresso)] flex-1 pr-4`}>
                          {dish.name}
                        </h3>
                        <span className={`${playfair.className} text-xl font-bold text-[var(--brand-gold)] whitespace-nowrap`}>
                          ${dish.price.toFixed(2)}
                        </span>
                      </div>

                      {/* Description */}
                      <p className={`${inter.className} text-[var(--brand-muted)] text-sm leading-relaxed`}>
                        {dish.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          ))}

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mt-16 pt-8 border-t border-[var(--brand-border)]"
          >
            <p className={`${inter.className} text-[var(--brand-muted)] text-sm`}>
              All prices subject to applicable taxes
            </p>
            <p className={`${inter.className} text-[var(--brand-muted)] text-xs mt-2`}>
              Please inform your server of any dietary restrictions or allergies
            </p>
          </motion.div>
        </div>
      </div>

      {/* Custom scrollbar styling */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
