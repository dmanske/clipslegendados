# Login com Instagram - Implementação Simples

## 🎯 O que você precisa

1. ✅ Usuário faz login com Instagram
2. ✅ Usuário comenta nos seus clips (no seu site)
3. ✅ Usuário compartilha seus clips nas redes sociais

## 🔧 Configuração Rápida

### Passo 1: Criar App no Meta

1. Acesse https://developers.facebook.com /apps
2. Clique em "Create App" → "Consumer"
3. Adicione o produto **"Instagram Basic Display"**
4. Configure:
   - **Valid OAuth Redirect URIs**: `http://localhost:5173/auth/instagram/callback`
   - **Deauthorize**: `http://localhost:5173/auth/instagram/deauthorize`
   - **Data Deletion**: `http://localhost:5173/auth/instagram/delete`

5. Copie:
   - Instagram App ID
   - Instagram App Secret

### Passo 2: Adicionar ao .env

```env
VITE_INSTAGRAM_APP_ID=seu-app-id
VITE_INSTAGRAM_APP_SECRET=seu-app-secret
VITE_INSTAGRAM_REDIRECT_URI=http://localhost:5173/auth/instagram/callback
```

## 💻 Código

### 1. Serviço Instagram (services/instagramAuth.ts)

```typescript
const INSTAGRAM_APP_ID = import.meta.env.VITE_INSTAGRAM_APP_ID;
const REDIRECT_URI = import.meta.env.VITE_INSTAGRAM_REDIRECT_URI;

export const instagramAuth = {
  // Iniciar login
  login() {
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_APP_ID}&redirect_uri=${REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
    window.location.href = authUrl;
  },

  // Processar callback (chamar no backend ou serverless)
  async handleCallback(code: string) {
    // Esta parte precisa rodar no backend por segurança
    // Vou mostrar como fazer com Supabase Edge Function
    const response = await fetch('/api/instagram/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    
    return response.json();
  }
};
```

### 2. Botão de Login (components/auth/InstagramLoginButton.tsx)

```typescript
import React from 'react';
import { instagramAuth } from '../../services/instagramAuth';

export const InstagramLoginButton: React.FC = () => {
  return (
    <button
      onClick={() => instagramAuth.login()}
      className="flex items-center justify-center gap-3 w-full px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
    >
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
      Entrar com Instagram
    </button>
  );
};
```

### 3. Página de Callback (pages/auth/InstagramCallback.tsx)

```typescript
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../services/supabase';

export const InstagramCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processando...');

  useEffect(() => {
    const processAuth = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        setStatus('Login cancelado');
        setTimeout(() => navigate('/'), 2000);
        return;
      }

      if (!code) {
        setStatus('Erro: código não encontrado');
        return;
      }

      try {
        // Chamar sua Edge Function do Supabase
        const { data, error: authError } = await supabase.functions.invoke('instagram-auth', {
          body: { code }
        });

        if (authError) throw authError;

        // Fazer login no Supabase com os dados do Instagram
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.instagram_id
        });

        if (signInError) {
          // Se não existe, criar conta
          const { error: signUpError } = await supabase.auth.signUp({
            email: data.email,
            password: data.instagram_id,
            options: {
              data: {
                username: data.username,
                avatar_url: data.profile_picture,
                provider: 'instagram',
                instagram_id: data.instagram_id
              }
            }
          });

          if (signUpError) throw signUpError;
        }

        setStatus('Login realizado! Redirecionando...');
        setTimeout(() => navigate('/'), 1000);

      } catch (err) {
        console.error('Erro:', err);
        setStatus('Erro ao processar login');
      }
    };

    processAuth();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
        <p className="text-lg text-gray-700">{status}</p>
      </div>
    </div>
  );
};
```

### 4. Botão de Compartilhar (components/share/ShareButton.tsx)

```typescript
import React, { useState } from 'react';

interface ShareButtonProps {
  clipId: string;
  title: string;
  description?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ clipId, title, description }) => {
  const [showMenu, setShowMenu] = useState(false);
  
  const shareUrl = `${window.location.origin}/clip/${clipId}`;
  const shareText = `${title}${description ? ' - ' + description : ''}`;

  const shareOptions = [
    {
      name: 'Instagram',
      icon: '📷',
      action: () => {
        // Instagram não permite compartilhamento direto
        // Copia o link e abre o Instagram
        navigator.clipboard.writeText(shareUrl);
        alert('Link copiado! Cole no Instagram Stories ou Feed');
        window.open('https://www.instagram.com/', '_blank');
      }
    },
    {
      name: 'WhatsApp',
      icon: '💬',
      action: () => {
        const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        window.open(url, '_blank');
      }
    },
    {
      name: 'Facebook',
      icon: '👥',
      action: () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank', 'width=600,height=400');
      }
    },
    {
      name: 'Twitter',
      icon: '🐦',
      action: () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank', 'width=600,height=400');
      }
    },
    {
      name: 'Copiar Link',
      icon: '🔗',
      action: () => {
        navigator.clipboard.writeText(shareUrl);
        alert('Link copiado!');
        setShowMenu(false);
      }
    }
  ];

  // Usar Web Share API se disponível (mobile)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: shareText,
          url: shareUrl
        });
      } catch (err) {
        console.log('Compartilhamento cancelado');
      }
    } else {
      setShowMenu(!showMenu);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Compartilhar
      </button>

      {showMenu && (
        <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[200px] z-50">
          {shareOptions.map((option) => (
            <button
              key={option.name}
              onClick={option.action}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 transition"
            >
              <span className="text-2xl">{option.icon}</span>
              <span className="text-gray-700">{option.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
```

## 🔐 Edge Function do Supabase

Crie `supabase/functions/instagram-auth/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const INSTAGRAM_APP_ID = Deno.env.get('INSTAGRAM_APP_ID')!
const INSTAGRAM_APP_SECRET = Deno.env.get('INSTAGRAM_APP_SECRET')!
const REDIRECT_URI = Deno.env.get('INSTAGRAM_REDIRECT_URI')!

serve(async (req) => {
  const { code } = await req.json()

  try {
    // 1. Trocar código por token
    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: INSTAGRAM_APP_ID,
        client_secret: INSTAGRAM_APP_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        code: code
      })
    })

    const tokenData = await tokenResponse.json()

    // 2. Obter dados do usuário
    const userResponse = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${tokenData.access_token}`
    )

    const userData = await userResponse.json()

    // 3. Retornar dados para criar conta
    return new Response(
      JSON.stringify({
        instagram_id: userData.id,
        username: userData.username,
        email: `${userData.username}@instagram.local`, // Email fictício
        access_token: tokenData.access_token
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

## 📝 Sistema de Comentários (já no seu site)

Seus comentários já funcionam com Supabase! Só precisa adicionar o botão de login do Instagram na página de login existente.

## 🚀 Como Usar

1. **Adicione o botão de login** na sua página de autenticação
2. **Adicione a rota de callback** no App.tsx
3. **Deploy da Edge Function** no Supabase
4. **Configure as variáveis** no Supabase Dashboard

## ✅ Resultado Final

- ✅ Usuário clica em "Entrar com Instagram"
- ✅ Faz login no Instagram
- ✅ Volta pro seu site já logado
- ✅ Pode comentar nos clips (usando seu sistema atual)
- ✅ Pode compartilhar clips (WhatsApp, Facebook, Twitter, copiar link)
- ✅ Para Instagram: copia o link automaticamente

**Tudo 100% gratuito!** 🎉
