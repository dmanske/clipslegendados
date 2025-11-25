-- ============================================
-- FIX RLS PARA TRANSLATION_REQUESTS
-- ============================================
-- Cole este arquivo completo no SQL Editor do Supabase
-- e execute tudo de uma vez

-- 1. Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Anyone can create translation requests" ON translation_requests;
DROP POLICY IF EXISTS "Admins can view all requests" ON translation_requests;
DROP POLICY IF EXISTS "Admins can update requests" ON translation_requests;
DROP POLICY IF EXISTS "Usuários podem criar pedidos de tradução" ON translation_requests;
DROP POLICY IF EXISTS "Qualquer um pode criar pedidos" ON translation_requests;
DROP POLICY IF EXISTS "Qualquer um pode ver pedidos" ON translation_requests;
DROP POLICY IF EXISTS "Admins podem atualizar pedidos" ON translation_requests;
DROP POLICY IF EXISTS "Admins podem deletar pedidos" ON translation_requests;

-- 2. Habilitar RLS
ALTER TABLE translation_requests ENABLE ROW LEVEL SECURITY;

-- 3. Permitir que QUALQUER PESSOA crie pedidos (mesmo sem login)
CREATE POLICY "Qualquer um pode criar pedidos"
ON translation_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 4. Permitir que QUALQUER PESSOA veja os pedidos
CREATE POLICY "Qualquer um pode ver pedidos"
ON translation_requests
FOR SELECT
TO anon, authenticated
USING (true);

-- 5. Apenas ADMINS podem atualizar pedidos
CREATE POLICY "Admins podem atualizar pedidos"
ON translation_requests
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- 6. Apenas ADMINS podem deletar pedidos
CREATE POLICY "Admins podem deletar pedidos"
ON translation_requests
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- ============================================
-- PRONTO! Agora teste criando um pedido
-- ============================================
