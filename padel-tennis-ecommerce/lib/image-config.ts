// Configuración para imágenes optimizadas
export const imageConfig = {
  // Formatos soportados
  formats: ['webp', 'avif'] as const,
  
  // Tamaños responsive
  sizes: {
    xs: 320,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
  
  // Calidad por tipo de imagen
  quality: {
    logo: 90,
    banner: 80,
    product: 85,
    background: 75,
    default: 85,
  },
  
  // Configuración de placeholder
  placeholder: {
    blur: true,
    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
  },
  
  // Configuración de lazy loading
  lazy: {
    threshold: 0.1,
    rootMargin: '50px',
  },
};

// Función para obtener la configuración de calidad según el tipo de imagen
export function getImageQuality(src: string): number {
  if (src.includes('logo')) return imageConfig.quality.logo;
  if (src.includes('banner')) return imageConfig.quality.banner;
  if (src.includes('product')) return imageConfig.quality.product;
  if (src.includes('bg') || src.includes('background')) return imageConfig.quality.background;
  return imageConfig.quality.default;
}

// Función para obtener el formato óptimo según el navegador
export function getOptimalFormat(): string {
  // En producción, Next.js manejará esto automáticamente
  return 'webp';
}

// Función para generar srcSet responsive
export function generateSrcSet(src: string, sizes: number[]): string {
  return sizes
    .map(size => `${src}?w=${size} ${size}w`)
    .join(', ');
}

// Función para obtener sizes responsive
export function getResponsiveSizes(containerWidth: string = '100vw'): string {
  return `(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, ${containerWidth}`;
} 