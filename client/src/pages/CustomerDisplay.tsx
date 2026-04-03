/**
 * WAYPOINTSYNC — Customer-Facing Display
 * Opens in a second browser tab/window on any screen facing the customer.
 * Syncs live with the staff POS via localStorage storage events.
 * Satisfies Florida DEP concession contract requirement: "visual display which faces customers"
 * No FareHarbor needed. No Lightspeed needed. Just a URL on any screen.
 */

import { useCart } from "@/contexts/CartContext";

const NAV_BLUE = "#1B3A5C";
const TEAL = "#2A7D6F";

export default function CustomerDisplay() {
  const { cart, subtotal, tax, total } = useCart();

  const allLineItems = [
    ...(cart.booking && cart.booking.balanceDue > 0
      ? [{ id: "tour-balance", name: `${cart.booking.tourName} — Balance Due`, price: cart.booking.balanceDue, quantity: 1, type: "tour" as const }]
      : []),
    ...cart.items,
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: NAV_BLUE }}>
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <div>
          <p className="text-white font-bold text-2xl tracking-tight">WaypointSync</p>
          <p className="text-slate-400 text-sm">Florida Caverns State Park</p>
        </div>
        <div className="text-right">
          <p className="text-slate-300 text-sm">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <p className="text-slate-400 text-xs">
            {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-6">

        {cart.status === "complete" ? (
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">✓</span>
            </div>
            <p className="text-white text-4xl font-bold mb-2">Payment Approved</p>
            <p className="text-slate-400 text-lg">Thank you! Enjoy your experience.</p>
            {cart.booking && (
              <p className="text-slate-500 text-sm mt-4">{cart.booking.tourName} · {cart.booking.tourTime}</p>
            )}
          </div>
        ) : cart.status === "payment" ? (
          <div className="text-center w-full max-w-lg">
            <p className="text-slate-400 text-sm uppercase tracking-widest mb-4">Your Total</p>
            <p className="text-white font-bold mb-8" style={{ fontSize: "5rem", lineHeight: 1 }}>
              ${total.toFixed(2)}
            </p>
            <div className="w-16 h-1 rounded-full mx-auto mb-8" style={{ background: TEAL }} />
            <div className="space-y-2 text-left bg-white/5 rounded-2xl p-5">
              {allLineItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-slate-300">{item.name}{item.quantity > 1 ? ` ×${item.quantity}` : ""}</span>
                  <span className="text-white font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              {tax > 0 && (
                <div className="flex justify-between text-sm border-t border-white/10 pt-2 mt-2">
                  <span className="text-slate-400">Tax (7%)</span>
                  <span className="text-slate-300">${tax.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold border-t border-white/20 pt-2 mt-2">
                <span className="text-white">Total</span>
                <span className="text-white text-lg">${total.toFixed(2)}</span>
              </div>
            </div>
            <p className="text-slate-500 text-xs mt-6 animate-pulse">Awaiting payment…</p>
          </div>
        ) : cart.status === "active" && allLineItems.length > 0 ? (
          <div className="w-full max-w-lg">
            <p className="text-slate-400 text-sm uppercase tracking-widest mb-4 text-center">Your Order</p>
            {cart.booking && (
              <div className="text-center mb-6">
                <p className="text-white text-xl font-semibold">Welcome, {cart.booking.customerName.split(",")[1]?.trim() || cart.booking.customerName}!</p>
                <p className="text-slate-400 text-sm">{cart.booking.tourName} · {cart.booking.tourTime} · Party of {cart.booking.partySize}</p>
              </div>
            )}
            <div className="bg-white/5 rounded-2xl p-5 space-y-2">
              {allLineItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-slate-300">{item.name}{item.quantity > 1 ? ` ×${item.quantity}` : ""}</span>
                  <span className="text-white font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              {tax > 0 && (
                <div className="flex justify-between text-sm border-t border-white/10 pt-2 mt-2">
                  <span className="text-slate-400">Tax (7%)</span>
                  <span className="text-slate-300">${tax.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold border-t border-white/20 pt-2 mt-2">
                <span className="text-white">Running Total</span>
                <span className="text-white text-2xl">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: TEAL + "33" }}>
              <span className="text-4xl">🌿</span>
            </div>
            <p className="text-white text-2xl font-semibold mb-2">Welcome</p>
            <p className="text-slate-400">Florida Caverns State Park</p>
            <p className="text-slate-500 text-sm mt-6">Please see a staff member to begin your visit.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-8 py-4 border-t border-white/10 flex items-center justify-between">
        <p className="text-slate-600 text-xs">Transaction #{cart.transactionId}</p>
        <p className="text-slate-600 text-xs">Powered by WaypointSync</p>
      </div>
    </div>
  );
}
