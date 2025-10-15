import { NormalizedCard } from '../types/scryfall';
import './CardModal.css';

interface CardModalProps {
  card: NormalizedCard;
  onClose: () => void;
}

export function CardModal({ card, onClose }: CardModalProps) {
  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return `$${price.toFixed(2)}`;
  };

  const getColorName = (code: string) => {
    const colorMap: Record<string, string> = {
      W: 'White',
      U: 'Blue',
      B: 'Black',
      R: 'Red',
      G: 'Green',
    };
    return colorMap[code] || code;
  };

  // Convert card name to URL slug (e.g., "Carrot Cake" -> "carrot-cake")
  const createCardSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  const scryfallUrl = `https://scryfall.com/card/${card.set}/${card.collectorNumber}/${createCardSlug(card.name)}`;

  const isDoubleFaced = !!card.backFace;

  // For double-faced cards, extract just the front face name
  const getFrontFaceName = () => {
    if (!isDoubleFaced) return card.name;
    // Split on " // " to get just the front face name
    const parts = card.name.split(' // ');
    return parts[0] || card.name;
  };

  return (
    <div className="card-modal-overlay" onClick={onClose}>
      <div className={`card-modal ${isDoubleFaced ? 'double-faced' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="modal-content">
          {/* Front Face */}
          <div className="modal-face">
            <div className="modal-face-header">
              <h3 className="face-indicator">Front Face</h3>
            </div>
            <div className="modal-left">
              {card.imageUrl ? (
                <img src={card.imageUrl} alt={card.name} className="modal-image" />
              ) : (
                <div className="modal-image-placeholder">No image available</div>
              )}
            </div>

            <div className="modal-right">
              <h2 className="modal-title">{getFrontFaceName()}</h2>

            <div className="modal-details">
              <div className="detail-row">
                <span className="detail-label">Type:</span>
                <span className="detail-value">
                  {card.supertypes.length > 0 && `${card.supertypes.join(' ')} `}
                  {card.types.join(' ')}
                  {card.subtypes.length > 0 && ` — ${card.subtypes.join(' ')}`}
                </span>
              </div>

              {card.oracleText && (
                <div className="detail-row oracle-text-row">
                  <span className="detail-label">Oracle Text:</span>
                  <span className="detail-value oracle-text">
                    {card.oracleText}
                  </span>
                </div>
              )}

              {!isDoubleFaced && (
                <div className="detail-row">
                  <span className="detail-label">Mana Value:</span>
                  <span className="detail-value">{card.cmc}</span>
                </div>
              )}

              {card.colors.length > 0 ? (
                <div className="detail-row">
                  <span className="detail-label">Colors:</span>
                  <span className="detail-value">
                    {card.colors.map(getColorName).join(', ')}
                  </span>
                </div>
              ) : (
                <div className="detail-row">
                  <span className="detail-label">Colors:</span>
                  <span className="detail-value">Colorless</span>
                </div>
              )}

              {(card.power !== undefined || card.toughness !== undefined) && (
                <div className="detail-row">
                  <span className="detail-label">Power/Toughness:</span>
                  <span className="detail-value">
                    {card.power ?? '*'}/{card.toughness ?? '*'}
                  </span>
                </div>
              )}

              {card.defense !== undefined && (
                <div className="detail-row">
                  <span className="detail-label">Defense:</span>
                  <span className="detail-value">{card.defense}</span>
                </div>
              )}
            </div>
            </div>
          </div>

          {/* Divider between faces */}
          {card.backFace && <div className="face-divider"></div>}

          {/* Back Face */}
          {card.backFace && (
            <div className="modal-face">
              <div className="modal-face-header">
                <h3 className="face-indicator">Back Face</h3>
              </div>
              <div className="modal-left">
                {card.backFace.imageUrl ? (
                  <img src={card.backFace.imageUrl} alt={card.backFace.name} className="modal-image" />
                ) : (
                  <div className="modal-image-placeholder">No image available</div>
                )}
              </div>

              <div className="modal-right">
                <h2 className="modal-title">{card.backFace.name}</h2>

                <div className="modal-details">
                  <div className="detail-row">
                    <span className="detail-label">Type:</span>
                    <span className="detail-value">{card.backFace.typeLine}</span>
                  </div>

                  {card.backFace.oracleText && (
                    <div className="detail-row oracle-text-row">
                      <span className="detail-label">Oracle Text:</span>
                      <span className="detail-value oracle-text">
                        {card.backFace.oracleText}
                      </span>
                    </div>
                  )}

                  {card.backFace.manaCost && (
                    <div className="detail-row">
                      <span className="detail-label">Mana Cost:</span>
                      <span className="detail-value">{card.backFace.manaCost}</span>
                    </div>
                  )}

                  {card.backFace.colors && card.backFace.colors.length > 0 ? (
                    <div className="detail-row">
                      <span className="detail-label">Colors:</span>
                      <span className="detail-value">
                        {card.backFace.colors.map(getColorName).join(', ')}
                      </span>
                    </div>
                  ) : (
                    <div className="detail-row">
                      <span className="detail-label">Colors:</span>
                      <span className="detail-value">Colorless</span>
                    </div>
                  )}

                  {(card.backFace.power !== undefined || card.backFace.toughness !== undefined) && (
                    <div className="detail-row">
                      <span className="detail-label">Power/Toughness:</span>
                      <span className="detail-value">
                        {card.backFace.power ?? '*'}/{card.backFace.toughness ?? '*'}
                      </span>
                    </div>
                  )}

                  {card.backFace.defense !== undefined && (
                    <div className="detail-row">
                      <span className="detail-label">Defense:</span>
                      <span className="detail-value">{card.backFace.defense}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Shared Card Information */}
          <div className="shared-info">
            <h3 className="shared-info-header">Card Details</h3>
            <div className="shared-info-content">
              {isDoubleFaced && (
                <div className="detail-row">
                  <span className="detail-label">Mana Value:</span>
                  <span className="detail-value">{card.cmc}</span>
                </div>
              )}

              {card.colorIdentity.length > 0 && (
                <div className="detail-row">
                  <span className="detail-label">Color Identity:</span>
                  <span className="detail-value">
                    {card.colorIdentity.map(getColorName).join(', ')}
                  </span>
                </div>
              )}

              <div className="detail-row">
                <span className="detail-label">Rarity:</span>
                <span className="detail-value">{card.rarity}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Set:</span>
                <span className="detail-value">
                  {card.setName} ({card.set.toUpperCase()})
                </span>
              </div>

              {(card.priceUsd || card.priceEur) && (
                <div className="detail-row">
                  <span className="detail-label">Price:</span>
                  <span className="detail-value">
                    {card.priceUsd && `USD: ${formatPrice(card.priceUsd)}`}
                    {card.priceUsd && card.priceEur && ' | '}
                    {card.priceEur && `EUR: €${card.priceEur.toFixed(2)}`}
                  </span>
                </div>
              )}

              <div className="detail-row">
                <span className="detail-label">Released:</span>
                <span className="detail-value">
                  {new Date(card.releasedAt).toLocaleDateString()}
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Layout:</span>
                <span className="detail-value">{card.layout}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="modal-actions">
              <a
                href={scryfallUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="scryfall-link"
              >
                View on Scryfall →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
