import { GraphPreset } from '../types/graph';
import { getEssentialPresets, getAnalysisPresets } from '../utils/graphPresets';
import './PresetSelector.css';

interface PresetSelectorProps {
  onSelectPreset: (preset: GraphPreset) => void;
  onCreateCustom: () => void;
}

export function PresetSelector({ onSelectPreset, onCreateCustom }: PresetSelectorProps) {
  const essentialPresets = getEssentialPresets();
  const analysisPresets = getAnalysisPresets();

  return (
    <div className="preset-selector">
      <div className="preset-header">
        <h3>Choose a Graph Type</h3>
        <p className="preset-subtitle">Select a preset or create your own custom graph</p>
      </div>

      <div className="preset-section">
        <h4 className="section-title">Essential Graphs</h4>
        <div className="preset-grid">
          {essentialPresets.map((preset) => (
            <button
              key={preset.id}
              className="preset-card"
              onClick={() => onSelectPreset(preset)}
            >
              <div className="preset-icon">{preset.icon}</div>
              <div className="preset-name">{preset.name}</div>
              <div className="preset-description">{preset.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="preset-section">
        <h4 className="section-title">Analysis Graphs</h4>
        <div className="preset-grid">
          {analysisPresets.map((preset) => (
            <button
              key={preset.id}
              className="preset-card"
              onClick={() => onSelectPreset(preset)}
            >
              <div className="preset-icon">{preset.icon}</div>
              <div className="preset-name">{preset.name}</div>
              <div className="preset-description">{preset.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="custom-section">
        <button className="custom-button" onClick={onCreateCustom}>
          <span className="custom-icon">⚙️</span>
          <span>Create Custom Graph</span>
        </button>
      </div>
    </div>
  );
}
