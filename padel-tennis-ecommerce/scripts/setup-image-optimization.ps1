Write-Host "🚀 Configurando optimización de imágenes..." -ForegroundColor Green

# Verificar si Sharp está instalado
try {
    $sharpInstalled = npm list sharp 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "📦 Instalando Sharp..." -ForegroundColor Yellow
        npm install sharp
    } else {
        Write-Host "✅ Sharp ya está instalado" -ForegroundColor Green
    }
} catch {
    Write-Host "📦 Instalando Sharp..." -ForegroundColor Yellow
    npm install sharp
}

# Crear directorio de imágenes optimizadas
Write-Host "📁 Creando directorio de imágenes optimizadas..." -ForegroundColor Yellow
if (!(Test-Path "public/optimized")) {
    New-Item -ItemType Directory -Path "public/optimized" -Force
}

# Ejecutar optimización de imágenes
Write-Host "🖼️  Optimizando imágenes..." -ForegroundColor Yellow
node scripts/optimize-images.js

Write-Host "✅ Configuración completada!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. Revisar las imágenes optimizadas en public/optimized/"
Write-Host "2. Actualizar las rutas de las imágenes en el código"
Write-Host "3. Probar el rendimiento con Lighthouse"
Write-Host ""
Write-Host "🔧 Comandos disponibles:" -ForegroundColor Cyan
Write-Host "  npm run optimize-images     # Optimizar todas las imágenes"
Write-Host "  npm run optimize-images:watch # Modo watch para desarrollo" 