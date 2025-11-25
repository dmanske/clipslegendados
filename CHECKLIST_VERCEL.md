# Checklist - Deploy no Vercel

## ✅ Antes de fazer Deploy

### 1. Variáveis de Ambiente no Vercel
Acesse: `Settings > Environment Variables`

Adicione estas variáveis:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com (se usar Google OAuth)
VITE_GEMINI_API_KEY=xxxxx (se usar IA)
```

**Importante**: Marque para aplicar em `Production`, `Preview` e `Development`

### 2. Configuração do Supabase
Acesse: Supabase Dashboard > Authentication > URL Configuration

**Site URL**:
```
https://seu-app.vercel.app
```

**Redirect URLs** (adicione todas):
```
https://seu-app.vercel.app/**
https://seu-app.vercel.app/auth/callback
http://localhost:5173/**
http://localhost:5173/auth/callback
```

### 3. Configuração de Email (Supabase)
Acesse: Supabase Dashboard > Authentication > Email Templates

Atualize os links nos templates de email para:
```
{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email
```

## 🔍 Após Deploy - Testes

### Teste 1: Autenticação
- [ ] Acesse o site no Vercel
- [ ] Faça login com um usuário existente
- [ ] Verifique se não há loops de redirecionamento
- [ ] Navegue entre páginas
- [ ] Recarregue a página (F5)
- [ ] Sessão deve ser mantida

### Teste 2: Registro
- [ ] Acesse `/register`
- [ ] Crie uma nova conta
- [ ] Verifique email de confirmação
- [ ] Confirme email
- [ ] Faça login

### Teste 3: Admin
- [ ] Faça login como admin
- [ ] Acesse `/admin`
- [ ] Crie um novo clip
- [ ] Publique o clip
- [ ] Verifique se não há loops

### Teste 4: Logout
- [ ] Faça logout
- [ ] Deve redirecionar para landing page
- [ ] Tente acessar `/app` - deve redirecionar para login
- [ ] Tente acessar `/admin` - deve redirecionar para login

## 🐛 Problemas Comuns

### Loop Infinito de Redirecionamento
**Causa**: Variáveis de ambiente não configuradas ou URL do Supabase incorreta

**Solução**:
1. Verifique variáveis no Vercel
2. Faça redeploy após adicionar variáveis
3. Limpe cache do navegador

### Sessão não persiste após reload
**Causa**: Configuração de cookies ou CORS

**Solução**:
1. Verifique Redirect URLs no Supabase
2. Certifique-se que `persistSession: true` está configurado
3. Verifique se não há bloqueio de cookies de terceiros

### Erro "Invalid JWT"
**Causa**: Token expirado ou chave incorreta

**Solução**:
1. Verifique se `VITE_SUPABASE_ANON_KEY` está correta
2. Limpe localStorage do navegador
3. Faça login novamente

### Erro ao publicar clips
**Causa**: Políticas RLS do Supabase ou permissões

**Solução**:
1. Verifique políticas RLS na tabela `clips`
2. Certifique-se que o usuário tem role `admin`
3. Verifique logs do Supabase

## 📊 Monitoramento

### Logs do Vercel
Acesse: `Deployments > [seu deploy] > Logs`

Procure por:
- Erros de build
- Avisos sobre variáveis de ambiente
- Erros de runtime

### Logs do Supabase
Acesse: Supabase Dashboard > Logs

Procure por:
- Erros de autenticação
- Erros de RLS (Row Level Security)
- Queries lentas

## 🚀 Otimizações Pós-Deploy

1. **Cache de Assets**
   - Vercel já faz isso automaticamente
   - Verifique em `Network` tab do DevTools

2. **Compressão**
   - Vercel usa Brotli/Gzip automaticamente

3. **Analytics**
   - Considere adicionar Vercel Analytics
   - Ou Google Analytics

4. **Monitoring**
   - Configure alertas no Supabase
   - Configure alertas no Vercel

## 📝 Comandos Úteis

### Testar build localmente
```bash
npm run build
npm run preview
```

### Limpar cache do Vercel
```bash
vercel --prod --force
```

### Ver logs em tempo real
```bash
vercel logs [deployment-url] --follow
```
