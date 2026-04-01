import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { User } from "lucide-react";
import gsap from "gsap";
import { useSwishSound } from "@/hooks/useSwishSound";

const HoopIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Backboard */}
    <rect x="3" y="2" width="18" height="12" rx="2" />
    <rect x="9" y="6" width="6" height="4" />
    {/* Rim */}
    <line x1="6" y1="12" x2="18" y2="12" strokeWidth="2" stroke="#FF4400" />
    {/* Net */}
    <path d="M7 12 L8.5 21 L15.5 21 L17 12" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
    <path d="M10 12 L10.5 21" stroke="currentColor" strokeWidth="1" />
    <path d="M14 12 L13.5 21" stroke="currentColor" strokeWidth="1" />
    <path d="M8 15 L16 15" stroke="currentColor" strokeWidth="1" />
    <path d="M8.2 18 L15.8 18" stroke="currentColor" strokeWidth="1" />
  </svg>
);

export const Header = () => {
  const headerRef = useRef<HTMLElement>(null);
  const hoopRef = useRef<HTMLButtonElement>(null);
  const [cartCount, setCartCount] = useState(0);
  const playSwish = useSwishSound();

  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 }
    );

    const handleDunkSuccess = () => {
      if (!hoopRef.current) return;
      
      playSwish();
      
      // Update cart counter
      setCartCount(prev => prev + 1);

      // Net swish animation
      gsap.timeline()
        .to(hoopRef.current, { y: 10, scaleY: 1.2, duration: 0.15, ease: "power2.out" })
        .to(hoopRef.current, { y: -5, scaleY: 0.9, duration: 0.15, ease: "power2.inOut" })
        .to(hoopRef.current, { y: 0, scaleY: 1, duration: 0.3, ease: "elastic.out(1.5, 0.5)" });
        
      // Animate the dot
      gsap.fromTo("#cart-dot", 
        { scale: 0, opacity: 1 }, 
        { scale: 1, duration: 0.4, ease: "back.out(2)" }
      );
    };

    window.addEventListener("dunk-success", handleDunkSuccess);
    return () => window.removeEventListener("dunk-success", handleDunkSuccess);
  }, [playSwish]);

  return (
    <header
      ref={headerRef}
      className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-8 md:px-12 md:py-10 pointer-events-auto"
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-brand-light">
          <div className="w-6 h-1 bg-brand-light"></div>
        </div>
        <div className="flex flex-col uppercase font-anton text-xl leading-none tracking-wider">
          <span>Aero</span>
          <span>Dunk</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-10 text-sm font-medium">
        <Link
          href="/"
          className="text-brand-orange transition-colors duration-300"
        >
          Products
        </Link>
        <Link
          href="/customize"
          className="text-brand-gray hover:text-brand-light transition-colors duration-300"
        >
          Customize
        </Link>
        <a
          href="#contacts"
          className="text-brand-gray hover:text-brand-light transition-colors duration-300"
        >
          Contacts
        </a>
      </nav>

      {/* Icons */}
      <div className="flex items-center gap-6">
        <button
          aria-label="User Profile"
          className="text-brand-light hover:text-brand-orange transition-colors duration-300"
        >
          <User size={20} strokeWidth={1.5} />
        </button>
        <button
          ref={hoopRef}
          aria-label="Shopping Cart (Hoop)"
          className="text-brand-light hover:text-brand-orange transition-colors duration-300 relative group"
        >
          <HoopIcon size={24} className="group-hover:scale-110 transition-transform duration-300" />
          {/* Cart item counter dot */}
          <div 
            id="cart-dot"
            className="absolute -top-2 -right-2 w-4 h-4 bg-brand-orange rounded-full flex items-center justify-center text-[9px] font-bold text-black opacity-0"
            style={{ opacity: cartCount > 0 ? 1 : 0 }}
          >
            {cartCount}
          </div>
        </button>
      </div>
    </header>
  );
};
