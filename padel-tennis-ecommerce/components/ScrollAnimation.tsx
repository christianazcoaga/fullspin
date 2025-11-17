"use client";

import { useInView } from "@/hooks/use-in-view";
import { ReactNode } from "react";

interface ScrollAnimationProps {
  children: ReactNode;
  animation?: "fade-in" | "fade-in-up" | "slide-in-left" | "slide-in-right" | "scale-in" | "bounce";
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
}

export default function ScrollAnimation({
  children,
  animation = "fade-in-up",
  delay = 0,
  duration = 0.8,
  threshold = 0.1,
  className = "",
}: ScrollAnimationProps) {
  const { ref, isInView } = useInView({ threshold, triggerOnce: true });

  const animationClass = isInView ? `animate-${animation}` : "opacity-0";

  return (
    <div
      ref={ref}
      className={`${animationClass} ${className}`}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        animationFillMode: "forwards",
      }}
    >
      {children}
    </div>
  );
}


