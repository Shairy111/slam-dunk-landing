"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { CustomizerScene } from "@/components/3d/CustomizerScene";

// Colors inspired by the screenshot and our previous themes
const BASE_COLORS = [
  { name: "Orange", hex: "#E63E00" },
  { name: "Green", hex: "#004D00" },
  { name: "Blue", hex: "#0033AA" },
  { name: "Dark Red", hex: "#330000" }, // Default from screenshot
  { name: "Pink", hex: "#E6005C" },
  { name: "Black", hex: "#0A0A0A" },
  { name: "White", hex: "#EAEAEA" },
];

const LINE_COLORS = [
  { name: "Black", hex: "#050505" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Yellow", hex: "#FFCC00" },
  { name: "Neon Green", hex: "#00FF66" },
  { name: "Cyan", hex: "#00BFFF" },
  { name: "Red", hex: "#FF0000" }, // Default glowing line from screenshot
  { name: "Gray", hex: "#666666" },
];

const PATTERNS = [
  { id: "classic", label: "CLASSIC" },
  { id: "street", label: "STREET" },
  { id: "tech", label: "TECH" }, // Grid pattern
  { id: "cross", label: "CROSS" }, // Geo pattern
];

export default function CustomizePage() {
  const [baseColor, setBaseColor] = useState(BASE_COLORS[3].hex); // Dark Red
  const [lineColor, setLineColor] = useState(LINE_COLORS[5].hex); // Red
  const [patternType, setPatternType] = useState("tech");

  return (
    <main className="w-full min-h-screen bg-black flex flex-col md:flex-row overflow-hidden text-white font-sans">
      {/* Left Sidebar UI */}
      <div className="w-full md:w-[400px] lg:w-[450px] shrink-0 h-screen overflow-y-auto flex flex-col border-r border-[#222] bg-[#050505] z-20 relative scrollbar-hide">
        
        {/* Back Button */}
        <div className="p-6 md:p-8 pb-4">
          <Link href="/" className="flex items-center gap-2 text-[#888] hover:text-white transition-colors text-xs font-bold tracking-[0.2em] uppercase">
            <ArrowLeft size={16} />
            Back to Shop
          </Link>
        </div>

        {/* Header */}
        <div className="px-6 md:px-8 pb-8">
          <h1 className="font-anton text-4xl md:text-5xl uppercase leading-[0.9] tracking-wider mb-3">
            Aero<br />Lab
          </h1>
          <p className="text-[#888] text-sm font-medium">Create a ball that matches your game.</p>
        </div>

        {/* Configurator Body */}
        <div className="px-6 md:px-8 flex-1 flex flex-col gap-10 pb-24">
          
          {/* Base Color */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[#555] text-xs font-bold tracking-[0.2em] uppercase">Base Color</h3>
            <div className="flex flex-wrap gap-3">
              {BASE_COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setBaseColor(color.hex)}
                  className={`w-10 h-10 rounded-full transition-all duration-300 ${
                    baseColor === color.hex 
                      ? "ring-2 ring-offset-4 ring-offset-[#050505] ring-white scale-110" 
                      : "hover:scale-110 ring-1 ring-transparent hover:ring-[#333]"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  aria-label={color.name}
                />
              ))}
            </div>
          </div>

          {/* Line Color */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[#555] text-xs font-bold tracking-[0.2em] uppercase">Line Color</h3>
            <div className="flex flex-wrap gap-3">
              {LINE_COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setLineColor(color.hex)}
                  className={`w-10 h-10 rounded-full transition-all duration-300 ${
                    lineColor === color.hex 
                      ? "ring-2 ring-offset-4 ring-offset-[#050505] ring-white scale-110" 
                      : "hover:scale-110 ring-1 ring-transparent hover:ring-[#333]"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  aria-label={color.name}
                />
              ))}
            </div>
          </div>

          {/* Grip Texture (Pattern) */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[#555] text-xs font-bold tracking-[0.2em] uppercase">Grip Texture</h3>
            <div className="grid grid-cols-2 gap-3">
              {PATTERNS.map((pattern) => (
                <button
                  key={pattern.id}
                  onClick={() => setPatternType(pattern.id)}
                  className={`py-4 px-4 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 rounded-md border ${
                    patternType === pattern.id
                      ? "bg-white text-black border-white"
                      : "bg-transparent text-[#888] border-[#333] hover:border-[#666] hover:text-white"
                  }`}
                >
                  {pattern.label}
                </button>
              ))}
            </div>
          </div>

          {/* AI Banner */}
          <div className="mt-4 border border-[#FFCC00]/30 rounded-md p-4 flex items-center justify-between cursor-pointer hover:bg-[#FFCC00]/5 transition-colors group">
            <span className="text-[#FFCC00] text-xs font-bold tracking-[0.2em] uppercase">AI Texture Lab</span>
            <Sparkles className="text-[#FFCC00] group-hover:scale-110 transition-transform" size={16} />
          </div>

        </div>

        {/* Sticky Bottom Action */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-[#050505] via-[#050505] to-transparent pt-12">
          <button className="w-full bg-[#FFBB00] hover:bg-[#FFD000] text-black py-5 font-bold tracking-[0.2em] uppercase text-sm rounded-sm transition-colors shadow-[0_0_20px_rgba(255,187,0,0.2)]">
            Add to Collection
          </button>
        </div>
      </div>

      {/* Right 3D Viewport */}
      <div className="flex-1 h-[50vh] md:h-screen relative bg-[#020202]">
        <CustomizerScene baseColor={baseColor} lineColor={lineColor} patternType={patternType} />
      </div>
    </main>
  );
}