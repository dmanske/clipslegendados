# 🚀 Solução Rápida - Loop de Autenticação

## Problema: Loop Infinito ou Não Consegue Salvar

### ✅ Solução em 3 Passos

#### 1. Limpar Cache Completo

**Opção A - Usando o arquivo de teste**:
```bash
# Abra o arquivo test-auth.html no navegador
# Clique em "Reset Completo"
```

**Opção B - Manual**:
1. Pressione `F12` (DevTools)
2. Vá em **Console**
3. Cole e execute:
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

#### 2. Verificar Variáveis de Ambiente

Abra o arquivo `.env` e confirme:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Importante**: 
- ✅ Não deve ter espaços antes ou depois do `=`
- ✅ Não deve ter aspas nas variáveis
- ✅ A URL deve terminar com `.supabase.co`

#### 3. Reiniciar o Servidor de Desenvolvimento

```bash
# Pare o servidor (Ctrl+C)
# Limpe o cache do Vite
rm -rf node_modules/.vite

# Inicie novamente
npm run dev
```

---

## 🔍 Ainda Não Funcionou?

### Teste 1: Verificar se o Supabase está acessível

Abra o console do navegador e execute:
```javascript
fetch('https://SEU-PROJETO.supabase.co/rest/v1/')
  .then(r => console.log('Status:', r.status))
  .catch(e => console.error('Erro:', e));
```

Se der erro, o problema é na conexão com o Supabase.

### Teste 2: Verificar Redirect URLs no Supabase

1. Acesse: https://supabase.com/dashboard
2. Vá em: **Authentication > URL Configuration**
3. Adicione em **Redirect URLs**:
```
http://localhost:5173/**
http://localhost:5173/auth/callback
https://seu-dominio.vercel.app/**
https://seu-dominio.vercel.app/auth/callback
```

### Teste 3: Verificar Políticas RLS

Execute no SQL Editor do Supabase:

```sql
-- Verificar se a tabela profiles existe
SELECT * FROM profiles LIMIT 1;

-- Verificar políticas
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Se não houver políticas, criar uma básica:
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver próprio perfil"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar próprio perfil"
ON profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Admins podem ver tudo"
ON profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

---

## 🐛 Problemas Específicos

### "Não consigo salvar clip"

**Causa**: Falta de permissão ou RLS bloqueando

**Solução**:
```sql
-- Execute no SQL Editor do Supabase
CREATE POLICY "Admins podem inserir clips"
ON clips FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins podem atualizar clips"
ON clips FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

### "Fica em loop entre /app e /login"

**Causa**: Sessão não está sendo persistida

**Solução**:
1. Verifique se cookies estão habilitados
2. Não use modo anônimo para testar
3. Limpe cookies do domínio:
   - DevTools > Application > Cookies
   - Delete todos os cookies do localhost

### "Página fica eternamente em 'Carregando...'"

**Causa**: `loading` do AuthContext não está sendo resetado

**Solução**:
1. Abra o console (F12)
2. Procure por logs `[AuthContext]`
3. Se não aparecer `setting loading to false`, há um problema
4. Execute:
```javascript
// Forçar reset do estado
localStorage.clear();
location.reload();
```

---

## 📱 Teste no Vercel (Produção)

### Antes de fazer deploy:

1. ✅ Testou localmente e funcionou
2. ✅ Configurou variáveis de ambiente no Vercel
3. ✅ Adicionou Redirect URLs no Supabase
4. ✅ Verificou políticas RLS

### Após deploy:

1. Abra o site em modo anônimo
2. Abra o console (F12)
3. Faça login
4. Verifique os logs `[AuthContext]`
5. Se houver erro, copie e analise

---

## 🆘 Última Tentativa

Se NADA funcionar:

1. **Crie um novo usuário no Supabase**:
   - Vá em Authentication > Users
   - Clique em "Add user"
   - Crie com email e senha
   - Marque "Auto Confirm User"

2. **Defina como admin manualmente**:
```sql
-- Execute no SQL Editor
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'seu-email@exemplo.com';
```

3. **Teste com esse novo usuário**

---

## 📞 Precisa de Ajuda?

Se ainda não funcionar, colete estas informações:

1. **Logs do console** (todos que começam com `[AuthContext]`)
2. **Resultado deste comando** (cole no console):
```javascript
console.log({
  url: import.meta.env.VITE_SUPABASE_URL,
  hasKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
  localStorage: Object.keys(localStorage).filter(k => k.includes('supabase')),
  path: window.location.pathname
});
```
3. **Versão do navegador**
4. **Está testando local ou no Vercel?**
