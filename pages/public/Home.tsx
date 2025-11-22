import React from 'react';
import { Link } from 'react-router-dom';
import { Clip } from '../../types';

const FEATURED_CLIPS: Clip[] = [
  {
    id: '1',
    title: 'Billie Eilish - What Was I Made For?',
    artist: 'Billie Eilish',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC78NJd33WZnRc37NkKjcitxj0cYTlGeZyjmzTuud5Zm3D0i3UA7M2KMcntfGCD8hZvRe14RVYxmvrvzmownjnrJSKst3MAB30ILsugzZLnEqEmeBG_ftsYig4VjKgxKxxBYZXGjewqFVmc2egdxc3vmlFRestUsq3aPtGVAB8vIoMnCNxNouixnTfdcvnKYVDtLnwdKkR5RD9wuGEEGh8jWWCT7NMjfNOPIdHtc6YpLhJflWdPWMr5OAYqjti7qjisPaIRz0s3k4xZ',
    views: 200000,
    status: 'Published',
    description: '',
    tags: []
  },
  {
    id: '2',
    title: 'The Weeknd - Blinding Lights',
    artist: 'The Weeknd',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-YgjfrrbIcU4J7b-LqBqrXnhPDBnUP1dnyfJh1sl96pZolVxezsDm9gBoQXityfSEHH7bUFqcKFMcfZ-LY4Orf1N8hk2YjSGhphh2XoffJt51PO1LY2Hx9QmGp2EVep_TctABsa_cafoa7vmxt3KfnhrCUaXdOg8bnDiaDBj6v_Htr5b95fJj0oPk7Xn--VV0gsb1Ft0n3ra87OEZOst5-vYMWKYtrZv8xzgZkBw3uOQv0BvUIeuOHMsqB9m5pBBx3hUUz_kyN2nd',
    views: 150000,
    status: 'Published',
    description: '',
    tags: []
  },
  {
    id: '3',
    title: "Dua Lipa - Don't Start Now",
    artist: 'Dua Lipa',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuBy-QjTrnyKR9QYdQ-St3tdc0moCyeIZI3NBqmA47w9lB0fmw8fczLf8lPUASF1KGjHMxGWph_TsIWQSUzUihq0jD9i4lsv-EkZQwJhotvq1Pg4-xKZKMPorjSgC9EjNH56uv_xFP6Hq4uH4Cwg8Vd20bAL_OrS8Rzqc_0g12UM3uw7B8o6zMI-TsziAA5ZHi83brEIUe6mDi0WWzKzRCrgptlCv8xxgfDIPjANLYfd2lOYrDWq7czEeNpuwJ1j_XJbnMfYxNP77a',
    views: 180000,
    status: 'Published',
    description: '',
    tags: []
  },
  {
    id: '4',
    title: 'Harry Styles - Watermelon Sugar',
    artist: 'Harry Styles',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPaicr_LZTyCPqZNuHlYP7zbL4uxMWIcLoDSpAyyqqOlnLmAHZB5q4nzCg0BxviN3s166Z4Yl8wVIRzOcomoAXUkpmiw9utZmW4kB1XVYo6CLS7Xa5GzU3qPng3Sz0DkBJ003TWX0mIQsgh2s8gTOczxIM5fMzujR1sZ2jRAI6_bYcvAm6feEuoKWxJb7Me2i9CIb1vh5u5i7t4YvuBGmcBJtsWNkZRLAKFqaZ3WCDbeWUmfaVFF5UfM2CX0jsXsfLff8pBIgqE5ly',
    views: 220000,
    status: 'Published',
    description: '',
    tags: []
  },
  {
    id: '5',
    title: 'Glass Animals - Heat Waves',
    artist: 'Glass Animals',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVDZNxbhcqU5LB1w-JZIgvJu18oh-hNSKYf3sXKiiBBzXkLY_qRvKJSZiEs_huEqDL4JW5VXnAuOA4rEd_7RaQ0GGJww0XOxLdhurOlcbZRaVzgnbSF6bQ6x2ro6y0U-zohAPq6IgMFXne1QyIUNrBGNBnIoKIcQ3w1eDswAv7V8LOHmh9OEv4upOyJzTl1qkb6QrP0GO0dxNh02wyml4PmXcsK6jwjVyv8uTcEpr5DLxkvQI9aAUl7TrL8_fE-DpTM460hQoqtESM',
    views: 120000,
    status: 'Published',
    description: '',
    tags: []
  },
  {
    id: '6',
    title: 'Coldplay - Higher Power',
    artist: 'Coldplay',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA13ETzicAUWKRJ0XfJb46ONVwNmp9iYlEw5IbcZ6AU1y9vDZ1CmwJQeVaGkHZr_3rDPl29aE2nJYRz8wKIflFBCYkS-sZUbzMOb6CMzWNu69xeaLznQg1d-0LhGSfMlR5vwEU7Y4OK4_0ad84lB-5Vnhh1RJmJh2NG9n4JppBP2R1qHMHg_J3pCqNB5qodJIj9SYgFthAlHIrDzYJnroWpVuZ_P2w_OkiWTm32ekPM5AbElLz4yPidaDwhxRKc8WFPdhEGBAz6L-2o',
    views: 160000,
    status: 'Published',
    description: '',
    tags: []
  },
  {
    id: '7',
    title: 'Imagine Dragons - Believer',
    artist: 'Imagine Dragons',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxKEcbTyAkeLgd-5tuR0zADz7BsKBtdz5lQ4w-0WkUKJRbJvit83yEBF0yKi-zwItr0gK7y34AZBTaU1C2Xh35XbhndGSbn2KzB7mkQ3BWRPSzuFKpuvYM4FsdQjrqo4maMHHWAB64vK_t7Zt7nvwjVX7GqDAlmwiouv_YMcHTBCsp_t3fZAmt0xlgIO2NFHv7Z8K8e15UZrZ9mZccYrAA0t3lH0hGXtLAc47txAgCBG7McLxrpj8q5Oj4Saarfxm5W0fGVZc3vyoG',
    views: 250000,
    status: 'Published',
    description: '',
    tags: []
  },
  {
    id: '8',
    title: 'Taylor Swift - Anti-Hero',
    artist: 'Taylor Swift',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGvyZ4Ps00OReg-EoAl_WDn_cMX9-uSGqIBx_3iyzS-Ga6FI2i01TzMI0fcDvXUyg0A3Vlz4911NWz-8WN_bHHsQkTPP6SqJBgEe4Oy9JiMJApKkGf_0iaLCZ2tAsUxtvVKvS1SWPjswS7xPWzG585jGeyVRM7b5PQnxBJS6ZyVXJEr3or6BWaekGGoVNs4LQBxLSTK5gkTqLCr8W1XHxKbZzPLjYdvBGHgTt4QTrDfGmDBWcZU2sWV2-nsTEUTbX3GJPfyFu3k3VM',
    views: 300000,
    status: 'Published',
    description: '',
    tags: []
  }
];

const Home: React.FC = () => {
  return (
    <div className="w-full max-w-6xl px-6 py-8">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="rounded-xl overflow-hidden relative min-h-[480px] bg-cover bg-center" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.6) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuAhCDsZjKnpI6A0oBEU6s12TpnTf61obXtx6EPrPhiDYXA8q5nLysCpHLbYOkBjkLc6abG34ZgX9TaQHcyLXcw5GpWLR52EZ_MenBz4T1UKWyJjT89EK6g-aXdLW9dZHJZCQ3W4OA4o4VvUd-5hBpobqUm7RX3iwR3lEG1Y4fwfbfVpTb_Xtqv6XC6LqnmG2hFUBQlRv_u6wymgpiiCD7B_VtUwQl5m6Y5wrvplMFG-ATktad924xvqOorh-_OUWdSYfHp3kroEBdTD')`}}>
          <div className="absolute inset-0 flex flex-col justify-end items-start p-6 md:p-10">
             <div className="flex flex-col gap-3 text-left max-w-3xl">
                <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-tight drop-shadow-lg">
                  Último Lançamento: Aurora - Your Blood
                </h1>
                <h2 className="text-white/90 text-sm md:text-base font-normal leading-normal max-w-2xl drop-shadow-md">
                  Mergulhe na jornada visual e lírica do novo clipe de Aurora. Uma experiência cinematográfica com legendas em português.
                </h2>
             </div>
             <Link to="/clip/aurora-your-blood" className="mt-6 flex items-center justify-center rounded-lg h-12 px-6 bg-primary hover:bg-primary/90 transition-colors text-white text-base font-bold gap-2 shadow-lg">
                <span className="material-symbols-outlined">play_arrow</span>
                <span>Assistir Agora</span>
             </Link>
          </div>
        </div>
      </section>

      {/* Clips Grid */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Clipes em Destaque</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button className="flex h-9 shrink-0 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors px-4">
              <p className="text-white text-sm font-medium">Mais Recentes</p>
            </button>
            <button className="flex h-9 shrink-0 items-center justify-center rounded-lg bg-white/5 hover:bg-white/20 transition-colors px-4">
              <p className="text-white/70 text-sm font-medium">Mais Vistos</p>
            </button>
            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white/5 hover:bg-white/20 transition-colors pl-4 pr-3">
              <p className="text-white/70 text-sm font-medium">Gênero</p>
              <span className="material-symbols-outlined text-white/70 text-xl">expand_more</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_CLIPS.map((clip) => (
            <Link to={`/clip/${clip.id}`} key={clip.id} className="group relative flex flex-col gap-3 rounded-lg overflow-hidden cursor-pointer">
              <div className="relative aspect-video bg-cover bg-center rounded-lg transition-transform duration-300 group-hover:scale-105" style={{backgroundImage: `url('${clip.thumbnail}')`}}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-5xl opacity-0 group-hover:opacity-100 transition-opacity scale-90 group-hover:scale-100 duration-300">play_circle</span>
                </div>
              </div>
              <div>
                <h3 className="text-white text-base font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">{clip.title}</h3>
                <p className="text-white/60 text-sm">{clip.artist}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <button className="flex items-center justify-center rounded-lg h-11 px-6 bg-white/10 hover:bg-white/20 transition-colors text-white text-sm font-bold">
            Carregar Mais
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;