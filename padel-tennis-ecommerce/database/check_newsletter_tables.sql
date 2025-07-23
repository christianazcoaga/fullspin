-- Script para verificar el estado de las tablas de newsletter

-- Verificar si existe la tabla newsletter_subscribers
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'newsletter_subscribers'
        ) THEN 'EXISTE'
        ELSE 'NO EXISTE'
    END as newsletter_subscribers_status;

-- Verificar si existe la tabla newsletter_phone_subscribers
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'newsletter_phone_subscribers'
        ) THEN 'EXISTE'
        ELSE 'NO EXISTE'
    END as newsletter_phone_subscribers_status;

-- Mostrar estructura de newsletter_subscribers si existe
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'newsletter_subscribers'
ORDER BY ordinal_position;

-- Mostrar estructura de newsletter_phone_subscribers si existe
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'newsletter_phone_subscribers'
ORDER BY ordinal_position;

-- Verificar políticas RLS en newsletter_subscribers
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'newsletter_subscribers';

-- Verificar políticas RLS en newsletter_phone_subscribers
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'newsletter_phone_subscribers';

-- Contar registros en cada tabla
SELECT 
    'newsletter_subscribers' as table_name,
    COUNT(*) as record_count
FROM newsletter_subscribers
UNION ALL
SELECT 
    'newsletter_phone_subscribers' as table_name,
    COUNT(*) as record_count
FROM newsletter_phone_subscribers; 