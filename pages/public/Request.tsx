import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';

const Request: React.FC = () => {
    console.log('[Request] Component rendering');
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [srtFile, setSrtFile] = useState<File | null>(null);
    const [submitterName, setSubmitterName] = useState('');
    const [submitterEmail, setSubmitterEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.name.endsWith('.srt')) {
            setSrtFile(file);
        } else {
            alert('Por favor, selecione um arquivo .srt válido');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        console.log('[Request] handleSubmit called - BEFORE preventDefault, isSubmitting:', isSubmitting);
        e.preventDefault();
        console.log('[Request] preventDefault executed');

        if (!youtubeUrl || !srtFile || !submitterName || !submitterEmail) {
            alert('Por favor, preencha todos os campos obrigatórios');
            return;
        }

        // Previne múltiplos submits - CRÍTICO para evitar loops
        if (isSubmitting) {
            console.log('[Request] Already submitting, ignoring duplicate call');
            return;
        }

        console.log('[Request] Starting submission...');
        setIsSubmitting(true);

        try {
            // Read SRT file content
            console.log('[Request] Reading SRT file...');
            const srtContent = await srtFile.text();
            console.log('[Request] SRT content length:', srtContent.length);

            if (isSupabaseConfigured() && supabase) {
                console.log('[Request] Supabase configured, inserting data...');
                // Save to Supabase
                const { data, error } = await supabase
                    .from('subtitle_submissions')
                    .insert([{
                        youtube_url: youtubeUrl,
                        srt_content: srtContent,
                        submitter_name: submitterName,
                        submitter_email: submitterEmail,
                        message: message || null,
                        status: 'pending'
                    }])
                    .select();

                console.log('[Request] Insert result:', { data, error });

                if (error) {
                    console.error('[Request] Supabase error:', error);
                    throw error;
                }
                
                console.log('[Request] Successfully saved to Supabase');
            } else {
                console.log('[Request] Demo mode - would save:', {
                    youtubeUrl,
                    srtContent: srtContent.substring(0, 100) + '...',
                    submitterName,
                    submitterEmail,
                    message
                });
            }

            console.log('[Request] Showing success message');
            setShowSuccess(true);

            // Reset form
            setYoutubeUrl('');
            setSrtFile(null);
            setSubmitterName('');
            setSubmitterEmail('');
            setMessage('');

            // Reset file input
            const fileInput = document.getElementById('srt-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';

            setTimeout(() => setShowSuccess(false), 5000);
        } catch (error: any) {
            console.error('[Request] Error details:', error);
            alert(`Erro ao enviar legenda: ${error.message || 'Erro desconhecido'}. Tente novamente.`);
        } finally {
            console.log('[Request] Setting isSubmitting to false');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-4xl px-6 py-16">
            <header className="text-center mb-10">
                <h1 className="text-white text-4xl font-black leading-tight mb-3">Contribua com Legendas</h1>
                <p className="text-[#92adc9] text-lg">Ajude a comunidade enviando suas próprias legendas!</p>
            </header>

            {showSuccess && (
                <div className="w-full mb-6 bg-green-500/10 border border-green-500/30 rounded-lg p-4 animate-fade-in">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-green-500 text-2xl">check_circle</span>
                        <div>
                            <p className="text-green-500 font-bold">Legenda enviada com sucesso!</p>
                            <p className="text-green-400 text-sm">Obrigado pela contribuição. Vamos revisar e publicar em breve.</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                {/* Form */}
                <div className="bg-[#111a22] rounded-xl p-8 border border-[#324d67] shadow-xl">
                    <h2 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">upload_file</span>
                        Enviar Legenda
                    </h2>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Link do YouTube *
                            </label>
                            <input
                                type="url"
                                value={youtubeUrl}
                                onChange={(e) => setYoutubeUrl(e.target.value)}
                                className="w-full rounded-lg border-[#324d67] bg-[#233648] text-white placeholder-[#92adc9] focus:ring-primary focus:border-primary p-3"
                                placeholder="https://youtube.com/watch?v=..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Arquivo SRT *
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept=".srt"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="srt-upload"
                                    required
                                />
                                <label
                                    htmlFor="srt-upload"
                                    className="flex items-center justify-center w-full h-32 border-2 border-dashed border-[#324d67] rounded-lg cursor-pointer hover:border-primary/50 transition-colors bg-[#233648]/50"
                                >
                                    {srtFile ? (
                                        <div className="text-center">
                                            <span className="material-symbols-outlined text-green-500 text-4xl mb-2">check_circle</span>
                                            <p className="text-white font-medium">{srtFile.name}</p>
                                            <p className="text-xs text-gray-400 mt-1">Clique para trocar</p>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <span className="material-symbols-outlined text-[#92adc9] text-4xl mb-2">upload_file</span>
                                            <p className="text-[#92adc9]">Clique para selecionar arquivo .srt</p>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Seu Nome *
                            </label>
                            <input
                                type="text"
                                value={submitterName}
                                onChange={(e) => setSubmitterName(e.target.value)}
                                className="w-full rounded-lg border-[#324d67] bg-[#233648] text-white placeholder-[#92adc9] focus:ring-primary focus:border-primary p-3"
                                placeholder="Como deseja ser creditado"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Seu Email *
                            </label>
                            <input
                                type="email"
                                value={submitterEmail}
                                onChange={(e) => setSubmitterEmail(e.target.value)}
                                className="w-full rounded-lg border-[#324d67] bg-[#233648] text-white placeholder-[#92adc9] focus:ring-primary focus:border-primary p-3"
                                placeholder="seu@email.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Observações (Opcional)
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full rounded-lg border-[#324d67] bg-[#233648] text-white placeholder-[#92adc9] focus:ring-primary focus:border-primary p-3"
                                placeholder="Alguma informação adicional sobre a legenda..."
                                rows={3}
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
                                    <span>Enviar Legenda</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Guidelines */}
                <div className="flex flex-col gap-6">
                    <div className="bg-[#111a22] rounded-xl p-6 border border-[#324d67]">
                        <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">rule</span>
                            Regras de Tradução
                        </h3>
                        <div className="space-y-3 text-sm text-gray-300">
                            <div className="flex items-start gap-2">
                                <span className="material-symbols-outlined text-primary text-sm mt-0.5">check</span>
                                <p><strong>Naturalidade:</strong> Traduza de forma natural, não literal. A legenda deve soar fluente em português.</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="material-symbols-outlined text-primary text-sm mt-0.5">check</span>
                                <p><strong>Sincronização:</strong> Certifique-se de que os tempos estão corretos e sincronizados com o áudio.</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="material-symbols-outlined text-primary text-sm mt-0.5">check</span>
                                <p><strong>Tamanho:</strong> Máximo de 2 linhas por legenda, com até 42 caracteres por linha.</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="material-symbols-outlined text-primary text-sm mt-0.5">check</span>
                                <p><strong>Ortografia:</strong> Use a norma culta do português brasileiro, sem gírias excessivas.</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="material-symbols-outlined text-primary text-sm mt-0.5">check</span>
                                <p><strong>Contexto:</strong> Preserve o sentido original, adaptando expressões culturais quando necessário.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-primary/10 border border-primary/30 rounded-xl p-6">
                        <h3 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">info</span>
                            Formato SRT
                        </h3>
                        <p className="text-sm text-gray-300 mb-3">
                            O arquivo SRT deve seguir o formato padrão:
                        </p>
                        <div className="bg-[#111a22] rounded-lg p-4 font-mono text-xs text-gray-300">
                            <pre>{`1
00:00:10,240 --> 00:00:12,800
Primeira linha da legenda

2
00:00:13,500 --> 00:00:16,120
Segunda linha da legenda`}</pre>
                        </div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
                        <h3 className="text-yellow-500 text-sm font-bold mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined">warning</span>
                            Importante
                        </h3>
                        <p className="text-sm text-gray-300">
                            Todas as legendas enviadas passam por revisão antes de serem publicadas.
                            Você será creditado como tradutor quando a legenda for aprovada.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Request;