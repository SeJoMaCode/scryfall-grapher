// Custom graph configuration types

export type XAxisField =
  | 'cmc'
  | 'color'
  | 'type'
  | 'rarity'
  | 'set'
  | 'power'
  | 'toughness'
  | 'year'
  | 'priceRange';

export type YAxisMetric =
  | 'count'
  | 'avgPrice'
  | 'totalPrice'
  | 'avgCmc'
  | 'avgPower'
  | 'avgToughness'
  | 'minPrice'
  | 'maxPrice';

export type ChartType =
  | 'bar'
  | 'horizontalBar'
  | 'pie'
  | 'line'
  | 'scatter'
  | 'area';

export interface GraphAxisConfig {
  field: XAxisField;
  label: string;
}

export interface GraphMetricConfig {
  metric: YAxisMetric;
  label: string;
}

export interface GraphFilter {
  field: 'type' | 'color' | 'rarity' | 'cmc' | 'hasPrice' | 'hasPower';
  operator: 'equals' | 'in' | 'range' | 'exists';
  value: any;
}

export interface GraphConfig {
  id: string;
  name: string;
  description?: string;
  xAxis: GraphAxisConfig;
  yAxis: GraphMetricConfig;
  chartType: ChartType;
  filters: GraphFilter[];
  colorScheme?: string;
}

export interface GraphPreset extends GraphConfig {
  category: 'essential' | 'analysis' | 'custom';
  icon?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface ChartDataPoint {
  key: string | number;
  label: string;
  value: number;
  count?: number; // Number of cards in this group
  cards?: string[]; // Card IDs for filtering
}

export interface ChartData {
  data: ChartDataPoint[];
  xLabel: string;
  yLabel: string;
  chartType: ChartType;
}
