"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Mail,
  Phone,
  ChevronDown,
  Power,
  Edit2,
  Trash2,
  DollarSign,
} from "lucide-react";
import { Playfair_Display, Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

interface Employee {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: string;
  salary?: number;
  hire_date: string;
  is_active: boolean;
}

interface AdminEmployeesClientProps {
  initialEmployees: Employee[];
}

export default function AdminEmployeesClient({ initialEmployees }: AdminEmployeesClientProps) {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(initialEmployees);
  const [roleFilter, setRoleFilter] = useState("all");
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

  // Apply role filter
  useEffect(() => {
    if (roleFilter === "all") {
      setFilteredEmployees(employees);
    } else {
      setFilteredEmployees(employees.filter((emp) => emp.role === roleFilter));
    }
  }, [roleFilter, employees]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    setUpdating(id);
    try {
      const response = await fetch("/api/admin/toggle-employee-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active: !currentStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      setEmployees((prev) =>
        prev.map((emp) => (emp.id === id ? { ...emp, is_active: !currentStatus } : emp))
      );
    } catch (error) {
      console.error("Error toggling status:", error);
      alert("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;
    
    setUpdating(id);
    try {
      const response = await fetch("/api/admin/delete-employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error("Failed to delete employee");

      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee");
    } finally {
      setUpdating(null);
    }
  };

  const uniqueRoles = ["all", ...new Set(employees.map((e) => e.role))];

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
        <div className="flex items-center justify-between">
          <h2 className={`${playfair.className} text-xl font-bold text-[#3B2F2F]`}>
            Filter by Role
          </h2>
          <div className="w-64">
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#E5D9CC] text-[#3B2F2F] rounded-xl focus:border-[#D9B26D] focus:outline-none focus:ring-2 focus:ring-[#D9B26D]/20 transition-all text-sm appearance-none cursor-pointer"
              >
                {uniqueRoles.map((role) => (
                  <option key={role} value={role}>
                    {role === "all" ? "All Roles" : role}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D9B26D] pointer-events-none" size={18} />
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
        {filteredEmployees.length === 0 ? (
          <div className="p-12 text-center">
            <p className={`${playfair.className} text-xl text-[#3B2F2F]`}>No employees found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#3B2F2F] text-white">
                <tr>
                  <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Name</th>
                  <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Email</th>
                  <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Role</th>
                  <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Salary</th>
                  <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Hire Date</th>
                  <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Status</th>
                  <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredEmployees.map((employee, idx) => (
                    <motion.tr
                      key={employee.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="border-b border-[#E5D9CC] hover:bg-[#FBF7F2]/50 transition-colors"
                    >
                      <td className={`${inter.className} px-6 py-4 text-sm text-[#3B2F2F]`}>
                        {employee.full_name}
                      </td>
                      <td className={`${inter.className} px-6 py-4 text-sm text-[#6E6862]`}>
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-[#D9B26D]" />
                          {employee.email}
                        </div>
                      </td>
                      <td className={`${inter.className} px-6 py-4 text-sm text-[#3B2F2F] capitalize`}>
                        {employee.role}
                      </td>
                      <td className={`${inter.className} px-6 py-4 text-sm text-[#3B2F2F]`}>
                        {employee.salary ? `$${employee.salary.toLocaleString()}` : "-"}
                      </td>
                      <td className={`${inter.className} px-6 py-4 text-sm text-[#6E6862]`}>
                        {new Date(employee.hire_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`${inter.className} inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                            employee.is_active
                              ? "bg-green-100 text-green-700 border-green-300"
                              : "bg-gray-100 text-gray-700 border-gray-300"
                          }`}
                        >
                          {employee.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <motion.button
                            onClick={() => toggleActive(employee.id, employee.is_active)}
                            disabled={updating === employee.id}
                            className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                              employee.is_active
                                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title={employee.is_active ? "Deactivate" : "Activate"}
                          >
                            <Power size={16} />
                          </motion.button>
                          <motion.button
                            onClick={() => alert("Edit functionality coming soon")}
                            className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(employee.id)}
                            disabled={updating === employee.id}
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
