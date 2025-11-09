"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  ShoppingBag,
  Check,
  X,
  DollarSign,
  Mail,
  User,
  ChevronDown,
  Package,
} from "lucide-react";
import { Playfair_Display, Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  items: any[];
  total_amount: number;
  status: string;
  created_at: string;
}

interface AdminOrdersClientProps {
  initialOrders: Order[];
}

export default function AdminOrdersClient({ initialOrders }: AdminOrdersClientProps) {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(initialOrders);
  const [statusFilter, setStatusFilter] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
      }
    };
    checkAuth();
  }, [router]);

  // Apply status filter
  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.status === statusFilter));
    }
  }, [statusFilter, orders]);

  // Real-time subscription for orders
  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setOrders(data);
      }
    };

    // Set up real-time subscription
    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' }, 
        () => {
          // Refresh orders when any change occurs
          fetchOrders();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      const response = await fetch("/api/admin/update-order-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      // Update local state
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? { ...order, status: newStatus } : order))
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "fulfilled":
        return "bg-green-100 text-green-700 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
    }
  };

  const getItemsSummary = (items: any[]) => {
    if (!items || items.length === 0) return "No items";
    const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    return `${totalItems} item${totalItems !== 1 ? "s" : ""}`;
  };

  return (
    <>
      {/* Logout Button - positioned absolutely */}
      <div className="fixed top-6 right-6 z-50">
        <motion.button
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#3B2F2F] text-white hover:bg-[#2B1F1F] transition-colors shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut size={18} />
          <span className={`${inter.className} font-medium`}>Logout</span>
        </motion.button>
      </div>

      {/* Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/50 backdrop-blur-sm border border-[#E5D9CC] rounded-2xl p-6 shadow-lg mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="text-[#D9B26D]" size={24} />
            <h2 className={`${playfair.className} text-xl font-bold text-[#3B2F2F]`}>
              Filter Orders
            </h2>
          </div>

          <div className="w-64">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#E5D9CC] text-[#3B2F2F] rounded-xl focus:border-[#D9B26D] focus:outline-none focus:ring-2 focus:ring-[#D9B26D]/20 transition-all text-sm appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="fulfilled">Fulfilled</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D9B26D] pointer-events-none" size={18} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white/50 backdrop-blur-sm border border-[#E5D9CC] rounded-2xl shadow-lg overflow-hidden"
      >
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag className="mx-auto text-[#D9B26D] mb-4" size={48} />
            <p className={`${playfair.className} text-xl text-[#3B2F2F] mb-2`}>
              No orders found
            </p>
            <p className={`${inter.className} text-[#6E6862]`}>
              {statusFilter !== "all" ? "Try adjusting your filter" : "Orders will appear here once customers place them"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#3B2F2F] text-white">
                <tr>
                  <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Order ID</th>
                  <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Customer</th>
                  <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Email</th>
                  <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Items</th>
                  <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Total</th>
                  <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Date</th>
                  <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Status</th>
                  <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredOrders.map((order, idx) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="border-b border-[#E5D9CC] hover:bg-[#FBF7F2]/50 transition-colors"
                    >
                      <td className={`${inter.className} px-6 py-4 text-sm text-[#3B2F2F] font-mono`}>
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className={`${inter.className} px-6 py-4 text-sm text-[#3B2F2F]`}>
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-[#D9B26D]" />
                          {order.customer_name}
                        </div>
                      </td>
                      <td className={`${inter.className} px-6 py-4 text-sm text-[#6E6862]`}>
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-[#D9B26D]" />
                          {order.customer_email}
                        </div>
                      </td>
                      <td className={`${inter.className} px-6 py-4 text-sm text-[#3B2F2F]`}>
                        {getItemsSummary(order.items)}
                      </td>
                      <td className={`${inter.className} px-6 py-4 text-sm text-[#3B2F2F] font-semibold`}>
                        <div className="flex items-center gap-1">
                          <DollarSign size={14} className="text-[#D9B26D]" />
                          {order.total_amount.toFixed(2)}
                        </div>
                      </td>
                      <td className={`${inter.className} px-6 py-4 text-sm text-[#6E6862]`}>
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`${inter.className} inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {order.status !== "fulfilled" && (
                            <motion.button
                              onClick={() => updateStatus(order.id, "fulfilled")}
                              disabled={updating === order.id}
                              className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors disabled:opacity-50"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Mark as Fulfilled"
                            >
                              <Check size={16} />
                            </motion.button>
                          )}
                          {order.status !== "cancelled" && (
                            <motion.button
                              onClick={() => updateStatus(order.id, "cancelled")}
                              disabled={updating === order.id}
                              className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors disabled:opacity-50"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Cancel Order"
                            >
                              <X size={16} />
                            </motion.button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </>
  );
}
