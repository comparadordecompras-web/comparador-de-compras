import React from 'react';
import { Map, DollarSign, ListChecks } from 'lucide-react';

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
  <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-100 transition-shadow hover:shadow-xl">
    <div className="text-brand-primary mb-3">{icon}</div>
    <h3 className="text-xl font-semibold text-brand-dark mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const About: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-brand-primary mb-4">
          Sobre o Comparador de Compras Olímpia
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Este aplicativo foi desenvolvido com o objetivo de simplificar e otimizar suas compras mensais na cidade de Olímpia-SP. Nossa missão é ajudar você a economizar tempo e dinheiro, garantindo que você faça as melhores escolhas em cada supermercado.
        </p>
        <p className="text-gray-600">
          Atualmente, comparamos os preços dos principais supermercados da região: **Iquegami**, **Proença** e **Max Atacadista**.
        </p>
      </div>

      <div className="p-8 bg-brand-light rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-brand-dark mb-6 text-center">
          Como Funciona?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<ListChecks className="w-8 h-8" />}
            title="Monte sua Lista"
            description="Adicione todos os itens que você precisa comprar, especificando a quantidade e a unidade (kg, L, un, etc.)."
          />
          <FeatureCard
            icon={<DollarSign className="w-8 h-8" />}
            title="Compare os Preços"
            description="Insira o preço unitário de cada item em cada um dos três supermercados para uma comparação justa."
          />
          <FeatureCard
            icon={<Map className="w-8 h-8" />}
            title="Otimize o Carrinho"
            description="Veja o custo total em cada mercado e descubra o 'Carrinho Otimizado', que mostra o menor custo total comprando cada item no local mais barato."
          />
        </div>
      </div>
      
      <div className="text-center pt-4 text-gray-500">
        <p>Desenvolvido com ❤️ para a comunidade de Olímpia.</p>
      </div>
    </div>
  );
};

export default About;