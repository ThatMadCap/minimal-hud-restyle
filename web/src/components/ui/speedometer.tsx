import React, { useEffect, useMemo, useRef } from "react";
import { PiEngineFill } from "react-icons/pi";

interface SpeedometerProps {
  speed: number;
  maxRpm: number;
  rpm: number;
  gears: number;
  engineHealth: number;
}

const Speedometer: React.FC<SpeedometerProps> = React.memo(function Speedometer({ speed = 50, maxRpm = 100, rpm = 20, gears = 8, engineHealth = 50 }) {
  const percentage = useMemo(() => (rpm / maxRpm) * 100, [rpm, maxRpm]);
  const activeArcRef = useRef<SVGPathElement>(null);

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const createArc = useMemo(
    () => (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
      const start = polarToCartesian(x, y, radius, startAngle);
      const end = polarToCartesian(x, y, radius, endAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
      return ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y].join(" ");
    },
    [],
  );

  const createGearLine = useMemo(
    () => (centerX: number, centerY: number, innerRadius: number, outerRadius: number, angle: number) => {
      const inner = polarToCartesian(centerX, centerY, innerRadius, angle);
      const outer = polarToCartesian(centerX, centerY, outerRadius, angle);
      return `M ${inner.x} ${inner.y} L ${outer.x} ${outer.y}`;
    },
    [],
  );

  useEffect(() => {
    if (activeArcRef.current) {
      const length = activeArcRef.current.getTotalLength();
      const offset = length * (1 - percentage / 100);
      activeArcRef.current.style.strokeDasharray = `${length} ${length}`;
      activeArcRef.current.style.strokeDashoffset = `${offset}`;
    }
  }, [percentage]);

  const gearLines = useMemo(
    () =>
      [...Array(gears)].map((_, i) => {
        const angle = -120 + (i * 240) / (gears - 1);
        const textPosition = polarToCartesian(0, 0, 30, angle); 
        return (
          <g key={`gear-${i}`}>
            <path
              d={createGearLine(0, 0, 37, 43, angle)}
              stroke="#dee2e6"
              strokeWidth="2.5"
              opacity="100"
              strokeLinecap="round"
            />
            <text
              x={textPosition.x}
              y={textPosition.y}
              textAnchor="middle"
              alignmentBaseline="middle"
              fill="white"
              fontSize="5" 
              fontWeight="bold"
            >
              {i}
            </text>
          </g>
        );
      }),
    [gears, createGearLine, polarToCartesian],
  );

  return (
    <div className="w-60 2k:w-[15dvw] 2k:h-[21dvh] 4k:w-[10dvw] 4k:h-[20dvh] h-64 relative flex items-center justify-center -mb-20 z-0">
      <svg viewBox="-50 -50 100 100" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g filter="url(#glow)">
          <path d={createArc(0, 0, 40, -120, 120)} fill="none" stroke="#11181a27" strokeWidth="4" />
          <path
            ref={activeArcRef}
            d={createArc(0, 0, 40, -120, 120)}
            fill="none"
            strokeWidth="4"
            className="transition-all duration-300 ease-in-out"
            style={{
              stroke: percentage >= 90 ? "#fe2436" : percentage >= 85 ? "#FB8607" : "#06CE6B",
            }}
          />
        </g>
        {gearLines}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center flex flex-col">
          <span className="text-[2vw] font-bold text-white tabular-nums drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)]">{speed}</span>
          <span className="text-[1vw] -mt-1 font-semibold text-gray-400 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)]">MPH</span>
          {engineHealth < 30 && (
            <div className={"flex items-center justify-center *:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)] *:size-[0.9vw] *:text-red-600 mt-1"}>
              <PiEngineFill />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default Speedometer;