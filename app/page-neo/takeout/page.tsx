"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UtensilsCrossed, ArrowLeft, ShoppingCart, Plus, Minus, X, Clock } from "lucide-react";
import { Playfair_Display, Inter } from "next/font/google";
import Link from "next/link";
import { menu, MenuItem } from "../../data/menuData";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400","600","700"] });
const inter = Inter({ subsets: ["latin"], weight: ["300","400","500","600"] });

interface CartItem extends MenuItem {
  quantity: number;
}

type PaymentMethod = 'card' | 'apple' | 'google' | null;

export default function TakeoutPage() {
  const [selectedCategory, setSelectedCategory] = useState<'appetizers' | 'seafood' | 'meats' | 'pasta' | 'desserts' | 'beverages'>('appetizers');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [checkoutData, setCheckoutData] = useState({ name: '', phone: '', pickupTime: '' });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [cardData, setCardData] = useState({ name: '', number: '', expiry: '', cvv: '' });

  const categories = [
    { key: 'appetizers' as const, label: 'Appetizers' },
    { key: 'seafood' as const, label: 'Seafood' },
    { key: 'meats' as const, label: 'Meats' },
    { key: 'pasta' as const, label: 'Pasta' },
    { key: 'desserts' as const, label: 'Desserts' },
    { key: 'beverages' as const, label: 'Beverages' }
  ];

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.name === item.name);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.name === item.name
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
    // Cart updates silently - no auto-open
  };

  const updateQuantity = (itemName: string, delta: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.name === itemName) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const removeItem = (itemName: string) => {
    setCart(prevCart => prevCart.filter(item => item.name !== itemName));
  };

  const getTotal = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutData.name || !checkoutData.phone || !checkoutData.pickupTime) {
      alert('Please fill in all required fields');
      return;
    }
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    if (paymentMethod === 'card' && (!cardData.number || !cardData.expiry || !cardData.cvv)) {
      alert('Please fill in all card details');
      return;
    }
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    alert('✅ Thank you! Your take-out order has been placed successfully. You will receive a confirmation shortly.');
    setCart([]);
    setCheckoutData({ name: '', phone: '', pickupTime: '' });
    setPaymentMethod(null);
    setCardData({ name: '', number: '', expiry: '', cvv: '' });
    setShowCart(false);
  };

  const currentItems = menu[selectedCategory];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-black z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.03),transparent_50%)]"></div>
      </div>

      {/* Navbar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(212,175,55,0.1)] border-b border-[#D4AF37]/30"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex justify-between items-center">
          <Link href="/page-neo">
            <motion.div 
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <UtensilsCrossed className="text-[#D4AF37]" size={28} />
              <h1 className={`${playfair.className} text-2xl md:text-3xl font-normal tracking-[0.2em]`}>
                RESTAURANT <span className="text-[#D4AF37] font-bold">OS</span>
              </h1>
            </motion.div>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/page-neo">
              <motion.button
                className={`${inter.className} flex items-center gap-2 text-[#D4AF37] hover:text-[#FFD700] transition-colors`}
                whileHover={{ x: -5 }}
              >
                <ArrowLeft size={20} />
                Back to Menu
              </motion.button>
            </Link>
            
            <motion.button
              onClick={() => setShowCart(!showCart)}
              className="relative p-3 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="text-[#D4AF37]" size={24} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className={`${playfair.className} text-5xl md:text-6xl font-bold mb-4`}>
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">
                Order Takeout
              </span>
            </h1>
            <p className={`${inter.className} text-gray-400 text-lg`}>
              Browse our menu and order for pickup
            </p>
          </motion.div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <motion.button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  selectedCategory === cat.key
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black'
                    : 'bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-gray-300 hover:bg-[#D4AF37]/20'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-gradient-to-br from-[#1a1a1a] to-black border border-[#D4AF37]/20 rounded-xl p-6 hover:border-[#D4AF37]/40 transition-all"
              >
                <img src={item.img} alt={item.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                <h3 className={`${playfair.className} text-xl font-bold text-white mb-2`}>{item.name}</h3>
                <p className={`${inter.className} text-gray-400 text-sm mb-4 line-clamp-2`}>{item.desc}</p>
                <div className="flex items-center justify-between">
                  <span className={`${playfair.className} text-2xl font-bold text-[#D4AF37]`}>{item.price}</span>
                  <motion.button
                    onClick={() => addToCart(item)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-semibold text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add to Order
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setShowCart(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-br from-[#1a1a1a] to-black border-l border-[#D4AF37]/30 z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`${playfair.className} text-3xl font-bold text-[#D4AF37]`}>Your Order</h2>
                  <button onClick={() => setShowCart(false)} className="text-gray-400 hover:text-white">
                    <X size={24} />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <p className="text-gray-400 text-center py-12">Your cart is empty</p>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cart.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-black/40 border border-[#D4AF37]/20 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className={`${inter.className} font-semibold text-white`}>{item.name}</h3>
                            <button onClick={() => removeItem(item.name)} className="text-gray-400 hover:text-red-500">
                              <X size={18} />
                            </button>
                          </div>
                          <p className="text-sm text-gray-400 mb-3">{item.price} each</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => updateQuantity(item.name, -1)}
                                className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#D4AF37]/30"
                              >
                                <Minus size={16} className="text-[#D4AF37]" />
                              </button>
                              <span className="text-white font-bold w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.name, 1)}
                                className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#D4AF37]/30"
                              >
                                <Plus size={16} className="text-[#D4AF37]" />
                              </button>
                            </div>
                            <span className="text-[#D4AF37] font-bold">
                              ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="border-t border-[#D4AF37]/20 pt-4 mb-6">
                      <div className="flex justify-between items-center mb-6">
                        <span className={`${playfair.className} text-2xl font-bold text-white`}>Total</span>
                        <span className={`${playfair.className} text-3xl font-bold text-[#D4AF37]`}>${getTotal()}</span>
                      </div>

                      <form onSubmit={handleCheckout} className="space-y-4">
                        <div>
                          <label className={`${inter.className} block text-sm text-gray-300 mb-2`}>Your Name *</label>
                          <input
                            type="text"
                            required
                            value={checkoutData.name}
                            onChange={(e) => setCheckoutData({...checkoutData, name: e.target.value})}
                            className="w-full p-3 bg-black/40 border border-[#D4AF37]/20 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className={`${inter.className} block text-sm text-gray-300 mb-2`}>Phone Number *</label>
                          <input
                            type="tel"
                            required
                            value={checkoutData.phone}
                            onChange={(e) => setCheckoutData({...checkoutData, phone: e.target.value})}
                            className="w-full p-3 bg-black/40 border border-[#D4AF37]/20 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                        <div>
                          <label className={`${inter.className} block text-sm text-gray-300 mb-2 flex items-center gap-2`}>
                            <Clock size={16} />
                            Pickup Time *
                          </label>
                          <input
                            type="time"
                            required
                            value={checkoutData.pickupTime}
                            onChange={(e) => setCheckoutData({...checkoutData, pickupTime: e.target.value})}
                            className="w-full p-3 bg-black/40 border border-[#D4AF37]/20 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
                          />
                        </div>

                        {/* Payment Section */}
                        <div className="mt-10 bg-black/40 border border-[#D4AF37]/30 rounded-2xl p-6 space-y-6">
                          <h3 className="text-[#D4AF37] text-xl font-semibold mb-4">Payment Method</h3>
                          <div className="flex flex-wrap gap-6 text-sm">
                            {['Card', 'Apple Pay', 'Google Pay'].map((method) => {
                              const value = method.toLowerCase().replace(' pay', '');
                              return (
                                <label key={method} className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="paymentMethod"
                                    value={value}
                                    checked={paymentMethod === value}
                                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                                    className="accent-[#D4AF37]"
                                  />
                                  <span className={paymentMethod === value ? 'text-[#FFD700]' : 'text-gray-300'}>
                                    {method}
                                  </span>
                                </label>
                              );
                            })}
                          </div>

                          {paymentMethod === 'card' && (
                            <div className="mt-8 space-y-4">
                              <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-sm text-gray-400 mb-1">Name on Card</label>
                                  <input
                                    type="text"
                                    value={cardData.name || ''}
                                    onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                                    className="w-full p-3 rounded-lg bg-black/60 border border-[#D4AF37]/30 text-white focus:border-[#FFD700] focus:outline-none"
                                    placeholder="John Doe"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm text-gray-400 mb-1">Card Number</label>
                                  <input
                                    type="text"
                                    value={cardData.number}
                                    onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                                    className="w-full p-3 rounded-lg bg-black/60 border border-[#D4AF37]/30 text-white focus:border-[#FFD700] focus:outline-none"
                                    placeholder="1234 5678 9012 3456"
                                    maxLength={19}
                                  />
                                </div>
                              </div>

                              <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-sm text-gray-400 mb-1">Expiration (MM/YY)</label>
                                  <input
                                    type="text"
                                    value={cardData.expiry}
                                    onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                                    className="w-full p-3 rounded-lg bg-black/60 border border-[#D4AF37]/30 text-white focus:border-[#FFD700] focus:outline-none"
                                    placeholder="09/27"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm text-gray-400 mb-1">CVV</label>
                                  <input
                                    type="text"
                                    value={cardData.cvv}
                                    onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                                    className="w-full p-3 rounded-lg bg-black/60 border border-[#D4AF37]/30 text-white focus:border-[#FFD700] focus:outline-none"
                                    placeholder="123"
                                    maxLength={4}
                                  />
                                </div>
                              </div>

                                <div className="pt-4">
                                  <span className="text-sm text-gray-400">Cards Accepted:</span>
                                  <div className="flex gap-3 mt-2 items-center">
                                    <img src="https://cdn.worldvectorlogo.com/logos/visa-2.svg" alt="Visa" className="h-8 w-auto" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8 w-auto" />
                                    <img src="https://cdn.worldvectorlogo.com/logos/american-express-1.svg" alt="Amex" className="h-8 w-auto" />
                                    <img src="https://cdn.worldvectorlogo.com/logos/discover-1.svg" alt="Discover" className="h-8 w-auto" />
                                  </div>
                                </div>
                            </div>
                          )}

                          <motion.button
                            type="submit"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="w-full py-5 mt-8 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-semibold text-lg"
                          >
                            Submit Order
                          </motion.button>
                        </div>
                      </form>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
