import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { NormalizedCard } from '../types/scryfall';
import { CustomTooltip } from '../components/CustomTooltip';

interface ColorChartProps {
  cards: NormalizedCard[];
  onSelect?: (cards: NormalizedCard[], description: string) => void;
}

const COLOR_MAP: Record<string, { name: string; color: string }> = {
  W: { name: 'White', color: '#F0E68C' },
  U: { name: 'Blue', color: '#0E86D4' },
  B: { name: 'Black', color: '#4A4A4A' },
  R: { name: 'Red', color: '#D32F2F' },
  G: { name: 'Green', color: '#43A047' },
};

export function ColorChart({ cards, onSelect }: ColorChartProps) {
  // Count monocolor, multicolor, and colorless
  const colorData: Record<string, number> = {
    Colorless: 0,
  };

  cards.forEach((card) => {
    if (card.colors.length === 0) {
      colorData.Colorless++;
    } else if (card.colors.length === 1) {
      const colorName = COLOR_MAP[card.colors[0]]?.name || card.colors[0];
      colorData[colorName] = (colorData[colorName] || 0) + 1;
    } else {
      colorData.Multicolor = (colorData.Multicolor || 0) + 1;
    }
  });

  // Filter out zero values and sort by value descending
  const chartData = Object.entries(colorData)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value);

  const COLORS: Record<string, string> = {
    White: COLOR_MAP.W.color,
    Blue: COLOR_MAP.U.color,
    Black: COLOR_MAP.B.color,
    Red: COLOR_MAP.R.color,
    Green: COLOR_MAP.G.color,
    Multicolor: '#FFD700',
    Colorless: '#999',
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

    const colorName = data.name;
    const filteredCards = cards.filter((card) => {
      if (colorName === 'Colorless') {
        return card.colors.length === 0;
      } else if (colorName === 'Multicolor') {
        return card.colors.length > 1;
      } else {
        // Monocolor - find the matching color code
        const colorCode = Object.entries(COLOR_MAP).find(
          ([_, v]) => v.name === colorName
        )?.[0];
        return card.colors.length === 1 && card.colors[0] === colorCode;
      }
    });

    onSelect(filteredCards, `Color: ${colorName}`);
  };

  return (
    <div>
      <h2>Color Distribution</h2>
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
              <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#888'} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
