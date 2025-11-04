"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

interface ContactFormProps {
  className?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({ className = "" }) => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);

    if (!formData.name || !formData.email || !formData.message) {
      setStatus("error");
      setMessage("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        const successData = await response.json();
        setMessage(successData.message || "Thank you for your message! We will get back to you shortly.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        const errorData = await response.json();
        setStatus("error");
        setMessage(errorData.message || "An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Contact form submission error:", error);
      setStatus("error");
      setMessage("Failed to connect to the server. Please check your connection.");
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      viewport={{ once: true, amount: 0.1 }}
      onSubmit={handleSubmit}
      className={`space-y-6 ${className}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          className={`${inter.className} w-full p-4 border border-[#E5D9CC] bg-white/50 rounded-lg focus:ring-2 focus:ring-[#D9B26D] focus:border-[#D9B26D] transition duration-300 placeholder:text-[#3B2F2F]/60`}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          className={`${inter.className} w-full p-4 border border-[#E5D9CC] bg-white/50 rounded-lg focus:ring-2 focus:ring-[#D9B26D] focus:border-[#D9B26D] transition duration-300 placeholder:text-[#3B2F2F]/60`}
        />
      </div>
      <textarea
        name="message"
        placeholder="Your Message"
        rows={5}
        value={formData.message}
        onChange={handleChange}
        required
        className={`${inter.className} w-full p-4 border border-[#E5D9CC] bg-white/50 rounded-lg focus:ring-2 focus:ring-[#D9B26D] focus:border-[#D9B26D] transition duration-300 placeholder:text-[#3B2F2F]/60`}
      ></textarea>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={status === "loading"}
        className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#D9B26D] text-white font-semibold rounded-lg shadow-lg hover:bg-[#C5A05C] transition duration-300 disabled:bg-[#D9B26D]/70 disabled:cursor-not-allowed"
      >
        {status === "loading" ? (
          "Sending..."
        ) : (
          <>
            Send Message <ArrowRight size={20} />
          </>
        )}
      </motion.button>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`p-4 rounded-lg text-center ${
              status === "success"
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
};

export default ContactForm;
