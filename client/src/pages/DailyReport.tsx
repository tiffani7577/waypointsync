/**
 * WAYPOINTSYNC — Daily Report Screen
 * Replaces Joe's manual Excel download → Sage process.
 * Shows unified revenue across FareHarbor bookings + Lightspeed retail/food.
 * In production: pulls from FareHarbor API + Lightspeed API automatically.
 */

import { useState } from "react";

const NAV_BLUE = "#1B3A5C";
const TEAL = "#2A7D6F";
const AMBER = "#C2622D";

const MOCK_TRANSACTIONS = [
  { id: "WS-001", time: "9:02 AM", customer: "Martinez, Carlos", tour: "Guided Cave Tour", tourAmt: 0, retailAmt: 44.00, foodAmt: 5.00, tax: 3.43, total: 52.43, waiverOk: true, cashier: "Alex" },
  { id: "WS-002", time: "9:18 AM", customer: "Thompson, Sarah", tour: "Guided Cave Tour", tourAmt: 0, retailAmt: 22.00, foodAmt: 7.00, tax: 2.03, total: 31.03, waiverOk: true, cashier: "Alex" },
  { id: "WS-003", time: "10:45 AM", customer: "Walk-in", tour: "—", tourAmt: 0, retailAmt: 0, foodAmt: 11.50, tax: 0.81, total: 12.31, waiverOk: true, cashier: "Maria" },
  { id: "WS-004", time: "11:12 AM", customer: "Johnson, Mike", tour: "Kayak Adventure", tourAmt: 30.00, retailAmt: 28.00, foodAmt: 0, tax: 1.96, total: 59.96, waiverOk: false, cashier: "Alex" },
  { id: "WS-005", time: "1:05 PM", customer: "Williams, Emma", tour: "Guided Cave Tour", tourAmt: 0, retailAmt: 132.00, foodAmt: 21.00, tax: 10.71, total: 163.71, waiverOk: true, cashier: "Maria" },
  { id: "WS-006", time: "2:33 PM", customer: "Davis, Robert", tour: "Kayak Adventure", tourAmt: 80.00, retailAmt: 16.00, foodAmt: 8.50, tax: 1.72, total: 106.22, waiverOk: true, cashier: "Alex" },
  { id: "WS-007", time: "3:14 PM", customer: "Walk-in", tour: "—", tourAmt: 0, retailAmt: 50.00, foodAmt: 0, tax: 3.50, total: 53.50, waiverOk: true, cashier: "Maria" },
];

export default function DailyReport() {
  const [exported, setExported] = useState(false);

  const totals = MOCK_TRANSACTIONS.reduce(
    (acc, t) => ({
      tour: acc.tour + t.tourAmt,
      retail: acc.retail + t.retailAmt,
      food: acc.food + t.foodAmt,
      tax: acc.tax + t.tax,
      total: acc.total + t.total,
    }),
    { tour: 0, retail: 0, food: 0, tax: 0, total: 0 }
  );

  const handleExport = () => {
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 shadow-sm" style={{ background: NAV_BLUE }}>
        <div className="flex items-center gap-3">
          <a href="/pos" className="text-slate-400 hover:text-white text-sm transition-colors">← POS</a>
          <span className="text-white font-bold text-lg tracking-tight">WaypointSync</span>
          <span className="text-slate-400 text-xs">|</span>
          <span className="text-slate-300 text-xs">Daily Report</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-300 text-sm">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-6">

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Tour Revenue", value: totals.tour, color: NAV_BLUE, note: "via FareHarbor" },
            { label: "Retail Revenue", value: totals.retail, color: TEAL, note: "via Lightspeed" },
            { label: "Food & Beverage", value: totals.food, color: AMBER, note: "via Lightspeed" },
            { label: "Total Revenue", value: totals.total, color: "#1a1a2e", note: `${MOCK_TRANSACTIONS.length} transactions` },
          ].map(card => (
            <div key={card.label} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <p className="text-xs text-slate-400 mb-1">{card.label}</p>
              <p className="text-2xl font-bold" style={{ color: card.color }}>${card.value.toFixed(2)}</p>
              <p className="text-xs text-slate-400 mt-1">{card.note}</p>
            </div>
          ))}
        </div>

        {/* Sage Export Banner */}
        <div className="rounded-xl p-4 mb-6 flex items-center justify-between" style={{ background: "#f0f7f6", border: "1px solid #c3e0db" }}>
          <div>
            <p className="font-semibold text-slate-800 text-sm">Ready to sync to Sage</p>
            <p className="text-xs text-slate-500 mt-0.5">All {MOCK_TRANSACTIONS.length} transactions reconciled · No manual export needed</p>
          </div>
          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all"
            style={{ background: exported ? "#16a34a" : TEAL }}
          >
            {exported ? "✓ Synced to Sage" : "Sync to Sage →"}
          </button>
        </div>

        {/* Transaction Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <p className="font-semibold text-slate-700 text-sm">All Transactions</p>
            <p className="text-xs text-slate-400">{MOCK_TRANSACTIONS.length} transactions · Cashier register closed</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {["TX #", "Time", "Customer", "Tour", "Tour $", "Retail $", "Food $", "Tax", "Total", "Waiver", "Cashier"].map(h => (
                    <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_TRANSACTIONS.map((t, i) => (
                  <tr key={t.id} className={`border-b border-slate-50 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                    <td className="px-3 py-2 text-xs font-mono text-slate-500">{t.id}</td>
                    <td className="px-3 py-2 text-xs text-slate-500 whitespace-nowrap">{t.time}</td>
                    <td className="px-3 py-2 text-xs font-medium text-slate-700 whitespace-nowrap">{t.customer}</td>
                    <td className="px-3 py-2 text-xs text-slate-500 whitespace-nowrap">{t.tour}</td>
                    <td className="px-3 py-2 text-xs text-slate-700">{t.tourAmt > 0 ? `$${t.tourAmt.toFixed(2)}` : "—"}</td>
                    <td className="px-3 py-2 text-xs text-slate-700">{t.retailAmt > 0 ? `$${t.retailAmt.toFixed(2)}` : "—"}</td>
                    <td className="px-3 py-2 text-xs text-slate-700">{t.foodAmt > 0 ? `$${t.foodAmt.toFixed(2)}` : "—"}</td>
                    <td className="px-3 py-2 text-xs text-slate-500">${t.tax.toFixed(2)}</td>
                    <td className="px-3 py-2 text-xs font-bold text-slate-800">${t.total.toFixed(2)}</td>
                    <td className="px-3 py-2">
                      {t.waiverOk
                        ? <span className="text-xs text-emerald-600 font-medium">✓</span>
                        : <span className="text-xs text-red-500 font-medium">⚠</span>}
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-500">{t.cashier}</td>
                  </tr>
                ))}
                {/* Totals row */}
                <tr className="border-t-2 border-slate-200 bg-slate-50 font-bold">
                  <td colSpan={4} className="px-3 py-2 text-xs text-slate-500 uppercase tracking-wider">Day Total</td>
                  <td className="px-3 py-2 text-xs" style={{ color: NAV_BLUE }}>${totals.tour.toFixed(2)}</td>
                  <td className="px-3 py-2 text-xs" style={{ color: TEAL }}>${totals.retail.toFixed(2)}</td>
                  <td className="px-3 py-2 text-xs" style={{ color: AMBER }}>${totals.food.toFixed(2)}</td>
                  <td className="px-3 py-2 text-xs text-slate-600">${totals.tax.toFixed(2)}</td>
                  <td className="px-3 py-2 text-sm text-slate-800">${totals.total.toFixed(2)}</td>
                  <td colSpan={2} />
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-slate-400 text-center mt-6">
          WaypointSync · All transactions logged · Sequential numbering compliant with DEP concession requirements
        </p>
      </div>
    </div>
  );
}
