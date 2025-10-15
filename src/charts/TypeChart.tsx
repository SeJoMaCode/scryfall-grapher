import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { NormalizedCard } from '../types/scryfall';
import { CustomTooltip } from '../components/CustomTooltip';

interface TypeChartProps {
  cards: NormalizedCard[];
  onSelect?: (cards: NormalizedCard[], description: string) => void;
}

export function TypeChart({ cards, onSelect }: TypeChartProps) {
  // Count by primary card type
  const typeData = cards.reduce((acc, card) => {
    // Use the first type as the primary type
    const primaryType = card.types[0] || 'Other';
    acc[primaryType] = (acc[primaryType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(typeData)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  const handleBarClick = (data: any) => {
    if (!onSelect) return;

    const cardType = data.type;
    const filteredCards = cards.filter((card) => {
      return card.types[0] === cardType || (card.types.length === 0 && cardType === 'Other');
    });

    onSelect(filteredCards, `Type: ${cardType}`);
  };

  return (
    <div>
      <h2>Card Type Distribution</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            type="number"
            stroke="#888"
            label={{ value: 'Count', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            type="category"
            dataKey="type"
            stroke="#888"
            width={100}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="count"
            fill="#82ca9d"
            name="Number of Cards"
            onClick={handleBarClick}
            cursor="pointer"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
