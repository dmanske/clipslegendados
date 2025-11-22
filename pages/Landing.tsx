import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#101922] text-white font-display">
      
      {/* Background Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 scale-105 animate-pulse-slow"
        style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAhCDsZjKnpI6A0oBEU6s12TpnTf61obXtx6EPrPhiDYXA8q5nLysCpHLbYOkBjkLc6abG34ZgX9TaQHcyLXcw5GpWLR52EZ_MenBz4T1UKWyJjT89EK6g-aXdLW9dZHJZCQ3W4OA4o4VvUd-5hBpobqUm7RX3iwR3lEG1Y4fwfbfVpTb_Xtqv6XC6LqnmG2hFUBQlRv_u6wymgpiiCD7B_VtUwQl5m6Y5wrvplMFG-ATktad924xvqOorh-_OUWdSYfHp3kroEBdTD')`,
            filter: 'blur(8px)'
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#101922]/80 via-[#101922]/90 to-[#101922]"></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl px-6 text-center flex flex-col items-center gap-8">
        <div className="flex items-center gap-4 mb-4 animate-fade-in">
            <span className="material-symbols-outlined text-primary text-5xl md:text-6xl drop-shadow-[0_0_15px_rgba(19,127,236,0.5)]">lyrics</span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight">Letra na Tela</h1>
        </div>

        <h2 className="text-2xl md:text-4xl font-bold leading-tight text-gray-200 max-w-2xl animate-fade-in delay-100">
          Onde a música ganha sentido e as letras ganham vida.
        </h2>

        <p className="text-[#92adc9] text-lg md:text-xl max-w-xl animate-fade-in delay-200">
          Acesse nossa biblioteca exclusiva de videoclipes legendados com precisão, traduções artísticas e sincronia perfeita.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto animate-fade-in delay-300">
            <Link 
                to="/login" 
                className="h-14 px-10 rounded-full bg-primary hover:bg-primary/90 text-white text-lg font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-[0_0_20px_rgba(19,127,236,0.3)]"
            >
                <span className="material-symbols-outlined">login</span>
                Entrar na Plataforma
            </Link>
            <Link 
                to="/register" 
                className="h-14 px-10 rounded-full bg-white/10 hover:bg-white/20 text-white text-lg font-bold flex items-center justify-center gap-2 transition-all backdrop-blur-sm"
            >
                Criar Conta
            </Link>
        </div>
      </div>

      <footer className="absolute bottom-8 text-[#92adc9] text-sm z-10">
        © 2024 Letra na Tela. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default Landing;