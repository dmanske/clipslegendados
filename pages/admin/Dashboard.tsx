import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  totalViews: number;
  totalClips: number;
  totalComments: number;
  viewsChange: number;
}

interface PopularClip {
  id: string;
  title: string;
  artist: string;
  views: number;
  thumbnail_url: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalViews: 0,
    totalClips: 0,
    totalComments: 0,
    viewsChange: 0
  });
  const [popularClips, setPopularClips] = useState<PopularClip[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      // Fallback para dados de demonstração
      setStats({
        totalViews: 1254890,
        totalClips: 78,
        totalComments: 342,
        viewsChange: 12.5
      });
      setPopularClips([
        { id: '1', title: 'Aurora Live Performance', artist: 'Artist A', views: 215600, thumbnail_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAYuD-nuLwHb_1ZO-eTVacr0NQrE9CJ18K-z9hjz5LDKxp0l4Pr0Df66FwB_SbPDel4qPwAYrEXx6mCEbow37XIboXpbvYKWfjWz4QfXupleXM_FoE44R28cgEj52OZ2L80W-a31i_5PYLOkyjTsXHRXIIak9Ail9GnUTBgg76chVRha95Uo4ICGRMvDOqioO0nudmHsKm6eN5LznW93N8LesBBNfKX6f-m_BuJjMydyTzLZhA_imWFhZ2glDEgYv9R-ud2RsktmHT' },
        { id: '2', title: 'The Night City', artist: 'Movie Title B', views: 189200, thumbnail_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKC5tAc0Pn7ID1ez_hCK2BldAcr-v-2IMW-x55krnwf2gdX_tD3bbcWP5W7CCpVKD6MsUvb0ZR-crVeYg0czgJYORb94IePMXSAyzsU52cKCC6GwjofNcjZRwS96kVI0VdTIvhaTsZBscAk55gR1Ga5vJaDFnJ_Wo_HZJgwwTZIK55gx1Ars7H4V_VDhsLqOkB4YSdbyZvj96wngkbE8r1C9VIt_6YJo5oZF8-0PZnKWHWmdE_VpmXkzJokcEeWi854H9pu4iHaKvq' },
        { id: '3', title: 'Serenity Now', artist: 'Artist C', views: 154100, thumbnail_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCYvRHThyBDBsH_p7KiPuEl07sEjKguZ-Rubt79newq1KwJZDzcwcHD6oydViGLkakdC6McHd8e7QtF8xUhei4jlJxEwVpLrln3epdx2-ZHASvwfTofSeQBUnn4IFywNTfMJH_aC5NpsK-BnZqnHYnDilLYz3jCOQUPQw8gJ-l_ctqDHxi9PDEh0hlGperHJpZTmXbLwdaGcEMoNVHU_f6Xpuie3uJK2syhG68YWrDWdmea6-MwQaXyqMboqgBajy3YKIAbVsYBmRM' },
      ]);
      setChartData([
        { name: 'Sem 1', views: 120 },
        { name: 'Sem 2', views: 180 },
        { name: 'Sem 3', views: 150 },
        { name: 'Sem 4', views: 250 },
        { name: 'Sem 5', views: 210 },
        { name: 'Sem 6', views: 300 },
      ]);
      setLoading(false);
      return;
    }

    try {
      // Buscar estatísticas gerais
      const { data: clips, error: clipsError } = await supabase
        .from('clips')
        .select('views');

      const { count: totalClips } = await supabase
        .from('clips')
        .select('*', { count: 'exact', head: true });

      const { count: totalComments } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true });

      // Calcular total de visualizações
      const totalViews = clips?.reduce((sum, clip) => sum + (Number(clip.views) || 0), 0) || 0;

      // Buscar clipes mais populares
      const { data: topClips, error: topError } = await supabase
        .from('clips')
        .select('id, title, artist, views, thumbnail_url')
        .eq('status', 'Published')
        .order('views', { ascending: false })
        .limit(3);

      if (!clipsError && !topError) {
        setStats({
          totalViews,
          totalClips: totalClips || 0,
          totalComments: totalComments || 0,
          viewsChange: 12.5 // Pode calcular baseado em dados históricos
        });
        setPopularClips(topClips || []);
      }

      // Gerar dados do gráfico (últimas 6 semanas)
      // Aqui você pode implementar lógica para buscar dados históricos
      // Por enquanto, vamos usar dados simulados
      setChartData([
        { name: 'Sem 1', views: Math.floor(totalViews * 0.1) },
        { name: 'Sem 2', views: Math.floor(totalViews * 0.15) },
        { name: 'Sem 3', views: Math.floor(totalViews * 0.12) },
        { name: 'Sem 4', views: Math.floor(totalViews * 0.2) },
        { name: 'Sem 5', views: Math.floor(totalViews * 0.18) },
        { name: 'Sem 6', views: Math.floor(totalViews * 0.25) },
      ]);

    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center h-96">
        <span className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {!isSupabaseConfigured() && (
        <div className="bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500 text-blue-700 dark:text-blue-300 p-4 mb-6 rounded" role="alert">
          <p className="font-bold">Modo de Demonstração</p>
          <p>Supabase não configurado. Exibindo dados fictícios locais.</p>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white text-3xl font-black leading-tight">Painel</h1>
        <p className="text-gray-500 dark:text-[#92adc9]">Bem-vindo de volta, aqui está o desempenho dos seus clipes.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-[#111a22] rounded-xl p-6 border border-gray-200 dark:border-[#324d67] flex items-start gap-4">
          <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-3xl">visibility</span>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-[#92adc9]">Total de Visualizações</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatNumber(stats.totalViews)}</p>
            <p className="text-sm text-green-500 flex items-center gap-1">
              <span className="material-symbols-outlined text-base">arrow_upward</span>
              <span>+{stats.viewsChange}%</span>
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#111a22] rounded-xl p-6 border border-gray-200 dark:border-[#324d67] flex items-start gap-4">
          <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-3xl">comment</span>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-[#92adc9]">Total de Comentários</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalComments}</p>
            <p className="text-sm text-gray-400">Todos os clipes</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#111a22] rounded-xl p-6 border border-gray-200 dark:border-[#324d67] flex items-start gap-4">
          <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-3xl">movie</span>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-[#92adc9]">Total de Clipes</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalClips}</p>
            <p className="text-sm text-gray-400">Publicados e rascunhos</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111a22] rounded-xl p-6 border border-gray-200 dark:border-[#324d67]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tendências de Engajamento</h3>
            <div className="flex bg-gray-100 dark:bg-[#192633] rounded-lg p-1 gap-1">
              <button className="px-3 py-1 text-sm rounded-md text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-[#233648] transition-colors">Semanal</button>
              <button className="px-3 py-1 text-sm rounded-md bg-white dark:bg-[#233648] text-primary font-medium shadow-sm">Mensal</button>
              <button className="px-3 py-1 text-sm rounded-md text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-[#233648] transition-colors">Anual</button>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#324d67" opacity={0.3} />
                <XAxis dataKey="name" stroke="#92adc9" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#92adc9" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111a22', borderColor: '#324d67', color: '#fff' }}
                  itemStyle={{ color: '#137fec' }}
                />
                <Line type="monotone" dataKey="views" stroke="#137fec" strokeWidth={3} dot={{ r: 4, fill: '#137fec' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Clips List */}
        <div className="bg-white dark:bg-[#111a22] rounded-xl p-6 border border-gray-200 dark:border-[#324d67]">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Clipes Mais Populares</h3>
          <div className="flex flex-col gap-4">
            {popularClips.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-[#92adc9] text-center py-8">Nenhum clipe publicado ainda</p>
            ) : (
              popularClips.map((clip) => (
                <div
                  key={clip.id}
                  onClick={() => navigate(`/admin/edit/${clip.id}`)}
                  className="flex items-center gap-4 group cursor-pointer"
                >
                  <img
                    src={clip.thumbnail_url || 'https://via.placeholder.com/150x90?text=No+Image'}
                    alt={clip.title}
                    className="w-24 h-14 object-cover rounded bg-gray-800"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary transition-colors">{clip.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-[#92adc9]">{clip.artist || 'Artista desconhecido'}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-[#92adc9] mt-1">
                      <span className="material-symbols-outlined text-sm">visibility</span>
                      <span>{formatNumber(clip.views)} visualizações</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;