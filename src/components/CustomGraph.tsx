import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { NormalizedCard } from '../types/scryfall';
import { GraphConfig } from '../types/graph';
import { graphTransformer } from '../utils/graphDataTransformer';
import { CustomTooltip } from './CustomTooltip';

interface CustomGraphProps {
  cards: NormalizedCard[];
  config: GraphConfig;
  onSelect?: (cards: NormalizedCard[], description: string) => void;
}

const CHART_COLORS = [
  '#646cff',
  '#82ca9d',
  '#ffc658',
  '#ff8042',
  '#8884d8',
  '#a4de6c',
  '#d0ed57',
  '#83a6ed',
];

export function CustomGraph({ cards, config, onSelect }: CustomGraphProps) {
  const chartData = graphTransformer.transform(cards, config);

  const handleClick = (data: any) => {
    if (!onSelect || !data || !data.cards) return;

    const filteredCards = cards.filter((card) => data.cards.includes(card.id));
    onSelect(filteredCards, `${config.xAxis.label}: ${data.label}`);
  };

  // Format chart data for Recharts
  const rechartsData = chartData.data.map((point) => ({
    name: point.label,
    value: point.value,
    count: point.count,
    cards: point.cards,
  }));

  // Calculate total for percentage-based label rendering
  const total = rechartsData.reduce((sum, entry) => sum + entry.value, 0);

  // Custom label renderer for pie charts - only show labels for slices > 3%
  const renderPieLabel = (entry: any) => {
    const percent = (entry.value / total) * 100;
    if (percent < 3) {
      return ''; // Hide label for small slices
    }
    return `${entry.name}: ${entry.value}`;
  };

  const renderChart = () => {
    switch (config.chartType) {
      case 'bar':
        return (
          <BarChart data={rechartsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="value"
              fill="#646cff"
              name={chartData.yLabel}
              onClick={handleClick}
              cursor="pointer"
            />
          </BarChart>
        );

      case 'horizontalBar':
        return (
          <BarChart data={rechartsData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis type="number" stroke="#888" />
            <YAxis dataKey="name" type="category" stroke="#888" width={100} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="value"
              fill="#82ca9d"
              name={chartData.yLabel}
              onClick={handleClick}
              cursor="pointer"
            />
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={rechartsData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderPieLabel}
              outerRadius={120}
              dataKey="value"
              onClick={handleClick}
              cursor="pointer"
            >
              {rechartsData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        );

      case 'line':
        return (
          <LineChart data={rechartsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#646cff"
              strokeWidth={2}
              name={chartData.yLabel}
              dot={{ cursor: 'pointer' }}
              onClick={handleClick}
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart data={rechartsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#646cff"
              fill="#646cff"
              fillOpacity={0.6}
              name={chartData.yLabel}
            />
          </AreaChart>
        );

      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div>
      <h2>{config.name}</h2>
      {config.description && (
        <p style={{ color: '#888', marginBottom: '1rem' }}>{config.description}</p>
      )}
      <ResponsiveContainer width="100%" height={400}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}
