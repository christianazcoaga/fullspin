-- Script para recrear la tabla newsletter_subscribers

-- Eliminar la tabla si existe (CUIDADO: esto borrará todos los datos)
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;

-- Crear tabla para suscriptores del newsletter
CREATE TABLE newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice para búsquedas por email
CREATE INDEX idx_newsletter_subscribers_email ON newsletter_subscribers(email);

-- Crear índice para búsquedas por estado activo
CREATE INDEX idx_newsletter_subscribers_active ON newsletter_subscribers(is_active);

-- Crear función para actualizar el timestamp de updated_at (si no existe)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at automáticamente
DROP TRIGGER IF EXISTS update_newsletter_subscribers_updated_at ON newsletter_subscribers;
CREATE TRIGGER update_newsletter_subscribers_updated_at 
    BEFORE UPDATE ON newsletter_subscribers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comentarios para documentar la tabla
COMMENT ON TABLE newsletter_subscribers IS 'Tabla para almacenar suscriptores del newsletter';
COMMENT ON COLUMN newsletter_subscribers.email IS 'Email del suscriptor (único)';
COMMENT ON COLUMN newsletter_subscribers.subscribed_at IS 'Fecha y hora de suscripción';
COMMENT ON COLUMN newsletter_subscribers.is_active IS 'Indica si la suscripción está activa';
COMMENT ON COLUMN newsletter_subscribers.created_at IS 'Fecha de creación del registro';
COMMENT ON COLUMN newsletter_subscribers.updated_at IS 'Fecha de última actualización del registro';

-- Configurar políticas de seguridad (RLS)
-- Habilitar RLS en la tabla
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Allow newsletter subscriptions" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow read newsletter subscribers" ON newsletter_subscribers;

-- Política para permitir inserciones desde la aplicación
CREATE POLICY "Allow newsletter subscriptions" ON newsletter_subscribers
    FOR INSERT WITH CHECK (true);

-- Política para permitir lecturas (opcional, para administración)
CREATE POLICY "Allow read newsletter subscribers" ON newsletter_subscribers
    FOR SELECT USING (true);

-- Política para permitir actualizaciones (para desuscripciones)
CREATE POLICY "Allow update newsletter subscribers" ON newsletter_subscribers
    FOR UPDATE USING (true);

-- Verificar que la tabla se creó correctamente
SELECT 
    'newsletter_subscribers creada exitosamente' as status,
    COUNT(*) as column_count
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'newsletter_subscribers'; 