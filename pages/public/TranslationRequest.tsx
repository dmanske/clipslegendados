import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';

const TranslationRequest: React.FC = () => {
    console.log('[TranslationRequest] Component rendering');
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [requesterName, setRequesterName] = useState('');
    const [requesterEmail, setRequesterEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        console.log('[TranslationRequest] handleSubmit called - BEFORE preventDefault, isSubmitting:', isSubmitting);
        e.preventDefault();
        console.log('[TranslationRequest] preventDefault executed');

        if (!youtubeUrl) {
            alert('Por favor, insira o link do YouTube');
            return;
        }

        // Previne múltiplos submits - CRÍTICO para evitar loops
        if (isSubmitting) {
            console.log('[TranslationRequest] Already submitting, ignoring duplicate call');
            return;
        }

        console.log('[TranslationRequest] Starting submission...');
        setIsSubmitting(true);

        try {
            if (isSupabaseConfigured() && supabase) {
                console.log('[TranslationRequest] Supabase configured, inserting data...');
                const { data, error } = await supabase
                    .from('translation_requests')
                    .insert([{
                        youtube_url: youtubeUrl,
                        requester_name: requesterName || null,
                        requester_email: requesterEmail || null,
                        language: 'pt-BR',
                        message: message || null,
                        status: 'pending',
                        priority: 0
                    }])
                    .select();

                console.log('[TranslationRequest] Insert result:', { data, error });

                if (error) {
                    console.error('[TranslationRequest] Supabase error:', error);
                    throw error;
                }
                
                console.log('[TranslationRequest] Successfully saved to Supabase');
            } else {
                console.log('[TranslationRequest] Demo mode - would save translation request');
            }

            console.log('[TranslationRequest] Showing success message');
            setShowSuccess(true);

            // Reset form
            setYoutubeUrl('');
            setRequesterName('');
            setRequesterEmail('');
            setMessage('');

            setTimeout(() => setShowSuccess(false), 5000);
        } catch (error: any) {
            console.error('[TranslationRequest] Error details:', error);
            alert(`Erro ao enviar pedido: ${error.message || 'Erro desconhecido'}. Tente novamente.`);
        } finally {
            console.log('[TranslationRequest] Setting isSubmitting to false');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-2xl px-6 py-16">
            <header className="text-center mb-10">
                <h1 className="text-white text-4xl font-black leading-tight mb-3">Solicitar Tradução</h1>
                <p className="text-[#92adc9] text-lg">Viu um clipe que gostaria de ver legendado? Peça aqui!</p>
            </header>

            {showSuccess && (
                <div className="w-full mb-6 bg-green-500/10 border border-green-500/30 rounded-lg p-4 animate-fade-in">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-green-500 text-2xl">check_circle</span>
                        <div>
                            <p className="text-green-500 font-bold">Pedido enviado com sucesso!</p>
                            <p className="text-green-400 text-sm">Vamos avaliar e trabalhar na tradução em breve.</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full bg-[#111a22] rounded-xl p-8 border border-[#324d67] shadow-xl">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Link do YouTube *
                        </label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#92adc9]">link</span>
                            <input
                                type="url"
                                value={youtubeUrl}
                                onChange={(e) => setYoutubeUrl(e.target.value)}
                                className="w-full rounded-lg border-[#324d67] bg-[#233648] text-white placeholder-[#92adc9] focus:ring-primary focus:border-primary pl-10 p-3"
                                placeholder="https://youtube.com/watch?v=..."
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Seu Nome (Opcional)
                        </label>
                        <input
                            type="text"
                            value={requesterName}
                            onChange={(e) => setRequesterName(e.target.value)}
                            className="w-full rounded-lg border-[#324d67] bg-[#233648] text-white placeholder-[#92adc9] focus:ring-primary focus:border-primary p-3"
                            placeholder="Como deseja ser chamado"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Seu Email (Opcional)
                        </label>
                        <input
                            type="email"
                            value={requesterEmail}
                            onChange={(e) => setRequesterEmail(e.target.value)}
                            className="w-full rounded-lg border-[#324d67] bg-[#233648] text-white placeholder-[#92adc9] focus:ring-primary focus:border-primary p-3"
                            placeholder="Para te notificar quando estiver pronto"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Mensagem Adicional (Opcional)
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full rounded-lg border-[#324d67] bg-[#233648] text-white placeholder-[#92adc9] focus:ring-primary focus:border-primary p-3"
                            placeholder="Alguma observação sobre o clipe..."
                            rows={4}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full items-center justify-center rounded-lg h-12 px-4 bg-primary text-white text-base font-bold gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                                <span>Enviando...</span>
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-xl">send</span>
                                <span>Enviar Pedido</span>
                            </>
                        )}
                    </button>
                </form>
            </div>

            <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 w-full">
                <h3 className="text-blue-400 text-sm font-bold mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined">info</span>
                    Como funciona?
                </h3>
                <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-sm mt-0.5">check</span>
                        <span>Envie o link do clipe que deseja ver legendado</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-sm mt-0.5">check</span>
                        <span>Nossa equipe avalia a viabilidade e popularidade</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-sm mt-0.5">check</span>
                        <span>Se aprovado, trabalhamos na tradução e publicamos</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-sm mt-0.5">check</span>
                        <span>Você será notificado quando estiver disponível (se forneceu email)</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default TranslationRequest;
