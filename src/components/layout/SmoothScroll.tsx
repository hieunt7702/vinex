"use client";

import React, { useEffect, useRef } from "react";
import { ReactLenis } from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAnimationFrame } from "framer-motion";
import type { LenisRef } from "lenis/react";

// Register GSAP ScrollTrigger globally
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SmoothScrollProps {
  children: React.ReactNode;
}

export const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    // Force ScrollTrigger to update precisely when Lenis scrolls
    lenisRef.current?.lenis?.on("scroll", ScrollTrigger.update);

    return () => {
      lenisRef.current?.lenis?.off("scroll", ScrollTrigger.update);
    };
  }, []);

  // Sync Lenis RAF with Framer Motion's internal render loop.
  // This completely eliminates scroll tearing and lag on heavy motion layouts.
  useAnimationFrame((time) => {
    lenisRef.current?.lenis?.raf(time);
  });

  return (
    <ReactLenis
      ref={lenisRef}
      autoRaf={false}
      root
      options={{
        lerp: 0.1,
        smoothWheel: true,
        wheelMultiplier: 1,
      }}
    >
      {children}
    </ReactLenis>
  );
};
