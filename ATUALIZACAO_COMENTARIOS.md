# Atualização do Sistema de Comentários

## Mudanças Implementadas

### 1. Sistema de Respostas (Threading)
- Agora os usuários podem responder a comentários específicos
- As respostas são exibidas de forma hierárquica abaixo do comentário pai
- Interface intuitiva com botão "Responder" em cada comentário

### 2. Exclusão de Comentários (Admin)
- Apenas administradores podem deletar comentários
- Botão "Deletar" aparece apenas para usuários com role 'admin'
- Confirmação antes de deletar

### 3. Filtro de Comentários Aprovados
- Apenas comentários com status 'approved' são exibidos
- Comentários pendentes ficam ocultos até aprovação

## Atualização Necessária no Banco de Dados

Execute o seguinte SQL no Supabase para adicionar o campo `parent_id` à tabela de comentários:

```sql
-- Adicionar coluna parent_id para suportar respostas
ALTER TABLE public.comments 
ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.comments(id) ON DELETE CASCADE;

-- Criar índice para melhorar performance de queries
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_clip_id_status ON public.comments(clip_id, status);

-- Comentários:
-- parent_id: Se NULL, é um comentário principal. Se preenchido, é uma resposta ao comentário com esse ID.
-- ON DELETE CASCADE: Se um comentário pai for deletado, todas as respostas também serão deletadas automaticamente.
```

## Como Usar

### Para Usuários Comuns:
1. **Comentar**: Digite seu comentário no formulário principal e clique em "Publicar"
2. **Responder**: Clique em "Responder" abaixo de qualquer comentário, escreva sua resposta e clique em "Responder"
3. **Cancelar Resposta**: Clique em "Cancelar" para fechar o formulário de resposta

### Para Administradores:
1. **Deletar Comentários**: Clique em "Deletar" ao lado de qualquer comentário (principal ou resposta)
2. **Moderação**: Use o painel admin em `/admin/comments` para aprovar/rejeitar comentários pendentes

## Estrutura de Dados

```typescript
interface CommentData {
  id: string;
  user_name: string;
  user_id?: string;
  created_at: string;
  content: string;
  rating: number;
  parent_id?: string | null;  // NOVO: ID do comentário pai (null para comentários principais)
}
```

## Notas Importantes

- As respostas são exibidas com uma borda lateral para indicar hierarquia
- Comentários principais têm avatar roxo, respostas têm avatar azul
- O sistema verifica automaticamente se o usuário é admin através do campo `profile.roles`
- Todos os comentários são criados com status 'approved' por padrão (pode ser alterado para 'pending' se desejar moderação)
