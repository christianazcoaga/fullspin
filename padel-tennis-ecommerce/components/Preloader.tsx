"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import Logo from "@/components/layout/Logo";

export default function Preloader() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const prevPathname = useRef(pathname);
  const isFirstRender = useRef(true);

  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) {
      setIsVisible(false);
      return;
    }

    const duration = isFirstRender.current ? 2000 : 800;
    isFirstRender.current = false;

    setIsVisible(true);
    setIsFading(false);

    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => setIsVisible(false), 500);
    }, duration);

    return () => clearTimeout(timer);
  }, [pathname, isAdmin]);

  if (!isVisible || isAdmin) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-brand-blue-dark text-brand-cream transition-opacity duration-500 ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      role="status"
      aria-live="polite"
      aria-label="Cargando"
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex h-28 w-28 items-center justify-center">
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full border-4 border-brand-cream/20 border-t-brand-cream animate-spin"
          />
          <Logo variant="stacked" color="light" className="h-12 w-auto" />
        </div>
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-cream/70 animate-fade-in-up">
          Equipamiento deportivo
        </p>
      </div>
    </div>
  );
}
