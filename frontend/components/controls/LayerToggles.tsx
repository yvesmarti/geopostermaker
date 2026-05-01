'use client';

import { useState } from 'react';

interface Layer {
  id: string;
  label: string;
  enabled: boolean;
}

const DEFAULT_LAYERS: Layer[] = [
  { id: 'roads', label: 'Routes', enabled: true },
  { id: 'buildings', label: 'Bâtiments', enabled: true },
  { id: 'water', label: 'Plans d\'eau', enabled: true },
  { id: 'parks', label: 'Parcs & verdure', enabled: true },
  { id: 'labels', label: 'Étiquettes', enabled: true },
  { id: 'transport', label: 'Transports en commun', enabled: false },
];

interface LayerTogglesProps {
  onChange?: (layers: Record<string, boolean>) => void;
}

export default function LayerToggles({ onChange }: LayerTogglesProps) {
  const [layers, setLayers] = useState<Layer[]>(DEFAULT_LAYERS);

  const toggle = (id: string) => {
    const next = layers.map((l) => (l.id === id ? { ...l, enabled: !l.enabled } : l));
    setLayers(next);
    onChange?.(Object.fromEntries(next.map((l) => [l.id, l.enabled])));
  };

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Calques</h2>
      <div className="space-y-2">
        {layers.map((layer) => (
          <div
            key={layer.id}
            className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-800/40 border border-slate-700/50"
          >
            <span className="text-sm text-slate-300">{layer.label}</span>
            <button
              role="switch"
              aria-checked={layer.enabled}
              onClick={() => toggle(layer.id)}
              className={`
                relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent
                transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-carto-primary focus:ring-offset-2 focus:ring-offset-carto-bg
                ${layer.enabled ? 'bg-carto-primary' : 'bg-slate-600'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200
                  ${layer.enabled ? 'translate-x-4' : 'translate-x-0'}
                `}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
