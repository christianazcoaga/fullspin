import type { Metadata } from "next"

import { getComingSoonProducts, getProductsOnOffer } from "@/lib/products.server";
import HomePageClient from "@/components/HomePageClient";

export const metadata: Metadata = {
  title: "FullSpin — Equipamiento deportivo para padel, tenis y tenis de mesa",
  description:
    "Las mejores marcas en padel, tenis y tenis de mesa. Productos originales, envíos a toda Argentina y asesoramiento por WhatsApp.",
  alternates: { canonical: "https://www.fullspinarg.com" },
}

// Opt-out of caching for now to ensure fresh data, or use revalidate
// export const revalidate = 3600; // Revalidate every hour

export default async function Page() {
  const [padelOffers, tenisMesaOffers, tenisOffers, comingSoonProducts] = await Promise.all([
    getProductsOnOffer("padel"),
    getProductsOnOffer("tenis-mesa"),
    getProductsOnOffer("tenis"),
    getComingSoonProducts(undefined, 8),
  ]);

  return (
    <HomePageClient
      initialPadelOffers={padelOffers || []}
      initialTenisMesaOffers={tenisMesaOffers || []}
      initialTenisOffers={tenisOffers || []}
      initialComingSoonProducts={comingSoonProducts || []}
    />
  );
}
