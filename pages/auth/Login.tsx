import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string()
    .trim()
    .min(1, 'Email é obrigatório')
    .email('Email inválido')
    .max(255, 'Email muito longo'),
  password: z.string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .max(100, 'Senha muito longa')
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supabase) {
      navigate('/app');
      return;
    }

    // Previne múltiplos submits
    if (loading) {
      console.log('[Login] Already logging in, ignoring duplicate submit');
      return;
    }

    // Validar inputs
    const validationResult = loginSchema.safeParse({ email, password });
    
    if (!validationResult.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      validationResult.error.issues.forEach(err => {
        const field = err.path[0] as 'email' | 'password';
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    console.log('[Login] Starting login process...');
    setLoading(true);
    setErrors({});

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: validationResult.data.email,
        password: validationResult.data.password,
      });

      if (error) {
        console.error('[Login] Login error:', error);
        // Mensagens de erro mais amigáveis
        if (error.message.includes('Invalid login credentials')) {
          setErrors({ general: 'Email ou senha incorretos' });
        } else if (error.message.includes('Email not confirmed')) {
          setErrors({ general: 'Por favor, confirme seu email antes de fazer login' });
        } else {
          setErrors({ general: error.message });
        }
        setLoading(false);
        return;
      }

      console.log('[Login] Login successful, waiting before navigation...');
      // Aguarda um pouco para o AuthContext processar a sessão
      setTimeout(() => {
        navigate('/app', { replace: true });
      }, 300);
    } catch (err: any) {
      console.error('[Login] Unexpected error:', err);
      setErrors({ general: 'Erro inesperado ao fazer login. Tente novamente.' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#101922] p-4 font-display">
      <div className="w-full max-w-md bg-[#111a22] border border-[#324d67] rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary mb-4">
            <span className="material-symbols-outlined text-3xl">lock</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Bem-vindo de volta</h1>
          <p className="text-[#92adc9] mt-2">Entre para acessar o acervo</p>
        </div>

        {errors.general && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">error</span>
            {errors.general}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#92adc9] text-xl">mail</span>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({ ...errors, email: undefined, general: undefined });
                }}
                className={`w-full h-11 bg-[#233648] border ${errors.email ? 'border-red-500' : 'border-[#324d67]'} rounded-lg pl-10 pr-4 text-white focus:ring-primary focus:border-primary transition-all`}
                placeholder="seu@email.com"
                maxLength={255}
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Senha</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#92adc9] text-xl">key</span>
              <input 
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: undefined, general: undefined });
                }}
                className={`w-full h-11 bg-[#233648] border ${errors.password ? 'border-red-500' : 'border-[#324d67]'} rounded-lg pl-10 pr-12 text-white focus:ring-primary focus:border-primary transition-all`}
                placeholder="••••••••"
                maxLength={100}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#92adc9] hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-xl">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1 ml-1">{errors.password}</p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg mt-2 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span> : 'Entrar'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-[#324d67] pt-6">
          <p className="text-[#92adc9] text-sm">
            Ainda não tem uma conta? <Link to="/register" className="text-primary font-bold hover:underline">Cadastre-se</Link>
          </p>
          <div className="mt-4">
            <Link to="/" className="text-sm text-gray-500 hover:text-white">Voltar para o início</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
