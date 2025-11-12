import React from 'react';

const MapSection: React.FC = () => {
  const markets = [
    { name: 'Iquegami Supermercados', query: 'Iquegami+Supermercados+Olímpia+SP' },
    { name: 'Proença Supermercados', query: 'Proença+Supermercados+Rua+do+Bumba+Meu+Boi+431+Olímpia+SP' },
    { name: 'Max Atacadista', query: 'Max+Atacadista+Olímpia+SP' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-brand-dark">Localização dos Mercados</h2>
      <div className="space-y-3">
        {markets.map(market => (
          <a
            key={market.name}
            href={`https://www.google.com/maps/search/?api=1&query=${market.query}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-gray-100 text-gray-800 py-2 px-4 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
          >
            Ver {market.name} no Mapa
          </a>
        ))}
      </div>
    </div>
  );
};

export default MapSection;