/**
 * WAYPOINTSYNC — CartContext
 * POS writes to /api/cart-sync (POST) on every cart change.
 * Server triggers Pusher event; CustomerDisplay subscribes via Pusher for live cross-device updates.
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import Pusher from "pusher-js";

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

// Push cart state to server — server triggers Pusher broadcast to all displays
function pushCartSync(cart: CartState) {
  fetch("/api/cart-sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cart),
  }).catch(() => {/* silent */});
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCartState] = useState<CartState>({
    ...defaultCart,
    transactionId: generateTxId(),
  });

  const setCart = (updater: CartState | ((prev: CartState) => CartState)) => {
    setCartState(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      pushCartSync(next);
      return next;
    });
  };

  const setBooking = (booking: Booking | null) => {
    setCart(prev => ({ ...prev, booking, status: booking ? "active" : "idle" }));
  };

  const addItem = (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    setCart(prev => {
      const existing = prev.items.find(i => i.id === item.id);
      if (existing) {
        return {
          ...prev,
          status: "active",
          items: prev.items.map(i =>
            i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity ?? 1) } : i
          ),
        };
      }
      return {
        ...prev,
        status: "active",
        items: [...prev.items, { ...item, quantity: item.quantity ?? 1 }],
      };
    });
  };

  const removeItem = (id: string) => {
    setCart(prev => ({ ...prev, items: prev.items.filter(i => i.id !== id) }));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) { removeItem(id); return; }
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

/**
 * useDisplayCart — used ONLY by CustomerDisplay.
 * Subscribes to Pusher channel for live cross-device updates.
 * Works across any two devices on any network, including Vercel static hosting.
 */
export function useDisplayCart() {
  const [cart, setCart] = useState<CartState & { subtotal: number; tax: number; total: number }>({
    ...defaultCart,
    transactionId: "",
    subtotal: 0,
    tax: 0,
    total: 0,
  });

  useEffect(() => {
    const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY as string, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER as string,
    });
    const channel = pusher.subscribe("waypoint-cart");
    channel.bind("cart-update", (state: CartState) => {
      const subtotal =
        (state.booking?.balanceDue ?? 0) +
        state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const tax = parseFloat((state.items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 0.07).toFixed(2));
      const total = parseFloat((subtotal + tax).toFixed(2));
      setCart({ ...state, subtotal, tax, total });
    });
    return () => {
      channel.unbind_all();
      pusher.unsubscribe("waypoint-cart");
      pusher.disconnect();
    };
  }, []);

  return cart;
}
