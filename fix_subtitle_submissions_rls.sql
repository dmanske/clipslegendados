-- ============================================
-- FIX RLS PARA SUBTITLE_SUBMISSIONS
-- ============================================
-- Cole este arquivo completo no SQL Editor do Supabase
-- e execute tudo de uma vez

-- RLS já está habilitado, só precisa criar as políticas

-- 3. Permitir que QUALQUER PESSOA envie legendas (mesmo sem login)
CREATE POLICY "Qualquer um pode enviar legendas"
ON subtitle_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 4. Apenas ADMINS podem ver as submissões
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

-- 5. Apenas ADMINS podem atualizar submissões
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

-- 6. Apenas ADMINS podem deletar submissões
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
-- PRONTO! Agora teste enviando uma legenda
-- ============================================
