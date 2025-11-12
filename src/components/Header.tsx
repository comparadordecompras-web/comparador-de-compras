import React from 'react';
import { ListChecks, BarChart3, Info, LogOut, User, Archive, Package } from 'lucide-react';
import { AppView } from '../types';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface HeaderProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  user: SupabaseUser | null;
  onLogout: () => void;
}

// Componente auxiliar para links de navegação
const NavLink: React.FC<{ icon: React.ReactNode, label: string, view: AppView, currentView: AppView, onClick: (view: AppView) => void }> = ({ icon, label, view, currentView, onClick }) => (
  <a
    href="#"
    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
      currentView === view
        ? 'bg-blue-700 text-white'
        : 'text-blue-200 hover:bg-blue-600 hover:text-white'
    }`}
    onClick={(e) => {
      e.preventDefault();
      onClick(view);
    }}
  >
    {icon}
    <span>{label}</span>
  </a>
);

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, user, onLogout }) => {
  const userEmail = user?.email || 'Usuário';

  return (
    <header className="bg-brand-primary shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              🛒 Comparador de Compras Olímpia
            </h1>
            <p className="mt-1 text-blue-200 text-sm">
              Planeje sua lista de compras mensal e economize comparando preços.
            </p>
          </div>
          
          {/* User Info and Logout */}
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-white text-sm">
                <User className="w-4 h-4 mr-2 text-blue-200" />
                <span>{userEmail}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                aria-label="Sair da conta"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          )}
        </div>
        
        {/* Navigation Menu */}
        <nav className="mt-4 pt-3 border-t border-blue-700/50">
          <div className="flex space-x-4 overflow-x-auto pb-1">
            <NavLink 
              icon={<ListChecks className="w-5 h-5" />} 
              label="Lista de Compras" 
              view="list"
              currentView={currentView}
              onClick={onViewChange}
            />
            <NavLink 
              icon={<Package className="w-5 h-5" />} 
              label="Catálogo de Produtos" 
              view="product_catalog"
              currentView={currentView}
              onClick={onViewChange}
            />
            <NavLink 
              icon={<BarChart3 className="w-5 h-5" />} 
              label="Análise" 
              view="analysis"
              currentView={currentView}
              onClick={onViewChange}
            />
            <NavLink 
              icon={<Archive className="w-5 h-5" />} 
              label="Listas Salvas" 
              view="saved_lists"
              currentView={currentView}
              onClick={onViewChange}
            />
            <NavLink 
              icon={<Info className="w-5 h-5" />} 
              label="Sobre" 
              view="about"
              currentView={currentView}
              onClick={onViewChange}
            />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;