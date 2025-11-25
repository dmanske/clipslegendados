import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';

interface Request {
    id: string;
    youtube_url: string;
    requester_name: string;
    requester_email: string;
    message: string;
    status: 'pending' | 'in_progress' | 'completed' | 'rejected';
    priority: number;
    created_at: string;
}

const Requests: React.FC = () => {
    const [requests, setRequests] = useState<Request[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { success, error: toastError } = useToast();
    const { confirm } = useConfirm();

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        if (!isSupabaseConfigured() || !supabase) return;

        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('translation_requests')
                .select('*')
                .order('priority', { ascending: false })
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRequests(data || []);
        } catch (error) {
            console.error('Erro ao buscar pedidos:', error);
            toastError('Erro ao carregar pedidos.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        if (!supabase) return;

        try {
            const { error } = await supabase
                .from('translation_requests')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus as any } : r));
            success('Status atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            toastError('Erro ao atualizar status.');
        }
    };

    const handlePriorityChange = async (id: string, newPriority: number) => {
        if (!supabase) return;

        try {
            const { error } = await supabase
                .from('translation_requests')
                .update({ priority: newPriority })
                .eq('id', id);

            if (error) throw error;

            setRequests(requests.map(r => r.id === id ? { ...r, priority: newPriority } : r).sort((a, b) => b.priority - a.priority));
            success('Prioridade atualizada!');
        } catch (error) {
            console.error('Erro ao atualizar prioridade:', error);
            toastError('Erro ao atualizar prioridade.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!supabase) return;

        const confirmed = await confirm({
            title: 'Excluir Pedido',
            message: 'Tem certeza que deseja excluir este pedido?',
            confirmText: 'Excluir',
            type: 'danger'
        });

        if (!confirmed) return;

        try {
            const { error } = await supabase
                .from('translation_requests')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setRequests(requests.filter(r => r.id !== id));
            success('Pedido excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir:', error);
            toastError('Erro ao excluir pedido.');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'in_progress': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'completed': return 'Concluído';
            case 'in_progress': return 'Em Progresso';
            case 'rejected': return 'Rejeitado';
            default: return 'Pendente';
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white">Pedidos de Tradução</h1>
                    <p className="text-gray-500 dark:text-[#92adc9]">Gerencie as solicitações de tradução</p>
                </div>
                <button
                    onClick={fetchRequests}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-[#233648] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#324d67] transition-colors"
                >
                    <span className="material-symbols-outlined">refresh</span>
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <span className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></span>
                </div>
            ) : requests.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-[#111a22] rounded-xl border border-gray-200 dark:border-[#324d67]">
                    <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">translate</span>
                    <p className="text-gray-500 dark:text-[#92adc9]">Nenhum pedido encontrado.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {requests.map((req) => (
                        <div key={req.id} className={`bg-white dark:bg-[#111a22] rounded-xl p-6 border ${req.priority > 0 ? 'border-primary/50 shadow-primary/10' : 'border-gray-200 dark:border-[#324d67]'} shadow-sm hover:shadow-md transition-all`}>
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(req.status)}`}>
                                            {getStatusLabel(req.status)}
                                        </span>
                                        {req.priority > 0 && (
                                            <span className="px-2 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold border border-orange-500/20 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[10px]">priority_high</span>
                                                Prioridade
                                            </span>
                                        )}
                                        <span className="text-xs text-gray-400">
                                            {new Date(req.created_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <a
                                        href={req.youtube_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-lg font-bold text-gray-900 dark:text-white hover:text-primary transition-colors mb-1 block truncate"
                                    >
                                        {req.youtube_url}
                                    </a>

                                    <p className="text-sm text-gray-500 mb-3">
                                        Solicitado por: <span className="font-medium text-gray-700 dark:text-gray-300">{req.requester_name || 'Anônimo'}</span>
                                        {req.requester_email && <span className="text-gray-400"> &lt;{req.requester_email}&gt;</span>}
                                    </p>

                                    {req.message && (
                                        <div className="bg-gray-50 dark:bg-[#192633] p-3 rounded-lg text-sm text-gray-600 dark:text-gray-300 mb-4">
                                            {req.message}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-3 min-w-[200px]">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                                        <select
                                            value={req.status}
                                            onChange={(e) => handleStatusChange(req.id, e.target.value)}
                                            className="w-full rounded-lg bg-gray-50 dark:bg-[#233648] border border-gray-200 dark:border-[#324d67] text-sm p-2 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                                        >
                                            <option value="pending">Pendente</option>
                                            <option value="in_progress">Em Progresso</option>
                                            <option value="completed">Concluído</option>
                                            <option value="rejected">Rejeitado</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Prioridade</label>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handlePriorityChange(req.id, req.priority === 0 ? 1 : 0)}
                                                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors border ${req.priority > 0 ? 'bg-orange-500 text-white border-orange-500' : 'bg-transparent text-gray-500 border-gray-300 dark:border-gray-600 hover:border-orange-500 hover:text-orange-500'}`}
                                            >
                                                {req.priority > 0 ? 'Alta' : 'Normal'}
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleDelete(req.id)}
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

export default Requests;
