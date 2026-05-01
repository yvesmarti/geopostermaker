import type { StyleSpecification } from 'maplibre-gl';

export const BASE_STYLE: StyleSpecification = {
  version: 8,
  name: 'CartoArt Base',
  sources: {
    openmaptiles: {
      type: 'vector',
      url: 'https://tiles.openfreemap.org/planet',
    },
  },
  sprite: 'https://tiles.openfreemap.org/sprites/liberty',
  glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: { 'background-color': '#ffffff' },
    },
    {
      id: 'water',
      type: 'fill',
      source: 'openmaptiles',
      'source-layer': 'water',
      paint: { 'fill-color': '#aadaff', 'fill-opacity': 0.6 },
    },
    {
      id: 'landcover_grass',
      type: 'fill',
      source: 'openmaptiles',
      'source-layer': 'landcover',
      filter: ['==', 'class', 'grass'],
      paint: { 'fill-color': '#d4edc9', 'fill-opacity': 0.4 },
    },
    {
      id: 'landuse_residential',
      type: 'fill',
      source: 'openmaptiles',
      'source-layer': 'landuse',
      filter: ['==', 'class', 'residential'],
      paint: { 'fill-color': '#e8e4e0', 'fill-opacity': 0.3 },
    },
    {
      id: 'road_minor',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'transportation',
      filter: ['in', 'class', 'minor', 'service'],
      paint: {
        'line-color': '#ffffff',
        'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1, 16, 4],
      },
    },
    {
      id: 'road_major',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'transportation',
      filter: ['in', 'class', 'primary', 'secondary', 'tertiary'],
      paint: {
        'line-color': '#ffd700',
        'line-width': ['interpolate', ['linear'], ['zoom'], 8, 1, 14, 6],
      },
    },
    {
      id: 'place_label_city',
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'place',
      filter: ['==', 'class', 'city'],
      layout: {
        'text-field': ['get', 'name'],
        'text-font': ['Noto Sans Regular'],
        'text-size': 14,
      },
      paint: {
        'text-color': '#333333',
        'text-halo-color': '#ffffff',
        'text-halo-width': 2,
      },
    },
  ],
};

export function applyPalette(style: StyleSpecification, palette: Record<string, string>): StyleSpecification {
  return JSON.parse(JSON.stringify(style).replace(/#(?:[a-f0-9]{6}|[a-f0-9]{3})/gi, (match) => {
    // Remplacement basique - à améliorer avec des IDs de couche spécifiques
    return palette[match.toLowerCase()] || match;
  }));
}