import { useState } from 'react';
import { NormalizedCard } from '../types/scryfall';
import { CardModal } from './CardModal';
import './CardList.css';

interface CardListProps {
  cards: NormalizedCard[];
  filterDescription?: string;
  onClear?: () => void;
}

type ViewMode = 'grid' | 'list';

export function CardList({ cards, filterDescription, onClear }: CardListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedCard, setSelectedCard] = useState<NormalizedCard | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'cmc' | 'price'>('name');

  if (cards.length === 0) {
    return null;
  }

  // Sort cards
  const sortedCards = [...cards].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'cmc':
        return a.cmc - b.cmc;
      case 'price':
        return (b.priceUsd || 0) - (a.priceUsd || 0);
      default:
        return 0;
    }
  });

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return `$${price.toFixed(2)}`;
  };

  const getColorIndicators = (colors: string[]) => {
    if (colors.length === 0) return <span className="color-indicator colorless">C</span>;
    return colors.map((color) => (
      <span key={color} className={`color-indicator color-${color.toLowerCase()}`}>
        {color}
      </span>
    ));
  };

  return (
    <div className="card-list-container">
      <div className="card-list-header">
        <div className="header-left">
          <h3>Filtered Cards</h3>
          {filterDescription && (
            <span className="filter-description">{filterDescription}</span>
          )}
          <span className="card-count">{cards.length} cards</span>
        </div>

        <div className="header-controls">
          <div className="sort-controls">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
              <option value="name">Name</option>
              <option value="cmc">Mana Value</option>
              <option value="price">Price</option>
            </select>
          </div>

          <div className="view-controls">
            <button
              className={viewMode === 'grid' ? 'active' : ''}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              ⊞
            </button>
            <button
              className={viewMode === 'list' ? 'active' : ''}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              ☰
            </button>
          </div>

          {onClear && (
            <button className="clear-button" onClick={onClear}>
              Clear Filter
            </button>
          )}
        </div>
      </div>

      <div className={`card-list ${viewMode}`}>
        {sortedCards.map((card) => (
          <div
            key={card.id}
            className="card-item"
            onClick={() => setSelectedCard(card)}
          >
            {card.imageUrl && (
              <img
                src={card.imageUrl}
                alt={card.name}
                className="card-image"
                loading="lazy"
              />
            )}
            <div className="card-info">
              <div className="card-name">{card.name}</div>
              <div className="card-details">
                <div className="card-colors">{getColorIndicators(card.colors)}</div>
                <span className="card-cmc">CMC {card.cmc}</span>
                <span className="card-type">{card.types.join(', ')}</span>
                {card.priceUsd && (
                  <span className="card-price">{formatPrice(card.priceUsd)}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedCard && (
        <CardModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
}
