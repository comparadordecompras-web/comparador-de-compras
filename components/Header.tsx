import React from 'react';
import { ListChecks, BarChart3, Info } from 'lucide-react';

// Componente auxiliar para links de navegação
const NavLink: React.FC<{ icon: React.ReactNode, label: string, active: boolean }> = ({ icon, label, active }) => (
  <a
    href="#"
    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
      active
        ? 'bg-blue-700 text-white'
        : 'text-blue-200 hover:bg-blue-600 hover:text-white'
    }`}
    onClick={(e) => e.preventDefault()} // Mantém o foco na página atual
  >
    {icon}
    <span>{label}</span>
  </a>
);

const Header: React.FC = () => {
  return (
    <header className="bg-brand-primary shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              🛒 Comparador de Compras Olímpia
            </h1>
            <p className="mt-1 text-blue-200 text-sm">
              Planeje sua lista de compras mensal e economize comparando preços.
            </p>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <nav className="mt-4 pt-3 border-t border-blue-700/50">
          <div className="flex space-x-4 overflow-x-auto pb-1">
            <NavLink 
              icon={<ListChecks className="w-5 h-5" />} 
              label="Lista de Compras" 
              active={true} 
            />
            <NavLink 
              icon={<BarChart3 className="w-5 h-5" />} 
              label="Análise (Em Breve)" 
              active={false} 
            />
            <NavLink 
              icon={<Info className="w-5 h-5" />} 
              label="Sobre (Em Breve)" 
              active={false} 
            />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;