import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#101922] text-white font-display">
      
      {/* Background Effect (Ken Burns Zoom) */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 animate-zoom-slow"
        style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAhCDsZjKnpI6A0oBEU6s12TpnTf61obXtx6EPrPhiDYXA8q5nLysCpHLbYOkBjkLc6abG34ZgX9TaQHcyLXcw5GpWLR52EZ_MenBz4T1UKWyJjT89EK6g-aXdLW9dZHJZCQ3W4OA4o4VvUd-5hBpobqUm7RX3iwR3lEG1Y4fwfbfVpTb_Xtqv6XC6LqnmG2hFUBQlRv_u6wymgpiiCD7B_VtUwQl5m6Y5wrvplMFG-ATktad924xvqOorh-_OUWdSYfHp3kroEBdTD')`,
        }}
      ></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#101922]/80 via-[#101922]/90 to-[#101922] z-0"></div>

      {/* Floating Music Notes Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
         <div className="absolute left-[10%] text-white/10 text-4xl animate-float" style={{animationDuration: '12s', animationDelay: '0s'}}>♪</div>
         <div className="absolute left-[20%] text-white/5 text-2xl animate-float" style={{animationDuration: '18s', animationDelay: '2s'}}>♫</div>
         <div className="absolute left-[50%] text-white/10 text-5xl animate-float" style={{animationDuration: '15s', animationDelay: '5s'}}>♪</div>
         <div className="absolute left-[70%] text-white/5 text-3xl animate-float" style={{animationDuration: '10s', animationDelay: '1s'}}>♫</div>
         <div className="absolute left-[85%] text-white/10 text-4xl animate-float" style={{animationDuration: '14s', animationDelay: '8s'}}>♪</div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl px-6 text-center flex flex-col items-center gap-8">
        <div className="flex items-center gap-4 mb-2 animate-fade-in">
            <span className="material-symbols-outlined text-primary text-5xl md:text-6xl drop-shadow-[0_0_15px_rgba(19,127,236,0.5)]">lyrics</span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white">Letra na Tela</h1>
        </div>

        <h2 className="text-3xl md:text-5xl font-bold leading-tight text-gray-100 max-w-3xl mt-2">
          <span className="inline-block opacity-0 animate-fade-in" style={{animationDelay: '0.5s', animationFillMode: 'forwards'}}>Entenda. </span>
          <span className="inline-block opacity-0 animate-fade-in mx-2" style={{animationDelay: '1.2s', animationFillMode: 'forwards'}}>Cante. </span>
          <span className="inline-block opacity-0 animate-fade-in text-primary drop-shadow-[0_0_10px_rgba(19,127,236,0.6)]" style={{animationDelay: '2.0s', animationFillMode: 'forwards'}}>Sinta.</span>
        </h2>

        <p className="text-[#92adc9] text-lg md:text-xl max-w-xl animate-fade-in mt-4" style={{animationDelay: '2.5s', animationFillMode: 'backwards'}}>
          Sua conexão profunda com a música. Traduções precisas, sincronia perfeita e a emoção que você procurava.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto animate-fade-in" style={{animationDelay: '2.8s', animationFillMode: 'backwards'}}>
            <Link 
                to="/login" 
                className="h-14 px-10 rounded-full bg-primary hover:bg-primary/90 text-white text-lg font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-[0_0_20px_rgba(19,127,236,0.3)]"
            >
                <span className="material-symbols-outlined">play_circle</span>
                Começar Agora
            </Link>
            <Link 
                to="/register" 
                className="h-14 px-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white text-lg font-bold flex items-center justify-center gap-2 transition-all backdrop-blur-sm"
            >
                Criar Conta
            </Link>
        </div>
      </div>

      <footer className="absolute bottom-8 text-[#92adc9] text-sm z-10 opacity-0 animate-fade-in" style={{animationDelay: '3s', animationFillMode: 'forwards'}}>
        © 2024 Letra na Tela. Entenda. Cante. Sinta.
      </footer>
    </div>
  );
};

export default Landing;