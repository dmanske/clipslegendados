import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
        // Modo Demo
        navigate('/app');
        return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/app');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
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

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">error</span>
            {error}
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
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 bg-[#233648] border border-[#324d67] rounded-lg pl-10 pr-4 text-white focus:ring-primary focus:border-primary transition-all"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Senha</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#92adc9] text-xl">key</span>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 bg-[#233648] border border-[#324d67] rounded-lg pl-10 pr-4 text-white focus:ring-primary focus:border-primary transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg mt-2 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
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
