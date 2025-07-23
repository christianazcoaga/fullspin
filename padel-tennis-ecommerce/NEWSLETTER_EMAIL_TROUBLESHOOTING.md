# Solución de Problemas - Newsletter por Email

## 🔍 Diagnóstico del Problema

Si el newsletter por WhatsApp funciona pero el de email no, sigue estos pasos para diagnosticar:

### Paso 1: Verificar el estado de las tablas

1. Ve a tu dashboard de Supabase
2. Navega a "SQL Editor"
3. Ejecuta el script `database/check_newsletter_tables.sql`
4. Revisa los resultados para ver si ambas tablas existen

### Paso 2: Verificar la consola del navegador

1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Console"
3. Intenta suscribir un email
4. Busca mensajes de error que empiecen con:
   - "Intentando suscribir email:"
   - "Error verificando email existente:"
   - "Error inserting email subscription:"

### Paso 3: Verificar las políticas RLS

El script de verificación también mostrará las políticas de seguridad. Deberías ver:

```sql
-- Para newsletter_subscribers
"Allow newsletter subscriptions" - INSERT
"Allow read newsletter subscribers" - SELECT  
"Allow update newsletter subscribers" - UPDATE
```

## 🛠️ Soluciones Comunes

### Problema 1: Tabla newsletter_subscribers no existe

**Síntomas:**
- Error "relation 'newsletter_subscribers' does not exist"
- Código de error PGRST116

**Solución:**
1. Ejecuta el script `database/recreate_newsletter_subscribers.sql`
2. Esto recreará la tabla con la estructura correcta

### Problema 2: Políticas RLS faltantes

**Síntomas:**
- Error "new row violates row-level security policy"
- Código de error 42501

**Solución:**
1. Ejecuta el script `database/recreate_newsletter_subscribers.sql`
2. Esto recreará las políticas correctas

### Problema 3: Problemas de conexión con Supabase

**Síntomas:**
- Error de red o timeout
- "Failed to fetch" en la consola

**Solución:**
1. Verifica las variables de entorno en `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
   ```
2. Verifica que las credenciales sean correctas en el dashboard de Supabase

### Problema 4: Email ya existe

**Síntomas:**
- Mensaje "Este email ya está suscrito al newsletter"
- No es un error, es comportamiento normal

**Solución:**
- Usa un email diferente para probar
- O verifica en Supabase si el email realmente existe

## 📋 Pasos de Verificación

### 1. Verificar estructura de la tabla

La tabla `newsletter_subscribers` debe tener esta estructura:

```sql
- id: SERIAL PRIMARY KEY
- email: VARCHAR(255) UNIQUE NOT NULL  
- subscribed_at: TIMESTAMP WITH TIME ZONE
- is_active: BOOLEAN DEFAULT TRUE
- created_at: TIMESTAMP WITH TIME ZONE
- updated_at: TIMESTAMP WITH TIME ZONE
```

### 2. Verificar políticas RLS

```sql
-- Debe tener estas políticas:
"Allow newsletter subscriptions" - INSERT
"Allow read newsletter subscribers" - SELECT
"Allow update newsletter subscribers" - UPDATE
```

### 3. Probar inserción manual

En el SQL Editor de Supabase, prueba:

```sql
INSERT INTO newsletter_subscribers (email, subscribed_at, is_active)
VALUES ('test@example.com', NOW(), true);
```

Si esto funciona, el problema está en el frontend.

## 🚨 Si nada funciona

1. **Recrea ambas tablas:**
   - Ejecuta `database/recreate_newsletter_subscribers.sql`
   - Ejecuta `database/newsletter_phone_subscribers.sql`

2. **Verifica las credenciales de Supabase:**
   - Ve a Settings > API en tu dashboard de Supabase
   - Copia las credenciales correctas

3. **Limpia la caché del navegador:**
   - Ctrl+Shift+R para recargar sin caché
   - O abre en modo incógnito

4. **Verifica la consola:**
   - Busca errores específicos
   - Comparte los mensajes de error para más ayuda

## 📞 Contacto

Si sigues teniendo problemas, comparte:
- Los mensajes de error de la consola
- Los resultados del script de verificación
- El comportamiento específico que observas 