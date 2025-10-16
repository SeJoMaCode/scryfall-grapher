# Scryfall Grapher

A powerful web application for visualizing and analyzing Magic: The Gathering card data from the Scryfall API. Built as a Progressive Web App (PWA) with React, TypeScript, and Recharts.

![Scryfall Grapher](https://img.shields.io/badge/Built%20with-React%20%2B%20TypeScript-blue)
![PWA](https://img.shields.io/badge/PWA-Enabled-success)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)

## Features

### Core Functionality
- **Scryfall Query Support** - Search cards using full Scryfall syntax (e.g., `t:creature c:red`, `set:blb`, `cmc>=5`)
- **Interactive Graphs** - Click any graph element to filter and view matching cards
- **Special Card Handling** - Properly processes double-faced, flip, transform, split, and battle cards
- **Detailed Card View** - Click cards to see full details including oracle text, prices, and stats
- **Auto-scroll** - Automatically scrolls to filtered cards when clicking graph elements

### Graph Types

#### Preset Graphs (5 Core Types)
1. **Mana Value Distribution** - Bar chart showing CMC breakdown with average
2. **Color Distribution** - Pie chart of mono-colored, multicolor, and colorless cards
3. **Card Type Distribution** - Horizontal bar chart by primary card type
4. **Rarity Distribution** - Pie chart showing common/uncommon/rare/mythic breakdown
5. **Price Distribution** - Scatter plot of price vs. mana value with statistics

#### Custom Graph Builder
Create custom graphs with:
- **9 X-axis options:** Mana Value, Color, Card Type, Rarity, Set, Power, Toughness, Release Year, Price Range
- **8 Y-axis metrics:** Card Count, Average Price, Total Price, Average CMC, Average Power, Average Toughness, Min Price, Max Price
- **4 chart types:** Bar Chart, Horizontal Bar, Pie Chart, Line Chart
- **Smart filters:** Only Creatures, Only Instants, Only Sorceries, Only cards with price data
- **Validation & suggestions** - Helpful tips for optimal graph configurations

#### Custom Graph Presets (10 Templates)
**Essential Graphs:**
- Mana Curve
- Color Distribution
- Type Breakdown
- Rarity Distribution

**Analysis Graphs:**
- Price by Rarity
- Power Distribution
- Set Comparison
- Value by Color
- Yearly Releases
- Price Ranges

### PWA Features
- **Offline Support** - Works offline after initial load
- **Service Worker** - Intelligent caching for cards and API responses
- **Installable** - Add to home screen on mobile/desktop
- **Fast & Responsive** - Optimized performance for 1000+ cards

### Export Functionality
- **Export Graphs as PNG** - Download any graph in high resolution (2x pixel ratio)
- **Automatic Naming** - Files named with chart type and timestamp
- **Works with All Graphs** - Export presets, custom graphs, or custom-built graphs

## Technology Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Charts:** Recharts (responsive SVG charts)
- **PWA:** Vite PWA Plugin with Workbox
- **API:** Scryfall REST API with rate limiting
- **Deployment:** Docker + Nginx + Traefik
- **Export:** html-to-image for PNG generation

## Getting Started

### Prerequisites
- Node.js 20+ (for development)
- Docker + Docker Compose (for deployment)

### Development

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd ScryfallGrapher
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm run dev
```

4. **Open in browser:**
```
http://localhost:3000
```

### Production Build

**Local build:**
```bash
npm run build
```

**Docker deployment:**
```bash
docker-compose up -d
```

## Usage Guide

### Searching for Cards

Use any valid Scryfall search syntax:

```
t:creature c:red                    # Red creatures
set:blb                             # Cards from Bloomburrow
cmc>=5                              # Cards with CMC 5 or greater
o:"draw a card"                     # Cards with "draw a card" in oracle text
is:commander                        # Legendary creatures
f:modern t:instant                  # Modern-legal instants
```

### Creating Custom Graphs

1. Click the **"⚙️ Custom"** tab
2. Choose from:
   - **Preset graphs** - Click any preset card
   - **Build custom** - Click "Create Custom Graph"

3. For custom builds:
   - Select X-axis (what to group by)
   - Select Y-axis (what to measure)
   - Choose chart type
   - Add optional filters
   - Click "Generate Graph"

4. **Click any element** in the graph to filter cards
5. **View card details** by clicking individual cards
6. **Export the graph** using the "📥 Export" button

### Exporting Graphs

1. Generate any graph (preset or custom)
2. Click **"📥 Export"** in the toolbar
3. Graph is downloaded as PNG with high resolution
4. File format: `scryfall-{chart-name}-{timestamp}.png`

## Project Structure

```
ScryfallGrapher/
├── src/
│   ├── charts/              # Graph components
│   │   ├── CMCChart.tsx
│   │   ├── ColorChart.tsx
│   │   ├── TypeChart.tsx
│   │   ├── RarityChart.tsx
│   │   └── PriceChart.tsx
│   ├── components/          # UI components
│   │   ├── CardList.tsx
│   │   ├── CardModal.tsx
│   │   ├── CustomGraph.tsx
│   │   ├── CustomGraphBuilder.tsx
│   │   ├── GraphContainer.tsx
│   │   └── PresetSelector.tsx
│   ├── services/            # API integration
│   │   └── scryfallApi.ts
│   ├── types/               # TypeScript types
│   │   ├── graph.ts
│   │   └── scryfall.ts
│   ├── utils/               # Utilities
│   │   ├── cardNormalizer.ts
│   │   ├── graphDataTransformer.ts
│   │   └── graphPresets.ts
│   ├── App.tsx              # Main application
│   └── main.tsx             # Entry point
├── public/                  # Static assets
├── docker-compose.yml       # Docker configuration
├── Dockerfile               # Multi-stage build
├── nginx.conf               # Nginx configuration
└── vite.config.ts          # Vite + PWA config
```

## Special Card Handling

The app correctly handles all special card layouts:

- **Normal cards** - Standard single-faced cards
- **Split cards** (e.g., Fire // Ice) - Combines colors from both halves
- **Flip cards** (e.g., Rune-Tail, Kitsune Ascendant) - Uses front face data
- **Transform/Modal DFC** (e.g., Invasion of Alara, Agadeem's Awakening) - Front face stats and oracle text
- **Adventure cards** - Main creature card data
- **Battle cards** - Front face with defense stat
- **Meld cards** - Front face before melding

## API Rate Limiting

The app implements Scryfall's recommended rate limiting:
- **100ms between requests** (10 requests per second maximum)
- **Automatic pagination** for large result sets
- **Efficient caching** via service worker (24-hour cache for API responses)

## Performance

- Transforms 1000+ cards in <100ms
- Instant chart rendering
- Real-time filter updates
- No loading spinners needed for most operations
- PWA caching for offline access

## Deployment Architecture

### Docker Setup
- **Multi-stage build** - Node 20 Alpine → Nginx Alpine
- **Production optimized** - Minified bundles, gzip compression
- **Security headers** - X-Frame-Options, Content-Security-Policy, etc.

### Traefik Routing
- **Local subdomain:** `scryfallgrapher.localhost` (HTTP)
- **Remote path-based:** `/scryfallgrapher` via Tailscale (HTTPS)
- **Automatic HTTPS** - Tailscale TLS certificate
- **Health checks** - `/health` endpoint

### PWA Configuration
- **Base path:** `/scryfallgrapher/`
- **Service worker:** Workbox with precaching
- **Manifest:** Installable with app icons
- **Scope:** `/scryfallgrapher/`

## Browser Support

- **Modern browsers** - Chrome, Firefox, Safari, Edge (latest versions)
- **PWA features** - Chrome/Edge (full), Firefox/Safari (partial)
- **Mobile** - iOS Safari, Chrome Android
- **Offline** - All browsers with service worker support

## Contributing

Contributions are welcome! Areas for enhancement:

1. **Additional graph types** - Scatter with multiple dimensions, heat maps
2. **Save/load configurations** - Persist custom graphs to localStorage
3. **Export options** - CSV data export, JSON configuration export
4. **Advanced filters** - Range sliders, multi-select dropdowns
5. **Multi-series charts** - "CMC by Rarity" with stacked bars
6. **Deck analysis** - Import deck lists for analysis

## License

This project is built for personal use and educational purposes. Scryfall API data is provided by [Scryfall LLC](https://scryfall.com/) under their terms of service.

## Acknowledgments

- **Scryfall** - For the amazing card database and API
- **Recharts** - For the excellent charting library
- **MTG Community** - For inspiration and feedback

## Support

For issues, questions, or feature requests, please open an issue on the GitHub repository.

---

**Built with ❤️ for the Magic: The Gathering community**
