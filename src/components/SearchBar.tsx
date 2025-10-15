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
      </div>

      <details className="syntax-help">
        <summary>Scryfall Query Syntax Help</summary>
        <div className="syntax-content">
          <h3>Common Filters:</h3>
          <ul>
            <li><code>t:TYPE</code> - Card type (creature, instant, etc.)</li>
            <li><code>c:COLOR</code> - Color (w, u, b, r, g)</li>
            <li><code>cmc=N</code> - Mana value equals N</li>
            <li><code>cmc&lt;=N</code> - Mana value less than or equal to N</li>
            <li><code>pow&gt;=N</code> - Power greater than or equal to N</li>
            <li><code>set:CODE</code> - From a specific set</li>
            <li><code>r:RARITY</code> - Rarity (c, u, r, m)</li>
            <li><code>o:TEXT</code> - Oracle text contains TEXT</li>
            <li><code>f:FORMAT</code> - Legal in format (standard, modern, etc.)</li>
          </ul>
          <p>
            <strong>Operators:</strong> <code>and</code>, <code>or</code>, <code>not</code>, <code>()</code> for grouping
          </p>
          <p>
            <a href="https://scryfall.com/docs/syntax" target="_blank" rel="noopener noreferrer">
              Full Scryfall Syntax Guide
            </a>
          </p>
        </div>
      </details>
    </div>
  );
}
