import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';

interface CommentData {
  id: string;
  user_name: string;
  user_email: string;
  content: string;
  rating: number;
  created_at: string;
  status: string;
  clips: {
    title: string;
  } | null;
}

const Comments: React.FC = () => {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback data for demo if Supabase is not connected
  const [mockComments, setMockComments] = useState([
    { id: '1', user_name: "Carlos S.", user_email: "carlos.s@email.com", created_at: new Date(Date.now() - 7200000).toISOString(), rating: 5, content: "Este clipe é fantástico! A legenda está perfeitamente sincronizada. Ótimo trabalho!", status: 'pending', clips: { title: "Aurora Live Performance" } },
    { id: '2', user_name: "Mariana P.", user_email: "mari.p@email.com", created_at: new Date(Date.now() - 86400000).toISOString(), rating: 4, content: "Gostei muito, mas achei que a legenda poderia ter uma fonte um pouco maior.", status: 'pending', clips: { title: "The Night City" } },
    { id: '3', user_name: "Ana L.", user_email: "ana.lucia@email.com", created_at: new Date(Date.now() - 259200000).toISOString(), rating: 5, content: "Relaxante e lindo. As legendas ajudaram a entender o contexto poético. Perfeito!", status: 'pending', clips: { title: "Serenity Now" } },
  ]);

  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchComments();
    } else {
      setLoading(false);
      setComments(mockComments as unknown as CommentData[]);
    }
  }, []);

  const fetchComments = async () => {
    if (!supabase) return;
    
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          clips (
            title
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    // Optimistic update
    if (!isSupabaseConfigured()) {
        setComments(prev => prev.filter(c => c.id !== id));
        return;
    }

    if (!supabase) return;

    try {
        setComments(prev => prev.filter(c => c.id !== id));

        const { error } = await supabase
            .from('comments')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) throw error;
    } catch (error) {
        console.error(`Error updating comment ${id}:`, error);
        alert("Erro ao atualizar status do comentário.");
        fetchComments(); // Revert on error
    }
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " anos atrás";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " meses atrás";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " dias atrás";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " horas atrás";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutos atrás";
    return "agora mesmo";
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
         <h1 className="text-gray-900 dark:text-white text-3xl font-black leading-tight">Moderação de Comentários</h1>
         <p className="text-gray-500 dark:text-[#92adc9]">Revise e aprove os comentários dos usuários.</p>
      </div>

      {!isSupabaseConfigured() && (
        <div className="bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500 text-blue-700 dark:text-blue-300 p-4 mb-6 rounded" role="alert">
          <p className="font-bold">Modo de Demonstração</p>
          <p>Supabase não configurado. Exibindo dados fictícios locais.</p>
        </div>
      )}

      <div className="bg-white dark:bg-[#111a22] border border-gray-200 dark:border-[#324d67] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-[#324d67] flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Pendente de Aprovação <span className="ml-2 bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">{comments.length}</span></h2>
            <div className="flex gap-2">
                <button onClick={() => fetchComments()} className="text-sm text-gray-500 hover:text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">refresh</span>
                    Atualizar
                </button>
            </div>
        </div>
        
        {loading ? (
             <div className="p-12 flex justify-center">
                 <span className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></span>
             </div>
        ) : comments.length === 0 ? (
            <div className="p-12 text-center text-gray-500 dark:text-[#92adc9]">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">check_circle</span>
                <p>Nenhum comentário pendente.</p>
            </div>
        ) : (
            <div className="divide-y divide-gray-200 dark:divide-[#324d67]">
                {comments.map((comment) => (
                    <div key={comment.id} className="p-6 hover:bg-gray-50 dark:hover:bg-[#192633]/50 transition-colors animate-fade-in">
                        <div className="flex items-start gap-4">
                            {/* Avatar Placeholder based on name */}
                            <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                                {comment.user_name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-base">{comment.user_name}</h3>
                                        <p className="text-xs text-gray-500">{comment.user_email} • {timeAgo(comment.created_at)}</p>
                                    </div>
                                    <div className="flex items-center text-yellow-400 gap-1">
                                        <span className="material-symbols-outlined text-sm filled">star</span>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{comment.rating}.0</span>
                                    </div>
                                </div>
                                <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{comment.content}</p>
                                
                                <div className="mt-4 p-3 bg-gray-100 dark:bg-[#192633] rounded-lg text-xs flex items-center gap-2 w-fit">
                                    <span className="material-symbols-outlined text-base text-gray-500">movie</span>
                                    <span className="text-gray-500">Comentou em:</span>
                                    <span className="font-bold text-primary">{comment.clips?.title || 'Clipe Desconhecido'}</span>
                                </div>

                                <div className="flex gap-3 mt-4">
                                    <button 
                                        onClick={() => handleUpdateStatus(comment.id, 'approved')}
                                        className="flex items-center justify-center gap-1 px-4 h-8 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20 font-bold text-xs transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-base">check</span>
                                        Aprovar
                                    </button>
                                    <button 
                                        onClick={() => handleUpdateStatus(comment.id, 'rejected')}
                                        className="flex items-center justify-center gap-1 px-4 h-8 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 font-bold text-xs transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-base">close</span>
                                        Rejeitar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
        
        <div className="p-4 border-t border-gray-200 dark:border-[#324d67] bg-gray-50 dark:bg-[#192633] flex justify-center">
            <button className="text-sm font-bold text-primary hover:underline">Carregar Mais Comentários</button>
        </div>
      </div>
    </div>
  );
};

export default Comments;