import React from 'react';

const COMMENTS = [
    { id: 1, user: "Carlos S.", email: "carlos.s@email.com", time: "2 hours ago", rating: 5, text: "Este clipe é fantástico! A legenda está perfeitamente sincronizada. Ótimo trabalho!", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDAYuD-nuLwHb_1ZO-eTVacr0NQrE9CJ18K-z9hjz5LDKxp0l4Pr0Df66FwB_SbPDel4qPwAYrEXx6mCEbow37XIboXpbvYKWfjWz4QfXupleXM_FoE44R28cgEj52OZ2L80W-a31i_5PYLOkyjTsXHRXIIak9Ail9GnUTBgg76chVRha95Uo4ICGRMvDOqioO0nudmHsKm6eN5LznW93N8LesBBNfKX6f-m_BuJjMydyTzLZhA_imWFhZ2glDEgYv9R-ud2RsktmHT", clip: "Aurora Live Performance" },
    { id: 2, user: "Mariana P.", email: "mari.p@email.com", time: "1 day ago", rating: 4, text: "Gostei muito, mas achei que a legenda poderia ter uma fonte um pouco maior.", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKC5tAc0Pn7ID1ez_hCK2BldAcr-v-2IMW-x55krnwf2gdX_tD3bbcWP5W7CCpVKD6MsUvb0ZR-crVeYg0czgJYORb94IePMXSAyzsU52cKCC6GwjofNcjZRwS96kVI0VdTIvhaTsZBscAk55gR1Ga5vJaDFnJ_Wo_HZJgwwTZIK55gx1Ars7H4V_VDhsLqOkB4YSdbyZvj96wngkbE8r1C9VIt_6YJo5oZF8-0PZnKWHWmdE_VpmXkzJokcEeWi854H9pu4iHaKvq", clip: "The Night City" },
    { id: 3, user: "Ana L.", email: "ana.lucia@email.com", time: "3 days ago", rating: 5, text: "Relaxante e lindo. As legendas ajudaram a entender o contexto poético. Perfeito!", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCYvRHThyBDBsH_p7KiPuEl07sEjKguZ-Rubt79newq1KwJZDzcwcHD6oydViGLkakdC6McHd8e7QtF8xUhei4jlJxEwVpLrln3epdx2-ZHASvwfTofSeQBUnn4IFywNTfMJH_aC5NpsK-BnZqnHYnDilLYz3jCOQUPQw8gJ-l_ctqDHxi9PDEh0hlGperHJpZTmXbLwdaGcEMoNVHU_f6Xpuie3uJK2syhG68YWrDWdmea6-MwQaXyqMboqgBajy3YKIAbVsYBmRM", clip: "Serenity Now" },
];

const Comments: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
         <h1 className="text-gray-900 dark:text-white text-3xl font-black leading-tight">Comments Moderation</h1>
         <p className="text-gray-500 dark:text-[#92adc9]">Review and approve user comments.</p>
      </div>

      <div className="bg-white dark:bg-[#111a22] border border-gray-200 dark:border-[#324d67] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-[#324d67] flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Pending Approval <span className="ml-2 bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">3</span></h2>
            <div className="flex gap-2">
                <button className="text-sm text-gray-500 hover:text-primary">Mark all read</button>
            </div>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-[#324d67]">
            {COMMENTS.map((comment) => (
                <div key={comment.id} className="p-6 hover:bg-gray-50 dark:hover:bg-[#192633]/50 transition-colors">
                    <div className="flex items-start gap-4">
                        <img src={comment.avatar} alt="" className="size-12 rounded-full object-cover" />
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-base">{comment.user}</h3>
                                    <p className="text-xs text-gray-500">{comment.email} • {comment.time}</p>
                                </div>
                                <div className="flex items-center text-yellow-400 gap-1">
                                    <span className="material-symbols-outlined text-sm filled">star</span>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{comment.rating}.0</span>
                                </div>
                            </div>
                            <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{comment.text}</p>
                            
                            <div className="mt-4 p-3 bg-gray-100 dark:bg-[#192633] rounded-lg text-xs flex items-center gap-2">
                                <span className="material-symbols-outlined text-base text-gray-500">movie</span>
                                <span className="text-gray-500">Commented on:</span>
                                <span className="font-bold text-primary">{comment.clip}</span>
                            </div>

                            <div className="flex gap-3 mt-4">
                                <button className="flex items-center justify-center gap-1 px-4 h-8 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20 font-bold text-xs transition-colors">
                                    <span className="material-symbols-outlined text-base">check</span>
                                    Approve
                                </button>
                                <button className="flex items-center justify-center gap-1 px-4 h-8 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 font-bold text-xs transition-colors">
                                    <span className="material-symbols-outlined text-base">close</span>
                                    Reject
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-[#324d67] bg-gray-50 dark:bg-[#192633] flex justify-center">
            <button className="text-sm font-bold text-primary hover:underline">Load More Comments</button>
        </div>
      </div>
    </div>
  );
};

export default Comments;