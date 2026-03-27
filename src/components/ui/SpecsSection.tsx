import React from "react";
import { SlideData } from "@/app/page";

type SpecsSectionProps = {
  slide: SlideData;
};

export const SpecsSection = ({ slide }: SpecsSectionProps) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
      
      {/* Animated Background HUD Rings (SVG) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-60 z-0">
        {/* Static Crosshairs */}
        <div className="w-full h-[1px] bg-[#333333]/50 absolute" />
        <div className="w-[1px] h-full bg-[#333333]/50 absolute" />

        <svg className="absolute w-[150vmin] h-[150vmin] max-w-[1000px] max-h-[1000px]" viewBox="0 0 1000 1000">
          {/* Inner Ring Group - Clockwise */}
          <g style={{ transformOrigin: 'center', animation: 'spin 20s linear infinite' }}>
            <circle cx="500" cy="500" r="220" fill="none" stroke="#444444" strokeWidth="1" />
            {/* Ticks */}
            <line x1="500" y1="270" x2="500" y2="290" stroke="#777777" strokeWidth="2" />
            <line x1="500" y1="710" x2="500" y2="730" stroke="#777777" strokeWidth="2" />
            <line x1="270" y1="500" x2="290" y2="500" stroke="#777777" strokeWidth="2" />
            <line x1="710" y1="500" x2="730" y2="500" stroke="#777777" strokeWidth="2" />
          </g>

          {/* Middle Ring Group - Counter-Clockwise */}
          <g style={{ transformOrigin: 'center', animation: 'spin 30s linear infinite reverse' }}>
            <circle cx="500" cy="500" r="320" fill="none" stroke="#333333" strokeWidth="1.5" strokeDasharray="4 12" />
            {/* Theme colored sweeping arc 1 */}
            <circle cx="500" cy="500" r="320" fill="none" stroke={slide.themeColor} strokeWidth="2" strokeDasharray="100 2000" strokeLinecap="round" />
            {/* Theme colored sweeping arc 2 */}
            <circle cx="500" cy="500" r="320" fill="none" stroke={slide.themeColor} strokeWidth="2" strokeDasharray="100 2000" strokeDashoffset="-1000" strokeLinecap="round" />
            
            {/* Extra Accent Ticks */}
            <line x1="500" y1="170" x2="500" y2="190" stroke="#ffffff" strokeWidth="1" transform="rotate(45 500 500)" />
            <line x1="500" y1="170" x2="500" y2="190" stroke="#ffffff" strokeWidth="1" transform="rotate(225 500 500)" />
          </g>

          {/* Outer Ring Group - Clockwise Slow */}
          <g style={{ transformOrigin: 'center', animation: 'spin 40s linear infinite' }}>
            <circle cx="500" cy="500" r="420" fill="none" stroke="#222222" strokeWidth="1" />
            {/* 8 Ticks around */}
            {Array.from({ length: 8 }).map((_, i) => (
              <line 
                key={i} 
                x1="500" y1="70" x2="500" y2="90" 
                stroke={i % 2 === 0 ? slide.themeColor : "#555555"} 
                strokeWidth={i % 2 === 0 ? 3 : 1} 
                transform={`rotate(${i * 45} 500 500)`} 
              />
            ))}
          </g>
        </svg>
      </div>

      {/* Top Left Spec */}
      <div className="absolute top-[20%] left-[10%] md:left-[20%] z-10 flex flex-col items-start">
        <div className="flex items-center gap-4">
          <div className="w-[2px] h-12" style={{ backgroundColor: slide.themeColor }} />
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
          <div className="w-[2px] h-12" style={{ backgroundColor: slide.buttonColor }} />
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

      {/* Top Center Grey Marker Dot (Mapping to the screenshot) */}
      <div className="absolute top-[28%] md:top-[20%] lg:top-[15%] left-1/2 -translate-x-1/2 w-5 h-5 md:w-7 md:h-7 bg-[#666666] rounded-full shadow-lg z-10" />

    </div>
  );
};