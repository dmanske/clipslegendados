# 🧪 Teste das Páginas de Pedidos

## ✅ Correções Aplicadas

Adicionei logs detalhados nas duas páginas de pedidos:
- `pages/public/Request.tsx` (Contribuir com Legendas)
- `pages/public/TranslationRequest.tsx` (Solicitar Tradução)

## 🔍 Como Testar

### 1. Abra o Console do Navegador
Pressione **F12** e vá na aba **Console**

### 2. Teste a Página "Solicitar Tradução"

1. Acesse: http://localhost:8081/app/translation-request
2. Preencha o formulário:
   - Link do YouTube: `https://youtube.com/watch?v=dQw4w9WgXcQ`
   - Seu Nome: `Teste`
   - Seu Email: `teste@teste.com`
   - Mensagem: `Teste de pedido`
3. Clique em **"Enviar Pedido"**
4. Observe o console - deve aparecer:
   ```
   [TranslationRequest] handleSubmit called
   [TranslationRequest] Starting submission...
   [TranslationRequest] Supabase configured, inserting data...
   [TranslationRequest] Insert result: { data: [...], error: null }
   [TranslationRequest] Successfully saved to Supabase
   [TranslationRequest] Showing success message
   [TranslationRequest] Setting isSubmitting to false
   ```
5. Deve aparecer mensagem de sucesso verde na tela

### 3. Teste a Página "Contribuir com Legendas"

1. Acesse: http://localhost:8081/app/request
2. Preencha o formulário:
   - Link do YouTube: `https://youtube.com/watch?v=dQw4w9WgXcQ`
   - Arquivo SRT: Clique e selecione um arquivo .srt (ou crie um teste)
   - Seu Nome: `Teste`
   - Seu Email: `teste@teste.com`
   - Observações: `Teste de envio`
3. Clique em **"Enviar Legenda"**
4. Observe o console - deve aparecer:
   ```
   [Request] handleSubmit called
   [Request] Starting submission...
   [Request] Reading SRT file...
   [Request] SRT content length: XXX
   [Request] Supabase configured, inserting data...
   [Request] Insert result: { data: [...], error: null }
   [Request] Successfully saved to Supabase
   [Request] Showing success message
   [Request] Setting isSubmitting to false
   ```
5. Deve aparecer mensagem de sucesso verde na tela

## 📝 Criar Arquivo SRT de Teste

Se não tiver um arquivo .srt, crie um arquivo chamado `teste.srt` com este conteúdo:

```
1
00:00:10,240 --> 00:00:12,800
Primeira linha da legenda

2
00:00:13,500 --> 00:00:16,120
Segunda linha da legenda

3
00:00:17,000 --> 00:00:19,500
Terceira linha da legenda
```

## 🐛 Possíveis Problemas

### Problema 1: Botão não faz nada
**Sintomas**: Clica no botão mas nada acontece

**Verificar no console**:
- Se aparecer `[TranslationRequest] handleSubmit called` ou `[Request] handleSubmit called`
- Se NÃO aparecer, o problema é no evento do formulário

**Solução**:
1. Verifique se está logado (precisa estar autenticado)
2. Recarregue a página (F5)
3. Limpe o cache: `localStorage.clear()` no console

### Problema 2: Erro ao enviar
**Sintomas**: Aparece mensagem de erro

**Verificar no console**:
- Procure por `[TranslationRequest] Supabase error:` ou `[Request] Supabase error:`
- Copie a mensagem de erro completa

**Possíveis causas**:
1. **Erro de permissão (RLS)**: Você não tem permissão para inserir dados
2. **Erro de validação**: Algum campo está com formato inválido
3. **Erro de conexão**: Problema com o Supabase

**Solução para erro de permissão**:
Execute no SQL Editor do Supabase:

```sql
-- Permitir que usuários autenticados enviem pedidos de tradução
CREATE POLICY "Usuários podem criar pedidos de tradução"
ON translation_requests FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Permitir que usuários autenticados enviem legendas
CREATE POLICY "Usuários podem enviar legendas"
ON subtitle_submissions FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);
```

### Problema 3: Botão fica em "Enviando..." eternamente
**Sintomas**: Botão fica travado em "Enviando..."

**Verificar no console**:
- Se aparece `[TranslationRequest] Setting isSubmitting to false` ou `[Request] Setting isSubmitting to false`
- Se NÃO aparecer, há um erro que não está sendo capturado

**Solução**:
1. Recarregue a página (F5)
2. Verifique se há erros no console
3. Tente novamente

## ✅ Resultado Esperado

Após clicar em "Enviar":
1. ✅ Botão muda para "Enviando..." com spinner
2. ✅ Logs aparecem no console
3. ✅ Mensagem de sucesso verde aparece na tela
4. ✅ Formulário é limpo
5. ✅ Botão volta ao estado normal

## 📊 Verificar no Supabase

Para confirmar que os dados foram salvos:

1. Acesse: https://supabase.com/dashboard
2. Vá no seu projeto
3. Clique em "Table Editor"
4. Selecione a tabela:
   - `translation_requests` (para pedidos de tradução)
   - `subtitle_submissions` (para envio de legendas)
5. Deve aparecer o registro que você acabou de criar

## 🆘 Se Nada Funcionar

1. **Copie todos os logs do console** que começam com `[TranslationRequest]` ou `[Request]`
2. **Tire um print da tela** mostrando o erro
3. **Verifique se está logado** - precisa estar autenticado para enviar
4. **Teste em modo anônimo** do navegador para descartar problemas de cache

---

**Última atualização**: Logs de debug adicionados para facilitar identificação de problemas! 🔍
