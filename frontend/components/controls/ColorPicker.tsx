'use client';

import { useState } from 'react';
import type { MapStyleId } from './StyleSelector';

interface Palette {
  name: string;
  colors: {
    background: string;
    water: string;
    roads: string;
    buildings: string;
    parks: string;
    labels: string;
  };
}

const PALETTES_BY_STYLE: Record<MapStyleId, Palette[]> = {
  minimal: [
    { name: 'Classique', colors: { background: '#ffffff', water: '#aadaff', roads: '#cccccc', buildings: '#e8e4e0', parks: '#d4edc9', labels: '#333333' } },
    { name: 'Gris doux', colors: { background: '#f5f5f5', water: '#b0c4de', roads: '#d3d3d3', buildings: '#dcdcdc', parks: '#c8ddc0', labels: '#555555' } },
  ],
  vintage: [
    { name: 'Sépia', colors: { background: '#f5e6c8', water: '#9ab8cc', roads: '#c4a882', buildings: '#d4b896', parks: '#b8c8a0', labels: '#7a5c2e' } },
    { name: 'Parchemin', colors: { background: '#ede0c8', water: '#8aa8c0', roads: '#b89870', buildings: '#c8a880', parks: '#a8b890', labels: '#6a4c1e' } },
  ],
  blueprint: [
    { name: 'Classique', colors: { background: '#1a3a5c', water: '#2a5a8c', roads: '#4a8abc', buildings: '#2a4a6c', parks: '#2a5a4c', labels: '#6ab4f0' } },
    { name: 'Nuit', colors: { background: '#0d2035', water: '#1a3a5c', roads: '#2a5a8c', buildings: '#1a2a3c', parks: '#1a3a2c', labels: '#4a9ae0' } },
  ],
  noir: [
    { name: 'Noir & blanc', colors: { background: '#111111', water: '#222222', roads: '#555555', buildings: '#1a1a1a', parks: '#1a2a1a', labels: '#ffffff' } },
    { name: 'Charbon', colors: { background: '#1a1a1a', water: '#2a2a2a', roads: '#666666', buildings: '#222222', parks: '#222e22', labels: '#cccccc' } },
  ],
  watercolor: [
    { name: 'Pastel', colors: { background: '#e8f4f8', water: '#aad4f0', roads: '#d0c8e8', buildings: '#f0e0d8', parks: '#c8e8c0', labels: '#5b9bd5' } },
    { name: 'Aquarelle vive', colors: { background: '#f0f8ff', water: '#87ceeb', roads: '#dda0dd', buildings: '#ffe4b5', parks: '#98fb98', labels: '#4169e1' } },
  ],
  neon: [
    { name: 'Cyber', colors: { background: '#0d0d1a', water: '#0a1a3a', roads: '#ff00ff', buildings: '#1a0a1a', parks: '#0a1a0a', labels: '#00ffff' } },
    { name: 'Vaporwave', colors: { background: '#1a0a2a', water: '#2a1a4a', roads: '#ff69b4', buildings: '#2a0a2a', parks: '#0a2a1a', labels: '#ff00ff' } },
  ],
  terrain: [
    { name: 'Naturel', colors: { background: '#c8d8a0', water: '#6ab0d0', roads: '#d4b896', buildings: '#e8d8b0', parks: '#a0c878', labels: '#5a7a3a' } },
    { name: 'Topo', colors: { background: '#d8e8b0', water: '#78b8d8', roads: '#c8a878', buildings: '#f0e0c0', parks: '#b0d890', labels: '#4a6a2a' } },
  ],
  sketch: [
    { name: 'Crayon', colors: { background: '#fafaf5', water: '#dce8f0', roads: '#888888', buildings: '#f0ede8', parks: '#e0ead8', labels: '#444444' } },
    { name: 'Encre', colors: { background: '#f8f8f0', water: '#d0e0e8', roads: '#555555', buildings: '#ece8e0', parks: '#d8e8d0', labels: '#222222' } },
  ],
};

interface ColorPickerProps {
  styleId?: MapStyleId;
  onPaletteChange?: (palette: Palette['colors']) => void;
}

export default function ColorPicker({ styleId = 'minimal', onPaletteChange }: ColorPickerProps) {
  const palettes = PALETTES_BY_STYLE[styleId] ?? PALETTES_BY_STYLE.minimal;
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    onPaletteChange?.(palettes[index].colors);
  };

  const selected = palettes[selectedIndex];

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Palette de couleurs</h2>

      {/* Palette selector */}
      <div className="flex gap-2">
        {palettes.map((palette, i) => (
          <button
            key={palette.name}
            onClick={() => handleSelect(i)}
            className={`flex-1 rounded-lg border-2 p-1.5 transition-all ${
              selectedIndex === i ? 'border-carto-primary' : 'border-slate-700 hover:border-slate-500'
            }`}
          >
            {/* Color swatches row */}
            <div className="flex gap-0.5 mb-1">
              {Object.values(palette.colors).slice(0, 4).map((color, j) => (
                <div
                  key={j}
                  className="h-4 flex-1 rounded-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <p className="text-[10px] text-slate-400 text-center">{palette.name}</p>
          </button>
        ))}
      </div>

      {/* Current palette details */}
      <div className="space-y-2">
        <p className="text-xs text-slate-400">Couleurs actives — {selected.name}</p>
        {Object.entries(selected.colors).map(([key, color]) => (
          <div key={key} className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded border border-slate-600 flex-shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs text-slate-300 capitalize flex-1">{key}</span>
            <span className="text-xs text-slate-500 font-mono">{color}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
