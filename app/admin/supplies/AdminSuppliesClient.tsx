"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  ChevronDown,
  Edit2,
  Trash2,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { Playfair_Display, Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

interface Supply {
  id: string;
  item_name: string;
  category: string;
  quantity: number;
  unit: string;
  supplier?: string;
  last_ordered?: string;
  restock_level: number;
}

interface AdminSuppliesClientProps {
  initialSupplies: Supply[];
}

export default function AdminSuppliesClient({ initialSupplies }: AdminSuppliesClientProps) {
  const router = useRouter();
  const [supplies, setSupplies] = useState<Supply[]>(initialSupplies);
  const [filteredSupplies, setFilteredSupplies] = useState<Supply[]>(initialSupplies);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [supplierFilter, setSupplierFilter] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    let filtered = [...supplies];
    
    if (categoryFilter !== "all") {
      filtered = filtered.filter((s) => s.category === categoryFilter);
    }
    
    if (supplierFilter !== "all") {
      filtered = filtered.filter((s) => s.supplier === supplierFilter);
    }
    
    setFilteredSupplies(filtered);
  }, [categoryFilter, supplierFilter, supplies]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this supply item?")) return;
    
    setUpdating(id);
    try {
      const response = await fetch("/api/admin/delete-supply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error("Failed to delete supply");

      setSupplies((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Error deleting supply:", error);
      alert("Failed to delete supply");
    } finally {
      setUpdating(null);
    }
  };

  const needsRestock = (supply: Supply) => supply.quantity < supply.restock_level;

  const uniqueCategories = ["all", ...new Set(supplies.map((s) => s.category))];
  const uniqueSuppliers = ["all", ...new Set(supplies.map((s) => s.supplier).filter(Boolean) as string[])];

  return (
    <>
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/50 backdrop-blur-sm border border-[#E5D9CC] rounded-2xl p-6 shadow-lg mb-8"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className={`${playfair.className} text-xl font-bold text-[#3B2F2F]`}>
            Filter Supplies
          </h2>
          <div className="flex gap-3">
            <div className="w-48">
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[#E5D9CC] text-[#3B2F2F] rounded-xl focus:border-[#D9B26D] focus:outline-none focus:ring-2 focus:ring-[#D9B26D]/20 transition-all text-sm appearance-none cursor-pointer"
                >
                  {uniqueCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "all" ? "All Categories" : cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D9B26D] pointer-events-none" size={18} />
              </div>
            </div>
            <div className="w-48">
              <div className="relative">
                <select
                  value={supplierFilter}
                  onChange={(e) => setSupplierFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[#E5D9CC] text-[#3B2F2F] rounded-xl focus:border-[#D9B26D] focus:outline-none focus:ring-2 focus:ring-[#D9B26D]/20 transition-all text-sm appearance-none cursor-pointer"
                >
                  {uniqueSuppliers.map((sup) => (
                    <option key={sup} value={sup}>
                      {sup === "all" ? "All Suppliers" : sup}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D9B26D] pointer-events-none" size={18} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white/50 backdrop-blur-sm border border-[#E5D9CC] rounded-2xl shadow-lg overflow-hidden"
      >
        {filteredSupplies.length === 0 ? (
          <div className="p-12 text-center">
            <p className={`${playfair.className} text-xl text-[#3B2F2F]`}>No supplies found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#3B2F2F] text-white">
                <tr>
                  <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Item Name</th>
                  <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Category</th>
                  <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Quantity</th>
                  <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Restock Level</th>
                  <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Supplier</th>
                  <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Last Ordered</th>
                  <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredSupplies.map((supply, idx) => (
                    <motion.tr
                      key={supply.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className={`border-b border-[#E5D9CC] hover:bg-[#FBF7F2]/50 transition-colors ${
                        needsRestock(supply) ? "bg-red-50/50" : ""
                      }`}
                    >
                      <td className={`${inter.className} px-6 py-4 text-sm text-[#3B2F2F] font-medium`}>
                        <div className="flex items-center gap-2">
                          {needsRestock(supply) && (
                            <AlertTriangle size={16} className="text-red-500" />
                          )}
                          {supply.item_name}
                        </div>
                      </td>
                      <td className={`${inter.className} px-6 py-4 text-sm text-[#6E6862] capitalize`}>
                        {supply.category}
                      </td>
                      <td className={`${inter.className} px-6 py-4 text-sm ${needsRestock(supply) ? "text-red-600 font-bold" : "text-[#3B2F2F]"}`}>
                        {supply.quantity} {supply.unit}
                      </td>
                      <td className={`${inter.className} px-6 py-4 text-sm text-[#6E6862]`}>
                        {supply.restock_level} {supply.unit}
                      </td>
                      <td className={`${inter.className} px-6 py-4 text-sm text-[#6E6862]`}>
                        {supply.supplier || "-"}
                      </td>
                      <td className={`${inter.className} px-6 py-4 text-sm text-[#6E6862]`}>
                        {supply.last_ordered ? new Date(supply.last_ordered).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <motion.button
                            onClick={() => alert("Edit functionality coming soon")}
                            className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Edit Quantity"
                          >
                            <Edit2 size={16} />
                          </motion.button>
                          <motion.button
                            onClick={() => alert("Restock functionality coming soon")}
                            className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Restock"
                          >
                            <RefreshCw size={16} />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(supply.id)}
                            disabled={updating === supply.id}
                            className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors disabled:opacity-50"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </motion.button>
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
