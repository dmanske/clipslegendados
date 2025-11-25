# 📊 Como Controlar as Visualizações no Painel Admin

## ✅ IMPLEMENTADO - Situação Atual

O sistema agora **incrementa automaticamente** as visualizações quando alguém assiste um clipe!

### ✅ O que funciona:
✅ **Dashboard** mostra total de visualizações de todos os clipes
✅ **Dashboard** mostra os 3 clipes mais populares (ordenados por views)
✅ **Biblioteca de Clipes** exibe visualizações de cada clipe
✅ **Incremento automático** quando o usuário inicia o vídeo (YouTube ou direto)
✅ **Contagem única por sessão** - não conta múltiplas vezes na mesma visita

### ⚠️ Limitações atuais:
⚠️ Não há rastreamento de views únicas por usuário (conta cada visita à página)
⚠️ Não há histórico de visualizações ao longo do tempo (para gráficos reais)

---

## 🔧 Como Funciona Atualmente

### 1. **Dashboard** (`pages/admin/Dashboard.tsx`)
- Busca todos os clipes e soma o campo `views`
- Mostra os 3 clipes com mais visualizações
- Exibe gráfico simulado (não usa dados reais de histórico)

```typescript
// Calcula total de visualizações
const totalViews = clips?.reduce((sum, clip) => sum + (Number(clip.views) || 0), 0) || 0;

// Busca clipes mais populares
const { data: topClips } = await supabase
  .from('clips')
  .select('id, title, artist, views, thumbnail_url')
  .eq('status', 'Published')
  .order('views', { ascending: false })
  .limit(3);
```

### 2. **Editar Clipe** (`pages/admin/EditClip.tsx`)
- Ao criar um novo clipe, define `views = 0`
- Ao editar, mantém o valor atual de views
- **Você pode editar manualmente** o número de visualizações

### 3. **Página Pública** (`pages/public/ClipDetail.tsx`)
- Apenas **exibe** o clipe
- **NÃO incrementa** o contador de views

---

## ✅ IMPLEMENTAÇÃO CONCLUÍDA

### O que foi implementado:

1. **Incremento automático de visualizações** em `ClipDetail.tsx`:
   - Função `incrementView()` que busca o valor atual e incrementa +1
   - Contador `hasIncrementedView` para evitar múltiplas contagens na mesma sessão
   - Integração com YouTube Player API (incrementa ao iniciar reprodução)
   - Integração com vídeos diretos (incrementa no evento `onPlay`)

2. **Exibição de visualizações** em `ClipLibrary.tsx`:
   - Coluna "Visualizações" adicionada na tabela
   - Ícone de olho + número formatado
   - Query atualizada para buscar campo `views`

### Como funciona:

```typescript
// Quando o usuário clica play no YouTube
onStateChange: (event: any) => {
  if (isPlayingState && !hasIncrementedView && id) {
    incrementView(id);  // Incrementa apenas 1 vez
    setHasIncrementedView(true);
  }
}

// Quando o usuário clica play em vídeo direto
<video onPlay={() => {
  if (!hasIncrementedView && id) {
    incrementView(id);
    setHasIncrementedView(true);
  }
}} />
```

---

### Opção 3: Views Únicas por IP/Usuário (Avançado)

Criar uma tabela `clip_views` no Supabase:

```sql
CREATE TABLE clip_views (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  clip_id UUID REFERENCES clips(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT,
  viewed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(clip_id, user_id),
  UNIQUE(clip_id, ip_address)
);
```

Depois, ao invés de incrementar diretamente, insira um registro:

```typescript
const incrementView = async (clipId: string) => {
  try {
    // Tenta inserir um registro de visualização
    const { error } = await supabase
      .from('clip_views')
      .insert({
        clip_id: clipId,
        user_id: user?.id || null,
        ip_address: null // Você precisaria de um backend para capturar o IP
      });
    
    // Se não houver erro (view única), incrementa o contador
    if (!error) {
      const { data: currentClip } = await supabase
        .from('clips')
        .select('views')
        .eq('id', clipId)
        .single();
      
      if (currentClip) {
        await supabase
          .from('clips')
          .update({ views: (currentClip.views || 0) + 1 })
          .eq('id', clipId);
      }
    }
  } catch (error) {
    console.error('Erro ao incrementar view:', error);
  }
};
```

**Prós:** Views únicas, dados históricos
**Contras:** Mais complexo, requer tabela adicional

---

## ✅ Visualizações na Biblioteca de Clipes - IMPLEMENTADO

A Biblioteca de Clipes agora mostra as visualizações de cada clipe:

- ✅ Coluna "Visualizações" adicionada
- ✅ Ícone de olho + número formatado (ex: 1.234)
- ✅ Query atualizada para buscar campo `views`
- ✅ Interface TypeScript atualizada

---

## 🎨 Como Editar Visualizações Manualmente

1. Vá para **Biblioteca de Clipes**
2. Clique no clipe que deseja editar
3. Na página de edição, você pode adicionar um campo para editar views:

```typescript
// Em EditClip.tsx, adicione um campo no formulário:
<div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
    Visualizações
  </label>
  <input
    type="number"
    min="0"
    value={formData.views || 0}
    onChange={(e) => setFormData({ ...formData, views: parseInt(e.target.value) || 0 })}
    className="w-full px-4 h-10 bg-white dark:bg-[#233648] border border-gray-300 dark:border-[#324d67] rounded-lg text-gray-900 dark:text-white"
  />
</div>
```

---

## 📊 Gráfico de Visualizações ao Longo do Tempo

Para ter um gráfico real (não simulado), você precisaria:

1. Criar uma tabela `daily_stats`:
```sql
CREATE TABLE daily_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  date DATE NOT NULL,
  total_views INTEGER DEFAULT 0,
  total_clips INTEGER DEFAULT 0,
  total_comments INTEGER DEFAULT 0,
  UNIQUE(date)
);
```

2. Criar uma função que roda diariamente (via cron job ou Supabase Edge Function) para agregar os dados

3. Buscar esses dados no Dashboard:
```typescript
const { data: statsData } = await supabase
  .from('daily_stats')
  .select('date, total_views')
  .order('date', { ascending: true })
  .limit(30); // últimos 30 dias
```

---

## 🎯 Próximos Passos (Opcional)

Se você quiser melhorar ainda mais o sistema de visualizações:

1. **Views únicas por usuário** - Implemente a Opção 3 (tabela `clip_views`)
2. **Gráficos reais** - Crie tabela `daily_stats` para histórico
3. **Analytics avançado** - Tempo médio de visualização, taxa de conclusão, etc.

---

## 📝 Resumo da Implementação

✅ **Incremento automático** - Views são contadas quando o vídeo inicia
✅ **Proteção contra duplicatas** - Não conta múltiplas vezes na mesma sessão
✅ **Suporte completo** - Funciona com YouTube e vídeos diretos
✅ **Exibição no admin** - Dashboard e Biblioteca mostram as views
✅ **Formatação** - Números formatados (1.234 ao invés de 1234)

**Tudo pronto para uso! 🚀**
