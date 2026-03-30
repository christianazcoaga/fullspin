"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

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
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-blue-600 text-white transition-opacity duration-500 ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center">
        <div className="relative flex items-center justify-center w-28 h-28 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-white/20 border-t-white animate-spin" />
          <Image
            src="/fullspin-logo.png"
            alt="FullSpin"
            width={64}
            height={64}
            priority
            className="rounded-xl drop-shadow-lg"
          />
        </div>
        <h1 className="text-4xl font-bold tracking-tighter animate-fade-in-up">
          FullSpin
        </h1>
        <p className="mt-2 text-blue-200 font-medium tracking-wide uppercase text-sm animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          Equipamiento Deportivo
        </p>
      </div>
    </div>
  );
}
