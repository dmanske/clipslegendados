import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SubtitleLine } from '../../types';
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';
import { GoogleGenerativeAI } from "@google/generative-ai";

const EditClip: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const { success, error: toastError, warning } = useToast();
  const { confirm } = useConfirm();

  // Form States
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [subtitledBy, setSubtitledBy] = useState("");

  const [isFeatured, setIsFeatured] = useState(false);
  const [delay, setDelay] = useState<number>(0);

  // Subtitle State
  const [subtitles, setSubtitles] = useState<SubtitleLine[]>([]);

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchClipData();
    }
  }, [id]);

  const fetchClipData = async () => {
    if (!isSupabaseConfigured() || !supabase || !id) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('clips')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setTitle(data.title || '');
        setArtist(data.artist || '');
        setDescription(data.description || '');
        setTags(data.tags?.join(', ') || '');
        setVideoUrl(data.video_url || '');
        setThumbnailUrl(data.thumbnail_url || '');
        setReleaseYear(data.release_year?.toString() || '');
        setSubtitles(data.subtitles_json || []);
        setIsFeatured(data.is_featured || false);
        setDelay(data.delay || 0);
        setSubtitledBy(data.subtitled_by || '');
      }
    } catch (error) {
      console.error('Erro ao buscar clipe:', error);
      console.error('Erro ao buscar clipe:', error);
      toastError('Erro ao carregar dados do clipe');
    } finally {
      setIsLoading(false);
    }
  };

  const extractYouTubeId = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const getYouTubeThumbnail = (url: string): string => {
    const videoId = extractYouTubeId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
  };

  useEffect(() => {
    // Só atualiza thumbnail se não tiver uma definida E o videoUrl mudou
    if (videoUrl && !thumbnailUrl) {
      const autoThumbnail = getYouTubeThumbnail(videoUrl);
      if (autoThumbnail) {
        setThumbnailUrl(autoThumbnail);
      }
    }
  }, [videoUrl]); // Removido thumbnailUrl das dependências para evitar loop

  const handleAddSubtitle = () => {
    const newSub: SubtitleLine = {
      id: Date.now().toString(),
      startTime: '00:00.000',
      endTime: '00:00.000',
      text: 'Nova linha de legenda'
    };
    setSubtitles([...subtitles, newSub]);
  };

  const handleDeleteSubtitle = (subId: string) => {
    setSubtitles(subtitles.filter(s => s.id !== subId));
  };

  const handleSubtitleChange = (subId: string, field: keyof SubtitleLine, value: string) => {
    setSubtitles(subtitles.map(s => s.id === subId ? { ...s, [field]: value } : s));
  };

  const handleAIAssist = async (subId: string, currentText: string) => {
    const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      toastError("Configure VITE_GEMINI_API_KEY no .env para usar IA");
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

      const prompt = `Analise esta linha de legenda: "${currentText}". 
      Sugira uma quebra de linha melhor ou tradução se necessário. 
      Retorne APENAS o texto sugerido, mantendo o significado. 
      Se houver quebra, use \\n.`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      if (text) {
        handleSubtitleChange(subId, 'text', text.trim());
        success("Sugestão da IA aplicada!");
      }
    } catch (error) {
      console.error("Erro na IA:", error);
      toastError("Erro ao consultar IA");
    }
  };

  const parseSRT = (srtContent: string): SubtitleLine[] => {
    // Normalizar quebras de linha
    const normalized = srtContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const blocks = normalized.trim().split(/\n\n+/);
    const parsedSubtitles: SubtitleLine[] = [];

    blocks.forEach((block, index) => {
      const lines = block.trim().split('\n');
      
      // Precisa ter pelo menos: número, tempo, e texto
      if (lines.length >= 3) {
        // A segunda linha deve conter o timestamp
        const timeMatch = lines[1].match(/(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})/);
        
        if (timeMatch) {
          // Converter de HH:MM:SS,mmm para MM:SS.mmm
          const startHours = parseInt(timeMatch[1]);
          const startMinutes = parseInt(timeMatch[2]);
          const startSeconds = parseInt(timeMatch[3]);
          const startMillis = timeMatch[4];
          
          const endHours = parseInt(timeMatch[5]);
          const endMinutes = parseInt(timeMatch[6]);
          const endSeconds = parseInt(timeMatch[7]);
          const endMillis = timeMatch[8];
          
          // Converter horas em minutos
          const totalStartMinutes = (startHours * 60) + startMinutes;
          const totalEndMinutes = (endHours * 60) + endMinutes;
          
          const startTime = `${String(totalStartMinutes).padStart(2, '0')}:${String(startSeconds).padStart(2, '0')}.${startMillis}`;
          const endTime = `${String(totalEndMinutes).padStart(2, '0')}:${String(endSeconds).padStart(2, '0')}.${endMillis}`;
          
          // O texto são todas as linhas após a linha de tempo
          const text = lines.slice(2).join('\n').trim();

          if (text) {
            parsedSubtitles.push({
              id: `${Date.now()}-${index}-${Math.random()}`,
              startTime,
              endTime,
              text
            });
          }
        }
      }
    });

    return parsedSubtitles;
  };

  const handleSRTImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      let content = '';
      
      // Tentar decodificar com diferentes encodings
      try {
        // Primeiro tentar UTF-8
        const utf8Decoder = new TextDecoder('utf-8', { fatal: true });
        content = utf8Decoder.decode(arrayBuffer);
      } catch (utf8Error) {
        // Se UTF-8 falhar, tentar ISO-8859-1 (Latin-1)
        try {
          const latin1Decoder = new TextDecoder('iso-8859-1');
          content = latin1Decoder.decode(arrayBuffer);
          console.log('Arquivo decodificado como ISO-8859-1');
        } catch (latin1Error) {
          // Último recurso: Windows-1252
          try {
            const windows1252Decoder = new TextDecoder('windows-1252');
            content = windows1252Decoder.decode(arrayBuffer);
            console.log('Arquivo decodificado como Windows-1252');
          } catch (finalError) {
            toastError('Não foi possível detectar o encoding do arquivo. Tente converter para UTF-8.');
            return;
          }
        }
      }
      
      try {
        const parsedSubtitles = parseSRT(content);
        if (parsedSubtitles.length > 0) {
          setSubtitles(parsedSubtitles);
          success(`${parsedSubtitles.length} legendas importadas com sucesso!`);
        } else {
          warning('Nenhuma legenda encontrada no arquivo SRT.');
        }
      } catch (error) {
        console.error('Erro ao importar SRT:', error);
        toastError('Erro ao importar arquivo SRT. Verifique o formato.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSaveDraft = async () => {
    await handleSave('Draft');
  };

  const handlePublish = async () => {
    await handleSave('Published');
  };

  const handleSave = async (status: 'Draft' | 'Published') => {
    console.log('[EditClip] handleSave called with status:', status, 'isSaving:', isSaving);
    
    if (!isSupabaseConfigured() || !supabase) {
      toastError("ERRO: Supabase não configurado. Verifique as variáveis de ambiente.");
      return;
    }

    // Previne múltiplos cliques - CRÍTICO para evitar loops
    if (isSaving) {
      console.log('[EditClip] Already saving, ignoring duplicate call');
      return;
    }

    if (!title.trim()) {
      warning("Por favor, preencha o título do clipe.");
      return;
    }

    if (!videoUrl.trim()) {
      warning("Por favor, insira a URL do vídeo do YouTube.");
      return;
    }

    console.log('[EditClip] Starting save process...');
    setIsSaving(true);

    try {
      // Validação e sanitização dos dados
      const parsedDelay = parseInt(String(delay)) || 0;
      const parsedYear = releaseYear ? parseInt(String(releaseYear)) : null;
      
      // Validar ano
      if (parsedYear && (parsedYear < 1900 || parsedYear > 2100)) {
        warning("Ano de lançamento inválido. Use um valor entre 1900 e 2100.");
        setIsSaving(false);
        return;
      }

      const clipData: any = {
        title: title.trim(),
        artist: artist.trim() || null,
        description: description.trim() || null,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        video_url: videoUrl.trim(),
        thumbnail_url: thumbnailUrl.trim() || getYouTubeThumbnail(videoUrl),
        release_year: parsedYear,
        status,
        subtitles_json: subtitles,
        is_featured: isFeatured,
        delay: parsedDelay,
        subtitled_by: subtitledBy.trim() || null
      };

      // Só adiciona views se for criação (não atualização)
      if (!isEditMode) {
        clipData.views = 0;
      }

      console.log('[EditClip] Salvando clip com dados:', clipData);

      if (isEditMode) {
        // Update existing clip
        const { error } = await supabase
          .from('clips')
          .update(clipData)
          .eq('id', id);

        if (error) {
          console.error('[EditClip] Erro ao atualizar:', error);
          throw error;
        }
        success(`Clipe atualizado como ${status === 'Published' ? 'Publicado' : 'Rascunho'}!`);
      } else {
        // Create new clip
        const { error } = await supabase
          .from('clips')
          .insert([clipData]);

        if (error) {
          console.error('[EditClip] Erro ao criar:', error);
          throw error;
        }
        success(`Clipe criado como ${status === 'Published' ? 'Publicado' : 'Rascunho'}!`);
      }

      console.log('[EditClip] Save successful, navigating to clips library');
      
      // Aguarda um pouco antes de navegar para garantir que o toast seja exibido
      setTimeout(() => {
        navigate('/admin/clips', { replace: true });
      }, 500);
    } catch (error: any) {
      console.error('[EditClip] Erro ao salvar:', error);
      
      // Mensagens de erro mais específicas
      let errorMessage = 'Erro ao salvar: ';
      
      if (error.message?.includes('violates check constraint')) {
        errorMessage += 'Dados inválidos. Verifique os campos numéricos.';
      } else if (error.message?.includes('value too long')) {
        errorMessage += 'Algum campo está muito longo. Reduza o tamanho do texto.';
      } else if (error.message?.includes('invalid input syntax')) {
        errorMessage += 'Formato de dados inválido. Verifique os campos.';
      } else if (error.code === '23505') {
        errorMessage += 'Já existe um clipe com esses dados.';
      } else if (error.code === '42501') {
        errorMessage += 'Você não tem permissão para fazer isso.';
      } else {
        errorMessage += error.message || 'Erro desconhecido';
      }
      
      toastError(errorMessage);
      
      // CRÍTICO: Resetar isSaving em caso de erro para permitir nova tentativa
      console.log('[EditClip] Resetting isSaving to false after error');
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditMode || !supabase) return;

    const confirmed = await confirm({
      title: 'Excluir Clipe',
      message: 'Tem certeza que deseja deletar este clipe? Esta ação não pode ser desfeita.',
      confirmText: 'Excluir',
      type: 'danger'
    });

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('clips')
        .delete()
        .eq('id', id);

      if (error) throw error;

      success('Clipe deletado com sucesso!');
      navigate('/admin/clips');
    } catch (error: any) {
      console.error('Erro ao deletar:', error);
      toastError(`Erro ao deletar: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center h-96">
        <span className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
        <div className="flex min-w-72 flex-col gap-2">
          <p className="text-gray-900 dark:text-white text-3xl font-black leading-tight">
            {isEditMode ? 'Editar Clipe' : 'Novo Clipe'}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-gray-500 dark:text-[#92adc9] text-base font-normal">
              {isEditMode ? 'Atualize as informações do clipe' : 'Adicione um novo clipe com legendas'}
            </p>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>
            <label className="flex items-center gap-2 cursor-pointer bg-primary/10 hover:bg-primary/20 px-3 py-1 rounded-full transition-colors border border-primary/20">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-primary text-primary focus:ring-primary"
              />
              <span className="text-sm font-bold text-primary select-none">
                Destaque no Hero
              </span>
            </label>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditMode && (
            <button
              onClick={handleDelete}
              className="flex items-center justify-center h-10 px-4 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 font-bold text-sm gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-xl">delete</span>
              <span className="hidden sm:inline">Excluir</span>
            </button>
          )}
          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="flex items-center justify-center h-10 px-4 rounded-lg bg-gray-200 dark:bg-[#233648] text-gray-900 dark:text-white font-bold text-sm hover:bg-gray-300 dark:hover:bg-[#324d67] transition-colors disabled:opacity-50"
          >
            Salvar Rascunho
          </button>
          <button
            onClick={handlePublish}
            disabled={isSaving}
            className="flex items-center justify-center h-10 px-4 rounded-lg bg-primary text-white font-bold text-sm gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-xl">publish</span>
                <span>Publicar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {!isSupabaseConfigured() && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded" role="alert">
          <p className="font-bold">Atenção</p>
          <p>Supabase não configurado. Configure as variáveis de ambiente para salvar dados.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Metadata Form */}
        <div className="lg:col-span-1 flex flex-col gap-6">

          {/* Video URL */}
          <div className="bg-white dark:bg-[#111a22] rounded-xl p-6 border border-gray-200 dark:border-[#324d67]">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Vídeo do YouTube</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                URL do YouTube *
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full rounded-lg bg-gray-50 dark:bg-[#233648] border border-gray-200 dark:border-[#324d67] text-gray-900 dark:text-white focus:ring-primary focus:border-primary text-sm p-3"
              />
              <p className="text-xs text-gray-500 mt-1">Cole o link completo do vídeo do YouTube</p>
            </div>

            {videoUrl && extractYouTubeId(videoUrl) && (
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(videoUrl)}`}
                  className="w-full h-full"
                  allowFullScreen
                  title="Preview"
                />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="bg-white dark:bg-[#111a22] rounded-xl p-6 border border-gray-200 dark:border-[#324d67]">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Detalhes do Clipe</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Título *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nome da música"
                  className="w-full rounded-lg bg-gray-50 dark:bg-[#233648] border border-gray-200 dark:border-[#324d67] text-gray-900 dark:text-white focus:ring-primary focus:border-primary p-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Artista</label>
                <input
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="Nome do artista ou banda"
                  className="w-full rounded-lg bg-gray-50 dark:bg-[#233648] border border-gray-200 dark:border-[#324d67] text-gray-900 dark:text-white focus:ring-primary focus:border-primary p-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Ano de Lançamento</label>
                <input
                  type="number"
                  value={releaseYear}
                  onChange={(e) => setReleaseYear(e.target.value)}
                  placeholder="2024"
                  min="1900"
                  max="2100"
                  className="w-full rounded-lg bg-gray-50 dark:bg-[#233648] border border-gray-200 dark:border-[#324d67] text-gray-900 dark:text-white focus:ring-primary focus:border-primary p-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Legendado por</label>
                <input
                  type="text"
                  value={subtitledBy}
                  onChange={(e) => setSubtitledBy(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full rounded-lg bg-gray-50 dark:bg-[#233648] border border-gray-200 dark:border-[#324d67] text-gray-900 dark:text-white focus:ring-primary focus:border-primary p-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Descrição</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descrição do clipe..."
                  className="w-full rounded-lg bg-gray-50 dark:bg-[#233648] border border-gray-200 dark:border-[#324d67] text-gray-900 dark:text-white focus:ring-primary focus:border-primary p-3"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Tags (separadas por vírgula)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="pop, indie, rock"
                  className="w-full rounded-lg bg-gray-50 dark:bg-[#233648] border border-gray-200 dark:border-[#324d67] text-gray-900 dark:text-white focus:ring-primary focus:border-primary p-3"
                />
              </div>
            </div>
          </div>

          {/* Thumbnail */}
          <div className="bg-white dark:bg-[#111a22] rounded-xl p-6 border border-gray-200 dark:border-[#324d67]">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Miniatura</h3>
            <div className="aspect-video bg-black rounded-lg mb-4 overflow-hidden">
              {thumbnailUrl ? (
                <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <span className="material-symbols-outlined text-4xl">image</span>
                </div>
              )}
            </div>
            <input
              type="url"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="URL da miniatura (auto-preenchido do YouTube)"
              className="w-full rounded-lg bg-gray-50 dark:bg-[#233648] border border-gray-200 dark:border-[#324d67] text-gray-900 dark:text-white focus:ring-primary focus:border-primary text-sm p-3"
            />
          </div>

          {/* Delay Adjustment */}
          <div className="bg-white dark:bg-[#111a22] rounded-xl p-6 border border-gray-200 dark:border-[#324d67]">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ajuste de Delay</h3>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Delay (ms)</label>
              <input
                type="number"
                value={delay}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                  setDelay(isNaN(val) ? 0 : val);
                }}
                placeholder="0"
                step="100"
                className="w-full rounded-lg bg-gray-50 dark:bg-[#233648] border border-gray-200 dark:border-[#324d67] text-gray-900 dark:text-white focus:ring-primary focus:border-primary p-3"
              />
              <p className="text-xs text-gray-500 mt-1">Ajuste de sincronia (negativo adianta, positivo atrasa)</p>
            </div>
          </div>
        </div>

        {/* Right Column: Subtitle Editor */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white dark:bg-[#111a22] rounded-xl p-6 border border-gray-200 dark:border-[#324d67] flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Editor de Legendas</h3>
              <div className="flex gap-2">
                <input
                  type="file"
                  accept=".srt"
                  className="hidden"
                  id="srt-upload"
                  onChange={handleSRTImport}
                />
                <label
                  htmlFor="srt-upload"
                  className="h-8 px-3 rounded-lg bg-gray-200 dark:bg-[#233648] text-xs font-bold flex items-center gap-1 hover:bg-gray-300 dark:hover:bg-[#324d67] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">file_upload</span>
                  Importar SRT
                </label>
                {subtitles.length > 0 && (
                  <button
                    onClick={async () => {
                      const confirmed = await confirm({
                        title: 'Deletar Legendas',
                        message: 'Tem certeza que deseja deletar todas as legendas? Esta ação não pode ser desfeita.',
                        confirmText: 'Deletar Tudo',
                        type: 'danger'
                      });
                      if (confirmed) {
                        setSubtitles([]);
                        success('Todas as legendas foram deletadas');
                      }
                    }}
                    className="h-8 px-3 rounded-lg bg-red-500/10 text-red-500 text-xs font-bold flex items-center gap-1 hover:bg-red-500/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">delete_sweep</span>
                    Deletar Tudo
                  </button>
                )}
                <button
                  onClick={handleAddSubtitle}
                  className="h-8 px-3 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center gap-1 hover:bg-primary/20 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Adicionar Linha
                </button>
              </div>
            </div>

            {/* Subtitle List */}
            <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {subtitles.length === 0 ? (
                <div className="text-center text-gray-500 py-12 italic">
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-50">subtitles</span>
                  <p>Nenhuma legenda ainda. Clique em "Adicionar Linha" ou importe um arquivo SRT.</p>
                </div>
              ) : (
                subtitles.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 bg-gray-50 dark:bg-[#192633] rounded-lg border border-transparent hover:border-primary/30 transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={sub.startTime}
                        onChange={(e) => handleSubtitleChange(sub.id, 'startTime', e.target.value)}
                        placeholder="00:00.000"
                        className="w-24 h-8 text-center text-sm rounded bg-white dark:bg-[#233648] border border-gray-200 dark:border-[#324d67] focus:ring-primary focus:border-primary font-mono"
                      />
                      <span className="text-gray-400">→</span>
                      <input
                        type="text"
                        value={sub.endTime}
                        onChange={(e) => handleSubtitleChange(sub.id, 'endTime', e.target.value)}
                        placeholder="00:00.000"
                        className="w-24 h-8 text-center text-sm rounded bg-white dark:bg-[#233648] border border-gray-200 dark:border-[#324d67] focus:ring-primary focus:border-primary font-mono"
                      />
                    </div>
                    <textarea
                      value={sub.text}
                      onChange={(e) => handleSubtitleChange(sub.id, 'text', e.target.value)}
                      placeholder="Texto da legenda"
                      rows={2}
                      className="flex-1 w-full text-sm rounded bg-white dark:bg-[#233648] border border-gray-200 dark:border-[#324d67] focus:ring-primary focus:border-primary p-2 resize-y min-h-[3rem]"
                    />
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col gap-0.5 min-w-[3rem] pt-1">
                        {sub.text.split('\n').map((line, idx) => (
                          <span key={idx} className={`text-xs ${line.length > 40 ? 'text-red-500' : 'text-gray-400'}`}>
                            {line.length}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => handleAIAssist(sub.id, sub.text)}
                        className="p-1 text-primary hover:bg-primary/10 rounded"
                        title="Melhorar com IA"
                      >
                        <span className="material-symbols-outlined text-lg">auto_awesome</span>
                      </button>
                    </div>
                    <button
                      onClick={() => handleDeleteSubtitle(sub.id)}
                      className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default EditClip;