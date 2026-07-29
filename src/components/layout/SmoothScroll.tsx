"use client";

import React, { useEffect } from "react";
import { ReactLenis } from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP ScrollTrigger globally
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SmoothScrollProps {
  children: React.ReactNode;
}

export const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  useEffect(() => {
    // Sync Lenis scroll with GSAP ScrollTrigger
    const updateScrollTrigger = () => {
      ScrollTrigger.update();
    };
    
    // Add ScrollTrigger to GSAP ticker so it fires synchronously
    gsap.ticker.add(updateScrollTrigger);
    
    return () => {
      gsap.ticker.remove(updateScrollTrigger);
    };
  }, []);

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.0,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      }}
    >
      {children}
    </ReactLenis>
  );
};
