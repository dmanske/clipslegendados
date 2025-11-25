-- ============================================
-- FIX COMPLETO - TODAS AS POLÍTICAS RLS
-- ============================================
-- Cole este arquivo completo no SQL Editor do Supabase
-- e execute tudo de uma vez para corrigir TUDO

-- ============================================
-- 1. TRANSLATION_REQUESTS (Pedidos de Tradução)
-- ============================================

-- Remover políticas antigas
DROP POLICY IF EXISTS "Anyone can create translation requests" ON translation_requests;
DROP POLICY IF EXISTS "Admins can view all requests" ON translation_requests;
DROP POLICY IF EXISTS "Admins can update requests" ON translation_requests;
DROP POLICY IF EXISTS "Usuários podem criar pedidos de tradução" ON translation_requests;
DROP POLICY IF EXISTS "Qualquer um pode criar pedidos" ON translation_requests;
DROP POLICY IF EXISTS "Qualquer um pode ver pedidos" ON translation_requests;
DROP POLICY IF EXISTS "Admins podem atualizar pedidos" ON translation_requests;
DROP POLICY IF EXISTS "Admins podem deletar pedidos" ON translation_requests;

-- Habilitar RLS
ALTER TABLE translation_requests ENABLE ROW LEVEL SECURITY;

-- Permitir que QUALQUER PESSOA crie pedidos (mesmo sem login)
CREATE POLICY "Qualquer um pode criar pedidos"
ON translation_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Permitir que QUALQUER PESSOA veja os pedidos
CREATE POLICY "Qualquer um pode ver pedidos"
ON translation_requests
FOR SELECT
TO anon, authenticated
USING (true);

-- Apenas ADMINS podem atualizar pedidos
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

-- Apenas ADMINS podem deletar pedidos
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
-- 2. SUBTITLE_SUBMISSIONS (Envio de Legendas)
-- ============================================

-- Remover políticas antigas
DROP POLICY IF EXISTS "Anyone can submit subtitles" ON subtitle_submissions;
DROP POLICY IF EXISTS "Admins can view all submissions" ON subtitle_submissions;
DROP POLICY IF EXISTS "Admins can update submissions" ON subtitle_submissions;
DROP POLICY IF EXISTS "Usuários podem enviar legendas" ON subtitle_submissions;
DROP POLICY IF EXISTS "Qualquer um pode enviar legendas" ON subtitle_submissions;
DROP POLICY IF EXISTS "Qualquer um pode ver legendas" ON subtitle_submissions;
DROP POLICY IF EXISTS "Admins podem atualizar legendas" ON subtitle_submissions;
DROP POLICY IF EXISTS "Admins podem deletar legendas" ON subtitle_submissions;

-- Habilitar RLS
ALTER TABLE subtitle_submissions ENABLE ROW LEVEL SECURITY;

-- Permitir que QUALQUER PESSOA envie legendas (mesmo sem login)
CREATE POLICY "Qualquer um pode enviar legendas"
ON subtitle_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Apenas ADMINS podem ver as submissões
CREATE POLICY "Admins podem ver legendas"
ON subtitle_submissions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Apenas ADMINS podem atualizar submissões
CREATE POLICY "Admins podem atualizar legendas"
ON subtitle_submissions
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

-- Apenas ADMINS podem deletar submissões
CREATE POLICY "Admins podem deletar legendas"
ON subtitle_submissions
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
-- PRONTO! ✅
-- ============================================
-- Agora você pode:
-- ✅ Criar pedidos de tradução (sem login)
-- ✅ Enviar legendas SRT (sem login)
-- ✅ Admins podem gerenciar tudo
-- ============================================
