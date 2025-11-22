import { getProductsOnOffer } from "@/lib/products.server";
import HomePageClient from "@/components/HomePageClient";

// Opt-out of caching for now to ensure fresh data, or use revalidate
// export const revalidate = 3600; // Revalidate every hour

export default async function Page() {
  // Fetch offers on the server
  // Using Promise.all to fetch in parallel
  const [padelOffers, tenisMesaOffers, tenisOffers] = await Promise.all([
    getProductsOnOffer("padel"),
    getProductsOnOffer("tenis-mesa"),
    getProductsOnOffer("tenis")
  ]);

  return (
    <HomePageClient
      initialPadelOffers={padelOffers || []}
      initialTenisMesaOffers={tenisMesaOffers || []}
      initialTenisOffers={tenisOffers || []}
    />
  );
}
