import React, { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SlideData } from "@/app/page";
import { useBounceSound } from "@/hooks/useBounceSound";
import { useTransitionSound } from "@/hooks/useTransitionSound";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type BasketballProps = {
  slide: SlideData;
};

export const Basketball = ({ slide }: BasketballProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const dunkGroupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const playBounceSound = useBounceSound();
  const playTransitionSound = useTransitionSound();
  
  // Custom shader uniform references
  const uniforms = useMemo(
    () => ({
      uLineMask: { value: null as THREE.Texture | null },
      uBaseColor: { value: new THREE.Color(slide.ballBaseColor) },
      uLineColor: { value: new THREE.Color(slide.ballLineColor) },
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

  // Intro animation
  useEffect(() => {
    if (groupRef.current) {
      gsap.fromTo(
        groupRef.current.scale,
        { x: 0, y: 0, z: 0 },
        { x: 0.85, y: 0.85, z: 0.85, duration: 2, ease: "elastic.out(1, 0.7)", delay: 0.5 }
      );
      gsap.fromTo(
        groupRef.current.position,
        { y: -5 },
        { y: 0, duration: 2, ease: "power3.out", delay: 0.5 }
      );
    }
  }, []);

  // Handle realistic bounce on double click
  const isBouncing = useRef(false);
  const handleDoubleClick = (e: any) => {
    e.stopPropagation(); // Prevent bubbling
    if (isBouncing.current || !groupRef.current) return;
    
    isBouncing.current = true;
    const tl = gsap.timeline({
      onComplete: () => {
        isBouncing.current = false;
        // Ensure scale is fully reset in case of any floating point errors
        gsap.to(groupRef.current!.scale, { x: 0.85, y: 0.85, z: 0.85, duration: 0.1 });
      }
    });

    const startY = groupRef.current.position.y;
    const peakY = startY + 5; // Higher jump
    const floorY = startY;
    const baseScale = 0.85;

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

  // Animate on slide change
  useEffect(() => {
    // THREE.Color requires specific handling in GSAP because standard property tweening 
    // doesn't flag the WebGL uniform to update automatically unless done in an onUpdate hook.
    const targetBaseColor = new THREE.Color(slide.ballBaseColor);
    const targetLineColor = new THREE.Color(slide.ballLineColor);

    const tl = gsap.timeline();

    // 1. First animate the lines to the new theme color quickly
    tl.to(uniforms.uLineColor.value, {
      r: targetLineColor.r,
      g: targetLineColor.g,
      b: targetLineColor.b,
      duration: 0.5,
      ease: "power2.out",
    }, 0);

    // 2. Then smoothly morph the entire leather base color
    tl.to(uniforms.uBaseColor.value, {
      r: targetBaseColor.r,
      g: targetBaseColor.g,
      b: targetBaseColor.b,
      duration: 1.2,
      ease: "power2.inOut",
    }, 0.2);

    // Spin the ball during the transition to show off the new pattern/colors
    if (groupRef.current) {
      tl.to(groupRef.current.rotation, {
        y: groupRef.current.rotation.y + Math.PI * 2, 
        duration: 1.5,
        ease: "power2.inOut"
      }, 0);
    }
  }, [slide, uniforms]);

  // Handle continuous rotation in the third section
  const scrollProgress = useRef(0);
  
  // Dunk Animation Event Listener
  useEffect(() => {
    const handleDunk = () => {
      if (isBouncing.current || !dunkGroupRef.current) return;
      isBouncing.current = true; // reuse bounce lock

      const tl = gsap.timeline({
        onComplete: () => {
          isBouncing.current = false;
          // Trigger the net swish animation in the Header
          window.dispatchEvent(new CustomEvent("dunk-success"));
        }
      });

      // Trajectory: 
      // 1. Roll to bottom-left corner
      // 2. Launch (parabolic arc) to top-right
      // 3. Dunk into hoop
      // 4. Reset

      // Calculate precise screen boundaries for 3D space to prevent clipping
      // Keep it completely in view
      const targetLeftX = -4.5;
      const targetBottomY = -2.0;
      
      // Calculate exact corner position based on standard screen sizes
      // Pushing X right, keeping Z closer so it stays big, adjusting Y to hit the hoop exactly
      const targetRightX = 7.5; 
      const targetTopY = 3.8; 

      // 1. Roll to the bottom-left windup position
      tl.to(dunkGroupRef.current.position, {
        x: targetLeftX,
        y: targetBottomY,
        z: 0,
        duration: 0.6,
        ease: "power2.inOut"
      }, 0)
      .to(dunkGroupRef.current.scale, {
        x: 0.8, y: 0.8, z: 0.8, // Don't shrink much during windup
        duration: 0.6,
        ease: "power2.inOut"
      }, 0)
      // Roll rotation
      // FIX: Calculate absolute target Z rotation
      const currentRotZ = dunkGroupRef.current.rotation.z;
      const targetRotZ = currentRotZ + Math.PI * 1.5;

      tl.to(dunkGroupRef.current.rotation, {
        z: targetRotZ,
        duration: 0.6,
        ease: "power2.inOut"
      }, 0)

      // Play swish/launch sound
      .call(() => playTransitionSound(), [], 0.6)

      // 2. The Launch & Arc (Extremely straight, tight trajectory)
      // We combine X, Y, Z, and Scale into ONE continuous motion for absolute smoothness
      .to(dunkGroupRef.current.position, {
        x: targetRightX,
        z: -1.5, // Keep it very close to camera so it doesn't vanish
        duration: 0.8,
        ease: "power1.inOut" // Smooth linear-ish flight
      }, 0.6)
      
      // The Y Parabola - Flattened completely. It just goes up to the hoop.
      .to(dunkGroupRef.current.position, {
        y: targetTopY + 1.0, // Very tiny peak, almost a straight line to the hoop
        duration: 0.5,
        ease: "power2.out"
      }, 0.6)
      .to(dunkGroupRef.current.position, {
        y: targetTopY, // Fall exactly to the hoop rim
        duration: 0.3,
        ease: "power2.in"
      }, 1.1)
      
      // Scale down smoothly
      .to(dunkGroupRef.current.scale, {
        x: 0.25, y: 0.25, z: 0.25, // Keep it quite large so it's clearly visible in the corner
        duration: 0.8,
        ease: "power2.inOut"
      }, 0.6)

      // Heavy backspin during flight
      // FIX: Calculate absolute target rotation so it doesn't drift infinitely on multiple clicks
      const currentRotX = dunkGroupRef.current.rotation.x;
      const targetRotX = currentRotX - Math.PI * 4;
      
      tl.to(dunkGroupRef.current.rotation, {
        x: targetRotX,
        duration: 0.8,
        ease: "none"
      }, 0.6)

      // 3. The Dunk (Clean, single fluid motion into the cart)
      .to(dunkGroupRef.current.position, {
        y: targetTopY - 1.5, // Drop straight down through the net
        duration: 0.25,
        ease: "power2.in"
      }, 1.4)
      .to(dunkGroupRef.current.scale, {
        x: 0, y: 0, z: 0, // Shrink to 0 as it goes through
        duration: 0.2,
        ease: "power2.in"
      }, 1.45) // Delay slightly so it enters the hoop first

      // 4. The Reset (Pop back to center with a bouncy feel)
      // FIX: Ensure absolute rotation resets to 0 so the next dunk starts from the exact same state
      .set(dunkGroupRef.current.position, { x: 0, y: 0, z: 0 })
      .set(dunkGroupRef.current.rotation, { x: 0, y: 0, z: 0 })
      .to(dunkGroupRef.current.scale, {
        x: 1, y: 1, z: 1,
        duration: 0.8,
        ease: "elastic.out(1.2, 0.4)"
      }, "+=0.1");
    };

    window.addEventListener("dunk-ball", handleDunk);
    return () => window.removeEventListener("dunk-ball", handleDunk);
  }, []);

  useFrame((state, delta) => {
    // If we are at the bottom of the scroll (in the Specs section), 
    // smoothly rotate the ball on its Y axis continuously
    if (groupRef.current && scrollProgress.current > 0.9) {
      groupRef.current.rotation.y += delta * 0.5; // Smooth slow rotation
    }
  });

  // ScrollTrigger Animation
  useEffect(() => {
    if (!groupRef.current) return;

    const ctx = gsap.context(() => {
      // Because we now have 3 full sections (300vh total), we need the scroll trigger 
      // to end after 2 full viewport scrolls (200vh of actual scrolling distance)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#inner-scroll-container", 
          start: "top top", 
          end: "bottom bottom", 
          scrub: 1, // Smooth scrubbing
          invalidateOnRefresh: true,
          snap: {
            snapTo: [0, 0.5, 1], // Snap exactly to the 3 sections
            duration: { min: 0.2, max: 0.8 },
            ease: "power2.inOut"
          },
          onUpdate: (self) => {
            scrollProgress.current = self.progress;
          }
        }
      });

      // Set explicit starting values to prevent the ball from "missing" on initial load
      gsap.set(groupRef.current!.position, { x: 0, y: 0, z: 0 });
      gsap.set(groupRef.current!.scale, { x: 0.85, y: 0.85, z: 0.85 });
      gsap.set(groupRef.current!.rotation, { x: 0, y: 0, z: 0 });

      // PHASE 1: Hero -> Performance Metrics (0% to 50% of the timeline)
      // When scroll is halfway down (end of first section)
      tl.to(groupRef.current!.position, {
        x: 4.5,
        y: -0.5,
        z: 2.0,
        ease: "power1.inOut",
      }, 0)
      .to(groupRef.current!.scale, {
        x: 1.8,
        y: 1.8,
        z: 1.8,
        ease: "power1.inOut",
      }, 0)
      .to(groupRef.current!.rotation, {
        y: Math.PI * 2.5, 
        z: -Math.PI * 0.2,
        ease: "power1.inOut",
      }, 0)
      
      // PHASE 2: Performance Metrics -> Technical Specs (50% to 100% of the timeline)
      // When scroll reaches the absolute bottom
      .to(groupRef.current!.position, {
        x: 0,
        y: 0,
        z: 0.2, // Move slightly back from camera
        ease: "power2.inOut",
      }, 0.5) // Starts at exactly the halfway point of the scroll
      .to(groupRef.current!.scale, {
        x: 0.95, // Scaled down to leave breathing room inside the rings
        y: 0.95,
        z: 0.95,
        ease: "power2.inOut",
      }, 0.5)
      .to(groupRef.current!.rotation, {
        y: Math.PI * 4.5, // Continue spinning another full rotation
        z: 0, // Level out the tilt
        ease: "power2.inOut",
      }, 0.5);
    });

    return () => ctx.revert();
  }, []);

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

    if (slide.patternType === "grid") {
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
  }, [slide.patternType, textureData]);

  // Subtle constant rotation
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
      groupRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <group ref={groupRef} onDoubleClick={handleDoubleClick}>
      <group ref={dunkGroupRef}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[2.5, 128, 128]} />

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

              // Override Roughness (Make the lines matte)
              shader.fragmentShader = shader.fragmentShader.replace(
                `#include <roughnessmap_fragment>`,
                `
                #include <roughnessmap_fragment>
                // Leather roughness is from the map, but lines get a fixed high roughness (matte)
                roughnessFactor = mix(roughnessFactor, 0.9, maskVal);
                `
              );
              
               // Override Metalness (Make the lines non-metallic)
               shader.fragmentShader = shader.fragmentShader.replace(
                `#include <metalnessmap_fragment>`,
                `
                #include <metalnessmap_fragment>
                // Lines get 0 metalness
                metalnessFactor = mix(metalnessFactor, 0.0, maskVal);
                `
              );
            }}
          />
        </mesh>
      </group>
    </group>
  );
};

