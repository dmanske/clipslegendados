import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200 font-display overflow-hidden">
      <aside className="flex flex-col w-20 md:w-64 lg:w-96 bg-white dark:bg-[#111a22] border-r border-gray-200 dark:border-[#324d67] flex-shrink-0 transition-all duration-300">
        <div className="p-4 border-b border-gray-200 dark:border-[#324d67]">
          <div className="flex gap-3 items-center mb-0 md:mb-4 justify-center md:justify-start">
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shrink-0" 
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA3dKWDPacTxtN13wZN53JPpBklQ3sStRa5UlcqFEE4p6F5kfac9qbK3uyNH31TF0H9Q0lu5Afv867LpwatI5T7rNxOJnfQBipxB4sLekfTEKaIIgFdpDP2xs08hBv56ZKHWj7hC7fyQNGO3jWzl4y5igPFwS0L4R0svzCru_zL-BuSr7Pc-EHG68EyJP6pPtx5_ynrxQfF-rUlvXfW3mbOchaSoqq4fkhK_c67Tcil4Y1ykAnKhCH5PGj8Baq7GbHC5znbaanBpmZ2')" }}
            ></div>
            <div className="hidden md:flex flex-col overflow-hidden">
              <h1 className="text-gray-900 dark:text-white text-base font-medium leading-normal truncate">Admin</h1>
              <p className="text-gray-500 dark:text-[#92adc9] text-sm font-normal leading-normal truncate">admin@website.com</p>
            </div>
          </div>
        </div>
        
        <div className="p-2 md:p-4 flex-grow flex flex-col gap-2 overflow-y-auto">
          <Link 
            to="/admin/dashboard" 
            className={`flex items-center gap-3 px-3 py-3 md:py-2 rounded-lg transition-colors ${isActive('/admin/dashboard') ? 'bg-primary/10 dark:bg-[#233648] text-primary dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#233648]'}`}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <p className="hidden md:block text-sm font-medium leading-normal">Dashboard</p>
          </Link>
          
          <Link 
            to="/admin/clips" 
            className={`flex items-center gap-3 px-3 py-3 md:py-2 rounded-lg transition-colors ${isActive('/admin/clips') || isActive('/admin/edit') || isActive('/admin/create') ? 'bg-primary/10 dark:bg-[#233648] text-primary dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#233648]'}`}
          >
            <span className="material-symbols-outlined">movie</span>
            <p className="hidden md:block text-sm font-medium leading-normal">Clips</p>
          </Link>

          <Link 
            to="/admin/comments" 
            className={`flex items-center gap-3 px-3 py-3 md:py-2 rounded-lg transition-colors ${isActive('/admin/comments') ? 'bg-primary/10 dark:bg-[#233648] text-primary dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#233648]'}`}
          >
            <span className="material-symbols-outlined">comment</span>
            <p className="hidden md:block text-sm font-medium leading-normal">Comentários</p>
          </Link>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-[#324d67] mt-auto">
          <Link to="/admin/create" className="hidden md:flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] gap-2 mb-4 hover:bg-primary/90 transition-colors">
            <span className="material-symbols-outlined text-xl">add</span>
            <span className="truncate">Add New Clip</span>
          </Link>
          
          <Link to="/admin/create" className="md:hidden flex items-center justify-center rounded-lg h-10 w-10 bg-primary text-white mb-4 mx-auto">
            <span className="material-symbols-outlined text-xl">add</span>
          </Link>

          <div className="flex flex-col gap-1">
            <button className="flex items-center gap-3 px-3 py-2 cursor-pointer text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#233648] rounded-lg">
              <span className="material-symbols-outlined">settings</span>
              <p className="hidden md:block text-sm font-medium leading-normal">Settings</p>
            </button>
            <button onClick={() => navigate('/')} className="flex items-center gap-3 px-3 py-2 cursor-pointer text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#233648] rounded-lg w-full text-left">
              <span className="material-symbols-outlined">logout</span>
              <p className="hidden md:block text-sm font-medium leading-normal">Logout</p>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;