import { NormalizedCard } from '../types/scryfall';
import {
  GraphConfig,
  GraphFilter,
  ChartData,
  ChartDataPoint,
  XAxisField,
  YAxisMetric,
} from '../types/graph';

export class GraphDataTransformer {
  /**
   * Main transformation function
   */
  transform(cards: NormalizedCard[], config: GraphConfig): ChartData {
    // 1. Apply filters
    const filteredCards = this.applyFilters(cards, config.filters);

    // 2. Group by X-axis field
    const grouped = this.groupBy(filteredCards, config.xAxis.field);

    // 3. Calculate metric for each group
    const dataPoints = this.calculateMetric(grouped, config.yAxis.metric);

    // 4. Sort and format
    const sortedData = this.sortData(dataPoints, config.xAxis.field);

    return {
      data: sortedData,
      xLabel: config.xAxis.label,
      yLabel: config.yAxis.label,
      chartType: config.chartType,
    };
  }

  /**
   * Apply filters to cards
   */
  private applyFilters(cards: NormalizedCard[], filters: GraphFilter[]): NormalizedCard[] {
    return cards.filter((card) => {
      return filters.every((filter) => {
        switch (filter.field) {
          case 'type':
            if (filter.operator === 'in') {
              return filter.value.some((t: string) => card.types.includes(t));
            }
            return card.types.includes(filter.value);

          case 'color':
            if (filter.operator === 'in') {
              return filter.value.some((c: string) => card.colors.includes(c));
            }
            return card.colors.includes(filter.value);

          case 'rarity':
            if (filter.operator === 'in') {
              return filter.value.includes(card.rarity);
            }
            return card.rarity === filter.value;

          case 'cmc':
            if (filter.operator === 'range') {
              return card.cmc >= filter.value[0] && card.cmc <= filter.value[1];
            }
            return card.cmc === filter.value;

          case 'hasPrice':
            return filter.value ? card.priceUsd !== undefined : true;

          case 'hasPower':
            return filter.value ? card.power !== undefined : true;

          default:
            return true;
        }
      });
    });
  }

  /**
   * Group cards by field
   */
  private groupBy(
    cards: NormalizedCard[],
    field: XAxisField
  ): Map<string, NormalizedCard[]> {
    const groups = new Map<string, NormalizedCard[]>();

    cards.forEach((card) => {
      const key = this.getGroupKey(card, field);
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(card);
    });

    return groups;
  }

  /**
   * Get grouping key for a card
   */
  private getGroupKey(card: NormalizedCard, field: XAxisField): string {
    switch (field) {
      case 'cmc':
        return Math.floor(card.cmc) > 10 ? '10+' : Math.floor(card.cmc).toString();

      case 'color':
        if (card.colors.length === 0) return 'Colorless';
        if (card.colors.length > 1) return 'Multicolor';
        const colorMap: Record<string, string> = {
          W: 'White',
          U: 'Blue',
          B: 'Black',
          R: 'Red',
          G: 'Green',
        };
        return colorMap[card.colors[0]] || card.colors[0];

      case 'type':
        return card.types[0] || 'Other';

      case 'rarity':
        return card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1);

      case 'set':
        return card.set.toUpperCase();

      case 'power':
        if (card.power === undefined) return 'N/A';
        return card.power > 5 ? '5+' : card.power.toString();

      case 'toughness':
        if (card.toughness === undefined) return 'N/A';
        return card.toughness > 5 ? '5+' : card.toughness.toString();

      case 'year':
        return new Date(card.releasedAt).getFullYear().toString();

      case 'priceRange':
        if (!card.priceUsd) return 'No Price';
        if (card.priceUsd < 1) return '$0-1';
        if (card.priceUsd < 5) return '$1-5';
        if (card.priceUsd < 10) return '$5-10';
        if (card.priceUsd < 25) return '$10-25';
        return '$25+';

      default:
        return 'Unknown';
    }
  }

  /**
   * Calculate metric for each group
   */
  private calculateMetric(
    groups: Map<string, NormalizedCard[]>,
    metric: YAxisMetric
  ): ChartDataPoint[] {
    const dataPoints: ChartDataPoint[] = [];

    groups.forEach((cards, key) => {
      let value = 0;

      switch (metric) {
        case 'count':
          value = cards.length;
          break;

        case 'avgPrice':
          const pricesForAvg = cards
            .map((c) => c.priceUsd)
            .filter((p): p is number => p !== undefined);
          value =
            pricesForAvg.length > 0
              ? pricesForAvg.reduce((sum, p) => sum + p, 0) / pricesForAvg.length
              : 0;
          break;

        case 'totalPrice':
          value = cards
            .map((c) => c.priceUsd || 0)
            .reduce((sum, p) => sum + p, 0);
          break;

        case 'avgCmc':
          value = cards.reduce((sum, c) => sum + c.cmc, 0) / cards.length;
          break;

        case 'avgPower':
          const powersForAvg = cards
            .map((c) => c.power)
            .filter((p): p is number => p !== undefined);
          value =
            powersForAvg.length > 0
              ? powersForAvg.reduce((sum, p) => sum + p, 0) / powersForAvg.length
              : 0;
          break;

        case 'avgToughness':
          const toughnessForAvg = cards
            .map((c) => c.toughness)
            .filter((t): t is number => t !== undefined);
          value =
            toughnessForAvg.length > 0
              ? toughnessForAvg.reduce((sum, t) => sum + t, 0) / toughnessForAvg.length
              : 0;
          break;

        case 'minPrice':
          const pricesForMin = cards
            .map((c) => c.priceUsd)
            .filter((p): p is number => p !== undefined);
          value = pricesForMin.length > 0 ? Math.min(...pricesForMin) : 0;
          break;

        case 'maxPrice':
          const pricesForMax = cards
            .map((c) => c.priceUsd)
            .filter((p): p is number => p !== undefined);
          value = pricesForMax.length > 0 ? Math.max(...pricesForMax) : 0;
          break;
      }

      dataPoints.push({
        key,
        label: key,
        value: Math.round(value * 100) / 100, // Round to 2 decimals
        count: cards.length,
        cards: cards.map((c) => c.id),
      });
    });

    return dataPoints;
  }

  /**
   * Sort data points appropriately
   */
  private sortData(data: ChartDataPoint[], field: XAxisField): ChartDataPoint[] {
    // For CMC, power, toughness - sort numerically
    if (['cmc', 'power', 'toughness'].includes(field)) {
      return data.sort((a, b) => {
        if (a.key === '10+' || a.key === '5+') return 1;
        if (b.key === '10+' || b.key === '5+') return -1;
        return Number(a.key) - Number(b.key);
      });
    }

    // For year - sort by year
    if (field === 'year') {
      return data.sort((a, b) => Number(a.key) - Number(b.key));
    }

    // For rarity - specific order
    if (field === 'rarity') {
      const rarityOrder = ['Common', 'Uncommon', 'Rare', 'Mythic', 'Special', 'Bonus'];
      return data.sort(
        (a, b) => rarityOrder.indexOf(a.label) - rarityOrder.indexOf(b.label)
      );
    }

    // For colors - WUBRG order
    if (field === 'color') {
      const colorOrder = ['White', 'Blue', 'Black', 'Red', 'Green', 'Multicolor', 'Colorless'];
      return data.sort((a, b) => colorOrder.indexOf(a.label) - colorOrder.indexOf(b.label));
    }

    // For everything else, sort by value (descending)
    return data.sort((a, b) => b.value - a.value);
  }
}

export const graphTransformer = new GraphDataTransformer();
