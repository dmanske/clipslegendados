import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(100, 'Nome muito longo')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),
  email: z.string()
    .trim()
    .min(1, 'Email é obrigatório')
    .email('Email inválido')
    .max(255, 'Email muito longo'),
  password: z.string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .max(100, 'Senha muito longa')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
});

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; general?: string }>({});
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supabase) {
      navigate('/app');
      return;
    }

    // Validar inputs
    const validationResult = registerSchema.safeParse({ name, email, password });
    
    if (!validationResult.success) {
      const fieldErrors: { name?: string; email?: string; password?: string } = {};
      validationResult.error.issues.forEach(err => {
        const field = err.path[0] as 'name' | 'email' | 'password';
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const redirectUrl = `${window.location.origin}/app`;
      
      const { error } = await supabase.auth.signUp({
        email: validationResult.data.email,
        password: validationResult.data.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: validationResult.data.name,
          },
        },
      });

      if (error) {
        // Mensagens de erro mais amigáveis
        if (error.message.includes('User already registered')) {
          setErrors({ general: 'Este email já está cadastrado. Tente fazer login.' });
        } else if (error.message.includes('Password should be')) {
          setErrors({ password: 'A senha não atende aos requisitos mínimos de segurança' });
        } else {
          setErrors({ general: error.message });
        }
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setErrors({ general: 'Erro inesperado ao criar conta. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#101922] p-4 font-display">
        <div className="w-full max-w-md bg-[#111a22] border border-[#324d67] rounded-2xl p-8 shadow-2xl text-center">
          <div className="inline-flex items-center justify-center size-20 rounded-full bg-green-500/10 text-green-500 mb-6">
            <span className="material-symbols-outlined text-5xl">check_circle</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Cadastro realizado!</h1>
          <p className="text-[#92adc9] mb-2">
            Sua conta foi criada com sucesso.
          </p>
          <p className="text-[#92adc9] text-sm">
            Você será redirecionado para a página de login em instantes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#101922] p-4 font-display">
      <div className="w-full max-w-md bg-[#111a22] border border-[#324d67] rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary mb-4">
            <span className="material-symbols-outlined text-3xl">person_add</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Crie sua Conta</h1>
          <p className="text-[#92adc9] mt-2">Junte-se à comunidade Letra na Tela</p>
        </div>

        {errors.general && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">error</span>
            {errors.general}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nome Completo</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#92adc9] text-xl">person</span>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors({ ...errors, name: undefined, general: undefined });
                }}
                className={`w-full h-11 bg-[#233648] border ${errors.name ? 'border-red-500' : 'border-[#324d67]'} rounded-lg pl-10 pr-4 text-white focus:ring-primary focus:border-primary transition-all`}
                placeholder="João Silva"
                maxLength={100}
              />
            </div>
            {errors.name && (
              <p className="text-red-400 text-xs mt-1 ml-1">{errors.name}</p>
            )}
          </div>

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
                placeholder="Mínimo 6 caracteres"
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
            <p className="text-gray-500 text-xs mt-1 ml-1">
              A senha deve ter: maiúscula, minúscula e número
            </p>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg mt-2 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span> : 'Criar Conta'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-[#324d67] pt-6">
          <p className="text-[#92adc9] text-sm">
            Já tem uma conta? <Link to="/login" className="text-primary font-bold hover:underline">Fazer Login</Link>
          </p>
          <div className="mt-4">
            <Link to="/" className="text-sm text-gray-500 hover:text-white">Voltar para o início</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
