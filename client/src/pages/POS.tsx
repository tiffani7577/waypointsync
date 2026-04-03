/**
 * WAYPOINTSYNC — Staff POS Screen
 * Design: Clean, high-contrast, tablet-optimized. Navy + white + teal accent.
 * This is the single screen staff uses for every customer interaction.
 * Left panel: booking lookup + cart. Right panel: product catalog.
 * No screen switching. No FareHarbor tab. No Lightspeed tab.
 */

import { useState, useMemo } from "react";
import { useCart } from "@/contexts/CartContext";
import { MOCK_BOOKINGS, MOCK_PRODUCTS, type Product } from "@/lib/mockData";
import type { Booking } from "@/contexts/CartContext";
import { toast } from "sonner";
import PINScreen from "./PINScreen";

const NAV_BLUE = "#1B3A5C";
const TEAL = "#2A7D6F";

// Staff session stored in sessionStorage so refresh keeps you logged in
function getSession() {
  try { return JSON.parse(sessionStorage.getItem("wp_staff") || "null"); } catch { return null; }
}
function setSession(name: string, role: string) {
  sessionStorage.setItem("wp_staff", JSON.stringify({ name, role }));
}

function WaiverBadge({ signed, count, partySize }: { signed: boolean; count: number; partySize: number }) {
  if (signed) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
        ✓ Waivers Signed ({count}/{partySize})
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
      ⚠ Waiver Missing
    </span>
  );
}

function BookingCard({ booking, onSelect }: { booking: Booking; onSelect: (b: Booking) => void }) {
  return (
    <button
      onClick={() => onSelect(booking)}
      className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-teal-400 hover:bg-teal-50 transition-all group"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-slate-800 text-sm">{booking.customerName}</p>
          <p className="text-xs text-slate-500">{booking.tourName} · {booking.tourTime} · Party of {booking.partySize}</p>
          <p className="text-xs text-slate-400 mt-0.5">#{booking.confirmationCode}</p>
        </div>
        <WaiverBadge signed={booking.waiverSigned} count={booking.waiverCount} partySize={booking.partySize} />
      </div>
      {booking.balanceDue > 0 && (
        <p className="text-xs font-medium text-amber-700 mt-1">Balance due: ${booking.balanceDue.toFixed(2)}</p>
      )}
    </button>
  );
}

function CartRow({ item, onRemove, onQty }: {
  item: { id: string; name: string; price: number; quantity: number; type: string };
  onRemove: (id: string) => void;
  onQty: (id: string, qty: number) => void;
}) {
  return (
    <div className="flex items-center gap-2 py-1.5 border-b border-slate-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">{item.name}</p>
        <p className="text-xs text-slate-400">${item.price.toFixed(2)} ea</p>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onQty(item.id, item.quantity - 1)}
          className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold flex items-center justify-center"
        >−</button>
        <span className="w-5 text-center text-sm font-semibold text-slate-800">{item.quantity}</span>
        <button
          onClick={() => onQty(item.id, item.quantity + 1)}
          className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold flex items-center justify-center"
        >+</button>
      </div>
      <p className="text-sm font-semibold text-slate-800 w-14 text-right">${(item.price * item.quantity).toFixed(2)}</p>
      <button
        onClick={() => onRemove(item.id)}
        className="text-slate-300 hover:text-red-400 text-sm ml-1"
      >✕</button>
    </div>
  );
}

type Tab = "retail" | "food";

export default function POS() {
  const { cart, setBooking, addItem, removeItem, updateQuantity, clearCart, setStatus, subtotal, tax, total } = useCart();
  const [search, setSearch] = useState("");
  const [productTab, setProductTab] = useState<Tab>("retail");
  const [showBookingSearch, setShowBookingSearch] = useState(!cart.booking);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "payment" | "complete">("cart");
  const [staff, setStaff] = useState<{ name: string; role: string } | null>(getSession);
  const [tipPercent, setTipPercent] = useState<number | null>(null);

  const filteredBookings = useMemo(() => {
    if (!search.trim()) return MOCK_BOOKINGS;
    const q = search.toLowerCase();
    return MOCK_BOOKINGS.filter(b =>
      b.customerName.toLowerCase().includes(q) ||
      b.confirmationCode.toLowerCase().includes(q) ||
      b.tourName.toLowerCase().includes(q)
    );
  }, [search]);

  const filteredProducts = MOCK_PRODUCTS.filter(p => p.category === productTab);

  const handleSelectBooking = (booking: Booking) => {
    setBooking(booking);
    setShowBookingSearch(false);
    setCheckoutStep("cart");
  };

  const handleAddProduct = (product: Product) => {
    addItem({ id: product.id, name: product.name, price: product.price, type: product.category });
    toast.success(`Added ${product.name}`);
  };

  if (!staff) {
    return (
      <PINScreen
        onUnlock={(name, role) => {
          setSession(name, role);
          setStaff({ name, role });
        }}
      />
    );
  }
  const tipAmount = tipPercent !== null ? (subtotal * tipPercent) / 100 : 0;
  const grandTotal = total + tipAmount;

  const handleCharge = () => {
    // Only block checkout if there IS a booking AND the waiver hasn't been signed
    // Retail-only and food-only transactions (no booking) skip the waiver gate entirely
    if (cart.booking && !cart.booking.waiverSigned) {
      toast.error("Waiver must be signed before checkout.");
      return;
    }
    setCheckoutStep("payment");
    setStatus("payment");
  };

  const handlePaymentComplete = () => {
    setCheckoutStep("complete");
    setStatus("complete");
    toast.success("Transaction complete! Receipt sent.");
  };

  const handleNewTransaction = () => {
    clearCart();
    setShowBookingSearch(true);
    setCheckoutStep("cart");
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      {/* Top Nav */}
      <header className="flex items-center justify-between px-4 py-2.5 shadow-sm" style={{ background: NAV_BLUE }}>
        <div className="flex items-center gap-3">
          <span className="text-white font-bold text-lg tracking-tight">WaypointSync</span>
          <span className="text-slate-400 text-xs">|</span>
          <span className="text-slate-300 text-xs">Staff POS</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-300 text-xs">
            {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            {" · "}
            {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-teal-700 text-teal-100 font-medium">Staff: {staff.name}{staff.role === "Manager" ? " · MGR" : ""}</span>
          <button
            onClick={() => { sessionStorage.removeItem("wp_staff"); setStaff(null); }}
            className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300 hover:bg-red-800 hover:text-white transition-colors"
            title="Lock POS"
          >🔒 Lock</button>
          <a href="/display" target="_blank" className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors">
            Open Display ↗
          </a>
          <a href="/report" className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors">
            Daily Report
          </a>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT: Booking + Cart */}
        <div className="w-[380px] flex flex-col border-r border-slate-200 bg-white overflow-hidden">

          {/* Booking section */}
          <div className="border-b border-slate-200">
            {cart.booking && !showBookingSearch ? (
              <div className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Booking</p>
                  <button
                    onClick={() => { setBooking(null); setShowBookingSearch(true); }}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >Change</button>
                </div>
                <div className="rounded-lg p-3" style={{ background: "#f0f7f6", border: "1px solid #c3e0db" }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-slate-800">{cart.booking.customerName}</p>
                      <p className="text-xs text-slate-600">{cart.booking.tourName} · {cart.booking.tourTime}</p>
                      <p className="text-xs text-slate-500">Party of {cart.booking.partySize} · #{cart.booking.confirmationCode}</p>
                    </div>
                    <WaiverBadge signed={cart.booking.waiverSigned} count={cart.booking.waiverCount} partySize={cart.booking.partySize} />
                  </div>
                  {cart.booking.balanceDue > 0 && (
                    <div className="mt-2 pt-2 border-t border-teal-200">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">Tour deposit paid</span>
                        <span className="font-medium text-slate-700">${cart.booking.depositPaid.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs mt-0.5">
                        <span className="text-amber-700 font-medium">Balance due at check-in</span>
                        <span className="font-bold text-amber-700">${cart.booking.balanceDue.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-3">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Look Up Booking</p>
                <input
                  type="text"
                  placeholder="Name, confirmation code, or tour…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-teal-400 bg-slate-50"
                  autoFocus
                />
                <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto">
                  {filteredBookings.map(b => (
                    <BookingCard key={b.id} booking={b} onSelect={handleSelectBooking} />
                  ))}
                  {filteredBookings.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-3">No bookings found</p>
                  )}
                </div>
                <button
                  onClick={() => setShowBookingSearch(false)}
                  className="mt-2 w-full text-xs text-slate-400 hover:text-slate-600 py-1"
                >
                  Skip — Walk-in / Retail Only
                </button>
              </div>
            )}
          </div>

          {/* Cart */}
          <div className="flex-1 overflow-y-auto p-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Cart</p>

            {checkoutStep === "complete" ? (
              <div className="flex flex-col items-center justify-center h-40 gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-2xl">✓</div>
                <p className="font-semibold text-emerald-700">Transaction Complete</p>
                <p className="text-xs text-slate-400">Receipt sent · Lightspeed updated · FareHarbor checked in</p>
                <button
                  onClick={handleNewTransaction}
                  className="mt-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
                  style={{ background: TEAL }}
                >
                  New Transaction
                </button>
              </div>
            ) : checkoutStep === "payment" ? (
              <div className="flex flex-col items-center gap-3 py-2">
                <div className="w-full rounded-xl border-2 border-dashed border-blue-200 bg-blue-50 p-4 flex flex-col items-center gap-2">
                  <div className="text-3xl animate-pulse">💳</div>
                  <p className="font-bold text-slate-700">Swipe, Tap, or Insert Card</p>
                  <p className="text-lg font-bold text-slate-900">${grandTotal.toFixed(2)}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs bg-white border border-slate-200 rounded px-2 py-1 text-slate-500">💳 Swipe</span>
                    <span className="text-xs bg-white border border-slate-200 rounded px-2 py-1 text-slate-500">📱 Tap</span>
                    <span className="text-xs bg-white border border-slate-200 rounded px-2 py-1 text-slate-500">🔢 Insert</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Customer display is live ↗</p>
                </div>
                <button
                  onClick={handlePaymentComplete}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white shadow transition-colors"
                  style={{ background: TEAL }}
                >
                  ✓ Payment Received — Complete Sale
                </button>
                <button onClick={() => { setCheckoutStep("cart"); setStatus("active"); }} className="text-xs text-slate-400 hover:text-slate-600">
                  ← Back to Cart
                </button>
              </div>
            ) : (
              <>
                {cart.booking && cart.booking.balanceDue > 0 && (
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{cart.booking.tourName} — Balance</p>
                      <p className="text-xs text-slate-400">FareHarbor booking #{cart.booking.confirmationCode}</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-800">${cart.booking.balanceDue.toFixed(2)}</p>
                  </div>
                )}
                {cart.items.length === 0 && !cart.booking?.balanceDue && (
                  <p className="text-xs text-slate-400 text-center py-6">Add items from the catalog →</p>
                )}
                {cart.items.map(item => (
                  <CartRow key={item.id} item={item} onRemove={removeItem} onQty={updateQuantity} />
                ))}
              </>
            )}
          </div>

          {/* Totals + Charge */}
          {checkoutStep === "cart" && (
            <div className="border-t border-slate-200 p-3 bg-white">
              <div className="space-y-1 mb-3">
                {cart.booking && cart.booking.balanceDue > 0 && (
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Tour balance</span>
                    <span>${cart.booking.balanceDue.toFixed(2)}</span>
                  </div>
                )}
                {cart.items.length > 0 && (
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Retail / Food</span>
                    <span>${cart.items.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}</span>
                  </div>
                )}
                {tax > 0 && (
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Tax (7%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                )}
              {/* Tip selection */}
              {(cart.items.length > 0 || (cart.booking && cart.booking.balanceDue > 0)) && (
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs text-slate-400 mb-1.5">Add tip for guide</p>
                  <div className="flex gap-1.5">
                    {[0, 10, 15, 20].map(pct => (
                      <button
                        key={pct}
                        onClick={() => setTipPercent(tipPercent === pct ? null : pct)}
                        className="flex-1 py-1 rounded text-xs font-semibold transition-colors"
                        style={{
                          background: tipPercent === pct ? NAV_BLUE : "#F4F1EB",
                          color: tipPercent === pct ? "white" : "#5A6B7A",
                          border: `1px solid ${tipPercent === pct ? NAV_BLUE : "#E8E4DC"}`,
                        }}
                      >
                        {pct === 0 ? "No tip" : `${pct}%`}
                      </button>
                    ))}
                  </div>
                  {tipAmount > 0 && (
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>Tip ({tipPercent}%)</span>
                      <span>+${tipAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}
              <div className="flex justify-between font-bold text-slate-800 pt-1 border-t border-slate-100">
                <span>Total</span>
                <span className="text-lg">${grandTotal.toFixed(2)}</span>
              </div>
              </div>
              <button
                onClick={handleCharge}
                disabled={grandTotal === 0}
              className="w-full py-3 rounded-xl font-bold text-white text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: grandTotal > 0 ? NAV_BLUE : undefined }}
            >
                Charge ${grandTotal.toFixed(2)}
              </button>
              {!cart.booking?.waiverSigned && cart.booking && (
                <p className="text-xs text-red-500 text-center mt-1">⚠ Waiver required before checkout</p>
              )}
              {(cart.items.length > 0 || cart.booking) && (
                <button onClick={handleNewTransaction} className="w-full text-xs text-slate-400 hover:text-slate-600 mt-1 py-1">
                  Clear & Start Over
                </button>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: Product Catalog */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-200 bg-white">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">Add Items</p>
            <button
              onClick={() => setProductTab("retail")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${productTab === "retail" ? "text-white" : "text-slate-500 bg-slate-100 hover:bg-slate-200"}`}
              style={productTab === "retail" ? { background: NAV_BLUE } : {}}
            >
              Retail
            </button>
            <button
              onClick={() => setProductTab("food")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${productTab === "food" ? "text-white" : "text-slate-500 bg-slate-100 hover:bg-slate-200"}`}
              style={productTab === "food" ? { background: TEAL } : {}}
            >
              Food & Beverage
            </button>
            <span className="ml-auto flex items-center gap-1.5">
              <span className="text-xs text-slate-400">via</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: productTab === "food" ? "#00A88E22" : "#1B3A5C22", color: productTab === "food" ? "#00856F" : NAV_BLUE }}>
                {productTab === "food" ? "Square" : "Lightspeed"}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="Connected" />
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-3 gap-3 lg:grid-cols-4">
              {filteredProducts.map(product => (
                <button
                  key={product.id}
                  onClick={() => handleAddProduct(product)}
                  className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border border-slate-200 bg-white hover:border-teal-400 hover:shadow-md transition-all active:scale-95 text-center"
                >
                  <span className="text-2xl">{product.emoji}</span>
                  <span className="text-xs font-semibold text-slate-700 leading-tight">{product.name}</span>
                  <span className="text-sm font-bold" style={{ color: NAV_BLUE }}>${product.price.toFixed(2)}</span>
                  <span className="text-xs text-slate-400">{product.inStock} in stock</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
