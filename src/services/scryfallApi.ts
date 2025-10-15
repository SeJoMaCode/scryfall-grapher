import { ScryfallCard, ScryfallSearchResponse } from '../types/scryfall';

const SCRYFALL_API_BASE = 'https://api.scryfall.com';
const RATE_LIMIT_MS = 100; // 100ms between requests (10 req/sec max)

class ScryfallApiService {
  private lastRequestTime = 0;

  private async rateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < RATE_LIMIT_MS) {
      await new Promise(resolve =>
        setTimeout(resolve, RATE_LIMIT_MS - timeSinceLastRequest)
      );
    }

    this.lastRequestTime = Date.now();
  }

  async searchCards(query: string, onProgress?: (cards: ScryfallCard[], total: number) => void): Promise<ScryfallCard[]> {
    const allCards: ScryfallCard[] = [];
    let nextPage: string | undefined = `${SCRYFALL_API_BASE}/cards/search?q=${encodeURIComponent(query)}`;

    while (nextPage) {
      await this.rateLimit();

      const response = await fetch(nextPage, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'ScryfallGrapher/1.0'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to fetch cards from Scryfall');
      }

      const data: ScryfallSearchResponse = await response.json();
      allCards.push(...data.data);

      // Call progress callback if provided
      if (onProgress) {
        onProgress(allCards, data.total_cards);
      }

      nextPage = data.has_more ? data.next_page : undefined;
    }

    return allCards;
  }

  async getCardByName(name: string): Promise<ScryfallCard> {
    await this.rateLimit();

    const response = await fetch(
      `${SCRYFALL_API_BASE}/cards/named?fuzzy=${encodeURIComponent(name)}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'ScryfallGrapher/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Card not found');
    }

    return response.json();
  }
}

export const scryfallApi = new ScryfallApiService();
