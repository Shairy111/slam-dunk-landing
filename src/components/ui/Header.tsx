import React, { useEffect, useRef } from "react";
import { User, ShoppingBag } from "lucide-react";
import gsap from "gsap";

export const Header = () => {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 }
    );
  }, []);

  return (
    <header
      ref={headerRef}
      className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-8 md:px-12 md:py-10"
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-brand-light">
          <div className="w-6 h-1 bg-brand-light"></div>
        </div>
        <div className="flex flex-col uppercase font-anton text-xl leading-none tracking-wider">
          <span>Slam</span>
          <span>Dunk</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-10 text-sm font-medium">
        <a
          href="#products"
          className="text-brand-orange transition-colors duration-300"
        >
          Products
        </a>
        <a
          href="#customize"
          className="text-brand-gray hover:text-brand-light transition-colors duration-300"
        >
          Customize
        </a>
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
          aria-label="Shopping Cart"
          className="text-brand-light hover:text-brand-orange transition-colors duration-300"
        >
          <ShoppingBag size={20} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
};
