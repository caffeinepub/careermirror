import { motion } from "motion/react";

interface CRIGaugeProps {
  value: number;
  size?: number;
}

export function CRIGauge({ value, size = 180 }: CRIGaugeProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  // We use 240 degrees of the circle (from 150° to 30° going clockwise)
  const arcFraction = 240 / 360;
  const arcLength = circumference * arcFraction;
  void arcLength;

  // Determine color
  const getColor = () => {
    if (clamped < 40) return "oklch(0.65 0.22 25)";
    if (clamped < 70) return "oklch(0.78 0.18 70)";
    return "oklch(0.72 0.2 160)";
  };

  const getGlowClass = () => {
    if (clamped < 40) return "cri-glow-low";
    if (clamped < 70) return "cri-glow-mid";
    return "cri-glow-high";
  };

  const getLabel = () => {
    if (clamped < 40) return "Needs Work";
    if (clamped < 70) return "Developing";
    return "Industry Ready";
  };

  const cx = size / 2;
  const cy = size / 2;
  const startAngle = 150; // degrees
  const totalAngle = 240; // degrees

  // Convert angle to radians for SVG path
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const startX = cx + radius * Math.cos(toRad(startAngle));
  const startY = cy + radius * Math.sin(toRad(startAngle));
  const endAngle = startAngle + totalAngle;
  const endX = cx + radius * Math.cos(toRad(endAngle));
  const endY = cy + radius * Math.sin(toRad(endAngle));

  const trackPath = `M ${startX} ${startY} A ${radius} ${radius} 0 1 1 ${endX} ${endY}`;

  const fillEndAngle = startAngle + (clamped / 100) * totalAngle;
  const fillEndX = cx + radius * Math.cos(toRad(fillEndAngle));
  const fillEndY = cy + radius * Math.sin(toRad(fillEndAngle));
  const largeArc = (clamped / 100) * totalAngle > 180 ? 1 : 0;
  const fillPath = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${fillEndX} ${fillEndY}`;

  const color = getColor();

  return (
    <div
      className={`relative inline-flex flex-col items-center ${getGlowClass()}`}
      style={{ borderRadius: "50%" }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
        role="img"
        aria-label={`Career Readiness Index: ${clamped} out of 100`}
      >
        {/* Track */}
        <path
          d={trackPath}
          fill="none"
          stroke="oklch(0.28 0.03 260)"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Animated fill */}
        <motion.path
          d={fillPath}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: clamped > 0 ? 1 : 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />

        {/* Center text */}
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="oklch(0.95 0.01 260)"
          fontSize={size * 0.22}
          fontWeight="700"
          fontFamily="Bricolage Grotesque, sans-serif"
        >
          {clamped}
        </text>
        <text
          x={cx}
          y={cy + size * 0.14}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="oklch(0.58 0.04 260)"
          fontSize={size * 0.08}
          fontFamily="Plus Jakarta Sans, sans-serif"
        >
          CRI Score
        </text>
      </svg>
      <div
        className="text-xs font-semibold mt-1 px-2 py-0.5 rounded-full"
        style={{ color, background: `${color}20` }}
      >
        {getLabel()}
      </div>
    </div>
  );
}
