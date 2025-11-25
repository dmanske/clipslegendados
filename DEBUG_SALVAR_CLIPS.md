# 🐛 Debug - Erro ao Salvar Clips

## Problema: Não Consegue Salvar Clips

### Sintomas Comuns
- ✅ Salvou com poucos dados
- ❌ Erro ao salvar com dados completos
- ❌ Erro ao adicionar legendas
- ❌ Erro com delay ou ano

---

## 🔍 Como Identificar o Problema

### 1. Abra o Console (F12)

Procure por mensagens que começam com `[EditClip]`:

```
[EditClip] Salvando clip com dados: {...}
[EditClip] Erro ao criar: ...
```

### 2. Tipos de Erro Comuns

#### Erro: "violates check constraint"
**Causa**: Dados inválidos (ex: ano fora do range, delay muito grande)

**Solução**:
- Ano deve estar entre 1900 e 2100
- Delay deve ser um número inteiro
- Verifique se não há campos com valores estranhos

#### Erro: "value too long"
**Causa**: Algum campo está muito longo

**Solução**:
- Título: máximo ~200 caracteres
- Descrição: máximo ~1000 caracteres
- Tags: máximo ~500 caracteres total
- Legendas: verifique se não há textos muito longos

#### Erro: "invalid input syntax"
**Causa**: Formato de dados incorreto

**Solução**:
- Ano deve ser apenas números
- Delay deve ser apenas números
- URL do vídeo deve ser válida

#### Erro: "permission denied" ou código 42501
**Causa**: Você não tem permissão de admin

**Solução**:
```sql
-- Execute no SQL Editor do Supabase
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'seu-email@exemplo.com';
```

---

## 🧪 Testes para Fazer

### Teste 1: Salvar com Dados Mínimos
1. Preencha apenas:
   - Título
   - URL do YouTube
2. Clique em "Publicar"
3. ✅ Deve funcionar

### Teste 2: Adicionar Campos Opcionais
1. Adicione um por vez:
   - Artista
   - Descrição
   - Tags
   - Ano
2. Salve após cada adição
3. Identifique qual campo causa erro

### Teste 3: Testar Legendas
1. Crie um clip sem legendas
2. Salve
3. Edite e adicione 1 legenda
4. Salve
5. Adicione mais legendas
6. Identifique se o problema é quantidade ou formato

### Teste 4: Testar Delay
1. Deixe delay em 0
2. Salve
3. Edite e coloque delay = 100
4. Salve
5. Teste com valores negativos: -100

---

## 🔧 Correções Aplicadas

### 1. Validação de Dados
Agora o sistema valida:
- ✅ Delay é convertido para número inteiro
- ✅ Ano é validado (1900-2100)
- ✅ Campos vazios são convertidos para `null`
- ✅ Views só é enviado na criação (não na atualização)

### 2. Mensagens de Erro Específicas
Agora você vê mensagens mais claras:
- "Dados inválidos. Verifique os campos numéricos."
- "Algum campo está muito longo. Reduza o tamanho do texto."
- "Você não tem permissão para fazer isso."

### 3. Logs Detalhados
Todos os logs têm prefixo `[EditClip]` para facilitar debug

---

## 📊 Verificar Estrutura do Banco

### Verificar Tabela Clips

Execute no SQL Editor do Supabase:

```sql
-- Ver estrutura da tabela
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_name = 'clips';
```

### Estrutura Esperada

```sql
CREATE TABLE clips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist TEXT,
  description TEXT,
  tags TEXT[],
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  release_year INTEGER,
  status TEXT DEFAULT 'Draft',
  subtitles_json JSONB,
  is_featured BOOLEAN DEFAULT false,
  delay INTEGER DEFAULT 0,
  subtitled_by TEXT,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Verificar Constraints

```sql
-- Ver constraints da tabela
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'clips'::regclass;
```

Se houver constraints que estão bloqueando, você pode removê-las:

```sql
-- Exemplo: remover constraint de ano
ALTER TABLE clips DROP CONSTRAINT IF EXISTS clips_release_year_check;

-- Adicionar constraint correta
ALTER TABLE clips ADD CONSTRAINT clips_release_year_check 
CHECK (release_year IS NULL OR (release_year >= 1900 AND release_year <= 2100));
```

---

## 🚨 Problemas Específicos

### Problema: Erro com Legendas Grandes

**Sintoma**: Funciona com poucas legendas, erro com muitas

**Causa**: Limite de tamanho do JSONB

**Solução**:
```sql
-- Verificar tamanho máximo permitido
SHOW max_allowed_packet;

-- Se necessário, aumentar limite (no Supabase, geralmente não é necessário)
```

**Alternativa**: Dividir legendas em múltiplos clips

### Problema: Erro com Caracteres Especiais

**Sintoma**: Erro ao salvar com emojis ou caracteres especiais

**Causa**: Encoding do banco

**Solução**:
```sql
-- Verificar encoding
SHOW SERVER_ENCODING;

-- Deve ser UTF8
-- Se não for, contate suporte do Supabase
```

### Problema: Erro Intermitente

**Sintoma**: Às vezes funciona, às vezes não

**Causa**: Timeout ou problema de rede

**Solução**:
1. Verifique conexão com internet
2. Verifique status do Supabase: https://status.supabase.com
3. Tente novamente após alguns segundos

---

## 📝 Checklist de Debug

Quando tiver erro ao salvar, verifique:

- [ ] Console mostra erro com `[EditClip]`?
- [ ] Qual é a mensagem de erro exata?
- [ ] Funciona com dados mínimos (só título + URL)?
- [ ] Qual campo causa o erro? (teste um por um)
- [ ] Ano está entre 1900 e 2100?
- [ ] Delay é um número válido?
- [ ] Você é admin? (verifique no banco)
- [ ] Políticas RLS estão corretas?
- [ ] Tabela clips existe e tem estrutura correta?

---

## 🆘 Comando de Emergência

Se nada funcionar, execute no SQL Editor:

```sql
-- Ver último erro detalhado
SELECT * FROM pg_stat_activity 
WHERE state = 'idle in transaction (aborted)';

-- Limpar transações travadas
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE state = 'idle in transaction (aborted)';

-- Verificar permissões da tabela
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name='clips';
```

---

## 💡 Dica Final

**Teste sempre com dados mínimos primeiro**:
1. Título: "Teste"
2. URL: "https://youtube.com/watch?v=dQw4w9WgXcQ"
3. Clique em "Publicar"

Se isso funcionar, o problema está em algum campo específico. Adicione campos um por um até encontrar o culpado.
