interface WaypointLogoProps {
  size?: number;
  showWordmark?: boolean;
  light?: boolean;
  className?: string;
}

export function WaypointIcon({ size = 32, light = false, className = "" }: { size?: number; light?: boolean; className?: string }) {
  const primary = light ? "#FFFFFF" : "#1B3A5C";
  const teal = "#2A7D6F";
  const amber = "#C2622D";
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="16" cy="16" r="14.5" stroke={primary} strokeWidth="1" opacity="0.2" />
      <path d="M5 9 L16 16" stroke={teal} strokeWidth="2" strokeLinecap="round" />
      <path d="M27 9 L16 16" stroke={teal} strokeWidth="2" strokeLinecap="round" />
      <path d="M16 16 L16 25" stroke={primary} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <circle cx="16" cy="16" r="4" fill={teal} />
      <circle cx="16" cy="16" r="1.8" fill="white" />
      <circle cx="5" cy="9" r="2" fill={teal} opacity="0.5" />
      <circle cx="27" cy="9" r="2" fill={teal} opacity="0.5" />
      <circle cx="16" cy="25" r="2" fill={amber} opacity="0.7" />
    </svg>
  );
}

export function WaypointLogo({ size = 32, showWordmark = true, light = false, className = "" }: WaypointLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`} style={{ textDecoration: 'none' }}>
      <WaypointIcon size={size} light={light} />
      {showWordmark && (
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          fontSize: size * 0.56,
          color: light ? "#FFFFFF" : "#1B3A5C",
          letterSpacing: "-0.01em",
          lineHeight: 1,
        }}>
          Waypoint
        </span>
      )}
    </div>
  );
}
