"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Mail,
  Phone,
  ChevronDown,
  Eye,
  MessageCircle,
  Archive,
  X,
} from "lucide-react";
import { Playfair_Display, Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

interface AdminContactClientProps {
  initialMessages: ContactMessage[];
}

export default function AdminContactClient({ initialMessages }: AdminContactClientProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>(initialMessages);
  const [statusFilter, setStatusFilter] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

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
      setFilteredMessages(messages);
    } else {
      setFilteredMessages(messages.filter((msg) => msg.status === statusFilter));
    }
  }, [statusFilter, messages]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      const response = await fetch("/api/admin/update-contact-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      // Update local state
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, status: newStatus } : msg))
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const openReplyModal = (message: ContactMessage) => {
    setSelectedMessage(message);
    setShowReplyModal(true);
    // Mark as read when opened
    if (message.status === "new") {
      updateStatus(message.id, "read");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "new":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "read":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "replied":
        return "bg-green-100 text-green-700 border-green-300";
      case "archived":
        return "bg-gray-100 text-gray-700 border-gray-300";
      default:
        return "bg-blue-100 text-blue-700 border-blue-300";
    }
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
            <Mail className="text-[#D9B26D]" size={24} />
            <h2 className={`${playfair.className} text-xl font-bold text-[#3B2F2F]`}>
              Filter Messages
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
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
                <option value="archived">Archived</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D9B26D] pointer-events-none" size={18} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Messages Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white/50 backdrop-blur-sm border border-[#E5D9CC] rounded-2xl shadow-lg overflow-hidden"
      >
        {filteredMessages.length === 0 ? (
          <div className="p-12 text-center">
            <Mail className="mx-auto text-[#D9B26D] mb-4" size={48} />
            <p className={`${playfair.className} text-xl text-[#3B2F2F] mb-2`}>
              No messages found
            </p>
            <p className={`${inter.className} text-[#6E6862]`}>
              {statusFilter !== "all" ? "Try adjusting your filter" : "Messages will appear here"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#3B2F2F] text-white">
                <tr>
                  <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Name</th>
                  <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Email</th>
                  <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Subject</th>
                  <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Status</th>
                  <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Created At</th>
                  <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredMessages.map((message, idx) => (
                    <motion.tr
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="border-b border-[#E5D9CC] hover:bg-[#FBF7F2]/50 transition-colors"
                    >
                      <td className={`${inter.className} px-6 py-4 text-sm text-[#3B2F2F]`}>
                        {message.name}
                      </td>
                      <td className={`${inter.className} px-6 py-4 text-sm text-[#6E6862]`}>
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-[#D9B26D]" />
                          {message.email}
                        </div>
                      </td>
                      <td className={`${inter.className} px-6 py-4 text-sm text-[#3B2F2F]`}>
                        {message.subject}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`${inter.className} inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            message.status
                          )}`}
                        >
                          {message.status}
                        </span>
                      </td>
                      <td className={`${inter.className} px-6 py-4 text-sm text-[#6E6862]`}>
                        {new Date(message.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {message.status === "new" && (
                            <motion.button
                              onClick={() => updateStatus(message.id, "read")}
                              disabled={updating === message.id}
                              className="p-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors disabled:opacity-50"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Mark as Read"
                            >
                              <Eye size={16} />
                            </motion.button>
                          )}
                          <motion.button
                            onClick={() => openReplyModal(message)}
                            disabled={updating === message.id}
                            className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors disabled:opacity-50"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Reply"
                          >
                            <MessageCircle size={16} />
                          </motion.button>
                          {message.status !== "archived" && (
                            <motion.button
                              onClick={() => updateStatus(message.id, "archived")}
                              disabled={updating === message.id}
                              className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Archive"
                            >
                              <Archive size={16} />
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

      {/* Reply Modal */}
      <AnimatePresence>
        {showReplyModal && selectedMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowReplyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`${playfair.className} text-2xl font-bold text-[#3B2F2F]`}>
                  Message Details
                </h3>
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`${inter.className} text-sm font-medium text-[#6E6862]`}>From:</label>
                  <p className={`${inter.className} text-[#3B2F2F] font-medium`}>{selectedMessage.name}</p>
                </div>
                <div>
                  <label className={`${inter.className} text-sm font-medium text-[#6E6862]`}>Email:</label>
                  <p className={`${inter.className} text-[#3B2F2F]`}>{selectedMessage.email}</p>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <label className={`${inter.className} text-sm font-medium text-[#6E6862]`}>Phone:</label>
                    <p className={`${inter.className} text-[#3B2F2F]`}>{selectedMessage.phone}</p>
                  </div>
                )}
                <div>
                  <label className={`${inter.className} text-sm font-medium text-[#6E6862]`}>Subject:</label>
                  <p className={`${inter.className} text-[#3B2F2F] font-medium`}>{selectedMessage.subject}</p>
                </div>
                <div>
                  <label className={`${inter.className} text-sm font-medium text-[#6E6862]`}>Message:</label>
                  <p className={`${inter.className} text-[#3B2F2F] whitespace-pre-wrap`}>{selectedMessage.message}</p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    updateStatus(selectedMessage.id, "replied");
                    setShowReplyModal(false);
                  }}
                  className={`${inter.className} flex-1 px-6 py-3 bg-[#D9B26D] text-[#3B2F2F] rounded-xl font-medium hover:bg-[#B8995F] transition-colors`}
                >
                  Mark as Replied
                </button>
                <button
                  onClick={() => setShowReplyModal(false)}
                  className={`${inter.className} px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors`}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
