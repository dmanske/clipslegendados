import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { Clip } from '../types';

// Mock Data for Fallback
const MOCK_CLIPS = [
  { id: '1', title: 'Yellow', artist: 'Coldplay', views: '1.2M', thumbnail: 'https://img.youtube.com/vi/yKNxeF4KMsY/maxresdefault.jpg' },
  { id: '2', title: 'Blinding Lights', artist: 'The Weeknd', views: '850k', thumbnail: 'https://img.youtube.com/vi/4NRXx6U8ABQ/maxresdefault.jpg' },
  { id: '3', title: 'Anti-Hero', artist: 'Taylor Swift', views: '2.1M', thumbnail: 'https://img.youtube.com/vi/b1kbLwvqugk/maxresdefault.jpg' },
  { id: '4', title: 'Locked Out of Heaven', artist: 'Bruno Mars', views: '900k', thumbnail: 'https://img.youtube.com/vi/e-fA-gBCkj0/maxresdefault.jpg' },
  { id: '5', title: 'Do I Wanna Know?', artist: 'Arctic Monkeys', views: '1.5M', thumbnail: 'https://img.youtube.com/vi/bpOSxM0rNPM/maxresdefault.jpg' },
  { id: '6', title: 'Hello', artist: 'Adele', views: '3.0M', thumbnail: 'https://img.youtube.com/vi/YQHsXMglC9A/maxresdefault.jpg' },
];

const Landing: React.FC = () => {
  const [previewClips, setPreviewClips] = useState<any[]>(MOCK_CLIPS);

  useEffect(() => {
    const fetchPreviewClips = async () => {
      if (isSupabaseConfigured() && supabase) {
        try {
          const { data, error } = await supabase
            .from('clips')
            .select('*')
            .eq('status', 'Published')
            .order('views', { ascending: false })
            .limit(6);

          if (!error && data && data.length > 0) {
            const mapped = data.map(item => ({
              id: item.id,
              title: item.title,
              artist: item.artist,
              views: item.views ? item.views.toLocaleString() : '0',
              thumbnail: item.thumbnail_url || (item.video_url && item.video_url.includes('youtube')
                ? `https://img.youtube.com/vi/${item.video_url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]}/maxresdefault.jpg`
                : 'https://via.placeholder.com/640x360?text=Sem+Thumbnail')
            }));
            setPreviewClips(mapped);
          }
        } catch (err) {
          console.error('Error fetching preview clips:', err);
        }
      }
    };

    fetchPreviewClips();
  }, []);

  return (
    <div className="relative w-full min-h-screen flex flex-col overflow-x-hidden bg-[#101922] text-white font-display">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/30 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
        <div className="flex items-center gap-2 group cursor-pointer">
          <span className="material-symbols-outlined text-primary text-3xl drop-shadow-[0_0_15px_rgba(19,127,236,0.6)] group-hover:scale-110 transition-transform duration-300">lyrics</span>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors duration-300">Letra na Tela</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 bg-white/5 backdrop-blur-md p-1.5 rounded-full border border-white/10">
          <a href="#home" className="px-6 py-2 rounded-full text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300">Início</a>
          <a href="#features" className="px-6 py-2 rounded-full text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300">Funcionalidades</a>
          <a href="#library" className="px-6 py-2 rounded-full text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300">Biblioteca</a>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="px-4 py-2 text-sm font-bold text-white/80 hover:text-white transition-colors">
            Entrar
          </Link>
          <Link to="/register" className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-all shadow-[0_0_15px_rgba(19,127,236,0.3)] hover:shadow-[0_0_25px_rgba(19,127,236,0.5)] hover:scale-105">
            Criar Conta
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div id="home" className="relative w-full min-h-screen flex flex-col items-center justify-center p-6">

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
          <div className="absolute left-[10%] text-white/10 text-4xl animate-float" style={{ animationDuration: '12s', animationDelay: '0s' }}>♪</div>
          <div className="absolute left-[20%] text-white/5 text-2xl animate-float" style={{ animationDuration: '18s', animationDelay: '2s' }}>♫</div>
          <div className="absolute left-[50%] text-white/10 text-5xl animate-float" style={{ animationDuration: '15s', animationDelay: '5s' }}>♪</div>
          <div className="absolute left-[70%] text-white/5 text-3xl animate-float" style={{ animationDuration: '10s', animationDelay: '1s' }}>♫</div>
          <div className="absolute left-[85%] text-white/10 text-4xl animate-float" style={{ animationDuration: '14s', animationDelay: '8s' }}>♪</div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl px-6 text-center flex flex-col items-center gap-8 mt-[-10vh]">

          <div className="flex items-center gap-4 mb-2 animate-fade-in">
            <span className="material-symbols-outlined text-primary text-5xl md:text-6xl drop-shadow-[0_0_15px_rgba(19,127,236,0.5)]">lyrics</span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white">Letra na Tela</h1>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold leading-tight text-gray-100 max-w-3xl mt-2">
            <span className="inline-block opacity-0 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>Entenda. </span>
            <span className="inline-block opacity-0 animate-fade-in mx-2" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>Cante. </span>
            <span className="inline-block opacity-0 animate-fade-in text-primary drop-shadow-[0_0_10px_rgba(19,127,236,0.6)]" style={{ animationDelay: '2.0s', animationFillMode: 'forwards' }}>Sinta.</span>
          </h2>

          <p className="text-[#92adc9] text-lg md:text-xl max-w-xl animate-fade-in mt-4" style={{ animationDelay: '2.5s', animationFillMode: 'backwards' }}>
            Sua conexão profunda com a música. Traduções precisas, sincronia perfeita e a emoção que você procurava.
          </p>

          {/* Comment Reminder Badge */}
          <div className="animate-fade-in px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2 hover:bg-white/10 transition-colors cursor-default shadow-[0_0_20px_rgba(19,127,236,0.15)] hover:shadow-[0_0_30px_rgba(19,127,236,0.3)] group" style={{ animationDelay: '2.6s', animationFillMode: 'backwards' }}>
            <span className="material-symbols-outlined text-primary text-xl group-hover:scale-110 transition-transform">chat</span>
            <span className="text-sm md:text-base font-medium text-white/90">Sua opinião importa! Não esqueça de comentar nos clipes.</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto animate-fade-in" style={{ animationDelay: '2.8s', animationFillMode: 'backwards' }}>
            <Link
              to="/login"
              className="h-14 px-10 rounded-full bg-primary hover:bg-primary/90 text-white text-lg font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-[0_0_20px_rgba(19,127,236,0.3)]"
            >
              <span className="material-symbols-outlined">play_circle</span>
              Começar Agora
            </Link>
            <Link
              to="/register"
              className="h-14 px-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white text-lg font-bold flex items-center justify-center gap-2 transition-all backdrop-blur-sm hover:scale-105"
            >
              Criar Conta
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce opacity-0 animate-fade-in" style={{ animationDelay: '3.5s', animationFillMode: 'forwards' }}>
          <a href="#features" className="material-symbols-outlined text-white/50 text-3xl hover:text-white transition-colors cursor-pointer hover:scale-110">keyboard_arrow_down</a>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative z-10 w-full bg-[#0b1219] py-20 px-6 scroll-mt-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Poder Total nas Suas Mãos
            </h2>
            <p className="text-[#92adc9] text-lg max-w-2xl mx-auto">
              Desenvolvemos um player exclusivo com ferramentas profissionais para você ter a melhor experiência possível.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">


            {/* Feature 2: Sincronia Precisa */}
            <div className="bg-[#111a22] p-8 rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 hover:bg-white/5 hover:shadow-2xl hover:shadow-primary/10 group cursor-default">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <span className="material-symbols-outlined text-primary text-3xl">sync</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">Sincronia Precisa</h3>
              <p className="text-[#92adc9] group-hover:text-white/80 transition-colors">
                Tecnologia de ponta para o tempo exato. E se precisar, você tem controle total para ajustar o tempo da legenda manualmente.
              </p>
            </div>

            {/* Feature 3: Personalização Total */}
            <div className="bg-[#111a22] p-8 rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 hover:bg-white/5 hover:shadow-2xl hover:shadow-primary/10 group cursor-default">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <span className="material-symbols-outlined text-primary text-3xl">tune</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">Personalização Total</h3>
              <p className="text-[#92adc9] group-hover:text-white/80 transition-colors">
                Deixe do seu jeito. Ajuste o tamanho da fonte, escolha a cor que preferir e mude a posição das legendas na tela.
              </p>
            </div>

            {/* Feature 4: Player Inteligente */}
            <div className="bg-[#111a22] p-8 rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 hover:bg-white/5 hover:shadow-2xl hover:shadow-primary/10 group cursor-default">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <span className="material-symbols-outlined text-primary text-3xl">smart_display</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">Player Exclusivo</h3>
              <p className="text-[#92adc9] group-hover:text-white/80 transition-colors">
                Livre de distrações. Bloqueamos anúncios e sugestões indesejadas para você focar apenas no que importa: a música.
              </p>
            </div>

            {/* Feature 5: Download SRT */}
            <div className="bg-[#111a22] p-8 rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 hover:bg-white/5 hover:shadow-2xl hover:shadow-primary/10 group cursor-default">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <span className="material-symbols-outlined text-primary text-3xl">download</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">Baixe a Legenda</h3>
              <p className="text-[#92adc9] group-hover:text-white/80 transition-colors">
                Gostou da tradução? Você pode baixar o arquivo .SRT sincronizado para usar onde quiser.
              </p>
            </div>

            {/* Feature 6: Imersão Total */}
            <div className="bg-[#111a22] p-8 rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 hover:bg-white/5 hover:shadow-2xl hover:shadow-primary/10 group cursor-default">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <span className="material-symbols-outlined text-primary text-3xl">fullscreen</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">Imersão Total</h3>
              <p className="text-[#92adc9] group-hover:text-white/80 transition-colors">
                Modo cinema e tela cheia real. Uma interface limpa e moderna projetada para maximizar sua experiência visual.
              </p>
            </div>

            {/* Feature 7: Peça e Contribua */}
            <div className="bg-[#111a22] p-8 rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 hover:bg-white/5 hover:shadow-2xl hover:shadow-primary/10 group cursor-default">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <span className="material-symbols-outlined text-primary text-3xl">volunteer_activism</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">Peça e Contribua</h3>
              <p className="text-[#92adc9] group-hover:text-white/80 transition-colors">
                Não encontrou o que queria? Solicite novas traduções ou junte-se à nossa comunidade para legendar e ajudar outros fãs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* App Preview Section */}
      <div id="library" className="relative z-10 w-full bg-[#101922] py-24 px-6 border-t border-white/5 scroll-mt-32">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Explore nossa Biblioteca
            </h2>
            <p className="text-[#92adc9] text-lg max-w-2xl mx-auto">
              Clipes legendados e traduzidos esperando por você.
              Veja o que está em alta na nossa comunidade.
            </p>
          </div>

          {/* Mock App Interface */}
          <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#101922] transform hover:scale-[1.01] transition-transform duration-500">

            {/* Mock Header */}
            <div className="h-16 bg-[#16202a] border-b border-white/5 flex items-center px-6 gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="w-1/3 h-8 bg-[#0b1219] rounded-lg flex items-center px-3 gap-2 text-white/20 text-sm">
                  <span className="material-symbols-outlined text-sm">search</span>
                  <span>Buscar músicas...</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                DM
              </div>
            </div>

            <div className="flex h-[600px]">
              {/* Mock Sidebar */}
              <div className="hidden md:block w-64 bg-[#111a22] border-r border-white/5 p-4">
                <div className="h-4 w-24 bg-white/10 rounded mb-6"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-default">
                      <div className="w-8 h-8 rounded-full bg-white/5"></div>
                      <div className="h-3 w-20 bg-white/10 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mock Content */}
              <div className="flex-1 p-6 overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <div className="h-8 w-48 bg-white/10 rounded"></div>
                  <div className="h-8 w-32 bg-white/5 rounded"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {previewClips.map((clip, index) => (
                    <div
                      key={clip.id}
                      className="group relative flex flex-col gap-3 rounded-lg overflow-hidden cursor-default"
                    >
                      <div className="relative aspect-video bg-cover bg-center rounded-lg shadow-lg overflow-hidden">
                        <img
                          src={clip.thumbnail}
                          alt={clip.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                          <span className="material-symbols-outlined text-white text-5xl opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 duration-300 drop-shadow-lg">
                            play_circle
                          </span>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">visibility</span>
                          {clip.views}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-white text-base font-bold leading-tight group-hover:text-primary transition-colors">
                          {clip.title}
                        </h3>
                        <p className="text-white/60 text-sm flex items-center gap-1 mt-1">
                          <span className="material-symbols-outlined text-[14px]">music_note</span>
                          {clip.artist}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Overlay Gradient for "More" effect */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#101922] to-transparent pointer-events-none flex items-end justify-center pb-8">
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/register"
              className="inline-flex h-14 px-12 rounded-full bg-primary hover:bg-primary/90 text-white text-lg font-bold items-center justify-center gap-2 transition-all hover:scale-105 shadow-[0_0_20px_rgba(19,127,236,0.3)]"
            >
              Quero fazer parte
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>

        </div>
      </div>

      <footer className="w-full py-8 text-center text-[#92adc9] text-sm bg-[#0b1219] border-t border-white/5">
        © 2025 Letra na Tela. Entenda. Cante. Sinta. - Autor: Daniel Manske
      </footer>
    </div>
  );
};

export default Landing;