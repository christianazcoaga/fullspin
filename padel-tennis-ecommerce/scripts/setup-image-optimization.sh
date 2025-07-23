#!/bin/bash

echo "🚀 Configurando optimización de imágenes..."

# Instalar Sharp si no está instalado
if ! npm list sharp > /dev/null 2>&1; then
    echo "📦 Instalando Sharp..."
    npm install sharp
else
    echo "✅ Sharp ya está instalado"
fi

# Crear directorio de imágenes optimizadas
echo "📁 Creando directorio de imágenes optimizadas..."
mkdir -p public/optimized

# Ejecutar optimización de imágenes
echo "🖼️  Optimizando imágenes..."
node scripts/optimize-images.js

echo "✅ Configuración completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Revisar las imágenes optimizadas en public/optimized/"
echo "2. Actualizar las rutas de las imágenes en el código"
echo "3. Probar el rendimiento con Lighthouse"
echo ""
echo "🔧 Comandos disponibles:"
echo "  npm run optimize-images     # Optimizar todas las imágenes"
echo "  npm run optimize-images:watch # Modo watch para desarrollo" 