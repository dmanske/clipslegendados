import React from 'react';
import { Link } from 'react-router-dom';

const Request: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl px-6 py-16">
        <header className="text-center mb-10">
            <h1 className="text-white text-4xl font-black leading-tight mb-3">Solicitar Legenda</h1>
            <p className="text-[#92adc9] text-lg">Viu um clipe que gostaria de ver legendado? Envie o link abaixo!</p>
        </header>
        
        <div className="w-full bg-[#111a22] rounded-xl p-8 border border-[#324d67] shadow-xl">
            <form className="flex flex-col gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="clip-link">Link do Clipe</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#92adc9]">link</span>
                        <input className="form-input w-full rounded-lg border-[#324d67] bg-[#233648] text-white placeholder-[#92adc9] focus:ring-primary focus:border-primary pl-10" id="clip-link" placeholder="https://youtube.com/watch?v=..." type="url"/>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="language">Idioma da Legenda</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#92adc9]">translate</span>
                        <select className="form-select w-full rounded-lg border-[#324d67] bg-[#233648] text-white focus:ring-primary focus:border-primary pl-10">
                            <option>Português (Brasil)</option>
                            <option>English</option>
                            <option>Español</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="message">Mensagem Adicional (Opcional)</label>
                    <textarea className="form-textarea w-full rounded-lg border-[#324d67] bg-[#233648] text-white placeholder-[#92adc9] focus:ring-primary focus:border-primary" id="message" placeholder="Alguma observação? Ex: 'focar na tipografia x'..." rows={4}></textarea>
                </div>
                <div className="mt-2">
                    <button type="button" className="flex w-full items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary text-white text-base font-bold gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-xl">send</span>
                        <span>Enviar Solicitação</span>
                    </button>
                </div>
            </form>
        </div>
        
        <div className="mt-8">
            <Link to="/" className="text-sm text-[#92adc9] hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5">
                Voltar para a página inicial
            </Link>
        </div>
    </div>
  );
};

export default Request;