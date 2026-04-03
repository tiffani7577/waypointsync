/*
 * WAYPOINT HOME PAGE
 * Design: Coastal Operator — White base, deep navy, teal, amber
 * Fonts: Playfair Display (headlines) + DM Sans (body) + JetBrains Mono (data)
 * Philosophy: On the operator's side. Relief from the chaos.
 */

import { useState, useEffect, useRef } from "react";
import { WaypointLogo, WaypointIcon } from "@/components/WaypointLogo";
import { toast } from "sonner";

// ─── Scroll animation hook ───────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = [
    { label: "The Problem", href: "#problem" },
    { label: "How It Works", href: "#how" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Compliance", href: "#compliance" },
  ];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(250,250,248,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid #E8E4DC" : "none",
      transition: "all 0.3s ease",
      padding: "0 1.25rem",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        <a href="#" style={{ textDecoration: "none" }}>
          <WaypointLogo size={28} light={!scrolled && false} />
        </a>
        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }} className="hidden md:flex">
          {links.map(l => (
            <a key={l.href} href={l.href} style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "0.9rem",
              color: "#1B3A5C", textDecoration: "none", opacity: 0.8,
              transition: "opacity 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "0.8")}
            >{l.label}</a>
          ))}
          <a href="#access" className="wp-btn-primary" style={{ padding: "0.6rem 1.4rem", fontSize: "0.88rem" }}>
            Request Early Access
          </a>
        </div>
        {/* Mobile hamburger */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", padding: "0.5rem" }}>
          <div style={{ width: 22, height: 2, background: "#1B3A5C", marginBottom: 5, borderRadius: 2 }} />
          <div style={{ width: 22, height: 2, background: "#1B3A5C", marginBottom: 5, borderRadius: 2 }} />
          <div style={{ width: 22, height: 2, background: "#1B3A5C", borderRadius: 2 }} />
        </button>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: "white", borderTop: "1px solid #E8E4DC", padding: "1rem 1.25rem 1.5rem" }}>
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{
              display: "block", fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              fontSize: "1rem", color: "#1B3A5C", textDecoration: "none",
              padding: "0.75rem 0", borderBottom: "1px solid #F4F1EB",
            }}>{l.label}</a>
          ))}
          <a href="#access" className="wp-btn-primary" style={{ display: "block", textAlign: "center", marginTop: "1rem" }}>
            Request Early Access
          </a>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden" }}>
      {/* Background image */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663413300520/j8y9B2NVZ2HEf3Lc2oFy9R/waypoint-hero-v2-Gm7AQ8braciaBgEX8b8ghd.webp)`,
        backgroundSize: "cover", backgroundPosition: "center",
      }} />
      {/* Gradient overlay — dark at bottom for text legibility */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(27,58,92,0.15) 0%, rgba(27,58,92,0.4) 50%, rgba(27,42,58,0.88) 100%)",
      }} />
      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: 1280, margin: "0 auto", padding: "0 1.25rem 5rem", width: "100%" }}>
        <div style={{ maxWidth: 760 }}>
          {/* Live badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(42,125,111,0.2)", border: "1px solid rgba(42,125,111,0.4)", borderRadius: "2rem", padding: "0.4rem 1rem", marginBottom: "1.75rem" }}>
            <span className="pulse-dot" />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", fontWeight: 600, color: "#7ECFC4", letterSpacing: "0.08em", textTransform: "uppercase" }}>Now in Early Access</span>
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontWeight: 700,
            fontSize: "clamp(2.4rem, 5.5vw, 4.2rem)", lineHeight: 1.12,
            color: "white", marginBottom: "1.5rem", letterSpacing: "-0.02em",
          }}>
            Your booking system<br />
            <em style={{ fontStyle: "italic", color: "#7ECFC4" }}>doesn't know</em> your<br />
            register exists.
          </h1>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
            fontSize: "clamp(1rem, 2vw, 1.2rem)", color: "rgba(255,255,255,0.82)",
            maxWidth: 580, lineHeight: 1.7, marginBottom: "2.5rem",
          }}>
            Waypoint is the operating layer that connects FareHarbor, Lightspeed, Smartwaiver, and Sage — so your staff runs one transaction on one screen, your inventory stays honest, and you finally get the report that tells you what's actually happening.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <a href="#access" style={{
              background: "#2A7D6F", color: "white",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.95rem",
              padding: "0.9rem 2rem", borderRadius: "0.375rem", textDecoration: "none",
              transition: "all 0.2s ease", display: "inline-flex", alignItems: "center", gap: "0.5rem",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#3A9D8F"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#2A7D6F"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Request Early Access →
            </a>
            <a href="/dashboard" style={{
              background: "rgba(255,255,255,0.15)", color: "white",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.95rem",
              padding: "0.9rem 2rem", borderRadius: "0.375rem", textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.35)", transition: "all 0.2s ease",
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.25)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
            >
              ⬡ Live Demo
            </a>
            <a href="#how" style={{
              background: "rgba(255,255,255,0.12)", color: "white",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "0.95rem",
              padding: "0.9rem 2rem", borderRadius: "0.375rem", textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.3)", transition: "all 0.2s ease",
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
            >
              See How It Works
            </a>
          </div>
        </div>
        {/* Stat bar */}
        <div style={{
          display: "flex", gap: "2.5rem", flexWrap: "wrap",
          marginTop: "4rem", paddingTop: "2rem",
          borderTop: "1px solid rgba(255,255,255,0.15)",
        }}>
          {[
            { num: "750", label: "Visitors / day, one system" },
            { num: "3%", label: "Booking fee eliminated" },
            { num: "4", label: "Disconnected systems unified" },
            { num: "2 yr", label: "Waiver retention, automated" },
          ].map(s => (
            <div key={s.num}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: "1.6rem", color: "#7ECFC4" }}>{s.num}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", marginTop: "0.2rem" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: "2rem", right: "2rem", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
        <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.3)", animation: "scrollPulse 2s ease-in-out infinite" }} />
      </div>
      <style>{`@keyframes scrollPulse { 0%,100%{opacity:0.3;transform:scaleY(0.8)} 50%{opacity:1;transform:scaleY(1)} }`}</style>
    </section>
  );
}

// ─── Circuit Board Problem Infographic ───────────────────────────────────────
function Problem() {
  const [active, setActive] = useState<string | null>(null);

  const problems = [
    {
      id: "p1", num: "01", title: "Double Transaction",
      short: "3 checkouts for 1 family",
      body: "A family wants a tour, two t-shirts, and lunch. That's three separate checkouts on three separate systems. The line backs up. The family gets frustrated. Your staff apologizes — again.",
      color: "#C2622D", x: 18, y: 22, icon: "💳",
    },
    {
      id: "p2", num: "02", title: "Ghost Booking",
      short: "Sold the same slot twice",
      body: "Someone books the 10 AM tour online while a walk-in is at your register. Square doesn't know FareHarbor exists. You just double-booked. Now someone drove an hour for nothing.",
      color: "#1B3A5C", x: 82, y: 18, icon: "👻",
    },
    {
      id: "p3", num: "03", title: "Spreadsheet of Death",
      short: "2–4 hrs of reconciliation nightly",
      body: "Every night, someone on your team manually reconciles Square receipts against booking records against waiver signatures. That's not operations. That's punishment.",
      color: "#2A7D6F", x: 82, y: 82, icon: "📊",
    },
    {
      id: "p4", num: "04", title: "Waiver Scramble",
      short: "Waiver and payment are strangers",
      body: "\"Did everyone sign the waiver?\" Your staff asks this while processing payment, checking capacity, and keeping the line moving. The waiver and the transaction live in completely different systems.",
      color: "#6B4C9A", x: 18, y: 78, icon: "✍️",
    },
    {
      id: "p5", num: "05", title: "Ordering Blindspot",
      short: "$40K decisions made on gut feel",
      body: "You want to order more equipment. But booking data is in one system, retail data in another, food revenue somewhere else. You're making major purchasing decisions with no unified data.",
      color: "#1B3A5C", x: 50, y: 8, icon: "🔍",
    },
    {
      id: "p6", num: "06", title: "Fee Stack",
      short: "3% booking fee passed to customers",
      body: "FareHarbor charges 3% per booking. Square charges processing fees. Customers see a surcharge at the register for a booking they made online. They notice. They don't come back.",
      color: "#C2622D", x: 50, y: 92, icon: "💸",
    },
  ];

  const activeProb = problems.find(p => p.id === active);

  return (
    <section id="problem" style={{ background: "#0D1F33", padding: "5rem 0", overflow: "hidden" }}>
      <div className="container">
        <FadeIn>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <div style={{ width: 32, height: 2, background: "#2A7D6F" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", fontWeight: 600, color: "#2A7D6F", letterSpacing: "0.15em", textTransform: "uppercase" }}>System Failure Map</span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "white", maxWidth: 680, marginBottom: "0.75rem", lineHeight: 1.2 }}>
            Six places your operation breaks every single day.
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.5)", maxWidth: 560, lineHeight: 1.7, marginBottom: "3rem" }}>
            Tap any node to see the failure. This is what your operation looks like from the inside.
          </p>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
          {/* Circuit board SVG */}
          <FadeIn>
            <div style={{ position: "relative", background: "#0A1628", borderRadius: "1rem", border: "1px solid rgba(42,125,111,0.2)", overflow: "hidden", aspectRatio: "1", boxShadow: "0 0 60px rgba(42,125,111,0.08) inset" }}>
              {/* PCB grid texture */}
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.06 }} viewBox="0 0 400 400">
                {Array.from({ length: 20 }).map((_, i) => (
                  <line key={`h${i}`} x1="0" y1={i * 20} x2="400" y2={i * 20} stroke="#2A7D6F" strokeWidth="0.5" />
                ))}
                {Array.from({ length: 20 }).map((_, i) => (
                  <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="400" stroke="#2A7D6F" strokeWidth="0.5" />
                ))}
              </svg>

              <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", position: "relative", zIndex: 1 }}>
                {/* Trace lines from each problem node to center */}
                {problems.map(p => {
                  const cx = 50, cy = 50;
                  // Right-angle PCB traces
                  const midX = p.x < 50 ? cx - (cx - p.x) * 0.5 : cx + (p.x - cx) * 0.5;
                  return (
                    <g key={p.id + "-trace"}>
                      <polyline
                        points={`${p.x},${p.y} ${midX},${p.y} ${midX},${cy} ${cx},${cy}`}
                        fill="none"
                        stroke={active === p.id ? p.color : "rgba(42,125,111,0.25)"}
                        strokeWidth={active === p.id ? "0.6" : "0.3"}
                        strokeDasharray={active === p.id ? "none" : "1,1"}
                        style={{ transition: "stroke 0.3s ease, stroke-width 0.3s ease" }}
                      />
                      {/* Trace corner dots */}
                      <circle cx={midX} cy={p.y} r="0.5" fill={active === p.id ? p.color : "rgba(42,125,111,0.3)"} />
                      <circle cx={midX} cy={cy} r="0.5" fill={active === p.id ? p.color : "rgba(42,125,111,0.3)"} />
                    </g>
                  );
                })}

                {/* Central Waypoint chip */}
                <rect x="42" y="42" width="16" height="16" rx="1.5"
                  fill="#1B3A5C" stroke="#2A7D6F" strokeWidth="0.5" />
                <rect x="44" y="44" width="12" height="12" rx="1"
                  fill="#0D1F33" stroke="rgba(42,125,111,0.4)" strokeWidth="0.3" />
                <text x="50" y="51.5" textAnchor="middle" fill="#7ECFC4"
                  fontSize="3.5" fontFamily="'JetBrains Mono', monospace" fontWeight="bold">W</text>
                <text x="50" y="55" textAnchor="middle" fill="rgba(126,207,196,0.5)"
                  fontSize="1.8" fontFamily="'DM Sans', sans-serif">WAYPOINT</text>

                {/* Problem nodes */}
                {problems.map(p => (
                  <g key={p.id} style={{ cursor: "pointer" }} onClick={() => setActive(active === p.id ? null : p.id)}>
                    {/* Outer glow ring */}
                    <circle cx={p.x} cy={p.y} r="5.5"
                      fill="none"
                      stroke={active === p.id ? p.color : "rgba(255,255,255,0.05)"}
                      strokeWidth="0.8"
                      style={{ transition: "stroke 0.3s" }}
                    />
                    {/* Main node */}
                    <circle cx={p.x} cy={p.y} r="4"
                      fill={active === p.id ? p.color : "#1A2E45"}
                      stroke={active === p.id ? p.color : "rgba(255,255,255,0.15)"}
                      strokeWidth="0.5"
                      style={{ transition: "fill 0.3s, stroke 0.3s" }}
                    />
                    {/* Error indicator */}
                    <circle cx={p.x + 2.8} cy={p.y - 2.8} r="1.2"
                      fill={active === p.id ? "#FF6B6B" : "#C2622D"}
                    />
                    {/* Number label */}
                    <text x={p.x} y={p.y + 0.8} textAnchor="middle"
                      fill={active === p.id ? "white" : "rgba(255,255,255,0.5)"}
                      fontSize="2.5" fontFamily="'JetBrains Mono', monospace" fontWeight="bold"
                      style={{ transition: "fill 0.3s" }}
                    >{p.num}</text>
                    {/* Label below/above node */}
                    <text
                      x={p.x}
                      y={p.y < 50 ? p.y + 8 : p.y - 6}
                      textAnchor="middle"
                      fill={active === p.id ? p.color : "rgba(255,255,255,0.35)"}
                      fontSize="2" fontFamily="'DM Sans', sans-serif"
                      style={{ transition: "fill 0.3s" }}
                    >{p.title}</text>
                  </g>
                ))}
              </svg>

              {/* PCB corner decorations */}
              {[[8,8],[92,8],[8,92],[92,92]].map(([x,y], i) => (
                <div key={i} style={{
                  position: "absolute",
                  left: `${x}%`, top: `${y}%`,
                  transform: "translate(-50%,-50%)",
                  width: 12, height: 12,
                  border: "1.5px solid rgba(42,125,111,0.3)",
                  borderRadius: "50%",
                }} />
              ))}
            </div>
          </FadeIn>

          {/* Detail panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {activeProb ? (
              <FadeIn key={activeProb.id}>
                <div style={{
                  background: "rgba(255,255,255,0.04)", border: `1px solid ${activeProb.color}44`,
                  borderLeft: `4px solid ${activeProb.color}`,
                  borderRadius: "0.75rem", padding: "2rem",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                    <span style={{ fontSize: "1.75rem" }}>{activeProb.icon}</span>
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: activeProb.color, letterSpacing: "0.1em", marginBottom: "0.2rem" }}>FAULT {activeProb.num}</div>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "white", fontWeight: 700 }}>{activeProb.title}</h3>
                    </div>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", color: activeProb.color, background: `${activeProb.color}18`, padding: "0.5rem 0.75rem", borderRadius: "0.375rem", marginBottom: "1rem", display: "inline-block" }}>
                    ⚠ {activeProb.short}
                  </div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.75 }}>{activeProb.body}</p>
                </div>
              </FadeIn>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {problems.map(p => (
                  <button key={p.id} onClick={() => setActive(p.id)} style={{
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "0.5rem", padding: "0.85rem 1.1rem",
                    display: "flex", alignItems: "center", gap: "0.85rem",
                    cursor: "pointer", textAlign: "left", width: "100%",
                    transition: "all 0.2s ease",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor = `${p.color}44`; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                  >
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: p.color, fontWeight: 700, minWidth: 24 }}>{p.num}</span>
                    <span style={{ fontSize: "1rem" }}>{p.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.88rem", color: "rgba(255,255,255,0.85)" }}>{p.title}</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", marginTop: "0.15rem" }}>{p.short}</div>
                    </div>
                    <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.8rem" }}>→</span>
                  </button>
                ))}
              </div>
            )}

            {activeProb && (
              <button onClick={() => setActive(null)} style={{
                background: "transparent", border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.8rem", padding: "0.6rem 1rem", borderRadius: "0.375rem",
                cursor: "pointer", alignSelf: "flex-start",
              }}>← View all faults</button>
            )}
          </div>
        </div>

        {/* Thesis bar */}
        <FadeIn delay={200}>
          <div style={{ marginTop: "3.5rem", padding: "2rem 2.5rem", background: "rgba(42,125,111,0.1)", border: "1px solid rgba(42,125,111,0.2)", borderRadius: "0.75rem", display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#2A7D6F", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "1.1rem" }}>W</div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontStyle: "italic", fontSize: "0.95rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, flex: 1, margin: 0 }}>
              You didn't start an outdoor recreation operation to spend four hours every night reconciling receipts. Your staff shouldn't have to ask "Did you sign the waiver?" while processing a payment. <strong style={{ color: "#7ECFC4" }}>This is solvable.</strong>
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  return (
    <section id="how" className="wp-section" style={{ background: "white" }}>
      <div className="container">
        <FadeIn>
          <div className="wp-eyebrow" style={{ marginBottom: "1rem" }}>How It Works</div>
          <div className="teal-rule" />
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", maxWidth: 680, marginBottom: "1rem", lineHeight: 1.2 }}>
            Waypoint is not a POS. It's the layer that makes your POS complete.
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: "#5A6B7A", maxWidth: 600, lineHeight: 1.7, marginBottom: "3.5rem" }}>
            You keep the systems you already use. Waypoint sits between them, translating in real time, enforcing your rules, and surfacing the data that actually runs your business.
          </p>
        </FadeIn>

        {/* Flow diagram */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Input systems */}
          <FadeIn>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              {[
                { name: "FareHarbor", role: "Online bookings, tour capacity, time slots", color: "#1B3A5C" },
                { name: "Lightspeed", role: "In-person POS, food service, retail checkout", color: "#2A7D6F" },
                { name: "Smartwaiver", role: "Digital waiver collection & legal storage", color: "#C2622D" },
                { name: "Sage", role: "Accounting, payroll, and financial reporting", color: "#5A6B7A" },
              ].map(s => (
                <div key={s.name} style={{ background: "#F4F1EB", border: `2px solid ${s.color}22`, borderRadius: "0.75rem", padding: "1.25rem", textAlign: "center" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, margin: "0 auto 0.75rem" }} />
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.95rem", color: "#1B3A5C", marginBottom: "0.4rem" }}>{s.name}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "#5A6B7A", lineHeight: 1.5 }}>{s.role}</div>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Arrow + Waypoint node */}
          <FadeIn delay={100}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0" }}>
              <div style={{ display: "flex", gap: "0.3rem" }}>
                {[0,1,2,3,4,5].map(i => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#2A7D6F", opacity: 0.3 + i * 0.12 }} />
                ))}
              </div>
              <div style={{
                background: "#1B3A5C", borderRadius: "1rem", padding: "1.5rem 3rem",
                display: "flex", alignItems: "center", gap: "1rem", boxShadow: "0 8px 32px rgba(27,58,92,0.2)",
              }}>
                <WaypointIcon size={36} light />
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.3rem", color: "white" }}>Waypoint</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", marginTop: "0.2rem" }}>Real-time translation layer</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.3rem" }}>
                {[5,4,3,2,1,0].map(i => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#2A7D6F", opacity: 0.3 + i * 0.12 }} />
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Output */}
          <FadeIn delay={200}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              {[
                { name: "One Transaction", desc: "Tour + retail + food in a single customer-facing checkout", icon: "💳" },
                { name: "Live Capacity", desc: "Online booking instantly removes walk-in availability", icon: "🔄" },
                { name: "Unified Report", desc: "Singles vs. tandem, retail attach rate, revenue per visitor", icon: "📊" },
                { name: "Waiver Gate", desc: "Payment doesn't process until every party member has signed", icon: "✅" },
              ].map(o => (
                <div key={o.name} style={{ background: "#F4F1EB", border: "2px solid #2A7D6F33", borderRadius: "0.75rem", padding: "1.25rem", textAlign: "center" }}>
                  <div style={{ fontSize: "1.4rem", marginBottom: "0.6rem" }}>{o.icon}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.95rem", color: "#1B3A5C", marginBottom: "0.4rem" }}>{o.name}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "#5A6B7A", lineHeight: 1.5 }}>{o.desc}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Merchant of Record note */}
        <FadeIn delay={300}>
          <div style={{ marginTop: "3rem", padding: "1.5rem 2rem", background: "#F4F1EB", borderLeft: "4px solid #2A7D6F", borderRadius: "0 0.5rem 0.5rem 0" }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "#1B3A5C", marginBottom: "0.4rem" }}>How the money works</div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "#5A6B7A", lineHeight: 1.7 }}>
              Waypoint doesn't merge payment processors — it merges the <em>interface</em>. Your staff sees one screen. The customer swipes once. Behind the scenes, Waypoint routes the transaction to the correct system — FareHarbor for the booking, Lightspeed for retail, Square for food and beverage. Your accounting in Sage stays clean. No audit nightmare, no Merchant of Record complexity.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────
function Features() {
  const features = [
    {
      num: "01", title: "Live Capacity Sync",
      short: "Booking made online → walk-in slot gone instantly",
      body: "A booking on FareHarbor removes that slot from walk-in availability instantly — across the staff POS and any walk-in queue. No double booking. No manual refresh. No phone calls between staff.",
      detail: "Sub-second sync via webhook architecture. If connectivity drops, Waypoint queues the update locally and syncs the moment signal returns.",
      color: "#2A7D6F", icon: "🔄", solves: "Ghost Booking",
    },
    {
      num: "02", title: "Waiver-Triggered Payment",
      short: "Pay button stays locked until every waiver is signed",
      body: "The Pay button doesn't turn green until every member of the party has a signed waiver linked to their booking. The waiver and the transaction are the same workflow.",
      detail: "Powered by Smartwaiver's certified legal infrastructure. Chain of custody maintained. Exportable for insurance or litigation on demand.",
      color: "#6B4C9A", icon: "🔐", solves: "Waiver Scramble",
    },
    {
      num: "03", title: "Single Screen, Single Swipe",
      short: "One screen. Tour + retail + food + tip, all routed correctly",
      body: "Your staff sees one screen. The customer swipes once. Behind the scenes, Waypoint routes tour revenue to FareHarbor, retail to Lightspeed, and tip attribution to the specific guide — all in real time.",
      detail: "Tip attribution by guide is automatic on Summit and above. No end-of-night manual splitting. Your guides get paid correctly, every time.",
      color: "#C2622D", icon: "⚡", solves: "Double Transaction",
    },
    {
      num: "04", title: "Operator Intelligence",
      short: "The report that replaces your nightly spreadsheet",
      body: "Every morning, your daily report is waiting — already pulled from FareHarbor, Lightspeed, and Smartwaiver, formatted and pushed to Sage. No manual reconciliation. No Excel. No 2 AM spreadsheet.",
      detail: "Replaces the manual process of pulling from multiple systems into Excel and then into Sage. Revenue per visitor, retail attach rate, guide performance — all automated.",
      color: "#1B3A5C", icon: "📊", solves: "Ordering Blindspot",
    },
    {
      num: "05", title: "Real Inventory Tracking",
      short: "Stock depleted across all channels simultaneously",
      body: "Stock entered once in Lightspeed, depleted across all sales channels simultaneously. Shrinkage flagged. Low stock alerted. Retail data tied to activity data for real purchasing decisions.",
      detail: "Lightspeed's inventory depth is best-in-class for retail. Waypoint makes sure it talks to your booking and food systems in real time.",
      color: "#2A7D6F", icon: "📦", solves: "Ordering Blindspot",
    },
    {
      num: "06", title: "Offline Queue",
      short: "Wi-Fi dies. Nothing is lost.",
      body: "Your busiest Saturday and the Wi-Fi dies. Waypoint caches every transaction locally and syncs the moment connectivity returns. Nothing is lost.",
      detail: "Enterprise-grade resilience. This is the feature that separates a real product from a prototype.",
      color: "#C2622D", icon: "📡", solves: "Connectivity",
    },
    {
      num: "07", title: "Multi-Location Management",
      short: "One login. All locations. One report.",
      body: "Built for operators running multiple park or recreation sites under one entity. Compare performance across locations. One login. One report.",
      detail: "National and state park concessionaires are the fastest-growing segment of this market. Waypoint is built for them from day one.",
      color: "#1B3A5C", icon: "🗺️", solves: "Scale",
    },
  ];

  return (
    <section id="features" className="wp-section" style={{ background: "white" }}>
      <div className="container">
        <FadeIn>
          <div className="wp-eyebrow" style={{ marginBottom: "1rem" }}>Seven Core Capabilities</div>
          <div className="teal-rule" />
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", maxWidth: 640, marginBottom: "1rem", lineHeight: 1.2 }}>
            Every feature exists because an operator asked for it.
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: "#5A6B7A", maxWidth: 580, lineHeight: 1.7, marginBottom: "3.5rem" }}>
            Not invented in a conference room. Reverse-engineered from the exact friction points that make parks and recreation operations hard to run.
          </p>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
          {features.map((f, i) => (
            <FadeIn key={f.num} delay={i * 55}>
              <div style={{
                background: "#FAFAF8", border: "1px solid #E8E4DC",
                borderRadius: "0.75rem", padding: "1.75rem",
                borderTop: `3px solid ${f.color}`,
                height: "100%", display: "flex", flexDirection: "column",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(27,58,92,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                {/* Icon + number row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "0.5rem", background: `${f.color}14`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }}>{f.icon}</div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.25rem" }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", fontWeight: 600, color: f.color, letterSpacing: "0.1em" }}>{f.num}</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", color: "#5A6B7A", background: "#F4F1EB", padding: "0.15rem 0.5rem", borderRadius: "1rem" }}>Fixes: {f.solves}</span>
                  </div>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#1B3A5C", marginBottom: "0.4rem", fontWeight: 700 }}>{f.title}</h3>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.78rem", color: f.color, marginBottom: "0.85rem", lineHeight: 1.4 }}>{f.short}</div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "#3A4A5A", lineHeight: 1.7, flex: 1 }}>{f.body}</p>
                <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #E8E4DC", fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "#5A6B7A", lineHeight: 1.6 }}>{f.detail}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Dashboard Section ────────────────────────────────────────────────────────
function Dashboard() {
  return (
    <section className="wp-section" style={{ background: "#1B3A5C", overflow: "hidden" }}>
      <div className="container">
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="wp-eyebrow" style={{ color: "#7ECFC4", marginBottom: "1rem" }}>The Dashboard</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "white", marginBottom: "1rem" }}>
              Everything your operation generates.<br />One screen.
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.65)", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
              This is what your operations manager sees when they open their laptop at 7 AM. Not five tabs. Not a spreadsheet. One dashboard that knows everything.
            </p>
          </div>
        </FadeIn>
        <FadeIn delay={150}>
          <div style={{ borderRadius: "1rem", overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663413300520/j8y9B2NVZ2HEf3Lc2oFy9R/waypoint-dashboard-v2-M8dZ3zzEghdDvXrfytbhR6.webp"
              alt="Waypoint operator dashboard showing live bookings, tour capacity, retail revenue, and waiver status"
              style={{ width: "100%", display: "block" }}
            />
          </div>
        </FadeIn>
        {/* Dashboard callouts */}
        <FadeIn delay={250}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", marginTop: "3rem" }}>
            {[
              { label: "Live Bookings", val: "347 / 750", note: "Real-time, updated on every swipe", color: "#7ECFC4" },
              { label: "Tour Capacity", val: "18 of 30", note: "Synced from FareHarbor instantly", color: "#7ECFC4" },
              { label: "Retail Revenue", val: "$4,280", note: "Trending up vs. last Saturday", color: "#E8A87C" },
              { label: "Waivers Signed", val: "341 of 347", note: "6 pending — staff alerted", color: "#7ECFC4" },
            ].map(s => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.75rem", padding: "1.25rem" }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.4rem" }}>{s.label}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: "1.4rem", color: s.color, marginBottom: "0.3rem" }}>{s.val}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>{s.note}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Who It's For ─────────────────────────────────────────────────────────────
function WhoItsFor() {
  const segments = [
        { icon: "🏞️", title: "Parks & Recreation Operators", desc: "Timed activities, capacity management, waivers, retail, and food — all under one roof. The exact multi-system problem Waypoint was built to solve." },
    { icon: "🚣", title: "Water Sports & Rentals", desc: "Fleet utilization data drives purchasing decisions. Live capacity sync prevents the double-booked launch. Guide tip attribution handled automatically." },
    { icon: "🌊", title: "Adventure & Guided Tours", desc: "Waiver enforcement, multi-guide scheduling, and retail at the end of the experience — one transaction for the full day." },
    { icon: "🌲", title: "Aerial & Zip Adventures", desc: "Participant restrictions enforced at booking. Waivers locked until signed. Retail and photo packages attached to the same checkout." },
    { icon: "🏔️", title: "National Park Concessionaires", desc: "Multi-location management built in from day one. One report across all sites. The market that's been waiting for this product." },
    { icon: "🌿", title: "State Park Concessionaires", desc: "State compliance requirements vary by jurisdiction. Waypoint's waiver and reporting architecture is built to handle them without custom work." },
    { icon: "🧗", title: "Multi-Activity Venues", desc: "Day passes, gear rental, retail, food — all in one transaction. Any combination of activity types, one unified operation." },
    { icon: "🏕️", title: "Outdoor Resorts & Lodges", desc: "The most complex use case. Multiple activity types, multiple revenue centers, lodging, and retail — one system that knows all of it." },
  ];
  return (
    <section className="wp-section" style={{ background: "white" }}>
      <div className="container">
        <FadeIn>
          <div className="wp-eyebrow" style={{ marginBottom: "1rem" }}>Who It's For</div>
          <div className="teal-rule" />
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", maxWidth: 640, marginBottom: "1rem", lineHeight: 1.2 }}>
            If you manage activities and sell things, this was built for you.
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: "#5A6B7A", maxWidth: 580, lineHeight: 1.7, marginBottom: "3.5rem" }}>
            Any operator running timed activities alongside retail, food, or rentals — and using more than one system to do it — is the exact customer Waypoint was designed for.
          </p>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
          {segments.map((s, i) => (
            <FadeIn key={s.title} delay={i * 50}>
              <div className="wp-card" style={{ padding: "1.75rem" }}>
                <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>{s.icon}</div>
                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "1rem", color: "#1B3A5C", marginBottom: "0.5rem" }}>{s.title}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#5A6B7A", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
function Pricing() {
  const tiers = [
    {
      name: "Base Camp",
      price: "$299",
      period: "/month",
      desc: "Single location. All core integrations. Up to 500 bookings/month.",
      features: [
        "FareHarbor + Lightspeed integration",
        "Live capacity sync",
        "Waiver-triggered payment",
        "Unified daily report",
        "Smartwaiver integration",
        "Email support",
      ],
      cta: "Start with Base Camp",
      highlight: false,
    },
    {
      name: "Summit",
      price: "$699",
      period: "/month",
      desc: "Up to 5 locations. Advanced reporting. Priority support.",
      features: [
        "Everything in Base Camp",
        "Up to 5 locations",
        "Lightspeed integration",
        "Tip attribution by guide",
        "Offline queue mode",
        "Operator intelligence dashboard",
        "Priority support",
      ],
      cta: "Start with Summit",
      highlight: true,
    },
    {
      name: "Expedition",
      price: "Custom",
      period: "",
      desc: "Enterprise concessionaires. White-label available. SLA-guaranteed uptime.",
      features: [
        "Everything in Summit",
        "Unlimited locations",
        "White-label option",
        "Dedicated onboarding",
        "99.9% uptime SLA",
        "Custom integrations",
        "Quarterly business reviews",
      ],
      cta: "Contact for Pricing",
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="wp-section" style={{ background: "#F4F1EB" }}>
      <div className="container">
        <FadeIn>
          <div className="wp-eyebrow" style={{ marginBottom: "1rem" }}>Pricing</div>
          <div className="teal-rule" />
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", maxWidth: 640, marginBottom: "1rem", lineHeight: 1.2 }}>
            Flat monthly fee. No booking surcharge. Ever.
          </h2>
        </FadeIn>
        <FadeIn delay={100}>
          <div style={{
            background: "#2A7D6F", color: "white", borderRadius: "0.75rem",
            padding: "1.25rem 2rem", marginBottom: "3rem", display: "inline-flex",
            alignItems: "center", gap: "1rem", flexWrap: "wrap",
          }}>
            <span style={{ fontSize: "1.3rem" }}>⚡</span>
            <div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1rem", marginBottom: "0.2rem" }}>
                The core differentiator: Waypoint charges a flat monthly SaaS fee.
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", opacity: 0.85 }}>
                FareHarbor charges operators 3% per booking — that fee gets passed to customers at the register and kills conversion. Waypoint eliminates it entirely. Stripe handles payment processing at standard published rates. Your merchant account. Your money.
              </div>
            </div>
          </div>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {tiers.map((t, i) => (
            <FadeIn key={t.name} delay={i * 80}>
              <div style={{
                background: t.highlight ? "#1B3A5C" : "white",
                border: t.highlight ? "none" : "1px solid #E8E4DC",
                borderRadius: "1rem", padding: "2.5rem",
                boxShadow: t.highlight ? "0 16px 48px rgba(27,58,92,0.25)" : "0 2px 12px rgba(27,58,92,0.06)",
                position: "relative", height: "100%",
                display: "flex", flexDirection: "column",
              }}>
                {t.highlight && (
                  <div style={{
                    position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)",
                    background: "#2A7D6F", color: "white",
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.72rem",
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    padding: "0.35rem 1.2rem", borderRadius: "2rem",
                  }}>Most Popular</div>
                )}
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: t.highlight ? "rgba(255,255,255,0.6)" : "#5A6B7A", marginBottom: "0.5rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>{t.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem", marginBottom: "0.75rem" }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "2.8rem", color: t.highlight ? "white" : "#1B3A5C" }}>{t.price}</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: t.highlight ? "rgba(255,255,255,0.5)" : "#5A6B7A" }}>{t.period}</span>
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: t.highlight ? "rgba(255,255,255,0.7)" : "#5A6B7A", lineHeight: 1.6, marginBottom: "1.75rem" }}>{t.desc}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", flex: 1 }}>
                  {t.features.map(f => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", marginBottom: "0.6rem" }}>
                      <span style={{ color: "#2A7D6F", fontWeight: 700, fontSize: "0.9rem", marginTop: "0.1rem", flexShrink: 0 }}>✓</span>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: t.highlight ? "rgba(255,255,255,0.8)" : "#3A4A5A", lineHeight: 1.5 }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <a href="#access" style={{
                  display: "block", textAlign: "center", textDecoration: "none",
                  background: t.highlight ? "#2A7D6F" : "#1B3A5C",
                  color: "white", fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                  fontSize: "0.92rem", padding: "0.85rem", borderRadius: "0.375rem",
                  transition: "all 0.2s ease",
                }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
                >{t.cta}</a>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Compliance ───────────────────────────────────────────────────────────────
function Compliance() {
  const items = [
    {
      title: "PCI DSS",
      icon: "🔒",
      body: "Waypoint never stores, transmits, or touches raw card data. Lightspeed and Stripe are both PCI Level 1 certified. Operators using Waypoint inherit that certification through our integration architecture. No additional PCI audit burden falls on you.",
    },
    {
      title: "Waiver Retention",
      icon: "📋",
      body: "All waivers are AES-256 encrypted, timestamped at collection, and stored in redundant cloud infrastructure through Smartwaiver's certified legal platform. Meets 2-year retention minimums across all U.S. state jurisdictions. Chain of custody maintained. Exportable on demand for legal or insurance purposes.",
    },
    {
      title: "POS Audit Compliance",
      icon: "🏛️",
      body: "Waypoint is middleware, not a POS. Quarterly and annual audit obligations remain with Lightspeed — the certified POS system. Waypoint does not trigger additional audit requirements. Your existing compliance schedule stays intact.",
    },
    {
      title: "Uptime & Data Integrity",
      icon: "⚡",
      body: "99.9% uptime SLA on Expedition tier. Daily encrypted backups. Offline queue mode ensures zero data loss during connectivity interruptions. SOC 2 Type II compliance is on the product roadmap for enterprise customers.",
    },
  ];
  return (
    <section id="compliance" className="wp-section" style={{ background: "white" }}>
      <div className="container">
        <FadeIn>
          <div className="wp-eyebrow" style={{ marginBottom: "1rem" }}>Compliance & Security</div>
          <div className="teal-rule" />
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", maxWidth: 640, marginBottom: "1rem", lineHeight: 1.2 }}>
            We know compliance keeps operators up at night. Here's the honest answer.
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: "#5A6B7A", maxWidth: 600, lineHeight: 1.7, marginBottom: "3.5rem" }}>
            Operators in this space have been burned by software that made compliance promises it couldn't keep. We're not going to do that. Here's exactly what Waypoint handles, and exactly what it doesn't.
          </p>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {items.map((item, i) => (
            <FadeIn key={item.title} delay={i * 80}>
              <div className="wp-card" style={{ padding: "2rem", borderLeft: "4px solid #2A7D6F" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>{item.icon}</div>
                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1.05rem", color: "#1B3A5C", marginBottom: "0.75rem" }}>{item.title}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "#5A6B7A", lineHeight: 1.7 }}>{item.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Comparison Table ────────────────────────────────────────────────────────
function ComparisonTable() {
  const rows = [
    { feature: "Booking + POS unified", waypoint: true, fareharbor: "Partial", ingenuity: "Partial", legacy: false },
    { feature: "Lightspeed retail integration", waypoint: true, fareharbor: false, ingenuity: "Limited", legacy: false },
    { feature: "Waiver-triggered payment gate", waypoint: true, fareharbor: false, ingenuity: false, legacy: false },
    { feature: "One screen for staff", waypoint: true, fareharbor: false, ingenuity: false, legacy: false },
    { feature: "Automated daily report → Sage", waypoint: true, fareharbor: false, ingenuity: false, legacy: false },
    { feature: "Flat monthly fee (no % per booking)", waypoint: true, fareharbor: false, ingenuity: true, legacy: true },
    { feature: "Multi-location management", waypoint: true, fareharbor: "Limited", ingenuity: "Limited", legacy: false },
    { feature: "Offline queue mode", waypoint: true, fareharbor: false, ingenuity: false, legacy: false },
    { feature: "Tip attribution by guide", waypoint: true, fareharbor: false, ingenuity: false, legacy: false },
    { feature: "Sage accounting sync", waypoint: true, fareharbor: false, ingenuity: false, legacy: false },
  ];

  const renderVal = (val: boolean | string, isWaypoint = false) => {
    if (val === true) return <span style={{ color: isWaypoint ? "#2A7D6F" : "#2A7D6F", fontWeight: 700, fontSize: "1rem" }}>✓</span>;
    if (val === false) return <span style={{ color: "#C2622D", fontWeight: 700, fontSize: "1rem" }}>✗</span>;
    return <span style={{ color: "#C2622D", fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", fontWeight: 600 }}>{val}</span>;
  };

  return (
    <section className="wp-section" style={{ background: "#0D1F33", padding: "5rem 0" }}>
      <div className="container">
        <FadeIn>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <div style={{ width: 32, height: 2, background: "#2A7D6F" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", fontWeight: 600, color: "#2A7D6F", letterSpacing: "0.15em", textTransform: "uppercase" }}>Competitive Landscape</span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "white", maxWidth: 680, marginBottom: "0.75rem", lineHeight: 1.2 }}>
            How Waypoint compares to what's already out there.
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.5)", maxWidth: 560, lineHeight: 1.7, marginBottom: "3rem" }}>
            FareHarbor is great at bookings. Ingenuity is close — but hasn't solved the retail piece. Legacy POS systems were never built for activity operators. Waypoint connects them all.
          </p>
        </FadeIn>

        <FadeIn delay={100}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Sans', sans-serif" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "1rem 1.25rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>Capability</th>
                  <th style={{ textAlign: "center", padding: "1rem 1.25rem", fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1rem", color: "#7ECFC4", borderBottom: "1px solid rgba(42,125,111,0.4)", background: "rgba(42,125,111,0.08)", borderRadius: "0.5rem 0.5rem 0 0" }}>Waypoint</th>
                  <th style={{ textAlign: "center", padding: "1rem 1.25rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>FareHarbor</th>
                  <th style={{ textAlign: "center", padding: "1rem 1.25rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>Ingenuity</th>
                  <th style={{ textAlign: "center", padding: "1rem 1.25rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>Legacy POS</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.feature} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                    <td style={{ padding: "0.85rem 1.25rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "rgba(255,255,255,0.75)", borderBottom: "1px solid rgba(255,255,255,0.05)", fontWeight: 500 }}>{row.feature}</td>
                    <td style={{ textAlign: "center", padding: "0.85rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(42,125,111,0.06)" }}>{renderVal(row.waypoint, true)}</td>
                    <td style={{ textAlign: "center", padding: "0.85rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{renderVal(row.fareharbor)}</td>
                    <td style={{ textAlign: "center", padding: "0.85rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{renderVal(row.ingenuity)}</td>
                    <td style={{ textAlign: "center", padding: "0.85rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{renderVal(row.legacy)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeIn>

        <FadeIn delay={200}>
          <div style={{ marginTop: "2rem", padding: "1.25rem 1.75rem", background: "rgba(42,125,111,0.1)", border: "1px solid rgba(42,125,111,0.2)", borderRadius: "0.75rem" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
              <strong style={{ color: "#7ECFC4" }}>On Ingenuity:</strong> The closest competitor. Strong on booking-POS bridging, but operators consistently report friction on the Lightspeed retail integration — particularly inventory depth and multi-location sync. That's the gap Waypoint was built to close.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Origin ───────────────────────────────────────────────────────────────────
function Origin() {
  return (
    <section className="wp-section" style={{ background: "#F4F1EB" }}>
      <div className="container">
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <FadeIn>
            <div className="wp-eyebrow" style={{ marginBottom: "1rem", textAlign: "center" }}>The Origin</div>
            <div className="teal-rule" style={{ margin: "0 auto 2rem" }} />
            <blockquote style={{
              fontFamily: "'Playfair Display', serif", fontStyle: "italic",
              fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)", color: "#1B3A5C",
              lineHeight: 1.65, textAlign: "center", margin: "0 0 2rem",
            }}>
              "Waypoint was built by someone who grew up inside the problem. Not a tech company guessing at what operators need. Someone who watched a 750-person-a-day outdoor recreation operation run five systems that never talked to each other — and decided that was unacceptable."
            </blockquote>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", color: "#5A6B7A", lineHeight: 1.75, textAlign: "center" }}>
              The operators who need this most are the ones who've already tried FareHarbor's Square integration, already tried Ingenuity, already tried Hitrek — and found that each one solves one piece of the puzzle while creating new friction somewhere else. Waypoint exists because the people closest to the problem are the ones most qualified to solve it.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ─── Waitlist Form ────────────────────────────────────────────────────────────
function EarlyAccess() {
  const [form, setForm] = useState({ name: "", business: "", email: "", type: "", locations: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.business.trim()) e.business = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.type) e.type = "Required";
    if (!form.locations) e.locations = "Required";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1200);
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%", padding: "0.85rem 1rem",
    fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem",
    color: "#1B3A5C", background: "white",
    border: `1.5px solid ${errors[field] ? "#C2622D" : "#E8E4DC"}`,
    borderRadius: "0.375rem", outline: "none",
    transition: "border-color 0.2s ease",
    boxSizing: "border-box" as const,
  });

  return (
    <section id="access" className="wp-section" style={{ background: "#1B3A5C" }}>
      <div className="container">
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <FadeIn>
            <div className="wp-eyebrow" style={{ color: "#7ECFC4", marginBottom: "1rem", textAlign: "center" }}>Request Early Access</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "white", textAlign: "center", marginBottom: "1rem" }}>
              Be the first operator to run one system.
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.65)", textAlign: "center", lineHeight: 1.7, marginBottom: "2.5rem" }}>
              We're onboarding a small group of operators for the beta. Tell us about your operation and we'll be in touch.
            </p>
          </FadeIn>

          {submitted ? (
            <FadeIn>
              <div style={{ background: "rgba(42,125,111,0.15)", border: "1px solid rgba(42,125,111,0.4)", borderRadius: "1rem", padding: "3rem 2rem", textAlign: "center" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✅</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "white", marginBottom: "0.75rem" }}>You're on the list.</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
                  We'll reach out within 48 hours to learn more about your operation and get you set up for the beta. In the meantime, if you have questions, reply to our confirmation email.
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6, marginTop: "0.5rem" }}>
                  Integrations supported: FareHarbor · Lightspeed · Smartwaiver · Sage · Stripe
                </p>
              </div>
            </FadeIn>
          ) : (
            <FadeIn delay={100}>
              <form onSubmit={handleSubmit} style={{ background: "white", borderRadius: "1rem", padding: "2.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.82rem", color: "#1B3A5C", display: "block", marginBottom: "0.4rem" }}>Your Name</label>
                    <input style={inputStyle("name")} value={form.name} onChange={e => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: "" }); }} placeholder="Jane Smith"
                      onFocus={e => (e.target.style.borderColor = "#2A7D6F")}
                      onBlur={e => (e.target.style.borderColor = errors.name ? "#C2622D" : "#E8E4DC")} />
                    {errors.name && <div style={{ color: "#C2622D", fontSize: "0.75rem", marginTop: "0.3rem" }}>{errors.name}</div>}
                  </div>
                  <div>
                    <label style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.82rem", color: "#1B3A5C", display: "block", marginBottom: "0.4rem" }}>Business Name</label>
                    <input style={inputStyle("business")} value={form.business} onChange={e => { setForm({ ...form, business: e.target.value }); setErrors({ ...errors, business: "" }); }} placeholder="Riverside Kayak Co."
                      onFocus={e => (e.target.style.borderColor = "#2A7D6F")}
                      onBlur={e => (e.target.style.borderColor = errors.business ? "#C2622D" : "#E8E4DC")} />
                    {errors.business && <div style={{ color: "#C2622D", fontSize: "0.75rem", marginTop: "0.3rem" }}>{errors.business}</div>}
                  </div>
                </div>
                <div>
                  <label style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.82rem", color: "#1B3A5C", display: "block", marginBottom: "0.4rem" }}>Email Address</label>
                  <input type="email" style={inputStyle("email")} value={form.email} onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: "" }); }} placeholder="jane@riversidekayak.com"
                    onFocus={e => (e.target.style.borderColor = "#2A7D6F")}
                    onBlur={e => (e.target.style.borderColor = errors.email ? "#C2622D" : "#E8E4DC")} />
                  {errors.email && <div style={{ color: "#C2622D", fontSize: "0.75rem", marginTop: "0.3rem" }}>{errors.email}</div>}
                </div>
                <div>
                  <label style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.82rem", color: "#1B3A5C", display: "block", marginBottom: "0.4rem" }}>Operation Type</label>
                  <select style={{ ...inputStyle("type"), appearance: "none" as const }} value={form.type} onChange={e => { setForm({ ...form, type: e.target.value }); setErrors({ ...errors, type: "" }); }}>
                    <option value="">Select your operation type</option>
                    <option value="cave">Cave / Cavern Tours</option>
                    <option value="kayak">Kayak / Canoe Outfitter</option>
                    <option value="rafting">Whitewater Rafting</option>
                    <option value="zipline">Zipline / Aerial Adventure</option>
                    <option value="climbing">Climbing Gym</option>
                    <option value="national">National Park Concessionaire</option>
                    <option value="state">State Park Concessionaire</option>
                    <option value="resort">Multi-Activity Outdoor Resort</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.type && <div style={{ color: "#C2622D", fontSize: "0.75rem", marginTop: "0.3rem" }}>{errors.type}</div>}
                </div>
                <div>
                  <label style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.82rem", color: "#1B3A5C", display: "block", marginBottom: "0.4rem" }}>Number of Locations</label>
                  <select style={{ ...inputStyle("locations"), appearance: "none" as const }} value={form.locations} onChange={e => { setForm({ ...form, locations: e.target.value }); setErrors({ ...errors, locations: "" }); }}>
                    <option value="">Select</option>
                    <option value="1">1 location</option>
                    <option value="2-5">2–5 locations</option>
                    <option value="6-10">6–10 locations</option>
                    <option value="10+">10+ locations</option>
                  </select>
                  {errors.locations && <div style={{ color: "#C2622D", fontSize: "0.75rem", marginTop: "0.3rem" }}>{errors.locations}</div>}
                </div>
                <button type="submit" disabled={loading} style={{
                  background: loading ? "#5A6B7A" : "#1B3A5C", color: "white",
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "1rem",
                  padding: "1rem", borderRadius: "0.375rem", border: "none",
                  transition: "all 0.2s ease", cursor: loading ? "not-allowed" : "pointer",
                  marginTop: "0.5rem",
                }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#2A5080"; }}
                  onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#1B3A5C"; }}
                >
                  {loading ? "Submitting..." : "Request Early Access →"}
                </button>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "#5A6B7A", textAlign: "center", lineHeight: 1.5 }}>
                  No spam. No sales calls unless you want them. We'll reach out with beta details and timeline.
                </p>
              </form>
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: "#111D2B", padding: "3rem 1.25rem" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "2rem", marginBottom: "2.5rem" }}>
          <div>
            <WaypointLogo size={28} light />
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.45)", marginTop: "0.75rem", maxWidth: 280, lineHeight: 1.6 }}>
              One system. Every touchpoint.
            </p>
          </div>
          <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>Product</div>
              {["The Problem", "How It Works", "Features", "Dashboard", "Pricing"].map(l => (
                <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, "-").replace("the-", "")}`} style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "rgba(255,255,255,0.55)", textDecoration: "none", marginBottom: "0.5rem", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                >{l}</a>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>Company</div>
              {["Compliance", "Early Access", "Who It's For"].map(l => (
                <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, "-").replace("'s", "s")}`} style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "rgba(255,255,255,0.55)", textDecoration: "none", marginBottom: "0.5rem", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                >{l}</a>
              ))}
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.3)" }}>
            © 2025 Waypoint Operations LLC. All rights reserved.
          </div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.3)" }}>
            Built by{" "}
            <a href="https://tiffani.dev" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(126,207,196,0.7)", textDecoration: "none" }}>
              Tiffani
            </a>
            {" "}· Case Study 001
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Nav />
      <Hero />
      <Dashboard />
      <Problem />
      <HowItWorks />
      <Features />
      <WhoItsFor />
      <Pricing />
      <Compliance />
      <Origin />
      <ComparisonTable />
      <EarlyAccess />
      <Footer />
    </div>
  );
}
