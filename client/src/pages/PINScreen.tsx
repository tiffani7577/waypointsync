/**
 * WAYPOINTSYNC — Staff PIN Login Screen
 * Big, simple numpad. Tablet-friendly. 0000 = demo access.
 * Staff codes: 0000 (Demo), 1234 (Alex), 5678 (Jordan), 9012 (Manager)
 */

import { useState, useEffect } from "react";
import { WaypointLogo } from "@/components/WaypointLogo";

const NAV_BLUE = "#1B3A5C";
const TEAL = "#2A7D6F";

// Staff directory — PIN → name + role
const STAFF: Record<string, { name: string; role: string }> = {
  "0000": { name: "Demo User",  role: "Staff"   },
  "1234": { name: "Alex R.",    role: "Staff"   },
  "5678": { name: "Jordan M.",  role: "Staff"   },
  "9012": { name: "Casey T.",   role: "Manager" },
};

interface PINScreenProps {
  onUnlock: (staffName: string, role: string) => void;
}

export default function PINScreen({ onUnlock }: PINScreenProps) {
  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(false);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting("Good morning");
    else if (h < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const handleKey = (digit: string) => {
    if (pin.length >= 4) return;
    const next = pin + digit;
    setPin(next);

    if (next.length === 4) {
      setTimeout(() => {
        const staff = STAFF[next];
        if (staff) {
          onUnlock(staff.name, staff.role);
        } else {
          setShake(true);
          setTimeout(() => { setShake(false); setPin(""); }, 600);
        }
      }, 200);
    }
  };

  const handleDelete = () => setPin(p => p.slice(0, -1));

  const keys = ["1","2","3","4","5","6","7","8","9","","0","⌫"];

  return (
    <div
      className="h-screen flex flex-col items-center justify-center"
      style={{ background: NAV_BLUE, fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Logo */}
      <div className="mb-8">
        <WaypointLogo size={32} light />
      </div>

      {/* Greeting */}
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", marginBottom: "0.4rem", letterSpacing: "0.05em" }}>
        {greeting}
      </p>
      <h1 style={{ color: "white", fontSize: "1.5rem", fontWeight: 700, marginBottom: "2rem" }}>
        Enter your staff PIN
      </h1>

      {/* PIN dots */}
      <div
        className="flex gap-4 mb-8"
        style={{
          animation: shake ? "shake 0.5s ease" : "none",
        }}
      >
        {[0,1,2,3].map(i => (
          <div
            key={i}
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: i < pin.length ? "white" : "rgba(255,255,255,0.2)",
              border: "2px solid rgba(255,255,255,0.35)",
              transition: "background 0.15s ease",
              transform: i < pin.length ? "scale(1.15)" : "scale(1)",
            }}
          />
        ))}
      </div>

      {/* Numpad */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "0.75rem",
          width: "min(320px, 90vw)",
        }}
      >
        {keys.map((k, idx) => {
          if (k === "") return <div key={idx} />;
          const isDelete = k === "⌫";
          return (
            <button
              key={idx}
              onClick={() => isDelete ? handleDelete() : handleKey(k)}
              style={{
                height: 72,
                borderRadius: "1rem",
                background: isDelete ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "white",
                fontSize: isDelete ? "1.4rem" : "1.6rem",
                fontWeight: isDelete ? 400 : 600,
                cursor: "pointer",
                transition: "background 0.1s ease, transform 0.1s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseDown={e => (e.currentTarget.style.background = "rgba(255,255,255,0.22)")}
              onMouseUp={e => (e.currentTarget.style.background = isDelete ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.12)")}
              onTouchStart={e => (e.currentTarget.style.background = "rgba(255,255,255,0.22)")}
              onTouchEnd={e => (e.currentTarget.style.background = isDelete ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.12)")}
            >
              {k}
            </button>
          );
        })}
      </div>

      {/* Demo hint */}
      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", marginTop: "2.5rem", textAlign: "center" }}>
        Demo PIN: 0000
      </p>

      {/* Shake animation */}
      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-10px); }
          40%      { transform: translateX(10px); }
          60%      { transform: translateX(-8px); }
          80%      { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
}
