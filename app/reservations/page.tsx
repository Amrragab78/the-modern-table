"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UtensilsCrossed, ArrowLeft, Phone, ChevronRight, ChevronLeft, Clock, Users, Calendar as CalendarIcon, Check } from "lucide-react";
import { Playfair_Display, Inter } from "next/font/google";
import Link from "next/link";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

export default function ReservationsPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    guests: "2",
    date: "",
    time: "",
    name: "",
    email: "",
    phone: "",
    notes: "",
    policyAgreed: false
  });

  const [isConfirmed, setIsConfirmed] = useState(false);

  // Generate available time slots (5:00 PM to 9:30 PM)
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 17; hour < 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour > 12 ? hour - 12 : hour}:${minute === 0 ? "00" : "30"} ${hour >= 12 ? "PM" : "AM"}`;
        if (hour === 21 && minute === 30) break; // Stop at 9:30 PM
        slots.push(time);
      }
    }
    return slots;
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleTimeSelect = (time: string) => {
    setFormData({ ...formData, time });
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!formData.date || !formData.time) {
        alert("Please select both date and time");
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.name || !formData.email || !formData.phone) {
        alert("Please fill in all required fields");
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.policyAgreed) {
        alert("Please agree to the reservation policy");
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("API Error:", data);
        alert(data.error || data.message || "Failed to submit reservation. Please try again.");
        return;
      }

      if (data.success) {
        setIsConfirmed(true);
      } else {
        alert(data.error || "Failed to submit reservation. Please try again.");
      }
    } catch (error) {
      console.error("Reservation submission error:", error);
      alert("An unexpected error occurred. Please check your internet connection and try again.");
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div 
      className={`${inter.className} min-h-screen w-full relative bg-cover bg-center bg-no-repeat bg-fixed`}
      style={{
        backgroundImage: "url('https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=2400' )",
      }}
    >
      {/* Cream Overlay */}
      <div className="absolute inset-0 bg-[rgba(251,247,242,0.45)] backdrop-blur-[1px] pointer-events-none" />
      
      {/* Navbar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 w-full z-50 bg-[var(--brand-ivory)]/95 backdrop-blur-sm border-b border-[var(--brand-border)] relative"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex justify-between items-center">
          <Link href="/">
            <motion.div 
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <UtensilsCrossed className="text-[var(--brand-gold)]" size={24} />
              <h1 className={`${playfair.className} text-xl md:text-2xl font-semibold text-[var(--brand-espresso)]`}>
                The Modern Table
              </h1>
            </motion.div>
          </Link>
          
          <Link href="/">
            <motion.button
              className="flex items-center gap-2 text-[var(--brand-espresso)] hover:text-[var(--brand-pine)] transition-colors"
              whileHover={{ x: -5 }}
            >
              <ArrowLeft size={20} />
              <span className="hidden md:inline">Back</span>
            </motion.button>
          </Link>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="pt-40 pb-40 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="paper rounded-2xl p-12 md:p-16 shadow-lg"
          >
            {!isConfirmed ? (
              <>
                {/* Step Indicator */}
                <div className="mb-12">
                  <div className="flex justify-between items-center mb-8">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="flex items-center">
                        <motion.div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                            step === currentStep
                              ? "bg-[var(--brand-gold)] text-[var(--brand-espresso)] scale-110"
                              : step < currentStep
                              ? "bg-[var(--brand-pine)] text-white"
                              : "bg-[var(--brand-sand)] text-[var(--brand-muted)]"
                          }`}
                          animate={{ scale: step === currentStep ? 1.1 : 1 }}
                        >
                          {step < currentStep ? <Check size={20} /> : step}
                        </motion.div>
                        {step < 3 && (
                          <div
                            className={`h-1 w-12 md:w-20 mx-2 transition-all ${
                              step < currentStep ? "bg-[var(--brand-pine)]" : "bg-[var(--brand-sand)]"
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <h2 className={`${playfair.className} text-3xl md:text-4xl font-bold text-[var(--brand-espresso)]`}>
                      {currentStep === 1 && "Find Your Table"}
                      {currentStep === 2 && "Your Information"}
                      {currentStep === 3 && "Review & Confirm"}
                    </h2>
                    <p className={`${inter.className} text-[var(--brand-muted)] mt-2`}>
                      {currentStep === 1 && "Step 1 of 3"}
                      {currentStep === 2 && "Step 2 of 3"}
                      {currentStep === 3 && "Step 3 of 3"}
                    </p>
                  </div>
                </div>

                {/* Step Content */}
                <form onSubmit={currentStep === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNextStep(); }}>
                  <AnimatePresence mode="wait">
                    {/* Step 1: Find a Table */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.4 }}
                        className="space-y-8"
                      >
                        <p className={`${inter.className} text-lg text-[var(--brand-muted)] text-center mb-8`}>
                          Let's find the perfect time for your dining experience
                        </p>

                        {/* Party Size */}
                        <div>
                          <label className={`${inter.className} block text-sm font-medium text-[var(--brand-espresso)] mb-4 flex items-center gap-2`}>
                            <Users size={18} className="text-[var(--brand-gold)]" />
                            Party Size *
                          </label>
                          <div className="grid grid-cols-5 gap-3">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <motion.button
                                key={num}
                                type="button"
                                onClick={() => setFormData({ ...formData, guests: num.toString() })}
                                className={`py-3 rounded-lg font-semibold transition-all ${
                                  formData.guests === num.toString()
                                    ? "bg-[var(--brand-espresso)] text-[var(--brand-ivory)] shadow-lg"
                                    : "bg-[var(--brand-sand)] text-[var(--brand-espresso)] hover:bg-[var(--brand-gold)]/20"
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {num}
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        {/* Date */}
                        <div>
                          <label className={`${inter.className} block text-sm font-medium text-[var(--brand-espresso)] mb-4 flex items-center gap-2`}>
                            <CalendarIcon size={18} className="text-[var(--brand-gold)]" />
                            Date *
                          </label>
                          <input
                            type="date"
                            name="date"
                            required
                            value={formData.date}
                            onChange={handleInputChange}
                            className="w-full px-6 py-4 rounded-lg border-2 border-[var(--brand-border)] bg-white text-[var(--brand-espresso)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)] focus:border-transparent transition-all text-lg"
                          />
                        </div>

                        {/* Time Slots */}
                        <div>
                          <label className={`${inter.className} block text-sm font-medium text-[var(--brand-espresso)] mb-4 flex items-center gap-2`}>
                            <Clock size={18} className="text-[var(--brand-gold)]" />
                            Time *
                          </label>
                          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                            {timeSlots.map((time) => (
                              <motion.button
                                key={time}
                                type="button"
                                onClick={() => handleTimeSelect(time)}
                                className={`py-3 px-2 rounded-lg font-semibold transition-all text-sm ${
                                  formData.time === time
                                    ? "bg-[var(--brand-espresso)] text-[var(--brand-ivory)] shadow-lg"
                                    : "bg-[var(--brand-sand)] text-[var(--brand-espresso)] hover:bg-[var(--brand-gold)]/20"
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {time}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Your Information */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.4 }}
                        className="space-y-6"
                      >
                        <p className={`${inter.className} text-lg text-[var(--brand-muted)] text-center mb-8`}>
                          Help us confirm your reservation
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className={`${inter.className} block text-sm font-medium text-[var(--brand-espresso)] mb-2`}>
                              Full Name *
                            </label>
                            <input
                              type="text"
                              name="name"
                              required
                              value={formData.name}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 rounded-lg border border-[var(--brand-border)] bg-white text-[var(--brand-espresso)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)] transition-all"
                              placeholder="Your full name"
                            />
                          </div>

                          <div>
                            <label className={`${inter.className} block text-sm font-medium text-[var(--brand-espresso)] mb-2`}>
                              Email *
                            </label>
                            <input
                              type="email"
                              name="email"
                              required
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 rounded-lg border border-[var(--brand-border)] bg-white text-[var(--brand-espresso)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)] transition-all"
                              placeholder="your@email.com"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className={`${inter.className} block text-sm font-medium text-[var(--brand-espresso)] mb-2`}>
                              Phone *
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              required
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 rounded-lg border border-[var(--brand-border)] bg-white text-[var(--brand-espresso)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)] transition-all"
                              placeholder="(555) 000-0000"
                            />
                          </div>
                        </div>

                        <div>
                          <label className={`${inter.className} block text-sm font-medium text-[var(--brand-espresso)] mb-2`}>
                            Special Requests (Optional)
                          </label>
                          <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-4 py-3 rounded-lg border border-[var(--brand-border)] bg-white text-[var(--brand-espresso)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)] transition-all resize-none"
                            placeholder="Dietary restrictions, special occasions, seating preferences..."
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Review & Confirm */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.4 }}
                        className="space-y-8"
                      >
                        <p className={`${inter.className} text-lg text-[var(--brand-muted)] text-center mb-8`}>
                          Please review your reservation details
                        </p>

                        {/* Reservation Summary */}
                        <div className="bg-[var(--brand-sand)] rounded-lg p-8 space-y-6">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div>
                              <p className={`${inter.className} text-xs font-semibold text-[var(--brand-muted)] uppercase tracking-wide`}>
                                Date
                              </p>
                              <p className={`${playfair.className} text-2xl font-bold text-[var(--brand-espresso)] mt-2`}>
                                {formData.date ? new Date(formData.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                              </p>
                            </div>
                            <div>
                              <p className={`${inter.className} text-xs font-semibold text-[var(--brand-muted)] uppercase tracking-wide`}>
                                Time
                              </p>
                              <p className={`${playfair.className} text-2xl font-bold text-[var(--brand-espresso)] mt-2`}>
                                {formData.time || "—"}
                              </p>
                            </div>
                            <div>
                              <p className={`${inter.className} text-xs font-semibold text-[var(--brand-muted)] uppercase tracking-wide`}>
                                Guests
                              </p>
                              <p className={`${playfair.className} text-2xl font-bold text-[var(--brand-espresso)] mt-2`}>
                                {formData.guests}
                              </p>
                            </div>
                          </div>

                          <div className="border-t border-[var(--brand-border)] pt-6 space-y-3">
                            <p className={`${inter.className} text-sm text-[var(--brand-espresso)]`}>
                              <span className="font-semibold">Name:</span> {formData.name}
                            </p>
                            <p className={`${inter.className} text-sm text-[var(--brand-espresso)]`}>
                              <span className="font-semibold">Email:</span> {formData.email}
                            </p>
                            <p className={`${inter.className} text-sm text-[var(--brand-espresso)]`}>
                              <span className="font-semibold">Phone:</span> {formData.phone}
                            </p>
                            {formData.notes && (
                              <p className={`${inter.className} text-sm text-[var(--brand-espresso)]`}>
                                <span className="font-semibold">Special Requests:</span> {formData.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Policy Checkbox */}
                        <div className="bg-[var(--brand-ivory)] border-2 border-[var(--brand-border)] rounded-lg p-6">
                          <label className="flex items-start gap-4 cursor-pointer">
                            <input
                              type="checkbox"
                              name="policyAgreed"
                              checked={formData.policyAgreed}
                              onChange={handleInputChange}
                              className="w-5 h-5 mt-1 accent-[var(--brand-gold)] cursor-pointer"
                            />
                            <div>
                              <p className={`${inter.className} text-sm text-[var(--brand-espresso)]`}>
                                I agree to the <span className="font-semibold">Reservation Policy & No-Show Fees</span>. Reservations are held for 15 minutes past the scheduled time. A 24-hour cancellation notice is required to avoid a $25 per person no-show fee.
                              </p>
                            </div>
                          </label>
                        </div>

                        {/* Policy Details (Collapsible) */}
                        <details className="group">
                          <summary className={`${inter.className} cursor-pointer font-semibold text-[var(--brand-espresso)] flex items-center gap-2 py-4 px-4 bg-[var(--brand-sand)] rounded-lg hover:bg-[var(--brand-gold)]/10 transition-colors`}>
                            <span>View Full Reservation Policy</span>
                            <ChevronRight className="w-5 h-5 group-open:rotate-90 transition-transform" />
                          </summary>
                          <div className={`${inter.className} mt-4 p-4 bg-[var(--brand-sand)] rounded-lg text-sm text-[var(--brand-muted)] space-y-3`}>
                            <p>
                              <span className="font-semibold text-[var(--brand-espresso)]">Reservation Confirmation:</span> Reservations are not finalized until confirmed by a staff member. We will contact you within 24 hours to confirm your booking.
                            </p>
                            <p>
                              <span className="font-semibold text-[var(--brand-espresso)]">Cancellation Policy:</span> Cancellations must be made at least 24 hours in advance. Cancellations made less than 24 hours before your reservation may incur a $25 per person fee.
                            </p>
                            <p>
                              <span className="font-semibold text-[var(--brand-espresso)]">No-Show Policy:</span> Guests who do not arrive within 15 minutes of their reservation time will be considered a no-show and charged $25 per person.
                            </p>
                            <p>
                              <span className="font-semibold text-[var(--brand-espresso)]">Operating Hours:</span> Open Tuesday - Sunday | Closed Monday
                            </p>
                          </div>
                        </details>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center mt-12 gap-4">
                    <motion.button
                      type="button"
                      onClick={handlePrevStep}
                      disabled={currentStep === 1}
                      className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                        currentStep === 1
                          ? "opacity-50 cursor-not-allowed bg-[var(--brand-sand)] text-[var(--brand-muted)]"
                          : "bg-[var(--brand-sand)] text-[var(--brand-espresso)] hover:bg-[var(--brand-gold)]/20"
                      }`}
                      whileHover={currentStep !== 1 ? { scale: 1.05 } : {}}
                      whileTap={currentStep !== 1 ? { scale: 0.95 } : {}}
                    >
                      <ChevronLeft size={20} />
                      Back
                    </motion.button>

                    <motion.button
                      type="submit"
                      className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-[var(--brand-ivory)] transition-all ${
                        currentStep === 3
                          ? "bg-[var(--brand-pine)] hover:bg-[var(--brand-pine)]/90"
                          : "bg-[var(--brand-espresso)] hover:bg-[var(--brand-espresso)]/90"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {currentStep === 3 ? (
                        <>
                          <Check size={20} />
                          Confirm Reservation
                        </>
                      ) : (
                        <>
                          Next
                          <ChevronRight size={20} />
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>

                {/* Call Option */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-12 pt-8 border-t border-[var(--brand-border)]"
                  >
                    <p className={`${inter.className} text-[var(--brand-muted)] text-center mb-4`}>
                      Prefer to speak with us directly?
                    </p>
                    <div className="flex justify-center">
                      <motion.a
                        href="tel:+15550000000"
                        className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-[var(--brand-gold)] text-[var(--brand-espresso)] font-semibold hover:bg-[var(--brand-gold)]/90 transition-colors shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Phone size={20} />
                        (555) 000-0000
                      </motion.a>
                    </div>
                  </motion.div>
                )}
              </>
            ) : (
              /* Confirmation Message */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto py-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mb-8"
                >
                  <div className="w-20 h-20 rounded-full bg-[var(--brand-pine)] flex items-center justify-center mx-auto">
                    <Check size={40} className="text-white" />
                  </div>
                </motion.div>

                <div className="mb-8">
                  <h2 className={`${playfair.className} text-4xl md:text-5xl font-bold text-[var(--brand-espresso)] mb-4`}>
                    Reservation Requested!
                  </h2>
                  <p className={`${inter.className} text-xl text-[var(--brand-espresso)] leading-relaxed`}>
                    Thank you, <span className="font-semibold text-[var(--brand-gold)]">{formData.name}</span>.
                  </p>
                  <p className={`${inter.className} text-lg text-[var(--brand-muted)] mt-4`}>
                    We've received your reservation request for <span className="font-semibold">{formData.date}</span> at <span className="font-semibold">{formData.time}</span> for <span className="font-semibold">{formData.guests} {formData.guests === "1" ? "guest" : "guests"}</span>.
                  </p>
                </div>

                <div className="bg-[var(--brand-sand)] rounded-lg p-8 mb-8 space-y-4">
                  <p className={`${inter.className} font-semibold text-[var(--brand-espresso)]`}>
                    What happens next?
                  </p>
                  <p className={`${inter.className} text-sm text-[var(--brand-muted)]`}>
                    One of our team members will contact you at <span className="font-semibold">{formData.phone}</span> within 24 hours to confirm your reservation and availability.
                  </p>
                </div>

                <div className="bg-[var(--brand-ivory)] border-2 border-[var(--brand-border)] rounded-lg p-6 mb-8">
                  <p className={`${inter.className} text-sm text-[var(--brand-muted)] italic`}>
                    Reservations are not finalized until confirmed by a staff member. Please ensure your phone number is correct so we can reach you.
                  </p>
                </div>

                <motion.button
                  onClick={() => {
                    setIsConfirmed(false);
                    setCurrentStep(1);
                    setFormData({
                      guests: "2",
                      date: "",
                      time: "",
                      name: "",
                      email: "",
                      phone: "",
                      notes: "",
                      policyAgreed: false
                    });
                  }}
                  className="px-8 py-3 rounded-full border-2 border-[var(--brand-espresso)] text-[var(--brand-espresso)] font-semibold hover:bg-[var(--brand-espresso)] hover:text-[var(--brand-ivory)] transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Make Another Reservation
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
