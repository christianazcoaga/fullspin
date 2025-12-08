import { getProductsOnOffer, getComingSoonProducts } from "@/lib/products.server";
import HomePageClient from "@/components/HomePageClient";

// Opt-out of caching for now to ensure fresh data, or use revalidate
// export const revalidate = 3600; // Revalidate every hour

export default async function Page() {
  // Fetch offers and coming soon products on the server
  // Using Promise.all to fetch in parallel
  const [padelOffers, tenisMesaOffers, tenisOffers, comingSoonProducts] = await Promise.all([
    getProductsOnOffer("padel"),
    getProductsOnOffer("tenis-mesa"),
    getProductsOnOffer("tenis"),
    getComingSoonProducts(undefined, 8)
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
