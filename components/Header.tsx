
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-brand-primary shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
          🛒 Comparador de Compras Olímpia
        </h1>
        <p className="mt-1 text-blue-200">
          Planeje sua lista de compras mensal e economize comparando preços.
        </p>
      </div>
    </header>
  );
};

export default Header;
