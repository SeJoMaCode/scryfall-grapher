import { ScryfallCard, NormalizedCard } from '../types/scryfall';

/**
 * Normalizes Scryfall cards with different layouts into a consistent format
 * Handles: normal, split, flip, transform, modal_dfc, adventure, etc.
 */
export function normalizeCard(card: ScryfallCard): NormalizedCard {
  const { types, supertypes, subtypes } = parseTypeLine(card);

  // Extract data based on layout
  const { colors, cmc, power, toughness, defense, imageUrl, oracleText, backFace } = extractLayoutSpecificData(card);

  return {
    id: card.id,
    name: card.name,
    layout: card.layout,
    cmc: cmc ?? card.cmc,
    colors: colors ?? card.colors ?? [],
    colorIdentity: card.color_identity,
    types,
    supertypes,
    subtypes,
    rarity: card.rarity,
    set: card.set,
    setName: card.set_name,
    collectorNumber: card.collector_number,
    oracleText,
    power,
    toughness,
    defense,
    priceUsd: parsePrice(card.prices.usd),
    priceEur: parsePrice(card.prices.eur),
    releasedAt: card.released_at,
    imageUrl,
    backFace,
  };
}

/**
 * Extract data for different card layouts
 */
function extractLayoutSpecificData(card: ScryfallCard): {
  colors?: string[];
  cmc?: number;
  power?: number;
  toughness?: number;
  defense?: number;
  imageUrl?: string;
  oracleText?: string;
  backFace?: {
    name: string;
    imageUrl?: string;
    oracleText?: string;
    typeLine: string;
    manaCost?: string;
    colors?: string[];
    power?: number;
    toughness?: number;
    defense?: number;
  };
} {
  const result: ReturnType<typeof extractLayoutSpecificData> = {};

  switch (card.layout) {
    case 'normal':
    case 'leveler':
    case 'saga':
    case 'class':
    case 'mutate':
    case 'prototype':
      // Standard single-faced cards
      result.colors = card.colors;
      result.power = parseNumeric(card.power);
      result.toughness = parseNumeric(card.toughness);
      result.defense = parseNumeric(card.defense);
      result.imageUrl = card.image_uris?.normal;
      result.oracleText = card.oracle_text;
      break;

    case 'split':
      // Split cards (e.g., Fire // Ice)
      // Combine data from both faces
      if (card.card_faces) {
        const allColors = new Set<string>();
        const oracleTexts: string[] = [];
        card.card_faces.forEach(face => {
          face.colors?.forEach(c => allColors.add(c));
          if (face.oracle_text) oracleTexts.push(face.oracle_text);
        });
        result.colors = Array.from(allColors);
        result.oracleText = oracleTexts.join('\n//\n');
        // Use first face for image
        result.imageUrl = card.card_faces[0].image_uris?.normal ?? card.image_uris?.normal;
      }
      break;

    case 'flip':
      // Flip cards (e.g., Rune-Tail, Kitsune Ascendant)
      // Use the front face (first face)
      if (card.card_faces && card.card_faces[0]) {
        const frontFace = card.card_faces[0];
        result.colors = frontFace.colors;
        result.power = parseNumeric(frontFace.power);
        result.toughness = parseNumeric(frontFace.toughness);
        result.oracleText = frontFace.oracle_text;
        result.imageUrl = card.image_uris?.normal;
      }
      break;

    case 'transform':
    case 'modal_dfc':
    case 'battle':
      // Transform/Modal DFC cards (e.g., Invasion of Alara, Agadeem's Awakening)
      // Use the front face (first face) for most stats
      if (card.card_faces && card.card_faces[0]) {
        const frontFace = card.card_faces[0];
        result.colors = frontFace.colors ?? card.colors;
        result.power = parseNumeric(frontFace.power);
        result.toughness = parseNumeric(frontFace.toughness);
        result.defense = parseNumeric(frontFace.defense);
        result.oracleText = frontFace.oracle_text;
        result.imageUrl = frontFace.image_uris?.normal ?? card.image_uris?.normal;

        // Extract back face data if it exists
        if (card.card_faces[1]) {
          const backFace = card.card_faces[1];
          result.backFace = {
            name: backFace.name,
            imageUrl: backFace.image_uris?.normal,
            oracleText: backFace.oracle_text,
            typeLine: backFace.type_line,
            manaCost: backFace.mana_cost,
            colors: backFace.colors,
            power: parseNumeric(backFace.power),
            toughness: parseNumeric(backFace.toughness),
            defense: parseNumeric(backFace.defense),
          };
        }
      }
      break;

    case 'adventure':
      // Adventure cards have a main creature and an adventure spell
      // Use the main card (first face)
      if (card.card_faces && card.card_faces[0]) {
        const mainFace = card.card_faces[0];
        result.colors = mainFace.colors;
        result.power = parseNumeric(mainFace.power);
        result.toughness = parseNumeric(mainFace.toughness);
        result.oracleText = mainFace.oracle_text;
        result.imageUrl = card.image_uris?.normal;
      }
      break;

    case 'meld':
      // Meld cards - use front face
      if (card.card_faces && card.card_faces[0]) {
        result.colors = card.card_faces[0].colors;
        result.power = parseNumeric(card.card_faces[0].power);
        result.toughness = parseNumeric(card.card_faces[0].toughness);
        result.oracleText = card.card_faces[0].oracle_text;
        result.imageUrl = card.card_faces[0].image_uris?.normal;
      }
      break;

    default:
      // Fallback for unknown layouts
      result.colors = card.colors;
      result.power = parseNumeric(card.power);
      result.toughness = parseNumeric(card.toughness);
      result.defense = parseNumeric(card.defense);
      result.oracleText = card.oracle_text;
      result.imageUrl = card.image_uris?.normal;
  }

  return result;
}

/**
 * Parse type line into types, supertypes, and subtypes
 * Example: "Legendary Creature — Kitsune Cleric" ->
 *   supertypes: ["Legendary"], types: ["Creature"], subtypes: ["Kitsune", "Cleric"]
 */
function parseTypeLine(card: ScryfallCard): {
  types: string[];
  supertypes: string[];
  subtypes: string[];
} {
  // For multi-faced cards, use the front face type line
  const typeLine = card.card_faces?.[0]?.type_line ?? card.type_line;

  const [typesPart, subtypesPart] = typeLine.split('—').map(s => s.trim());

  const typeWords = typesPart.split(' ').filter(Boolean);

  const knownSupertypes = ['Legendary', 'Basic', 'Snow', 'World', 'Ongoing'];
  const knownTypes = ['Creature', 'Artifact', 'Enchantment', 'Land', 'Planeswalker',
    'Instant', 'Sorcery', 'Battle', 'Kindred', 'Tribal'];

  const supertypes = typeWords.filter(w => knownSupertypes.includes(w));
  const types = typeWords.filter(w => knownTypes.includes(w));
  const subtypes = subtypesPart ? subtypesPart.split(' ').filter(Boolean) : [];

  return { types, supertypes, subtypes };
}

/**
 * Parse power/toughness/defense values (can be numbers, *, X, etc.)
 */
function parseNumeric(value?: string): number | undefined {
  if (!value) return undefined;
  const num = parseFloat(value);
  return isNaN(num) ? undefined : num;
}

/**
 * Parse price strings to numbers
 */
function parsePrice(price?: string | null): number | undefined {
  if (!price) return undefined;
  const num = parseFloat(price);
  return isNaN(num) ? undefined : num;
}

/**
 * Normalize multiple cards
 */
export function normalizeCards(cards: ScryfallCard[]): NormalizedCard[] {
  return cards.map(normalizeCard);
}
