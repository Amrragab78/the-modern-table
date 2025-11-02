"use client";

import React, { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { Playfair_Display, Inter } from "next/font/google";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400","600","700"] });
const inter = Inter({ subsets: ["latin"], weight: ["300","400","500","600"] });

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');
  const customerName = searchParams.get('name');
  const paymentType = searchParams.get('payment_type');
  const [loading, setLoading] = useState(true);

  const isOfflinePayment = paymentType === 'offline';

  useEffect(() => {
    // Simulate loading for better UX
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-black z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.03),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#D4AF37] mx-auto"></div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-8 flex justify-center"
            >
              <CheckCircle className="text-green-500" size={80} />
            </motion.div>

            <h1 className={`${playfair.className} text-5xl md:text-6xl font-bold mb-4`}>
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">
                Order Confirmed!
              </span>
            </h1>

            {customerName && (
              <p className={`${inter.className} text-xl text-gray-300 mb-4`}>
                Thank you, {decodeURIComponent(customerName)}!
              </p>
            )}

            <p className={`${inter.className} text-gray-400 mb-8`}>
              {isOfflinePayment 
                ? "Your order has been confirmed. Please bring payment when you pick up your order."
                : "Your payment was processed successfully. We'll start preparing your order right away."}
            </p>

            {orderId && (
              <div className="bg-[#1a1a1a] border border-[#D4AF37]/20 rounded-xl p-6 mb-8">
                <p className={`${inter.className} text-sm text-gray-400 mb-2`}>Order #:</p>
                <p className={`${inter.className} text-[#D4AF37] font-mono text-lg font-bold`}>
                  {orderId}
                </p>
              </div>
            )}

            <div className="bg-[#1a1a1a] border border-[#D4AF37]/20 rounded-xl p-6 mb-8">
              <h3 className={`${playfair.className} text-2xl font-bold text-white mb-4`}>
                What's Next?
              </h3>
              <ul className={`${inter.className} text-left text-gray-300 space-y-3`}>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>You'll receive an email confirmation shortly</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>We'll send you updates on your order status</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Your food will be ready at your selected pickup time</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`${inter.className} px-8 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-semibold text-lg flex items-center gap-2 justify-center`}
                >
                  Back to Menu
                </motion.button>
              </Link>

              <Link href="/takeout">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`${inter.className} px-8 py-4 rounded-xl bg-[#1a1a1a] border border-[#D4AF37]/30 text-[#D4AF37] font-semibold text-lg flex items-center gap-2 justify-center hover:bg-[#D4AF37]/10 transition-colors`}
                >
                  <ArrowLeft size={20} />
                  Order Again
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#D4AF37]"></div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
