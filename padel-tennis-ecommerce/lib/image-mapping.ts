// Mapeo de imágenes originales a optimizadas
export const imageMapping = {
  // Logos
  '/fullspin-logo.png': '/optimized/fullspin-logo.webp',
  '/adidas-logo.png': '/optimized/adidas-logo.webp',
  '/wilson-logo.png': '/optimized/wilson-logo.webp',
  '/butterfly-logo.png': '/optimized/butterfly-logo.webp',
  '/dhs-logo.png': '/optimized/dhs-logo.webp',
  '/sanwei-logo.png': '/optimized/sanwei-logo.webp',
  '/babolat-logo.png': '/optimized/babolat-logo.webp',
  '/bullpadel-logo.png': '/optimized/bullpadel-logo.webp',
  '/dunlop-logo.png': '/optimized/dunlop-logo.webp',
  '/head-logo.png': '/optimized/head-logo.webp',
  
  // Banners
  '/adidas-banner.png': '/optimized/adidas-banner.webp',
  '/Adidas_Padel_Banner.png': '/optimized/Adidas_Padel_Banner.webp',
  '/banner_adidas_ord_993f8af2-99ec-47e9-9a35-6f60ec805bdd.png': '/optimized/banner_adidas_ord_993f8af2-99ec-47e9-9a35-6f60ec805bdd.webp',
  '/butterfly-banner.png': '/optimized/butterfly-banner.webp',
  '/dhs-banner.png': '/optimized/dhs-banner.webp',
  '/wilson-banner.png': '/optimized/wilson-banner.webp',
  '/wilson-banner.jpg': '/optimized/wilson-banner.webp',
  
  // Imágenes de fondo
  '/padel-racket-bg.png': '/optimized/padel-racket-bg.webp',
  '/tt-paddle-bg.png': '/optimized/tt-paddle-bg.webp',
  
  // Imágenes de categorías
  '/tenis-mesa1.jpg': '/optimized/tenis-mesa1.webp',
  '/padel1.jpg': '/optimized/padel1.webp',
};

// Función para obtener la imagen optimizada
export function getOptimizedImage(src: string): string {
  return imageMapping[src as keyof typeof imageMapping] || src;
}

// Función para obtener imagen responsive
export function getResponsiveImage(src: string, size: 'thumbnail' | 'small' | 'medium' | 'large' = 'medium'): string {
  const optimizedSrc = getOptimizedImage(src);
  if (optimizedSrc === src) return src; // Si no hay optimización, devolver original
  
  const baseName = optimizedSrc.replace('.webp', '');
  return `${baseName}-${size}.webp`;
}

// Función para obtener srcSet completo
export function getImageSrcSet(src: string): string {
  const baseName = getOptimizedImage(src).replace('.webp', '');
  return [
    `${baseName}-thumbnail.webp 150w`,
    `${baseName}-small.webp 300w`,
    `${baseName}-medium.webp 600w`,
    `${baseName}-large.webp 1200w`,
    `${baseName}.webp 1920w`
  ].join(', ');
} 