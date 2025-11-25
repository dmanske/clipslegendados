# Atualizações do Banco de Dados - Sistema Completo

## 1. Tabela para Submissões de Legendas

Execute este SQL no Supabase para criar a tabela de submissões:

```sql
-- Tabela para armazenar submissões de legendas dos usuários
CREATE TABLE IF NOT EXISTS public.subtitle_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  youtube_url text NOT NULL,
  srt_content text NOT NULL,
  submitter_name text NOT NULL,
  submitter_email text NOT NULL,
  message text,
  status text DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_subtitle_submissions_status ON public.subtitle_submissions(status);
CREATE INDEX IF NOT EXISTS idx_subtitle_submissions_created_at ON public.subtitle_submissions(created_at DESC);

-- RLS (Row Level Security)
ALTER TABLE public.subtitle_submissions ENABLE ROW LEVEL SECURITY;

-- Qualquer um pode inserir (enviar legendas)
CREATE POLICY "Anyone can submit subtitles"
  ON subtitle_submissions FOR INSERT
  WITH CHECK (true);

-- Apenas admins podem ver todas as submissões
CREATE POLICY "Admins can view all submissions"
  ON subtitle_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Apenas admins podem atualizar status
CREATE POLICY "Admins can update submissions"
  ON subtitle_submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

## 2. Campo para Clipe em Destaque (Hero)

Execute este SQL para adicionar o campo `is_featured` na tabela clips:

```sql
-- Adicionar campo para marcar clipe como destaque
ALTER TABLE public.clips 
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

-- Criar índice
CREATE INDEX IF NOT EXISTS idx_clips_is_featured ON public.clips(is_featured) WHERE is_featured = true;

-- Função para garantir que apenas 1 clipe seja destaque por vez
CREATE OR REPLACE FUNCTION ensure_single_featured_clip()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_featured = true THEN
    -- Remove o destaque de todos os outros clipes
    UPDATE public.clips
    SET is_featured = false
    WHERE id != NEW.id AND is_featured = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para executar a função
DROP TRIGGER IF EXISTS trigger_ensure_single_featured_clip ON public.clips;
CREATE TRIGGER trigger_ensure_single_featured_clip
  BEFORE INSERT OR UPDATE ON public.clips
  FOR EACH ROW
  WHEN (NEW.is_featured = true)
  EXECUTE FUNCTION ensure_single_featured_clip();

-- Comentário explicativo
COMMENT ON COLUMN public.clips.is_featured IS 'Apenas um clipe pode ser destaque por vez. Aparecerá no hero da página inicial.';
```

## 3. Tabela para Pedidos de Tradução

Execute este SQL para criar a tabela de pedidos:

```sql
-- Tabela para pedidos de tradução de clipes
CREATE TABLE IF NOT EXISTS public.translation_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  youtube_url text NOT NULL,
  requester_name text,
  requester_email text,
  language text DEFAULT 'pt-BR',
  message text,
  status text DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'rejected'
  priority integer DEFAULT 0, -- 0 = normal, 1 = alta, 2 = urgente
  assigned_to uuid REFERENCES auth.users(id),
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_translation_requests_status ON public.translation_requests(status);
CREATE INDEX IF NOT EXISTS idx_translation_requests_priority ON public.translation_requests(priority DESC);
CREATE INDEX IF NOT EXISTS idx_translation_requests_created_at ON public.translation_requests(created_at DESC);

-- RLS
ALTER TABLE public.translation_requests ENABLE ROW LEVEL SECURITY;

-- Qualquer um pode criar pedidos
CREATE POLICY "Anyone can create translation requests"
  ON translation_requests FOR INSERT
  WITH CHECK (true);

-- Apenas admins podem ver todos os pedidos
CREATE POLICY "Admins can view all requests"
  ON translation_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Apenas admins podem atualizar pedidos
CREATE POLICY "Admins can update requests"
  ON translation_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

## 4. Como Usar

### No Painel Admin - Marcar Clipe como Destaque:

Na página de edição de clipe, adicione um checkbox:
```typescript
<label className="flex items-center gap-2">
  <input 
    type="checkbox" 
    checked={isFeatured}
    onChange={(e) => setIsFeatured(e.target.checked)}
  />
  <span>Marcar como destaque (Hero)</span>
</label>
```

### Na Home - Buscar Clipe em Destaque:

```typescript
// Buscar clipe em destaque primeiro
const { data: featuredClip } = await supabase
  .from('clips')
  .select('*')
  .eq('status', 'Published')
  .eq('is_featured', true)
  .single();

// Se não houver destaque, pegar o mais recente
if (!featuredClip) {
  const { data: latestClip } = await supabase
    .from('clips')
    .select('*')
    .eq('status', 'Published')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
}
```

### Salvar Submissão de Legenda:

```typescript
const { error } = await supabase
  .from('subtitle_submissions')
  .insert([{
    youtube_url: youtubeUrl,
    srt_content: srtContent,
    submitter_name: name,
    submitter_email: email,
    message: message
  }]);
```

## 5. Painel Admin - Nova Página

Adicione no menu admin:
- **Submissões de Legendas** - Para revisar legendas enviadas
- **Pedidos de Tradução** - Para ver pedidos de tradução

Ambas as páginas devem permitir:
- Visualizar lista
- Aprovar/Rejeitar
- Ver detalhes
- Baixar SRT (para submissões)
