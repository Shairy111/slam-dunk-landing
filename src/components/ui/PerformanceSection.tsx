import React from "react";
import { SlideData } from "@/app/page";

type PerformanceSectionProps = {
  slide: SlideData;
};

export const PerformanceSection = ({ slide }: PerformanceSectionProps) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-center px-6 md:px-12 lg:px-24 pointer-events-none pt-24 md:pt-0">
      
      {/* 
        Title Block 
        Added margin-top on mobile to avoid header overlap.
        Used clamp() for fluid typography to prevent cramping on smaller screens.
      */}
      <div className="mb-8 md:mb-16 mt-16 md:mt-0">
        <div className="flex items-center gap-2 mb-2 md:mb-4">
          <div 
            className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full" 
            style={{ backgroundColor: slide.themeColor }}
          />
          <span 
            className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase"
            style={{ color: slide.themeColor }}
          >
            Performance Metrics
          </span>
        </div>
        <h2 className="font-anton leading-[0.9] text-white tracking-wider text-[clamp(4rem,10vw,8rem)]">
          ELITE<br />CONTROL
        </h2>
      </div>

      {/* Metrics List */}
      <div className="flex flex-col gap-8 md:gap-12 max-w-[280px] md:max-w-sm">
        
        {/* Metric 1 */}
        <div className="border-l border-[#333333] pl-5 md:pl-6 relative">
          {/* Active indicator line */}
          <div 
            className="absolute left-[-1px] top-0 bottom-0 w-[2px]" 
            style={{ backgroundColor: slide.buttonColor }}
          />
          <div className="text-4xl md:text-5xl font-bold text-white mb-1">
            100<span className="text-xl md:text-2xl">%</span>
          </div>
          <div className="text-[10px] md:text-xs tracking-[0.15em] text-brand-gray font-medium mb-2 md:mb-3 uppercase">
            Microfiber Composite
          </div>
          <p className="text-xs md:text-sm text-[#888888] leading-relaxed">
            Exclusive coating material providing superior grip management in all weather conditions.
          </p>
        </div>

        {/* Metric 2 */}
        <div className="border-l border-[#333333] pl-5 md:pl-6 transition-opacity opacity-50 hover:opacity-100">
          <div className="text-4xl md:text-5xl font-bold text-white mb-1">
            0.5<span className="text-xl md:text-2xl text-brand-gray">mm</span>
          </div>
          <div className="text-[10px] md:text-xs tracking-[0.15em] text-brand-gray font-medium mb-2 md:mb-3 uppercase">
            Pebble Depth
          </div>
          <p className="text-xs md:text-sm text-[#888888] leading-relaxed">
            Optimized surface texture for precision handling and rotational feedback.
          </p>
        </div>

      </div>
    </div>
  );
};
