import React, { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { useBounceSound } from "@/hooks/useBounceSound";

type CustomizerBallProps = {
  baseColor: string;
  lineColor: string;
  patternType: string;
};

export const CustomizerBall = ({ baseColor, lineColor, patternType }: CustomizerBallProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const playBounceSound = useBounceSound();
  
  // Custom shader uniform references
  const uniforms = useMemo(
    () => ({
      uLineMask: { value: null as THREE.Texture | null },
      uBaseColor: { value: new THREE.Color(baseColor) },
      uLineColor: { value: new THREE.Color(lineColor) },
    }),
    []
  );

  // Load the high-res leather normal and roughness maps
  const [normalMap, roughnessMap] = useTexture([
    "/textures/leather-normal.png",
    "/textures/leather-roughness.png"
  ]);

  // Ensure the textures repeat and wrap correctly around the sphere
  useEffect(() => {
    if (normalMap && roughnessMap) {
      normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
      roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping;
      
      normalMap.repeat.set(4, 4);
      roughnessMap.repeat.set(4, 4);
      
      normalMap.anisotropy = 16;
      roughnessMap.anisotropy = 16;

      normalMap.needsUpdate = true;
      roughnessMap.needsUpdate = true;
    }
  }, [normalMap, roughnessMap]);

  // Animate on color change
  useEffect(() => {
    const targetBaseColor = new THREE.Color(baseColor);
    const targetLineColor = new THREE.Color(lineColor);

    const tl = gsap.timeline();

    tl.to(uniforms.uLineColor.value, {
      r: targetLineColor.r,
      g: targetLineColor.g,
      b: targetLineColor.b,
      duration: 0.5,
      ease: "power2.out",
    }, 0);

    tl.to(uniforms.uBaseColor.value, {
      r: targetBaseColor.r,
      g: targetBaseColor.g,
      b: targetBaseColor.b,
      duration: 0.8,
      ease: "power2.inOut",
    }, 0.1);
  }, [baseColor, lineColor, uniforms]);

  // Use state instead of useMemo to guarantee the canvas is created safely on the client side
  const [textureData, setTextureData] = React.useState<{ canvas: HTMLCanvasElement; texture: THREE.CanvasTexture } | null>(null);

  useEffect(() => {
    // This runs strictly on the client after mount, bypassing SSR issues entirely
    const c = document.createElement("canvas");
    c.width = 2048; 
    c.height = 1024;
    
    const map = new THREE.CanvasTexture(c);
    map.colorSpace = THREE.LinearSRGBColorSpace;
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 16;
    
    uniforms.uLineMask.value = map;
    setTextureData({ canvas: c, texture: map });
  }, [uniforms]);

  // Redraw mask when pattern changes or canvas is finally created
  useEffect(() => {
    if (!textureData) return;
    const { canvas, texture } = textureData;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Base background (Black = Leather Area)
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Lines (White = Line Area)
    ctx.strokeStyle = "#ffffff";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (patternType === "tech") {
      // Tech/Grid pattern
      ctx.lineWidth = 10;
      
      // Horizontal Equator
      ctx.beginPath();
      ctx.moveTo(0, 512);
      ctx.lineTo(2048, 512);
      ctx.stroke();

      // Additional Latitudes
      ctx.beginPath();
      ctx.moveTo(0, 256);
      ctx.lineTo(2048, 256);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, 768);
      ctx.lineTo(2048, 768);
      ctx.stroke();

      // Vertical Meridians
      for (let i = 0; i < 8; i++) {
        const x = (i * 2048) / 8;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 1024);
        ctx.stroke();
      }
    } else if (patternType === "cross") {
      // Cross/Geometric pattern
      ctx.lineWidth = 12;
      
      // Diagonal slashes
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(2048, 1024);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(2048, 0);
      ctx.lineTo(0, 1024);
      ctx.stroke();

      // Diamond center
      ctx.beginPath();
      ctx.moveTo(1024, 128);
      ctx.lineTo(1792, 512);
      ctx.lineTo(1024, 896);
      ctx.lineTo(256, 512);
      ctx.closePath();
      ctx.stroke();

      // Equator
      ctx.beginPath();
      ctx.moveTo(0, 512);
      ctx.lineTo(2048, 512);
      ctx.stroke();
    } else if (patternType === "street") {
      // Street pattern - cool jagged/offset lines
      ctx.lineWidth = 14;
      
      // Main equator with a jagged break in the middle
      ctx.beginPath();
      ctx.moveTo(0, 512);
      ctx.lineTo(800, 512);
      ctx.lineTo(900, 400);
      ctx.lineTo(1148, 400);
      ctx.lineTo(1248, 512);
      ctx.lineTo(2048, 512);
      ctx.stroke();

      // Double vertical meridians
      ctx.beginPath();
      ctx.moveTo(800, 0);
      ctx.lineTo(800, 1024);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(1248, 0);
      ctx.lineTo(1248, 1024);
      ctx.stroke();

    } else {
      // Classic Basketball Pattern
      ctx.lineWidth = 16;
      
      // 1. Horizontal Equator
      ctx.beginPath();
      ctx.moveTo(0, 512);
      ctx.lineTo(2048, 512);
      ctx.stroke();

      // 2. Vertical Meridian
      ctx.beginPath();
      ctx.moveTo(1024, 0);
      ctx.lineTo(1024, 1024);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 1024);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(2048, 0);
      ctx.lineTo(2048, 1024);
      ctx.stroke();

      // 3. U-Curves
      ctx.beginPath();
      ctx.ellipse(512, 512, 350, 512, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(1536, 512, 350, 512, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Force texture update after redrawing
    texture.needsUpdate = true;
    
    // IMPORTANT: Also force the material to re-compile/update if necessary
    if (materialRef.current) {
      materialRef.current.needsUpdate = true;
    }
  }, [patternType, textureData]);

  // Handle realistic bounce on double click
  const isBouncing = useRef(false);
  const handleDoubleClick = (e: any) => {
    e.stopPropagation(); // Prevent bubbling to OrbitControls
    if (isBouncing.current || !groupRef.current) return;
    
    isBouncing.current = true;
    const tl = gsap.timeline({
      onComplete: () => {
        isBouncing.current = false;
        // Ensure scale is fully reset in case of any floating point errors
        gsap.to(groupRef.current!.scale, { x: 1, y: 1, z: 1, duration: 0.1 });
      }
    });

    const startY = groupRef.current.position.y;
    const peakY = startY + 5; // Jump height
    const floorY = startY;
    const baseScale = 1; // Customizer ball starts at scale 1

    // Upward jump (starts fast, slows down at the top)
    tl.to(groupRef.current.position, {
      y: peakY,
      duration: 0.5,
      ease: "power2.out",
    }, 0)
    // Stretch while moving up
    .to(groupRef.current.scale, {
      y: baseScale * 1.05,
      x: baseScale * 0.95,
      z: baseScale * 0.95,
      duration: 0.25,
      ease: "power1.out",
    }, 0)
    // Return to normal shape at the peak
    .to(groupRef.current.scale, {
      y: baseScale,
      x: baseScale,
      z: baseScale,
      duration: 0.25,
      ease: "power1.in",
    }, 0.25)
    
    // First fall (starts slow, accelerates downwards)
    .to(groupRef.current.position, {
      y: floorY,
      duration: 0.4,
      ease: "power2.in",
    }, 0.5)
    // Stretch while falling
    .to(groupRef.current.scale, {
      y: baseScale * 1.05,
      x: baseScale * 0.95,
      z: baseScale * 0.95,
      duration: 0.3,
      ease: "power1.in",
    }, 0.6)
    
    // IMPACT 1 (Squash)
    .to(groupRef.current.scale, {
      y: baseScale * 0.7, // Heavy squash
      x: baseScale * 1.15, // Bulge out
      z: baseScale * 1.15,
      duration: 0.05,
      ease: "power2.out",
      onStart: () => playBounceSound(1.0), // Loudest thud
    }, 0.9)

    // First bounce up (recover shape fast, shoot up)
    .to(groupRef.current.scale, {
      y: baseScale * 1.02,
      x: baseScale * 0.98,
      z: baseScale * 0.98,
      duration: 0.1,
      ease: "power2.out",
    }, 0.95)
    .to(groupRef.current.position, {
      y: startY + 2.5,
      duration: 0.35,
      ease: "power2.out",
    }, 0.95)
    
    // Second fall
    .to(groupRef.current.position, {
      y: floorY,
      duration: 0.3,
      ease: "power2.in",
    }, 1.3)
    .to(groupRef.current.scale, {
      y: baseScale,
      x: baseScale,
      z: baseScale,
      duration: 0.1, // normalize shape during the smaller fall
    }, 1.3)

    // IMPACT 2
    .to(groupRef.current.scale, {
      y: baseScale * 0.85,
      x: baseScale * 1.05,
      z: baseScale * 1.05,
      duration: 0.05,
      ease: "power2.out",
      onStart: () => playBounceSound(0.6), // Medium thud
    }, 1.6)

    // Second bounce up
    .to(groupRef.current.scale, {
      y: baseScale,
      x: baseScale,
      z: baseScale,
      duration: 0.1,
    }, 1.65)
    .to(groupRef.current.position, {
      y: startY + 1.0,
      duration: 0.25,
      ease: "power2.out",
    }, 1.65)

    // Third fall
    .to(groupRef.current.position, {
      y: floorY,
      duration: 0.2,
      ease: "power2.in",
    }, 1.9)

    // IMPACT 3
    .to(groupRef.current.scale, {
      y: baseScale * 0.95,
      x: baseScale * 1.02,
      z: baseScale * 1.02,
      duration: 0.05,
      ease: "power2.out",
      onStart: () => playBounceSound(0.3), // Quiet thud
    }, 2.1)

    // Final tiny bounce up
    .to(groupRef.current.scale, {
      y: baseScale,
      x: baseScale,
      z: baseScale,
      duration: 0.05,
    }, 2.15)
    .to(groupRef.current.position, {
      y: startY + 0.3,
      duration: 0.15,
      ease: "power2.out",
    }, 2.15)

    // Final settle
    .to(groupRef.current.position, {
      y: floorY,
      duration: 0.1,
      ease: "power2.in",
    }, 2.3)
    .to(groupRef.current.scale, {
      y: baseScale * 0.98,
      x: baseScale * 1.01,
      z: baseScale * 1.01,
      duration: 0.05,
      ease: "power2.out",
      onStart: () => playBounceSound(0.1), // Tiny tap
    }, 2.4)
    .to(groupRef.current.scale, {
      y: baseScale,
      x: baseScale,
      z: baseScale,
      duration: 0.1,
    }, 2.45);

    // Add a spin during the entire sequence
    gsap.to(groupRef.current.rotation, {
      x: groupRef.current.rotation.x + Math.PI * 1.5,
      z: groupRef.current.rotation.z + Math.PI * 0.5,
      duration: 2.5,
      ease: "power1.out",
    });
  };

  // Subtle constant rotation
  useFrame((state, delta) => {
    if (groupRef.current && !isBouncing.current) {
      groupRef.current.rotation.y += delta * 0.15; // Slow idle spin
    }
  });

  return (
    <group ref={groupRef} onDoubleClick={handleDoubleClick}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[3, 128, 128]} /> {/* Slightly larger sphere for customize page */}

        <meshStandardMaterial
          ref={materialRef}
          normalMap={normalMap}
          roughnessMap={roughnessMap}
          normalScale={new THREE.Vector2(4.5, 4.5)} 
          metalness={0.15} 
          roughness={0.55}
          envMapIntensity={2.0} 
          // Inject custom shader code to override the material properties based on the mask
          onBeforeCompile={(shader) => {
            shader.uniforms.uLineMask = uniforms.uLineMask;
            shader.uniforms.uBaseColor = uniforms.uBaseColor;
            shader.uniforms.uLineColor = uniforms.uLineColor;

            // Ensure vUv is passed from vertex to fragment shader
            shader.vertexShader = shader.vertexShader.replace(
              `#include <common>`,
              `
              #include <common>
              varying vec2 vCustomUv;
              `
            );
            shader.vertexShader = shader.vertexShader.replace(
              `#include <uv_vertex>`,
              `
              #include <uv_vertex>
              vCustomUv = uv;
              `
            );

            // Inject uniforms and varying into fragment shader
            shader.fragmentShader = shader.fragmentShader.replace(
              `#include <common>`,
              `
              #include <common>
              varying vec2 vCustomUv;
              uniform sampler2D uLineMask;
              uniform vec3 uBaseColor;
              uniform vec3 uLineColor;
              `
            );

            // Override Color (Map)
            shader.fragmentShader = shader.fragmentShader.replace(
              `#include <color_fragment>`,
              `
              #include <color_fragment>
              float maskVal = texture2D(uLineMask, vCustomUv).r;
              diffuseColor.rgb = mix(uBaseColor, uLineColor, maskVal);
              `
            );

            // Override Normal (Flatten the bumps on the lines). Use non-perturbed geometry normal (vNormal) as base.
            shader.fragmentShader = shader.fragmentShader.replace(
              `#include <normal_fragment_maps>`,
              `
              #include <normal_fragment_maps>
              // If we are on a line (maskVal > 0.5), flatten the normal back to the original geometry normal
              vec3 geomNormal = normalize(vNormal);
              normal = normalize(mix(normal, geomNormal, maskVal));
              `
            );

            // Override Roughness (Make the lines have a matte shine)
            shader.fragmentShader = shader.fragmentShader.replace(
              `#include <roughnessmap_fragment>`,
              `
              #include <roughnessmap_fragment>
              // Leather roughness is from the map, but lines get a specific roughness
              roughnessFactor = mix(roughnessFactor, 0.45, maskVal);
              `
            );
            
             // Override Metalness (Give the lines a slight metallic property to catch light)
             shader.fragmentShader = shader.fragmentShader.replace(
              `#include <metalnessmap_fragment>`,
              `
              #include <metalnessmap_fragment>
              metalnessFactor = mix(metalnessFactor, 0.25, maskVal);
              `
            );
          }}
        />
      </mesh>
    </group>
  );
};