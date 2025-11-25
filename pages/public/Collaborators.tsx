import React from 'react';

const FAVORITE_ARTISTS = [
  {
    name: "Elvis Presley",
    genre: "Rock and Roll",
    desc: "O Rei do Rock and Roll. Ícone cultural que revolucionou a música popular no século XX com seu estilo único e carisma incomparável.",
    img: "https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/9d9beaf1-272f-5d92-add2-a6fecb9c179a/2c60d9c8-128a-56cf-b285-d993bd1c64f3.jpg",
    imgPosition: "center",
    country: "🇺🇸 Estados Unidos",
    highlights: "Can't Help Falling in Love, Suspicious Minds, Jailhouse Rock"
  },
  {
    name: "Brandon Lake",
    genre: "Contemporary Christian Music",
    desc: "Cantor e compositor americano conhecido por seu trabalho com Maverick City Music e Bethel Music. Vencedor de múltiplos Grammy Awards.",
    img: "https://cdn-iledama.nitrocdn.com/WRlNaygPDLRwrIEvFlFzQtVwcilKJUBl/assets/images/optimized/rev-8ba3af5/delafontagency.com/wp-content/uploads/2024/11/brandon-lake-L5e.jpg",
    imgPosition: "center",
    country: "🇺🇸 Estados Unidos",
    highlights: "House of Miracles, Gratitude, RATTLE!"
  },
  {
    name: "Michael W. Smith",
    genre: "Contemporary Christian Music",
    desc: "Lenda da música cristã contemporânea com mais de 40 anos de carreira. Três vezes vencedor do Grammy e autor de clássicos atemporais.",
    img: "https://photos.bandsintown.com/large/17665643.jpeg",
    imgPosition: "center",
    country: "🇺🇸 Estados Unidos",
    highlights: "Place in This World, Friends, Above All"
  },
  {
    name: "Queen",
    genre: "Rock",
    desc: "Banda britânica lendária liderada por Freddie Mercury. Conhecidos por sua teatralidade, harmonias vocais complexas e hits inesquecíveis.",
    img: "https://teachrock.org/wp-content/uploads/Queen-1980.jpg",
    imgPosition: "center",
    country: "🇬🇧 Reino Unido",
    highlights: "Bohemian Rhapsody, We Are The Champions, Don't Stop Me Now"
  },
  {
    name: "Bon Jovi",
    genre: "Rock / Hard Rock",
    desc: "Banda americana de rock formada em 1983. Conhecidos por seus hinos de arena e baladas poderosas que definiram os anos 80 e 90.",
    img: "https://es.web.img3.acsta.net/pictures/18/09/18/15/54/1593305.jpg",
    imgPosition: "center",
    country: "🇺🇸 Estados Unidos",
    highlights: "Livin' on a Prayer, It's My Life, Always"
  },
  {
    name: "Bryan Adams",
    genre: "Rock / Pop Rock",
    desc: "Cantor, compositor e fotógrafo canadense. Suas baladas românticas e rock energético conquistaram o mundo desde os anos 80.",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/BryAdamsMargate130624_%2839_of_43%29_%2853789411882%29_Cropped.jpg/960px-BryAdamsMargate130624_%2839_of_43%29_%2853789411882%29_Cropped.jpg",
    imgPosition: "center top",
    country: "🇨🇦 Canadá",
    highlights: "Summer of '69, (Everything I Do) I Do It for You, Heaven"
  }
];

const Collaborators: React.FC = () => {
  return (
    <div className="w-full max-w-6xl px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-white text-4xl font-black mb-4">Artistas Favoritos</h1>
        <p className="text-[#92adc9]">Os artistas que inspiram e moldam a trilha sonora da minha vida.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {FAVORITE_ARTISTS.map((artist, idx) => (
          <div key={idx} className="flex flex-col gap-4 p-6 bg-[#111a22]/50 rounded-xl border border-[#324d67] hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            {/* Artist Image */}
            <div className="relative">
              <div
                className="w-full aspect-square bg-cover rounded-lg border-2 border-transparent group-hover:border-primary transition-colors shadow-lg"
                style={{
                  backgroundImage: `linear-gradient(to bottom, transparent 60%, rgba(17, 26, 34, 0.9) 100%), url("${artist.img}")`,
                  backgroundPosition: artist.imgPosition || 'center',
                  backgroundColor: '#1a1a2e'
                }}
              >
                {/* Fallback gradient if image fails */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-lg -z-10" />
              </div>
              <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-xs text-white font-medium">{artist.country}</span>
              </div>
            </div>

            {/* Artist Info */}
            <div className="flex-1">
              <h3 className="text-white text-xl font-black mb-1">{artist.name}</h3>
              <p className="text-primary text-xs font-bold uppercase tracking-wider mb-3">{artist.genre}</p>
              <p className="text-[#92adc9] text-sm leading-relaxed mb-3">{artist.desc}</p>

              {/* Highlights */}
              <div className="bg-[#192633] rounded-lg p-3 border border-[#324d67]/50">
                <p className="text-xs text-gray-500 font-semibold mb-1">Destaques:</p>
                <p className="text-xs text-gray-300 leading-relaxed">{artist.highlights}</p>
              </div>
            </div>

            {/* Music Note Icon */}
            <div className="flex justify-center pt-2">
              <span className="material-symbols-outlined text-primary/30 text-4xl group-hover:text-primary/60 transition-colors">music_note</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-12 text-center">
        <div className="inline-block bg-[#111a22] rounded-lg p-6 border border-[#324d67]">
          <span className="material-symbols-outlined text-primary text-3xl mb-2">favorite</span>
          <p className="text-gray-300 text-sm max-w-2xl">
            Cada um desses artistas tem um lugar especial na minha jornada musical.
            Suas músicas me inspiram a criar legendas que capturem a essência e emoção de cada performance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Collaborators;