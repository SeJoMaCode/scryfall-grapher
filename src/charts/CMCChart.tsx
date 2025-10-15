import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { NormalizedCard } from '../types/scryfall';
import { CustomTooltip } from '../components/CustomTooltip';

interface CMCChartProps {
  cards: NormalizedCard[];
  onSelect?: (cards: NormalizedCard[], description: string) => void;
}

export function CMCChart({ cards, onSelect }: CMCChartProps) {
  // Aggregate cards by CMC
  const cmcData = cards.reduce((acc, card) => {
    const cmc = Math.floor(card.cmc);
    const key = cmc > 10 ? '10+' : cmc.toString();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Convert to array format for Recharts
  const chartData = Object.entries(cmcData)
    .map(([cmc, count]) => ({
      cmc: cmc === '10+' ? cmc : parseInt(cmc),
      count,
      displayCmc: cmc,
    }))
    .sort((a, b) => {
      if (a.displayCmc === '10+') return 1;
      if (b.displayCmc === '10+') return -1;
      return (a.cmc as number) - (b.cmc as number);
    });

  const avgCMC = (cards.reduce((sum, card) => sum + card.cmc, 0) / cards.length).toFixed(2);

  const handleBarClick = (data: any) => {
    if (!onSelect) return;

    const cmcValue = data.displayCmc;
    const filteredCards = cards.filter((card) => {
      const cardCmc = Math.floor(card.cmc);
      if (cmcValue === '10+') {
        return cardCmc >= 10;
      }
      return cardCmc === parseInt(cmcValue);
    });

    onSelect(filteredCards, `Mana Value = ${cmcValue}`);
  };

  return (
    <div>
      <h2>Mana Value Distribution</h2>
      <p style={{ color: '#888', marginBottom: '1rem' }}>
        Average Mana Value: {avgCMC}
      </p>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="displayCmc"
            label={{ value: 'Mana Value', position: 'insideBottom', offset: -5 }}
            stroke="#888"
          />
          <YAxis
            label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
            stroke="#888"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="count"
            fill="#646cff"
            name="Number of Cards"
            onClick={handleBarClick}
            cursor="pointer"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
