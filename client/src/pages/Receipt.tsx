/**
 * WAYPOINTSYNC — Printable Receipt
 * Opened in a new tab from the POS complete screen.
 * Reads receipt data from sessionStorage (set by POS on completion).
 */

import { useEffect, useState } from "react";

interface ReceiptData {
  transactionId: string;
  timestamp: string;
  staff: string;
  booking: {
    customerName: string;
    tourName: string;
    tourTime: string;
    partySize: number;
    confirmationCode: string;
    balanceDue: number;
    waiverSigned: boolean;
    waiverCount: number;
  } | null;
  items: { name: string; price: number; quantity: number; type: string }[];
  subtotal: number;
  tax: number;
  tipPercent: number | null;
  tipAmount: number;
  grandTotal: number;
}

export default function Receipt() {
  const [data, setData] = useState<ReceiptData | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("wp_receipt");
      if (raw) setData(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen text-slate-500 text-sm">
        No receipt data found. Please complete a transaction first.
      </div>
    );
  }

  const date = new Date(data.timestamp);
  const dateStr = date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const timeStr = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const tourItems = data.items.filter(i => i.type === "tour");
  const retailItems = data.items.filter(i => i.type === "retail");
  const foodItems = data.items.filter(i => i.type === "food");

  return (
    <div className="min-h-screen bg-white print:bg-white">
      {/* Print button — hidden when printing */}
      <div className="print:hidden flex justify-end gap-2 p-4 border-b border-slate-200 bg-slate-50">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ background: "#2A7D6F" }}
        >
          🖨 Print Receipt
        </button>
        <button
          onClick={() => window.close()}
          className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-100"
        >
          Close
        </button>
      </div>

      {/* Receipt body */}
      <div className="max-w-sm mx-auto py-8 px-6 font-mono text-sm text-slate-800">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-xl font-bold tracking-tight mb-0.5" style={{ fontFamily: "serif" }}>WaypointSync</div>
          <div className="text-xs text-slate-500">Outdoor Recreation Point of Sale</div>
          <div className="text-xs text-slate-400 mt-1">{dateStr}</div>
          <div className="text-xs text-slate-400">{timeStr}</div>
          <div className="text-xs text-slate-400 mt-1">TXN: {data.transactionId}</div>
          <div className="text-xs text-slate-400">Staff: {data.staff}</div>
        </div>

        <div className="border-t border-dashed border-slate-300 my-3" />

        {/* Booking info */}
        {data.booking && (
          <>
            <div className="mb-3">
              <div className="font-bold text-slate-800 text-base">{data.booking.customerName}</div>
              <div className="text-xs text-slate-500">{data.booking.tourName}</div>
              <div className="text-xs text-slate-500">{data.booking.tourTime} · Party of {data.booking.partySize}</div>
              <div className="text-xs text-slate-400">Conf: #{data.booking.confirmationCode}</div>
              <div className="mt-1">
                {data.booking.waiverSigned ? (
                  <span className="text-xs text-emerald-700 font-semibold">✓ Waiver Signed ({data.booking.waiverCount}/{data.booking.partySize})</span>
                ) : (
                  <span className="text-xs text-red-600 font-semibold">⚠ Waiver Not On File</span>
                )}
              </div>
            </div>
            <div className="border-t border-dashed border-slate-300 my-3" />
          </>
        )}

        {/* Line items — Tour / Balance */}
        {data.booking && data.booking.balanceDue > 0 && (
          <>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tour Balance</div>
            <div className="flex justify-between text-sm mb-0.5">
              <span>{data.booking.tourName} balance</span>
              <span>${data.booking.balanceDue.toFixed(2)}</span>
            </div>
            <div className="border-t border-dashed border-slate-300 my-3" />
          </>
        )}

        {/* Retail items */}
        {retailItems.length > 0 && (
          <>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Retail</div>
            {retailItems.map((item, i) => (
              <div key={i} className="flex justify-between text-sm mb-0.5">
                <span>{item.quantity > 1 ? `${item.name} ×${item.quantity}` : item.name}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-dashed border-slate-300 my-3" />
          </>
        )}

        {/* Food items */}
        {foodItems.length > 0 && (
          <>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Food & Beverage</div>
            {foodItems.map((item, i) => (
              <div key={i} className="flex justify-between text-sm mb-0.5">
                <span>{item.quantity > 1 ? `${item.name} ×${item.quantity}` : item.name}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-dashed border-slate-300 my-3" />
          </>
        )}

        {/* Totals */}
        <div className="space-y-0.5 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span>${data.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Tax (8.5%)</span>
            <span>${data.tax.toFixed(2)}</span>
          </div>
          {data.tipAmount > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>Tip{data.tipPercent ? ` (${data.tipPercent}%)` : ""}</span>
              <span>${data.tipAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-slate-300 my-1" />
          <div className="flex justify-between font-bold text-base text-slate-900">
            <span>TOTAL</span>
            <span>${data.grandTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-0.5">
            <span>Payment Method</span>
            <span>Card (Approved)</span>
          </div>
        </div>

        <div className="border-t border-dashed border-slate-300 my-4" />

        {/* Footer */}
        <div className="text-center text-xs text-slate-400 space-y-1">
          <p>Thank you for your visit!</p>
          <p>Waivers retained for 2 years per state requirements.</p>
          <p className="text-slate-300">Powered by WaypointSync</p>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { margin: 0; }
          @page { size: 80mm auto; margin: 0; }
        }
      `}</style>
    </div>
  );
}
