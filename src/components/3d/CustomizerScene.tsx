import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Float } from "@react-three/drei";
import { CustomizerBall } from "./CustomizerBall";

type CustomizerSceneProps = {
  baseColor: string;
  lineColor: string;
  patternType: string;
};

// Error boundary fallback to prevent whole canvas from crashing if a texture fails
const FallbackSphere = () => (
  <mesh>
    <sphereGeometry args={[3, 32, 32]} />
    <meshStandardMaterial color="#330000" roughness={0.8} />
  </mesh>
);

export const CustomizerScene = ({ baseColor, lineColor, patternType }: CustomizerSceneProps) => {
  return (
    <div className="w-full h-full relative">
      {/* Huge background text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center md:items-end md:justify-start md:pr-12 md:pt-12 pointer-events-none z-0 overflow-hidden select-none">
        <h1 className="font-anton text-[15vw] leading-none text-[#1A1A1A] tracking-tighter mix-blend-plus-lighter uppercase m-0 p-0">
          CUSTOM
        </h1>
        <h2 className="font-mono text-2xl md:text-4xl text-[#333333] tracking-[0.5em] uppercase font-bold pr-4">
          LAB EDITION
        </h2>
      </div>

      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        className="w-full h-full z-10"
        dpr={[1, 2]}
      >
        <Suspense fallback={<FallbackSphere />}>
          <Environment preset="studio" environmentIntensity={0.5} />
          
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          
          {/* Studio rim lights to make the matte shine pop */}
          <pointLight position={[-5, 5, -5]} intensity={3} color="#ffffff" />
          <pointLight position={[5, -5, -5]} intensity={2} color={lineColor} />

          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <CustomizerBall baseColor={baseColor} lineColor={lineColor} patternType={patternType} />
          </Float>

          <ContactShadows 
            position={[0, -4, 0]} 
            opacity={0.7} 
            scale={20} 
            blur={2} 
            far={4.5} 
          />

          <OrbitControls 
            enableZoom={true} 
            enablePan={false} 
            minDistance={4}
            maxDistance={12}
            autoRotate={false}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};