/**
 * WAYPOINTSYNC — CartContext
 * Shared cart state between the staff POS screen and the customer-facing display.
 * In production this will sync via WebSocket. For demo, uses localStorage + storage events
 * so two browser tabs (staff tab + display tab) stay in sync in real time.
 */

import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: "retail" | "food" | "tour";
}

export interface Booking {
  id: string;
  confirmationCode: string;
  customerName: string;
  tourName: string;
  tourTime: string;
  partySize: number;
  depositPaid: number;
  balanceDue: number;
  waiverSigned: boolean;
  waiverCount: number;
}

export interface CartState {
  booking: Booking | null;
  items: CartItem[];
  cashierName: string;
  transactionId: string;
  status: "idle" | "active" | "payment" | "complete";
}

interface CartContextType {
  cart: CartState;
  setBooking: (booking: Booking | null) => void;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  setStatus: (status: CartState["status"]) => void;
  subtotal: number;
  tax: number;
  total: number;
}

const STORAGE_KEY = "waypointsync_cart";

const defaultCart: CartState = {
  booking: null,
  items: [],
  cashierName: "Staff",
  transactionId: "",
  status: "idle",
};

function generateTxId() {
  return "WS-" + Date.now().toString(36).toUpperCase();
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : { ...defaultCart, transactionId: generateTxId() };
    } catch {
      return { ...defaultCart, transactionId: generateTxId() };
    }
  });

  // Sync to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // Listen for changes from other tabs (customer display)
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setCart(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const setBooking = (booking: Booking | null) => {
    setCart(prev => ({ ...prev, booking, status: booking ? "active" : "idle" }));
  };

  const addItem = (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    setCart(prev => {
      const existing = prev.items.find(i => i.id === item.id);
      if (existing) {
        return {
          ...prev,
          items: prev.items.map(i =>
            i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity ?? 1) } : i
          ),
        };
      }
      return {
        ...prev,
        items: [...prev.items, { ...item, quantity: item.quantity ?? 1 }],
      };
    });
  };

  const removeItem = (id: string) => {
    setCart(prev => ({ ...prev, items: prev.items.filter(i => i.id !== id) }));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    setCart(prev => ({
      ...prev,
      items: prev.items.map(i => (i.id === id ? { ...i, quantity: qty } : i)),
    }));
  };

  const clearCart = () => {
    setCart({ ...defaultCart, transactionId: generateTxId() });
  };

  const setStatus = (status: CartState["status"]) => {
    setCart(prev => ({ ...prev, status }));
  };

  const subtotal =
    (cart.booking?.balanceDue ?? 0) +
    cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = parseFloat((cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 0.07).toFixed(2));
  const total = parseFloat((subtotal + tax).toFixed(2));

  return (
    <CartContext.Provider
      value={{ cart, setBooking, addItem, removeItem, updateQuantity, clearCart, setStatus, subtotal, tax, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
