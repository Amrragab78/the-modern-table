"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  ShoppingCart,
  Users,
  Package,
  MessageSquare,
  TrendingUp,
  Clock,
  DollarSign,
  LogOut,
} from "lucide-react";
import { Playfair_Display, Inter } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

interface Stats {
  reservations: number;
  orders: number;
  employees: number;
  lowStock: number;
  newMessages: number;
}

interface BusinessOverviewClientProps {
  stats: Stats;
  recentReservations: any[];
  recentOrders: any[];
}

export default function BusinessOverviewClient({
  stats,
  recentReservations,
  recentOrders,
}: BusinessOverviewClientProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const statCards = [
    {
      label: "Reservations",
      value: stats.reservations,
      icon: Calendar,
      color: "from-[#D9B26D] to-[#C4A05E]",
      bgLight: "bg-yellow-50",
      link: "/admin/reservations",
    },
    {
      label: "Orders",
      value: stats.orders,
      icon: ShoppingCart,
      color: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50",
      link: "/admin/orders",
    },
    {
      label: "Employees",
      value: stats.employees,
      icon: Users,
      color: "from-green-500 to-green-600",
      bgLight: "bg-green-50",
      link: "/admin/employees",
    },
    {
      label: "Low Stock",
      value: stats.lowStock,
      icon: Package,
      color: "from-red-500 to-red-600",
      bgLight: "bg-red-50",
      link: "/admin/supplies",
    },
    {
      label: "New Messages",
      value: stats.newMessages,
      icon: MessageSquare,
      color: "from-purple-500 to-purple-600",
      bgLight: "bg-purple-50",
      link: "/admin/contact",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-md border border-white/30 rounded-2xl p-8 shadow-lg shadow-black/5"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`${playfair.className} text-3xl md:text-4xl font-semibold text-[#3B2F2F] mb-2`}>
              Business Overview
            </h2>
            <p className={`${inter.className} text-base text-[#6E6862]`}>
              Complete analytics and recent activity across your restaurant
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D9B26D] to-[#C4A05E] text-white shadow-lg">
              <TrendingUp size={18} />
              <span className={`${inter.className} font-medium text-sm`}>Live Data</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className={`${inter.className} flex items-center gap-2 bg-[#2E2723] text-white px-5 py-2 rounded-xl shadow hover:bg-[#1f1a17] transition font-semibold`}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.link}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group relative bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all cursor-pointer overflow-hidden"
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${card.bgLight}`}>
                      <Icon className="text-[#3B2F2F]" size={24} />
                    </div>
                  </div>
                  
                  <h3 className={`${inter.className} text-sm font-medium text-[#6E6862] mb-2`}>
                    {card.label}
                  </h3>
                  
                  <p className={`${playfair.className} text-4xl font-bold text-[#3B2F2F]`}>
                    {card.value}
                  </p>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity Section */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Reservations */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className={`${playfair.className} text-2xl font-bold text-[#3B2F2F]`}>
              Recent Reservations
            </h3>
            <Link href="/admin/reservations">
              <span className={`${inter.className} text-sm text-[#D9B26D] hover:text-[#B8995F] cursor-pointer font-medium`}>
                View All →
              </span>
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentReservations.length === 0 ? (
              <div className="bg-white/40 rounded-xl p-6 text-center">
                <Calendar className="mx-auto text-[#D9B26D] mb-2" size={32} />
                <p className={`${inter.className} text-[#6E6862]`}>No recent reservations</p>
              </div>
            ) : (
              recentReservations.map((reservation: any) => (
                <motion.div
                  key={reservation.id}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="bg-white/60 backdrop-blur-md rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border border-white/30"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`${inter.className} font-semibold text-[#3B2F2F]`}>
                        {reservation.name}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className={`${inter.className} text-sm text-[#6E6862] flex items-center gap-1`}>
                          <Calendar size={14} />
                          {reservation.date}
                        </span>
                        <span className={`${inter.className} text-sm text-[#6E6862] flex items-center gap-1`}>
                          <Clock size={14} />
                          {reservation.time}
                        </span>
                      </div>
                    </div>
                    <span className={`${inter.className} text-xs px-3 py-1 rounded-full ${
                      reservation.status === 'confirmed' 
                        ? 'bg-green-100 text-green-700' 
                        : reservation.status === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {reservation.status}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className={`${playfair.className} text-2xl font-bold text-[#3B2F2F]`}>
              Recent Orders
            </h3>
            <Link href="/admin/orders">
              <span className={`${inter.className} text-sm text-[#D9B26D] hover:text-[#B8995F] cursor-pointer font-medium`}>
                View All →
              </span>
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <div className="bg-white/40 rounded-xl p-6 text-center">
                <ShoppingCart className="mx-auto text-[#D9B26D] mb-2" size={32} />
                <p className={`${inter.className} text-[#6E6862]`}>No recent orders</p>
              </div>
            ) : (
              recentOrders.map((order: any) => (
                <motion.div
                  key={order.id}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="bg-white/60 backdrop-blur-md rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border border-white/30"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`${inter.className} font-semibold text-[#3B2F2F]`}>
                        {order.customer_name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`${inter.className} text-sm text-[#6E6862] flex items-center gap-1`}>
                          <DollarSign size={14} />
                          {order.total_amount?.toFixed(2) || '0.00'}
                        </span>
                        <span className={`${inter.className} text-xs text-[#6E6862]`}>
                          • {order.payment_method || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <span className={`${inter.className} text-xs px-3 py-1 rounded-full ${
                      order.status === 'fulfilled' 
                        ? 'bg-green-100 text-green-700' 
                        : order.status === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
