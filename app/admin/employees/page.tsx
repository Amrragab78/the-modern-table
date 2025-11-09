import React from "react";
import {
  Users,
  ArrowLeft,
  UserCheck,
  UserX,
  Briefcase,
} from "lucide-react";
import { Playfair_Display, Inter } from "next/font/google";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import AdminEmployeesClient from "./AdminEmployeesClient";

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

export default async function AdminEmployeesPage() {
  // Guard against missing admin client on the server
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client is not configured");
  }

  // Fetch employees on the server
  const { data, error } = await supabaseAdmin
    .from("employees")
    .select("*");

  if (error) {
    console.error("Error fetching employees:", error);
  }

  const employees: Employee[] = data ?? [];

  // Calculate stats
  const stats = {
    total: employees.length,
    active: employees.filter((e) => e.is_active).length,
    inactive: employees.filter((e) => !e.is_active).length,
    roles: [...new Set(employees.map((e) => e.role))].length,
  };

  return (
    <div className="min-h-screen bg-[#FBF7F2]">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,178,109,0.05),transparent_50%)]"></div>

      {/* Header */}
      <header className="relative bg-white/50 backdrop-blur-sm border-b border-[#E5D9CC] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <button className="p-2 rounded-xl bg-white border border-[#E5D9CC] hover:bg-[#FBF7F2] transition-colors">
                <ArrowLeft className="text-[#D9B26D]" size={20} />
              </button>
            </Link>
            <Users className="text-[#D9B26D]" size={32} />
            <div>
              <h1 className={`${playfair.className} text-2xl font-bold text-[#3B2F2F]`}>
                Employee Management
              </h1>
              <p className={`${inter.className} text-sm text-[#6E6862]`}>
                The Modern Table
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total", value: stats.total, icon: Users, color: "bg-blue-500" },
            { label: "Active", value: stats.active, icon: UserCheck, color: "bg-green-500" },
            { label: "Inactive", value: stats.inactive, icon: UserX, color: "bg-gray-500" },
            { label: "Roles", value: stats.roles, icon: Briefcase, color: "bg-purple-500" },
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
        <AdminEmployeesClient initialEmployees={employees} />

        {/* Footer */}
        <p className={`${inter.className} text-center text-[#6E6862] text-sm mt-8`}>
          © {new Date().getFullYear()} The Modern Table. All rights reserved.
        </p>
      </div>
    </div>
  );
}
