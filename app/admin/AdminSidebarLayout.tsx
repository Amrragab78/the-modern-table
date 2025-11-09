"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Calendar,
  ShoppingCart,
  MessageSquare,
  Users,
  Package,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Playfair_Display, Inter } from "next/font/google";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

interface AdminSidebarLayoutProps {
  children: React.ReactNode;
  adminEmail: string;
}

export default function AdminSidebarLayout({ children, adminEmail }: AdminSidebarLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/admin", exactMatch: true },
    { icon: Calendar, label: "Reservations", href: "/admin/reservations" },
    { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
    { icon: MessageSquare, label: "Contact", href: "/admin/contact" },
    { icon: Users, label: "Employees", href: "/admin/employees" },
    { icon: Package, label: "Supplies", href: "/admin/supplies" },
  ];

  const isActive = (href: string, exactMatch?: boolean) => {
    if (exactMatch) {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#FBF7F2]">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,178,109,0.03),transparent_50%)] pointer-events-none"></div>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0, width: sidebarOpen ? 280 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 h-full bg-gradient-to-b from-[#F9F4EE] to-[#FBF7F2] border-r border-[#E5D9CC] shadow-xl z-50 hidden md:block"
      >
        <div className="flex flex-col h-full">
          {/* Logo & Toggle */}
          <div className="flex items-center justify-between p-6 border-b border-[#E5D9CC]">
            <AnimatePresence mode="wait">
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D9B26D] to-[#B8995F] flex items-center justify-center">
                    <span className={`${playfair.className} text-white font-bold text-lg`}>TM</span>
                  </div>
                  <div>
                    <h2 className={`${playfair.className} text-[#3B2F2F] font-bold text-lg leading-tight`}>
                      The Modern
                    </h2>
                    <p className={`${inter.className} text-[#6E6862] text-xs`}>Admin Panel</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-[#E5D9CC]/30 transition-colors"
            >
              {sidebarOpen ? (
                <ChevronLeft className="text-[#D9B26D]" size={20} />
              ) : (
                <ChevronRight className="text-[#D9B26D]" size={20} />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exactMatch);
              
              return (
                <Link key={item.label} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                      active
                        ? "bg-gradient-to-r from-[#D9B26D] to-[#C4A05E] text-white shadow-lg shadow-[#D9B26D]/30"
                        : "text-[#3B2F2F] hover:bg-white/50"
                    }`}
                  >
                    <Icon size={22} />
                    <AnimatePresence mode="wait">
                      {sidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className={`${inter.className} font-medium text-sm`}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-[#E5D9CC]">
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-4 w-full px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 transition-all"
            >
              <LogOut size={22} />
              <AnimatePresence mode="wait">
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className={`${inter.className} font-medium text-sm`}
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-[#E5D9CC] z-40 shadow-sm">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D9B26D] to-[#B8995F] flex items-center justify-center">
              <span className={`${playfair.className} text-white font-bold text-lg`}>TM</span>
            </div>
            <h2 className={`${playfair.className} text-[#3B2F2F] font-bold text-lg`}>
              The Modern Table
            </h2>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-[#E5D9CC]/30"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-black/50 z-40 mt-[73px]"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="md:hidden fixed left-0 top-[73px] bottom-0 w-80 bg-gradient-to-b from-[#F9F4EE] to-[#FBF7F2] border-r border-[#E5D9CC] shadow-xl z-50 overflow-y-auto"
            >
              <nav className="p-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href, item.exactMatch);
                  
                  return (
                    <Link key={item.label} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                      <div
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                          active
                            ? "bg-gradient-to-r from-[#D9B26D] to-[#C4A05E] text-white shadow-lg"
                            : "text-[#3B2F2F] hover:bg-white/50"
                        }`}
                      >
                        <Icon size={22} />
                        <span className={`${inter.className} font-medium`}>{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-[#E5D9CC]">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 w-full px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700"
                >
                  <LogOut size={22} />
                  <span className={`${inter.className} font-medium`}>Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 pt-20 md:pt-0 ${
          sidebarOpen ? "md:ml-[280px]" : "md:ml-20"
        }`}
      >
        {/* Top Header Bar */}
        <div className="hidden md:block sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#E5D9CC] shadow-sm">
          <div className="px-8 py-6 flex items-center justify-between">
            <div>
              <h1 className={`${playfair.className} text-3xl font-semibold text-[#3B2F2F]`}>
                Admin Dashboard
              </h1>
              <p className={`${inter.className} text-sm text-[#6E6862] mt-1`}>
                Welcome back, {adminEmail}
              </p>
            </div>
            <div className="w-16 h-1 rounded-full bg-gradient-to-r from-[#D9B26D] to-transparent"></div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
