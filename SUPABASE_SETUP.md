
# Guia de Configuração do Supabase - Letra na Tela

Este guia explica passo a passo como configurar seu projeto no Supabase para suportar o sistema de vídeos, comentários, autenticação e notificações em tempo real.

## 1. Criar Projeto
Acesse [supabase.com](https://supabase.com), crie uma conta e um novo projeto.

## 2. Configurar Banco de Dados (SQL Editor)
No painel do Supabase, vá para o menu **SQL Editor**, clique em "New Query" e cole o seguinte código para criar a estrutura completa:

```sql
-- 1. Tabela de Perfis (Estende a tabela auth.users padrão do Supabase)
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  email text,
  role text default 'user', -- 'admin' ou 'user'
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (id)
);

-- 2. Habilitar Row Level Security (Segurança)
alter table public.profiles enable row level security;

-- 3. Política de Acesso aos Perfis
-- Qualquer um pode ler perfis (necessário para mostrar avatar nos comentários)
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

-- Usuários só podem editar seu próprio perfil
create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- 4. Trigger para criar perfil automaticamente ao se cadastrar
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name', 'user');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. Tabela de Clipes (Se ainda não criou)
create table if not exists public.clips (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  artist text,
  description text,
  tags text[],
  video_url text,
  thumbnail_url text,
  status text default 'Draft', -- 'Published', 'Draft'
  views numeric default 0,
  subtitles_json jsonb,
  release_year int, -- Novo campo para permitir busca por ano
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 6. Tabela de Comentários
create table if not exists public.comments (
  id uuid default gen_random_uuid() primary key,
  clip_id uuid references public.clips(id) on delete cascade,
  user_id uuid references auth.users(id), -- Link opcional com usuário logado
  user_name text,
  user_email text,
  content text,
  rating int,
  status text default 'pending', -- 'pending', 'approved', 'rejected'
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 7. Habilitar Realtime para Notificações
-- Isso é essencial para que os usuários recebam a notificação quando um clipe for publicado.
-- No painel do Supabase, vá em Replication e habilite para a tabela 'clips', ou rode:
alter publication supabase_realtime add table clips;

-- 8. Otimização de Busca (Search)
-- Instala a extensão pg_trgm para permitir buscas "fuzzy" (aproximadas)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Cria índices para deixar a busca por Título, Artista e Descrição super rápida
CREATE INDEX IF NOT EXISTS clips_title_trgm_idx ON public.clips USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS clips_artist_trgm_idx ON public.clips USING gin (artist gin_trgm_ops);
CREATE INDEX IF NOT EXISTS clips_desc_trgm_idx ON public.clips USING gin (description gin_trgm_ops);

-- 9. Storage (Buckets)
-- Você precisa criar dois buckets no menu "Storage" do painel:
-- Nome: "videos" (Público)
-- Nome: "thumbnails" (Público)
```

## 3. Como criar um ADMIN
Por padrão, todo mundo que se cadastra é 'user'. Para tornar alguém (você) administrador:

1. Cadastre-se no site normalmente.
2. Vá no **Table Editor** do Supabase.
3. Abra a tabela `profiles`.
4. Encontre seu usuário e mude a coluna `role` de `user` para `admin`.
5. Salve. Agora você tem acesso ao painel `/admin`.

## 4. Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto (se rodar local) ou configure na Vercel:

```
VITE_SUPABASE_URL=sua_url_do_projeto_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon_publica
```
