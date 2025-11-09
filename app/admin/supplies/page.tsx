import React from "react";
import {
  Package,
  ArrowLeft,
  AlertTriangle,
  Boxes,
  TrendingUp,
} from "lucide-react";
import { Playfair_Display, Inter } from "next/font/google";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import AdminSuppliesClient from "./AdminSuppliesClient";

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

export default async function AdminSuppliesPage() {
  // Guard against missing admin client on the server
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client is not configured");
  }

  // Fetch supplies on the server
  const { data, error } = await supabaseAdmin
    .from("supplies")
    .select("*");

  if (error) {
    console.error("Error fetching supplies:", error);
  }

  const supplies: Supply[] = data ?? [];

  // Calculate stats
  const restockNeeded = supplies.filter((s) => s.quantity < s.restock_level).length;
  const categories = [...new Set(supplies.map((s) => s.category))].length;

  const stats = {
    total: supplies.length,
    restockNeeded,
    categories,
    wellStocked: supplies.filter((s) => s.quantity >= s.restock_level).length,
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
            <Package className="text-[#D9B26D]" size={32} />
            <div>
              <h1 className={`${playfair.className} text-2xl font-bold text-[#3B2F2F]`}>
                Supplies Management
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
            { label: "Total Items", value: stats.total, icon: Boxes, color: "bg-blue-500" },
            { label: "Restock Needed", value: stats.restockNeeded, icon: AlertTriangle, color: "bg-red-500" },
            { label: "Categories", value: stats.categories, icon: Package, color: "bg-purple-500" },
            { label: "Well Stocked", value: stats.wellStocked, icon: TrendingUp, color: "bg-green-500" },
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
        <AdminSuppliesClient initialSupplies={supplies} />

        {/* Footer */}
        <p className={`${inter.className} text-center text-[#6E6862] text-sm mt-8`}>
          © {new Date().getFullYear()} The Modern Table. All rights reserved.
        </p>
      </div>
    </div>
  );
}
