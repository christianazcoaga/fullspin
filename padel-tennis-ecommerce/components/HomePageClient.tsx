import BrandLogosCarousel from "@/components/home/BrandLogosCarousel"
import FaqSection from "@/components/home/FaqSection"
import FeaturedCategories from "@/components/home/FeaturedCategories"
import FloatingActions from "@/components/home/FloatingActions"
import HomeFinalCta from "@/components/home/HomeFinalCta"
import HomeHero from "@/components/home/HomeHero"
import NewsletterCTA from "@/components/home/NewsletterCTA"
import { ProductOfferSection } from "@/components/home/ProductOfferSection"
import PromoCarousel from "@/components/home/PromoCarousel"
import TrustBlock from "@/components/home/TrustBlock"
import { getAllBrands } from "@/lib/brands.server"
import type { Product } from "@/lib/products"

interface HomePageClientProps {
  initialPadelOffers?: Product[]
  initialTenisMesaOffers?: Product[]
  initialTenisOffers?: Product[]
  initialComingSoonProducts?: Product[]
  /** Products flagged "Novedad" — shown right after the promo carousel. */
  initialNoveltyProducts?: Product[]
}

export default async function HomePageClient({
  initialPadelOffers = [],
  initialTenisMesaOffers = [],
  initialTenisOffers = [],
  initialComingSoonProducts = [],
  initialNoveltyProducts = [],
}: HomePageClientProps) {
  const brands = await getAllBrands()
  return (
    <div className="bg-brand-cream">
      <HomeHero />
      <PromoCarousel />

      {initialNoveltyProducts.length > 0 && (
        <ProductOfferSection
          title="Novedades"
          subtitle="Lo último que llegó al catálogo"
          products={initialNoveltyProducts}
          categoryLink="/padel"
          categoryName="Productos"
        />
      )}

      <ProductOfferSection
        title="Ofertas de Padel"
        subtitle="Productos de padel con descuentos especiales"
        products={initialPadelOffers}
        categoryLink="/padel"
        categoryName="Padel"
      />

      <ProductOfferSection
        title="Ofertas de Tenis de Mesa"
        subtitle="Productos de tenis de mesa con descuentos especiales"
        products={initialTenisMesaOffers}
        categoryLink="/tenis-mesa"
        categoryName="Tenis de Mesa"
      />

      <ProductOfferSection
        title="Ofertas de Tenis"
        subtitle="Productos de tenis con descuentos especiales"
        products={initialTenisOffers}
        categoryLink="/tenis"
        categoryName="Tenis"
      />

      {initialComingSoonProducts.length > 0 && (
        <ProductOfferSection
          title="Próximamente"
          subtitle="Productos que estarán disponibles muy pronto"
          products={initialComingSoonProducts}
          categoryLink="/padel"
          categoryName="Productos"
          isComingSoon
        />
      )}

      <BrandLogosCarousel brands={brands} />
      <FeaturedCategories />
      <TrustBlock />
      <FaqSection />
      <NewsletterCTA />
      <HomeFinalCta />

      <FloatingActions />
    </div>
  )
}
