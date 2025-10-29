"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Phone, Calendar, Utensils, Mail, Instagram, Facebook, Twitter, ChevronRight } from "lucide-react";

const DISHES = [
  {
    id: 1,
    name: "Citrus Burrata",
    price: 14,
    category: "Starters",
    desc: "Creamy burrata, blood orange, basil oil, toasted pistachio.",
    image: "https://images.pexels.com/photos/3026809/pexels-photo-3026809.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 2,
    name: "Charred Broccolini",
    price: 12,
    category: "Starters",
    desc: "Lemon zest, crispy garlic, almond crumb, chili honey.",
    image: "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 3,
    name: "Smoked Tomato Soup",
    price: 10,
    category: "Starters",
    desc: "Fire-roasted tomatoes, basil cream, sourdough crisp.",
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 4,
    name: "Harissa Chicken Bowl",
    price: 22,
    category: "Mains",
    desc: "Pearl couscous, roasted carrots, green tahini, pickled onions.",
    image: "https://images.pexels.com/photos/1095550/pexels-photo-1095550.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 5,
    name: "Miso Glazed Salmon",
    price: 26,
    category: "Mains",
    desc: "Sesame rice, charred scallions, ginger ponzu, furikake.",
    image: "https://images.pexels.com/photos/3298181/pexels-photo-3298181.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 6,
    name: "Truffle Mushroom Pasta",
    price: 24,
    category: "Mains",
    desc: "Tagliatelle, wild mushrooms, pecorino, black truffle butter.",
    image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 7,
    name: "Basque Cheesecake",
    price: 11,
    category: "Desserts",
    desc: "Caramelized crust, vanilla bean cream, seasonal fruit.",
    image: "https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 8,
    name: "Dark Chocolate Mousse",
    price: 10,
    category: "Desserts",
    desc: "Sea salt crumble, espresso whip, cocoa nibs.",
    image: "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 9,
    name: "Lemon Olive Oil Cake",
    price: 9,
    category: "Desserts",
    desc: "Meyer lemon glaze, mascarpone, candied peel.",
    image: "https://images.pexels.com/photos/4342597/pexels-photo-4342597.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
];

const CATEGORIES = ["All", "Starters", "Mains", "Desserts"] as const;
type Category = (typeof CATEGORIES)[number];
type Page = "home" | "menu" | "contact";

const Section = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <section className={`w-full max-w-6xl mx-auto px-4 md:px-6 ${className}`}>{children}</section>
);

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs uppercase tracking-widest">{children}</span>
);

const DishCard = ({ dish, index }: { dish: (typeof DISHES)[number]; index: number }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25, delay: 0.03 * index }}
    className="relative overflow-hidden rounded-2xl border shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="h-48 w-full overflow-hidden">
      <img
        src={dish.image}
        alt={dish.name}
        className="h-full w-full object-cover transform transition-transform duration-300 hover:scale-105"
      />
    </div>
    <div className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{dish.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{dish.desc}</p>
        </div>
        <span className="font-semibold">${dish.price}</span>
      </div>
      <div className="mt-3">
        <Badge>{dish.category}</Badge>
      </div>
    </div>
  </motion.div>
);

const NavLink = ({ label, active, onClick }: { label: string; active?: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
      active ? "bg-black text-white" : "hover:bg-muted"
    }`}
  >
    {label}
  </button>
);

const Hero = ({ onPrimary }: { onPrimary: () => void }) => (
  <div className="relative">
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(253,186,116,0.25),transparent_45%),radial-gradient(ellipse_at_bottom_right,rgba(217,249,157,0.25),transparent_40%)]" />

    <Section className="pt-20 pb-16 md:pt-28 md:pb-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Badge>The Modern Table</Badge>
          <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight">
            Casual Dining, <span className="bg-gradient-to-r from-black to-stone-500 bg-clip-text text-transparent">Reimagined</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-prose">
            A modern, bright restaurant experience with bold flavors and simple elegance. Browse our seasonal menu or
            reserve your table in seconds.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={onPrimary}
              className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-white font-medium hover:opacity-90"
            >
              View Menu <ChevronRight size={18} />
            </button>
            <a href="#contact" className="rounded-full border px-5 py-3 font-medium hover:bg-muted">
              Reserve a Table
            </a>
          </div>
          <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Utensils size={16} /> Seasonal menu</div>
            <div className="flex items-center gap-2"><Calendar size={16} /> Easy reservations</div>
            <div className="flex items-center gap-2"><Phone size={16} /> (555) 123-4567</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl border shadow-sm">
            <img
              src="https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt="Restaurant dining interior with elegant lighting"
              className="h-full w-full object-cover transform transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="absolute -bottom-4 -left-4 hidden md:block">
            <div className="rounded-2xl border bg-white/70 backdrop-blur px-4 py-3 shadow-sm">
              <p className="text-sm"><span className="font-semibold">Open today:</span> 11:00 AM – 10:00 PM</p>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  </div>
);

function MenuSection() {
  const [active, setActive] = useState<Category>("All");
  const filtered = useMemo(() => (active === "All" ? DISHES : DISHES.filter((d) => d.category === active)), [active]);

  return (
    <Section className="py-12 md:py-16" id="menu">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Badge>Our Menu</Badge>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">Fresh • Simple • Seasonal</h2>
          <p className="mt-2 text-muted-foreground">Crafted with great ingredients and a modern twist.</p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          {CATEGORIES.map((c) => (
            <NavLink key={c} label={c} active={c === active} onClick={() => setActive(c)} />
          ))}
        </div>
      </div>

      <div className="md:hidden mt-6 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {CATEGORIES.map((c) => (
          <NavLink key={c} label={c} active={c === active} onClick={() => setActive(c)} />
        ))}
      </div>

      <motion.div layout className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filtered.map((dish, i) => (
            <DishCard key={dish.id} dish={dish} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>
    </Section>
  );
}

function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) return alert("Please enter your name and email.");
    setSubmitted(true);
  }

  return (
    <Section className="py-12 md:py-16" id="contact">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div>
          <Badge>Contact</Badge>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">Reserve a Table</h2>
          <p className="mt-2 text-muted-foreground max-w-prose">
            Have a question or want to make a reservation? Send us a message and our team will confirm shortly.
          </p>

          <div className="mt-6 space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Phone size={16} /> (555) 123-4567</div>
            <div className="flex items-center gap-2"><Mail size={16} /> hello@themoderntable.example</div>
            <div className="flex items-center gap-2"><Calendar size={16} /> Open daily 11:00 AM – 10:00 PM</div>
          </div>
        </div>

        <div className="rounded-2xl border p-6 bg-white/60 backdrop-blur">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Message</label>
                <textarea
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                  placeholder="Reservation for Friday at 7 PM for 4, please."
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <button type="submit" className="w-full rounded-full bg-black px-5 py-3 text-white font-medium hover:opacity-90">
                Send Request
              </button>
            </form>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <h3 className="text-xl font-semibold">Thanks, {name.split(" ")[0] || "friend"}!</h3>
              <p className="mt-2 text-muted-foreground">We received your request and will email {email} shortly.</p>
              <button onClick={() => setSubmitted(false)} className="mt-4 rounded-full border px-4 py-2">
                Send another
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t">
      <Section className="py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} The Modern Table. All rights reserved.</p>
        <div className="flex items-center gap-4 text-muted-foreground">
          <a href="#" className="hover:text-black"><Instagram size={18} /></a>
          <a href="#" className="hover:text-black"><Facebook size={18} /></a>
          <a href="#" className="hover:text-black"><Twitter size={18} /></a>
        </div>
      </Section>
    </footer>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("home");

  return (
    <div className="min-h-dvh bg-white text-black">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b">
        <Section className="py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white">
              <Menu size={18} />
            </div>
            <div>
              <div className="text-sm uppercase tracking-widest text-muted-foreground">Restaurant OS</div>
              <div className="text-lg font-semibold -mt-1">The Modern Table</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-2">
            <NavLink label="Home" active={page === "home"} onClick={() => setPage("home")} />
            <NavLink label="Menu" active={page === "menu"} onClick={() => setPage("menu")} />
            <NavLink label="Contact" active={page === "contact"} onClick={() => setPage("contact")} />
          </nav>
          <div className="md:hidden">
            <select
              aria-label="Navigate"
              value={page}
              onChange={(e) => setPage(e.target.value as Page)}
              className="rounded-xl border px-3 py-2"
            >
              <option value="home">Home</option>
              <option value="menu">Menu</option>
              <option value="contact">Contact</option>
            </select>
          </div>
        </Section>
      </header>

      <main>
        <AnimatePresence mode="wait">
          {page === "home" && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Hero onPrimary={() => setPage("menu")} />
              <MenuSection />
              <ContactSection />
            </motion.div>
          )}

          {page === "menu" && (
            <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <MenuSection />
              <ContactSection />
            </motion.div>
          )}

          {page === "contact" && (
            <motion.div key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ContactSection />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}