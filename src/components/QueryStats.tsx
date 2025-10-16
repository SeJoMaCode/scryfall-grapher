import { NormalizedCard } from '../types/scryfall';
import './QueryStats.css';

interface QueryStatsProps {
  cards: NormalizedCard[];
}

export const QueryStats: React.FC<QueryStatsProps> = ({ cards }) => {
  if (cards.length === 0) return null;

  // Calculate average CMC
  const avgCmc = cards.reduce((sum, card) => sum + card.cmc, 0) / cards.length;

  // Calculate price statistics
  const cardsWithPrice = cards.filter(card => card.priceUsd !== undefined && card.priceUsd > 0);
  const sortedPrices = cardsWithPrice
    .map(c => c.priceUsd || 0)
    .sort((a, b) => a - b);
  const medianPrice = sortedPrices.length > 0
    ? sortedPrices[Math.floor(sortedPrices.length / 2)]
    : 0;
  const minPrice = sortedPrices.length > 0 ? sortedPrices[0] : 0;
  const maxPrice = sortedPrices.length > 0 ? sortedPrices[sortedPrices.length - 1] : 0;

  return (
    <div className="query-stats">
      <div className="stat-item">
        <span className="stat-label">Avg CMC:</span>
        <span className="stat-value">{avgCmc.toFixed(2)}</span>
      </div>
      {cardsWithPrice.length > 0 && (
        <>
          <div className="stat-separator">•</div>
          <div className="stat-item">
            <span className="stat-label">Median Price:</span>
            <span className="stat-value">${medianPrice.toFixed(2)}</span>
          </div>
          <div className="stat-separator">•</div>
          <div className="stat-item">
            <span className="stat-label">Range:</span>
            <span className="stat-value">${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}</span>
          </div>
        </>
      )}
    </div>
  );
};
