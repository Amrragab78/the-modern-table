"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { UtensilsCrossed, Menu, X, ArrowRight } from "lucide-react";
import { Playfair_Display, Inter } from "next/font/google";
import Link from "next/link";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

// Sample menu items for the dining menu section
const menuItems = [
  { name: "Grilled Salmon", desc: "Fresh Atlantic salmon with seasonal vegetables", price: "$32" },
  { name: "Ribeye Steak", desc: "12oz prime cut with garlic butter", price: "$48" },
  { name: "Lobster Risotto", desc: "Creamy arborio rice with Maine lobster", price: "$42" },
  { name: "Truffle Pasta", desc: "Handmade fettuccine with black truffle", price: "$38" },
  { name: "Pan-Seared Scallops", desc: "Diver scallops with cauliflower puree", price: "$36" },
  { name: "Duck Confit", desc: "Slow-cooked duck leg with orange glaze", price: "$40" },
];

export default function HideawayPreview() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Scroll progress for parallax effect
  const { scrollYProgress } = useScroll();

  // Disable scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileMenu]);

  const scrollToReservations = () => {
    document.getElementById('reservations')?.scrollIntoView({ behavior: 'smooth' });
    setShowMobileMenu(false);
  };

  return (
    <div className={`${inter.className} min-h-screen bg-[var(--brand-ivory)]`}>
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[var(--brand-ivory)]/95 backdrop-blur-sm border-b border-[var(--brand-border)]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex justify-between items-center">
          {/* Logo */}
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/page-neo/dining-menu">
              <span className="text-[var(--brand-espresso)] hover:text-[var(--brand-pine)] transition-colors relative group cursor-pointer">
                Dining Menu
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--brand-gold)] group-hover:w-full transition-all duration-300"></span>
              </span>
            </Link>
            <Link href="/page-neo/takeout">
              <span className="text-[var(--brand-espresso)] hover:text-[var(--brand-pine)] transition-colors relative group cursor-pointer">
                Order Online
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--brand-gold)] group-hover:w-full transition-all duration-300"></span>
              </span>
            </Link>
            <button 
              onClick={scrollToReservations}
              className="text-[var(--brand-espresso)] hover:text-[var(--brand-pine)] transition-colors relative group"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--brand-gold)] group-hover:w-full transition-all duration-300"></span>
            </button>
            <button 
              onClick={scrollToReservations}
              className="btn-primary"
            >
              Reservations
            </button>
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setShowMobileMenu(true)}
            className="md:hidden text-[var(--brand-espresso)] p-2"
            aria-label="Open Menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-[var(--brand-espresso)] md:hidden"
          >
            <button
              onClick={() => setShowMobileMenu(false)}
              className="absolute top-6 right-6 text-[var(--brand-ivory)] p-2"
              aria-label="Close Menu"
            >
              <X size={28} />
            </button>

            <div className="h-full flex flex-col items-center justify-center px-8">
              <motion.nav
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className={`${playfair.className} flex flex-col items-center gap-8`}
              >
                <Link href="/page-neo/dining-menu">
                  <motion.div
                    onClick={() => setShowMobileMenu(false)}
                    className="text-3xl font-semibold text-[var(--brand-ivory)] hover:text-[var(--brand-gold)] transition-colors cursor-pointer"
                    whileTap={{ scale: 0.95 }}
                  >
                    Dining Menu
                  </motion.div>
                </Link>
                <Link href="/page-neo/takeout">
                  <motion.div
                    onClick={() => setShowMobileMenu(false)}
                    className="text-3xl font-semibold text-[var(--brand-ivory)] hover:text-[var(--brand-gold)] transition-colors cursor-pointer"
                    whileTap={{ scale: 0.95 }}
                  >
                    Order Online
                  </motion.div>
                </Link>
                <motion.button
                  onClick={scrollToReservations}
                  className="text-3xl font-semibold text-[var(--brand-ivory)] hover:text-[var(--brand-gold)] transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  Contact
                </motion.button>
                <motion.button
                  onClick={scrollToReservations}
                  className="text-3xl font-semibold text-[var(--brand-gold)] hover:text-[var(--brand-ivory)] transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  Reservations
                </motion.button>
              </motion.nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section with Parallax */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <motion.div 
          className="absolute inset-0"
          style={{
            y: useTransform(scrollYProgress, [0, 1], [0, 300]),
            opacity: useTransform(scrollYProgress, [0, 0.5], [1, 0])
          }}
        >
          <img
            src="https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=2400"
            alt="Fine dining experience"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand-espresso)]/40 via-[var(--brand-espresso)]/30 to-[var(--brand-sand)]"></div>
        </motion.div>

        {/* Hero Content with Fade and Move Up */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            y: useTransform(scrollYProgress, [0, 0.5], [0, -100]),
            opacity: useTransform(scrollYProgress, [0, 0.3, 0.5], [1, 0.8, 0])
          }}
          className="relative z-10 text-center px-6 max-w-4xl"
        >
          <h2 className={`${playfair.className} text-5xl md:text-7xl font-bold text-white mb-6`}>
            The Modern Table
          </h2>
          <p className="text-xl md:text-2xl text-[var(--brand-ivory)] mb-8 max-w-2xl mx-auto">
            Modern American dining with warmth and elegance.
          </p>
          <motion.button
            onClick={scrollToReservations}
            className="btn-primary inline-flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reserve a Table
            <ArrowRight size={20} />
          </motion.button>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-24 px-6 paper">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Restaurant interior"
                className="w-full h-[500px] object-cover rounded-lg shadow-lg"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className={`${playfair.className} text-4xl md:text-5xl font-bold text-[var(--brand-espresso)] mb-4`}>
                About Us
              </h3>
              <div className="rule"></div>
              <p className="text-lg text-[var(--brand-muted)] leading-relaxed">
                At The Modern Table, we believe dining should feel warm, modern, and unforgettable. We focus on vibrant flavors, seasonal ingredients, and a welcoming atmosphere — whether you're celebrating or simply enjoying a night out.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dining Menu Section */}
      <section className="py-24 px-6 paper-alt">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className={`${playfair.className} text-4xl md:text-5xl font-bold text-[var(--brand-espresso)] mb-4`}>
              Dining Menu
            </h3>
            <div className="rule mx-auto"></div>
            <p className="text-lg text-[var(--brand-muted)] mt-6">
              A sample of our signature dishes
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid gap-8"
          >
            {menuItems.map((item, idx) => (
              <div
                key={idx}
                className="border-b border-[var(--brand-border)] pb-6 last:border-b-0"
              >
                <div className="flex justify-between items-baseline mb-2">
                  <h4 className={`${playfair.className} text-2xl font-semibold text-[var(--brand-espresso)]`}>
                    {item.name}
                  </h4>
                  <span className={`${playfair.className} text-xl font-semibold text-[var(--brand-gold)] ml-4`}>
                    {item.price}
                  </span>
                </div>
                <p className="text-[var(--brand-muted)] text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link href="/page-neo/dining-menu">
              <button className="btn-outline inline-flex items-center gap-2">
                View Full Menu
                <ArrowRight size={18} />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Takeout Teaser Section */}
      <section id="reservations" className="py-24 px-6 paper">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className={`${playfair.className} text-4xl md:text-5xl font-bold text-[var(--brand-espresso)] mb-4`}>
              Order Online
            </h3>
            <div className="rule mx-auto"></div>
            <p className="text-lg text-[var(--brand-muted)] mt-6 mb-10 max-w-2xl mx-auto">
              Enjoy The Modern Table experience in the comfort of your home.
            </p>
            <Link href="/page-neo/takeout">
              <motion.button
                className="btn-primary inline-flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Order Online
                <ArrowRight size={20} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="paper border-t-2 border-[var(--brand-gold)] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <UtensilsCrossed className="text-[var(--brand-gold)]" size={24} />
                <span className={`${playfair.className} text-xl font-bold text-[var(--brand-espresso)]`}>
                  The Modern Table
                </span>
              </div>
              <p className="text-[var(--brand-muted)] text-sm">
                Modern American dining with warmth and elegance
              </p>
            </div>

            <div>
              <h4 className={`${playfair.className} text-lg font-bold text-[var(--brand-espresso)] mb-4`}>
                Hours
              </h4>
              <div className="text-[var(--brand-muted)] text-sm space-y-1">
                <p>Tuesday - Thursday: 5:00 PM - 10:00 PM</p>
                <p>Friday - Saturday: 5:00 PM - 11:00 PM</p>
                <p>Sunday: 4:00 PM - 9:00 PM</p>
                <p>Monday: Closed</p>
              </div>
            </div>

            <div>
              <h4 className={`${playfair.className} text-lg font-bold text-[var(--brand-espresso)] mb-4`}>
                Contact
              </h4>
              <div className="text-[var(--brand-muted)] text-sm space-y-1">
                <p>Downtown – Your City, USA</p>
                <p className="mt-3">(555) 000-0000</p>
                <p>info@themoderntable.restaurant</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-[var(--brand-border)] text-center">
            <p className="text-[var(--brand-muted)] text-sm">
              © {new Date().getFullYear()} The Modern Table. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
