import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';

interface ClipData {
    id: string;
    title: string;
    artist: string;
    status: string;
    created_at: string;
    thumbnail_url: string;
    views: number;
}

const ClipLibrary: React.FC = () => {
    const navigate = useNavigate();
    const [clips, setClips] = useState<ClipData[]>([]);
    const [filteredClips, setFilteredClips] = useState<ClipData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchClips();
    }, []);

    useEffect(() => {
        filterClips();
    }, [clips, searchTerm, statusFilter]);

    const fetchClips = async () => {
        if (!isSupabaseConfigured() || !supabase) {
            // Fallback para dados de demonstração
            const mockClips = [
                { id: '1', title: "Aurora Live Performance", artist: "Artist A", status: "Published", created_at: "2024-10-24T00:00:00Z", thumbnail_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDAYuD-nuLwHb_1ZO-eTVacr0NQrE9CJ18K-z9hjz5LDKxp0l4Pr0Df66FwB_SbPDel4qPwAYrEXx6mCEbow37XIboXpbvYKWfjWz4QfXupleXM_FoE44R28cgEj52OZ2L80W-a31i_5PYLOkyjTsXHRXIIak9Ail9GnUTBgg76chVRha95Uo4ICGRMvDOqioO0nudmHsKm6eN5LznW93N8LesBBNfKX6f-m_BuJjMydyTzLZhA_imWFhZ2glDEgYv9R-ud2RsktmHT" },
                { id: '2', title: "The Night City", artist: "Movie Title B", status: "Draft", created_at: "2024-10-22T00:00:00Z", thumbnail_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKC5tAc0Pn7ID1ez_hCK2BldAcr-v-2IMW-x55krnwf2gdX_tD3bbcWP5W7CCpVKD6MsUvb0ZR-crVeYg0czgJYORb94IePMXSAyzsU52cKCC6GwjofNcjZRwS96kVI0VdTIvhaTsZBscAk55gR1Ga5vJaDFnJ_Wo_HZJgwwTZIK55gx1Ars7H4V_VDhsLqOkB4YSdbyZvj96wngkbE8r1C9VIt_6YJo5oZF8-0PZnKWHWmdE_VpmXkzJokcEeWi854H9pu4iHaKvq" },
                { id: '3', title: "Serenity Now", artist: "Artist C", status: "Published", created_at: "2024-10-20T00:00:00Z", thumbnail_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCYvRHThyBDBsH_p7KiPuEl07sEjKguZ-Rubt79newq1KwJZDzcwcHD6oydViGLkakdC6McHd8e7QtF8xUhei4jlJxEwVpLrln3epdx2-ZHASvwfTofSeQBUnn4IFywNTfMJH_aC5NpsK-BnZqnHYnDilLYz3jCOQUPQw8gJ-l_ctqDHxi9PDEh0hlGperHJpZTmXbLwdaGcEMoNVHU_f6Xpuie3uJK2syhG68YWrDWdmea6-MwQaXyqMboqgBajy3YKIAbVsYBmRM" },
            ];
            setClips(mockClips);
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('clips')
                .select('id, title, artist, status, created_at, thumbnail_url, views')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setClips(data || []);
        } catch (error) {
            console.error('Erro ao buscar clipes:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterClips = () => {
        let filtered = clips;

        // Filtro de busca
        if (searchTerm) {
            filtered = filtered.filter(clip =>
                clip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                clip.artist?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtro de status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(clip => clip.status === statusFilter);
        }

        setFilteredClips(filtered);
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();

        if (!confirm('Tem certeza que deseja deletar este clipe?')) return;

        if (!isSupabaseConfigured() || !supabase) {
            setClips(prev => prev.filter(c => c.id !== id));
            return;
        }

        try {
            const { error } = await supabase
                .from('clips')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setClips(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            console.error('Erro ao deletar clipe:', error);
            alert('Erro ao deletar clipe');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div className="max-w-7xl mx-auto h-full flex flex-col">
            {!isSupabaseConfigured() && (
                <div className="bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500 text-blue-700 dark:text-blue-300 p-4 mb-6 rounded" role="alert">
                    <p className="font-bold">Modo de Demonstração</p>
                    <p>Supabase não configurado. Exibindo dados fictícios locais.</p>
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-gray-900 dark:text-white text-3xl font-black leading-tight">Biblioteca de Clipes</h1>
                    <p className="text-gray-500 dark:text-[#92adc9]">Gerencie sua coleção de vídeos</p>
                </div>
                <button onClick={() => navigate('/admin/create')} className="flex items-center justify-center px-4 h-10 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors gap-2">
                    <span className="material-symbols-outlined">add</span>
                    Adicionar Novo Clipe
                </button>
            </div>

            <div className="bg-white dark:bg-[#111a22] border border-gray-200 dark:border-[#324d67] rounded-xl overflow-hidden flex-1 flex flex-col">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-200 dark:border-[#324d67] flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                        <input
                            type="text"
                            placeholder="Buscar clipes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 h-10 bg-gray-50 dark:bg-[#233648] border-none rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-10 bg-gray-50 dark:bg-[#233648] border-none rounded-lg text-sm text-gray-900 dark:text-gray-400 px-4 focus:ring-1 focus:ring-primary"
                    >
                        <option value="all">Todos os Status</option>
                        <option value="Published">Publicado</option>
                        <option value="Draft">Rascunho</option>
                    </select>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 dark:bg-[#192633] border-b border-gray-200 dark:border-[#324d67] text-xs font-bold text-gray-500 dark:text-[#92adc9] uppercase tracking-wider">
                    <div className="col-span-4">Info do Clipe</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Visualizações</div>
                    <div className="col-span-2">Data de Adição</div>
                    <div className="col-span-2 text-right">Ações</div>
                </div>

                {/* Table Body */}
                <div className="overflow-y-auto flex-1">
                    {loading ? (
                        <div className="p-12 flex justify-center">
                            <span className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></span>
                        </div>
                    ) : filteredClips.length === 0 ? (
                        <div className="p-12 text-center text-gray-500 dark:text-[#92adc9]">
                            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">movie</span>
                            <p>Nenhum clipe encontrado</p>
                        </div>
                    ) : (
                        filteredClips.map((clip) => (
                            <div key={clip.id} onClick={() => navigate(`/admin/edit/${clip.id}`)} className="grid grid-cols-12 gap-4 p-4 items-center border-b border-gray-200 dark:border-[#324d67] hover:bg-gray-50 dark:hover:bg-[#233648]/50 transition-colors cursor-pointer">
                                <div className="col-span-4 flex items-center gap-4">
                                    <img
                                        src={clip.thumbnail_url || 'https://via.placeholder.com/150x90?text=No+Image'}
                                        alt=""
                                        className="w-20 h-12 object-cover rounded bg-gray-800"
                                    />
                                    <div className="min-w-0">
                                        <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{clip.title}</h4>
                                        <p className="text-xs text-gray-500 dark:text-[#92adc9]">{clip.artist || 'Artista desconhecido'}</p>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${clip.status === 'Published' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                        {clip.status === 'Published' ? 'Publicado' : 'Rascunho'}
                                    </span>
                                </div>
                                <div className="col-span-2 flex items-center gap-1 text-sm text-gray-500 dark:text-[#92adc9]">
                                    <span className="material-symbols-outlined text-base">visibility</span>
                                    <span>{(clip.views || 0).toLocaleString()}</span>
                                </div>
                                <div className="col-span-2 text-sm text-gray-500 dark:text-[#92adc9]">{formatDate(clip.created_at)}</div>
                                <div className="col-span-2 flex justify-end gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); navigate(`/admin/edit/${clip.id}`); }}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-[#324d67] rounded-lg text-gray-400 hover:text-primary transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(clip.id, e)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-[#324d67] rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClipLibrary;