import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Especificar la raíz del proyecto para evitar advertencias de lockfiles múltiples
  outputFileTracingRoot: __dirname,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Configuración adicional para optimización
    loader: 'default',
    path: '/_next/image',
    domains: ['itllufoljyibrrzlwapm.supabase.co'],
    remotePatterns: [],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    // Optimización de imágenes experimental
    // optimizeCss: true, // Comentado temporalmente por problemas de build
  },
  // Configuración de compresión
  compress: true,
  poweredByHeader: false,
  // Configuración de cache
  generateEtags: true,
  // Configuración de webpack para resolver advertencias de Supabase
  webpack: (config, { isServer }) => {
    // Resolver advertencia de Supabase Realtime
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    // Ignorar advertencias específicas de Supabase
    config.ignoreWarnings = [
      {
        module: /node_modules\/@supabase\/realtime-js/,
        message: /Critical dependency: the request of a dependency is an expression/,
      },
    ];

    return config;
  },
}

export default nextConfig
