# CLAUDE.md — Geopostermaker

Guide de référence rapide pour travailler sur ce projet avec Claude Code.

## Architecture du projet

```
geopostermaker/
├── frontend/               ← Application Next.js 14 (tout le code ici)
│   ├── app/
│   │   ├── layout.tsx      ← Root layout + polices Google Fonts
│   │   ├── editor/page.tsx ← Page principale de l'éditeur
│   │   └── api/geocode/route.ts  ← Proxy Nominatim (rate-limited)
│   ├── components/
│   │   ├── map/MapEditor.tsx     ← Composant carte MapLibre (no SSR)
│   │   ├── controls/
│   │   │   ├── StyleSelector.tsx ← 8 styles cartographiques
│   │   │   ├── ColorPicker.tsx   ← Palettes par style
│   │   │   ├── TypographyPanel.tsx
│   │   │   └── LayerToggles.tsx
│   │   └── export/ExportButton.tsx ← Export PNG/JPG avec progression
│   ├── lib/
│   │   ├── utils.ts        ← debounce, throttle, clamp, sleep
│   │   └── map/styles/base.ts ← Style MapLibre de base (OpenFreeMap)
│   ├── styles/globals.css  ← Tailwind + classes custom (btn, panel, input)
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── vercel.json             ← Config déploiement (rootDirectory: frontend)
└── CLAUDE.md
```

## Commandes essentielles

```bash
cd frontend

# Développement
npm run dev          # Lance sur localhost:3000 (Turbopack)

# Vérifications
npm run typecheck    # tsc --noEmit (doit passer sans erreur)
npm run lint         # ESLint Next.js
npm run build        # Build de production (vérifier avant PR)
```

## Contraintes critiques

### MapLibre / SSR
- **Toujours** charger `MapEditor` via `dynamic(..., { ssr: false })` — MapLibre utilise WebGL qui n'existe pas côté serveur.
- `preserveDrawingBuffer={true}` est obligatoire sur `<Map>` pour que `canvas.toBlob()` fonctionne à l'export.

### Export canvas
- Attendre l'événement `map.on('idle')` avant de capturer le canvas pour s'assurer que les tuiles sont toutes rendues.
- Pour des résolutions > 4000px, avertir l'utilisateur (risque d'OOM GPU).

### API Nominatim (geocode)
- **Limite** : 1 requête/seconde maximum (policy Nominatim).
- **User-Agent obligatoire** : `geopostermaker/1.0 (email@example.com)` — configurer `NOMINATIM_CONTACT_EMAIL` dans `.env.local`.
- Ne jamais appeler Nominatim directement depuis le client — toujours passer par `/api/geocode`.
- Le cache de 5 min (`Cache-Control: s-maxage=300`) réduit la pression sur Nominatim.

### TypeScript
- Mode strict activé. Pas de `any` sauf cas exceptionnel documenté.
- `maplibre-gl` v4+ inclut ses propres types — ne pas installer `@types/maplibre-gl`.
- Importer les types MapLibre avec `import type { Map as MaplibreMap } from 'maplibre-gl'`.

## Variables d'environnement

Copier `.env.example` → `.env.local` avant de développer :

```bash
cp frontend/.env.example frontend/.env.local
```

| Variable | Obligatoire | Description |
|---|---|---|
| `NOMINATIM_CONTACT_EMAIL` | Oui | Email dans le User-Agent Nominatim |
| `NEXT_PUBLIC_BASE_URL` | Non | URL publique de l'app (og:url, etc.) |

## Dépendances clés

| Package | Usage |
|---|---|
| `maplibre-gl` ^4 | Moteur de rendu carte (WebGL) |
| `react-map-gl` ^7 | Wrapper React pour MapLibre |
| `html-to-image` | Export canvas → PNG/JPG |
| `file-saver` | Déclenchement du téléchargement |
| `@radix-ui/*` | Composants UI accessibles (Select, Slider, Toggle) |
| `lucide-react` | Icônes |
| `framer-motion` | Animations |

## Déploiement Vercel

1. Importer le repo GitHub dans Vercel
2. Vercel détecte automatiquement `vercel.json` → `rootDirectory: frontend`
3. Ajouter les variables d'environnement dans l'UI Vercel :
   - `NOMINATIM_CONTACT_EMAIL`
4. Pousser sur `main` → déploiement automatique

```bash
# Ou en CLI :
vercel --prod
```

## Tiles cartographiques

Source : **OpenFreeMap** (`tiles.openfreemap.org`) — gratuit, sans clé API.
- Tuiles vectorielles : `https://tiles.openfreemap.org/planet`
- Sprites : `https://tiles.openfreemap.org/sprites/liberty`
- Glyphs : `https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf`

## Ajout d'un nouveau style

1. Ajouter une entrée dans `MAP_STYLES` dans `StyleSelector.tsx`
2. Ajouter la palette correspondante dans `PALETTES_BY_STYLE` dans `ColorPicker.tsx`
3. Créer le fichier de style MapLibre dans `lib/map/styles/` si nécessaire

## Problèmes courants

**`npm install` échoue** : Vérifier les versions Radix UI dans `package.json`.
`@radix-ui/react-slider` n'a pas de v2 — utiliser `^1.3.0`.

**Erreur WebGL côté serveur** : Vérifier que `MapEditor` est chargé avec `ssr: false`.

**Export canvas vide/noir** : Vérifier que `preserveDrawingBuffer={true}` est sur `<Map>` et que l'export attend `map.on('idle')`.

**Nominatim 429** : Le rate-limiting du proxy `/api/geocode` est en mémoire et se remet à zéro sur chaque cold start serverless. En production haute charge, migrer vers un rate-limiter Redis.
