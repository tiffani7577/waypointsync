/**
 * WAYPOINTSYNC — CartContext
 * Shared cart state between the staff POS screen and the customer-facing display.
 * POS writes to /api/cart-sync (POST) on every cart change.
 * CustomerDisplay subscribes to /api/cart-stream (SSE) for live cross-device updates.
 */

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

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

// Push cart state to the server so all displays receive it
function pushCartSync(cart: CartState) {
  fetch("/api/cart-sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cart),
  }).catch(() => {/* silent — offline queue can be added later */});
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCartState] = useState<CartState>({
    ...defaultCart,
    transactionId: generateTxId(),
  });

  // Wrap setState so every mutation also pushes to server
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
 * Subscribes to the server SSE stream and returns the latest cart state.
 * Works across any two devices on any network.
 */
export function useDisplayCart() {
  const [cart, setCart] = useState<CartState & { subtotal: number; tax: number; total: number }>({
    ...defaultCart,
    transactionId: "",
    subtotal: 0,
    tax: 0,
    total: 0,
  });
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const connect = () => {
      const es = new EventSource("/api/cart-stream");
      esRef.current = es;

      es.onmessage = (e) => {
        try {
          const state: CartState = JSON.parse(e.data);
          const subtotal =
            (state.booking?.balanceDue ?? 0) +
            state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
          const tax = parseFloat((state.items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 0.07).toFixed(2));
          const total = parseFloat((subtotal + tax).toFixed(2));
          setCart({ ...state, subtotal, tax, total });
        } catch {}
      };

      es.onerror = () => {
        es.close();
        // Reconnect after 3s
        setTimeout(connect, 3000);
      };
    };

    connect();
    return () => { esRef.current?.close(); };
  }, []);

  return cart;
}
