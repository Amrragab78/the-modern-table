"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UtensilsCrossed, ArrowLeft, ShoppingCart, Plus, Minus, X, Clock } from "lucide-react";
import { Playfair_Display, Inter } from "next/font/google";
import Link from "next/link";
import { menu, MenuItem } from "../data/menuData";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "../context/CartContext";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400","600","700"] });
const inter = Inter({ subsets: ["latin"], weight: ["300","400","500","600"] });

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CartItem extends MenuItem {
  quantity: number;
}

export default function TakeoutPage() {
  const { items: cart, addItem, updateQuantity, removeItem, clearCart, totalPrice } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<'appetizers' | 'seafood' | 'meats' | 'pasta' | 'desserts' | 'beverages'>('appetizers');
  const [showCart, setShowCart] = useState(false);
  const [checkoutData, setCheckoutData] = useState({ name: '', phone: '', pickupTime: '' });
  const [paymentType, setPaymentType] = useState<'online' | 'offline'>('online');
  const [isProcessing, setIsProcessing] = useState(false);

  // Environment variable validation
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      console.error('Warning: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set. Online payments will not work.');
    }
  }, []);

  const categories = [
    { key: 'appetizers' as const, label: 'Appetizers' },
    { key: 'seafood' as const, label: 'Seafood' },
    { key: 'meats' as const, label: 'Meats' },
    { key: 'pasta' as const, label: 'Pasta' },
    { key: 'desserts' as const, label: 'Desserts' },
    { key: 'beverages' as const, label: 'Beverages' }
  ];

  const addToCart = (item: MenuItem) => {
    addItem({
      name: item.name,
      price: item.price,
      quantity: 1,
      desc: item.desc,
      img: item.img
    });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double-clicks
    if (isProcessing) {
      return;
    }

    if (!checkoutData.name || !checkoutData.phone || !checkoutData.pickupTime) {
      alert('Please fill in all required fields');
      return;
    }
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentType === 'offline') {
        const response = await fetch('/api/create-offline-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: cart,
            customerInfo: checkoutData,
          }),
        });

        const data = await response.json();

        if (data.error) {
          alert('Error creating order: ' + data.error);
          return;
        }

        if (data.success) {
          clearCart();
          window.location.href = `/success?order_id=${data.orderId}&name=${encodeURIComponent(data.customerName)}&payment_type=offline`;
        }
      } else {
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: cart,
            customerName: checkoutData.name,
            phone: checkoutData.phone,
            pickupTime: checkoutData.pickupTime,
          }),
        });

        const { url, error } = await response.json();

        if (error) {
          alert('Error creating checkout session: ' + error);
          return;
        }

        if (url) {
          clearCart();
          window.location.href = url;
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred during checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const currentItems = menu[selectedCategory];

  return (
    <div className={`${inter.className} min-h-screen bg-[var(--brand-ivory)]`}>
      {/* Navbar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 w-full z-50 bg-[var(--brand-ivory)]/95 backdrop-blur-sm border-b border-[var(--brand-border)]"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex justify-between items-center">
          <Link href="/">
            <motion.div 
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <UtensilsCrossed className="text-[var(--brand-gold)]" size={24} />
              <h1 className={`${playfair.className} text-xl md:text-2xl font-bold text-[var(--brand-espresso)]`} style={{ textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
                THE MODERN TABLE
              </h1>
            </motion.div>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/">
              <motion.button
                className="flex items-center gap-2 text-[var(--brand-espresso)] hover:text-[var(--brand-pine)] transition-colors"
                whileHover={{ x: -5 }}
              >
                <ArrowLeft size={20} />
                <span className="hidden md:inline">Back</span>
              </motion.button>
            </Link>
            
            <motion.button
              onClick={() => setShowCart(!showCart)}
              className="relative p-3 rounded-lg bg-[var(--brand-sand)] border border-[var(--brand-border)] hover:bg-[var(--brand-espresso)] hover:text-[var(--brand-ivory)] transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="text-[var(--brand-gold)]" size={22} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[var(--brand-gold)] text-[var(--brand-espresso)] text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className={`${playfair.className} text-4xl md:text-5xl font-bold text-[var(--brand-espresso)] mb-4`}>
              Order Online
            </h1>
            <div className="rule mx-auto"></div>
            <p className="text-lg text-[var(--brand-muted)] mt-6">
              Browse our menu and place your order for pickup
            </p>
          </motion.div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <motion.button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedCategory === cat.key
                    ? 'btn-primary'
                    : 'btn-outline'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>

          {/* Category Header */}
          <div className="mb-8">
            <h2 className={`${playfair.className} text-3xl font-bold text-[var(--brand-espresso)] mb-2`}>
              {categories.find(c => c.key === selectedCategory)?.label}
            </h2>
            <div className="rule"></div>
          </div>

          {/* Items Grid - Mini Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="paper-alt border border-[var(--brand-border)] rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={item.img} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className={`${playfair.className} text-lg font-bold text-[var(--brand-espresso)] mb-2 text-center`}>
                    {item.name}
                  </h3>
                  <p className="text-[var(--brand-muted)] text-sm mb-4 text-center line-clamp-2 min-h-[40px]">
                    {item.desc}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`${playfair.className} text-xl font-semibold gold`}>
                      {item.price}
                    </span>
                    <motion.button
                      onClick={() => addToCart(item)}
                      className="w-10 h-10 rounded-full bg-[var(--brand-espresso)] text-[var(--brand-ivory)] flex items-center justify-center hover:bg-[var(--brand-pine)] transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Add to cart"
                    >
                      <Plus size={20} />
                    </motion.button>
                  </div>
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
              className="fixed inset-0 bg-[var(--brand-espresso)]/60 backdrop-blur-sm z-40"
              onClick={() => setShowCart(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 h-full w-full max-w-md paper border-l-2 border-[var(--brand-gold)] z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`${playfair.className} text-3xl font-bold text-[var(--brand-espresso)]`}>
                    Your Order
                  </h2>
                  <button 
                    onClick={() => setShowCart(false)} 
                    className="text-[var(--brand-muted)] hover:text-[var(--brand-espresso)] transition-colors"
                  >
                    <X size={28} />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-16">
                    <ShoppingCart size={48} className="text-[var(--brand-muted)] mx-auto mb-4 opacity-30" />
                    <p className="text-[var(--brand-muted)]">Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto">
                      {cart.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="paper-alt border border-[var(--brand-border)] rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className={`${inter.className} font-semibold text-[var(--brand-espresso)]`}>
                              {item.name}
                            </h3>
                            <button 
                              onClick={() => removeItem(item.name)} 
                              className="text-[var(--brand-muted)] hover:text-red-600 transition-colors"
                            >
                              <X size={18} />
                            </button>
                          </div>
                          <p className="text-sm text-[var(--brand-muted)] mb-3">{item.price} each</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => updateQuantity(item.name, -1)}
                                className="w-8 h-8 rounded-full border-2 border-[var(--brand-border)] flex items-center justify-center hover:bg-[var(--brand-sand)] transition-colors"
                              >
                                <Minus size={16} className="text-[var(--brand-espresso)]" />
                              </button>
                              <span className="text-[var(--brand-espresso)] font-bold w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.name, 1)}
                                className="w-8 h-8 rounded-full border-2 border-[var(--brand-border)] flex items-center justify-center hover:bg-[var(--brand-sand)] transition-colors"
                              >
                                <Plus size={16} className="text-[var(--brand-espresso)]" />
                              </button>
                            </div>
                            <span className="gold font-bold">
                              ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="border-t-2 border-[var(--brand-gold)] pt-6 mb-6">
                      <div className="flex justify-between items-center mb-8">
                        <span className={`${playfair.className} text-2xl font-bold text-[var(--brand-espresso)]`}>
                          Total
                        </span>
                        <span className={`${playfair.className} text-3xl font-bold gold`}>
                          ${totalPrice}
                        </span>
                      </div>

                      <form onSubmit={handleCheckout} className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium text-[var(--brand-espresso)] mb-2">
                            Your Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={checkoutData.name}
                            onChange={(e) => setCheckoutData({...checkoutData, name: e.target.value})}
                            className="w-full p-3 paper-alt border border-[var(--brand-border)] rounded-lg text-[var(--brand-espresso)] focus:border-[var(--brand-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]/20 transition-all"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[var(--brand-espresso)] mb-2">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            required
                            value={checkoutData.phone}
                            onChange={(e) => setCheckoutData({...checkoutData, phone: e.target.value})}
                            className="w-full p-3 paper-alt border border-[var(--brand-border)] rounded-lg text-[var(--brand-espresso)] focus:border-[var(--brand-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]/20 transition-all"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[var(--brand-espresso)] mb-2 flex items-center gap-2">
                            <Clock size={16} />
                            Pickup Time *
                          </label>
                          <input
                            type="time"
                            required
                            value={checkoutData.pickupTime}
                            onChange={(e) => setCheckoutData({...checkoutData, pickupTime: e.target.value})}
                            className="w-full p-3 paper-alt border border-[var(--brand-border)] rounded-lg text-[var(--brand-espresso)] focus:border-[var(--brand-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]/20 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[var(--brand-espresso)] mb-3">
                            Payment Method *
                          </label>
                          <div className="space-y-3">
                            <label className="flex items-center gap-3 p-4 paper-alt border-2 border-[var(--brand-border)] rounded-lg cursor-pointer hover:border-[var(--brand-gold)] transition-colors">
                              <input
                                type="radio"
                                name="paymentType"
                                value="online"
                                checked={paymentType === 'online'}
                                onChange={(e) => setPaymentType(e.target.value as 'online' | 'offline')}
                                className="w-5 h-5 text-[var(--brand-gold)]"
                              />
                              <span className="text-[var(--brand-espresso)] font-medium">
                                Pay Online with Stripe
                              </span>
                            </label>
                            <label className="flex items-center gap-3 p-4 paper-alt border-2 border-[var(--brand-border)] rounded-lg cursor-pointer hover:border-[var(--brand-gold)] transition-colors">
                              <input
                                type="radio"
                                name="paymentType"
                                value="offline"
                                checked={paymentType === 'offline'}
                                onChange={(e) => setPaymentType(e.target.value as 'online' | 'offline')}
                                className="w-5 h-5 text-[var(--brand-gold)]"
                              />
                              <span className="text-[var(--brand-espresso)] font-medium">
                                Pay at Pickup
                              </span>
                            </label>
                          </div>
                        </div>

                        <motion.button
                          type="submit"
                          disabled={isProcessing}
                          whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                          whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                          className={`w-full py-4 text-lg mt-6 ${
                            isProcessing 
                              ? 'bg-[var(--brand-muted)] cursor-not-allowed opacity-70' 
                              : 'btn-primary'
                          }`}
                        >
                          {isProcessing 
                            ? 'Processing...' 
                            : paymentType === 'online' 
                              ? 'Pay with Stripe' 
                              : 'Complete Order'
                          }
                        </motion.button>
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
