"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaXTwitter, FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa6";
import { Playfair_Display, Inter } from "next/font/google";
import { UtensilsCrossed, Phone, Mail, MapPin, Clock } from "lucide-react";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

export default function Footer() {
  const socialLinks = [
    {
      icon: FaXTwitter,
      href: "https://twitter.com",
      label: "X (Twitter)",
    },
    {
      icon: FaFacebookF,
      href: "https://facebook.com",
      label: "Facebook",
    },
    {
      icon: FaInstagram,
      href: "https://instagram.com",
      label: "Instagram",
    },
    {
      icon: FaYoutube,
      href: "https://youtube.com",
      label: "YouTube",
    },
  ];

  return (
    <footer className="bg-[#1F1F1F] text-white py-16 relative z-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <UtensilsCrossed className="text-[#D9B26D]" size={28} />
              <h3 className={`${playfair.className} text-2xl font-bold text-white`}>
                The Modern Table
              </h3>
            </div>
            <p className={`${inter.className} text-gray-400 text-sm leading-relaxed`}>
              Experience the fusion of innovation and taste. Where culinary tradition meets modern elegance.
            </p>
            {/* Social Media */}
            <div className="flex items-center gap-4 pt-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-10 h-10 rounded-full bg-[#2A2A2A] flex items-center justify-center text-gray-400 hover:text-[#D9B26D] hover:bg-[#333333] transition-all duration-300"
                  >
                    <Icon size={18} />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`${playfair.className} text-lg font-semibold mb-6 text-[#D9B26D]`}>
              Quick Links
            </h4>
            <ul className={`${inter.className} space-y-3`}>
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-[#D9B26D] transition-colors duration-300 text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/dining-menu"
                  className="text-gray-400 hover:text-[#D9B26D] transition-colors duration-300 text-sm"
                >
                  Dining Menu
                </Link>
              </li>
              <li>
                <Link
                  href="/reservations"
                  className="text-gray-400 hover:text-[#D9B26D] transition-colors duration-300 text-sm"
                >
                  Reservations
                </Link>
              </li>
              <li>
                <Link
                  href="/takeout"
                  className="text-gray-400 hover:text-[#D9B26D] transition-colors duration-300 text-sm"
                >
                  Order Online
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-[#D9B26D] transition-colors duration-300 text-sm"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Menu Categories */}
          <div>
            <h4 className={`${playfair.className} text-lg font-semibold mb-6 text-[#D9B26D]`}>
              Our Menu
            </h4>
            <ul className={`${inter.className} space-y-3`}>
              <li>
                <Link
                  href="/appetizers"
                  className="text-gray-400 hover:text-[#D9B26D] transition-colors duration-300 text-sm"
                >
                  Appetizers
                </Link>
              </li>
              <li>
                <Link
                  href="/seafood"
                  className="text-gray-400 hover:text-[#D9B26D] transition-colors duration-300 text-sm"
                >
                  Seafood
                </Link>
              </li>
              <li>
                <Link
                  href="/meats"
                  className="text-gray-400 hover:text-[#D9B26D] transition-colors duration-300 text-sm"
                >
                  Premium Meats
                </Link>
              </li>
              <li>
                <Link
                  href="/pasta"
                  className="text-gray-400 hover:text-[#D9B26D] transition-colors duration-300 text-sm"
                >
                  Artisan Pasta
                </Link>
              </li>
              <li>
                <Link
                  href="/desserts"
                  className="text-gray-400 hover:text-[#D9B26D] transition-colors duration-300 text-sm"
                >
                  Desserts
                </Link>
              </li>
              <li>
                <Link
                  href="/beverages"
                  className="text-gray-400 hover:text-[#D9B26D] transition-colors duration-300 text-sm"
                >
                  Beverages
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div>
            <h4 className={`${playfair.className} text-lg font-semibold mb-6 text-[#D9B26D]`}>
              Contact & Hours
            </h4>
            <ul className={`${inter.className} space-y-4`}>
              <li className="flex items-start gap-3">
                <MapPin className="text-[#D9B26D] mt-1 flex-shrink-0" size={18} />
                <span className="text-gray-400 text-sm">
                  Downtown District<br />Your City, USA
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-[#D9B26D] flex-shrink-0" size={18} />
                <a
                  href="tel:+15550000000"
                  className="text-gray-400 hover:text-[#D9B26D] transition-colors text-sm"
                >
                  (555) 000-0000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-[#D9B26D] flex-shrink-0" size={18} />
                <a
                  href="mailto:contact@themoderntable.com"
                  className="text-gray-400 hover:text-[#D9B26D] transition-colors text-sm"
                >
                  contact@themoderntable.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="text-[#D9B26D] mt-1 flex-shrink-0" size={18} />
                <div className="text-gray-400 text-sm">
                  <p>Tue - Thu: 5PM - 10PM</p>
                  <p>Fri - Sat: 5PM - 11PM</p>
                  <p>Sun: 4PM - 9PM</p>
                  <p>Mon: Closed</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className={`${inter.className} text-gray-500 text-sm text-center md:text-left`}>
              © {new Date().getFullYear()} The Modern Table. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/admin/login"
                className={`${inter.className} text-sm text-gray-500 hover:text-[#D9B26D] transition-colors duration-300`}
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
