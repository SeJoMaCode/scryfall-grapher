import { useState, useEffect, FormEvent } from 'react';
import './SearchBar.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading: boolean;
  initialQuery?: string;
}

export function SearchBar({ onSearch, loading, initialQuery }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery || '');

  // Update query when initialQuery changes (e.g., from URL or reset)
  useEffect(() => {
    setQuery(initialQuery || '');
  }, [initialQuery]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const examples = [
    { label: 'Cheap Removal', query: 'o:destroy cmc<=3 (c:w or c:b)' },
    { label: 'Card Draw', query: 'o:"draw" (t:instant or t:sorcery) cmc<=3' },
    { label: 'Big Creatures', query: 't:creature pow>=5 cmc<=6' },
    { label: 'Commander Legends', query: 'f:commander t:legendary t:creature' },
  ];

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter Scryfall query (e.g., t:creature c:red)"
          className="search-input"
          disabled={loading}
        />
        <button type="submit" disabled={loading || !query.trim()}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      <div className="examples">
        <span className="examples-label">Examples:</span>
        {examples.map((ex, i) => (
          <button
            key={i}
            type="button"
            className="example-button"
            onClick={() => {
              setQuery(ex.query);
              onSearch(ex.query);
            }}
            disabled={loading}
          >
            {ex.label}
          </button>
        ))}
        <a
          href="https://scryfall.com/docs/syntax"
          target="_blank"
          rel="noopener noreferrer"
          className="syntax-link"
        >
          Syntax Guide
        </a>
      </div>
    </div>
  );
}
