import React, { useEffect, useRef } from "react";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { SlideData } from "@/app/page";

type HeroOverlayProps = {
  slide: SlideData;
  totalSlides: number;
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
};

export const HeroOverlay = ({ slide, totalSlides, currentIndex, onNext, onPrev }: HeroOverlayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textLeftRef = useRef<HTMLSpanElement>(null);
  const textRightRef = useRef<HTMLSpanElement>(null);
  const uiElementsRef = useRef<HTMLDivElement[]>([]);
  const priceRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !uiElementsRef.current.includes(el)) {
      uiElementsRef.current.push(el);
    }
  };

  // Initial mount animation
  useEffect(() => {
    const tl = gsap.timeline();
    gsap.set([textLeftRef.current, textRightRef.current], { y: 100, opacity: 0 });
    gsap.set(uiElementsRef.current, { y: 20, opacity: 0 });

    tl.to([textLeftRef.current, textRightRef.current], {
      y: 0,
      opacity: 1, 
      duration: 1.5,
      ease: "power4.out",
      delay: 0.5,
    });

    tl.to(
      uiElementsRef.current,
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
      },
      "-=1"
    );

    return () => {
      tl.kill();
    };
  }, []);

  // Slide transition animations
  useEffect(() => {
    // Animate text change
    gsap.fromTo(
      [textLeftRef.current, textRightRef.current],
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
    );

    // Animate price change
    gsap.fromTo(
      priceRef.current,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
    );

    // Animate button color
    gsap.to(buttonRef.current, {
      backgroundColor: slide.buttonColor,
      boxShadow: `0 20px 25px -5px ${slide.buttonColor}33`, // 20% opacity hex
      duration: 0.5,
      ease: "power2.out"
    });

    // Animate pagination color
    gsap.to(paginationRef.current, {
      color: slide.buttonColor,
      duration: 0.5,
    });

  }, [slide]);

  const formattedIndex = String(currentIndex + 1).padStart(2, "0");
  const formattedTotal = String(totalSlides).padStart(2, "0");

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-50 flex flex-col justify-between p-8 md:p-12"
    >
      {/* Background Huge Text - Now split with a physical gap for the ball */}
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <h1 className="font-anton text-[15vw] leading-none text-[#555555] tracking-widest select-none flex items-center justify-center w-full">
          <span ref={textLeftRef} className="text-right flex-1 pr-[18vw] transition-all">
            {slide.titleLeft}
          </span>
          <span ref={textRightRef} className="text-left flex-1 pl-[18vw] transition-all">
            {slide.titleRight}
          </span>
        </h1>
      </div>

      {/* Spacer for Header */}
      <div className="h-16 md:h-24 z-20" />

      {/* Promotion Video Button */}
      <div
        ref={addToRefs}
        className="flex items-center gap-4 pointer-events-auto w-fit z-50"
      >
        <button
          className="flex items-center justify-center w-12 h-12 rounded-full border border-brand-gray/30 hover:border-brand-light transition-colors duration-300 group"
          aria-label="Play Promotion Video"
        >
          <Play
            size={16}
            className="text-brand-light ml-1 transition-colors"
            style={{ color: "var(--color-brand-light)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = slide.buttonColor)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-brand-light)")}
            fill="currentColor"
          />
        </button>
        <span className="text-brand-gray text-xs w-16 leading-tight uppercase tracking-wide">
          Promotion video
        </span>
      </div>

      {/* Bottom Section */}
      <div className="flex items-end justify-between w-full pointer-events-auto z-50">
        {/* Left: Price and Size */}
        <div ref={addToRefs} className="flex flex-col gap-1">
          <div 
            ref={priceRef}
            className="text-5xl md:text-6xl font-medium tracking-tight transition-colors duration-500"
            style={{ color: slide.buttonColor }}
          >
            {slide.price}
          </div>
          <div className="text-brand-gray text-xs md:text-sm tracking-widest font-medium mt-1">
            SIZE: <span className="text-brand-light">{slide.size}</span> • OFFICIAL
          </div>
          <div className="text-[#3A3A3A] text-[10px] mt-4 font-bold">Ru</div>
        </div>

        {/* Center: Add to Cart Button */}
        <div
          ref={addToRefs}
          className="absolute left-1/2 bottom-8 md:bottom-12 -translate-x-1/2 pointer-events-auto z-50"
        >
          <button 
            ref={buttonRef}
            className="text-[#0A0A0A] px-10 py-4 md:px-14 md:py-5 text-sm md:text-base font-bold tracking-[0.2em] uppercase transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: slide.buttonColor }}
          >
            Add to cart
          </button>
        </div>

        {/* Right: Controls & Pagination */}
        <div ref={addToRefs} className="flex flex-col items-end gap-6 z-50">
          {/* Vertical Pagination */}
          <div 
            ref={paginationRef}
            className="absolute right-8 md:right-12 top-1/2 -translate-y-1/2 rotate-90 font-bold text-sm tracking-widest"
            style={{ color: slide.buttonColor }}
          >
            {formattedIndex}/{formattedTotal}
          </div>

          {/* Color/Style Indicator */}
          <div className="w-6 h-6 rounded-full bg-[#555555] mb-2 mr-2 cursor-pointer hover:scale-110 transition-transform"></div>

          {/* Arrows */}
          <div className="flex items-center gap-4">
            <button 
              onClick={onPrev}
              className="flex items-center justify-center w-12 h-12 rounded-full border border-brand-gray/30 hover:border-brand-light transition-all duration-300 group hover:bg-white/5 active:scale-90"
            >
              <ChevronLeft
                size={18}
                className="text-brand-gray group-hover:text-brand-light"
              />
            </button>
            <button 
              onClick={onNext}
              className="flex items-center justify-center w-12 h-12 rounded-full border border-brand-gray/30 hover:border-brand-light transition-all duration-300 group hover:bg-white/5 active:scale-90"
            >
              <ChevronRight
                size={18}
                className="text-brand-gray group-hover:text-brand-light"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
