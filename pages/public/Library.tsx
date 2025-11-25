import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clip } from '../../types';
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';

const Library: React.FC = () => {
  const [clips, setClips] = useState<Clip[]>([]);
  const [allClips, setAllClips] = useState<Clip[]>([]);
  const [artists, setArtists] = useState<string[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'title'>('recent');

  useEffect(() => {
    fetchClips();
  }, [searchQuery, sortBy, selectedArtist]);

  const fetchClips = async () => {
    setIsLoading(true);

    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase
          .from('clips')
          .select('*')
          .eq('status', 'Published');

        // Filtro por artista
        if (selectedArtist) {
          query = query.eq('artist', selectedArtist);
        }

        // Busca
        if (searchQuery.trim()) {
          query = query.or(`title.ilike.%${searchQuery}%,artist.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
        }

        // Ordenação
        switch (sortBy) {
          case 'popular':
            query = query.order('views', { ascending: false });
            break;
          case 'title':
            query = query.order('title', { ascending: true });
            break;
          case 'recent':
          default:
            query = query.order('created_at', { ascending: false });
            break;
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching clips:', error);
          throw error;
        }

        if (data && data.length > 0) {
          const mappedClips = data.map(item => ({
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
            is_featured: item.is_featured
          }));
          
          setClips(mappedClips);
          
          // Extrair lista única de artistas (apenas na primeira carga)
          if (!selectedArtist && !searchQuery && allClips.length === 0) {
            setAllClips(mappedClips);
            const uniqueArtists = Array.from(new Set(data.map(item => item.artist).filter(Boolean))).sort();
            setArtists(uniqueArtists);
          }
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
  };

  return (
    <div className="w-full max-w-7xl px-6 py-8">
      <div className="flex gap-8">
        {/* Sidebar - Artists Filter */}
        {artists.length > 0 && (
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h3 className="text-gray-900 dark:text-white text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">person</span>
                Artistas
              </h3>
              <div className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                <button
                  onClick={() => setSelectedArtist(null)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    !selectedArtist
                      ? 'bg-primary/10 text-primary font-semibold border-l-2 border-primary'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#111a22] hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <span>Todos os Artistas</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-[#233648] text-gray-600 dark:text-gray-400">
                    {allClips.length}
                  </span>
                </button>
                {artists.map((artist) => {
                  const artistClipCount = allClips.filter(c => c.artist === artist).length;
                  return (
                    <button
                      key={artist}
                      onClick={() => setSelectedArtist(artist)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        selectedArtist === artist
                          ? 'bg-primary/10 text-primary font-semibold border-l-2 border-primary'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#111a22] hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <span className="truncate">{artist}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-[#233648] text-gray-600 dark:text-gray-400 ml-2">
                        {artistClipCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-black leading-tight mb-2">
              Biblioteca de Clipes
            </h1>
            <p className="text-gray-500 dark:text-[#92adc9]">
              Navegue por todos os clipes legendados disponíveis
            </p>
          </div>

          {/* Mobile Artists Dropdown */}
          {artists.length > 0 && (
            <div className="lg:hidden mb-6">
              <select
                value={selectedArtist || ''}
                onChange={(e) => setSelectedArtist(e.target.value || null)}
                className="w-full px-4 py-3 bg-white dark:bg-[#111a22] border border-gray-200 dark:border-[#324d67] rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="">Todos os Artistas ({allClips.length})</option>
                {artists.map((artist) => {
                  const artistClipCount = allClips.filter(c => c.artist === artist).length;
                  return (
                    <option key={artist} value={artist}>
                      {artist} ({artistClipCount})
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {/* Search and Filters */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">search</span>
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-3 bg-white dark:bg-[#111a22] border border-gray-200 dark:border-[#324d67] rounded-lg leading-5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Buscar por título, artista ou ano..."
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

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular' | 'title')}
          className="px-4 py-3 bg-white dark:bg-[#111a22] border border-gray-200 dark:border-[#324d67] rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        >
          <option value="recent">Mais Recentes</option>
          <option value="popular">Mais Populares</option>
          <option value="title">Ordem Alfabética</option>
        </select>
      </div>

          {/* Results Count */}
          {!isLoading && clips.length > 0 && (
            <div className="mb-4 flex items-center gap-2 text-sm text-gray-500 dark:text-[#92adc9]">
              {selectedArtist && (
                <span className="flex items-center gap-1 text-primary font-semibold">
                  <span className="material-symbols-outlined text-base">filter_alt</span>
                  {selectedArtist}
                </span>
              )}
              <span>
                {searchQuery 
                  ? `${clips.length} resultado(s) encontrado(s)` 
                  : selectedArtist 
                    ? `${clips.length} clipe(s) de ${selectedArtist}`
                    : `${clips.length} clipe(s) disponível(is)`
                }
              </span>
            </div>
          )}

              {/* Clips Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="animate-pulse flex flex-col gap-3">
              <div className="bg-gray-300 dark:bg-[#233648] aspect-video rounded-lg"></div>
              <div className="h-4 bg-gray-300 dark:bg-[#233648] rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 dark:bg-[#233648] rounded w-1/2"></div>
            </div>
          ))}
            </div>
          ) : clips.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  {clip.is_featured && (
                    <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                      DESTAQUE
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-5xl opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 duration-300 drop-shadow-lg">play_circle</span>
                  </div>
                  {clip.views > 0 && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">visibility</span>
                      {clip.views.toLocaleString()}
                    </div>
                  )}
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
              ? `Não encontramos nada para "${searchQuery}". Tente buscar por outro termo.`
              : 'Ainda não há clipes publicados. Volte em breve!'}
          </p>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="mt-4 text-primary font-bold hover:underline">
              Limpar pesquisa
              </button>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Library;
