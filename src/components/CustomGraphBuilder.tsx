import { useState } from 'react';
import { GraphConfig, XAxisField, YAxisMetric, ChartType, GraphFilter } from '../types/graph';
import './CustomGraphBuilder.css';

interface CustomGraphBuilderProps {
  onApply: (config: GraphConfig) => void;
  onBack: () => void;
}

const X_AXIS_OPTIONS: { value: XAxisField; label: string }[] = [
  { value: 'cmc', label: 'Mana Value' },
  { value: 'color', label: 'Color' },
  { value: 'type', label: 'Card Type' },
  { value: 'rarity', label: 'Rarity' },
  { value: 'set', label: 'Set' },
  { value: 'power', label: 'Power' },
  { value: 'toughness', label: 'Toughness' },
  { value: 'year', label: 'Release Year' },
  { value: 'priceRange', label: 'Price Range' },
];

const Y_AXIS_OPTIONS: { value: YAxisMetric; label: string }[] = [
  { value: 'count', label: 'Card Count' },
  { value: 'avgPrice', label: 'Average Price' },
  { value: 'totalPrice', label: 'Total Price' },
  { value: 'avgCmc', label: 'Average CMC' },
  { value: 'avgPower', label: 'Average Power' },
  { value: 'avgToughness', label: 'Average Toughness' },
  { value: 'minPrice', label: 'Minimum Price' },
  { value: 'maxPrice', label: 'Maximum Price' },
];

const CHART_TYPE_OPTIONS: { value: ChartType; label: string; icon: string }[] = [
  { value: 'bar', label: 'Bar Chart', icon: '📊' },
  { value: 'horizontalBar', label: 'Horizontal Bar', icon: '📈' },
  { value: 'pie', label: 'Pie Chart', icon: '🥧' },
  { value: 'line', label: 'Line Chart', icon: '📉' },
];

export function CustomGraphBuilder({ onApply, onBack }: CustomGraphBuilderProps) {
  const [xAxis, setXAxis] = useState<XAxisField>('cmc');
  const [yAxis, setYAxis] = useState<YAxisMetric>('count');
  const [chartType, setChartType] = useState<ChartType>('bar');

  // Filter options
  const [filterCreatures, setFilterCreatures] = useState(false);
  const [filterInstants, setFilterInstants] = useState(false);
  const [filterSorceries, setFilterSorceries] = useState(false);
  const [filterHasPrice, setFilterHasPrice] = useState(false);

  const handleApply = () => {
    const appliedFilters: GraphFilter[] = [];

    // Build type filter
    const selectedTypes: string[] = [];
    if (filterCreatures) selectedTypes.push('Creature');
    if (filterInstants) selectedTypes.push('Instant');
    if (filterSorceries) selectedTypes.push('Sorcery');

    if (selectedTypes.length > 0) {
      appliedFilters.push({
        field: 'type',
        operator: 'in',
        value: selectedTypes,
      });
    }

    // Price filter
    if (filterHasPrice) {
      appliedFilters.push({
        field: 'hasPrice',
        operator: 'exists',
        value: true,
      });
    }

    const config: GraphConfig = {
      id: 'custom',
      name: 'Custom Graph',
      xAxis: {
        field: xAxis,
        label: X_AXIS_OPTIONS.find((o) => o.value === xAxis)!.label,
      },
      yAxis: {
        metric: yAxis,
        label: Y_AXIS_OPTIONS.find((o) => o.value === yAxis)!.label,
      },
      chartType,
      filters: appliedFilters,
    };

    onApply(config);
  };

  const getValidationMessage = (): string | null => {
    // Warn about certain combinations
    if (chartType === 'pie' && ['year', 'set'].includes(xAxis)) {
      return '⚠️ Pie charts work best with fewer categories';
    }

    if (yAxis.includes('Price') && !filterHasPrice) {
      return '💡 Tip: Enable "Only cards with price" filter for better results';
    }

    if ((xAxis === 'power' || xAxis === 'toughness') && !filterCreatures) {
      return '💡 Tip: Enable "Only creatures" filter for power/toughness analysis';
    }

    return null;
  };

  const validationMsg = getValidationMessage();

  return (
    <div className="custom-graph-builder">
      <div className="builder-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Presets
        </button>
        <h3>Build Custom Graph</h3>
      </div>

      <div className="builder-form">
        <div className="form-section">
          <label htmlFor="x-axis">X-Axis (Group By)</label>
          <select
            id="x-axis"
            value={xAxis}
            onChange={(e) => setXAxis(e.target.value as XAxisField)}
          >
            {X_AXIS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-section">
          <label htmlFor="y-axis">Y-Axis (Measure)</label>
          <select
            id="y-axis"
            value={yAxis}
            onChange={(e) => setYAxis(e.target.value as YAxisMetric)}
          >
            {Y_AXIS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-section">
          <label>Chart Type</label>
          <div className="chart-type-grid">
            {CHART_TYPE_OPTIONS.map((option) => (
              <button
                key={option.value}
                className={`chart-type-button ${chartType === option.value ? 'active' : ''}`}
                onClick={() => setChartType(option.value)}
              >
                <span className="chart-icon">{option.icon}</span>
                <span className="chart-label">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-section">
          <label>Filters (Optional)</label>
          <div className="filter-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={filterCreatures}
                onChange={(e) => setFilterCreatures(e.target.checked)}
              />
              <span>Only Creatures</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={filterInstants}
                onChange={(e) => setFilterInstants(e.target.checked)}
              />
              <span>Only Instants</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={filterSorceries}
                onChange={(e) => setFilterSorceries(e.target.checked)}
              />
              <span>Only Sorceries</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={filterHasPrice}
                onChange={(e) => setFilterHasPrice(e.target.checked)}
              />
              <span>Only cards with price data</span>
            </label>
          </div>
        </div>

        {validationMsg && (
          <div className="validation-message">
            {validationMsg}
          </div>
        )}

        <div className="form-actions">
          <button className="apply-button" onClick={handleApply}>
            Generate Graph
          </button>
        </div>
      </div>
    </div>
  );
}
