import { useState, useRef, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { GraphContainer } from './components/GraphContainer';
import { CardList } from './components/CardList';
import { QueryStats } from './components/QueryStats';
import { NormalizedCard } from './types/scryfall';
import { scryfallApi } from './services/scryfallApi';
import { normalizeCards } from './utils/cardNormalizer';
import { readUrlState, updateUrlParam } from './utils/urlState';
import './App.css';

function App() {
  const [cards, setCards] = useState<NormalizedCard[]>([]);
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [selectedCards, setSelectedCards] = useState<NormalizedCard[]>([]);
  const [filterDescription, setFilterDescription] = useState<string>('');
  const [initialChartType, setInitialChartType] = useState<string | undefined>(undefined);
  const cardListRef = useRef<HTMLDivElement>(null);
  const hasLoadedFromUrl = useRef(false);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    setProgress(null);
    setCards([]);
    setSelectedCards([]);
    setFilterDescription('');
    setCurrentQuery(query);

    // Update URL with search query (updateUrlParam handles compression)
    updateUrlParam('q', query);

    try {
      const results = await scryfallApi.searchCards(query, (currentCards, total) => {
        setProgress({ current: currentCards.length, total });
      });

      const normalized = normalizeCards(results);
      setCards(normalized);
      setProgress(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCardSelection = (filteredCards: NormalizedCard[], description: string) => {
    setSelectedCards(filteredCards);
    setFilterDescription(description);
  };

  const handleClearSelection = () => {
    setSelectedCards([]);
    setFilterDescription('');
  };

  // Load state from URL on mount
  useEffect(() => {
    if (hasLoadedFromUrl.current) return;
    hasLoadedFromUrl.current = true;

    const urlState = readUrlState();

    // Set initial chart type if present
    if (urlState.chart) {
      setInitialChartType(urlState.chart);
    }

    // Auto-execute search if query is present
    if (urlState.query) {
      handleSearch(urlState.query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll to card list when cards are selected
  useEffect(() => {
    if (selectedCards.length > 0 && cardListRef.current) {
      // Small delay to ensure the component has rendered
      setTimeout(() => {
        cardListRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }, [selectedCards]);

  const handleLogoClick = () => {
    // Clear all state
    setCards([]);
    setCurrentQuery('');
    setError(null);
    setProgress(null);
    setSelectedCards([]);
    setFilterDescription('');
    setInitialChartType(undefined);

    // Clear URL
    window.history.pushState({}, '', window.location.pathname);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="clickable-title" onClick={handleLogoClick}>Scryfall Grapher</h1>
        <p className="subtitle">Build customizable graphs from Scryfall card queries</p>
      </header>

      <SearchBar onSearch={handleSearch} loading={loading} initialQuery={currentQuery} />

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {progress && (
        <div className="progress-message">
          Loading cards: {progress.current} / {progress.total}
        </div>
      )}

      {cards.length > 0 && (
        <div className="results">
          <p className="results-count">Found {cards.length} cards</p>
          <QueryStats cards={cards} />
          <GraphContainer cards={cards} onCardSelection={handleCardSelection} initialChartType={initialChartType} />
          {selectedCards.length > 0 && (
            <div ref={cardListRef}>
              <CardList
                cards={selectedCards}
                filterDescription={filterDescription}
                onClear={handleClearSelection}
              />
            </div>
          )}
        </div>
      )}

      {!loading && !error && cards.length === 0 && (
        <div className="empty-state">
          <p>Enter a Scryfall query to get started</p>
          <p className="help-text">
            Examples: <code>t:creature cmc&lt;=3</code>, <code>c:red pow&gt;=5</code>, <code>set:war</code>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
