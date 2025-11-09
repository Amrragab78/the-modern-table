"use client";

import React, { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { Playfair_Display, Inter } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, supabaseAdmin } from "@/lib/supabase";
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

export default function BusinessOverviewClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [metrics, setMetrics] = useState<Metrics>({
    totalOrders: 0,
    pendingOrders: 0,
    fulfilledOrders: 0,
    totalReservations: 0,
    upcomingReservations: 0,
    totalRevenue: 0,
  });
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(false);

      if (!supabaseAdmin) {
        throw new Error("Supabase admin client not configured");
      }

      // Fetch orders and reservations in parallel
      const [ordersRes, reservationsRes] = await Promise.all([
        supabaseAdmin.from("orders").select("*"),
        supabaseAdmin.from("reservations").select("*"),
      ]);

      if (ordersRes.error) throw ordersRes.error;
      if (reservationsRes.error) throw reservationsRes.error;

      const orders = ordersRes.data || [];
      const reservations = reservationsRes.data || [];

      // Calculate metrics
      const totalOrders = orders.length;
      const pendingOrders = orders.filter((o) => o.status === "pending").length;
      const fulfilledOrders = orders.filter((o) => o.status === "fulfilled").length;
      const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

      // Calculate upcoming reservations (next 7 days)
      const now = new Date();
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const upcomingReservations = reservations.filter((r) => {
        const resDate = new Date(r.date);
        return resDate >= now && resDate <= sevenDaysFromNow;
      }).length;

      setMetrics({
        totalOrders,
        pendingOrders,
        fulfilledOrders,
        totalReservations: reservations.length,
        upcomingReservations,
        totalRevenue,
      });

      // Calculate revenue trend for last 7 days
      const revenueByDate: Record<string, number> = {};
      const last7Days: RevenueData[] = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split("T")[0];
        revenueByDate[dateStr] = 0;
      }

      orders.forEach((order) => {
        if (order.created_at && order.total_amount) {
          const orderDate = new Date(order.created_at).toISOString().split("T")[0];
          if (revenueByDate.hasOwnProperty(orderDate)) {
            revenueByDate[orderDate] += order.total_amount;
          }
        }
      });

      Object.entries(revenueByDate).forEach(([date, revenue]) => {
        const dateObj = new Date(date);
        last7Days.push({
          date: dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          revenue,
        });
      });

      setRevenueData(last7Days);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(true);
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#D9B26D] animate-spin mx-auto mb-4" />
          <p className={`${inter.className} text-[#6E6862]`}>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-8 shadow-lg max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className={`${playfair.className} text-2xl font-bold text-[#3B2F2F] mb-2`}>
            Unable to Load Data
          </h3>
          <p className={`${inter.className} text-[#6E6862] mb-6`}>
            Please refresh the page to try again
          </p>
          <button
            onClick={fetchDashboardData}
            className={`${inter.className} px-6 py-3 bg-gradient-to-r from-[#D9B26D] to-[#C4A05E] text-white rounded-xl font-semibold hover:shadow-lg transition-all`}
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

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
