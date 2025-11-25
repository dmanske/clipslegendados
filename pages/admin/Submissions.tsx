import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';

interface Submission {
    id: string;
    youtube_url: string;
    srt_content: string;
    submitter_name: string;
    submitter_email: string;
    message: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}

const Submissions: React.FC = () => {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { success, error: toastError } = useToast();
    const { confirm } = useConfirm();

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        if (!isSupabaseConfigured() || !supabase) return;

        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('subtitle_submissions')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setSubmissions(data || []);
        } catch (error) {
            console.error('Erro ao buscar submissões:', error);
            toastError('Erro ao carregar submissões.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (id: string, newStatus: 'approved' | 'rejected') => {
        if (!supabase) return;

        try {
            const { error } = await supabase
                .from('subtitle_submissions')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            setSubmissions(submissions.map(s => s.id === id ? { ...s, status: newStatus } : s));
            success(`Status atualizado para ${newStatus === 'approved' ? 'Aprovado' : 'Rejeitado'}!`);
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            toastError('Erro ao atualizar status.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!supabase) return;

        const confirmed = await confirm({
            title: 'Excluir Submissão',
            message: 'Tem certeza que deseja excluir esta submissão?',
            confirmText: 'Excluir',
            type: 'danger'
        });

        if (!confirmed) return;

        try {
            const { error } = await supabase
                .from('subtitle_submissions')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setSubmissions(submissions.filter(s => s.id !== id));
            success('Submissão excluída com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir:', error);
            toastError('Erro ao excluir submissão.');
        }
    };

    const handleDownloadSRT = (content: string, filename: string) => {
        const element = document.createElement("a");
        const file = new Blob([content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${filename}.srt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20">Aprovado</span>;
            case 'rejected':
                return <span className="px-2 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold border border-red-500/20">Rejeitado</span>;
            default:
                return <span className="px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold border border-yellow-500/20">Pendente</span>;
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white">Submissões de Legendas</h1>
                    <p className="text-gray-500 dark:text-[#92adc9]">Gerencie as legendas enviadas pela comunidade</p>
                </div>
                <button
                    onClick={fetchSubmissions}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-[#233648] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#324d67] transition-colors"
                >
                    <span className="material-symbols-outlined">refresh</span>
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <span className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></span>
                </div>
            ) : submissions.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-[#111a22] rounded-xl border border-gray-200 dark:border-[#324d67]">
                    <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">inbox</span>
                    <p className="text-gray-500 dark:text-[#92adc9]">Nenhuma submissão encontrada.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {submissions.map((sub) => (
                        <div key={sub.id} className="bg-white dark:bg-[#111a22] rounded-xl p-6 border border-gray-200 dark:border-[#324d67] shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        {getStatusBadge(sub.status)}
                                        <span className="text-xs text-gray-400">
                                            {new Date(sub.created_at).toLocaleDateString()} às {new Date(sub.created_at).toLocaleTimeString()}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                        {sub.submitter_name} <span className="text-sm font-normal text-gray-500">&lt;{sub.submitter_email}&gt;</span>
                                    </h3>

                                    <a
                                        href={sub.youtube_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline text-sm flex items-center gap-1 mb-3"
                                    >
                                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                                        {sub.youtube_url}
                                    </a>

                                    {sub.message && (
                                        <div className="bg-gray-50 dark:bg-[#192633] p-3 rounded-lg text-sm text-gray-600 dark:text-gray-300 mb-4">
                                            <span className="font-bold block mb-1 text-xs uppercase tracking-wider text-gray-400">Mensagem:</span>
                                            {sub.message}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2 min-w-[140px]">
                                    <button
                                        onClick={() => handleDownloadSRT(sub.srt_content, `legenda-${sub.submitter_name.replace(/\s+/g, '-')}`)}
                                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 font-bold text-sm transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">download</span>
                                        Baixar SRT
                                    </button>

                                    {sub.status === 'pending' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleStatusChange(sub.id, 'approved')}
                                                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 font-bold text-sm transition-colors"
                                                title="Aprovar"
                                            >
                                                <span className="material-symbols-outlined">check</span>
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(sub.id, 'rejected')}
                                                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 font-bold text-sm transition-colors"
                                                title="Rejeitar"
                                            >
                                                <span className="material-symbols-outlined">close</span>
                                            </button>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => handleDelete(sub.id)}
                                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-500 font-medium text-sm transition-colors mt-auto"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Submissions;
