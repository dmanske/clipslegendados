import React from 'react';

const About: React.FC = () => {
  return (
    <div className="w-full max-w-4xl px-6 py-12">
       <section className="flex flex-col items-center text-center gap-8 mb-16">
          <div 
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 md:h-48 md:w-48 border-4 border-primary/20 shadow-2xl" 
            style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBCkbouZzBXZ-afOFBgJESPsMZ6xFGIHp7A61U1dcpi-SpM8vBVXaxisUV2XJ7is5bGBEuHWiKvLhUyY-6tgztAAd13TEpEGmmN1k3VRfVP-fVDbIW8Ik004eNDL5XGKSAwvJWBoybNBn5C9vxZzGSyFQa-aTCVd_wiX7ofohqMaznuUw4DUfKUgMuxe_kMqSsfGnB9i15SaAPiuIVB9dWaXeot2OITSXN6D3xZXCDqZNxjgdGXrv9kJ8YNThRAWmvvJ1Qt9O-j0n9s')"}}
          ></div>
          <div className="max-w-2xl">
            <h1 className="text-white text-3xl md:text-4xl font-bold mb-4">Conheça o Criador por Trás das Legendas</h1>
            <p className="text-[#92adc9] text-lg">Olá! Sou o criador deste espaço, um apaixonado por música e pela arte de conectar pessoas através de legendas bem-feitas.</p>
          </div>
       </section>

       <section className="bg-[#111a22] border border-[#324d67] rounded-2xl p-8 mb-12 shadow-sm">
          <h2 className="text-white text-2xl font-bold mb-6">Minha História com a Música</h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>Desde criança, a música e os videoclipes foram minha grande paixão. A motivação para começar a legendar veio da vontade de compartilhar o significado profundo das letras com mais pessoas, garantindo que a tradução e a sincronização capturassem a essência original da obra.</p>
            <p>Acredito que uma boa legenda vai além da tradução literal. É sobre capturar o ritmo, a emoção e a intenção do artista, criando uma experiência imersiva para quem assiste. Cada clipe neste site é um projeto feito com dedicação e um profundo respeito pela arte.</p>
          </div>
       </section>

       <section className="flex flex-col gap-6">
          <h2 className="text-white text-2xl font-bold">Vamos Conversar?</h2>
          <div className="bg-white dark:bg-[#111a22] border border-gray-200 dark:border-[#324d67] rounded-2xl p-8 shadow-lg">
            <p className="text-gray-600 dark:text-gray-300 mb-6">Tem alguma sugestão, feedback ou gostaria de falar sobre uma colaboração? Ficarei feliz em ouvir você.</p>
            <form className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="name">Nome</label>
                <input className="form-input w-full rounded-lg border-gray-300 dark:border-[#324d67] bg-gray-50 dark:bg-[#233648] text-gray-900 dark:text-white focus:ring-primary focus:border-primary" id="name" placeholder="Seu nome completo" type="text"/>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">Email</label>
                <input className="form-input w-full rounded-lg border-gray-300 dark:border-[#324d67] bg-gray-50 dark:bg-[#233648] text-gray-900 dark:text-white focus:ring-primary focus:border-primary" id="email" placeholder="seu@email.com" type="email"/>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="message">Mensagem</label>
                <textarea className="form-textarea w-full rounded-lg border-gray-300 dark:border-[#324d67] bg-gray-50 dark:bg-[#233648] text-gray-900 dark:text-white focus:ring-primary focus:border-primary" id="message" placeholder="Escreva sua mensagem aqui..." rows={4}></textarea>
              </div>
              <button type="button" className="self-start bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-6 rounded-lg transition-colors mt-2">
                Enviar Mensagem
              </button>
            </form>
          </div>
       </section>
    </div>
  );
};

export default About;