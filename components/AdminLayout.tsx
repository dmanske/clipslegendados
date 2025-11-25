import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const isActive = (path: string) => location.pathname.includes(path);

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Admin';
  const displayEmail = user?.email || 'admin@website.com';

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200 font-display overflow-hidden">
      <aside className="flex flex-col w-20 md:w-64 lg:w-96 bg-white dark:bg-[#111a22] border-r border-gray-200 dark:border-[#324d67] flex-shrink-0 transition-all duration-300">
        <div className="p-4 border-b border-gray-200 dark:border-[#324d67]">
          <div className="flex gap-3 items-center mb-0 md:mb-4 justify-center md:justify-start">
            <div className="bg-primary rounded-full size-10 shrink-0 flex items-center justify-center text-white font-bold text-lg">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:flex flex-col overflow-hidden">
              <h1 className="text-gray-900 dark:text-white text-base font-medium leading-normal truncate">{displayName}</h1>
              <p className="text-gray-500 dark:text-[#92adc9] text-sm font-normal leading-normal truncate">{displayEmail}</p>
            </div>
          </div>
        </div>

        <div className="p-2 md:p-4 flex-grow flex flex-col gap-2 overflow-y-auto">
          <Link
            to="/admin/dashboard"
            className={`flex items-center gap-3 px-3 py-3 md:py-2 rounded-lg transition-colors ${isActive('/admin/dashboard') ? 'bg-primary/10 dark:bg-[#233648] text-primary dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#233648]'}`}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <p className="hidden md:block text-sm font-medium leading-normal">Painel</p>
          </Link>

          <Link
            to="/admin/clips"
            className={`flex items-center gap-3 px-3 py-3 md:py-2 rounded-lg transition-colors ${isActive('/admin/clips') || isActive('/admin/edit') || isActive('/admin/create') ? 'bg-primary/10 dark:bg-[#233648] text-primary dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#233648]'}`}
          >
            <span className="material-symbols-outlined">movie</span>
            <p className="hidden md:block text-sm font-medium leading-normal">Clipes</p>
          </Link>

          <Link
            to="/admin/comments"
            className={`flex items-center gap-3 px-3 py-3 md:py-2 rounded-lg transition-colors ${isActive('/admin/comments') ? 'bg-primary/10 dark:bg-[#233648] text-primary dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#233648]'}`}
          >
            <span className="material-symbols-outlined">comment</span>
            <p className="hidden md:block text-sm font-medium leading-normal">Comentários</p>
          </Link>

          <Link
            to="/admin/submissions"
            className={`flex items-center gap-3 px-3 py-3 md:py-2 rounded-lg transition-colors ${isActive('/admin/submissions') ? 'bg-primary/10 dark:bg-[#233648] text-primary dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#233648]'}`}
          >
            <span className="material-symbols-outlined">upload_file</span>
            <p className="hidden md:block text-sm font-medium leading-normal">Submissões</p>
          </Link>

          <Link
            to="/admin/requests"
            className={`flex items-center gap-3 px-3 py-3 md:py-2 rounded-lg transition-colors ${isActive('/admin/requests') ? 'bg-primary/10 dark:bg-[#233648] text-primary dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#233648]'}`}
          >
            <span className="material-symbols-outlined">translate</span>
            <p className="hidden md:block text-sm font-medium leading-normal">Pedidos</p>
          </Link>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-[#324d67] mt-auto">
          <Link to="/admin/create" className="hidden md:flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] gap-2 mb-4 hover:bg-primary/90 transition-colors">
            <span className="material-symbols-outlined text-xl">add</span>
            <span className="truncate">Adicionar Clipe</span>
          </Link>

          <Link to="/admin/create" className="md:hidden flex items-center justify-center rounded-lg h-10 w-10 bg-primary text-white mb-4 mx-auto">
            <span className="material-symbols-outlined text-xl">add</span>
          </Link>

          <Link to="/app" className="flex items-center gap-3 px-3 py-2 cursor-pointer text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#233648] rounded-lg w-full text-left">
            <span className="material-symbols-outlined">arrow_back</span>
            <p className="hidden md:block text-sm font-medium leading-normal">Voltar ao Site</p>
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;