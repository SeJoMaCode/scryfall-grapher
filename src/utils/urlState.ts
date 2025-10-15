import { GraphConfig } from '../types/graph';
import LZString from 'lz-string';

/**
 * URL State Management with Compression
 * Uses short codes and LZ-string compression for minimal URL length
 */

export interface AppUrlState {
  query?: string;
  chart?: string;
  customConfig?: GraphConfig;
}

// Chart type mappings (full name <-> short code)
const CHART_CODES: Record<string, string> = {
  'cmc': 'c',
  'colors': 'l',
  'types': 't',
  'rarity': 'r',
  'price': 'p',
  'custom': 'x',
};

const CHART_CODES_REVERSE: Record<string, string> = {
  'c': 'cmc',
  'l': 'colors',
  't': 'types',
  'r': 'rarity',
  'p': 'price',
  'x': 'custom',
};

/**
 * Compress a string using LZ-string (URL-safe)
 */
function compress(str: string): string {
  return LZString.compressToEncodedURIComponent(str);
}

/**
 * Decompress a string using LZ-string
 */
function decompress(str: string): string | null {
  return LZString.decompressFromEncodedURIComponent(str);
}

/**
 * Read application state from URL search parameters
 */
export function readUrlState(): AppUrlState {
  const params = new URLSearchParams(window.location.search);
  const state: AppUrlState = {};

  // Read query (compressed)
  const queryParam = params.get('q');
  if (queryParam) {
    const decompressed = decompress(queryParam);
    if (decompressed) {
      state.query = decompressed;
    }
  }

  // Read chart type (short code)
  const chartParam = params.get('c');
  if (chartParam) {
    state.chart = CHART_CODES_REVERSE[chartParam] || chartParam;
  }

  // Read custom config (compressed)
  const configParam = params.get('g');
  if (configParam) {
    try {
      const decompressed = decompress(configParam);
      if (decompressed) {
        state.customConfig = JSON.parse(decompressed);
      }
    } catch (error) {
      console.error('Failed to parse custom config from URL:', error);
    }
  }

  return state;
}

/**
 * Write application state to URL without triggering navigation
 */
export function writeUrlState(state: AppUrlState) {
  const params = new URLSearchParams();

  // Write query (compressed)
  if (state.query) {
    params.set('q', compress(state.query));
  }

  // Write chart type (short code)
  if (state.chart) {
    const shortCode = CHART_CODES[state.chart] || state.chart;
    params.set('c', shortCode);
  }

  // Write custom config (compressed)
  if (state.customConfig) {
    params.set('g', compress(JSON.stringify(state.customConfig)));
  }

  const newUrl = params.toString()
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname;

  window.history.replaceState({}, '', newUrl);
}

/**
 * Update a single URL parameter without affecting others
 * Automatically compresses/encodes based on parameter name
 */
export function updateUrlParam(key: string, value: string | null) {
  const params = new URLSearchParams(window.location.search);

  if (value === null) {
    // Delete based on actual param name (might be short code)
    if (key === 'chart') {
      params.delete('c');
    } else if (key === 'config') {
      params.delete('g');
    } else {
      params.delete(key);
    }
  } else {
    // Set with appropriate encoding
    if (key === 'q') {
      // Query: compress
      params.set('q', compress(value));
    } else if (key === 'chart') {
      // Chart: use short code
      const shortCode = CHART_CODES[value] || value;
      params.set('c', shortCode);
    } else if (key === 'config') {
      // Config: compress
      params.set('g', compress(value));
    } else {
      params.set(key, value);
    }
  }

  const newUrl = params.toString()
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname;

  window.history.replaceState({}, '', newUrl);
}
