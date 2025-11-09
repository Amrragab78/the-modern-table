"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  Clock,
  Check,
  X,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { Playfair_Display, Inter } from "next/font/google";
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
  const summaryCards = [
    {
      title: "Total Reservations",
      value: stats.total,
      change: "+12%",
      icon: Calendar,
      color: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50",
    },
    {
      title: "Pending",
      value: stats.pending,
      change: `${stats.pending} waiting`,
      icon: Clock,
      color: "from-yellow-500 to-yellow-600",
      bgLight: "bg-yellow-50",
    },
    {
      title: "Confirmed",
      value: stats.confirmed,
      change: `${Math.round((stats.confirmed / stats.total) * 100 || 0)}% rate`,
      icon: Check,
      color: "from-green-500 to-green-600",
      bgLight: "bg-green-50",
    },
    {
      title: "Cancelled",
      value: stats.cancelled,
      change: `${Math.round((stats.cancelled / stats.total) * 100 || 0)}% rate`,
      icon: X,
      color: "from-red-500 to-red-600",
      bgLight: "bg-red-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-md border border-white/30 rounded-2xl p-8 shadow-lg shadow-black/5"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`${playfair.className} text-2xl md:text-3xl font-semibold text-[#3B2F2F] mb-2`}>
              Dashboard Overview
            </h2>
            <p className={`${inter.className} text-base text-[#6E6862]`}>
              Track your restaurant's reservations and performance metrics
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D9B26D] to-[#C4A05E] text-white shadow-lg">
            <TrendingUp size={18} />
            <span className={`${inter.className} font-medium text-sm`}>Live Data</span>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group relative bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all cursor-pointer overflow-hidden"
            >
              {/* Gradient Overlay on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
              
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${card.bgLight}`}>
                    <Icon className="text-[#3B2F2F]" size={24} />
                  </div>
                  <ArrowUpRight className="text-[#D9B26D] opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                </div>
                
                <h3 className={`${inter.className} text-sm font-medium text-[#6E6862] mb-2`}>
                  {card.title}
                </h3>
                
                <div className="flex items-end justify-between">
                  <p className={`${playfair.className} text-4xl font-bold text-[#3B2F2F]`}>
                    {card.value}
                  </p>
                  <span className={`${inter.className} text-xs text-[#6E6862] bg-[#E5D9CC]/30 px-2 py-1 rounded-lg`}>
                    {card.change}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Reservations Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className={`${playfair.className} text-xl font-bold text-[#3B2F2F] mb-6`}>
          Recent Reservations
        </h3>
        <AdminDashboardClient initialReservations={reservations} />
      </motion.div>
    </div>
  );
}
