import { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { NormalizedCard } from '../types/scryfall';
import { GraphConfig, GraphPreset } from '../types/graph';
import { CMCChart } from '../charts/CMCChart';
import { ColorChart } from '../charts/ColorChart';
import { TypeChart } from '../charts/TypeChart';
import { RarityChart } from '../charts/RarityChart';
import { PriceChart } from '../charts/PriceChart';
import { PresetSelector } from './PresetSelector';
import { CustomGraphBuilder } from './CustomGraphBuilder';
import { CustomGraph } from './CustomGraph';
import { updateUrlParam, readUrlState } from '../utils/urlState';
import './GraphContainer.css';

interface GraphContainerProps {
  cards: NormalizedCard[];
  onCardSelection: (cards: NormalizedCard[], description: string) => void;
  initialChartType?: string;
}

type ChartType = 'cmc' | 'colors' | 'types' | 'rarity' | 'price' | 'custom';
type CustomMode = 'selector' | 'builder' | 'viewing';

export function GraphContainer({ cards, onCardSelection, initialChartType }: GraphContainerProps) {
  const [activeChart, setActiveChart] = useState<ChartType>((initialChartType as ChartType) || 'cmc');
  const [customMode, setCustomMode] = useState<CustomMode>('selector');
  const [activeCustomConfig, setActiveCustomConfig] = useState<GraphConfig | null>(null);
  const chartDisplayRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  // Load custom config from URL on mount
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const urlState = readUrlState();
    if (urlState.customConfig) {
      setActiveCustomConfig(urlState.customConfig);
      setCustomMode('viewing');
    }
  }, []);

  // Update URL when chart changes
  useEffect(() => {
    if (!hasInitialized.current) return;
    updateUrlParam('chart', activeChart);
  }, [activeChart]);

  // Update URL when custom config changes
  useEffect(() => {
    if (!hasInitialized.current) return;
    if (activeChart === 'custom' && activeCustomConfig) {
      updateUrlParam('config', JSON.stringify(activeCustomConfig));
    } else {
      updateUrlParam('config', null);
    }
  }, [activeChart, activeCustomConfig]);

  const chartButtons: { type: ChartType; label: string }[] = [
    { type: 'cmc', label: 'Mana Value' },
    { type: 'colors', label: 'Colors' },
    { type: 'types', label: 'Card Types' },
    { type: 'rarity', label: 'Rarity' },
    { type: 'price', label: 'Price Distribution' },
    { type: 'custom', label: '⚙️ Custom' },
  ];

  const handlePresetSelect = (preset: GraphPreset) => {
    setActiveCustomConfig(preset);
    setCustomMode('viewing');
  };

  const handleCustomCreate = () => {
    setCustomMode('builder');
  };

  const handleCustomApply = (config: GraphConfig) => {
    setActiveCustomConfig(config);
    setCustomMode('viewing');
  };

  const handleBackToSelector = () => {
    setCustomMode('selector');
    setActiveCustomConfig(null);
  };

  const handleExportGraph = async () => {
    if (!chartDisplayRef.current) return;

    try {
      const dataUrl = await toPng(chartDisplayRef.current, {
        cacheBust: true,
        backgroundColor: '#1a1a1a',
        pixelRatio: 2, // Higher quality
      });

      // Create download link
      const link = document.createElement('a');
      const chartName = activeChart === 'custom'
        ? (activeCustomConfig?.name || 'custom-graph')
        : `${activeChart}-chart`;
      link.download = `scryfall-${chartName}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to export graph:', error);
      alert('Failed to export graph. Please try again.');
    }
  };

  return (
    <div className="graph-container">
      <div className="chart-selector">
        {chartButtons.map(({ type, label }) => (
          <button
            key={type}
            className={`chart-button ${activeChart === type ? 'active' : ''}`}
            onClick={() => setActiveChart(type)}
          >
            {label}
          </button>
        ))}
        <button
          className="chart-button export-button"
          onClick={handleExportGraph}
          title="Export graph as PNG"
        >
          📥 Export
        </button>
      </div>

      <div className="chart-display" ref={chartDisplayRef}>
        {activeChart === 'cmc' && <CMCChart cards={cards} onSelect={onCardSelection} />}
        {activeChart === 'colors' && <ColorChart cards={cards} onSelect={onCardSelection} />}
        {activeChart === 'types' && <TypeChart cards={cards} onSelect={onCardSelection} />}
        {activeChart === 'rarity' && <RarityChart cards={cards} onSelect={onCardSelection} />}
        {activeChart === 'price' && <PriceChart cards={cards} onSelect={onCardSelection} />}

        {activeChart === 'custom' && (
          <>
            {customMode === 'selector' && (
              <PresetSelector
                onSelectPreset={handlePresetSelect}
                onCreateCustom={handleCustomCreate}
              />
            )}

            {customMode === 'builder' && (
              <CustomGraphBuilder
                onApply={handleCustomApply}
                onBack={handleBackToSelector}
              />
            )}

            {customMode === 'viewing' && activeCustomConfig && (
              <>
                <button className="back-to-presets-button" onClick={handleBackToSelector}>
                  ← Back to Graph Selection
                </button>
                <CustomGraph
                  cards={cards}
                  config={activeCustomConfig}
                  onSelect={onCardSelection}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
