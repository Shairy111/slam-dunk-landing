import React from "react";
import { SlideData } from "@/app/page";

type SpecsSectionProps = {
  slide: SlideData;
};

export const SpecsSection = ({ slide }: SpecsSectionProps) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
      
      {/* Background HUD Rings */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 z-0">
        <div className="w-[30vw] h-[30vw] border border-[#333333] rounded-full absolute" />
        <div className="w-[45vw] h-[45vw] border border-[#333333] rounded-full absolute border-dashed" />
        <div className="w-[60vw] h-[60vw] border border-[#333333] rounded-full absolute" />
        
        {/* Crosshairs */}
        <div className="w-full h-[1px] bg-[#333333] absolute" />
        <div className="w-[1px] h-full bg-[#333333] absolute" />
        
        {/* Accent marks */}
        <div className="w-2 h-2 rounded-full absolute top-[15%] left-[30%]" style={{ backgroundColor: slide.themeColor }} />
        <div className="w-2 h-2 rounded-full absolute bottom-[20%] right-[25%]" style={{ backgroundColor: slide.themeColor }} />
        <div className="w-2 h-2 rounded-full absolute top-[40%] right-[15%]" style={{ backgroundColor: slide.themeColor }} />
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

      {/* Interactive Dot (Decorative UI element mapping to the screenshot) */}
      <div className="absolute bottom-12 right-12 md:bottom-24 md:right-24 w-8 h-8 md:w-12 md:h-12 bg-[#333333] rounded-full flex items-center justify-center hover:bg-white transition-colors cursor-pointer pointer-events-auto">
        <div className="w-2 h-2 bg-black rounded-full" />
      </div>

    </div>
  );
};