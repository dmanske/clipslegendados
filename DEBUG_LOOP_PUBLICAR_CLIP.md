# 🐛 Debug - Loop ao Publicar Clip com Muitas Informações

## Problema Identificado

Quando você tenta publicar um clip preenchendo todas as informações de uma vez, o sistema entra em loop. Mas se você preenche campo por campo, funciona.

## Causas Identificadas

### 1. Estado `isSaving` Não Resetado
**Problema**: Se houver um erro ao salvar, o estado `isSaving` ficava `true` para sempre, bloqueando novas tentativas.

**Solução Aplicada**: ✅ Agora o `isSaving` é resetado para `false` no bloco `catch` de erro.

### 2. Loop no `useEffect` do Thumbnail
**Problema**: O `useEffect` que auto-preenche o thumbnail tinha `thumbnailUrl` nas dependências, causando re-renders infinitos.

**Solução Aplicada**: ✅ Removido `thumbnailUrl` das dependências do `useEffect`.

### 3. Falta de Logs de Debug
**Problema**: Difícil identificar onde o loop estava acontecendo.

**Solução Aplicada**: ✅ Adicionados logs detalhados com prefixo `[EditClip]`.

---

## 🧪 Como Testar

### Teste 1: Publicar com Todas as Informações de Uma Vez

1. **Abra o Console** (F12)
2. **Vá para** `/admin/create`
3. **Cole/Preencha TUDO de uma vez**:
   - Título: "Teste Completo"
   - Artista: "Artista Teste"
   - Descrição: "Uma descrição longa para testar..."
   - Tags: "pop, rock, indie"
   - URL do YouTube: "https://youtube.com/watch?v=dQw4w9WgXcQ"
   - Ano: 2024
   - Legendado por: "Seu Nome"
   - Delay: 100
   - Adicione 2-3 legendas
4. **Clique em "Publicar"**
5. **Observe o console**

#### Logs Esperados (Sucesso)
```
[EditClip] handleSave called with status: Published, isSaving: false
[EditClip] Starting save process...
[EditClip] Salvando clip com dados: {...}
[EditClip] Save successful, navigating to clips library
```

#### Logs de Problema (Loop)
```
[EditClip] handleSave called with status: Published, isSaving: false
[EditClip] Starting save process...
[EditClip] Salvando clip com dados: {...}
[EditClip] Erro ao criar: ...
[EditClip] Resetting isSaving to false after error
[EditClip] handleSave called with status: Published, isSaving: false
[EditClip] Already saving, ignoring duplicate call
[EditClip] handleSave called with status: Published, isSaving: false
[EditClip] Already saving, ignoring duplicate call
// Repete infinitamente...
```

Se você ver o segundo cenário, há um problema mais profundo.

---

### Teste 2: Verificar se o Botão Fica Travado

1. **Preencha o formulário**
2. **Clique em "Publicar"**
3. **Observe o botão**

**Comportamento Esperado**:
- ✅ Botão mostra "Salvando..." com spinner
- ✅ Botão fica desabilitado (`disabled`)
- ✅ Após salvar ou erro, botão volta ao normal

**Comportamento de Problema**:
- ❌ Botão fica eternamente em "Salvando..."
- ❌ Não consegue clicar novamente
- ❌ Precisa dar refresh (F5)

---

### Teste 3: Testar com Erro Proposital

1. **Preencha o formulário**
2. **Coloque um ano inválido**: 1800 (fora do range 1900-2100)
3. **Clique em "Publicar"**
4. **Deve aparecer erro**: "Ano de lançamento inválido"
5. **Corrija o ano** para 2024
6. **Clique em "Publicar" novamente**
7. **Deve funcionar agora**

Se não funcionar no passo 6, o `isSaving` não foi resetado corretamente.

---

## 🔍 Verificações Adicionais

### Verificar Estado do Componente

Cole no console enquanto estiver na página de criar/editar clip:

```javascript
// Verificar se há múltiplas instâncias do componente
console.log('Componentes EditClip:', document.querySelectorAll('[class*="EditClip"]').length);

// Verificar se há múltiplos formulários
console.log('Formulários na página:', document.querySelectorAll('form').length);

// Verificar botões de publicar
console.log('Botões Publicar:', document.querySelectorAll('button').length);
```

**Esperado**: Deve haver apenas 1 de cada.

---

### Verificar Re-renders Excessivos

Cole no console:

```javascript
// Monitorar re-renders
let renderCount = 0;
const observer = new MutationObserver(() => {
  renderCount++;
  console.log('Re-render detectado:', renderCount);
  if (renderCount > 10) {
    console.error('LOOP DETECTADO! Mais de 10 re-renders');
    observer.disconnect();
  }
});

observer.observe(document.body, { 
  childList: true, 
  subtree: true 
});

// Para parar o monitoramento:
// observer.disconnect();
```

Se aparecer "LOOP DETECTADO!", há um problema de re-render infinito.

---

## 🐛 Problemas Específicos

### Problema 1: Loop ao Colar Muitas Informações

**Sintoma**: Funciona campo por campo, mas não quando cola tudo de uma vez

**Causa Provável**: 
- Múltiplos `onChange` disparando ao mesmo tempo
- `useEffect` reagindo a múltiplas mudanças de estado

**Solução**:
1. Use o botão "Salvar Rascunho" primeiro
2. Depois clique em "Publicar"
3. Ou preencha campo por campo

**Solução Técnica** (se o problema persistir):
```typescript
// Adicionar debounce nos campos de input
const [formData, setFormData] = useState({...});
const debouncedFormData = useDebounce(formData, 300);
```

---

### Problema 2: Erro "Dados inválidos"

**Sintoma**: Aparece erro mas não diz qual campo está errado

**Causa**: Validação do banco de dados rejeitando os dados

**Como Identificar**:
1. Abra o console
2. Procure por `[EditClip] Salvando clip com dados:`
3. Veja o objeto completo que está sendo enviado
4. Verifique cada campo:
   - `release_year`: deve ser número entre 1900-2100 ou `null`
   - `delay`: deve ser número inteiro
   - `tags`: deve ser array de strings
   - `subtitles_json`: deve ser array de objetos

**Exemplo de dados válidos**:
```javascript
{
  title: "Teste",
  artist: "Artista",
  description: "Descrição",
  tags: ["pop", "rock"],
  video_url: "https://youtube.com/watch?v=xxx",
  thumbnail_url: "https://img.youtube.com/vi/xxx/maxresdefault.jpg",
  release_year: 2024,
  status: "Published",
  subtitles_json: [
    {
      id: "1",
      startTime: "00:00.000",
      endTime: "00:05.000",
      text: "Legenda"
    }
  ],
  is_featured: false,
  delay: 0,
  subtitled_by: "Nome",
  views: 0
}
```

---

### Problema 3: Loop Após Refresh

**Sintoma**: Dá refresh (F5) e consegue publicar, mas depois entra em loop novamente

**Causa**: Estado do React ficando inconsistente

**Solução**:
1. Limpe o cache:
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

2. Verifique se há múltiplas abas abertas do admin
3. Feche todas e abra apenas uma

---

### Problema 4: Botão Fica Desabilitado Para Sempre

**Sintoma**: Clica em "Publicar", botão fica desabilitado e nunca volta

**Causa**: `isSaving` não está sendo resetado

**Solução Imediata** (no console):
```javascript
// Forçar reset do estado (APENAS PARA DEBUG)
// Isso não é uma solução permanente!
const buttons = document.querySelectorAll('button');
buttons.forEach(btn => {
  btn.disabled = false;
  btn.textContent = btn.textContent.replace('Salvando...', 'Publicar');
});
```

**Solução Permanente**: ✅ Já aplicada no código - `isSaving` é resetado no `catch`.

---

## 📊 Verificar Estrutura do Banco

Se o problema persistir, pode ser restrição do banco:

```sql
-- Ver constraints da tabela clips
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'clips'::regclass;

-- Ver últimos erros
SELECT * FROM pg_stat_activity 
WHERE state = 'idle in transaction (aborted)';
```

---

## 🆘 Comandos de Emergência

### Resetar Tudo
```javascript
// Cole no console
localStorage.clear();
sessionStorage.clear();
location.href = '/admin/clips';
```

### Forçar Salvamento Manual (APENAS PARA DEBUG)
```javascript
// Cole no console (substitua pelos seus dados)
import('../../services/supabaseClient').then(async ({ supabase }) => {
  const clipData = {
    title: 'Teste Manual',
    video_url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    status: 'Published',
    views: 0
  };
  
  const { data, error } = await supabase
    .from('clips')
    .insert([clipData])
    .select();
    
  console.log('Resultado:', { data, error });
});
```

---

## ✅ Checklist de Debug

Quando tiver loop ao publicar:

- [ ] Console mostra logs com `[EditClip]`?
- [ ] Qual é a mensagem de erro exata?
- [ ] Botão fica em "Salvando..." para sempre?
- [ ] Funciona se preencher campo por campo?
- [ ] Funciona se clicar em "Salvar Rascunho" primeiro?
- [ ] Há múltiplas abas do admin abertas?
- [ ] Já tentou limpar o cache?
- [ ] Já tentou em modo anônimo?
- [ ] Ano está entre 1900-2100?
- [ ] Delay é um número válido?
- [ ] Você é admin?

---

## 💡 Dicas

1. **Use "Salvar Rascunho" primeiro**: Isso salva sem validações rigorosas
2. **Preencha campo por campo**: Evita múltiplos `onChange` simultâneos
3. **Verifique o console sempre**: Os logs mostram exatamente onde está o problema
4. **Teste em modo anônimo**: Descarta problemas de cache/extensões
5. **Feche outras abas**: Múltiplas abas podem causar conflitos

---

## 🔄 Fluxo Correto de Salvamento

```
1. Usuário preenche formulário
   ↓
2. Clica em "Publicar"
   ↓
3. handleSave verifica se isSaving === false
   ↓
4. setIsSaving(true) - Bloqueia novos cliques
   ↓
5. Valida dados (título, URL, ano, etc)
   ↓
6. Envia para Supabase
   ↓
7a. SUCESSO: Mostra toast → Navega para /admin/clips
7b. ERRO: Mostra toast → setIsSaving(false) → Permite nova tentativa
```

O passo **7b** é CRÍTICO - se não resetar `isSaving`, o botão fica travado para sempre.

---

**Última atualização**: Correções aplicadas para resetar `isSaving` em caso de erro e evitar loop no `useEffect` do thumbnail! 🔧
