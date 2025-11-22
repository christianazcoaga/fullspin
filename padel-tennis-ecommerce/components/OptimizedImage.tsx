import Image from "next/image";
import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: "blur" | "empty";
  sizes?: string;
  fill?: boolean;
  style?: React.CSSProperties;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  quality = 85,
  placeholder = "empty",
  sizes,
  fill = false,
  style,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Configuración de tamaños responsive por defecto
  const defaultSizes = sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";

  // Configuración de calidad según el tipo de imagen
  const getQuality = () => {
    if (src.includes('logo')) return 85; // Logos con 85% es suficiente para WebP
    if (src.includes('banner')) return 75; // Banners a 75% para reducir peso
    if (src.includes('product')) return 80; // Productos a 80%
    return quality;
  };

  // Configuración de placeholder
  const getPlaceholder = () => {
    if (src.includes('logo') || src.includes('banner')) return "empty";
    return placeholder;
  };

  if (error) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width: width || '100%', height: height || '200px' }}
      >
        <span className="text-gray-500 text-sm">Error al cargar imagen</span>
      </div>
    );
  }

  return (
    <div className={`relative ${isLoading ? 'animate-pulse bg-gray-200' : ''} ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        priority={priority}
        quality={getQuality()}
        placeholder={getPlaceholder()}
        sizes={defaultSizes}
        fill={fill}
        style={style}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true);
          setIsLoading(false);
        }}
        {...props}
      />
    </div>
  );
} 