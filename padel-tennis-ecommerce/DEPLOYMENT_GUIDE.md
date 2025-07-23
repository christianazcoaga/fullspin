# Guía de Deployment - FullSpin Ecommerce

## 🚀 Problemas de Build Solucionados

### Error: Cannot find module 'critters'

**Problema:** El build fallaba con el error `Cannot find module 'critters'` debido a la configuración experimental `optimizeCss: true`.

**Solución aplicada:**
1. ✅ Comentamos `optimizeCss: true` en `next.config.mjs`
2. ✅ Instalamos `critters` como dependencia
3. ✅ Creamos `next.config.optimized.mjs` para uso futuro

## 📋 Configuraciones Disponibles

### Configuración Actual (Estable)
- **Archivo:** `next.config.mjs`
- **Estado:** `optimizeCss` comentado
- **Uso:** Deploy actual en producción

### Configuración Optimizada (Opcional)
- **Archivo:** `next.config.optimized.mjs`
- **Estado:** `optimizeCss` habilitado
- **Uso:** Para mejor rendimiento CSS (experimental)

## 🔧 Cómo Cambiar de Configuración

### Para usar la configuración optimizada:
```bash
# Renombrar archivos
mv next.config.mjs next.config.stable.mjs
mv next.config.optimized.mjs next.config.mjs

# Hacer commit y push
git add .
git commit -m "Enable CSS optimization"
git push
```

### Para volver a la configuración estable:
```bash
# Renombrar archivos
mv next.config.mjs next.config.optimized.mjs
mv next.config.stable.mjs next.config.mjs

# Hacer commit y push
git add .
git commit -m "Disable CSS optimization for stability"
git push
```

## ⚠️ Consideraciones

### Configuración Optimizada
- ✅ Mejor rendimiento CSS
- ✅ Tamaño de bundle reducido
- ⚠️ Experimental (puede causar problemas)
- ⚠️ Requiere `critters` instalado

### Configuración Estable
- ✅ Más estable y confiable
- ✅ Menos problemas de build
- ⚠️ CSS no optimizado
- ⚠️ Bundle ligeramente más grande

## 🛠️ Dependencias Requeridas

### Para configuración optimizada:
```bash
npm install critters --legacy-peer-deps
```

### Para configuración estable:
No se requieren dependencias adicionales.

## 📊 Monitoreo

### Después del deploy:
1. Verificar que el sitio funcione correctamente
2. Revisar el rendimiento en PageSpeed Insights
3. Monitorear errores en la consola del navegador
4. Verificar funcionalidades críticas (newsletter, búsqueda, etc.)

## 🚨 Troubleshooting

### Si el build falla:
1. Verificar que `critters` esté instalado
2. Revisar conflictos de dependencias
3. Usar `--legacy-peer-deps` si es necesario
4. Considerar volver a la configuración estable

### Si hay problemas de rendimiento:
1. Habilitar la configuración optimizada
2. Monitorear métricas de Core Web Vitals
3. Optimizar imágenes y assets

## 📞 Contacto

Si encuentras problemas:
1. Revisar los logs de build en Vercel
2. Verificar la configuración de Next.js
3. Probar localmente antes del deploy 