import React from 'react';
import { useParams } from 'react-router-dom';

const ClipDetail: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="w-full max-w-6xl px-6 py-8 md:py-12">
      <div className="flex flex-col gap-6">
        {/* Video Player Simulation */}
        <div className="relative w-full bg-black rounded-xl overflow-hidden aspect-video shadow-2xl ring-1 ring-white/10" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC9wDhPNsa4cNWxIyoKdNah8YWnWK5yflZKcKI9RJHWcst4JgzN_YExaKTsOujXVN-kxh2oujDnXbqi17qbjKJBmrK0Y-g7bbE5MAB6niUEZo5gfIvYn8Ss9kZ-59GNG9W4fvWKP0KEiHjvW-CNq21_HGUstgIMSLMk7_DB_KqiXPlO6RJyOslP8tGiHlpEbfU0LNRUz_y6e_EovgPNTlVCF0bd96SZWZ9eB6zvQPCOAVtWyqE_ZeDAlK3uhdgKuEDMrKfBCoFXkoWQ")'}}>
          <div className="absolute inset-0 flex items-center justify-center group cursor-pointer">
            <button className="flex shrink-0 items-center justify-center rounded-full size-20 bg-black/50 text-white backdrop-blur-sm group-hover:bg-primary transition-all duration-300 shadow-lg group-hover:scale-110">
              <span className="material-symbols-outlined text-5xl">play_arrow</span>
            </button>
          </div>
          {/* Mock Controls */}
          <div className="absolute inset-x-0 bottom-0 px-6 py-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <div className="flex h-4 items-center justify-center gap-1 cursor-pointer group/timeline">
              <div className="h-1 flex-1 rounded-full bg-primary relative">
                <div className="absolute -right-1 -top-1.5 size-4 rounded-full bg-white shadow-md opacity-0 group-hover/timeline:opacity-100 transition-opacity"></div>
              </div>
              <div className="h-1 flex-1 rounded-full bg-white/30"></div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-white text-xs font-medium tracking-wide">1:23 / 3:45</p>
              <div className="flex gap-4 text-white">
                <span className="material-symbols-outlined cursor-pointer hover:text-primary">closed_caption</span>
                <span className="material-symbols-outlined cursor-pointer hover:text-primary">settings</span>
                <span className="material-symbols-outlined cursor-pointer hover:text-primary">fullscreen</span>
              </div>
            </div>
          </div>
        </div>

        {/* Header Info */}
        <div className="flex flex-wrap justify-between gap-4 py-4 items-start border-b border-white/10 pb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-white text-3xl md:text-4xl font-black leading-tight">Aurora - Runaway</h1>
            <p className="text-[#92adc9] text-base">Aurora, 2015 • Legendado por Ana Silva</p>
          </div>
          <div className="flex items-center gap-3">
            <button aria-label="Share" className="flex items-center justify-center size-10 rounded-full bg-[#233648] text-white hover:bg-primary transition-colors">
              <span className="material-symbols-outlined text-xl">share</span>
            </button>
            <button aria-label="Copy Link" className="flex items-center justify-center size-10 rounded-full bg-[#233648] text-white hover:bg-primary transition-colors">
              <span className="material-symbols-outlined text-xl">link</span>
            </button>
          </div>
        </div>

        {/* Tabs & Content */}
        <div className="flex flex-col gap-6">
            <div className="flex gap-8 text-sm font-bold text-[#92adc9]">
                <button className="text-white border-b-2 border-primary pb-2">Descrição</button>
                <button className="hover:text-white border-b-2 border-transparent pb-2 transition-colors">Sobre o Projeto</button>
                <button className="hover:text-white border-b-2 border-transparent pb-2 transition-colors">Técnica de Legendagem</button>
            </div>
            <div className="text-white/80 leading-relaxed space-y-4">
                <p>"Runaway" é uma canção da cantora e compositora norueguesa Aurora. Foi lançada como o primeiro single de seu EP de estreia, "Running with the Wolves".</p>
                <p>A letra da canção fala sobre escapar e encontrar um lugar ao qual se pertence, um tema recorrente em suas músicas que explora a conexão com a natureza e a busca por um lar. A produção audiovisual complementa a atmosfera etérea da música, com visuais que realçam a paisagem norueguesa e a performance expressiva da artista.</p>
            </div>
        </div>
        
        {/* Comments Section Preview */}
        <div className="mt-10 pt-10 border-t border-white/10">
            <h3 className="text-white text-xl font-bold mb-6">Comentários</h3>
            <div className="flex gap-4 mb-6">
                <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">EU</div>
                <input type="text" placeholder="Adicione um comentário..." className="flex-1 bg-[#111a22] border border-[#324d67] rounded-lg px-4 text-white focus:border-primary focus:ring-1 focus:ring-primary" />
            </div>
            <div className="space-y-6">
                <div className="flex gap-4">
                    <div className="size-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">CS</div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-white font-semibold">Carlos S.</span>
                            <span className="text-xs text-gray-500">2 horas atrás</span>
                        </div>
                        <p className="text-gray-300 mt-1">A legenda ficou perfeita! Sincronia impecável.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ClipDetail;