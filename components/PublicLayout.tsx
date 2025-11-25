import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, isAdmin } = useAuth();

  const isActive = (path: string) => location.pathname === path;
  const base = '/app';

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200 font-display">
      <header className="sticky top-0 z-50 flex w-full items-center justify-center whitespace-nowrap border-b border-white/10 bg-background-dark/90 px-6 py-4 backdrop-blur-sm">
        <div className="flex w-full max-w-6xl items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/app" className="flex items-center gap-3 text-white">
              <span className="material-symbols-outlined text-primary text-2xl">lyrics</span>
              <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Letra na Tela</h2>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link to={`${base}`} className={`text-sm font-medium leading-normal transition-colors ${isActive(base) ? 'text-white' : 'text-white/80 hover:text-white'}`}>Início</Link>
              <Link to={`${base}/library`} className={`text-sm font-medium leading-normal transition-colors ${isActive(base + '/library') ? 'text-white' : 'text-white/80 hover:text-white'}`}>Todos os Clipes</Link>
              <Link to={`${base}/about`} className={`text-sm font-medium leading-normal transition-colors ${isActive(base + '/about') ? 'text-white' : 'text-white/80 hover:text-white'}`}>Sobre</Link>
              <Link to={`${base}/collaborators`} className={`text-sm font-medium leading-normal transition-colors ${isActive(base + '/collaborators') ? 'text-white' : 'text-white/80 hover:text-white'}`}>Artistas Favoritos</Link>
              <Link to={`${base}/translation-request`} className={`text-sm font-medium leading-normal transition-colors ${isActive(base + '/translation-request') ? 'text-white' : 'text-white/80 hover:text-white'}`}>Pedidos</Link>
              <Link to={`${base}/request`} className={`text-sm font-medium leading-normal transition-colors ${isActive(base + '/request') ? 'text-white' : 'text-white/80 hover:text-white'}`}>Contribua</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 hover:bg-white/5 rounded-full p-1 pr-3 transition-colors"
              >
                <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block text-sm text-white font-medium max-w-[100px] truncate">
                  {profile?.full_name || user?.email?.split('@')[0]}
                </span>
                <span className="material-symbols-outlined text-white text-sm">expand_more</span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#111a22] border border-[#324d67] rounded-lg shadow-xl py-1 text-white z-50">
                  <div className="px-4 py-2 border-b border-[#324d67] mb-1">
                    <p className="text-xs text-[#92adc9]">Logado como</p>
                    <p className="text-sm font-bold truncate">{user?.email}</p>
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-primary/20 hover:text-primary transition-colors"
                    >
                      Painel Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-white">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background-dark border-b border-white/10 p-4 flex flex-col gap-4 animate-fade-in">
          <Link to={`${base}`} onClick={() => setIsMobileMenuOpen(false)} className="text-white/80 hover:text-white">Início</Link>
          <Link to={`${base}/library`} onClick={() => setIsMobileMenuOpen(false)} className="text-white/80 hover:text-white">Todos os Clipes</Link>
          <Link to={`${base}/about`} onClick={() => setIsMobileMenuOpen(false)} className="text-white/80 hover:text-white">Sobre Mim</Link>
          <Link to={`${base}/collaborators`} onClick={() => setIsMobileMenuOpen(false)} className="text-white/80 hover:text-white">Artistas Favoritos</Link>
          <Link to={`${base}/translation-request`} onClick={() => setIsMobileMenuOpen(false)} className="text-white/80 hover:text-white">Pedidos</Link>
          <Link to={`${base}/request`} onClick={() => setIsMobileMenuOpen(false)} className="text-white/80 hover:text-white">Contribua</Link>
          {isAdmin && (
            <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-primary font-bold">Ir para Admin</Link>
          )}
          <button onClick={handleLogout} className="text-red-400 text-left">Sair</button>
        </div>
      )}

      <main className="flex-grow flex flex-col items-center w-full">
        <Outlet />
      </main>

      <footer className="w-full border-t border-white/10 mt-auto bg-background-dark px-6 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-white/60">© 2025 Letra na Tela. Entenda. Cante. Sinta - Autor: Daniel Manske</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;