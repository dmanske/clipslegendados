import React from 'react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const CHART_DATA = [
  { name: 'Sem 1', views: 120 },
  { name: 'Sem 2', views: 180 },
  { name: 'Sem 3', views: 150 },
  { name: 'Sem 4', views: 250 },
  { name: 'Sem 5', views: 210 },
  { name: 'Sem 6', views: 300 },
];

const POPULAR_CLIPS = [
    { title: 'Aurora Live Performance', artist: 'Artist A', views: '215.6k', thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAYuD-nuLwHb_1ZO-eTVacr0NQrE9CJ18K-z9hjz5LDKxp0l4Pr0Df66FwB_SbPDel4qPwAYrEXx6mCEbow37XIboXpbvYKWfjWz4QfXupleXM_FoE44R28cgEj52OZ2L80W-a31i_5PYLOkyjTsXHRXIIak9Ail9GnUTBgg76chVRha95Uo4ICGRMvDOqioO0nudmHsKm6eN5LznW93N8LesBBNfKX6f-m_BuJjMydyTzLZhA_imWFhZ2glDEgYv9R-ud2RsktmHT' },
    { title: 'The Night City', artist: 'Movie Title B', views: '189.2k', thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKC5tAc0Pn7ID1ez_hCK2BldAcr-v-2IMW-x55krnwf2gdX_tD3bbcWP5W7CCpVKD6MsUvb0ZR-crVeYg0czgJYORb94IePMXSAyzsU52cKCC6GwjofNcjZRwS96kVI0VdTIvhaTsZBscAk55gR1Ga5vJaDFnJ_Wo_HZJgwwTZIK55gx1Ars7H4V_VDhsLqOkB4YSdbyZvj96wngkbE8r1C9VIt_6YJo5oZF8-0PZnKWHWmdE_VpmXkzJokcEeWi854H9pu4iHaKvq' },
    { title: 'Serenity Now', artist: 'Artist C', views: '154.1k', thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCYvRHThyBDBsH_p7KiPuEl07sEjKguZ-Rubt79newq1KwJZDzcwcHD6oydViGLkakdC6McHd8e7QtF8xUhei4jlJxEwVpLrln3epdx2-ZHASvwfTofSeQBUnn4IFywNTfMJH_aC5NpsK-BnZqnHYnDilLYz3jCOQUPQw8gJ-l_ctqDHxi9PDEh0hlGperHJpZTmXbLwdaGcEMoNVHU_f6Xpuie3uJK2syhG68YWrDWdmea6-MwQaXyqMboqgBajy3YKIAbVsYBmRM' },
];

const Dashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
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
            <p className="text-3xl font-bold text-gray-900 dark:text-white">1.254.890</p>
            <p className="text-sm text-green-500 flex items-center gap-1">
              <span className="material-symbols-outlined text-base">arrow_upward</span>
              <span>+12,5%</span>
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#111a22] rounded-xl p-6 border border-gray-200 dark:border-[#324d67] flex items-start gap-4">
          <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-3xl">schedule</span>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-[#92adc9]">Tempo Médio de Reprodução</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">2m 45s</p>
            <p className="text-sm text-red-500 flex items-center gap-1">
              <span className="material-symbols-outlined text-base">arrow_downward</span>
              <span>-3,2%</span>
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#111a22] rounded-xl p-6 border border-gray-200 dark:border-[#324d67] flex items-start gap-4">
          <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-3xl">movie</span>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-[#92adc9]">Total de Clipes</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">78</p>
            <p className="text-sm text-gray-400">+2 este mês</p>
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
                    <LineChart data={CHART_DATA}>
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
                {POPULAR_CLIPS.map((clip, idx) => (
                    <div key={idx} className="flex items-center gap-4 group cursor-pointer">
                        <img src={clip.thumb} alt={clip.title} className="w-24 h-14 object-cover rounded bg-gray-800" />
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary transition-colors">{clip.title}</h4>
                            <p className="text-xs text-gray-500 dark:text-[#92adc9]">{clip.artist}</p>
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-[#92adc9] mt-1">
                                <span className="material-symbols-outlined text-sm">visibility</span>
                                <span>{clip.views} visualizações</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;