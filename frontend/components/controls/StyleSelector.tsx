'use client';

import { useState } from 'react';

export type MapStyleId =
  | 'minimal'
  | 'vintage'
  | 'blueprint'
  | 'noir'
  | 'watercolor'
  | 'neon'
  | 'terrain'
  | 'sketch';

export interface MapStyleDef {
  id: MapStyleId;
  label: string;
  description: string;
  previewBg: string;
  previewAccent: string;
}

export const MAP_STYLES: MapStyleDef[] = [
  {
    id: 'minimal',
    label: 'Minimal',
    description: 'Lignes épurées, fond blanc',
    previewBg: '#f8f8f8',
    previewAccent: '#222222',
  },
  {
    id: 'vintage',
    label: 'Vintage',
    description: 'Tons sépia, style ancien',
    previewBg: '#f5e6c8',
    previewAccent: '#7a5c2e',
  },
  {
    id: 'blueprint',
    label: 'Blueprint',
    description: 'Fond bleu, lignes blanches',
    previewBg: '#1a3a5c',
    previewAccent: '#6ab4f0',
  },
  {
    id: 'noir',
    label: 'Noir',
    description: 'Fond noir, haute contrast',
    previewBg: '#111111',
    previewAccent: '#ffffff',
  },
  {
    id: 'watercolor',
    label: 'Aquarelle',
    description: 'Couleurs douces, style peint',
    previewBg: '#e8f4f8',
    previewAccent: '#5b9bd5',
  },
  {
    id: 'neon',
    label: 'Néon',
    description: 'Fond sombre, couleurs vives',
    previewBg: '#0d0d1a',
    previewAccent: '#ff00ff',
  },
  {
    id: 'terrain',
    label: 'Terrain',
    description: 'Relief et topographie',
    previewBg: '#c8d8a0',
    previewAccent: '#5a7a3a',
  },
  {
    id: 'sketch',
    label: 'Esquisse',
    description: 'Style croquis au crayon',
    previewBg: '#fafaf5',
    previewAccent: '#444444',
  },
];

interface StyleSelectorProps {
  value?: MapStyleId;
  onChange?: (styleId: MapStyleId) => void;
}

export default function StyleSelector({ value = 'minimal', onChange }: StyleSelectorProps) {
  const [selected, setSelected] = useState<MapStyleId>(value);

  const handleSelect = (id: MapStyleId) => {
    setSelected(id);
    onChange?.(id);
  };

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Style cartographique</h2>
      <div className="grid grid-cols-2 gap-2">
        {MAP_STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => handleSelect(style.id)}
            className={`
              relative rounded-lg border-2 overflow-hidden transition-all text-left
              ${selected === style.id
                ? 'border-carto-primary ring-2 ring-carto-primary/30'
                : 'border-slate-700 hover:border-slate-500'}
            `}
          >
            {/* Preview swatch */}
            <div
              className="h-12 w-full flex items-end justify-end p-1"
              style={{ backgroundColor: style.previewBg }}
            >
              {/* Simulated road lines */}
              <div className="space-y-1 w-full px-1">
                <div className="h-px w-full rounded" style={{ backgroundColor: style.previewAccent, opacity: 0.6 }} />
                <div className="h-0.5 w-3/4 rounded" style={{ backgroundColor: style.previewAccent }} />
                <div className="h-px w-1/2 rounded" style={{ backgroundColor: style.previewAccent, opacity: 0.4 }} />
              </div>
            </div>
            {/* Label */}
            <div className="px-2 py-1.5 bg-carto-surface">
              <p className="text-xs font-medium text-slate-200 truncate">{style.label}</p>
              <p className="text-[10px] text-slate-400 truncate">{style.description}</p>
            </div>
            {/* Selected indicator */}
            {selected === style.id && (
              <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-carto-primary" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
