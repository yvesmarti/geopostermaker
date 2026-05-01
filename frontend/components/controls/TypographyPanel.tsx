'use client';

import { useState } from 'react';

interface TypographySettings {
  title: string;
  subtitle: string;
  font: 'sans' | 'display' | 'mono';
  size: 'sm' | 'md' | 'lg';
  position: 'top' | 'bottom' | 'hidden';
}

const FONT_OPTIONS: { value: TypographySettings['font']; label: string }[] = [
  { value: 'sans', label: 'Inter (Sans-serif)' },
  { value: 'display', label: 'Playfair (Serif)' },
  { value: 'mono', label: 'IBM Mono' },
];

const SIZE_OPTIONS: { value: TypographySettings['size']; label: string }[] = [
  { value: 'sm', label: 'Petit' },
  { value: 'md', label: 'Moyen' },
  { value: 'lg', label: 'Grand' },
];

const POSITION_OPTIONS: { value: TypographySettings['position']; label: string }[] = [
  { value: 'top', label: 'En haut' },
  { value: 'bottom', label: 'En bas' },
  { value: 'hidden', label: 'Masqué' },
];

interface TypographyPanelProps {
  onChange?: (settings: TypographySettings) => void;
}

export default function TypographyPanel({ onChange }: TypographyPanelProps) {
  const [settings, setSettings] = useState<TypographySettings>({
    title: '',
    subtitle: '',
    font: 'display',
    size: 'md',
    position: 'bottom',
  });

  const update = <K extends keyof TypographySettings>(key: K, value: TypographySettings[K]) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    onChange?.(next);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Typographie</h2>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Titre</label>
          <input
            type="text"
            value={settings.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="Paris"
            className="input text-sm"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Sous-titre</label>
          <input
            type="text"
            value={settings.subtitle}
            onChange={(e) => update('subtitle', e.target.value)}
            placeholder="48.8566° N, 2.3522° E"
            className="input text-sm"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Police</label>
          <select
            value={settings.font}
            onChange={(e) => update('font', e.target.value as TypographySettings['font'])}
            className="input text-sm"
          >
            {FONT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-2 block">Taille</label>
          <div className="flex gap-2">
            {SIZE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => update('size', opt.value)}
                className={`flex-1 py-1.5 rounded-lg text-xs border transition-colors ${
                  settings.size === opt.value
                    ? 'border-carto-primary bg-carto-primary/20 text-white'
                    : 'border-slate-600 text-slate-400 hover:border-slate-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-2 block">Position</label>
          <div className="flex gap-2">
            {POSITION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => update('position', opt.value)}
                className={`flex-1 py-1.5 rounded-lg text-xs border transition-colors ${
                  settings.position === opt.value
                    ? 'border-carto-primary bg-carto-primary/20 text-white'
                    : 'border-slate-600 text-slate-400 hover:border-slate-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
