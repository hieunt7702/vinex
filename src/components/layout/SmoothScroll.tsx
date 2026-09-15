"use client";

import React, { useEffect, useRef } from "react";
import { ReactLenis } from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

  return (
    <ReactLenis
      ref={lenisRef}
      autoRaf={true}
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
