// Scryfall API types
export interface ScryfallCard {
  id: string;
  name: string;
  layout: CardLayout;
  mana_cost?: string;
  cmc: number;
  type_line: string;
  oracle_text?: string;
  power?: string;
  toughness?: string;
  defense?: string;
  colors?: string[];
  color_identity: string[];
  keywords?: string[];
  rarity: string;
  set: string;
  set_name: string;
  collector_number: string;
  prices: {
    usd?: string | null;
    usd_foil?: string | null;
    eur?: string | null;
    eur_foil?: string | null;
  };
  card_faces?: CardFace[];
  image_uris?: ImageUris;
  released_at: string;
}

export interface CardFace {
  name: string;
  mana_cost?: string;
  type_line: string;
  oracle_text?: string;
  colors?: string[];
  power?: string;
  toughness?: string;
  defense?: string;
  image_uris?: ImageUris;
}

export interface ImageUris {
  small: string;
  normal: string;
  large: string;
  png: string;
  art_crop: string;
  border_crop: string;
}

export type CardLayout =
  | 'normal'
  | 'split'
  | 'flip'
  | 'transform'
  | 'modal_dfc'
  | 'meld'
  | 'leveler'
  | 'class'
  | 'saga'
  | 'adventure'
  | 'mutate'
  | 'prototype'
  | 'battle'
  | 'planar'
  | 'scheme'
  | 'vanguard'
  | 'token'
  | 'double_faced_token'
  | 'emblem'
  | 'augment'
  | 'host'
  | 'art_series'
  | 'reversible_card';

export interface ScryfallSearchResponse {
  object: 'list';
  total_cards: number;
  has_more: boolean;
  next_page?: string;
  data: ScryfallCard[];
}

export interface NormalizedCard {
  id: string;
  name: string;
  layout: CardLayout;
  cmc: number;
  colors: string[];
  colorIdentity: string[];
  types: string[];
  supertypes: string[];
  subtypes: string[];
  rarity: string;
  set: string;
  setName: string;
  collectorNumber: string;
  oracleText?: string;
  power?: number;
  toughness?: number;
  defense?: number;
  priceUsd?: number;
  priceEur?: number;
  releasedAt: string;
  imageUrl?: string;
  // Back face data for double-faced cards (transform, modal_dfc, battle, etc.)
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
}
