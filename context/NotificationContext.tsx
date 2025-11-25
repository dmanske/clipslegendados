
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import NotificationToast from '../components/NotificationToast';

interface NotificationContextType {
  showNotification: (message: string, link?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<{ message: string; link?: string } | null>(null);

  useEffect(() => {
    if (!supabase) return;

    console.log('[NotificationContext] Setting up realtime subscription');
    
    // Escutar mudanças na tabela 'clips' (INSERT)
    // Isso permite saber quando um novo clipe é adicionado em tempo real
    const channel = supabase
      .channel('public:clips')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'clips' },
        (payload: any) => {
          console.log('[NotificationContext] New clip detected:', payload.new?.title);
          // Verifica se o novo clipe está publicado
          if (payload.new && payload.new.status === 'Published') {
            showNotification(
              `Novo clipe disponível: "${payload.new.title}"`,
              `/app/clip/${payload.new.id}`
            );
          }
        }
      )
      .subscribe();

    return () => {
      console.log('[NotificationContext] Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, []); // Dependências vazias - só executa uma vez

  const showNotification = React.useCallback((message: string, link?: string) => {
    console.log('[NotificationContext] Showing notification:', message);
    setNotification({ message, link });
    
    // Auto-dismiss após 6 segundos
    setTimeout(() => {
      setNotification(null);
    }, 6000);
  }, []); // useCallback para evitar re-criação da função

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <NotificationToast 
        message={notification?.message || ''} 
        link={notification?.link} 
        isVisible={!!notification} 
        onClose={() => setNotification(null)} 
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};
