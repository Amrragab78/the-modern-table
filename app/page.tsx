"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { UtensilsCrossed, ArrowRight, Sparkles, Star, Phone, Mail, MapPin, Clock, ChevronDown, Menu, X } from "lucide-react";
import { Playfair_Display, Inter } from "next/font/google";
import Link from "next/link";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400","600","700"] });
const inter = Inter({ subsets: ["latin"], weight: ["300","400","500","600"] });

// Menu categories for navigation
const menuCategories = [
  { name: "Appetizers", path: "/appetizers", desc: "Start your culinary journey", image: "https://images.pexels.com/photos/1395319/pexels-photo-1395319.jpeg?auto=compress&cs=tinysrgb&w=1200" },
  { name: "Seafood Entrées", path: "/seafood", desc: "Fresh from the ocean", image: "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=1200" },
  { name: "Premium Meats", path: "/meats", desc: "The finest cuts", image: "https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=1200" },
  { name: "Artisan Pasta", path: "/pasta", desc: "Handcrafted with tradition", image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=1200" },
  { name: "Divine Desserts", path: "/desserts", desc: "Sweet conclusions", image: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=1200" },
  { name: "Premium Beverages", path: "/beverages", desc: "Refreshing non-alcoholic drinks", image: "https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=1200" },
  { name: "Take Out", path: "/takeout", desc: "Order online and pick up", image: "https://images.pexels.com/photos/4253312/pexels-photo-4253312.jpeg?auto=compress&cs=tinysrgb&w=1200" },
];

// Sample menu items for preview (no longer used in full menu section)
const menuItems = [
    {
      name: "Lobster Risotto",
      img: "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=1200",
      desc: "Creamy saffron risotto served with Maine lobster.",
      price: "$59",
      category: "Seafood"
    },
    {
      name: "Wagyu Beef Steak",
      img: "https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=1200",
      desc: "Prime cut wagyu with truffle butter and seasonal vegetables.",
      price: "$89",
      category: "Premium"
    },
    {
      name: "Chocolate Lava Cake",
      img: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=1200",
      desc: "Decadent dark chocolate with vanilla ice cream.",
      price: "$18",
      category: "Dessert"
    },
    {
      name: "Pan-Seared Scallops",
      img: "https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?auto=compress&cs=tinysrgb&w=1200",
      desc: "Fresh sea scallops with cauliflower puree and microgreens.",
      price: "$52",
      category: "Seafood"
    },
    {
      name: "Truffle Pasta",
      img: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=1200",
      desc: "Handmade pasta with black truffle and parmesan cream.",
      price: "$45",
      category: "Pasta"
    },
    {
      name: "Sushi Platter",
      img: "https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=1200",
      desc: "Premium selection of nigiri and sashimi with wasabi.",
      price: "$68",
      category: "Seafood"
    },
    {
      name: "Duck Confit",
      img: "https://images.pexels.com/photos/3763816/pexels-photo-3763816.jpeg?auto=compress&cs=tinysrgb&w=1200",
      desc: "Slow-cooked duck leg with orange glaze and root vegetables.",
      price: "$56",
      category: "Poultry"
    },
    {
      name: "Grilled Salmon",
      img: "https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg?auto=compress&cs=tinysrgb&w=1200",
      desc: "Atlantic salmon with lemon butter and asparagus.",
      price: "$48",
      category: "Seafood"
    },
    {
      name: "Beef Carpaccio",
      img: "https://images.pexels.com/photos/2232433/pexels-photo-2232433.jpeg?auto=compress&cs=tinysrgb&w=1200",
      desc: "Thinly sliced raw beef with arugula and parmesan.",
      price: "$38",
      category: "Appetizer"
    },
    {
      name: "Oysters Rockefeller",
      img: "https://images.pexels.com/photos/566345/pexels-photo-566345.jpeg?auto=compress&cs=tinysrgb&w=1200",
      desc: "Fresh oysters baked with herbs and breadcrumbs.",
      price: "$42",
      category: "Seafood"
    },
    {
      name: "Lamb Rack",
      img: "https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=1200",
      desc: "Herb-crusted lamb rack with rosemary jus.",
      price: "$72",
      category: "Premium"
    },
    {
      name: "Caesar Salad",
      img: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=1200",
      desc: "Classic Caesar with crispy romaine and garlic croutons.",
      price: "$22",
      category: "Salad"
    },
  ];

export default function NeoLuxuryPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [reservationData, setReservationData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '',
    requests: ''
  });
  const [currentPage, setCurrentPage] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileCategoriesDropdown, setShowMobileCategoriesDropdown] = useState(false);

  // Floating particles state
  const [particles, setParticles] = useState<{ x: number; y: number; opacity: number }[]>([]);

  // Scroll-based animation for hero background
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Generate floating particles only on client, safely
  useEffect(() => {
    if (typeof window === "undefined") return; // Prevent SSR crash
    const handle = requestAnimationFrame(() => {
      const generated = Array.from({ length: 20 }).map(() => ({
        x: Math.random() * (window.innerWidth || 1920),
        y: Math.random() * (window.innerHeight || 1080),
        opacity: Math.random() * 0.5 + 0.2,
      }));
      setParticles(generated);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all fields');
      return;
    }
    alert('Thank you for contacting us! We will get back to you shortly.');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleReservation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!reservationData.name || !reservationData.email || !reservationData.phone || 
        !reservationData.date || !reservationData.time || !reservationData.guests) {
      alert('Please fill in all required fields');
      return;
    }
    alert('Reservation request submitted! We will contact you shortly.');
    setReservationData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      guests: '',
      requests: ''
    });
  };

return (
    <div className="min-h-screen bg-[#FBF7F2] text-[#3B2F2F] overflow-hidden relative">
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[#FBF7F2]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_30%_10%,rgba(217,178,109,0.08),transparent),radial-gradient(900px_500px_at_80%_20%,rgba(31,58,52,0.05),transparent)]"></div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#FBF7F2] to-transparent"></div>
      </div>

      {currentPage === 'home' && (
        <>
      {/* Enhanced Navbar with Glassmorphism */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#FBF7F2]/90 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] border-b border-[#E5D9CC]"
            : "bg-[#FBF7F2]/70 backdrop-blur-md border-b border-[#E5D9CC]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex justify-between items-center">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="relative">
              <UtensilsCrossed className="text-[#3B2F2F] relative z-10" size={28} />
              <div className="absolute inset-0 bg-[#D9B26D] blur-xl opacity-30"></div>
            </div>
            <h1 className={`${playfair.className} text-2xl md:text-3xl font-bold tracking-[0.18em] text-[#3B2F2F]`} style={{ textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
              THE&nbsp;MODERN&nbsp;TABLE
            </h1>
          </motion.div>
          {/* Mobile Hamburger Button */}
          <motion.button
            onClick={() => setShowMobileMenu(true)}
            className="md:hidden text-[#3B2F2F] p-2"
            whileTap={{ scale: 0.95 }}
            aria-label="Open Menu"
          >
            <Menu size={28} />
          </motion.button>

          <nav className={`${inter.className} hidden md:flex gap-8 text-sm tracking-wider font-medium items-center`}>
            <Link href="/reservations">
              <motion.button
                className="relative group cursor-pointer text-[#3B2F2F]"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Reservations
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D9B26D] group-hover:w-full transition-all duration-300"></span>
              </motion.button>
            </Link>
            
            <Link href="/dining-menu">
              <motion.button
                className="relative group cursor-pointer text-[#3B2F2F]"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Dining Menu
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D9B26D] group-hover:w-full transition-all duration-300"></span>
              </motion.button>
            </Link>
            
            <Link href="/takeout">
              <motion.button
                className="relative group cursor-pointer text-[#3B2F2F]"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Order Online
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D9B26D] group-hover:w-full transition-all duration-300"></span>
              </motion.button>
            </Link>
            
            <motion.button
              onClick={() => setCurrentPage('contact')}
              className="relative group cursor-pointer text-[#3B2F2F]"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D9B26D] group-hover:w-full transition-all duration-300"></span>
            </motion.button>

            {/* Menu Dropdown - Last Item (rightmost) */}
            <div 
              className="relative"
              onMouseEnter={() => setShowMenuDropdown(true)}
              onMouseLeave={() => setShowMenuDropdown(false)}
            >
              <motion.button
                className="relative group cursor-pointer text-[#3B2F2F] flex items-center gap-1"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Menu
                <ChevronDown size={14} className={`transition-transform ${showMenuDropdown ? 'rotate-180' : ''}`} />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D9B26D] group-hover:w-full transition-all duration-300"></span>
              </motion.button>
              
              {showMenuDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 mt-2 w-56 bg-[#FBF7F2]/95 backdrop-blur-xl border border-[#E5D9CC] rounded-xl shadow-2xl overflow-hidden z-[100]"
                >
                  {menuCategories.map((category, idx) => (
                    <Link key={idx} href={category.path}>
                      <motion.div
                        className="px-4 py-3 hover:bg-[#D9B26D]/10 transition-colors cursor-pointer border-b border-[#E5D9CC] last:border-none"
                        whileHover={{ x: 5 }}
                      >
                        <div className="text-[#3B2F2F] font-medium text-sm">{category.name}</div>
                        <div className="text-[#8DA9C4] text-xs">{category.desc}</div>
                      </motion.div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Hero Section with Parallax */}
      <section id="hero" className="relative flex flex-col justify-center items-center text-center h-screen px-4 overflow-hidden">
        {/* Animated Background */}
        <motion.div 
          className="absolute inset-0"
          style={{ opacity, scale }}
        >
          <motion.img
            src="https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=2400"
            alt="Fine Dining Experience"
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 20, ease: 'linear', repeat: Infinity, repeatType: "reverse" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#051622]/40 via-[#051622]/20 to-[#051622]/10"></div>
        </motion.div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${i % 2 === 0 ? 'bg-[#E5C777]' : 'bg-[#8DA9C4]'}`}
            initial={{ x: p.x, y: p.y, opacity: p.opacity }}
            animate={{
              y: [p.y, p.y - (Math.random() * 100 + 50)],
              opacity: [p.opacity, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 max-w-5xl mx-auto"
        >
          {/* Semi-transparent dark blur overlay */}
          <div className="absolute inset-0 -inset-x-12 -inset-y-12 bg-black/20 backdrop-blur-sm rounded-3xl"></div>
          
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="inline-flex items-center gap-2 mb-6 px-6 py-2 rounded-full bg-[#051622]/30 border border-[#E5C777]/30 backdrop-blur-sm"
            >
              <Sparkles className="text-[#E5C777]" size={18} />
              <span className={`${inter.className} text-sm tracking-widest text-[#E5C777] font-medium`}>CULINARY EXCELLENCE</span>
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-6xl font-bold tracking-wide text-[#d4af37] font-playfair mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              The Modern Table
            </motion.h1>

            <motion.p
              className={`${playfair.className} text-xl md:text-2xl text-[#d4af37]/90 mb-8 font-medium italic`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Modern Taste. Classic Craft.
            </motion.p>
          </div>

          <motion.p 
            className={`${inter.className} text-gray-300 text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Where culinary artistry meets timeless elegance. Experience the extraordinary.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Link href="/reservations">
              <motion.button
                className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-full bg-[#D9B26D] text-[#3B2F2F] font-semibold text-lg overflow-hidden shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Reservations"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Reservations
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-[#8DA9C4]/0 group-hover:bg-[#8DA9C4]/20 transition-colors blur-xl"></div>
                <motion.div
                  className="absolute inset-0 shadow-[0_0_30px_rgba(141,169,196,0.4)]"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                ></motion.div>
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Enhanced Scroll Indicator */}
        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center cursor-pointer"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
        >
          <span className={`${inter.className} text-xs tracking-[0.3em] text-[#D9B26D] mb-3 font-medium`}>EXPLORE</span>
          <motion.div 
            className="w-6 h-10 border-2 border-[#D9B26D]/50 rounded-full p-1"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1 h-2 bg-[#D9B26D] rounded-full mx-auto"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            ></motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section with Enhanced Design */}
      <section id="about" className="relative py-40 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FBF7F2] via-[#FBF7F2] to-[#FBF7F2]"></div>
        
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className={`${inter.className} text-sm tracking-[0.3em] text-[#D9B26D] font-medium mb-4 block`}>DISCOVER</span>
            <h2 className={`${playfair.className} text-5xl md:text-6xl font-bold mb-6`}>
              Our <span className="bg-gradient-to-r from-[#D9B26D] to-[#D9B26D] bg-clip-text text-transparent">Story</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              <img
                src="https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=1000"
                alt="Luxury Interior"
                loading="lazy"
                className="relative rounded-2xl shadow-2xl object-cover w-full h-[500px] border border-[#D4AF37]/20"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h3 className={`${playfair.className} text-4xl font-bold text-[#D9B26D]`}>About Us</h3>
              <p className={`${inter.className} text-[#6E6862] leading-relaxed text-lg`}>
                The Modern Table is a fusion of world-class culinary artistry and cutting-edge digital design. 
                Our AI-curated menu adapts to your preferences, ensuring a dining experience unlike any other.
              </p>
              <p className={`${inter.className} text-[#6E6862] leading-relaxed text-lg`}>
                Every element — from lighting to music — evolves with your mood, creating a truly immersive fine dining atmosphere.
              </p>
              
              <div className="grid grid-cols-3 gap-6 pt-8">
                {[
                  { icon: Star, label: "Michelin Rated", value: "5★" },
                  { icon: Sparkles, label: "Years Excellence", value: "15+" },
                  { icon: UtensilsCrossed, label: "Signature Dishes", value: "50+" }
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="text-center p-4 rounded-xl bg-[#D9B26D]/10 border border-[#E5D9CC] backdrop-blur-sm"
                  >
                    <stat.icon className="text-[#D9B26D] mx-auto mb-2" size={24} />
                    <div className={`${playfair.className} text-2xl font-bold text-[#3B2F2F] mb-1`}>{stat.value}</div>
                    <div className={`${inter.className} text-xs text-[#6E6862]`}>{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Menu Categories Section */}
      <section id="menu" className="relative py-40 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FBF7F2] via-[#FBF7F2] to-[#FBF7F2]"></div>
        
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className={`${inter.className} text-sm tracking-[0.3em] text-[#D9B26D] font-medium mb-4 block`}>EXPLORE</span>
            <h2 className={`${playfair.className} text-5xl md:text-6xl font-bold mb-6`}>
              Our <span className="bg-gradient-to-r from-[#D9B26D] to-[#D9B26D] bg-clip-text text-transparent">Menu</span>
            </h2>
            <p className={`${inter.className} text-[#6E6862] text-lg max-w-2xl mx-auto`}>
              Discover our carefully curated selection across five exquisite categories
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {menuCategories.map((category, i) => (
              <Link key={i} href={category.path}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  onHoverStart={() => setHoveredItem(i)}
                  onHoverEnd={() => setHoveredItem(null)}
                  className="group relative cursor-pointer h-[400px]"
                >
                  {/* Card Container */}
                  <div className="relative h-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-black border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 transition-all duration-500">
                    {/* Image Section */}
                    <div className="relative h-full overflow-hidden">
                      <motion.img 
                        src={category.image} 
                        alt={category.name} 
                        loading="lazy" 
                        className="w-full h-full object-cover"
                        animate={{ scale: hoveredItem === i ? 1.1 : 1 }}
                        transition={{ duration: 0.6 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30"></div>
                      
                      {/* Hover Overlay */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/30 to-transparent"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredItem === i ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                      ></motion.div>

                      {/* Content */}
                      <div className="absolute inset-0 flex flex-col justify-end p-8">
                        <motion.div
                          initial={{ y: 20 }}
                          animate={{ y: hoveredItem === i ? 0 : 20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h3 className={`${playfair.className} text-3xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors`}>
                            {category.name}
                          </h3>
                          <p className={`${inter.className} text-gray-300 text-sm mb-4`}>
                            {category.desc}
                          </p>
                          <div className="flex items-center gap-2 text-[#D4AF37]">
                            <span className={`${inter.className} text-sm font-medium`}>View Menu</span>
                            <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                          </div>
                        </motion.div>
                      </div>
                    </div>

                    {/* Glow Effect */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: "radial-gradient(circle at center, rgba(212,175,55,0.15), transparent 70%)"
                      }}
                    ></motion.div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Reserve Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FBF7F2] via-[#FBF7F2] to-[#FBF7F2]"></div>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1600')] opacity-5 bg-cover bg-center"></div>
        
        <motion.div 
          className="relative max-w-4xl mx-auto text-center px-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-8 px-6 py-2 rounded-full bg-[#D9B26D]/10 border border-[#E5D9CC]"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="text-[#D9B26D]" size={18} />
            <span className={`${inter.className} text-sm tracking-widest text-[#D9B26D] font-medium`}>BOOK NOW</span>
          </motion.div>
          
          <h2 className={`${playfair.className} text-5xl md:text-6xl font-bold mb-6`}>
            Reservations <span className="bg-gradient-to-r from-[#D9B26D] to-[#D9B26D] bg-clip-text text-transparent">Experience</span>
          </h2>
          <p className={`${inter.className} text-[#6E6862] text-lg mb-12 max-w-2xl mx-auto`}>
            Experience the fusion of innovation and taste — secure your fine dining reservation today.
          </p>
          
          <Link href="/reservations">
            <motion.button 
              className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-[#D9B26D] to-[#D9B26D] text-[#3B2F2F] font-semibold text-lg overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Book Your Table"
            >
              <span className="relative z-10 flex items-center gap-3">
                Book Your Table
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#D9B26D] to-[#D9B26D]"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              ></motion.div>
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative border-t border-[#E5D9CC] py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FBF7F2] via-[#FBF7F2] to-[#FBF7F2]"></div>
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
                <UtensilsCrossed className="text-[#D9B26D]" size={24} />
                <span className={`${playfair.className} text-xl font-bold text-[#3B2F2F]`}>
                  THE MODERN TABLE
                </span>
              </div>
              <p className={`${inter.className} text-[#6E6862] text-sm leading-relaxed`}>
                Where culinary artistry meets timeless elegance.
              </p>
            </div>
            
            <div>
              <h4 className={`${playfair.className} text-lg font-bold text-[#D4AF37] mb-4`}>Quick Links</h4>
              <div className={`${inter.className} space-y-2 text-sm`}>
                {['About', 'Menu'].map(item => (
                  <button
                    key={item}
                    onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: "smooth" })}
                    className="block text-gray-400 hover:text-[#D4AF37] transition-colors"
                  >
                    {item}
                  </button>
                ))}
                {['Reservations', 'Contact'].map(item => (
                  <button
                    key={item}
                    onClick={() => setCurrentPage(item.toLowerCase())}
                    className="block text-[#6E6862] hover:text-[#D9B26D] transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className={`${playfair.className} text-lg font-bold text-[#D4AF37] mb-4`}>Contact</h4>
              <div className={`${inter.className} space-y-3 text-sm text-[#6E6862]`}>
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-[#D9B26D] mt-1 shrink-0" />
                  <span>—<br/>—</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-[#D9B26D] shrink-0" />
                  <span>—</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-[#D9B26D] shrink-0" />
                  <span>contact@themoderntable.example</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className={`${playfair.className} text-lg font-bold text-[#D4AF37] mb-4`}>Hours</h4>
              <div className={`${inter.className} space-y-2 text-sm text-gray-400`}>
                <div className="flex items-start gap-2">
                  <Clock size={16} className="text-[#D4AF37] mt-1 shrink-0" />
                  <div>
                    <p>Mon - Thu: 5:00 PM - 10:00 PM</p>
                    <p>Fri - Sat: 5:00 PM - 11:00 PM</p>
                    <p>Sunday: 4:00 PM - 9:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-[#E5D9CC] text-center">
            <p className={`${inter.className} text-sm text-[#6E6862]`}>
              © {new Date().getFullYear()} The Modern Table. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      </>
      )}

      {/* Reservation Page */}
      {currentPage === 'reserve' && (
        <div className="min-h-screen flex flex-col relative">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img 
              src="https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=2400" 
              alt="Restaurant Interior" 
              className="w-full h-full object-cover opacity-20"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(251,247,242,0.9)] to-[rgba(251,247,242,0.98)]"></div>
          
          <div className="relative flex-1 flex items-center justify-center py-24 px-6">
            <div className="w-full max-w-3xl">
              <motion.button 
                onClick={() => setCurrentPage('home')}
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#D9B26D] text-[#3B2F2F] font-semibold text-base overflow-hidden shadow-lg mb-6"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Back to Home"
              >
                <ArrowRight size={20} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                <span className="relative z-10">Back to Home</span>
                <motion.div
                  className="absolute inset-0 shadow-[0_0_20px_rgba(217,178,109,0.4)]"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                ></motion.div>
              </motion.button>
            
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className={`${playfair.className} text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#D9B26D] to-[#B8995F] bg-clip-text text-transparent`}>
                  Reserve Your Table
                </h1>
                <p className={`${inter.className} text-[#2F3D36] mb-8 text-lg`}>
                  Fill out the form below to secure your reservation at The Modern Table.
                </p>
                
                <div className="bg-white/50 backdrop-blur-sm border border-[#E5D9CC] rounded-2xl p-8 md:p-12 shadow-lg">
                  <form onSubmit={handleReservation} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className={`${inter.className} block text-sm font-medium text-[#3B2F2F] mb-2`}>Full Name *</label>
                        <input 
                          type="text" 
                          required
                          value={reservationData.name}
                          onChange={(e) => setReservationData({...reservationData, name: e.target.value})}
                          className="w-full p-4 bg-white border border-[#E5D9CC] text-[#3B2F2F] rounded-xl focus:border-[#D9B26D] focus:outline-none focus:ring-2 focus:ring-[#D9B26D]/20 transition-all placeholder:text-[#3B2F2F]/40"
                          placeholder="John Doe"
                          aria-label="Full Name"
                        />
                      </div>
                      
                      <div>
                        <label className={`${inter.className} block text-sm font-medium text-[#3B2F2F] mb-2`}>Email Address *</label>
                        <input 
                          type="email" 
                          required
                          value={reservationData.email}
                          onChange={(e) => setReservationData({...reservationData, email: e.target.value})}
                          className="w-full p-4 bg-white border border-[#E5D9CC] text-[#3B2F2F] rounded-xl focus:border-[#D9B26D] focus:outline-none focus:ring-2 focus:ring-[#D9B26D]/20 transition-all placeholder:text-[#3B2F2F]/40"
                          placeholder="john@example.com"
                          aria-label="Email Address"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className={`${inter.className} block text-sm font-medium text-[#3B2F2F] mb-2`}>Phone Number *</label>
                      <input 
                        type="tel" 
                        required
                        value={reservationData.phone}
                        onChange={(e) => setReservationData({...reservationData, phone: e.target.value})}
                        className="w-full p-4 bg-white border border-[#E5D9CC] text-[#3B2F2F] rounded-xl focus:border-[#D9B26D] focus:outline-none focus:ring-2 focus:ring-[#D9B26D]/20 transition-all placeholder:text-[#3B2F2F]/40"
                        placeholder="+1 (555) 000-0000"
                        aria-label="Phone Number"
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <label className={`${inter.className} block text-sm font-medium text-[#3B2F2F] mb-2`}>Date *</label>
                        <input 
                          type="date" 
                          required
                          value={reservationData.date}
                          onChange={(e) => setReservationData({...reservationData, date: e.target.value})}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full p-4 bg-white border border-[#E5D9CC] text-[#3B2F2F] rounded-xl focus:border-[#D9B26D] focus:outline-none focus:ring-2 focus:ring-[#D9B26D]/20 transition-all"
                          aria-label="Reservation Date"
                        />
                      </div>
                      
                      <div>
                        <label className={`${inter.className} block text-sm font-medium text-[#3B2F2F] mb-2`}>Time *</label>
                        <input 
                          type="time" 
                          required
                          value={reservationData.time}
                          onChange={(e) => setReservationData({...reservationData, time: e.target.value})}
                          className="w-full p-4 bg-white border border-[#E5D9CC] text-[#3B2F2F] rounded-xl focus:border-[#D9B26D] focus:outline-none focus:ring-2 focus:ring-[#D9B26D]/20 transition-all"
                          aria-label="Reservation Time"
                        />
                      </div>
                      
                      <div>
                        <label className={`${inter.className} block text-sm font-medium text-[#3B2F2F] mb-2`}>Guests *</label>
                        <select 
                          required
                          value={reservationData.guests}
                          onChange={(e) => setReservationData({...reservationData, guests: e.target.value})}
                          className="w-full p-4 bg-white border border-[#E5D9CC] text-[#3B2F2F] rounded-xl focus:border-[#D9B26D] focus:outline-none focus:ring-2 focus:ring-[#D9B26D]/20 transition-all"
                          aria-label="Number of Guests"
                        >
                          <option value="">Select</option>
                          {[1, 2, 3, 4, 5, 6].map(num => (
                            <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                          ))}
                          <option value="7+">7+ Guests</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className={`${inter.className} block text-sm font-medium text-[#3B2F2F] mb-2`}>Special Requests (Optional)</label>
                      <textarea 
                        value={reservationData.requests}
                        onChange={(e) => setReservationData({...reservationData, requests: e.target.value})}
                        className="w-full p-4 bg-white border border-[#E5D9CC] text-[#3B2F2F] rounded-xl focus:border-[#D9B26D] focus:outline-none focus:ring-2 focus:ring-[#D9B26D]/20 min-h-[120px] transition-all resize-none placeholder:text-[#3B2F2F]/40"
                        placeholder="Any dietary restrictions or special occasions?"
                        aria-label="Special Requests"
                      />
                    </div>
                    
                    <motion.button 
                      type="submit"
                      className="w-full py-5 rounded-full bg-[#D9B26D] text-[#3B2F2F] font-semibold text-lg shadow-[0_4px_20px_rgba(217,178,109,0.4)] hover:shadow-[0_8px_30px_rgba(217,178,109,0.6)] transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      aria-label="Confirm Reservation"
                    >
                      Confirm Reservation
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Page */}
      {currentPage === 'contact' && (
        <div className="min-h-screen flex flex-col relative">
          {/* Warm Cream Background */}
          <div className="absolute inset-0 bg-[#FBF7F2]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,178,109,0.05),transparent_50%)]"></div>
          
          <div className="relative flex-1 flex items-center justify-center py-24 px-6">
            <div className="w-full max-w-5xl">
              <motion.button 
                onClick={() => setCurrentPage('home')}
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#D9B26D] text-[#3B2F2F] font-semibold text-base overflow-hidden shadow-lg mb-6"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Back to Home"
              >
                <ArrowRight size={20} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                <span className="relative z-10">Back to Home</span>
                <motion.div
                  className="absolute inset-0 shadow-[0_0_20px_rgba(217,178,109,0.4)]"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                ></motion.div>
              </motion.button>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className={`${playfair.className} text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#D9B26D] to-[#B8995F] bg-clip-text text-transparent`}>
                  Get In Touch
                </h1>
                <p className={`${inter.className} text-[#3B2F2F] mb-8 text-lg`}>
                  We'd love to hear from you. Reach out to The Modern Table.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Contact Information */}
                  <div className="bg-white/50 backdrop-blur-sm border border-[#E5D9CC] rounded-2xl p-8 shadow-lg">
                    <h2 className={`${playfair.className} text-2xl font-bold text-[#3B2F2F] mb-6`}>Contact Information</h2>
                    <div className="space-y-6">
                      {[
                        { icon: MapPin, title: "Address", content: ["Downtown – Your City, USA"] },
                        { icon: Phone, title: "Phone", content: ["(555) 000-0000"] },
                        { icon: Mail, title: "Email", content: ["contact@themoderntable.example"] },
                        { icon: Clock, title: "Hours", content: ["Tue - Thu: 5PM - 10PM", "Fri - Sat: 5PM - 11PM", "Sun: 4PM - 9PM", "Mon: Closed"] }
                      ].map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: idx * 0.1 }}
                          className="flex gap-4"
                        >
                          <div className="shrink-0">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D9B26D] to-[#B8995F] flex items-center justify-center shadow-md">
                              <item.icon className="text-white" size={20} />
                            </div>
                          </div>
                          <div>
                            <h3 className={`${inter.className} text-[#3B2F2F] font-semibold mb-1`}>{item.title}</h3>
                            {item.content.map((line, i) => (
                              <p key={i} className={`${inter.className} text-[#3B2F2F]/70 text-sm leading-relaxed`}>{line}</p>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Contact Form */}
                  <div className="bg-white/50 backdrop-blur-sm border border-[#E5D9CC] rounded-2xl p-8 shadow-lg">
                    <h2 className={`${playfair.className} text-2xl font-bold text-[#3B2F2F] mb-6`}>Send a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label className={`${inter.className} block text-sm font-medium text-[#3B2F2F] mb-2`}>Your Name *</label>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full p-4 bg-white border border-[#E5D9CC] text-[#3B2F2F] rounded-xl focus:border-[#D9B26D] focus:outline-none focus:ring-2 focus:ring-[#D9B26D]/20 transition-all placeholder:text-[#3B2F2F]/40"
                          placeholder="John Doe"
                          aria-label="Your Name"
                        />
                      </div>
                      
                      <div>
                        <label className={`${inter.className} block text-sm font-medium text-[#3B2F2F] mb-2`}>Your Email *</label>
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full p-4 bg-white border border-[#E5D9CC] text-[#3B2F2F] rounded-xl focus:border-[#D9B26D] focus:outline-none focus:ring-2 focus:ring-[#D9B26D]/20 transition-all placeholder:text-[#3B2F2F]/40"
                          placeholder="john@example.com"
                          aria-label="Your Email"
                        />
                      </div>
                      
                      <div>
                        <label className={`${inter.className} block text-sm font-medium text-[#3B2F2F] mb-2`}>Your Message *</label>
                        <textarea 
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          className="w-full p-4 bg-white border border-[#E5D9CC] text-[#3B2F2F] rounded-xl focus:border-[#D9B26D] focus:outline-none focus:ring-2 focus:ring-[#D9B26D]/20 min-h-[150px] transition-all resize-none placeholder:text-[#3B2F2F]/40"
                          placeholder="Tell us how we can help you..."
                          aria-label="Your Message"
                        />
                      </div>
                      
                      <motion.button 
                        type="submit"
                        className="w-full py-5 rounded-full bg-[#D9B26D] text-[#3B2F2F] font-semibold text-lg shadow-[0_4px_20px_rgba(217,178,109,0.4)] hover:shadow-[0_8px_30px_rgba(217,178,109,0.6)] transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        aria-label="Send Message"
                      >
                        Send Message
                      </motion.button>
                    </form>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-[#FBF7F2] md:hidden"
          >
            {/* Close Button */}
            <motion.button
              onClick={() => setShowMobileMenu(false)}
              className="absolute top-6 right-6 text-[#3B2F2F] p-2"
              whileTap={{ scale: 0.95 }}
              aria-label="Close Menu"
            >
              <X size={32} />
            </motion.button>

            {/* Menu Content */}
            <div className="h-full flex flex-col items-center justify-center px-8 overflow-y-auto py-20">
              <motion.nav
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className={`${playfair.className} flex flex-col items-center gap-8 w-full max-w-md`}
              >
                {/* Home */}
                <motion.button
                  onClick={() => {
                    setCurrentPage('home');
                    setShowMobileMenu(false);
                  }}
                  className="text-4xl font-bold text-[#3B2F2F] hover:text-[#D9B26D] transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  Home
                </motion.button>

                {/* Dining Menu */}
                <Link href="/dining-menu" className="w-full text-center">
                  <motion.div
                    className="text-4xl font-bold text-[#3B2F2F] hover:text-[#D9B26D] transition-colors"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Dining Menu
                  </motion.div>
                </Link>

                {/* Order Online */}
                <Link href="/takeout" className="w-full text-center">
                  <motion.div
                    className="text-4xl font-bold text-[#3B2F2F] hover:text-[#D9B26D] transition-colors"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Order Online
                  </motion.div>
                </Link>

                {/* Reservations */}
                <Link href="/reservations" className="w-full text-center">
                  <motion.div
                    className="text-4xl font-bold text-[#3B2F2F] hover:text-[#D9B26D] transition-colors"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Reservations
                  </motion.div>
                </Link>

                {/* Contact */}
                <motion.button
                  onClick={() => {
                    setCurrentPage('contact');
                    setShowMobileMenu(false);
                  }}
                  className="text-4xl font-bold text-[#3B2F2F] hover:text-[#D9B26D] transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  Contact
                </motion.button>

                {/* Menu Categories Dropdown */}
                <div className="w-full">
                  <motion.button
                    onClick={() => setShowMobileCategoriesDropdown(!showMobileCategoriesDropdown)}
                    className="text-4xl font-bold text-[#3B2F2F] hover:text-[#D9B26D] transition-colors flex items-center justify-center gap-2 w-full"
                    whileTap={{ scale: 0.95 }}
                  >
                    Menu Categories
                    <ChevronDown
                      size={28}
                      className={`transition-transform ${showMobileCategoriesDropdown ? 'rotate-180' : ''}`}
                    />
                  </motion.button>

                  <AnimatePresence>
                    {showMobileCategoriesDropdown && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`${inter.className} mt-6 space-y-4 overflow-hidden`}
                      >
                        {menuCategories.map((category, idx) => (
                          <Link key={idx} href={category.path}>
                            <motion.div
                              onClick={() => setShowMobileMenu(false)}
                              className="text-xl text-[#8DA9C4] hover:text-[#D9B26D] transition-colors text-center py-2"
                              whileTap={{ scale: 0.95 }}
                            >
                              {category.name}
                            </motion.div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
