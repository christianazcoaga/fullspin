-- Crear tabla para suscriptores del newsletter por teléfono
CREATE TABLE IF NOT EXISTS newsletter_phone_subscribers (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice para búsquedas por teléfono
CREATE INDEX IF NOT EXISTS idx_newsletter_phone_subscribers_phone ON newsletter_phone_subscribers(phone);

-- Crear índice para búsquedas por estado activo
CREATE INDEX IF NOT EXISTS idx_newsletter_phone_subscribers_active ON newsletter_phone_subscribers(is_active);

-- Crear función para actualizar el timestamp de updated_at
CREATE OR REPLACE FUNCTION update_phone_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_newsletter_phone_subscribers_updated_at 
    BEFORE UPDATE ON newsletter_phone_subscribers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_phone_updated_at_column();

-- Comentarios para documentar la tabla
COMMENT ON TABLE newsletter_phone_subscribers IS 'Tabla para almacenar suscriptores del newsletter por teléfono';
COMMENT ON COLUMN newsletter_phone_subscribers.phone IS 'Número de teléfono del suscriptor (único)';
COMMENT ON COLUMN newsletter_phone_subscribers.is_active IS 'Indica si la suscripción está activa';
COMMENT ON COLUMN newsletter_phone_subscribers.created_at IS 'Fecha de creación del registro';
COMMENT ON COLUMN newsletter_phone_subscribers.updated_at IS 'Fecha de última actualización del registro';

-- Configurar políticas de seguridad (RLS) si está habilitado
-- Habilitar RLS en la tabla
ALTER TABLE newsletter_phone_subscribers ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserciones desde la aplicación
CREATE POLICY "Allow phone newsletter subscriptions" ON newsletter_phone_subscribers
    FOR INSERT WITH CHECK (true);

-- Política para permitir lecturas (opcional, para administración)
CREATE POLICY "Allow read phone newsletter subscribers" ON newsletter_phone_subscribers
    FOR SELECT USING (true);

-- Política para permitir actualizaciones (para desuscripciones)
CREATE POLICY "Allow update phone newsletter subscribers" ON newsletter_phone_subscribers
    FOR UPDATE USING (true); 