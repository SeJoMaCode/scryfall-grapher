# PWA Icons

To generate proper PWA icons, you'll need to create:

1. **pwa-192x192.png** - 192x192 px icon
2. **pwa-512x512.png** - 512x512 px icon
3. **apple-touch-icon.png** - 180x180 px icon
4. **favicon.ico** - Standard favicon

## Quick Generation

You can use online tools to generate these from a base icon:

- https://realfavicongenerator.net/
- https://favicon.io/
- https://www.pwabuilder.com/imageGenerator

Or use ImageMagick locally:

```bash
# From a source SVG or PNG (e.g., icon.svg):
convert icon.svg -resize 192x192 pwa-192x192.png
convert icon.svg -resize 512x512 pwa-512x512.png
convert icon.svg -resize 180x180 apple-touch-icon.png
convert icon.svg -resize 32x32 favicon.ico
```

## Placeholder Icons

For now, the app will use Vite's default icon. Replace these files in the `public/` directory before deploying to production.

## Design Suggestions

The icon should:
- Be simple and recognizable at small sizes
- Use the Magic: The Gathering theme (mana symbols, card shapes, etc.)
- Work well on both light and dark backgrounds
- Follow PWA icon guidelines (no transparency for iOS)
