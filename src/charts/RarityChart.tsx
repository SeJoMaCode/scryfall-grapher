import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { NormalizedCard } from '../types/scryfall';
import { CustomTooltip } from '../components/CustomTooltip';

interface RarityChartProps {
  cards: NormalizedCard[];
  onSelect?: (cards: NormalizedCard[], description: string) => void;
}

const RARITY_MAP: Record<string, { name: string; color: string }> = {
  common: { name: 'Common', color: '#888' },
  uncommon: { name: 'Uncommon', color: '#C0C0C0' },
  rare: { name: 'Rare', color: '#FFD700' },
  mythic: { name: 'Mythic', color: '#FF4500' },
  special: { name: 'Special', color: '#9370DB' },
  bonus: { name: 'Bonus', color: '#20B2AA' },
};

export function RarityChart({ cards, onSelect }: RarityChartProps) {
  const rarityData = cards.reduce((acc, card) => {
    const rarity = card.rarity;
    const rarityName = RARITY_MAP[rarity]?.name || rarity;
    acc[rarityName] = (acc[rarityName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Filter out zero values and sort by value descending
  const chartData = Object.entries(rarityData)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value);

  const getColor = (name: string): string => {
    const entry = Object.values(RARITY_MAP).find((r) => r.name === name);
    return entry?.color || '#888';
  };

  // Calculate total for percentage-based label rendering
  const total = chartData.reduce((sum, entry) => sum + entry.value, 0);

  // Custom label renderer - only show labels for slices > 3%
  const renderLabel = (entry: any) => {
    const percent = (entry.value / total) * 100;
    if (percent < 3) {
      return ''; // Hide label for small slices
    }
    return `${entry.name}: ${entry.value}`;
  };

  const handlePieClick = (data: any) => {
    if (!onSelect) return;

    const rarityName = data.name;
    const filteredCards = cards.filter((card) => {
      const cardRarityName = RARITY_MAP[card.rarity]?.name || card.rarity;
      return cardRarityName === rarityName;
    });

    onSelect(filteredCards, `Rarity: ${rarityName}`);
  };

  return (
    <div>
      <h2>Rarity Distribution</h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            onClick={handlePieClick}
            cursor="pointer"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
