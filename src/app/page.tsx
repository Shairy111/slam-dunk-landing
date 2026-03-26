"use client";

import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/ui/Header";
import { HeroOverlay } from "@/components/ui/HeroOverlay";
import { PerformanceSection } from "@/components/ui/PerformanceSection";
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
    themeColor: "#FF4400", // Brand Orange
    buttonColor: "#FF4400",
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

  return (
    <div 
      ref={mainWrapperRef}
      id="main-scroll-container"
      className="w-full min-h-[200vh] transition-colors duration-1000"
      style={{ backgroundColor: slides[0].themeColor }}
    >
      <div 
        ref={containerRef}
        className="relative w-full h-[200vh] bg-brand-dark shadow-2xl"
      >
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none px-8 py-6 md:px-12 md:py-8">
          <Header />
        </div>

        {/* Global Fixed 3D Canvas Background - Must be absolutely fixed to viewport so it never scrolls out of view */}
        <div className="sticky top-0 w-full h-screen overflow-hidden">
          <Scene slide={slides[currentSlide]} />
        </div>

        {/* Scrollable Content Layers - Absolute positioned over the sticky canvas to allow native body scroll */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 flex flex-col">
          {/* Section 1: Hero Carousel (100vh) */}
          <div className="w-full h-screen relative shrink-0">
            <HeroOverlay 
              slide={slides[currentSlide]} 
              totalSlides={slides.length}
              currentIndex={currentSlide}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          </div>

          {/* Section 2: Performance Metrics (100vh) */}
          <div className="w-full h-screen relative shrink-0">
            <PerformanceSection slide={slides[currentSlide]} />
          </div>
        </div>

      </div>
    </div>
  );
}
