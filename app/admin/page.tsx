"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UtensilsCrossed,
  LogOut,
  Search,
  Download,
  Check,
  X,
  Calendar,
  Filter,
  Users,
  Clock,
  Mail,
  Phone,
  ChevronDown,
} from "lucide-react";
import { Playfair_Display, Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

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

export default function AdminDashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
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
  }, [router, supabase.auth]);

  // Fetch reservations
  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReservations(data || []);
      setFilteredReservations(data || []);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = [...reservations];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (res) =>
          res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          res.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((res) => res.status === statusFilter);
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter((res) => res.date >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter((res) => res.date <= dateTo);
    }

    setFilteredReservations(filtered);
  }, [searchTerm, statusFilter, dateFrom, dateTo, reservations]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      const { error } = await supabase
        .from("reservations")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setReservations((prev) =>
        prev.map((res) => (res.id === id ? { ...res, status: newStatus } : res))
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "Date", "Time", "Guests", "Status", "Special Requests"];
    const csvData = filteredReservations.map((res) => [
      res.name,
      res.email,
      res.phone,
      res.date,
      res.time,
      res.guests,
      res.status,
      res.requests || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `reservations_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
    }
  };

  const stats = {
    total: reservations.length,
    pending: reservations.filter((r) => r.status === "pending").length,
    confirmed: reservations.filter((r) => r.status === "confirmed").length,
    cancelled: reservations.filter((r) => r.status === "cancelled").length,
  };

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

          <motion.button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#3B2F2F] text-white hover:bg-[#2B1F1F] transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut size={18} />
            <span className={`${inter.className} font-medium`}>Logout</span>
          </motion.button>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total", value: stats.total, icon: Users, color: "bg-blue-500" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "bg-yellow-500" },
            { label: "Confirmed", value: stats.confirmed, icon: Check, color: "bg-green-500" },
            { label: "Cancelled", value: stats.cancelled, icon: X, color: "bg-red-500" },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
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
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/50 backdrop-blur-sm border border-[#E5D9CC] rounded-2xl p-6 shadow-lg mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Filter className="text-[#D9B26D]" size={24} />
            <h2 className={`${playfair.className} text-xl font-bold text-[#3B2F2F]`}>
              Filters
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className={`${inter.className} block text-sm font-medium text-[#3B2F2F] mb-2`}>
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D9B26D]" size={18} />
                <input
                  type="text"
                  placeholder="Name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#E5D9CC] text-[#3B2F2F] rounded-xl focus:border-[#D9B26D] focus:outline-none focus:ring-2 focus:ring-[#D9B26D]/20 transition-all text-sm"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className={`${inter.className} block text-sm font-medium text-[#3B2F2F] mb-2`}>
                Status
              </label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[#E5D9CC] text-[#3B2F2F] rounded-xl focus:border-[#D9B26D] focus:outline-none focus:ring-2 focus:ring-[#D9B26D]/20 transition-all text-sm appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D9B26D] pointer-events-none" size={18} />
              </div>
            </div>

            {/* Date From */}
            <div>
              <label className={`${inter.className} block text-sm font-medium text-[#3B2F2F] mb-2`}>
                From Date
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#E5D9CC] text-[#3B2F2F] rounded-xl focus:border-[#D9B26D] focus:outline-none focus:ring-2 focus:ring-[#D9B26D]/20 transition-all text-sm"
              />
            </div>

            {/* Date To */}
            <div>
              <label className={`${inter.className} block text-sm font-medium text-[#3B2F2F] mb-2`}>
                To Date
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#E5D9CC] text-[#3B2F2F] rounded-xl focus:border-[#D9B26D] focus:outline-none focus:ring-2 focus:ring-[#D9B26D]/20 transition-all text-sm"
              />
            </div>
          </div>

          {/* Export Button */}
          <div className="mt-6 flex justify-end">
            <motion.button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D9B26D] text-[#3B2F2F] hover:bg-[#B8995F] transition-colors font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download size={18} />
              <span className={inter.className}>Export to CSV</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/50 backdrop-blur-sm border border-[#E5D9CC] rounded-2xl shadow-lg overflow-hidden"
        >
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#D9B26D] border-t-transparent"></div>
              <p className={`${inter.className} text-[#6E6862] mt-4`}>Loading reservations...</p>
            </div>
          ) : filteredReservations.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="mx-auto text-[#D9B26D] mb-4" size={48} />
              <p className={`${playfair.className} text-xl text-[#3B2F2F] mb-2`}>
                No reservations found
              </p>
              <p className={`${inter.className} text-[#6E6862]`}>
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#3B2F2F] text-white">
                  <tr>
                    <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Name</th>
                    <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Email</th>
                    <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Phone</th>
                    <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Date</th>
                    <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Time</th>
                    <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Guests</th>
                    <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Status</th>
                    <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredReservations.map((reservation, idx) => (
                      <motion.tr
                        key={reservation.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="border-b border-[#E5D9CC] hover:bg-[#FBF7F2]/50 transition-colors"
                      >
                        <td className={`${inter.className} px-6 py-4 text-sm text-[#3B2F2F]`}>
                          {reservation.name}
                        </td>
                        <td className={`${inter.className} px-6 py-4 text-sm text-[#6E6862]`}>
                          <div className="flex items-center gap-2">
                            <Mail size={14} className="text-[#D9B26D]" />
                            {reservation.email}
                          </div>
                        </td>
                        <td className={`${inter.className} px-6 py-4 text-sm text-[#6E6862]`}>
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-[#D9B26D]" />
                            {reservation.phone}
                          </div>
                        </td>
                        <td className={`${inter.className} px-6 py-4 text-sm text-[#3B2F2F]`}>
                          {new Date(reservation.date).toLocaleDateString()}
                        </td>
                        <td className={`${inter.className} px-6 py-4 text-sm text-[#3B2F2F]`}>
                          {reservation.time}
                        </td>
                        <td className={`${inter.className} px-6 py-4 text-sm text-[#3B2F2F]`}>
                          {reservation.guests}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`${inter.className} inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              reservation.status
                            )}`}
                          >
                            {reservation.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {reservation.status !== "confirmed" && (
                              <motion.button
                                onClick={() => updateStatus(reservation.id, "confirmed")}
                                disabled={updating === reservation.id}
                                className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors disabled:opacity-50"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Confirm"
                              >
                                <Check size={16} />
                              </motion.button>
                            )}
                            {reservation.status !== "cancelled" && (
                              <motion.button
                                onClick={() => updateStatus(reservation.id, "cancelled")}
                                disabled={updating === reservation.id}
                                className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors disabled:opacity-50"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Cancel"
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

        {/* Footer */}
        <p className={`${inter.className} text-center text-[#6E6862] text-sm mt-8`}>
          © {new Date().getFullYear()} The Modern Table. All rights reserved.
        </p>
      </div>
    </div>
  );
}
