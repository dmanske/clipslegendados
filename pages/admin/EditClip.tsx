
import React, { useState, useRef, ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import { SubtitleLine } from '../../types';

const EditClip: React.FC = () => {
  const { id } = useParams();
  const [subtitles, setSubtitles] = useState<SubtitleLine[]>([
    { id: '1', startTime: '00:10.240', endTime: '00:12.800', text: '(Music starts playing)' },
    { id: '2', startTime: '00:13.500', endTime: '00:16.120', text: 'I can see it in your eyes...' },
    { id: '3', startTime: '00:16.800', endTime: '00:19.300', text: '...the fire that burns inside.' },
  ]);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const handleAddSubtitle = () => {
    const newSub: SubtitleLine = {
        id: Date.now().toString(),
        startTime: '00:00.000',
        endTime: '00:00.000',
        text: 'Nova linha de legenda'
    };
    setSubtitles([...subtitles, newSub]);
  };

  const handleDeleteSubtitle = (id: string) => {
    setSubtitles(subtitles.filter(s => s.id !== id));
  };

  const handleSubtitleChange = (id: string, field: keyof SubtitleLine, value: string) => {
    setSubtitles(subtitles.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
        <div className="flex min-w-72 flex-col gap-2">
          <p className="text-gray-900 dark:text-white text-3xl font-black leading-tight">{id ? 'Editar Clipe' : 'Novo Clipe'}</p>
          <p className="text-gray-500 dark:text-[#92adc9] text-base font-normal">Gerencie, edite e publique seus clipes de vídeo.</p>
        </div>
        <div className="flex items-center gap-2">
            {id && (
                <button className="flex items-center justify-center h-10 px-4 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 font-bold text-sm gap-2 transition-colors">
                    <span className="material-symbols-outlined text-xl">delete</span>
                    <span className="hidden sm:inline">Excluir</span>
                </button>
            )}
            <button className="flex items-center justify-center h-10 px-4 rounded-lg bg-gray-200 dark:bg-[#233648] text-gray-900 dark:text-white font-bold text-sm hover:bg-gray-300 dark:hover:bg-[#324d67] transition-colors">
                Salvar Rascunho
            </button>
            <button className="flex items-center justify-center h-10 px-4 rounded-lg bg-primary text-white font-bold text-sm gap-2 hover:bg-primary/90 transition-colors">
                <span className="material-symbols-outlined text-xl">publish</span>
                <span>Publicar</span>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Metadata Form */}
        <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* Video File Upload */}
            <div className="bg-white dark:bg-[#111a22] rounded-xl p-6 border border-gray-200 dark:border-[#324d67]">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Arquivo de Vídeo</h3>
                <div 
                    className="flex flex-col justify-center items-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-[#324d67] rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800/20 hover:bg-gray-100 dark:hover:bg-gray-800/40 transition-colors group"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input 
                        type="file" 
                        accept="video/*" 
                        className="hidden" 
                        ref={fileInputRef}
                        onChange={handleVideoUpload}
                    />
                    <div className="text-center p-4">
                        {videoFile ? (
                            <div className="flex flex-col items-center animate-fade-in">
                                 <span className="material-symbols-outlined text-3xl text-green-500 mb-2">check_circle</span>
                                 <p className="text-sm text-gray-900 dark:text-white font-medium truncate max-w-[180px]">{videoFile.name}</p>
                                 <p className="text-xs text-gray-500">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                 <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setVideoFile(null);
                                        setVideoPreview(null);
                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                    }}
                                    className="mt-2 text-xs text-red-500 hover:underline font-medium"
                                 >
                                    Remover
                                 </button>
                            </div>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-3xl text-gray-400 dark:text-gray-500 group-hover:text-primary transition-colors">upload_file</span>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold text-primary">Clique para enviar</span></p>
                                <p className="text-xs text-gray-400 dark:text-gray-500">MP4, WEBM, MOV (max 500MB)</p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-[#111a22] rounded-xl p-6 border border-gray-200 dark:border-[#324d67]">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Detalhes do Clipe</h3>
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Título</label>
                        <input type="text" defaultValue={id ? "Aurora Live Performance" : ""} className="w-full rounded-lg bg-gray-50 dark:bg-[#233648] border-gray-200 dark:border-[#324d67] text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Fonte/Artista</label>
                        <input type="text" defaultValue={id ? "Artist A" : ""} className="w-full rounded-lg bg-gray-50 dark:bg-[#233648] border-gray-200 dark:border-[#324d67] text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Descrição</label>
                        <textarea rows={4} defaultValue={id ? "A captivating live performance..." : ""} className="w-full rounded-lg bg-gray-50 dark:bg-[#233648] border-gray-200 dark:border-[#324d67] text-gray-900 dark:text-white focus:ring-primary focus:border-primary"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Tags</label>
                        <input type="text" defaultValue={id ? "live, music" : ""} className="w-full rounded-lg bg-gray-50 dark:bg-[#233648] border-gray-200 dark:border-[#324d67] text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
                    </div>
                </div>
            </div>
            <div className="bg-white dark:bg-[#111a22] rounded-xl p-6 border border-gray-200 dark:border-[#324d67]">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Miniatura</h3>
                <div className="aspect-video bg-black rounded-lg mb-4 overflow-hidden relative group">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAW-Z8VpkiBZ97MynVSqr-CCXxZUQ1h8NbqiWd5o9Jm2OjSwK6RfHhLheYM9gkPQNcLEdLesG3BWchj07FXkLYXZft3PyYq-rVo3lBuhJSfQnt_SLYZx7H-Rmw0Trq3JeXLthLGQwwwSRmO5BOWKMHcE5Vp-w6-LFcTulsPo_4LqVAR4IOgaIeuk-2LOfPWo409zKqZJJg9aoE2uIC__BeSoj9gzMIBSsc6ZFjt6wKAvce7pIjDd1JSkJp8L5PE9wWQDntISuVeaVnI" alt="" className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-4xl">image</span>
                    </div>
                </div>
                <button className="w-full h-10 rounded-lg bg-gray-200 dark:bg-[#233648] text-gray-900 dark:text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-300 dark:hover:bg-[#324d67] transition-colors">
                    <span className="material-symbols-outlined text-lg">upload</span>
                    Enviar Nova Miniatura
                </button>
            </div>
        </div>

        {/* Right Column: Editor */}
        <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white dark:bg-[#111a22] rounded-xl p-6 border border-gray-200 dark:border-[#324d67] flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Editor de Legendas</h3>
                    <div className="flex gap-2">
                        <button className="h-8 px-3 rounded-lg bg-gray-200 dark:bg-[#233648] text-xs font-bold flex items-center gap-1 hover:bg-gray-300 dark:hover:bg-[#324d67] transition-colors">
                            <span className="material-symbols-outlined text-sm">file_upload</span>
                            Importar SRT
                        </button>
                        <button onClick={handleAddSubtitle} className="h-8 px-3 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center gap-1 hover:bg-primary/20 transition-colors">
                            <span className="material-symbols-outlined text-sm">add</span>
                            Adicionar Linha
                        </button>
                    </div>
                </div>

                {/* Preview Player */}
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-6 group">
                    {videoPreview ? (
                        <video 
                            src={videoPreview} 
                            controls 
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <>
                           <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkL6P0e_rcUqQ2ddpcxAnKFccHkPff1w1WBIiyO8xT4y8I9L716Oei6j9-eI93nOEJ6y0_yP9oBUtW70fNu-9uvNjQyrZnOJl5E5v3iJ8wE1Sx1o0lAOJaBx_aPxcnMxsy6_Y63NYc5YIQrB62NE6r0X21Wz4fJAhVlAnOfwF3_SfXs4-xw1iluRanxtUw-piu0hQfIqHFvAv-gFjkJpSsBWggfOT33g5Kq0vXaxpZ-6lu6VnyjscJeQaaZifCatSHrwphFhoi5gLr" className="w-full h-full object-cover opacity-80" alt="Preview" />
                           <div className="absolute inset-0 flex items-center justify-center">
                                <button className="size-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-5xl">play_arrow</span>
                                </button>
                           </div>
                           <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-black/80 to-transparent px-4 flex items-end pb-2">
                                <div className="w-full h-1 bg-gray-600 rounded-full overflow-hidden">
                                     <div className="w-[30%] h-full bg-primary"></div>
                                </div>
                           </div>
                        </>
                    )}
                </div>

                {/* Editor Rows */}
                <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {subtitles.map((sub) => (
                        <div key={sub.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 bg-gray-50 dark:bg-[#192633] rounded-lg border border-transparent hover:border-primary/30 transition-colors group">
                             <div className="flex items-center gap-2">
                                 <input 
                                    type="text" 
                                    value={sub.startTime} 
                                    onChange={(e) => handleSubtitleChange(sub.id, 'startTime', e.target.value)}
                                    className="w-24 h-8 text-center text-sm rounded bg-white dark:bg-[#233648] border-gray-200 dark:border-[#324d67] focus:ring-primary focus:border-primary font-mono"
                                 />
                                 <span className="text-gray-400">-</span>
                                 <input 
                                    type="text" 
                                    value={sub.endTime} 
                                    onChange={(e) => handleSubtitleChange(sub.id, 'endTime', e.target.value)}
                                    className="w-24 h-8 text-center text-sm rounded bg-white dark:bg-[#233648] border-gray-200 dark:border-[#324d67] focus:ring-primary focus:border-primary font-mono"
                                 />
                             </div>
                             <input 
                                type="text" 
                                value={sub.text} 
                                onChange={(e) => handleSubtitleChange(sub.id, 'text', e.target.value)}
                                className="flex-1 h-8 w-full text-sm rounded bg-white dark:bg-[#233648] border-gray-200 dark:border-[#324d67] focus:ring-primary focus:border-primary"
                             />
                             <button onClick={() => handleDeleteSubtitle(sub.id)} className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <span className="material-symbols-outlined text-lg">delete</span>
                             </button>
                        </div>
                    ))}
                    {subtitles.length === 0 && (
                        <div className="text-center text-gray-500 py-8 italic">Nenhuma legenda ainda. Clique em "Adicionar Linha" para começar.</div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EditClip;