"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  UtensilsCrossed,
  Check,
  X,
  Calendar,
  Users,
  Clock,
  ShoppingCart,
  Package,
  MessageSquare,
} from "lucide-react";
import { Playfair_Display, Inter } from "next/font/google";
import Link from "next/link";
import AdminDashboardClient from "./AdminDashboardClient";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  status: string;
  requests?: string;
  created_at: string;
}

interface Stats {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
}

interface AdminDashboardWrapperProps {
  reservations: Reservation[];
  stats: Stats;
}

export default function AdminDashboardWrapper({ reservations, stats }: AdminDashboardWrapperProps) {
  return (
    <div className="min-h-screen bg-[#FBF7F2]">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,178,109,0.05),transparent_50%)]"></div>

      {/* Header */}
      <header className="relative bg-white/50 backdrop-blur-sm border-b border-[#E5D9CC] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <UtensilsCrossed className="text-[#D9B26D]" size={32} />
            <div>
              <h1 className={`${playfair.className} text-2xl font-bold text-[#3B2F2F]`}>
                Admin Dashboard
              </h1>
              <p className={`${inter.className} text-sm text-[#6E6862]`}>
                The Modern Table
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/admin/orders">
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D9B26D] text-[#3B2F2F] hover:bg-[#B8995F] transition-colors">
                <ShoppingCart size={18} />
                <span className={`${inter.className} font-medium`}>Orders</span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Management Dashboard Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className={`${playfair.className} text-2xl font-bold text-[#3B2F2F] mb-6 text-center`}>
            Admin Management Dashboard
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Link href="/admin">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex flex-col items-center gap-3 p-6 bg-white/50 backdrop-blur-sm border-2 border-[#D9B26D] rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                  <Calendar className="text-white" size={24} />
                </div>
                <span className={`${inter.className} font-semibold text-[#3B2F2F] text-center`}>
                  Reservations
                </span>
              </motion.div>
            </Link>

            <Link href="/admin/orders">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex flex-col items-center gap-3 p-6 bg-white/50 backdrop-blur-sm border-2 border-[#E5D9CC] rounded-2xl shadow-lg hover:shadow-xl hover:border-[#D9B26D] transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
                  <ShoppingCart className="text-white" size={24} />
                </div>
                <span className={`${inter.className} font-semibold text-[#3B2F2F] text-center`}>
                  Orders
                </span>
              </motion.div>
            </Link>

            <Link href="/admin/contact">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex flex-col items-center gap-3 p-6 bg-white/50 backdrop-blur-sm border-2 border-[#E5D9CC] rounded-2xl shadow-lg hover:shadow-xl hover:border-[#D9B26D] transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center">
                  <MessageSquare className="text-white" size={24} />
                </div>
                <span className={`${inter.className} font-semibold text-[#3B2F2F] text-center`}>
                  Contact
                </span>
              </motion.div>
            </Link>

            <Link href="/admin/employees">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex flex-col items-center gap-3 p-6 bg-white/50 backdrop-blur-sm border-2 border-[#E5D9CC] rounded-2xl shadow-lg hover:shadow-xl hover:border-[#D9B26D] transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center">
                  <Users className="text-white" size={24} />
                </div>
                <span className={`${inter.className} font-semibold text-[#3B2F2F] text-center`}>
                  Employees
                </span>
              </motion.div>
            </Link>

            <Link href="/admin/supplies">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex flex-col items-center gap-3 p-6 bg-white/50 backdrop-blur-sm border-2 border-[#E5D9CC] rounded-2xl shadow-lg hover:shadow-xl hover:border-[#D9B26D] transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center">
                  <Package className="text-white" size={24} />
                </div>
                <span className={`${inter.className} font-semibold text-[#3B2F2F] text-center`}>
                  Supplies
                </span>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Reservations Section Heading */}
        <h3 className={`${playfair.className} text-xl font-bold text-[#3B2F2F] mb-6`}>
          Reservations Overview
        </h3>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total", value: stats.total, icon: Users, color: "bg-blue-500" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "bg-yellow-500" },
            { label: "Confirmed", value: stats.confirmed, icon: Check, color: "bg-green-500" },
            { label: "Cancelled", value: stats.cancelled, icon: X, color: "bg-red-500" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/50 backdrop-blur-sm border border-[#E5D9CC] rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${inter.className} text-sm text-[#6E6862] mb-1`}>{stat.label}</p>
                  <p className={`${playfair.className} text-3xl font-bold text-[#3B2F2F]`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                  <stat.icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Client-side interactive component for filters and table */}
        <AdminDashboardClient initialReservations={reservations} />

        {/* Footer */}
        <p className={`${inter.className} text-center text-[#6E6862] text-sm mt-8`}>
          © {new Date().getFullYear()} The Modern Table. All rights reserved.
        </p>
      </div>
    </div>
  );
}
