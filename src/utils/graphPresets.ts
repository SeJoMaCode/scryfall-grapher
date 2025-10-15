import { GraphPreset } from '../types/graph';

/**
 * Pre-defined graph configurations for quick analysis
 */
export const GRAPH_PRESETS: GraphPreset[] = [
  {
    id: 'mana-curve',
    name: 'Mana Curve',
    description: 'Distribution of cards by mana value',
    category: 'essential',
    xAxis: { field: 'cmc', label: 'Mana Value' },
    yAxis: { metric: 'count', label: 'Number of Cards' },
    chartType: 'bar',
    filters: [],
    icon: '📊',
  },
  {
    id: 'color-distribution',
    name: 'Color Distribution',
    description: 'Breakdown by color identity',
    category: 'essential',
    xAxis: { field: 'color', label: 'Color' },
    yAxis: { metric: 'count', label: 'Number of Cards' },
    chartType: 'pie',
    filters: [],
    icon: '🎨',
  },
  {
    id: 'type-breakdown',
    name: 'Type Breakdown',
    description: 'Cards by card type',
    category: 'essential',
    xAxis: { field: 'type', label: 'Card Type' },
    yAxis: { metric: 'count', label: 'Number of Cards' },
    chartType: 'horizontalBar',
    filters: [],
    icon: '🃏',
  },
  {
    id: 'rarity-distribution',
    name: 'Rarity Distribution',
    description: 'Cards by rarity',
    category: 'essential',
    xAxis: { field: 'rarity', label: 'Rarity' },
    yAxis: { metric: 'count', label: 'Number of Cards' },
    chartType: 'pie',
    filters: [],
    icon: '💎',
  },
  {
    id: 'price-by-rarity',
    name: 'Price by Rarity',
    description: 'Average price for each rarity',
    category: 'analysis',
    xAxis: { field: 'rarity', label: 'Rarity' },
    yAxis: { metric: 'avgPrice', label: 'Average Price (USD)' },
    chartType: 'bar',
    filters: [{ field: 'hasPrice', operator: 'exists', value: true }],
    icon: '💰',
  },
  {
    id: 'power-distribution',
    name: 'Power Distribution',
    description: 'Creature power values',
    category: 'analysis',
    xAxis: { field: 'power', label: 'Power' },
    yAxis: { metric: 'count', label: 'Number of Creatures' },
    chartType: 'bar',
    filters: [
      { field: 'type', operator: 'in', value: ['Creature'] },
      { field: 'hasPower', operator: 'exists', value: true },
    ],
    icon: '💪',
  },
  {
    id: 'set-comparison',
    name: 'Set Comparison',
    description: 'Card count by set',
    category: 'analysis',
    xAxis: { field: 'set', label: 'Set' },
    yAxis: { metric: 'count', label: 'Number of Cards' },
    chartType: 'horizontalBar',
    filters: [],
    icon: '📚',
  },
  {
    id: 'value-by-color',
    name: 'Value by Color',
    description: 'Total collection value by color',
    category: 'analysis',
    xAxis: { field: 'color', label: 'Color' },
    yAxis: { metric: 'totalPrice', label: 'Total Value (USD)' },
    chartType: 'bar',
    filters: [{ field: 'hasPrice', operator: 'exists', value: true }],
    icon: '💵',
  },
  {
    id: 'yearly-releases',
    name: 'Yearly Releases',
    description: 'Cards released by year',
    category: 'analysis',
    xAxis: { field: 'year', label: 'Year' },
    yAxis: { metric: 'count', label: 'Number of Cards' },
    chartType: 'line',
    filters: [],
    icon: '📅',
  },
  {
    id: 'price-ranges',
    name: 'Price Ranges',
    description: 'Card distribution by price range',
    category: 'analysis',
    xAxis: { field: 'priceRange', label: 'Price Range' },
    yAxis: { metric: 'count', label: 'Number of Cards' },
    chartType: 'bar',
    filters: [{ field: 'hasPrice', operator: 'exists', value: true }],
    icon: '💸',
  },
];

/**
 * Get preset by ID
 */
export function getPreset(id: string): GraphPreset | undefined {
  return GRAPH_PRESETS.find((p) => p.id === id);
}

/**
 * Get presets by category
 */
export function getPresetsByCategory(category: 'essential' | 'analysis'): GraphPreset[] {
  return GRAPH_PRESETS.filter((p) => p.category === category);
}

/**
 * Get all essential presets (most commonly used)
 */
export function getEssentialPresets(): GraphPreset[] {
  return getPresetsByCategory('essential');
}

/**
 * Get all analysis presets (more advanced)
 */
export function getAnalysisPresets(): GraphPreset[] {
  return getPresetsByCategory('analysis');
}
