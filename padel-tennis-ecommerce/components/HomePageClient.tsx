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
import type { Product } from "@/lib/products"

interface HomePageClientProps {
  initialPadelOffers?: Product[]
  initialTenisMesaOffers?: Product[]
  initialTenisOffers?: Product[]
  initialComingSoonProducts?: Product[]
}

export default function HomePageClient({
  initialPadelOffers = [],
  initialTenisMesaOffers = [],
  initialTenisOffers = [],
  initialComingSoonProducts = [],
}: HomePageClientProps) {
  return (
    <div className="bg-brand-cream">
      <HomeHero />
      <PromoCarousel />

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

      <BrandLogosCarousel />
      <FeaturedCategories />
      <TrustBlock />
      <FaqSection />
      <NewsletterCTA />
      <HomeFinalCta />

      <FloatingActions />
    </div>
  )
}
