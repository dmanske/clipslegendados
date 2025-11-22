import React from 'react';

const COLLABORATORS = [
  {
    name: "Ana Silva",
    role: "Legendista & Tradutora",
    desc: "Ana é especialista em tradução audiovisual, garantindo que cada legenda capture a essência do diálogo original com precisão e arte.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnRZYoXih5_0ShUQBSHA-kyiUdJOPvNezuE3DWrVS0HS2BGYB3x6A8EYM5OuZGzh2FNHl3J3cC5KfLAjq2C00-sNmNhgTU641GpJeX1KE3aZEizaI5ppcp_Pr4HC2ytK79dVQEtdg5UXqGyYcmEceMim3JgLpuUAwmyyeeBKLFqBcc-7PADp6STB8SZvbQ7hzTuaCmxRApgmQWz8-nDbdUH9GQ3q1BX6GuqYruKYJXbwzNUWg4W9wKASMXDPrcxZZIteEKGIAk12_V"
  },
  {
    name: "Carlos Pereira",
    role: "Editor de Vídeo",
    desc: "Com um olhar atento para detalhes, Carlos transforma clipes brutos em obras de arte polidas, sincronizando perfeitamente áudio e vídeo.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsa_lS29BSGRFTL1N-c4ibAx8aQ3XTEt3-XZTjD3d317hSwwwXiIq4hEscrJOFqIzBk_F6Z7zjOVpmRPc2AQkJ0KrAE_JetnkevHFYCtfx_9Mvvuy_MWOez7xqjrB19CS50p-uaBFfxNyZP-eW_p5XNmzSKv2VqK-YLBiZmS3lm2Gu3PukcEGNZNIEHWiJFzbOypV2E5j_lGF4zVmV0AOTsi5jlCsPQnoT3L0eyHGNtz0plRNSNvrIM3pagL_yEYt_lZ0AuqNdSUij"
  },
  {
    name: "Beatriz Costa",
    role: "Tradutora & Pesquisadora",
    desc: "Beatriz mergulha fundo no contexto cultural de cada clipe para fornecer traduções que são não apenas precisas, mas também ressonantes.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuClzY14vrjoU_QBSBSnjI0Xs2U-VCFpaxdzETtwY3VtCFl0PL6nY1rCPtaGkunjvfJa7CfbEe2b7RBZtx8pPQSM-aoEIUJuFVr5ejeHB1DkcZC27PifcqzMq30FJCd4Wgvhuqmp8xE5W4ZWobsWHuXG-4VqiZmfvU7pv5CvJKoF8L4SdYMVi-z8TQLFhJpUBICAxrogeb5I-iP7rPUjQ_hnd0WCCKspqcW94ib0uoRF69dEHY_jqSDE62waxfOzlNUVctPX1FcACG7-"
  },
  {
    name: "Daniel Souza",
    role: "Designer Gráfico",
    desc: "Daniel é o cérebro por trás da identidade visual do site, criando gráficos e miniaturas que capturam a atenção e contam uma história.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhDJwRyQPW8di5daTph4uPuUOFMoXNSOvxYDGDsOqHEiFOheQGJbKycp_YElo_-tHK8Yx3qlRUWiekFdwB96p4hIMCLdyvtpzxwS6bP1ttHF7FwO_FAxw8udXcwXeqKcMeQO9HmLqTm8aWCdonp2MoB9LxXiJlFWi8N5eLJGLVkKBqnzf-KRy5GTVa-EjsMIaRKsSiRy1aCl1RgwNe3yz65JblAtrpbJ9zwEXjOp3lAt8mAZmxIN6mqZxTUf89APBnqHsqj9GrDsME"
  },
  {
    name: "Juliana Martins",
    role: "Gerente de Comunidade",
    desc: "Juliana conecta a nossa comunidade, gerenciando feedbacks e garantindo que as vozes dos nossos usuários sejam ouvidas e valorizadas.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBaYlj12oHTLBjdU3QKnAPLSTZxmAYBD6DkZUnq-MnuTwwY5EAI4X91Ch8VqInRHaccKXBEc1_aKfEmbOhzl2BbfJWnsaTeXtNlPj5W2rQD1axGgMilp-hZDuS-PcDpO12jIXo4P9nmN5bA7EQ5kvuWdcpoK1SbxXD4OiWOeJUogjsiMp7qiktkF2iwwXIK1jGzpgr0xBJnVKfwuin8zYegzMMr2Tyyy8Bd7ZV4qBOWUD2C9534sTAgGlaWxuoGgnPukrBqY_Psqaf"
  },
  {
    name: "Ricardo Lima",
    role: "Engenheiro de Som",
    desc: "Ricardo garante que cada clipe tenha um som cristalino, cuidando da mixagem e masterização de áudio com expertise técnica.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJgWTP4Sa2EfEcBQIh6qD8azHPYIddeCNfeUmeRxuoheqPafM-mmiByGseqgqFKqWhylxN-fKnbP94pDVyau5T_E4R4G3T1EeNWj7geNvnu0MGfm_wD7qbvs8urQaEmXsVcbIkz49KP94tuKvolhYTSUQKcEhFlcV-zyafrbQBCQEt2fIZZ_fMlm5hD6O0-9klPp52xpYRxgy0W_MlXfV608z-0j5Woww65wUlmkFD78oXddQ1N3NQCwyT1r4qZXDQAod27xn17zX0"
  }
];

const Collaborators: React.FC = () => {
  return (
    <div className="w-full max-w-6xl px-6 py-12">
       <div className="text-center mb-12">
         <h1 className="text-white text-4xl font-black mb-4">Conheça Nossos Colaboradores</h1>
         <p className="text-[#92adc9]">As pessoas talentosas que tornam este projeto possível.</p>
       </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {COLLABORATORS.map((person, idx) => (
            <div key={idx} className="flex flex-col gap-4 text-center p-8 bg-[#111a22]/50 rounded-xl border border-[#324d67] hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
               <div className="px-4">
                  <div 
                    className="w-32 h-32 mx-auto bg-center bg-no-repeat aspect-square bg-cover rounded-full border-2 border-transparent group-hover:border-primary transition-colors" 
                    style={{backgroundImage: `url("${person.img}")`}}
                  ></div>
               </div>
               <div>
                 <h3 className="text-white text-lg font-bold">{person.name}</h3>
                 <p className="text-primary text-sm font-medium">{person.role}</p>
                 <p className="text-[#92adc9] text-sm mt-3 leading-relaxed">{person.desc}</p>
               </div>
               <div className="flex justify-center gap-4 mt-auto pt-4">
                  <a href="#" className="text-gray-500 hover:text-primary transition-colors"><span className="material-symbols-outlined">language</span></a>
                  <a href="#" className="text-gray-500 hover:text-primary transition-colors"><span className="material-symbols-outlined">alternate_email</span></a>
               </div>
            </div>
          ))}
       </div>
    </div>
  );
};

export default Collaborators;