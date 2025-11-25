# Debug de Autenticação - Guia Passo a Passo

## 🔍 Como Debugar o Problema

### 1. Abra o Console do Navegador
Pressione `F12` ou `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows/Linux)

### 2. Vá para a aba "Console"

### 3. Procure por estas mensagens

Os logs agora têm o prefixo `[AuthContext]` para facilitar identificação:

```
[AuthContext] Initial session check: email@exemplo.com null
[AuthContext] fetchProfile called for userId: xxx retry: 0
[AuthContext] Profile fetch result: { profileData: {...}, profileError: null }
[AuthContext] Profile set successfully, setting loading to false
[AuthContext] fetchProfile finally block, setting loading to false
```

## 🐛 Problemas Comuns e Soluções

### Problema 1: Loop Infinito de "Carregando..."
**Sintomas**: Página fica eternamente em "Carregando..."

**O que verificar no console**:
```
[AuthContext] Initial session check: ...
```
Se esta mensagem não aparecer, o problema é na inicialização.

**Solução**:
1. Abra o DevTools
2. Vá em Application > Local Storage
3. Limpe tudo relacionado a `supabase`
4. Recarregue a página

### Problema 2: Loop de Redirecionamento
**Sintomas**: Página fica redirecionando entre `/app` e `/login`

**O que verificar no console**:
```
[AuthContext] Auth state changed: SIGNED_IN ...
[AuthContext] Auth state changed: SIGNED_OUT ...
[AuthContext] Auth state changed: SIGNED_IN ...
```
Se você ver múltiplos eventos seguidos, há um problema.

**Solução**:
1. Verifique se as variáveis de ambiente estão corretas
2. Limpe localStorage e cookies
3. Faça logout completo
4. Feche todas as abas do site
5. Abra uma nova aba anônima e teste

### Problema 3: Não Consegue Salvar Clip
**Sintomas**: Clica em "Publicar" mas nada acontece

**O que verificar no console**:
```
Erro ao salvar: ...
```

**Solução**:
1. Verifique se você está logado como admin
2. Verifique as políticas RLS no Supabase
3. Verifique se o Supabase está configurado

### Problema 4: Sessão Não Persiste
**Sintomas**: Ao recarregar a página, perde o login

**O que verificar no console**:
```
[AuthContext] Initial session check: null null
```

**Solução**:
1. Verifique se cookies estão habilitados
2. Verifique se não está em modo anônimo
3. Verifique configuração do Supabase (Redirect URLs)

## 🧪 Testes para Fazer

### Teste 1: Login Básico
1. Limpe localStorage: `localStorage.clear()`
2. Recarregue a página
3. Faça login
4. Verifique no console se aparece:
   ```
   [AuthContext] Auth state changed: SIGNED_IN
   [AuthContext] Profile set successfully
   ```

### Teste 2: Persistência de Sessão
1. Faça login
2. Recarregue a página (F5)
3. Verifique no console se aparece:
   ```
   [AuthContext] Initial session check: seu-email@exemplo.com
   ```
4. Deve continuar logado

### Teste 3: Navegação
1. Estando logado, navegue para `/app`
2. Navegue para `/admin` (se for admin)
3. Não deve haver loops
4. Verifique no console se NÃO aparecem múltiplos eventos

### Teste 4: Publicar Clip
1. Vá para `/admin/create`
2. Preencha os campos obrigatórios
3. Clique em "Publicar"
4. Verifique no console:
   ```
   Clipe criado como Publicado!
   ```
5. Deve redirecionar para `/admin/clips`

## 📊 Comandos Úteis no Console

### Ver estado atual do localStorage
```javascript
console.log(localStorage);
```

### Ver sessão do Supabase
```javascript
const { data } = await supabase.auth.getSession();
console.log('Sessão atual:', data);
```

### Ver usuário atual
```javascript
const { data } = await supabase.auth.getUser();
console.log('Usuário atual:', data);
```

### Limpar tudo e fazer logout
```javascript
await supabase.auth.signOut();
localStorage.clear();
sessionStorage.clear();
location.reload();
```

## 🚨 Se Nada Funcionar

### Última Tentativa - Reset Completo

1. **No navegador**:
   ```javascript
   // Cole no console
   localStorage.clear();
   sessionStorage.clear();
   ```

2. **Feche TODAS as abas do site**

3. **Limpe cookies**:
   - Chrome: Settings > Privacy > Clear browsing data
   - Firefox: Settings > Privacy > Clear Data
   - Safari: Preferences > Privacy > Manage Website Data

4. **Abra em modo anônimo/privado**

5. **Teste novamente**

### Se ainda não funcionar

Verifique:
1. ✅ Variáveis de ambiente no `.env` estão corretas
2. ✅ Supabase está online e acessível
3. ✅ Redirect URLs no Supabase incluem seu domínio
4. ✅ Políticas RLS estão configuradas
5. ✅ Tabela `profiles` existe e tem os campos corretos

## 📝 Informações para Reportar Problema

Se precisar de ajuda, copie estas informações do console:

```javascript
// Cole no console e copie o resultado
console.log({
  hasSupabase: !!supabase,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
  localStorage: Object.keys(localStorage),
  currentPath: window.location.pathname
});
```

E também copie os últimos logs do console que começam com `[AuthContext]`.
