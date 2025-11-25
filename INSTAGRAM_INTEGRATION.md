# Integração com Instagram

## 📋 Pré-requisitos

1. Conta no [Meta for Developers](https://developers.facebook.com/)
2. App criado no Meta for Developers
3. Conta Instagram Business ou Creator (para comentários e posts)
4. Domínio verificado (para produção)

## 🔧 Configuração Inicial

### Passo 1: Criar App no Meta for Developers

1. Acesse https://developers.facebook.com/apps
2. Clique em "Create App"
3. Escolha o tipo: "Consumer" ou "Business"
4. Preencha os dados do app
5. Adicione os produtos:
   - **Instagram Basic Display** (para login básico)
   - **Instagram Graph API** (para comentários e posts)
   - **Facebook Login** (alternativa mais robusta)

### Passo 2: Configurar Instagram Basic Display

1. No painel do app, vá em "Instagram Basic Display"
2. Clique em "Create New App"
3. Configure as URLs:
   - **Valid OAuth Redirect URIs**: 
     - `http://localhost:5173/auth/instagram/callback` (desenvolvimento)
     - `https://seudominio.com/auth/instagram/callback` (produção)
   - **Deauthorize Callback URL**: `https://seudominio.com/auth/instagram/deauthorize`
   - **Data Deletion Request URL**: `https://seudominio.com/auth/instagram/delete`

4. Salve e copie:
   - Instagram App ID
   - Instagram App Secret
   - Client OAuth Token

### Passo 3: Configurar Instagram Graph API (para comentários)

1. No painel do app, vá em "Instagram Graph API"
2. Configure permissões:
   - `instagram_basic`
   - `instagram_manage_comments`
   - `instagram_manage_insights`
   - `pages_show_list`
   - `pages_read_engagement`

3. Conecte sua página do Facebook à conta Instagram Business

## 🔐 Variáveis de Ambiente

Adicione ao seu `.env`:

```env
# Instagram Configuration
VITE_INSTAGRAM_APP_ID=seu-instagram-app-id
VITE_INSTAGRAM_APP_SECRET=seu-instagram-app-secret
VITE_INSTAGRAM_REDIRECT_URI=http://localhost:5173/auth/instagram/callback

# Para produção
# VITE_INSTAGRAM_REDIRECT_URI=https://seudominio.com/auth/instagram/callback
```

## 💻 Implementação

### 1. Instalar Dependências

```bash
npm install axios
```

### 2. Criar Serviço de Instagram

Crie o arquivo `services/instagramService.ts`:

```typescript
import axios from 'axios';

const INSTAGRAM_APP_ID = import.meta.env.VITE_INSTAGRAM_APP_ID;
const INSTAGRAM_APP_SECRET = import.meta.env.VITE_INSTAGRAM_APP_SECRET;
const REDIRECT_URI = import.meta.env.VITE_INSTAGRAM_REDIRECT_URI;

export class InstagramService {
  // 1. LOGIN - Gerar URL de autenticação
  static getAuthUrl(): string {
    const scope = 'user_profile,user_media';
    return `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_APP_ID}&redirect_uri=${REDIRECT_URI}&scope=${scope}&response_type=code`;
  }

  // 2. LOGIN - Trocar código por token
  static async getAccessToken(code: string) {
    try {
      const response = await axios.post('https://api.instagram.com/oauth/access_token', {
        client_id: INSTAGRAM_APP_ID,
        client_secret: INSTAGRAM_APP_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        code: code
      }, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      return response.data; // { access_token, user_id }
    } catch (error) {
      console.error('Erro ao obter token:', error);
      throw error;
    }
  }

  // 3. LOGIN - Obter token de longa duração
  static async getLongLivedToken(shortLivedToken: string) {
    try {
      const response = await axios.get('https://graph.instagram.com/access_token', {
        params: {
          grant_type: 'ig_exchange_token',
          client_secret: INSTAGRAM_APP_SECRET,
          access_token: shortLivedToken
        }
      });

      return response.data; // { access_token, token_type, expires_in }
    } catch (error) {
      console.error('Erro ao obter token de longa duração:', error);
      throw error;
    }
  }

  // 4. PERFIL - Obter dados do usuário
  static async getUserProfile(accessToken: string) {
    try {
      const response = await axios.get(`https://graph.instagram.com/me`, {
        params: {
          fields: 'id,username,account_type,media_count',
          access_token: accessToken
        }
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao obter perfil:', error);
      throw error;
    }
  }

  // 5. COMENTÁRIOS - Obter comentários de uma mídia (requer Graph API)
  static async getMediaComments(mediaId: string, accessToken: string) {
    try {
      const response = await axios.get(
        `https://graph.instagram.com/${mediaId}/comments`,
        {
          params: {
            fields: 'id,text,username,timestamp',
            access_token: accessToken
          }
        }
      );

      return response.data.data;
    } catch (error) {
      console.error('Erro ao obter comentários:', error);
      throw error;
    }
  }

  // 6. COMENTÁRIOS - Responder a um comentário
  static async replyToComment(commentId: string, message: string, accessToken: string) {
    try {
      const response = await axios.post(
        `https://graph.instagram.com/${commentId}/replies`,
        {
          message: message,
          access_token: accessToken
        }
      );

      return response.data;
    } catch (error) {
      console.error('Erro ao responder comentário:', error);
      throw error;
    }
  }

  // 7. COMPARTILHAMENTO - Gerar deep link para compartilhar
  static getShareUrl(url: string, caption?: string): string {
    // Instagram não permite compartilhamento direto via API
    // Usa deep link para abrir o app
    const encodedUrl = encodeURIComponent(url);
    return `instagram://library?AssetPath=${encodedUrl}`;
  }

  // 8. COMPARTILHAMENTO - Fallback para web
  static openInstagramShare(url: string) {
    // Tenta abrir o app, se falhar abre o Instagram web
    const deepLink = this.getShareUrl(url);
    const webFallback = 'https://www.instagram.com/';
    
    window.location.href = deepLink;
    
    // Fallback após 2 segundos
    setTimeout(() => {
      window.open(webFallback, '_blank');
    }, 2000);
  }
}
```

### 3. Criar Componente de Login

Crie `components/auth/InstagramLogin.tsx`:

```typescript
import React from 'react';
import { InstagramService } from '../../services/instagramService';

export const InstagramLogin: React.FC = () => {
  const handleLogin = () => {
    const authUrl = InstagramService.getAuthUrl();
    window.location.href = authUrl;
  };

  return (
    <button
      onClick={handleLogin}
      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-lg hover:opacity-90 transition"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
      Entrar com Instagram
    </button>
  );
};
```

### 4. Criar Página de Callback

Crie `pages/auth/InstagramCallback.tsx`:

```typescript
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { InstagramService } from '../../services/instagramService';
import { supabase } from '../../services/supabase';

export const InstagramCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        setError('Autenticação cancelada');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      if (!code) {
        setError('Código de autenticação não encontrado');
        return;
      }

      try {
        // 1. Trocar código por token
        const tokenData = await InstagramService.getAccessToken(code);
        
        // 2. Obter token de longa duração
        const longLivedToken = await InstagramService.getLongLivedToken(
          tokenData.access_token
        );

        // 3. Obter dados do perfil
        const profile = await InstagramService.getUserProfile(
          longLivedToken.access_token
        );

        // 4. Salvar no Supabase
        const { data: user, error: authError } = await supabase.auth.signInWithPassword({
          email: `${profile.username}@instagram.local`,
          password: profile.id // Você deve gerar uma senha segura
        });

        if (authError) {
          // Se não existe, criar conta
          const { error: signUpError } = await supabase.auth.signUp({
            email: `${profile.username}@instagram.local`,
            password: profile.id,
            options: {
              data: {
                username: profile.username,
                provider: 'instagram',
                instagram_id: profile.id,
                instagram_token: longLivedToken.access_token
              }
            }
          });

          if (signUpError) throw signUpError;
        }

        // 5. Redirecionar
        navigate('/');
      } catch (err) {
        console.error('Erro no callback:', err);
        setError('Erro ao processar autenticação');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => navigate('/')} className="text-blue-500">
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p>Processando autenticação...</p>
      </div>
    </div>
  );
};
```

### 5. Componente de Compartilhamento

Crie `components/share/InstagramShare.tsx`:

```typescript
import React from 'react';
import { InstagramService } from '../../services/instagramService';

interface InstagramShareProps {
  url: string;
  title?: string;
}

export const InstagramShare: React.FC<InstagramShareProps> = ({ url, title }) => {
  const handleShare = () => {
    // Método 1: Deep Link (abre o app)
    InstagramService.openInstagramShare(url);
    
    // Método 2: Web Share API (se disponível)
    if (navigator.share) {
      navigator.share({
        title: title || 'Confira este clip',
        url: url
      }).catch(err => console.log('Erro ao compartilhar:', err));
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
      Compartilhar no Instagram
    </button>
  );
};
```

## 🔄 Atualizar Rotas

Adicione no seu `App.tsx` ou arquivo de rotas:

```typescript
import { InstagramCallback } from './pages/auth/InstagramCallback';

// Adicione a rota
<Route path="/auth/instagram/callback" element={<InstagramCallback />} />
```

## ⚠️ Limitações e Considerações

### Instagram Basic Display API
- ✅ Login e autenticação
- ✅ Acesso a perfil básico
- ✅ Acesso a mídias do usuário
- ❌ Não permite postar conteúdo
- ❌ Não permite comentar

### Instagram Graph API
- ✅ Gerenciar comentários (apenas contas Business/Creator)
- ✅ Publicar conteúdo
- ✅ Insights e métricas
- ⚠️ Requer conta Business/Creator conectada a página Facebook
- ⚠️ Processo de aprovação mais rigoroso

### Compartilhamento
- ⚠️ Instagram não tem API oficial de compartilhamento
- ✅ Pode usar deep links para abrir o app
- ✅ Pode usar Web Share API do navegador
- ❌ Não pode compartilhar diretamente via código

## 🚀 Próximos Passos

1. **Desenvolvimento**:
   - Testar com contas de teste do Instagram
   - Implementar refresh de tokens
   - Adicionar tratamento de erros robusto

2. **Produção**:
   - Submeter app para revisão do Meta
   - Configurar webhooks para notificações
   - Implementar rate limiting

3. **Melhorias**:
   - Cache de tokens
   - Sincronização de comentários em tempo real
   - Analytics de compartilhamentos

## 📚 Recursos

- [Instagram Basic Display API](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)
- [Meta for Developers](https://developers.facebook.com/)
