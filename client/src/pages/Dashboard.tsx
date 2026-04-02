/*
 * WAYPOINT OPERATOR DASHBOARD — Demo
 * Design: Dark sidebar (navy) + light content area (warm white)
 * Feel: "The one screen your operations manager opens at 7 AM"
 * Key: Ease of use first. Data that actually matters. No jargon.
 * Spider web connection visualization shows all systems talking through Waypoint.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { WaypointLogo, WaypointIcon } from "@/components/WaypointLogo";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
type View = "overview" | "bookings" | "inventory" | "waivers" | "reports" | "connections";

// ─── Simulated live data ──────────────────────────────────────────────────────
function useLiveData() {
  const [data, setData] = useState({
    bookingsToday: 247,
    capacity: { used: 247, total: 400 },
    revenue: { tours: 12480, retail: 3240, food: 1890, tips: 640 },
    waivers: { signed: 241, pending: 6, total: 247 },
    alerts: [
      { id: 1, type: "warning", msg: "6 waivers unsigned — 10 AM cave tour group", time: "2 min ago" },
      { id: 2, type: "info", msg: "Tandem kayak inventory: 3 units remaining today", time: "8 min ago" },
      { id: 3, type: "success", msg: "FareHarbor sync complete — 14 new bookings loaded", time: "12 min ago" },
    ],
    bookings: [
      { id: "FH-4821", name: "Martinez Family", tour: "Cave Tour — 10:00 AM", party: 4, waiver: true, paid: true, retail: "$48", source: "FareHarbor" },
      { id: "FH-4822", name: "Thompson, R.", tour: "Kayak Single — 10:30 AM", party: 1, waiver: true, paid: true, retail: "$0", source: "FareHarbor" },
      { id: "WI-0091", name: "Walk-in", tour: "Cave Tour — 11:00 AM", party: 2, waiver: false, paid: false, retail: "$0", source: "Walk-in" },
      { id: "FH-4823", name: "Patel Group", tour: "Tandem Kayak — 11:00 AM", party: 6, waiver: true, paid: true, retail: "$112", source: "FareHarbor" },
      { id: "FH-4824", name: "Chen, W.", tour: "Cave Tour — 11:30 AM", party: 3, waiver: true, paid: true, retail: "$24", source: "FareHarbor" },
      { id: "WI-0092", name: "Walk-in", tour: "Kayak Single — 12:00 PM", party: 1, waiver: false, paid: false, retail: "$0", source: "Walk-in" },
      { id: "FH-4825", name: "Rivera Family", tour: "Cave Tour — 1:00 PM", party: 5, waiver: true, paid: true, retail: "$65", source: "FareHarbor" },
    ],
    inventory: [
      { name: "Single Kayak", total: 18, available: 4, rented: 14, status: "low" },
      { name: "Tandem Kayak", total: 8, available: 3, rented: 5, status: "low" },
      { name: "Life Jacket (Adult)", total: 40, available: 22, rented: 18, status: "ok" },
      { name: "Life Jacket (Child)", total: 20, available: 11, rented: 9, status: "ok" },
      { name: "Paddle", total: 36, available: 12, rented: 24, status: "low" },
      { name: "Cave Tour Helmet", total: 30, available: 18, rented: 12, status: "ok" },
      { name: "Waypoint T-Shirt (M)", total: 24, available: 7, rented: 0, status: "low" },
      { name: "Waypoint T-Shirt (L)", total: 24, available: 14, rented: 0, status: "ok" },
      { name: "Waterproof Bag", total: 15, available: 9, rented: 6, status: "ok" },
    ],
  });

  // Simulate live ticking
  useEffect(() => {
    const interval = setInterval(() => {
      setData(d => ({
        ...d,
        bookingsToday: d.bookingsToday + (Math.random() > 0.7 ? 1 : 0),
        revenue: {
          ...d.revenue,
          tours: d.revenue.tours + Math.floor(Math.random() * 45),
          retail: d.revenue.retail + Math.floor(Math.random() * 12),
        },
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return data;
}

// ─── Connection Spider Web Canvas ─────────────────────────────────────────────
function ConnectionWeb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  const systems = [
    { name: "FareHarbor", color: "#1B3A5C", icon: "📅", x: 0.18, y: 0.22, status: "live" },
    { name: "Square POS", color: "#2A7D6F", icon: "💳", x: 0.82, y: 0.22, status: "live" },
    { name: "Lightspeed", color: "#C2622D", icon: "📦", x: 0.82, y: 0.78, status: "live" },
    { name: "Smartwaiver", color: "#6B4C9A", icon: "✍️", x: 0.18, y: 0.78, status: "live" },
    { name: "Stripe", color: "#5A6B7A", icon: "⚡", x: 0.50, y: 0.08, status: "live" },
  ];

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    timeRef.current += 0.012;
    const t = timeRef.current;

    ctx.clearRect(0, 0, W, H);

    // Draw connection lines with animated pulses
    systems.forEach((sys, i) => {
      const sx = sys.x * W;
      const sy = sys.y * H;

      // Line from system to center
      const grad = ctx.createLinearGradient(sx, sy, cx, cy);
      grad.addColorStop(0, sys.color + "44");
      grad.addColorStop(1, sys.color + "99");
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(cx, cy);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Animated pulse dot traveling from system to center
      const phase = (t * 0.8 + i * 0.4) % 1;
      const px = sx + (cx - sx) * phase;
      const py = sy + (cy - sy) * phase;
      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = sys.color;
      ctx.globalAlpha = 1 - phase * 0.5;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Second pulse offset
      const phase2 = (t * 0.8 + i * 0.4 + 0.5) % 1;
      const px2 = sx + (cx - sx) * phase2;
      const py2 = sy + (cy - sy) * phase2;
      ctx.beginPath();
      ctx.arc(px2, py2, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = sys.color;
      ctx.globalAlpha = (1 - phase2 * 0.5) * 0.6;
      ctx.fill();
      ctx.globalAlpha = 1;

      // System node
      ctx.beginPath();
      ctx.arc(sx, sy, 22, 0, Math.PI * 2);
      ctx.fillStyle = sys.color + "18";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(sx, sy, 22, 0, Math.PI * 2);
      ctx.strokeStyle = sys.color + "66";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Pulsing outer ring
      const pulse = Math.sin(t * 1.5 + i) * 0.5 + 0.5;
      ctx.beginPath();
      ctx.arc(sx, sy, 22 + pulse * 8, 0, Math.PI * 2);
      ctx.strokeStyle = sys.color + Math.round(pulse * 40).toString(16).padStart(2, "0");
      ctx.lineWidth = 1;
      ctx.stroke();

      // System label
      ctx.font = "600 11px 'DM Sans', sans-serif";
      ctx.fillStyle = "#1B3A5C";
      ctx.textAlign = "center";
      const labelY = sys.y < 0.5 ? sy + 38 : sy - 30;
      ctx.fillText(sys.name, sx, labelY);

      // Live dot
      ctx.beginPath();
      ctx.arc(sx + 16, sy - 16, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#2A7D6F";
      ctx.fill();
    });

    // Central Waypoint node
    const centerPulse = Math.sin(t * 2) * 0.5 + 0.5;
    // Outer glow rings
    [48, 40, 32].forEach((r, i) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r + centerPulse * 6, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(42, 125, 111, ${0.08 + i * 0.04})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    // Main circle
    ctx.beginPath();
    ctx.arc(cx, cy, 30, 0, Math.PI * 2);
    const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30);
    centerGrad.addColorStop(0, "#2A7D6F");
    centerGrad.addColorStop(1, "#1B3A5C");
    ctx.fillStyle = centerGrad;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, 30, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(126,207,196,0.5)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // "W" text in center
    ctx.font = "bold 18px 'Playfair Display', serif";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("W", cx, cy);
    ctx.textBaseline = "alphabetic";

    animRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);
    animRef.current = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [draw]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
      {/* Status legend */}
      <div style={{
        position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: "1.5rem", background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(8px)", borderRadius: "2rem", padding: "0.5rem 1.25rem",
        border: "1px solid #E8E4DC", flexWrap: "wrap", justifyContent: "center",
      }}>
        {[
          { name: "FareHarbor", color: "#1B3A5C" },
          { name: "Square", color: "#2A7D6F" },
          { name: "Lightspeed", color: "#C2622D" },
          { name: "Smartwaiver", color: "#6B4C9A" },
          { name: "Stripe", color: "#5A6B7A" },
        ].map(s => (
          <div key={s.name} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#1B3A5C", fontWeight: 500 }}>{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ view, setView }: { view: View; setView: (v: View) => void }) {
  const navItems: { id: View; label: string; icon: string; badge?: number }[] = [
    { id: "overview", label: "Overview", icon: "◉" },
    { id: "connections", label: "Connections", icon: "⬡" },
    { id: "bookings", label: "Bookings", icon: "📅", badge: 6 },
    { id: "inventory", label: "Inventory", icon: "📦" },
    { id: "waivers", label: "Waivers", icon: "✍️", badge: 6 },
    { id: "reports", label: "Reports", icon: "📊" },
  ];

  return (
    <aside style={{
      width: 220, flexShrink: 0,
      background: "#1B3A5C",
      display: "flex", flexDirection: "column",
      height: "100vh", position: "sticky", top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: "1.5rem 1.25rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <WaypointLogo size={24} light />
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", marginTop: "0.3rem", letterSpacing: "0.06em" }}>
          OPERATOR DASHBOARD
        </div>
      </div>

      {/* Location selector */}
      <div style={{ padding: "0.75rem 1rem", margin: "0.75rem 0.75rem 0", background: "rgba(255,255,255,0.06)", borderRadius: "0.5rem" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.3rem" }}>Location</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.88rem", color: "white" }}>Silver Springs, FL</div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.25rem" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2A7D6F" }} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.5)" }}>All systems live</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0.75rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0.65rem 0.85rem", borderRadius: "0.5rem", border: "none",
              background: view === item.id ? "rgba(42,125,111,0.25)" : "transparent",
              cursor: "pointer", width: "100%", textAlign: "left",
              transition: "background 0.15s ease",
              borderLeft: view === item.id ? "3px solid #2A7D6F" : "3px solid transparent",
            }}
            onMouseEnter={e => { if (view !== item.id) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
            onMouseLeave={e => { if (view !== item.id) e.currentTarget.style.background = "transparent"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
              <span style={{ fontSize: "0.9rem", opacity: 0.8 }}>{item.icon}</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: view === item.id ? 600 : 400, fontSize: "0.88rem", color: view === item.id ? "white" : "rgba(255,255,255,0.65)" }}>{item.label}</span>
            </div>
            {item.badge && (
              <span style={{ background: "#C2622D", color: "white", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.65rem", padding: "0.1rem 0.45rem", borderRadius: "1rem" }}>{item.badge}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>
          Demo Mode · Cape Leisure Corp
        </div>
        <a href="/" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "rgba(126,207,196,0.7)", textDecoration: "none", display: "block", marginTop: "0.4rem" }}>
          ← Back to site
        </a>
      </div>
    </aside>
  );
}

// ─── Overview ─────────────────────────────────────────────────────────────────
function Overview({ data }: { data: ReturnType<typeof useLiveData> }) {
  const revenueTotal = Object.values(data.revenue).reduce((a, b) => a + b, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Alerts */}
      {data.alerts.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {data.alerts.map(alert => (
            <div key={alert.id} style={{
              display: "flex", alignItems: "flex-start", gap: "0.75rem",
              padding: "0.85rem 1rem", borderRadius: "0.5rem",
              background: alert.type === "warning" ? "#FFF8F0" : alert.type === "success" ? "#F0FAF7" : "#F4F8FF",
              border: `1px solid ${alert.type === "warning" ? "#F0C080" : alert.type === "success" ? "#A0D8CC" : "#C0D4F0"}`,
            }}>
              <span style={{ fontSize: "1rem", flexShrink: 0 }}>{alert.type === "warning" ? "⚠️" : alert.type === "success" ? "✅" : "ℹ️"}</span>
              <div style={{ flex: 1 }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "0.88rem", color: "#1B3A5C" }}>{alert.msg}</span>
              </div>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "#5A6B7A", flexShrink: 0 }}>{alert.time}</span>
            </div>
          ))}
        </div>
      )}

      {/* KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Bookings Today", val: data.bookingsToday.toString(), sub: `${data.capacity.used} of ${data.capacity.total} capacity`, color: "#1B3A5C", trend: "+14 vs yesterday" },
          { label: "Total Revenue", val: `$${revenueTotal.toLocaleString()}`, sub: "Tours + Retail + Food + Tips", color: "#2A7D6F", trend: "+8% vs last Sat" },
          { label: "Waivers Signed", val: `${data.waivers.signed}/${data.waivers.total}`, sub: `${data.waivers.pending} still pending`, color: data.waivers.pending > 0 ? "#C2622D" : "#2A7D6F", trend: data.waivers.pending > 0 ? "⚠️ Action needed" : "All clear" },
          { label: "Capacity Used", val: `${Math.round(data.capacity.used / data.capacity.total * 100)}%`, sub: `${data.capacity.total - data.capacity.used} slots remaining`, color: "#1B3A5C", trend: "Trending full by 2 PM" },
        ].map(kpi => (
          <div key={kpi.label} style={{ background: "white", border: "1px solid #E8E4DC", borderRadius: "0.75rem", padding: "1.25rem", borderTop: `3px solid ${kpi.color}` }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#5A6B7A", marginBottom: "0.4rem", fontWeight: 500 }}>{kpi.label}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: "1.7rem", color: kpi.color, marginBottom: "0.3rem" }}>{kpi.val}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#5A6B7A", marginBottom: "0.4rem" }}>{kpi.sub}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "#2A7D6F", fontWeight: 600 }}>{kpi.trend}</div>
          </div>
        ))}
      </div>

      {/* Revenue breakdown */}
      <div style={{ background: "white", border: "1px solid #E8E4DC", borderRadius: "0.75rem", padding: "1.5rem" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#1B3A5C", marginBottom: "1.25rem" }}>Revenue Breakdown — Today</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {[
            { label: "Tour Bookings", val: data.revenue.tours, color: "#1B3A5C", pct: data.revenue.tours / revenueTotal },
            { label: "Retail Sales", val: data.revenue.retail, color: "#2A7D6F", pct: data.revenue.retail / revenueTotal },
            { label: "Food & Beverage", val: data.revenue.food, color: "#C2622D", pct: data.revenue.food / revenueTotal },
            { label: "Guide Tips", val: data.revenue.tips, color: "#6B4C9A", pct: data.revenue.tips / revenueTotal },
          ].map(row => (
            <div key={row.label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#3A4A5A" }}>{row.label}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", fontWeight: 600, color: "#1B3A5C" }}>${row.val.toLocaleString()}</span>
              </div>
              <div style={{ height: 6, background: "#F4F1EB", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${row.pct * 100}%`, background: row.color, borderRadius: 3, transition: "width 0.8s ease" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ background: "white", border: "1px solid #E8E4DC", borderRadius: "0.75rem", padding: "1.5rem" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#1B3A5C", marginBottom: "1rem" }}>Quick Actions</div>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {[
            { label: "Add Walk-in Booking", color: "#1B3A5C" },
            { label: "Send Waiver Reminder", color: "#C2622D" },
            { label: "Check Inventory", color: "#2A7D6F" },
            { label: "Export Today's Report", color: "#5A6B7A" },
          ].map(action => (
            <button
              key={action.label}
              onClick={() => toast.success(`${action.label} — feature coming in v1.0`)}
              style={{
                background: action.color + "12", border: `1px solid ${action.color}33`,
                color: action.color, fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                fontSize: "0.82rem", padding: "0.6rem 1rem", borderRadius: "0.375rem",
                cursor: "pointer", transition: "all 0.15s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = action.color + "22"; }}
              onMouseLeave={e => { e.currentTarget.style.background = action.color + "12"; }}
            >{action.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Bookings View ────────────────────────────────────────────────────────────
function BookingsView({ data }: { data: ReturnType<typeof useLiveData> }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ background: "white", border: "1px solid #E8E4DC", borderRadius: "0.75rem", overflow: "hidden" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #F4F1EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#1B3A5C" }}>Today's Bookings</div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <span style={{ background: "#F4F1EB", fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", fontWeight: 600, color: "#5A6B7A", padding: "0.25rem 0.75rem", borderRadius: "1rem" }}>
              {data.bookings.filter(b => !b.waiver).length} need waivers
            </span>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#FAFAF8" }}>
                {["Booking ID", "Guest", "Tour / Time", "Party", "Waiver", "Paid", "Retail", "Source"].map(h => (
                  <th key={h} style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.72rem", color: "#5A6B7A", textAlign: "left", padding: "0.75rem 1rem", letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.bookings.map((b, i) => (
                <tr key={b.id} style={{ borderTop: "1px solid #F4F1EB", background: i % 2 === 0 ? "white" : "#FAFAF8" }}>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "#1B3A5C", padding: "0.85rem 1rem", fontWeight: 600 }}>{b.id}</td>
                  <td style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#1B3A5C", padding: "0.85rem 1rem", fontWeight: 500 }}>{b.name}</td>
                  <td style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "#3A4A5A", padding: "0.85rem 1rem", whiteSpace: "nowrap" }}>{b.tour}</td>
                  <td style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#3A4A5A", padding: "0.85rem 1rem", textAlign: "center" }}>{b.party}</td>
                  <td style={{ padding: "0.85rem 1rem" }}>
                    <span style={{ background: b.waiver ? "#F0FAF7" : "#FFF0EC", color: b.waiver ? "#2A7D6F" : "#C2622D", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.72rem", padding: "0.2rem 0.6rem", borderRadius: "1rem" }}>
                      {b.waiver ? "Signed" : "Pending"}
                    </span>
                  </td>
                  <td style={{ padding: "0.85rem 1rem" }}>
                    <span style={{ background: b.paid ? "#F0FAF7" : "#F4F8FF", color: b.paid ? "#2A7D6F" : "#5A6B7A", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.72rem", padding: "0.2rem 0.6rem", borderRadius: "1rem" }}>
                      {b.paid ? "Paid" : "Unpaid"}
                    </span>
                  </td>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.82rem", color: b.retail !== "$0" ? "#2A7D6F" : "#5A6B7A", padding: "0.85rem 1rem", fontWeight: b.retail !== "$0" ? 600 : 400 }}>{b.retail}</td>
                  <td style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "#5A6B7A", padding: "0.85rem 1rem" }}>{b.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Inventory View ───────────────────────────────────────────────────────────
function InventoryView({ data }: { data: ReturnType<typeof useLiveData> }) {
  return (
    <div style={{ background: "white", border: "1px solid #E8E4DC", borderRadius: "0.75rem", overflow: "hidden" }}>
      <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #F4F1EB" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#1B3A5C" }}>Live Inventory — Silver Springs</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "#5A6B7A", marginTop: "0.25rem" }}>Synced from Square + Lightspeed in real time</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {data.inventory.map((item, i) => (
          <div key={item.name} style={{
            display: "flex", alignItems: "center", gap: "1rem",
            padding: "1rem 1.5rem", borderTop: i > 0 ? "1px solid #F4F1EB" : "none",
            background: item.status === "low" ? "#FFF8F4" : "white",
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "0.88rem", color: "#1B3A5C" }}>{item.name}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#5A6B7A", marginTop: "0.2rem" }}>
                {item.rented > 0 ? `${item.rented} out` : "In stock"} · {item.available} available of {item.total}
              </div>
            </div>
            <div style={{ width: 120 }}>
              <div style={{ height: 6, background: "#F4F1EB", borderRadius: 3, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${(item.available / item.total) * 100}%`,
                  background: item.status === "low" ? "#C2622D" : "#2A7D6F",
                  borderRadius: 3,
                }} />
              </div>
            </div>
            <span style={{
              background: item.status === "low" ? "#FFF0EC" : "#F0FAF7",
              color: item.status === "low" ? "#C2622D" : "#2A7D6F",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.7rem",
              padding: "0.2rem 0.6rem", borderRadius: "1rem", whiteSpace: "nowrap",
            }}>
              {item.status === "low" ? "Low Stock" : "OK"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Waivers View ─────────────────────────────────────────────────────────────
function WaiversView({ data }: { data: ReturnType<typeof useLiveData> }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
        {[
          { label: "Signed Today", val: data.waivers.signed, color: "#2A7D6F" },
          { label: "Pending", val: data.waivers.pending, color: "#C2622D" },
          { label: "Total Bookings", val: data.waivers.total, color: "#1B3A5C" },
        ].map(s => (
          <div key={s.label} style={{ background: "white", border: "1px solid #E8E4DC", borderRadius: "0.75rem", padding: "1.25rem", textAlign: "center" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: "2rem", color: s.color }}>{s.val}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "#5A6B7A", marginTop: "0.3rem" }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#FFF8F4", border: "1px solid #F0C080", borderRadius: "0.75rem", padding: "1.25rem 1.5rem" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.88rem", color: "#C2622D", marginBottom: "0.75rem" }}>⚠️ Action Required — 6 Unsigned Waivers</div>
        {data.bookings.filter(b => !b.waiver).map(b => (
          <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0", borderBottom: "1px solid #F0E0D0" }}>
            <div>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "#1B3A5C" }}>{b.name}</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "#5A6B7A", marginLeft: "0.75rem" }}>{b.tour}</span>
            </div>
            <button
              onClick={() => toast.success(`Waiver reminder sent to ${b.name}`)}
              style={{ background: "#C2622D", color: "white", border: "none", borderRadius: "0.375rem", padding: "0.4rem 0.85rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.75rem", cursor: "pointer" }}
            >Send Reminder</button>
          </div>
        ))}
      </div>
      <div style={{ background: "white", border: "1px solid #E8E4DC", borderRadius: "0.75rem", padding: "1.25rem 1.5rem" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.88rem", color: "#1B3A5C", marginBottom: "0.5rem" }}>Storage & Compliance</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#5A6B7A", lineHeight: 1.7 }}>
          All waivers stored via Smartwaiver — AES-256 encrypted, timestamped, chain of custody maintained. Meets 2-year retention requirements across all Florida jurisdictions. Exportable on demand for insurance or legal review.
        </div>
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", flexWrap: "wrap" }}>
          <button onClick={() => toast.success("Export feature available in v1.0")} style={{ background: "#1B3A5C12", border: "1px solid #1B3A5C33", color: "#1B3A5C", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.8rem", padding: "0.5rem 1rem", borderRadius: "0.375rem", cursor: "pointer" }}>Export All Waivers (PDF)</button>
          <button onClick={() => toast.success("Compliance report available in v1.0")} style={{ background: "#2A7D6F12", border: "1px solid #2A7D6F33", color: "#2A7D6F", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.8rem", padding: "0.5rem 1rem", borderRadius: "0.375rem", cursor: "pointer" }}>Compliance Report</button>
        </div>
      </div>
    </div>
  );
}

// ─── Reports View ─────────────────────────────────────────────────────────────
function ReportsView({ data }: { data: ReturnType<typeof useLiveData> }) {
  const revenueTotal = Object.values(data.revenue).reduce((a, b) => a + b, 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ background: "white", border: "1px solid #E8E4DC", borderRadius: "0.75rem", padding: "1.5rem" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#1B3A5C", marginBottom: "1.25rem" }}>The Report Your Accountant Has Been Asking For</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          {[
            { label: "Revenue per Visitor", val: `$${(revenueTotal / data.bookingsToday).toFixed(2)}`, note: "All revenue streams combined", color: "#1B3A5C" },
            { label: "Retail Attach Rate", val: `${Math.round(data.bookings.filter(b => b.retail !== "$0").length / data.bookings.length * 100)}%`, note: "Bookings with retail purchase", color: "#2A7D6F" },
            { label: "Avg Party Size", val: (data.bookings.reduce((a, b) => a + b.party, 0) / data.bookings.length).toFixed(1), note: "Informs capacity planning", color: "#C2622D" },
            { label: "Waiver Compliance", val: `${Math.round(data.waivers.signed / data.waivers.total * 100)}%`, note: "Signed before activity", color: "#6B4C9A" },
          ].map(m => (
            <div key={m.label} style={{ background: "#FAFAF8", borderRadius: "0.5rem", padding: "1rem", borderLeft: `3px solid ${m.color}` }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#5A6B7A", marginBottom: "0.3rem" }}>{m.label}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: "1.5rem", color: m.color }}>{m.val}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "#5A6B7A", marginTop: "0.25rem" }}>{m.note}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "#1B3A5C", borderRadius: "0.75rem", padding: "1.5rem", color: "white" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "white", marginBottom: "0.5rem" }}>Equipment Purchasing Intelligence</div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: "1rem" }}>
          Based on the last 30 days: Single kayaks are at 78% utilization on weekends. Tandem kayaks hit 100% by 11 AM every Saturday. Waypoint recommends ordering 4 additional tandem kayaks before peak season.
        </p>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "#7ECFC4" }}>
          Projected ROI on 4 tandem kayaks: $18,400 / season at current booking rate
        </div>
      </div>
    </div>
  );
}

// ─── Connections View ─────────────────────────────────────────────────────────
function ConnectionsView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ background: "white", border: "1px solid #E8E4DC", borderRadius: "0.75rem", padding: "1.25rem 1.5rem" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#1B3A5C", marginBottom: "0.25rem" }}>System Connection Map</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "#5A6B7A" }}>All data flows through Waypoint in real time. Every pulse is a live sync event.</div>
      </div>
      <div style={{ background: "white", border: "1px solid #E8E4DC", borderRadius: "0.75rem", overflow: "hidden" }}>
        <div style={{ height: 420 }}>
          <ConnectionWeb />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
        {[
          { name: "FareHarbor", status: "Live", lastSync: "0.4s ago", events: "14 bookings synced today", color: "#1B3A5C" },
          { name: "Square POS", status: "Live", lastSync: "1.1s ago", events: "89 transactions processed", color: "#2A7D6F" },
          { name: "Lightspeed", status: "Live", lastSync: "2.3s ago", events: "Inventory updated 12x", color: "#C2622D" },
          { name: "Smartwaiver", status: "Live", lastSync: "0.8s ago", events: "241 waivers stored", color: "#6B4C9A" },
          { name: "Stripe", status: "Live", lastSync: "0.2s ago", events: "$18,250 processed today", color: "#5A6B7A" },
        ].map(s => (
          <div key={s.name} style={{ background: "white", border: "1px solid #E8E4DC", borderRadius: "0.75rem", padding: "1.25rem", borderLeft: `3px solid ${s.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#1B3A5C" }}>{s.name}</div>
              <span style={{ background: "#F0FAF7", color: "#2A7D6F", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.68rem", padding: "0.15rem 0.5rem", borderRadius: "1rem" }}>● {s.status}</span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#5A6B7A", marginBottom: "0.3rem" }}>Last sync: {s.lastSync}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "#3A4A5A" }}>{s.events}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [view, setView] = useState<View>("overview");
  const data = useLiveData();

  const viewTitles: Record<View, { title: string; sub: string }> = {
    overview: { title: "Good morning, Cape Leisure.", sub: "Here's what's happening at Silver Springs right now." },
    connections: { title: "System Connections", sub: "Every system talking through Waypoint, live." },
    bookings: { title: "Today's Bookings", sub: `${data.bookingsToday} bookings · ${data.waivers.pending} waivers pending` },
    inventory: { title: "Live Inventory", sub: "Synced from Square + Lightspeed in real time." },
    waivers: { title: "Waiver Status", sub: `${data.waivers.signed} signed · ${data.waivers.pending} still pending` },
    reports: { title: "Operator Reports", sub: "The data that actually runs your business." },
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F4F1EB", fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar view={view} setView={setView} />

      {/* Main content */}
      <main style={{ flex: 1, overflow: "auto", minWidth: 0 }}>
        {/* Top bar */}
        <div style={{
          background: "white", borderBottom: "1px solid #E8E4DC",
          padding: "1rem 1.75rem", display: "flex", justifyContent: "space-between", alignItems: "center",
          position: "sticky", top: 0, zIndex: 10,
        }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: "#1B3A5C", margin: 0, fontWeight: 700 }}>{viewTitles[view].title}</h1>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "#5A6B7A", marginTop: "0.15rem" }}>{viewTitles[view].sub}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#F0FAF7", border: "1px solid #A0D8CC", borderRadius: "2rem", padding: "0.4rem 0.85rem" }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#2A7D6F" }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.75rem", color: "#2A7D6F" }}>All systems live</span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "#5A6B7A" }}>
              {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "1.75rem" }}>
          {view === "overview" && <Overview data={data} />}
          {view === "connections" && <ConnectionsView />}
          {view === "bookings" && <BookingsView data={data} />}
          {view === "inventory" && <InventoryView data={data} />}
          {view === "waivers" && <WaiversView data={data} />}
          {view === "reports" && <ReportsView data={data} />}
        </div>
      </main>
    </div>
  );
}
