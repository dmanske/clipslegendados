
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clip } from '../../types';
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';

const Home: React.FC = () => {
  const [clips, setClips] = useState<Clip[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('[Home] searchQuery changed:', searchQuery);
    fetchClips();
  }, [searchQuery]); // Só re-executa quando searchQuery muda

  const fetchClips = React.useCallback(async () => {
    console.log('[Home] fetchClips called');
    setIsLoading(true);

    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase
          .from('clips')
          .select('*')
          .eq('status', 'Published');

        // Lógica de Pesquisa Avançada
        if (searchQuery.trim()) {
          const isYear = /^\d{4}$/.test(searchQuery.trim());
          if (isYear) {
            query = query.or(`title.ilike.%${searchQuery}%,artist.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
          } else {
            query = query.or(`title.ilike.%${searchQuery}%,artist.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
          }
        } else {
          // Se não tiver busca, ordenar por destaque e depois data
          query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching clips:', error);
          throw error;
        }

        if (data && data.length > 0) {
          setClips(data.map(item => ({
            id: item.id,
            title: item.title,
            artist: item.artist,
            thumbnail: item.thumbnail_url,
            views: item.views || 0,
            status: item.status,
            description: item.description || '',
            tags: item.tags || [],
            release_year: item.release_year,
            video_url: item.video_url,
            is_featured: item.is_featured // Importante para identificar o destaque
          })));
        } else {
          setClips([]);
        }
      } catch (error) {
        console.error('Error fetching clips:', error);
        setClips([]);
      }
    } else {
      setClips([]);
    }

    setIsLoading(false);
  }, []); // useCallback para evitar re-criação da função

  return (
    <div className="w-full max-w-6xl px-6 py-8">
      {/* Hero Section - Clipe em Destaque */}
      {!searchQuery && clips.length > 0 && (() => {
        const getYouTubeId = (url: string): string | null => {
          const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
          return match ? match[1] : null;
        };

        const videoId = clips[0].video_url ? getYouTubeId(clips[0].video_url) : null;

        return (
          <section className="mb-12 animate-fade-in">
            <div className="rounded-xl overflow-hidden relative min-h-[400px] md:min-h-[480px] shadow-2xl bg-black">
              {videoId ? (
                <>
                  {/* YouTube Video Background */}
                  <iframe
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
                    title={clips[0].title}
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                  />
                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 pointer-events-none" />
                </>
              ) : (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.7) 100%), url('${clips[0].thumbnail || 'https://via.placeholder.com/1280x720?text=Destaque'}')`
                  }}
                />
              )}

              <div className="absolute inset-0 flex flex-col justify-end items-start p-6 md:p-10 z-10">
                <div className="flex flex-col gap-3 text-left max-w-3xl">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold w-fit backdrop-blur-md border border-primary/20">
                    DESTAQUE
                  </span>
                  <h1 className="text-white text-3xl md:text-5xl font-black leading-tight tracking-tight drop-shadow-lg">
                    {clips[0].title}
                  </h1>
                  <h2 className="text-white/90 text-sm md:text-base font-normal leading-normal max-w-2xl drop-shadow-md">
                    {clips[0].artist} - Assista com legendas em português
                  </h2>
                </div>
                <Link
                  to={`/app/clip/${clips[0].id}`}
                  className="mt-6 flex items-center justify-center rounded-lg h-12 px-6 bg-primary hover:bg-primary/90 transition-all hover:scale-105 text-white text-base font-bold gap-2 shadow-[0_0_20px_rgba(19,127,236,0.3)]"
                >
                  <span className="material-symbols-outlined">play_arrow</span>
                  <span>Assistir Agora</span>
                </Link>
              </div>
            </div>
          </section>
        );
      })()}

      {/* Search Section */}
      <section className="mb-8 sticky top-[88px] z-40 bg-background-light dark:bg-background-dark py-4 -mx-6 px-6 md:static md:mx-0 md:px-0 md:bg-transparent md:py-0">
        <div className="relative max-w-2xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">search</span>
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 bg-white dark:bg-[#111a22] border border-gray-200 dark:border-[#324d67] rounded-xl leading-5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-lg transition-all"
              placeholder="Pesquisar por música, artista, ano (ex: 2023) ou trecho..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Clips Grid */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-gray-800 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">
            {searchQuery ? `Resultados para "${searchQuery}"` : 'Clipes em Destaque'}
          </h2>

          {!searchQuery && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mt-4 sm:mt-0">
              <button className="flex h-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white px-4 font-medium text-sm shadow-lg shadow-primary/20">
                Todos
              </button>
              <button className="flex h-9 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-[#111a22] border border-gray-200 dark:border-[#324d67] hover:border-primary text-gray-600 dark:text-gray-300 px-4 font-medium text-sm transition-colors">
                Pop
              </button>
              <button className="flex h-9 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-[#111a22] border border-gray-200 dark:border-[#324d67] hover:border-primary text-gray-600 dark:text-gray-300 px-4 font-medium text-sm transition-colors">
                Indie
              </button>
              <button className="flex h-9 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-[#111a22] border border-gray-200 dark:border-[#324d67] hover:border-primary text-gray-600 dark:text-gray-300 px-4 font-medium text-sm transition-colors">
                Rock
              </button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse flex flex-col gap-3">
                <div className="bg-gray-300 dark:bg-[#233648] aspect-video rounded-lg"></div>
                <div className="h-4 bg-gray-300 dark:bg-[#233648] rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 dark:bg-[#233648] rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : clips.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {clips.map((clip) => {
              const thumbnailUrl = clip.thumbnail || (clip.video_url && clip.video_url.includes('youtube')
                ? `https://img.youtube.com/vi/${clip.video_url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]}/maxresdefault.jpg`
                : 'https://via.placeholder.com/640x360?text=Sem+Thumbnail');

              return (
                <Link
                  to={`/app/clip/${clip.id}`}
                  key={clip.id}
                  className="group relative flex flex-col gap-3 rounded-lg overflow-hidden cursor-pointer animate-fade-in"
                >
                  <div className="relative aspect-video bg-cover bg-center rounded-lg transition-transform duration-300 group-hover:scale-[1.02] shadow-md" style={{ backgroundImage: `url('${thumbnailUrl}')` }}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-5xl opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 duration-300 drop-shadow-lg">play_circle</span>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                      {clip.duration || '03:45'}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-gray-900 dark:text-white text-base font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">{clip.title}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-gray-500 dark:text-white/60 text-sm flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">music_note</span>
                        {clip.artist}
                      </p>
                      {clip.release_year && (
                        <span className="text-xs bg-white/5 text-white/50 px-1.5 py-0.5 rounded border border-white/10">
                          {clip.release_year}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-[#324d67] mb-4">
              {searchQuery ? 'manage_search' : 'video_library'}
            </span>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {searchQuery ? 'Nenhum resultado encontrado' : 'Nenhum clipe disponível'}
            </h3>
            <p className="text-gray-500 dark:text-[#92adc9]">
              {searchQuery
                ? `Não encontramos nada para "${searchQuery}". Tente buscar pelo ano, nome da música ou artista.`
                : 'Ainda não há clipes publicados. Volte em breve!'}
            </p>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="mt-4 text-primary font-bold hover:underline">
                Limpar pesquisa
              </button>
            )}
          </div>
        )}

        {clips.length > 0 && !searchQuery && (
          <div className="flex justify-center mt-12">
            <Link
              to="/app/library"
              className="flex items-center justify-center rounded-lg h-11 px-6 bg-primary hover:bg-primary/90 transition-colors text-white text-sm font-bold shadow-lg gap-2"
            >
              <span className="material-symbols-outlined">video_library</span>
              Ver Todos os Clipes
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
