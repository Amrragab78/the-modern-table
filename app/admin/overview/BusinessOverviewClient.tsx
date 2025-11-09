"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  Calendar,
  CalendarClock,
  DollarSign,
  LogOut,
  TrendingUp,
} from "lucide-react";
import { Playfair_Display, Inter } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

interface Metrics {
  totalOrders: number;
  pendingOrders: number;
  fulfilledOrders: number;
  totalReservations: number;
  upcomingReservations: number;
  totalRevenue: number;
}

interface RevenueData {
  date: string;
  revenue: number;
}

interface BusinessOverviewClientProps {
  metrics: Metrics;
  revenueData: RevenueData[];
}

export default function BusinessOverviewClient({ metrics, revenueData }: BusinessOverviewClientProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const statCards = [
    {
      label: "Total Orders",
      value: metrics.totalOrders,
      icon: ShoppingCart,
      color: "from-[#D9B26D] to-[#C4A05E]",
    },
    {
      label: "Pending Orders",
      value: metrics.pendingOrders,
      icon: Clock,
      color: "from-[#D9B26D] to-[#C4A05E]",
    },
    {
      label: "Fulfilled Orders",
      value: metrics.fulfilledOrders,
      icon: CheckCircle,
      color: "from-[#D9B26D] to-[#C4A05E]",
    },
    {
      label: "Total Reservations",
      value: metrics.totalReservations,
      icon: Calendar,
      color: "from-[#D9B26D] to-[#C4A05E]",
    },
    {
      label: "Upcoming Reservations",
      value: metrics.upcomingReservations,
      icon: CalendarClock,
      color: "from-[#D9B26D] to-[#C4A05E]",
    },
    {
      label: "Total Revenue",
      value: `$${metrics.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "from-[#D9B26D] to-[#C4A05E]",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header with Logout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/70 backdrop-blur-md border border-white/30 rounded-2xl p-8 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`${playfair.className} text-4xl font-bold text-[#3B2F2F] mb-2`}>
              Business Overview
            </h1>
            <p className={`${inter.className} text-[#6E6862]`}>
              Real-time insights into your restaurant performance
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className={`${inter.className} flex items-center gap-2 bg-[#3B2F2F] text-white px-6 py-3 rounded-xl shadow-lg hover:bg-[#2E2723] transition font-semibold`}
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-white/70 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color}`}>
                      <Icon className="text-white" size={24} />
                    </div>
                    <h3 className={`${inter.className} text-sm font-medium text-[#6E6862]`}>
                      {card.label}
                    </h3>
                  </div>
                  <p className={`${playfair.className} text-4xl font-bold text-[#3B2F2F]`}>
                    {card.value}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="flex flex-wrap gap-4"
      >
        <Link href="/admin/reservations" className="flex-1 min-w-[250px]">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`${inter.className} w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#D9B26D] to-[#C4A05E] text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold`}
          >
            <Calendar size={20} />
            View Reservations
          </motion.button>
        </Link>
        
        <Link href="/admin/orders" className="flex-1 min-w-[250px]">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`${inter.className} w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#D9B26D] to-[#C4A05E] text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold`}
          >
            <ShoppingCart size={20} />
            View Orders
          </motion.button>
        </Link>
      </motion.div>

      {/* Revenue Chart */}
      {revenueData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white/70 backdrop-blur-md border border-white/30 rounded-2xl p-8 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-r from-[#D9B26D] to-[#C4A05E]">
              <TrendingUp className="text-white" size={24} />
            </div>
            <div>
              <h3 className={`${playfair.className} text-2xl font-bold text-[#3B2F2F]`}>
                Revenue Trend
              </h3>
              <p className={`${inter.className} text-sm text-[#6E6862]`}>
                Last 7 days
              </p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5D9CC" />
              <XAxis 
                dataKey="date" 
                stroke="#6E6862"
                style={{ fontSize: '12px', fontFamily: inter.style.fontFamily }}
              />
              <YAxis 
                stroke="#6E6862"
                style={{ fontSize: '12px', fontFamily: inter.style.fontFamily }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #E5D9CC',
                  borderRadius: '12px',
                  padding: '12px',
                  fontFamily: inter.style.fontFamily,
                }}
                formatter={(value: any) => [`$${value.toFixed(2)}`, 'Revenue']}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#D9B26D"
                strokeWidth={3}
                dot={{ fill: '#D9B26D', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </div>
  );
}
