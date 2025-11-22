
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clip } from '../../types';
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';

// Fallback data for when Supabase is not connected or empty
const MOCK_CLIPS: Clip[] = [
  {
    id: '1',
    title: 'Billie Eilish - What Was I Made For?',
    artist: 'Billie Eilish',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC78NJd33WZnRc37NkKjcitxj0cYTlGeZyjmzTuud5Zm3D0i3UA7M2KMcntfGCD8hZvRe14RVYxmvrvzmownjnrJSKst3MAB30ILsugzZLnEqEmeBG_ftsYig4VjKgxKxxBYZXGjewqFVmc2egdxc3vmlFRestUsq3aPtGVAB8vIoMnCNxNouixnTfdcvnKYVDtLnwdKkR5RD9wuGEEGh8jWWCT7NMjfNOPIdHtc6YpLhJflWdPWMr5OAYqjti7qjisPaIRz0s3k4xZ',
    views: 200000,
    status: 'Published',
    description: '',
    tags: ['pop', 'sad'],
    release_year: 2023
  },
  {
    id: '2',
    title: 'The Weeknd - Blinding Lights',
    artist: 'The Weeknd',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-YgjfrrbIcU4J7b-LqBqrXnhPDBnUP1dnyfJh1sl96pZolVxezsDm9gBoQXityfSEHH7bUFqcKFMcfZ-LY4Orf1N8hk2YjSGhphh2XoffJt51PO1LY2Hx9QmGp2EVep_TctABsa_cafoa7vmxt3KfnhrCUaXdOg8bnDiaDBj6v_Htr5b95fJj0oPk7Xn--VV0gsb1Ft0n3ra87OEZOst5-vYMWKYtrZv8xzgZkBw3uOQv0BvUIeuOHMsqB9m5pBBx3hUUz_kyN2nd',
    views: 150000,
    status: 'Published',
    description: '',
    tags: ['pop', 'synthwave'],
    release_year: 2019
  },
  {
    id: '3',
    title: "Dua Lipa - Don't Start Now",
    artist: 'Dua Lipa',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuBy-QjTrnyKR9QYdQ-St3tdc0moCyeIZI3NBqmA47w9lB0fmw8fczLf8lPUASF1KGjHMxGWph_TsIWQSUzUihq0jD9i4lsv-EkZQwJhotvq1Pg4-xKZKMPorjSgC9EjNH56uv_xFP6Hq4uH4Cwg8Vd20bAL_OrS8Rzqc_0g12UM3uw7B8o6zMI-TsziAA5ZHi83brEIUe6mDi0WWzKzRCrgptlCv8xxgfDIPjANLYfd2lOYrDWq7czEeNpuwJ1j_XJbnMfYxNP77a',
    views: 180000,
    status: 'Published',
    description: '',
    tags: ['pop', 'disco'],
    release_year: 2019
  },
  {
    id: '4',
    title: 'Harry Styles - Watermelon Sugar',
    artist: 'Harry Styles',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPaicr_LZTyCPqZNuHlYP7zbL4uxMWIcLoDSpAyyqqOlnLmAHZB5q4nzCg0BxviN3s166Z4Yl8wVIRzOcomoAXUkpmiw9utZmW4kB1XVYo6CLS7Xa5GzU3qPng3Sz0DkBJ003TWX0mIQsgh2s8gTOczxIM5fMzujR1sZ2jRAI6_bYcvAm6feEuoKWxJb7Me2i9CIb1vh5u5i7t4YvuBGmcBJtsWNkZRLAKFqaZ3WCDbeWUmfaVFF5UfM2CX0jsXsfLff8pBIgqE5ly',
    views: 220000,
    status: 'Published',
    description: '',
    tags: ['pop', 'rock'],
    release_year: 2019
  },
  {
    id: '5',
    title: 'Glass Animals - Heat Waves',
    artist: 'Glass Animals',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVDZNxbhcqU5LB1w-JZIgvJu18oh-hNSKYf3sXKiiBBzXkLY_qRvKJSZiEs_huEqDL4JW5VXnAuOA4rEd_7RaQ0GGJww0XOxLdhurOlcbZRaVzgnbSF6bQ6x2ro6y0U-zohAPq6IgMFXne1QyIUNrBGNBnIoKIcQ3w1eDswAv7V8LOHmh9OEv4upOyJzTl1qkb6QrP0GO0dxNh02wyml4PmXcsK6jwjVyv8uTcEpr5DLxkvQI9aAUl7TrL8_fE-DpTM460hQoqtESM',
    views: 120000,
    status: 'Published',
    description: '',
    tags: ['indie', 'alternative'],
    release_year: 2020
  }
];

const Home: React.FC = () => {
  const [clips, setClips] = useState<Clip[]>(MOCK_CLIPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchClips();
  }, [searchQuery]);

  const fetchClips = async () => {
    setIsLoading(true);
    
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase
          .from('clips')
          .select('*')
          .eq('status', 'Published')
          .order('created_at', { ascending: false });

        // Lógica de Pesquisa Avançada
        if (searchQuery.trim()) {
          // Verifica se a busca é um ano (4 dígitos)
          const isYear = /^\d{4}$/.test(searchQuery.trim());

          if (isYear) {
              // Se for ano, busca na coluna release_year OU no título/descrição
              // Nota: Para usar .or com tipos diferentes (int vs text) pode ser tricky, 
              // então priorizamos texto ou ano explicitamente.
              // Aqui usamos filtro de texto que cobre tudo.
              query = query.or(`title.ilike.%${searchQuery}%,artist.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
              // Idealmente, se tiver coluna release_year, filtraríamos também: .eq('release_year', parseInt(searchQuery))
              // Mas para simplicidade da query string única:
          } else {
              // Pesquisa insensível a maiúsculas/minúsculas no título, artista E descrição
              query = query.or(`title.ilike.%${searchQuery}%,artist.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
          }
        }

        const { data, error } = await query;

        if (error) throw error;

        if (data && data.length > 0) {
          setClips(data.map(item => ({
             id: item.id,
             title: item.title,
             artist: item.artist,
             thumbnail: item.thumbnail_url || MOCK_CLIPS[0].thumbnail,
             views: item.views || 0,
             status: item.status,
             description: item.description,
             tags: item.tags || [],
             release_year: item.release_year
          })));
        } else {
            if (searchQuery) setClips([]);
            else setClips(MOCK_CLIPS);
        }
      } catch (error) {
        console.error('Error fetching clips:', error);
        // Fallback em caso de erro no Supabase mas com busca local simples
        filterLocalData();
      }
    } else {
      // Lógica local para demonstração (sem supabase)
      await new Promise(resolve => setTimeout(resolve, 300));
      filterLocalData();
    }
    
    setIsLoading(false);
  };

  const filterLocalData = () => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = MOCK_CLIPS.filter(c => 
      c.title.toLowerCase().includes(lowerQuery) ||
      c.artist.toLowerCase().includes(lowerQuery) ||
      (c.release_year && c.release_year.toString().includes(lowerQuery)) ||
      (c.tags && c.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
    );
    setClips(filtered);
  };

  return (
    <div className="w-full max-w-6xl px-6 py-8">
      {/* Hero Section (Apenas visível se não estiver pesquisando) */}
      {!searchQuery && (
        <section className="mb-12 animate-fade-in">
            <div className="rounded-xl overflow-hidden relative min-h-[400px] md:min-h-[480px] bg-cover bg-center shadow-2xl" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.6) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuAhCDsZjKnpI6A0oBEU6s12TpnTf61obXtx6EPrPhiDYXA8q5nLysCpHLbYOkBjkLc6abG34ZgX9TaQHcyLXcw5GpWLR52EZ_MenBz4T1UKWyJjT89EK6g-aXdLW9dZHJZCQ3W4OA4o4VvUd-5hBpobqUm7RX3iwR3lEG1Y4fwfbfVpTb_Xtqv6XC6LqnmG2hFUBQlRv_u6wymgpiiCD7B_VtUwQl5m6Y5wrvplMFG-ATktad924xvqOorh-_OUWdSYfHp3kroEBdTD')`}}>
            <div className="absolute inset-0 flex flex-col justify-end items-start p-6 md:p-10 bg-gradient-to-t from-[#101922] via-transparent to-transparent">
                <div className="flex flex-col gap-3 text-left max-w-3xl">
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold w-fit backdrop-blur-md border border-primary/20">DESTAQUE DA SEMANA</span>
                    <h1 className="text-white text-3xl md:text-5xl font-black leading-tight tracking-tight drop-shadow-lg">
                    Aurora - Your Blood
                    </h1>
                    <h2 className="text-white/90 text-sm md:text-base font-normal leading-normal max-w-2xl drop-shadow-md">
                    Mergulhe na jornada visual e lírica do novo clipe de Aurora. Uma experiência cinematográfica com legendas em português.
                    </h2>
                </div>
                <Link to="/clip/aurora-your-blood" className="mt-6 flex items-center justify-center rounded-lg h-12 px-6 bg-primary hover:bg-primary/90 transition-all hover:scale-105 text-white text-base font-bold gap-2 shadow-[0_0_20px_rgba(19,127,236,0.3)]">
                    <span className="material-symbols-outlined">play_arrow</span>
                    <span>Assistir Agora</span>
                </Link>
            </div>
            </div>
        </section>
      )}

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
                {[1,2,3,4].map(i => (
                    <div key={i} className="animate-pulse flex flex-col gap-3">
                        <div className="bg-gray-300 dark:bg-[#233648] aspect-video rounded-lg"></div>
                        <div className="h-4 bg-gray-300 dark:bg-[#233648] rounded w-3/4"></div>
                        <div className="h-3 bg-gray-300 dark:bg-[#233648] rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        ) : clips.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {clips.map((clip) => (
                <Link to={`/clip/${clip.id}`} key={clip.id} className="group relative flex flex-col gap-3 rounded-lg overflow-hidden cursor-pointer animate-fade-in">
                <div className="relative aspect-video bg-cover bg-center rounded-lg transition-transform duration-300 group-hover:scale-[1.02] shadow-md" style={{backgroundImage: `url('${clip.thumbnail}')`}}>
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
            ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-[#324d67] mb-4">manage_search</span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Nenhum resultado encontrado</h3>
                <p className="text-gray-500 dark:text-[#92adc9]">Não encontramos nada para "{searchQuery}". <br/>Tente buscar pelo ano, nome da música ou artista.</p>
                <button onClick={() => setSearchQuery('')} className="mt-4 text-primary font-bold hover:underline">
                    Limpar pesquisa
                </button>
            </div>
        )}

        {clips.length > 0 && !searchQuery && (
            <div className="flex justify-center mt-12">
            <button className="flex items-center justify-center rounded-lg h-11 px-6 bg-white dark:bg-[#111a22] border border-gray-200 dark:border-[#324d67] hover:bg-gray-50 dark:hover:bg-[#233648] transition-colors text-gray-700 dark:text-white text-sm font-bold shadow-sm">
                Carregar Mais
            </button>
            </div>
        )}
      </section>
    </div>
  );
};

export default Home;
