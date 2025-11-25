-- ============================================
-- ADICIONAR POLÍTICAS FALTANTES
-- ============================================
-- Só adiciona o que está faltando

-- 1. Adicionar política de DELETE (está faltando)
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

-- 2. OPCIONAL: Atualizar a política de INSERT para aceitar anon também
-- (Se você quiser que usuários NÃO logados possam enviar legendas)
DROP POLICY IF EXISTS "Anyone can submit subtitles" ON subtitle_submissions;

CREATE POLICY "Anyone can submit subtitles"
ON subtitle_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- ============================================
-- PRONTO! ✅
-- ============================================
