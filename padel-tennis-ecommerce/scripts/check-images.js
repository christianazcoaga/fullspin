const fs = require('fs');
const path = require('path');

// Configuración
const PUBLIC_DIR = path.join(__dirname, '../public');
const OPTIMIZED_DIR = path.join(PUBLIC_DIR, 'optimized');

// Mapeo de imágenes que deberían estar optimizadas
const imageMapping = {
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

function checkImageExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function main() {
  console.log('🔍 Verificando imágenes optimizadas...\n');

  const results = {
    original: [],
    optimized: [],
    missing: [],
    totalOriginalSize: 0,
    totalOptimizedSize: 0,
  };

  // Verificar cada imagen en el mapeo
  for (const [originalPath, optimizedPath] of Object.entries(imageMapping)) {
    const originalFullPath = path.join(PUBLIC_DIR, originalPath);
    const optimizedFullPath = path.join(PUBLIC_DIR, optimizedPath);

    const originalExists = checkImageExists(originalFullPath);
    const optimizedExists = checkImageExists(optimizedFullPath);

    if (originalExists) {
      const originalSize = getFileSize(originalFullPath);
      results.totalOriginalSize += originalSize;
      
      results.original.push({
        path: originalPath,
        size: originalSize,
        formattedSize: formatFileSize(originalSize)
      });

      if (optimizedExists) {
        const optimizedSize = getFileSize(optimizedFullPath);
        results.totalOptimizedSize += optimizedSize;
        
        results.optimized.push({
          path: optimizedPath,
          originalPath: originalPath,
          size: optimizedSize,
          formattedSize: formatFileSize(optimizedSize),
          reduction: originalSize > 0 ? ((originalSize - optimizedSize) / originalSize * 100).toFixed(1) : 0
        });
      } else {
        results.missing.push({
          originalPath: originalPath,
          optimizedPath: optimizedPath,
          size: originalSize,
          formattedSize: formatFileSize(originalSize)
        });
      }
    } else {
      console.log(`⚠️  Imagen original no encontrada: ${originalPath}`);
    }
  }

  // Mostrar resultados
  console.log('📊 RESUMEN DE IMÁGENES\n');
  console.log(`✅ Imágenes optimizadas: ${results.optimized.length}`);
  console.log(`❌ Imágenes faltantes: ${results.missing.length}`);
  console.log(`📁 Total original: ${formatFileSize(results.totalOriginalSize)}`);
  console.log(`📁 Total optimizado: ${formatFileSize(results.totalOptimizedSize)}`);
  
  if (results.totalOriginalSize > 0) {
    const totalReduction = ((results.totalOriginalSize - results.totalOptimizedSize) / results.totalOriginalSize * 100).toFixed(1);
    console.log(`💾 Reducción total: ${totalReduction}%`);
  }

  // Mostrar imágenes optimizadas
  if (results.optimized.length > 0) {
    console.log('\n✅ IMÁGENES OPTIMIZADAS:');
    results.optimized.forEach(img => {
      console.log(`  ${img.originalPath} → ${img.path} (${img.formattedSize}, -${img.reduction}%)`);
    });
  }

  // Mostrar imágenes faltantes
  if (results.missing.length > 0) {
    console.log('\n❌ IMÁGENES FALTANTES:');
    results.missing.forEach(img => {
      console.log(`  ${img.originalPath} → ${img.optimizedPath} (${img.formattedSize})`);
    });
    
    console.log('\n💡 Para generar las imágenes faltantes, ejecuta:');
    console.log('   npm run optimize-images');
  }

  // Verificar directorio optimized
  if (!fs.existsSync(OPTIMIZED_DIR)) {
    console.log('\n📁 Creando directorio optimized...');
    fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });
  }

  // Verificar imágenes en optimized que no están en el mapeo
  if (fs.existsSync(OPTIMIZED_DIR)) {
    const optimizedFiles = fs.readdirSync(OPTIMIZED_DIR);
    const mappedOptimized = Object.values(imageMapping).map(p => p.replace('/optimized/', ''));
    
    const unmapped = optimizedFiles.filter(file => !mappedOptimized.includes(file));
    if (unmapped.length > 0) {
      console.log('\n🔍 IMÁGENES OPTIMIZADAS NO MAPEADAS:');
      unmapped.forEach(file => {
        console.log(`  /optimized/${file}`);
      });
    }
  }

  console.log('\n✨ Verificación completada!');
}

if (require.main === module) {
  main();
}

module.exports = { main, checkImageExists, getFileSize };



