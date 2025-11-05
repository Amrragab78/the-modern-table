"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface CartItem {
  name: string;
  price: string;
  quantity: number;
  desc: string;
  img: string;
}

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (itemName: string, delta: number) => void;
  removeItem: (itemName: string) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: string;
  isHydrated: boolean;
};

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "restaurantCart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to parse cart from localStorage:", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage when items change
  useEffect(() => {
    if (isHydrated) {
      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        }
      } catch (e) {
        console.error("Failed to save cart to localStorage:", e);
      }
    }
  }, [items, isHydrated]);

  const addItem = (item: CartItem) => {
    setItems((prevCart) => {
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
  };

  const updateQuantity = (itemName: string, delta: number) => {
    setItems((prevCart) => {
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
    setItems((prevCart) => prevCart.filter(item => item.name !== itemName));
  };

  const clearCart = () => {
    setItems([]);
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error("Failed to clear cart from localStorage:", e);
    }
  };

  const { totalCount, totalPrice } = useMemo(() => {
    const count = items.reduce((acc, item) => acc + item.quantity, 0);
    const price = items.reduce((acc, item) => {
      const itemPrice = parseFloat(item.price.replace('$', ''));
      return acc + (itemPrice * item.quantity);
    }, 0);
    return { totalCount: count, totalPrice: price.toFixed(2) };
  }, [items]);

  const value: CartContextType = {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    totalCount,
    totalPrice,
    isHydrated
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
}
