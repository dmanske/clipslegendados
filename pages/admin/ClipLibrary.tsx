import React from 'react';
import { useNavigate } from 'react-router-dom';

const CLIPS = [
  { id: 1, title: "Aurora Live Performance", artist: "Artist A", status: "Publicado", date: "24 Out, 2024", thumb: "https://lh3.googleusercontent.com/aida-public/AB6AXuDAYuD-nuLwHb_1ZO-eTVacr0NQrE9CJ18K-z9hjz5LDKxp0l4Pr0Df66FwB_SbPDel4qPwAYrEXx6mCEbow37XIboXpbvYKWfjWz4QfXupleXM_FoE44R28cgEj52OZ2L80W-a31i_5PYLOkyjTsXHRXIIak9Ail9GnUTBgg76chVRha95Uo4ICGRMvDOqioO0nudmHsKm6eN5LznW93N8LesBBNfKX6f-m_BuJjMydyTzLZhA_imWFhZ2glDEgYv9R-ud2RsktmHT" },
  { id: 2, title: "The Night City", artist: "Movie Title B", status: "Rascunho", date: "22 Out, 2024", thumb: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKC5tAc0Pn7ID1ez_hCK2BldAcr-v-2IMW-x55krnwf2gdX_tD3bbcWP5W7CCpVKD6MsUvb0ZR-crVeYg0czgJYORb94IePMXSAyzsU52cKCC6GwjofNcjZRwS96kVI0VdTIvhaTsZBscAk55gR1Ga5vJaDFnJ_Wo_HZJgwwTZIK55gx1Ars7H4V_VDhsLqOkB4YSdbyZvj96wngkbE8r1C9VIt_6YJo5oZF8-0PZnKWHWmdE_VpmXkzJokcEeWi854H9pu4iHaKvq" },
  { id: 3, title: "Serenity Now", artist: "Artist C", status: "Publicado", date: "20 Out, 2024", thumb: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCYvRHThyBDBsH_p7KiPuEl07sEjKguZ-Rubt79newq1KwJZDzcwcHD6oydViGLkakdC6McHd8e7QtF8xUhei4jlJxEwVpLrln3epdx2-ZHASvwfTofSeQBUnn4IFywNTfMJH_aC5NpsK-BnZqnHYnDilLYz3jCOQUPQw8gJ-l_ctqDHxi9PDEh0hlGperHJpZTmXbLwdaGcEMoNVHU_f6Xpuie3uJK2syhG68YWrDWdmea6-MwQaXyqMboqgBajy3YKIAbVsYBmRM" },
];

const ClipLibrary: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
         <div>
             <h1 className="text-gray-900 dark:text-white text-3xl font-black leading-tight">Biblioteca de Clipes</h1>
             <p className="text-gray-500 dark:text-[#92adc9]">Gerencie sua coleção de vídeos</p>
         </div>
         <button onClick={() => navigate('/admin/create')} className="flex items-center justify-center px-4 h-10 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors gap-2">
            <span className="material-symbols-outlined">add</span>
            Adicionar Novo Clipe
         </button>
      </div>

      <div className="bg-white dark:bg-[#111a22] border border-gray-200 dark:border-[#324d67] rounded-xl overflow-hidden flex-1 flex flex-col">
         {/* Toolbar */}
         <div className="p-4 border-b border-gray-200 dark:border-[#324d67] flex gap-4">
             <div className="relative flex-1 max-w-md">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                <input type="text" placeholder="Buscar clipes..." className="w-full pl-10 pr-4 h-10 bg-gray-50 dark:bg-[#233648] border-none rounded-lg text-sm text-white placeholder-gray-400 focus:ring-1 focus:ring-primary" />
             </div>
             <select className="h-10 bg-gray-50 dark:bg-[#233648] border-none rounded-lg text-sm text-gray-400 px-4 focus:ring-1 focus:ring-primary">
                <option>Todos os Status</option>
                <option>Publicado</option>
                <option>Rascunho</option>
             </select>
         </div>

         {/* Table Header */}
         <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 dark:bg-[#192633] border-b border-gray-200 dark:border-[#324d67] text-xs font-bold text-gray-500 dark:text-[#92adc9] uppercase tracking-wider">
            <div className="col-span-5">Info do Clipe</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3">Data de Adição</div>
            <div className="col-span-2 text-right">Ações</div>
         </div>

         {/* Table Body */}
         <div className="overflow-y-auto flex-1">
             {CLIPS.map((clip) => (
                 <div key={clip.id} onClick={() => navigate(`/admin/edit/${clip.id}`)} className="grid grid-cols-12 gap-4 p-4 items-center border-b border-gray-200 dark:border-[#324d67] hover:bg-gray-50 dark:hover:bg-[#233648]/50 transition-colors cursor-pointer">
                     <div className="col-span-5 flex items-center gap-4">
                         <img src={clip.thumb} alt="" className="w-20 h-12 object-cover rounded bg-gray-800" />
                         <div className="min-w-0">
                             <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{clip.title}</h4>
                             <p className="text-xs text-gray-500 dark:text-[#92adc9]">{clip.artist}</p>
                         </div>
                     </div>
                     <div className="col-span-2">
                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${clip.status === 'Publicado' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                             {clip.status}
                         </span>
                     </div>
                     <div className="col-span-3 text-sm text-gray-500 dark:text-[#92adc9]">{clip.date}</div>
                     <div className="col-span-2 flex justify-end gap-2">
                         <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#324d67] rounded-lg text-gray-400 hover:text-primary transition-colors">
                             <span className="material-symbols-outlined text-lg">edit</span>
                         </button>
                         <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#324d67] rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                             <span className="material-symbols-outlined text-lg">delete</span>
                         </button>
                     </div>
                 </div>
             ))}
         </div>
      </div>
    </div>
  );
};

export default ClipLibrary;