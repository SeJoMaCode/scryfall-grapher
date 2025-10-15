import { TooltipProps } from 'recharts';
import './CustomTooltip.css';

export function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="custom-recharts-tooltip">
      {label && <p className="custom-tooltip-label">{label}</p>}
      <ul className="custom-tooltip-list">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="custom-tooltip-item">
            {entry.color && (
              <span
                className="custom-tooltip-indicator"
                style={{ backgroundColor: entry.color }}
              />
            )}
            <span className="custom-tooltip-name">{entry.name}:</span>
            <span className="custom-tooltip-value">
              {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
