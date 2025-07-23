const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuración de optimización
const config = {
  quality: 85,
  formats: ['webp', 'avif'],
  sizes: {
    thumbnail: 150,
    small: 300,
    medium: 600,
    large: 1200
  }
};

// Función para optimizar una imagen
async function optimizeImage(inputPath, outputDir, filename) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`Optimizando: ${filename}`);
    
    // Crear directorio de salida si no existe
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Optimizar imagen original
    const optimizedPath = path.join(outputDir, `${filename}.webp`);
    await image
      .webp({ quality: config.quality })
      .toFile(optimizedPath);
    
    console.log(`✅ Optimizada: ${optimizedPath}`);
    
    // Crear versiones responsive si la imagen es grande
    if (metadata.width > 600) {
      for (const [sizeName, size] of Object.entries(config.sizes)) {
        if (metadata.width >= size) {
          const responsivePath = path.join(outputDir, `${filename}-${sizeName}.webp`);
          await image
            .resize(size)
            .webp({ quality: config.quality })
            .toFile(responsivePath);
          
          console.log(`✅ Responsive ${sizeName}: ${responsivePath}`);
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error optimizando ${filename}:`, error.message);
    return false;
  }
}

// Función principal
async function optimizeAllImages() {
  const publicDir = path.join(__dirname, '../public');
  const optimizedDir = path.join(publicDir, 'optimized');
  
  // Crear directorio de imágenes optimizadas
  if (!fs.existsSync(optimizedDir)) {
    fs.mkdirSync(optimizedDir, { recursive: true });
  }
  
  // Lista de archivos a optimizar
  const imageFiles = [
    'adidas-banner.png',
    'Adidas_Padel_Banner.png',
    'banner_adidas_ord_993f8af2-99ec-47e9-9a35-6f60ec805bdd.png',
    'butterfly-banner.png',
    'dhs-banner.png',
    'wilson-banner.png',
    'wilson-banner.jpg',
    'tenis-mesa1.jpg',
    'padel1.jpg',
    'padel-racket-bg.png',
    'tt-paddle-bg.png',
    'fullspin-logo.png',
    'adidas-logo.png',
    'wilson-logo.png',
    'butterfly-logo.png',
    'dhs-logo.png',
    'sanwei-logo.png',
    'babolat-logo.png',
    'bullpadel-logo.png',
    'dunlop-logo.png',
    'head-logo.png'
  ];
  
  console.log('🚀 Iniciando optimización de imágenes...\n');
  
  let successCount = 0;
  let totalCount = imageFiles.length;
  
  for (const filename of imageFiles) {
    const inputPath = path.join(publicDir, filename);
    
    if (fs.existsSync(inputPath)) {
      const success = await optimizeImage(inputPath, optimizedDir, path.parse(filename).name);
      if (success) successCount++;
    } else {
      console.log(`⚠️  Archivo no encontrado: ${filename}`);
    }
  }
  
  console.log(`\n🎉 Optimización completada: ${successCount}/${totalCount} imágenes procesadas`);
  console.log(`📁 Imágenes optimizadas guardadas en: ${optimizedDir}`);
}

// Ejecutar si se llama directamente
if (require.main === module) {
  optimizeAllImages().catch(console.error);
}

module.exports = { optimizeAllImages, optimizeImage }; 