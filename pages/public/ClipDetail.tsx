import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clip } from '../../types';
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';
import { useAuth } from '../../context/AuthContext';



interface CommentData {
  id: string;
  user_name: string;
  user_id?: string;
  created_at: string;
  content: string;
  rating: number;
  parent_id?: string | null;
}

const ClipDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [clip, setClip] = useState<Clip | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [subtitles, setSubtitles] = useState<any[]>([]);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);
  const isLoadingRef = useRef(false);

  // Comment Form State
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Helper to extract YouTube video ID
  const getYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const isYouTubeUrl = (url: string): boolean => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const timeToSeconds = (timeStr: string): number => {
    const parts = timeStr.split(':');
    if (parts.length === 2) {
      const [minutes, rest] = parts;
      const [seconds, ms] = rest.split('.');
      return parseInt(minutes) * 60 + parseInt(seconds) + (ms ? parseInt(ms) / 1000 : 0);
    } else if (parts.length === 3) {
      const [hours, minutes, rest] = parts;
      const [seconds, ms] = rest.split('.');
      return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds) + (ms ? parseInt(ms) / 1000 : 0);
    }
    return 0;
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [subtitleSize, setSubtitleSize] = useState(() => {
    const saved = localStorage.getItem('subtitleSize_normal');
    return saved ? parseInt(saved) : 28;
  });
  const [subtitleColor, setSubtitleColor] = useState(() => {
    return localStorage.getItem('subtitleColor') || '#FFFF00';
  });
  const [subtitleOffset, setSubtitleOffset] = useState(0); // offset em segundos
  const [subtitleBottom, setSubtitleBottom] = useState(() => {
    const saved = localStorage.getItem('subtitleBottom_normal');
    return saved ? parseInt(saved) : 10;
  });
  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasIncrementedView, setHasIncrementedView] = useState(false);
  const [volume, setVolume] = useState(100); // volume 0-100
  const [isMuted, setIsMuted] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Função para incrementar visualização
  const incrementView = async (clipId: string) => {
    if (!isSupabaseConfigured() || !supabase) {
      console.log('Supabase não configurado, view não incrementada');
      return;
    }

    try {
      console.log('Incrementando visualização para clip:', clipId);
      const { data: currentClip } = await supabase
        .from('clips')
        .select('views')
        .eq('id', clipId)
        .single();

      if (currentClip) {
        const { error } = await supabase
          .from('clips')
          .update({ views: (currentClip.views || 0) + 1 })
          .eq('id', clipId);

        if (error) {
          console.error('Erro ao incrementar view:', error);
        } else {
          console.log('View incrementada com sucesso!');
        }
      }
    } catch (error) {
      console.error('Erro ao incrementar view:', error);
    }
  };

  const togglePlay = () => {
    console.log('togglePlay called', { playerRef: playerRef.current, playerReady, isPlaying });
    if (playerRef.current && playerReady && typeof playerRef.current.playVideo === 'function') {
      if (isEnded) {
        playerRef.current.seekTo(0);
        playerRef.current.playVideo();
        setIsEnded(false);
      } else if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    } else {
      console.log('Player not ready yet');
    }
  };

  const seekVideo = (seconds: number) => {
    if (playerRef.current && playerReady && typeof playerRef.current.getCurrentTime === 'function') {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(currentTime + seconds, true);
    }
  };

  const seekToPosition = (position: number) => {
    console.log('seekToPosition called', { position, playerReady, duration, hasPlayer: !!playerRef.current });
    if (playerRef.current && playerReady) {
      try {
        playerRef.current.seekTo(position, true);
        console.log('Seeked to:', position);
      } catch (error) {
        console.error('Error seeking:', error);
      }
    } else {
      console.log('Cannot seek - player not ready');
    }
  };

  const generateSRT = () => {
    if (!subtitles || subtitles.length === 0) {
      alert('Nenhuma legenda disponível para download');
      return;
    }

    let srtContent = '';
    subtitles.forEach((sub: any, index: number) => {
      srtContent += `${index + 1}\n`;
      srtContent += `${sub.startTime.replace('.', ',')} --> ${sub.endTime.replace('.', ',')}\n`;
      srtContent += `${sub.text}\n\n`;
    });

    const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${clip?.title || 'legenda'}.srt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toggleFullscreen = async () => {
    if (!videoContainerRef.current) {
      console.log('videoContainerRef não disponível');
      return;
    }

    const elem = videoContainerRef.current;
    const isCurrentlyFullscreen = !!(document.fullscreenElement || (document as any).webkitFullscreenElement || (document as any).mozFullScreenElement);

    console.log('toggleFullscreen', { isCurrentlyFullscreen, elem });

    if (!isCurrentlyFullscreen) {
      // Entrar em fullscreen
      try {
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
          console.log('Fullscreen ativado (standard)');
          setIsFullscreen(true);
        } else if ((elem as any).webkitRequestFullscreen) {
          await (elem as any).webkitRequestFullscreen();
          console.log('Fullscreen ativado (webkit)');
          setIsFullscreen(true);
        } else if ((elem as any).webkitEnterFullscreen) {
          await (elem as any).webkitEnterFullscreen();
          console.log('Fullscreen ativado (webkit enter)');
          setIsFullscreen(true);
        } else if ((elem as any).mozRequestFullScreen) {
          await (elem as any).mozRequestFullScreen();
          console.log('Fullscreen ativado (moz)');
          setIsFullscreen(true);
        } else if ((elem as any).msRequestFullscreen) {
          await (elem as any).msRequestFullscreen();
          console.log('Fullscreen ativado (ms)');
          setIsFullscreen(true);
        } else {
          // Fullscreen não suportado - abrir página atual em nova janela
          console.log('Fullscreen não suportado - abrindo em nova janela');
          const currentUrl = window.location.href;
          window.open(currentUrl, '_blank', 'width=' + screen.width + ',height=' + screen.height);
        }
      } catch (err) {
        console.error('Erro ao ativar fullscreen:', err);
        // Se falhar, abrir página atual em nova janela
        const openNew = confirm('Tela cheia não disponível. Deseja abrir em uma nova janela?');
        if (openNew) {
          const currentUrl = window.location.href;
          window.open(currentUrl, '_blank', 'width=' + screen.width + ',height=' + screen.height);
        }
      }
    } else {
      // Sair de fullscreen
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
        console.log('Fullscreen desativado');
        setIsFullscreen(false);
      } catch (err) {
        console.error('Erro ao sair de fullscreen:', err);
      }
    }
  };

  // Salvar preferências de legenda no localStorage (separado por modo)
  useEffect(() => {
    const key = isFullscreen ? 'subtitleSize_fullscreen' : 'subtitleSize_normal';
    localStorage.setItem(key, subtitleSize.toString());
  }, [subtitleSize, isFullscreen]);

  useEffect(() => {
    localStorage.setItem('subtitleColor', subtitleColor);
  }, [subtitleColor]);

  useEffect(() => {
    const key = isFullscreen ? 'subtitleBottom_fullscreen' : 'subtitleBottom_normal';
    localStorage.setItem(key, subtitleBottom.toString());
  }, [subtitleBottom, isFullscreen]);

  // Carregar preferências ao mudar de modo
  useEffect(() => {
    const sizeKey = isFullscreen ? 'subtitleSize_fullscreen' : 'subtitleSize_normal';
    const bottomKey = isFullscreen ? 'subtitleBottom_fullscreen' : 'subtitleBottom_normal';
    
    const savedSize = localStorage.getItem(sizeKey);
    const savedBottom = localStorage.getItem(bottomKey);
    
    if (savedSize) setSubtitleSize(parseInt(savedSize));
    if (savedBottom) setSubtitleBottom(parseInt(savedBottom));
  }, [isFullscreen]);

  // Listen for fullscreen changes (múltiplos eventos para compatibilidade)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignorar se estiver digitando em um input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ': // Espaço - Play/Pause
          e.preventDefault();
          togglePlay();
          break;
        case 'arrowleft': // Seta Esquerda - Voltar 5s
          e.preventDefault();
          seekVideo(-5);
          break;
        case 'arrowright': // Seta Direita - Avançar 5s
          e.preventDefault();
          seekVideo(5);
          break;
        case 'arrowup': // Seta Cima - Subir legenda (sem modificadores)
          if (!e.shiftKey && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            setSubtitleBottom(prev => Math.min(prev + 2, 90));
          }
          break;
        case 'arrowdown': // Seta Baixo - Descer legenda (sem modificadores)
          if (!e.shiftKey && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            setSubtitleBottom(prev => Math.max(prev - 2, 0));
          }
          break;
        case '+':
        case '=': // + ou = - Aumentar fonte
          e.preventDefault();
          setSubtitleSize(prev => Math.min(prev + 2, 80));
          break;
        case '-': // - - Diminuir fonte
          e.preventDefault();
          setSubtitleSize(prev => Math.max(prev - 2, 14));
          break;
        case 'm': // M - Mute/Unmute
          e.preventDefault();
          if (playerRef.current) {
            if (isMuted) {
              playerRef.current.unMute();
              setIsMuted(false);
            } else {
              playerRef.current.mute();
              setIsMuted(true);
            }
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [playerReady, isPlaying, volume, isMuted]);

  // Load YouTube API and setup player
  useEffect(() => {
    if (!clip?.video_url || !isYouTubeUrl(clip.video_url)) return;

    const initPlayer = () => {
      console.log('Attempting to initialize player...');
      if ((window as any).YT && (window as any).YT.Player) {
        // Give the iframe time to render
        setTimeout(() => {
          const iframe = document.getElementById('youtube-player');
          if (iframe && !playerRef.current) {
            console.log('Creating YouTube player...');
            playerRef.current = new (window as any).YT.Player('youtube-player', {
              events: {
                onReady: (event: any) => {
                  console.log('YouTube player ready!');
                  setPlayerReady(true);
                  setDuration(event.target.getDuration());
                },
                onStateChange: (event: any) => {
                  console.log('Player state changed:', event.data);
                  const isPlayingState = event.data === (window as any).YT.PlayerState.PLAYING;
                  const isEndedState = event.data === (window as any).YT.PlayerState.ENDED;

                  // Incrementar view apenas na primeira vez que o vídeo é reproduzido
                  if (isPlayingState && !hasIncrementedView && id) {
                    incrementView(id);
                    setHasIncrementedView(true);
                  }

                  setIsPlaying(isPlayingState);
                  if (isEndedState) {
                    setIsEnded(true);
                    setIsPlaying(false);
                  } else {
                    setIsEnded(false);
                  }
                }
              }
            });
          }
        }, 1000);
      }
    };

    // Check if YouTube API is already loaded
    if (!(window as any).YT) {
      console.log('Loading YouTube API...');
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.onload = () => {
        console.log('YouTube API script loaded');
      };
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      (window as any).onYouTubeIframeAPIReady = initPlayer;
    } else if ((window as any).YT.Player) {
      console.log('YouTube API already loaded');
      initPlayer();
    } else {
      (window as any).onYouTubeIframeAPIReady = initPlayer;
    }

    // Start subtitle sync
    const subtitleInterval = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const time = playerRef.current.getCurrentTime();
        setCurrentTime(time);
        const adjustedTime = time + subtitleOffset;
        const activeSub = subtitles.find(sub => {
          const start = timeToSeconds(sub.startTime);
          const end = timeToSeconds(sub.endTime);
          return adjustedTime >= start && adjustedTime <= end;
        });
        setCurrentSubtitle(activeSub?.text || '');
      }
    }, 100);

    return () => {
      clearInterval(subtitleInterval);
    };
  }, [clip, subtitles, subtitleOffset]);

  // Autofill user data
  useEffect(() => {
    if (profile?.full_name) setUserName(profile.full_name);
    if (user?.email) setUserEmail(user.email);
  }, [user, profile]);

  useEffect(() => {
    console.log('[ClipDetail] Loading data for clip:', id);
    loadData();
  }, [id]);

  const loadData = async () => {
    console.log('[ClipDetail] loadData called, isLoadingRef:', isLoadingRef.current);

    // Previne múltiplas chamadas simultâneas
    if (isLoadingRef.current) {
      console.log('[ClipDetail] Already loading, skipping...');
      return;
    }

    isLoadingRef.current = true;
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
            thumbnail: clipData.thumbnail_url,
            views: clipData.views || 0,
            status: clipData.status,
            description: clipData.description || '',
            tags: clipData.tags || [],
            video_url: clipData.video_url,
            delay: clipData.delay,
            subtitled_by: clipData.subtitled_by
          });

          // Set initial delay from DB (ms to seconds)
          if (clipData.delay) {
            setSubtitleOffset(clipData.delay / 1000);
          }

          // Load subtitles if available
          if (clipData.subtitles_json) {
            setSubtitles(clipData.subtitles_json);
          }

          const { data: commentsData } = await supabase
            .from('comments')
            .select('*')
            .eq('clip_id', id)
            .eq('status', 'approved')
            .order('created_at', { ascending: false });

          setComments(commentsData || []);
        }
      } catch (e) {
        console.error('[ClipDetail] Error loading clip:', e);
      }
    }
    setLoading(false);
    isLoadingRef.current = false;
  };

  const handlePostComment = async (e: React.FormEvent, parentId: string | null = null) => {
    e.preventDefault();
    const content = parentId ? replyText : newComment;
    if (!content.trim()) return;

    // Use logged in data if available, otherwise form data (though form is prepopulated)
    const finalName = userName.trim() || profile?.full_name || 'Anônimo';
    const finalEmail = userEmail.trim() || user?.email || '';

    if (!isSupabaseConfigured() || !supabase) {
      alert("Modo demonstração: Comentário não será salvo no banco de dados.");
      if (parentId) {
        setReplyText('');
        setReplyingTo(null);
      } else {
        setNewComment('');
      }
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
          content: content.trim(),
          rating: 5,
          status: 'approved',
          parent_id: parentId
        }
      ]);

      if (error) throw error;

      alert(parentId ? "Resposta publicada com sucesso!" : "Comentário publicado com sucesso!");
      loadData(); // Reload to show new comment
      if (parentId) {
        setReplyText('');
        setReplyingTo(null);
      } else {
        setNewComment('');
      }
    } catch (error: any) {
      console.error("Erro ao postar comentário:", error);
      alert("Erro ao enviar comentário.");
    } finally {
      setIsPosting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!profile?.roles?.includes('admin')) {
      alert('Apenas administradores podem deletar comentários');
      return;
    }

    if (!confirm('Tem certeza que deseja deletar este comentário?')) return;

    if (!isSupabaseConfigured() || !supabase) return;

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      loadData(); // Reload comments
    } catch (error: any) {
      console.error('Erro ao deletar comentário:', error);
      alert('Erro ao deletar comentário');
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
      {/* Botão Voltar */}
      <button
        onClick={() => navigate('/app/library')}
        className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors group"
      >
        <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
        <span className="text-sm font-medium">Voltar para Biblioteca</span>
      </button>

      <div className="flex flex-col gap-6">
        <div ref={videoContainerRef} className="relative w-full bg-black rounded-xl overflow-hidden aspect-video shadow-2xl ring-1 ring-white/10">
          {clip.video_url && isYouTubeUrl(clip.video_url) ? (
            <>
              <iframe
                id="youtube-player"
                ref={videoRef}
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${getYouTubeId(clip.video_url)}?enablejsapi=1&rel=0&controls=0&modestbranding=1&disablekb=1&fs=0&iv_load_policy=3`}
                title={clip.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>

              {/* Transparent Overlay to Block ALL YouTube Clicks - Always Active */}
              <div
                className="absolute inset-0 z-20 cursor-pointer"
                style={{ pointerEvents: 'auto' }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  togglePlay();
                }}
              ></div>

              {/* Custom Replay Overlay (Blocks YouTube End Screen) */}
              {isEnded && (
                <div className="absolute inset-0 z-25 bg-black/80 flex flex-col items-center justify-center animate-fade-in pointer-events-none">
                  <div className="text-center pointer-events-auto">
                    <button
                      onClick={togglePlay}
                      className="flex flex-col items-center gap-4 group"
                    >
                      <div className="size-20 rounded-full bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(19,127,236,0.5)] group-hover:scale-110 transition-transform duration-300">
                        <span className="material-symbols-outlined text-5xl text-white">replay</span>
                      </div>
                      <span className="text-white text-xl font-bold group-hover:text-primary transition-colors">Assistir Novamente</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Control Bar - PC e Mobile */}
              <div className={`absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 transition-opacity duration-300 pointer-events-auto ${!isPlaying ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
                {/* Progress Bar */}
                <div className="mb-3">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={(e) => seekToPosition(Number(e.target.value))}
                    className="w-full h-2 md:h-1 bg-white/20 rounded-lg appearance-none cursor-pointer touch-manipulation"
                    style={{
                      background: `linear-gradient(to right, #137fec 0%, #137fec ${(currentTime / duration) * 100}%, rgba(255,255,255,0.2) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.2) 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-white/70 mt-1">
                    <span>{Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}</span>
                    <span>{Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}</span>
                  </div>
                </div>

                {/* Layout Mobile: 2 linhas */}
                <div className="md:hidden">
                  {/* Linha 1: Controles de Reprodução */}
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <button
                      onClick={() => seekVideo(-10)}
                      className="p-3 rounded-lg bg-white/10 text-white backdrop-blur-sm active:bg-primary transition-all duration-300 touch-manipulation"
                      title="Voltar 10s"
                    >
                      <span className="material-symbols-outlined text-3xl">replay_10</span>
                    </button>

                    <button
                      onClick={togglePlay}
                      className="p-4 rounded-full bg-primary text-white shadow-lg active:scale-95 transition-all duration-300 touch-manipulation"
                    >
                      <span className="material-symbols-outlined text-4xl">
                        {isPlaying ? 'pause' : 'play_arrow'}
                      </span>
                    </button>

                    <button
                      onClick={() => seekVideo(10)}
                      className="p-3 rounded-lg bg-white/10 text-white backdrop-blur-sm active:bg-primary transition-all duration-300 touch-manipulation"
                      title="Avançar 10s"
                    >
                      <span className="material-symbols-outlined text-3xl">forward_10</span>
                    </button>
                  </div>

                  {/* Linha 2: Controles Essenciais - Mobile */}
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {/* Sincronização */}
                    <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm">
                      <span className="material-symbols-outlined text-lg text-white">sync</span>
                      <input
                        type="number"
                        min="-10"
                        max="10"
                        step="0.5"
                        value={subtitleOffset}
                        onChange={(e) => setSubtitleOffset(Number(e.target.value))}
                        className="w-12 bg-transparent text-white text-xs border-none outline-none"
                        title="Sincronização"
                      />
                      <span className="text-white text-xs">s</span>
                    </div>

                    {/* Tamanho */}
                    <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm">
                      <span className="material-symbols-outlined text-lg text-white">text_fields</span>
                      <input
                        type="range"
                        min="18"
                        max="60"
                        value={subtitleSize}
                        onChange={(e) => setSubtitleSize(Number(e.target.value))}
                        className="w-16"
                        title="Tamanho"
                      />
                      <span className="text-white text-xs">{subtitleSize}</span>
                    </div>

                    {/* Posição */}
                    <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm">
                      <span className="material-symbols-outlined text-lg text-white">vertical_align_bottom</span>
                      <input
                        type="range"
                        min="5"
                        max="50"
                        value={subtitleBottom}
                        onChange={(e) => setSubtitleBottom(Number(e.target.value))}
                        className="w-16"
                        title="Posição"
                      />
                    </div>

                    {/* Tela Cheia / Abrir YouTube */}
                    <button
                      onClick={toggleFullscreen}
                      className="p-3 rounded-lg bg-primary text-white shadow-lg active:scale-95 transition-all touch-manipulation"
                      title="Tela cheia"
                    >
                      <span className="material-symbols-outlined text-2xl">
                        {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Layout Desktop: 1 linha (original) */}
                <div className="hidden md:flex items-center justify-between gap-4">
                  {/* Left Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={togglePlay}
                      className="p-2 rounded-lg bg-white/10 text-white backdrop-blur-sm hover:bg-primary transition-all duration-300"
                    >
                      <span className="material-symbols-outlined text-3xl">
                        {isPlaying ? 'pause' : 'play_arrow'}
                      </span>
                    </button>

                    <button
                      onClick={() => seekVideo(-10)}
                      className="p-2 rounded-lg bg-white/10 text-white backdrop-blur-sm hover:bg-primary transition-all duration-300"
                      title="Voltar 10s"
                    >
                      <span className="material-symbols-outlined text-2xl">replay_10</span>
                    </button>

                    <button
                      onClick={() => seekVideo(10)}
                      className="p-2 rounded-lg bg-white/10 text-white backdrop-blur-sm hover:bg-primary transition-all duration-300"
                      title="Avançar 10s"
                    >
                      <span className="material-symbols-outlined text-2xl">forward_10</span>
                    </button>
                  </div>

                  {/* Right Controls */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm">
                      <span className="material-symbols-outlined text-xl text-white">sync</span>
                      <input
                        type="number"
                        min="-10"
                        max="10"
                        step="0.1"
                        value={subtitleOffset}
                        onChange={(e) => setSubtitleOffset(Number(e.target.value))}
                        className="w-16 bg-transparent text-white text-xs border-none outline-none"
                        title="Sincronização (segundos)"
                      />
                      <span className="text-white text-xs">s</span>
                    </div>

                    <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm">
                      <span className="material-symbols-outlined text-xl text-white">text_fields</span>
                      <input
                        type="range"
                        min="14"
                        max="80"
                        value={subtitleSize}
                        onChange={(e) => setSubtitleSize(Number(e.target.value))}
                        className="w-20"
                        title="Tamanho da legenda"
                      />
                      <span className="text-white text-xs">{subtitleSize}px</span>
                    </div>

                    <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm">
                      <span className="material-symbols-outlined text-xl text-white">vertical_align_bottom</span>
                      <input
                        type="range"
                        min="0"
                        max="90"
                        value={subtitleBottom}
                        onChange={(e) => setSubtitleBottom(Number(e.target.value))}
                        className="w-20"
                        title="Posição vertical"
                      />
                      <span className="text-white text-xs">{subtitleBottom}%</span>
                    </div>

                    <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm">
                      <span className="material-symbols-outlined text-xl text-white">palette</span>
                      <input
                        type="color"
                        value={subtitleColor}
                        onChange={(e) => setSubtitleColor(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer"
                        title="Cor da legenda"
                      />
                    </div>

                    <button
                      onClick={generateSRT}
                      className="p-2 rounded-lg bg-white/10 text-white backdrop-blur-sm hover:bg-primary transition-all duration-300"
                      title="Baixar legendas (SRT)"
                    >
                      <span className="material-symbols-outlined text-2xl">download</span>
                    </button>

                    <button
                      onClick={toggleFullscreen}
                      className="p-2 rounded-lg bg-white/10 text-white backdrop-blur-sm hover:bg-primary transition-all duration-300"
                      title="Tela cheia"
                    >
                      <span className="material-symbols-outlined text-2xl">
                        {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Subtitles - Otimizado para Mobile */}
              {currentSubtitle && (
                <div
                  className="absolute left-0 right-0 flex justify-center items-center px-2 md:px-4 pointer-events-none z-25 transition-all duration-300"
                  style={{ 
                    bottom: `${subtitleBottom}%`,
                    minHeight: `${subtitleSize * 2.4}px`
                  }}
                >
                  <p
                    className="font-bold text-center"
                    style={{
                      fontSize: `${subtitleSize}px`,
                      color: subtitleColor,
                      textShadow: '3px 3px 6px rgba(0,0,0,0.95), -2px -2px 4px rgba(0,0,0,0.95), 2px -2px 4px rgba(0,0,0,0.95), -2px 2px 4px rgba(0,0,0,0.95), 0 0 8px rgba(0,0,0,0.8)',
                      whiteSpace: 'pre-line',
                      maxWidth: '98vw',
                      lineHeight: '1.2',
                      overflowWrap: 'normal',
                      wordBreak: 'normal'
                    }}
                    dangerouslySetInnerHTML={{ __html: currentSubtitle }}
                  />
                </div>
              )}
            </>
          ) : clip.video_url ? (
            <video
              ref={videoRef as any}
              className="w-full h-full object-contain"
              controls
              src={clip.video_url}
              onPlay={() => {
                // Incrementar view apenas na primeira vez que o vídeo é reproduzido
                if (!hasIncrementedView && id) {
                  incrementView(id);
                  setHasIncrementedView(true);
                }
              }}
            />
          ) : (
            <div style={{ backgroundImage: `url("${clip.thumbnail}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} className="w-full h-full">
              <div className="absolute inset-0 flex items-center justify-center group cursor-pointer">
                <button className="flex shrink-0 items-center justify-center rounded-full size-20 bg-black/50 text-white backdrop-blur-sm group-hover:bg-primary transition-all duration-300 shadow-lg group-hover:scale-110">
                  <span className="material-symbols-outlined text-5xl">play_arrow</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Instructions Panel */}
        <div className="bg-[#111a22] rounded-lg p-6 border border-[#324d67]">
          <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined">info</span>
            Como usar o player
          </h3>

          {/* YouTube Explanation */}
          <div className="mb-4 p-4 bg-primary/10 border border-primary/30 rounded-lg">
            <p className="text-sm text-gray-300">
              <strong className="text-primary">📺 Sobre o vídeo:</strong><br />
              O vídeo está hospedado no YouTube, mas as legendas são <strong>customizadas e exclusivas</strong> desta plataforma.<br />
              Elas não têm relação com as legendas do YouTube e foram criadas especialmente para você!
            </p>
          </div>

          {/* Saved Preferences Info */}
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-sm text-gray-300">
              <strong className="text-green-400">💾 Dica:</strong> Suas preferências de legenda (tamanho, cor, posição) são salvas automaticamente e mantidas em tela cheia!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary">play_arrow</span>
              <div>
                <strong className="text-white">Play/Pause:</strong> Clique no botão de play na barra de controles (passe o mouse sobre o vídeo)
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary">timeline</span>
              <div>
                <strong className="text-white">Barra de progresso:</strong> Clique ou arraste na barra para navegar para qualquer parte do vídeo
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary">replay_10</span>
              <div>
                <strong className="text-white">Voltar/Avançar:</strong> Use os botões para voltar ou avançar 10 segundos
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary">sync</span>
              <div>
                <strong className="text-white">Sincronização:</strong> Ajuste o valor (em segundos) se a legenda estiver adiantada ou atrasada.
                <span className="text-primary"> Dica: geralmente 0.5s é suficiente, pode variar conforme o dispositivo.</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary">text_fields</span>
              <div>
                <strong className="text-white">Tamanho da legenda:</strong> Ajuste o slider para aumentar ou diminuir o tamanho do texto (14-80px)
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary">vertical_align_bottom</span>
              <div>
                <strong className="text-white">Posição:</strong> Ajuste a altura da legenda para não cobrir elementos importantes do vídeo
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary">palette</span>
              <div>
                <strong className="text-white">Cor da legenda:</strong> Clique no seletor de cor para escolher a cor do texto (padrão: amarelo)
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary">download</span>
              <div>
                <strong className="text-white">Download SRT:</strong> Baixe o arquivo de legendas para usar em outros players
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary">fullscreen</span>
              <div>
                <strong className="text-white">Tela cheia:</strong> Clique no botão de tela cheia para assistir em tela cheia com legendas
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts Section */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-400">keyboard</span>
              Atalhos de Teclado (PC)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
              {/* Coluna 1: Reprodução */}
              <div>
                <p className="text-white font-semibold mb-2">Reprodução</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-gray-700 rounded text-xs font-mono text-white">Espaço</kbd>
                    <span>Play / Pause</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-gray-700 rounded text-xs font-mono text-white">←</kbd>
                    <span>Voltar 5s</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-gray-700 rounded text-xs font-mono text-white">→</kbd>
                    <span>Avançar 5s</span>
                  </div>
                </div>
              </div>
              
              {/* Coluna 2: Volume */}
              <div>
                <p className="text-white font-semibold mb-2">Volume</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-gray-700 rounded text-xs font-mono text-white">M</kbd>
                    <span>Mute / Unmute</span>
                  </div>
                </div>
              </div>
              
              {/* Coluna 3: Legenda */}
              <div>
                <p className="text-white font-semibold mb-2">Legenda</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-gray-700 rounded text-xs font-mono text-white">+</kbd>
                    <span>Aumentar fonte</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-gray-700 rounded text-xs font-mono text-white">-</kbd>
                    <span>Diminuir fonte</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-gray-700 rounded text-xs font-mono text-white">↑</kbd>
                    <span>Subir posição</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-gray-700 rounded text-xs font-mono text-white">↓</kbd>
                    <span>Descer posição</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-4 py-4 items-start border-b border-white/10 pb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-white text-3xl md:text-4xl font-black leading-tight">{clip.title}</h1>
            <p className="text-[#92adc9] text-base">{clip.artist} • Legendado por {clip.subtitled_by || 'Equipe Letra na Tela'}</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {clip.description && (
            <div className="bg-[#111a22] rounded-lg p-6 border border-[#324d67]">
              <h3 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined">description</span>
                Sobre este clipe
              </h3>
              <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                {clip.description.split(/(https?:\/\/[^\s]+)/g).map((part, index) =>
                  /(https?:\/\/[^\s]+)/g.test(part) ? (
                    <a
                      key={index}
                      href={part}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline break-all"
                    >
                      {part}
                    </a>
                  ) : part
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 pt-10 border-t border-white/10">
          <h3 className="text-white text-xl font-bold mb-2">Comentários ({comments.length})</h3>
          <p className="text-gray-400 text-sm mb-6">
            💬 Gostou das legendas? Deixe seu comentário! Sua opinião é muito importante para nós.
          </p>

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
            {comments.filter(c => !c.parent_id).map(comment => {
              const replies = comments.filter(r => r.parent_id === comment.id);
              const isAdmin = profile?.roles?.includes('admin');

              return (
                <div key={comment.id} className="animate-fade-in">
                  {/* Main Comment */}
                  <div className="flex gap-4">
                    <div className="size-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold shrink-0">
                      {comment.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">{comment.user_name}</span>
                        <span className="text-xs text-gray-500">{timeAgo(comment.created_at)}</span>
                      </div>
                      <p className="text-gray-300 mt-1">{comment.content}</p>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-4 mt-2">
                        <button
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">reply</span>
                          Responder
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-xs text-red-500 hover:underline flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                            Deletar
                          </button>
                        )}
                      </div>

                      {/* Reply Form */}
                      {replyingTo === comment.id && (
                        <form onSubmit={(e) => handlePostComment(e, comment.id)} className="mt-4 bg-[#192633] rounded-lg p-4 border border-[#324d67]">
                          <div className="flex gap-3">
                            <div className="size-8 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                              {userName ? userName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div className="flex-1 flex flex-col gap-2">
                              <textarea
                                placeholder={`Respondendo para ${comment.user_name}...`}
                                required
                                value={replyText}
                                onChange={e => setReplyText(e.target.value)}
                                rows={2}
                                className="w-full bg-[#233648] border border-[#324d67] rounded-lg p-2 text-white text-sm focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => { setReplyingTo(null); setReplyText(''); }}
                                  className="px-4 h-8 rounded-lg bg-gray-600 hover:bg-gray-700 text-white text-xs font-bold transition-colors"
                                >
                                  Cancelar
                                </button>
                                <button
                                  type="submit"
                                  disabled={isPosting}
                                  className="px-4 h-8 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-colors disabled:opacity-50"
                                >
                                  {isPosting ? 'Enviando...' : 'Responder'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>

                  {/* Replies */}
                  {replies.length > 0 && (
                    <div className="ml-14 mt-4 space-y-4 border-l-2 border-[#324d67] pl-4">
                      {replies.map(reply => (
                        <div key={reply.id} className="flex gap-3">
                          <div className="size-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs shrink-0">
                            {reply.user_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-semibold text-sm">{reply.user_name}</span>
                              <span className="text-xs text-gray-500">{timeAgo(reply.created_at)}</span>
                            </div>
                            <p className="text-gray-300 mt-1 text-sm">{reply.content}</p>
                            {isAdmin && (
                              <button
                                onClick={() => handleDeleteComment(reply.id)}
                                className="text-xs text-red-500 hover:underline flex items-center gap-1 mt-1"
                              >
                                <span className="material-symbols-outlined text-sm">delete</span>
                                Deletar
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClipDetail;
