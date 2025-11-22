
import React from 'react';
import { Link } from 'react-router-dom';

interface NotificationToastProps {
  message: string;
  link?: string;
  isVisible: boolean;
  onClose: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ message, link, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="bg-[#111a22] border border-[#324d67] shadow-2xl shadow-black/50 rounded-lg p-4 flex items-center gap-4 max-w-sm backdrop-blur-sm">
        <div className="size-10 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(19,127,236,0.2)]">
          <span className="material-symbols-outlined animate-pulse">notifications_active</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium leading-snug">{message}</p>
          {link && (
            <Link to={link} onClick={onClose} className="text-primary text-xs font-bold hover:text-primary/80 mt-1 block uppercase tracking-wider">
              Ver Agora
            </Link>
          )}
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1">
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;
