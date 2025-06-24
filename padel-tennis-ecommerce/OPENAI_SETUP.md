# Configuración de OpenAI para el Chat IA

## Pasos para configurar OpenAI:

### 1. Obtener API Key de OpenAI
1. Ve a [OpenAI Platform](https://platform.openai.com/)
2. Crea una cuenta o inicia sesión
3. Ve a "API Keys" en el menú lateral
4. Haz clic en "Create new secret key"
5. Copia la API key generada

### 2. Configurar Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```env
# OpenAI API Key
OPENAI_API_KEY=tu_api_key_de_openai_aqui

# Supabase Configuration (si no está ya configurado)
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### 3. Características del Chat IA

El chat ahora utiliza **GPT-3.5-turbo** de OpenAI para:

✅ **Análisis inteligente de consultas** - Entiende lenguaje natural en español  
✅ **Recomendaciones contextuales** - Sugiere productos basados en el contexto  
✅ **Respuestas conversacionales** - Mantiene una conversación natural  
✅ **Filtrado inteligente** - Combina múltiples criterios automáticamente  
✅ **Explicaciones detalladas** - Explica por qué recomienda cada producto  

### 4. Ejemplos de consultas que puede manejar:

- "Busco una pala de padel para principiantes"
- "Tenis de mesa hasta $50.000"
- "Zapatillas Babolat para nivel intermedio"
- "Pelotas de padel de buena calidad"
- "Mesa de tenis de mesa profesional"
- "Ropa para padel de marca Head"

### 5. Costos

- **GPT-3.5-turbo**: ~$0.002 por 1K tokens
- Una consulta típica cuesta aproximadamente $0.01-0.02
- El sistema está optimizado para minimizar el uso de tokens

### 6. Seguridad

- La API key se mantiene en el servidor (no se expone al cliente)
- Los productos se filtran en el servidor antes de enviarse a OpenAI
- No se comparten datos sensibles con OpenAI

### 7. Fallback

Si OpenAI no está disponible, el sistema mostrará un mensaje de error amigable y sugerirá intentar de nuevo.

---

**Nota**: Asegúrate de agregar `.env.local` a tu `.gitignore` para no compartir tu API key en el repositorio. 