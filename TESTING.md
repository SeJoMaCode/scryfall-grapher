# Testing Guide for Special Card Types

This document contains test queries for verifying that the Scryfall Grapher correctly handles different card layouts.

## Special Card Types to Test

### 1. Flip Cards
**Example:** Rune-Tail, Kitsune Ascendant

```
Query: !"Rune-Tail, Kitsune Ascendant"
```

**Expected Behavior:**
- Shows front face stats (Creature - 2/2)
- CMC: 3
- Colors: White
- Type: Creature

### 2. Battle/Transform Cards
**Example:** Invasion of Alara

```
Query: !"Invasion of Alara"
```

**Expected Behavior:**
- Shows front face (Battle - Siege)
- Defense: 7
- CMC: 5
- Colors: WUBRG (all colors)

### 3. Modal DFC (Double-Faced Cards)
**Example:** Agadeem's Awakening

```
Query: !"Agadeem's Awakening"
```

**Expected Behavior:**
- Front face: Sorcery
- CMC: Varies based on X
- Colors: Black
- Type: Sorcery

### 4. Split Cards
**Example:** Fire // Ice

```
Query: !"Fire // Ice"
```

**Expected Behavior:**
- Combined CMC (both faces)
- Colors: Red + Blue
- Type: Instant

### 5. Adventure Cards
**Example:** SP//dr (if it exists in Scryfall)

For adventure cards, try:
```
Query: t:adventure set:eld
```

**Expected Behavior:**
- Main card stats shown
- Adventure spell not counted separately

## Comprehensive Test Queries

### Test All Special Layouts
```
Query: (is:flip or is:transform or is:mdfc or is:split or is:adventure)
```

### Test Multi-Faced Cards from Modern Horizons
```
Query: set:mh3 (is:transform or is:mdfc)
```

### Test Battle Cards from March of the Machine
```
Query: t:battle set:mom
```

## What to Check

When testing these cards, verify:

1. **CMC Chart**: Values are correctly calculated
2. **Color Chart**: Multi-color faces are properly aggregated
3. **Type Chart**: Primary type is correctly identified
4. **Rarity Chart**: All rarities display correctly
5. **Price Chart**: Cards with prices show up

## Known Edge Cases

### Cards with Variable CMC
Cards with X in their cost (like Agadeem's Awakening) may show CMC=0. This is correct per Scryfall API.

### Split Cards
Split cards combine mana costs from both faces, so Fire // Ice shows as {1}{R} // {1}{U} with total CMC.

### Meld Cards
Meld cards only show the front face stats, not the combined meld result.

## Running Tests

### Development Mode
```bash
npm run dev
```

Access: `http://localhost:3000`

### Docker Mode
```bash
docker-compose up -d
```

Access:
- Local: `http://scryfallgrapher.localhost`
- Remote: `https://laptop-13obiidi.taile8d896.ts.net/scryfallgrapher`

### Quick Test Sequence

1. Search: `t:legendary t:dragon` (should show various dragon cards)
2. Switch between all graph types to verify rendering
3. Search: `is:flip` (should handle flip cards)
4. Search: `is:mdfc set:znr` (should handle modal DFCs from Zendikar Rising)
5. Search: `t:battle` (should handle battle cards)
6. Search: `!"Fire // Ice"` (should handle split cards)

## Debugging

If cards aren't displaying correctly:

1. Open browser DevTools (F12)
2. Check Network tab for Scryfall API responses
3. Check Console for any errors
4. Verify the card's `layout` field in the API response
5. Check that the normalizer handles that layout type

## Card Layout Reference

Layouts handled by the normalizer:
- `normal` - Standard single-faced cards
- `split` - Split cards (e.g., Fire // Ice)
- `flip` - Flip cards (e.g., Rune-Tail)
- `transform` - Transform cards (e.g., werewolves, battles)
- `modal_dfc` - Modal double-faced cards (e.g., MDFCs from Zendikar Rising)
- `meld` - Meld cards (e.g., Chittering Host)
- `adventure` - Adventure cards (e.g., Bonecrusher Giant)
- `leveler` - Leveler cards
- `saga` - Saga enchantments
- `class` - Class enchantments
- `prototype` - Prototype cards
- `battle` - Battle cards

See `src/utils/cardNormalizer.ts` for implementation details.
