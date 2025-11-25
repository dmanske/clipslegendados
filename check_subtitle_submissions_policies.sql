-- ============================================
-- CONSULTAR POLÍTICAS RLS EXISTENTES
-- ============================================
-- Cole este SQL no Supabase para ver quais políticas existem

-- Ver todas as políticas da tabela subtitle_submissions
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'subtitle_submissions'
ORDER BY policyname;

-- Ver se RLS está habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'subtitle_submissions';
