import React from "react";
import { SlideData } from "@/app/page";

type SpecsSectionProps = {
  slide: SlideData;
};

export const SpecsSection = ({ slide }: SpecsSectionProps) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none -mt-[1vw] md:-mt-[2vw]">
      
      {/* Animated Background HUD Rings (SVG) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-80 z-0">
        {/* Static Crosshairs */}
        <div className="w-full h-[1px] bg-[#333333]/40 absolute" />
        <div className="w-[1px] h-full bg-[#333333]/40 absolute" />

        <svg className="absolute w-[140vmin] h-[140vmin] max-w-[900px] max-h-[900px]" viewBox="0 0 1000 1000">
          <style>
            {`
              @keyframes spin-cw { 100% { transform: rotate(360deg); } }
              @keyframes spin-ccw { 100% { transform: rotate(-360deg); } }
              @keyframes pulse-opacity { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
            `}
          </style>

          {/* Define a drop shadow filter to make theme lines pop against the background */}
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer pulsing thin ring */}
          <circle cx="500" cy="500" r="460" fill="none" stroke="#222" strokeWidth="1" />
          <g style={{ transformOrigin: 'center', animation: 'spin-cw 40s linear infinite' }}>
            <circle cx="500" cy="500" r="460" fill="none" stroke={slide.buttonColor} strokeWidth="2.5" strokeDasharray="10 40 30 100" style={{ animation: 'pulse-opacity 4s ease-in-out infinite' }} filter="url(#glow)" />
          </g>

          {/* Middle complex tracking ring */}
          <circle cx="500" cy="500" r="380" fill="none" stroke="#1a1a1a" strokeWidth="8" />
          <g style={{ transformOrigin: 'center', animation: 'spin-ccw 25s linear infinite' }}>
            <circle cx="500" cy="500" r="380" fill="none" stroke="#333" strokeWidth="2" strokeDasharray="4 16" />
            {/* Theme colored arcs - Using buttonColor for much higher visibility/contrast */}
            <circle cx="500" cy="500" r="380" fill="none" stroke={slide.buttonColor} strokeWidth="5" strokeDasharray="150 2000" strokeLinecap="round" filter="url(#glow)" />
            <circle cx="500" cy="500" r="380" fill="none" stroke={slide.buttonColor} strokeWidth="5" strokeDasharray="80 2000" strokeDashoffset="-800" strokeLinecap="round" filter="url(#glow)" />
            
            {/* Glow/Pulse effect on an arc */}
            <circle cx="500" cy="500" r="380" fill="none" stroke={slide.buttonColor} strokeWidth="8" strokeDasharray="20 2000" strokeDashoffset="-300" strokeLinecap="round" style={{ animation: 'pulse-opacity 2s infinite' }} filter="url(#glow)" />
          </g>

          {/* Inner tight framing ring */}
          <g style={{ transformOrigin: 'center', animation: 'spin-cw 15s linear infinite' }}>
            <circle cx="500" cy="500" r="300" fill="none" stroke="#444" strokeWidth="1" strokeDasharray="100 20" />
            <circle cx="500" cy="500" r="300" fill="none" stroke={slide.buttonColor} strokeWidth="3" strokeDasharray="40 2000" strokeLinecap="round" filter="url(#glow)" />
            <circle cx="500" cy="500" r="290" fill="none" stroke="#555" strokeWidth="1" strokeDasharray="2 8" />
          </g>

          {/* Animated Target brackets */}
          <g style={{ animation: 'pulse-opacity 3s infinite' }} filter="url(#glow)">
            <path d="M 480 120 L 500 100 L 520 120" fill="none" stroke={slide.buttonColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 480 880 L 500 900 L 520 880" fill="none" stroke={slide.buttonColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 120 480 L 100 500 L 120 520" fill="none" stroke={slide.buttonColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 880 480 L 900 500 L 880 520" fill="none" stroke={slide.buttonColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* Top Center Grey Marker Dot (glued to the inner ring radius=300 -> y=200) */}
          <g transform="translate(500, 200)">
            <circle cx="0" cy="0" r="14" fill="#444" />
            <circle cx="0" cy="0" r="4" fill="#111" />
          </g>
        </svg>
      </div>

      {/* Top Left Spec */}
      <div className="absolute top-[20%] left-[10%] md:left-[20%] z-10 flex flex-col items-start">
        <div className="flex items-center gap-4">
          <div className="w-[2px] h-12 transition-colors duration-500" style={{ backgroundColor: slide.themeColor }} />
          <div>
            <div className="text-white text-3xl md:text-5xl font-bold tracking-tight">1.2<span className="text-xl md:text-2xl text-brand-gray">mm</span></div>
            <div className="text-brand-gray text-[10px] md:text-xs tracking-[0.2em] uppercase mt-1">Pebble Height</div>
          </div>
        </div>
        <div className="mt-8 ml-8">
          <div className="text-[8px] md:text-[10px] tracking-[0.3em] uppercase text-white font-bold mb-1">Micro-Texture</div>
          <div className="text-[#555555] text-[10px] tracking-widest">ELEVATION: 12.8°</div>
        </div>
      </div>

      {/* Bottom Right Spec */}
      <div className="absolute bottom-[20%] right-[10%] md:right-[20%] z-10 flex flex-col items-end text-right">
        <div className="flex items-center gap-4 flex-row-reverse">
          <div className="w-[2px] h-12 transition-colors duration-500" style={{ backgroundColor: slide.buttonColor }} />
          <div>
            <div className="text-white text-3xl md:text-5xl font-bold tracking-tight">High-Tack</div>
            <div className="text-brand-gray text-[10px] md:text-xs tracking-[0.2em] uppercase mt-1">Coating Spec</div>
          </div>
        </div>
        <div className="mt-8 mr-8">
          <div className="text-[8px] md:text-[10px] tracking-[0.3em] uppercase text-white font-bold mb-1">Channel Depth</div>
          <div className="text-[#555555] text-[10px] tracking-widest">AZIMUTH: 45.2°</div>
        </div>
      </div>
    </div>
  );
};