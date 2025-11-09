"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UtensilsCrossed, Mail, Lock, ArrowRight } from "lucide-react";
import { Playfair_Display, Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/admin");
      }
    };
    checkUser();
  }, [router, supabase.auth]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        router.push("/admin");
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF7F2] flex items-center justify-center px-4">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,178,109,0.05),transparent_50%)]"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <UtensilsCrossed className="text-[#D9B26D]" size={32} />
            <h1 className={`${playfair.className} text-2xl font-bold text-[#3B2F2F]`}>
              THE MODERN TABLE
            </h1>
          </motion.div>
          <p className={`${inter.className} text-[#6E6862] text-sm`}>Admin Dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/50 backdrop-blur-sm border border-[#E5D9CC] rounded-2xl p-8 shadow-lg">
          <h2 className={`${playfair.className} text-3xl font-bold text-[#3B2F2F] mb-6 text-center`}>
            Sign In
          </h2>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
            >
              <p className={`${inter.className} text-red-600 text-sm`}>{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className={`${inter.className} block text-sm font-medium text-[#3B2F2F] mb-2`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D9B26D]" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-[#E5D9CC] text-[#3B2F2F] rounded-xl focus:border-[#D9B26D] focus:outline-none focus:ring-2 focus:ring-[#D9B26D]/20 transition-all placeholder:text-[#3B2F2F]/40"
                  placeholder="admin@themoderntable.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className={`${inter.className} block text-sm font-medium text-[#3B2F2F] mb-2`}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D9B26D]" size={20} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-[#E5D9CC] text-[#3B2F2F] rounded-xl focus:border-[#D9B26D] focus:outline-none focus:ring-2 focus:ring-[#D9B26D]/20 transition-all placeholder:text-[#3B2F2F]/40"
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="group relative w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#D9B26D] text-[#3B2F2F] font-semibold text-base overflow-hidden shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              <span className="relative z-10 flex items-center gap-3">
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
              </span>
              {!loading && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#D9B26D] to-[#B8995F]"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                ></motion.div>
              )}
            </motion.button>
          </form>
        </div>

        {/* Footer */}
        <p className={`${inter.className} text-center text-[#6E6862] text-sm mt-6`}>
          © {new Date().getFullYear()} The Modern Table. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
