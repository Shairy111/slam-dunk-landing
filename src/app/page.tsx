"use client";

import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/ui/Header";
import { HeroOverlay } from "@/components/ui/HeroOverlay";
import { PerformanceSection } from "@/components/ui/PerformanceSection";
import { SpecsSection } from "@/components/ui/SpecsSection";
import { Scene } from "@/components/3d/Scene";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTransitionSound } from "@/hooks/useTransitionSound";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type SlideData = {
  id: number;
  titleLeft: string;
  titleRight: string;
  price: string;
  size: string;
  themeColor: string;
  buttonColor: string;
  ballBaseColor: string;
  ballLineColor: string;
  patternType?: "classic" | "grid";
};

const slides: SlideData[] = [
  {
    id: 1,
    titleLeft: "SPA",
    titleRight: "ING",
    price: "$34.99",
    size: "29.5\"",
    themeColor: "#E63E00", // Richer, slightly darker brand orange
    buttonColor: "#E63E00",
    ballBaseColor: "#CC1F00",
    ballLineColor: "#080808",
    patternType: "classic",
  },
  {
    id: 2,
    titleLeft: "VER",
    titleRight: "TEX",
    price: "$49.99",
    size: "29.5\"",
    themeColor: "#052e16", // Dark Forest Green
    buttonColor: "#00FF33", // Neon Green
    ballBaseColor: "#111111", // Dark Grey/Black ball
    ballLineColor: "#00FF33", // Neon Green lines
    patternType: "classic",
  },
  {
    id: 3,
    titleLeft: "NEB",
    titleRight: "ULA",
    price: "$59.99",
    size: "29.5\"",
    themeColor: "#020816", // Very dark navy/black
    buttonColor: "#00BFFF", // Bright cyan
    ballBaseColor: "#001188", // Deep blue
    ballLineColor: "#00BFFF", // Cyan
    patternType: "grid",
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const mainWrapperRef = useRef<HTMLDivElement>(null);
  const playTransitionSound = useTransitionSound();

  const handleNext = () => {
    playTransitionSound();
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    playTransitionSound();
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const themeBgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate the background color change of the main wrapper
    if (mainWrapperRef.current) {
      gsap.to(mainWrapperRef.current, {
        backgroundColor: slides[currentSlide].themeColor,
        duration: 1,
        ease: "power2.inOut"
      });
    }
  }, [currentSlide]);

  // Fade in the theme background when reaching the 3rd section
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(themeBgRef.current, {
        opacity: 1,
        scrollTrigger: {
          trigger: "#section-3",
          start: "top bottom",
          end: "top top",
          scrub: true,
        }
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={mainWrapperRef}
      id="main-scroll-container"
      className="flex flex-col w-full min-h-[300vh] transition-colors duration-1000 p-[1vw] md:p-[2vw]"
      style={{ backgroundColor: slides[0].themeColor }}
    >
      {/* 
        This is the inner black container that holds everything. 
        It needs bg-brand-dark to keep the hero section black, while the outer wrapper handles the colored border.
      */}
      <div 
        id="inner-scroll-container"
        ref={containerRef}
        className="relative flex-1 w-full bg-[#0A0A0A] shadow-2xl rounded-3xl md:rounded-[2.5rem] overflow-hidden"
      >
        {/* Animated Background for Section 3 */}
        <div 
          ref={themeBgRef}
          className="absolute inset-0 z-0 pointer-events-none transition-all duration-1000 opacity-0"
          style={{ 
            background: `radial-gradient(circle at center, ${slides[currentSlide].themeColor}33 0%, transparent 60%)` 
          }}
        />

        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none px-8 py-6 md:px-12 md:py-8">
          <Header />
        </div>

        {/* Global Fixed 3D Canvas Background - Must be absolutely fixed to viewport so it never scrolls out of view */}
        <div className="fixed top-0 left-0 w-full h-screen overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 pointer-events-auto">
            <Scene slide={slides[currentSlide]} />
          </div>
        </div>

        {/* Scrollable Content Layers - Native vertical scrolling block */}
        <div className="relative w-full z-10 pointer-events-none flex flex-col">
          {/* Section 1: Hero Carousel (100vh) */}
          <div id="section-1" className="w-full h-screen relative shrink-0">
            <HeroOverlay 
              slide={slides[currentSlide]} 
              totalSlides={slides.length}
              currentIndex={currentSlide}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          </div>

          {/* Section 2: Performance Metrics (100vh) */}
          <div id="section-2" className="w-full h-screen relative shrink-0">
            <PerformanceSection slide={slides[currentSlide]} />
          </div>

          {/* Section 3: Technical Specs (100vh) */}
          <div id="section-3" className="w-full h-screen relative shrink-0">
            <SpecsSection slide={slides[currentSlide]} />
          </div>
        </div>

      </div>
    </div>
  );
}
