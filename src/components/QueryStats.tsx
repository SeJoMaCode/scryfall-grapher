import { NormalizedCard } from '../types/scryfall';
import './QueryStats.css';

interface QueryStatsProps {
  cards: NormalizedCard[];
}

interface ColorStat {
  color: string;
  count: number;
  percentage: number;
}

interface TypeStat {
  type: string;
  count: number;
  percentage: number;
}

interface RarityStat {
  rarity: string;
  count: number;
  percentage: number;
}

export const QueryStats: React.FC<QueryStatsProps> = ({ cards }) => {
  if (cards.length === 0) return null;

  // Calculate average CMC
  const avgCmc = cards.reduce((sum, card) => sum + card.cmc, 0) / cards.length;

  // Calculate color distribution
  const colorCounts = new Map<string, number>();
  cards.forEach(card => {
    if (card.colors.length === 0) {
      colorCounts.set('Colorless', (colorCounts.get('Colorless') || 0) + 1);
    } else if (card.colors.length === 1) {
      colorCounts.set(card.colors[0], (colorCounts.get(card.colors[0]) || 0) + 1);
    } else {
      colorCounts.set('Multicolor', (colorCounts.get('Multicolor') || 0) + 1);
    }
  });

  const colorStats: ColorStat[] = Array.from(colorCounts.entries())
    .map(([color, count]) => ({
      color,
      count,
      percentage: (count / cards.length) * 100
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Calculate type distribution (primary types only)
  const typeCounts = new Map<string, number>();
  cards.forEach(card => {
    if (card.types.length > 0) {
      const primaryType = card.types[0];
      typeCounts.set(primaryType, (typeCounts.get(primaryType) || 0) + 1);
    }
  });

  const typeStats: TypeStat[] = Array.from(typeCounts.entries())
    .map(([type, count]) => ({
      type,
      count,
      percentage: (count / cards.length) * 100
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Calculate rarity distribution
  const rarityCounts = new Map<string, number>();
  cards.forEach(card => {
    rarityCounts.set(card.rarity, (rarityCounts.get(card.rarity) || 0) + 1);
  });

  const rarityStats: RarityStat[] = Array.from(rarityCounts.entries())
    .map(([rarity, count]) => ({
      rarity,
      count,
      percentage: (count / cards.length) * 100
    }))
    .sort((a, b) => b.count - a.count);

  // Calculate price statistics
  const cardsWithPrice = cards.filter(card => card.priceUsd !== undefined && card.priceUsd > 0);
  const avgPrice = cardsWithPrice.length > 0
    ? cardsWithPrice.reduce((sum, card) => sum + (card.priceUsd || 0), 0) / cardsWithPrice.length
    : 0;
  const minPrice = cardsWithPrice.length > 0
    ? Math.min(...cardsWithPrice.map(c => c.priceUsd || 0))
    : 0;
  const maxPrice = cardsWithPrice.length > 0
    ? Math.max(...cardsWithPrice.map(c => c.priceUsd || 0))
    : 0;

  // Calculate median price
  const sortedPrices = cardsWithPrice
    .map(c => c.priceUsd || 0)
    .sort((a, b) => a - b);
  const medianPrice = sortedPrices.length > 0
    ? sortedPrices[Math.floor(sortedPrices.length / 2)]
    : 0;

  const colorSymbols: Record<string, string> = {
    'W': '⚪',
    'U': '🔵',
    'B': '⚫',
    'R': '🔴',
    'G': '🟢',
    'Colorless': '◇',
    'Multicolor': '🌈'
  };

  return (
    <div className="query-stats">
      <div className="stats-grid">
        {/* Total Cards */}
        <div className="stat-card">
          <div className="stat-label">Total Cards</div>
          <div className="stat-value">{cards.length}</div>
        </div>

        {/* Average CMC */}
        <div className="stat-card">
          <div className="stat-label">Average CMC</div>
          <div className="stat-value">{avgCmc.toFixed(2)}</div>
        </div>

        {/* Color Distribution */}
        <div className="stat-card stat-card-wide">
          <div className="stat-label">Colors</div>
          <div className="stat-breakdown">
            {colorStats.map(stat => (
              <div key={stat.color} className="stat-item">
                <span className="stat-icon">{colorSymbols[stat.color] || '○'}</span>
                <span className="stat-name">{stat.color}</span>
                <span className="stat-count">{stat.count}</span>
                <span className="stat-percentage">({stat.percentage.toFixed(1)}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Type Distribution */}
        <div className="stat-card stat-card-wide">
          <div className="stat-label">Card Types</div>
          <div className="stat-breakdown">
            {typeStats.map(stat => (
              <div key={stat.type} className="stat-item">
                <span className="stat-name">{stat.type}</span>
                <span className="stat-count">{stat.count}</span>
                <span className="stat-percentage">({stat.percentage.toFixed(1)}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rarity Distribution */}
        <div className="stat-card">
          <div className="stat-label">Rarity</div>
          <div className="stat-breakdown">
            {rarityStats.map(stat => (
              <div key={stat.rarity} className="stat-item">
                <span className="stat-name">{stat.rarity}</span>
                <span className="stat-count">{stat.count}</span>
                <span className="stat-percentage">({stat.percentage.toFixed(1)}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price Statistics */}
        {cardsWithPrice.length > 0 && (
          <div className="stat-card">
            <div className="stat-label">Price Stats (USD)</div>
            <div className="stat-breakdown">
              <div className="stat-item">
                <span className="stat-name">Average</span>
                <span className="stat-count">${avgPrice.toFixed(2)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-name">Median</span>
                <span className="stat-count">${medianPrice.toFixed(2)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-name">Range</span>
                <span className="stat-count">${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-name">Cards with price</span>
                <span className="stat-count">{cardsWithPrice.length} of {cards.length}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
