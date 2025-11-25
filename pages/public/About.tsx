import React from 'react';

const About: React.FC = () => {
  return (
    <div className="w-full max-w-4xl px-6 py-8">
       <section className="flex flex-col items-center text-center gap-6 mb-12">
          <img 
            src="/daniel.jpeg" 
            alt="Daniel" 
            className="rounded-full h-32 w-32 md:h-48 md:w-48 border-4 border-primary/20 shadow-2xl object-cover"
          />
          <div className="max-w-2xl">
            <h1 className="text-white text-3xl md:text-4xl font-bold mb-4">Conheça o Criador por Trás das Legendas</h1>
            <p className="text-[#92adc9] text-lg">Olá! Sou Daniel, apaixonado por música e pela arte de conectar pessoas através de legendas bem-feitas.</p>
          </div>
       </section>

       <section className="bg-[#111a22] border border-[#324d67] rounded-2xl p-8 mb-8 shadow-sm">
          <h2 className="text-white text-2xl font-bold mb-6">Minha História com a Música</h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>Desde criança, a música e os videoclipes foram minha grande paixão. Descobri que traduzir letras é uma forma incrível de aprender inglês enquanto me conecto profundamente com as músicas que amo. Cada tradução é uma jornada de descoberta, onde desvendo não apenas palavras, mas histórias, emoções e culturas.</p>
            <p>A motivação para criar este espaço veio da vontade de compartilhar essa experiência com mais pessoas, garantindo que cada legenda capture a essência original da obra. Acredito que uma boa tradução vai além do literal - é sobre transmitir o ritmo, a emoção e a intenção do artista.</p>
          </div>
       </section>

       <section className="bg-[#111a22] border border-[#324d67] rounded-2xl p-8 shadow-sm">
          <h2 className="text-white text-2xl font-bold mb-6">Além da Música</h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>Sou flamenguista de coração ❤️🖤, apaixonado por viajar e conhecer novos lugares, culturas e pessoas. Mas acima de tudo, sou apaixonado pela minha família, que é minha maior inspiração e motivação em tudo que faço.</p>
            <p>Este projeto é uma combinação de todas as minhas paixões: música, idiomas, tecnologia e o desejo de criar algo que possa tocar e inspirar outras pessoas. Cada clipe legendado aqui é feito com dedicação e carinho, pensando em proporcionar a melhor experiência possível.</p>
          </div>
       </section>
    </div>
  );
};

export default About;