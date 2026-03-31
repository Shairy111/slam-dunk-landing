import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, PerspectiveCamera } from "@react-three/drei";
import { Basketball } from "./Basketball";
import { SlideData } from "@/app/page";

type SceneProps = {
  slide: SlideData;
};

// Error boundary fallback to prevent whole canvas from crashing if a texture fails
const FallbackSphere = () => (
  <mesh>
    <sphereGeometry args={[2.5, 32, 32]} />
    <meshStandardMaterial color="#CC1F00" roughness={0.8} />
  </mesh>
);

export const Scene = ({ slide }: SceneProps) => {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* 
        Reduced dpr from [1, 2] to 1 to cap pixel density and massively improve GPU performance 
        Added pointer-events-auto to the Canvas so it can receive clicks, but kept pointer-events-none on the wrapper
        so it doesn't block the UI buttons underneath.
      */}
      <div className="absolute inset-0 pointer-events-auto">
        <Canvas shadows dpr={1} performance={{ min: 0.5 }}>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
        
        {/* Lighting setup for the cinematic, premium feel */}
        <ambientLight intensity={0.2} />
        
        {/* Main Key Light */}
        <directionalLight
          position={[5, 8, 5]}
          intensity={3}
          castShadow
          // Reduced shadow map size from 2048 to 512. Looks almost identical but much faster.
          shadow-mapSize={512}
          shadow-bias={-0.0001}
        />
        
        {/* Warm fill light */}
        <directionalLight
          position={[-5, -2, -5]}
          intensity={1.5}
          color={slide.themeColor}
        />
        
        {/* Rim light for edge definition and highlighting the leather bumps */}
        <pointLight position={[-3, 3, 2]} intensity={2.5} color="#ffffff" distance={10} />
        <pointLight position={[3, -3, 2]} intensity={1.5} color={slide.buttonColor} distance={10} />

        <Suspense fallback={<FallbackSphere />}>
          <group>
            <Basketball slide={slide} />
          </group>
          
          {/* Subtle reflections to give it that glossy/premium finish */}
          <Environment preset="city" environmentIntensity={0.8} />
          
          {/* Shadow underneath */}
          <ContactShadows
            position={[0, -2.8, 0]}
            opacity={0.7}
            scale={12}
            blur={2}
            far={4}
            color="#000000"
            // Reduced contact shadow resolution from 512 to 256. Contact shadows are VERY expensive.
            resolution={256}
            // Add frames=1 so the shadow bakes once instead of recalculating every single frame
            frames={1}
          />
        </Suspense>
      </Canvas>
      </div>
    </div>
  );
};
