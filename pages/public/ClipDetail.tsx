import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clip } from '../../types';
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';
import { useAuth } from '../../context/AuthContext';

// Mock data fallback
const MOCK_CLIP: Clip = {
  id: '1',
  title: 'Aurora - Runaway',
  artist: 'Aurora',
  thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9wDhPNsa4cNWxIyoKdNah8YWnWK5yflZKcKI9RJHWcst4JgzN_YExaKTsOujXVN-kxh2oujDnXbqi17qbjKJBmrK0Y-g7bbE5MAB6niUEZo5gfIvYn8Ss9kZ-59GNG9W4fvWKP0KEiHjvW-CNq21_HGUstgIMSLMk7_DB_KqiXPlO6RJyOslP8tGiHlpEbfU0LNRUz_y6e_EovgPNTlVCF0bd96SZWZ9eB6zvQPCOAVtWyqE_ZeDAlK3uhdgKuEDMrKfBCoFXkoWQ',
  views: 200000,
  status: 'Published',
  description: '"Runaway" é uma canção da cantora e compositora norueguesa Aurora. Foi lançada como o primeiro single de seu EP de estreia, "Running with the Wolves".',
  tags: ['music', 'pop']
};

interface CommentData {
    id: string;
    user_name: string;
    created_at: string;
    content: string;
    rating: number;
}

const ClipDetail: React.FC = () => {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const [clip, setClip] = useState<Clip | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Comment Form State
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  // Autofill user data
  useEffect(() => {
    if (profile?.full_name) setUserName(profile.full_name);
    if (user?.email) setUserEmail(user.email);
  }, [user, profile]);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id || '');

    if (isSupabaseConfigured() && isUuid && supabase) {
      try {
        const { data: clipData } = await supabase
          .from('clips')
          .select('*')
          .eq('id', id)
          .single();
          
        if (clipData) {
            setClip({
                id: clipData.id,
                title: clipData.title,
                artist: clipData.artist,
                thumbnail: clipData.thumbnail_url || MOCK_CLIP.thumbnail,
                views: clipData.views || 0,
                status: clipData.status,
                description: clipData.description,
                tags: clipData.tags || []
            });

            const { data: commentsData } = await supabase
                .from('comments')
                .select('*')
                .eq('clip_id', id)
                .eq('status', 'approved')
                .order('created_at', { ascending: false });
            
            setComments(commentsData || []);
        } else {
             setClip(MOCK_CLIP);
        }
      } catch (e) {
        console.error(e);
        setClip(MOCK_CLIP);
      }
    } else {
      setClip(MOCK_CLIP);
      setComments([
          { id: '1', user_name: 'Carlos S.', created_at: new Date().toISOString(), content: 'A legenda ficou perfeita! Sincronia impecável.', rating: 5 }
      ]);
    }
    setLoading(false);
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // Use logged in data if available, otherwise form data (though form is prepopulated)
    const finalName = userName.trim() || profile?.full_name || 'Anônimo';
    const finalEmail = userEmail.trim() || user?.email || '';

    if (!isSupabaseConfigured() || !supabase) {
        alert("Modo demonstração: Comentário não será salvo no banco de dados.");
        setNewComment('');
        return;
    }

    setIsPosting(true);
    try {
        const { error } = await supabase.from('comments').insert([
            {
                clip_id: id,
                user_id: user?.id,
                user_name: finalName,
                user_email: finalEmail,
                content: newComment,
                rating: 5,
                status: 'pending'
            }
        ]);

        if (error) throw error;

        alert("Comentário enviado para moderação!");
        setNewComment('');
    } catch (error: any) {
        console.error("Erro ao postar comentário:", error);
        alert("Erro ao enviar comentário.");
    } finally {
        setIsPosting(false);
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

  if (loading) {
      return <div className="w-full min-h-screen flex items-center justify-center text-white">Carregando...</div>;
  }

  if (!clip) {
      return <div className="w-full min-h-screen flex items-center justify-center text-white">Clipe não encontrado</div>;
  }

  return (
    <div className="w-full max-w-6xl px-6 py-8 md:py-12">
      <div className="flex flex-col gap-6">
        <div className="relative w-full bg-black rounded-xl overflow-hidden aspect-video shadow-2xl ring-1 ring-white/10" style={{backgroundImage: `url("${clip.thumbnail}")`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
          <div className="absolute inset-0 flex items-center justify-center group cursor-pointer">
            <button className="flex shrink-0 items-center justify-center rounded-full size-20 bg-black/50 text-white backdrop-blur-sm group-hover:bg-primary transition-all duration-300 shadow-lg group-hover:scale-110">
              <span className="material-symbols-outlined text-5xl">play_arrow</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-4 py-4 items-start border-b border-white/10 pb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-white text-3xl md:text-4xl font-black leading-tight">{clip.title}</h1>
            <p className="text-[#92adc9] text-base">{clip.artist} • Legendado por Ana Silva</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
            <div className="text-white/80 leading-relaxed space-y-4">
                <p>{clip.description}</p>
            </div>
        </div>
        
        <div className="mt-10 pt-10 border-t border-white/10">
            <h3 className="text-white text-xl font-bold mb-6">Comentários ({comments.length})</h3>
            
            <form onSubmit={handlePostComment} className="bg-[#111a22] rounded-lg p-6 mb-8 border border-[#324d67]">
                <h4 className="text-white text-sm font-bold mb-4">Deixe seu comentário</h4>
                <div className="flex gap-4">
                    <div className="size-10 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {userName ? userName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 flex flex-col gap-3">
                        <textarea 
                            placeholder="Escreva sua opinião sobre a legenda..." 
                            required
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            rows={3}
                            className="w-full bg-[#233648] border border-[#324d67] rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary resize-none" 
                        />
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                                Publicando como <span className="text-gray-300">{userName || user?.email}</span>
                            </span>
                            <button 
                                type="submit" 
                                disabled={isPosting}
                                className="px-6 h-9 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPosting ? 'Enviando...' : 'Publicar'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            <div className="space-y-6">
                {comments.map(comment => (
                    <div key={comment.id} className="flex gap-4 animate-fade-in">
                        <div className="size-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold shrink-0">
                            {comment.user_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-white font-semibold">{comment.user_name}</span>
                                <span className="text-xs text-gray-500">{timeAgo(comment.created_at)}</span>
                            </div>
                            <p className="text-gray-300 mt-1">{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ClipDetail;
