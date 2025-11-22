import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const PublicLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200 font-display">
      <header className="sticky top-0 z-50 flex w-full items-center justify-center whitespace-nowrap border-b border-white/10 bg-background-dark/90 px-6 py-4 backdrop-blur-sm">
        <div className="flex w-full max-w-6xl items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 text-white">
              <span className="material-symbols-outlined text-primary text-2xl">closed_caption</span>
              <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Clipes Legendados</h2>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className={`text-sm font-medium leading-normal transition-colors ${isActive('/') ? 'text-white' : 'text-white/80 hover:text-white'}`}>Início</Link>
              <Link to="/" className="text-white/80 hover:text-white text-sm font-medium leading-normal transition-colors">Artistas</Link>
              <Link to="/about" className={`text-sm font-medium leading-normal transition-colors ${isActive('/about') ? 'text-white' : 'text-white/80 hover:text-white'}`}>Sobre Mim</Link>
              <Link to="/collaborators" className={`text-sm font-medium leading-normal transition-colors ${isActive('/collaborators') ? 'text-white' : 'text-white/80 hover:text-white'}`}>Colaboradores</Link>
              <Link to="/request" className={`text-sm font-medium leading-normal transition-colors ${isActive('/request') ? 'text-white' : 'text-white/80 hover:text-white'}`}>Solicitar Legenda</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard" className="hidden md:flex items-center justify-center h-9 px-4 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary text-sm font-bold transition-colors">
              Entrar
            </Link>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-white">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background-dark border-b border-white/10 p-4 flex flex-col gap-4">
           <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-white/80 hover:text-white">Início</Link>
           <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-white/80 hover:text-white">Sobre Mim</Link>
           <Link to="/collaborators" onClick={() => setIsMobileMenuOpen(false)} className="text-white/80 hover:text-white">Colaboradores</Link>
           <Link to="/request" onClick={() => setIsMobileMenuOpen(false)} className="text-white/80 hover:text-white">Solicitar Legenda</Link>
           <Link to="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-primary font-bold">Entrar como Admin</Link>
        </div>
      )}

      <main className="flex-grow flex flex-col items-center w-full">
        <Outlet />
      </main>

      <footer className="w-full border-t border-white/10 mt-auto bg-background-dark px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
          <p className="text-sm text-white/60">© 2024 Clipes Legendados. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4 text-sm">
            <Link to="#" className="text-white/60 hover:text-white transition-colors">Política de Privacidade</Link>
            <Link to="#" className="text-white/60 hover:text-white transition-colors">Termos de Uso</Link>
            <Link to="#" className="text-white/60 hover:text-white transition-colors">Contato</Link>
          </div>
          <div className="flex items-center gap-4 text-white/60">
            <a href="#" className="hover:text-white transition-colors"><i className="fab fa-twitter text-lg"></i></a>
            <a href="#" className="hover:text-white transition-colors"><i className="fab fa-instagram text-lg"></i></a>
            <a href="#" className="hover:text-white transition-colors"><i className="fab fa-youtube text-lg"></i></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;