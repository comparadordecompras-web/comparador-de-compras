import React from 'react';
import { ListChecks, DollarSign, Map, LogIn } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
  <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-100 transition-shadow hover:shadow-xl">
    <div className="text-brand-secondary mb-3">{icon}</div>
    <h3 className="text-xl font-semibold text-brand-dark mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  
  return (
    <div className="min-h-screen bg-brand-light text-brand-dark">
      <header className="bg-brand-primary shadow-md">
        <div className="container mx-auto px-4 md:px-8 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">
            🛒 Comparador de Compras Olímpia
          </h1>
          <button 
            onClick={onStart}
            className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium bg-brand-secondary text-white hover:bg-green-600 transition-colors shadow-lg"
          >
            <LogIn className="w-5 h-5" />
            <span>Entrar / Cadastrar</span>
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8 space-y-12">
        {/* Hero Section */}
        <div className="text-center py-16 bg-white rounded-xl shadow-2xl border border-gray-100">
          <h2 className="text-5xl font-extrabold text-brand-primary mb-4">
            Economize em suas Compras Mensais
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Compare preços entre os principais supermercados de Olímpia-SP (Iquegami, Proença e Max) e descubra o carrinho de compras com o menor custo total.
          </p>
          <button 
            onClick={onStart}
            className="inline-flex items-center space-x-3 px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-brand-secondary hover:bg-green-600 transition-colors transform hover:scale-105"
          >
            <LogIn className="w-5 h-5" />
            <span>Começar a Economizar Agora</span>
          </button>
        </div>

        {/* Features Section */}
        <div className="space-y-6">
          <h3 className="text-3xl font-bold text-brand-dark text-center">
            Recursos Principais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<ListChecks className="w-8 h-8" />}
              title="Lista Inteligente"
              description="Crie sua lista de compras rapidamente, usando o leitor de código de barras para agilizar a entrada de itens."
            />
            <FeatureCard
              icon={<DollarSign className="w-8 h-8" />}
              title="Comparação de Preços"
              description="Insira os preços unitários dos itens nos três mercados e veja o custo total em cada um."
            />
            <FeatureCard
              icon={<Map className="w-8 h-8" />}
              title="Carrinho Otimizado"
              description="Descubra a combinação de compras que resulta no menor gasto total, item por item."
            />
          </div>
        </div>
      </main>

      <footer className="text-center p-6 text-gray-500 text-sm border-t border-gray-200 mt-12">
        <p>&copy; {new Date().getFullYear()} Comparador de Compras Olímpia. Feito para facilitar suas compras.</p>
      </footer>
    </div>
  );
};

export default LandingPage;