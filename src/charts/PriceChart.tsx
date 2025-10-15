import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { NormalizedCard } from '../types/scryfall';
import { CustomTooltip } from '../components/CustomTooltip';

interface PriceChartProps {
  cards: NormalizedCard[];
  onSelect?: (cards: NormalizedCard[], description: string) => void;
}

export function PriceChart({ cards, onSelect }: PriceChartProps) {
  // Filter cards with prices
  const cardsWithPrices = cards.filter((card) => card.priceUsd !== undefined && card.priceUsd > 0);

  if (cardsWithPrices.length === 0) {
    return (
      <div>
        <h2>Price Distribution</h2>
        <p style={{ color: '#888', textAlign: 'center', marginTop: '2rem' }}>
          No price data available for these cards
        </p>
      </div>
    );
  }

  const chartData = cardsWithPrices.map((card) => ({
    name: card.name,
    cmc: card.cmc,
    price: card.priceUsd,
    cardId: card.id, // Store card ID to find it on click
  }));

  const avgPrice = (
    cardsWithPrices.reduce((sum, card) => sum + (card.priceUsd || 0), 0) /
    cardsWithPrices.length
  ).toFixed(2);

  const maxPrice = Math.max(...cardsWithPrices.map((c) => c.priceUsd || 0)).toFixed(2);
  const minPrice = Math.min(...cardsWithPrices.map((c) => c.priceUsd || 0)).toFixed(2);

  const handleScatterClick = (data: any) => {
    if (!onSelect || !data || !data.cardId) return;

    const clickedCard = cards.find((card) => card.id === data.cardId);
    if (clickedCard) {
      onSelect([clickedCard], `${clickedCard.name} ($${clickedCard.priceUsd?.toFixed(2)})`);
    }
  };

  return (
    <div>
      <h2>Price Distribution</h2>
      <p style={{ color: '#888', marginBottom: '1rem' }}>
        {cardsWithPrices.length} of {cards.length} cards have price data
        <br />
        Average: ${avgPrice} | Min: ${minPrice} | Max: ${maxPrice}
      </p>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="cmc"
            type="number"
            name="Mana Value"
            label={{ value: 'Mana Value', position: 'insideBottom', offset: -5 }}
            stroke="#888"
          />
          <YAxis
            dataKey="price"
            type="number"
            name="Price (USD)"
            label={{ value: 'Price (USD)', angle: -90, position: 'insideLeft' }}
            stroke="#888"
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={<CustomTooltip />}
          />
          <Legend />
          <Scatter
            name="Cards"
            data={chartData}
            fill="#8884d8"
            onClick={handleScatterClick}
            cursor="pointer"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
