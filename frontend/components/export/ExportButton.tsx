'use client';

import { useState } from 'react';
import { Download, ChevronDown } from 'lucide-react';

interface ExportOptions {
  format: 'png' | 'jpg';
  width: number;
  height: number;
  dpi: number;
}

interface ExportButtonProps {
  onExport: (options: ExportOptions) => Promise<void>;
  progress?: number;
  disabled?: boolean;
}

const PRESETS: { label: string; width: number; height: number; dpi: number }[] = [
  { label: 'Web (1200×800)', width: 1200, height: 800, dpi: 72 },
  { label: 'A4 portrait (150 DPI)', width: 1240, height: 1754, dpi: 150 },
  { label: 'A4 paysage (150 DPI)', width: 1754, height: 1240, dpi: 150 },
  { label: 'Poster A3 (150 DPI)', width: 1754, height: 2480, dpi: 150 },
];

const HIGH_RES_THRESHOLD = 4000;

export default function ExportButton({ onExport, progress = 0, disabled = false }: ExportButtonProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [format, setFormat] = useState<'png' | 'jpg'>('png');
  const [presetIndex, setPresetIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const preset = PRESETS[presetIndex];
  const isHighRes = preset.width > HIGH_RES_THRESHOLD || preset.height > HIGH_RES_THRESHOLD;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport({ format, width: preset.width, height: preset.height, dpi: preset.dpi });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Export</h2>
        <button
          onClick={() => setShowOptions((v) => !v)}
          className="text-xs text-slate-400 flex items-center gap-1 hover:text-slate-200 transition-colors"
        >
          Options <ChevronDown className={`w-3 h-3 transition-transform ${showOptions ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {showOptions && (
        <div className="space-y-3 p-3 bg-slate-800/40 rounded-lg border border-slate-700/50">
          {/* Format */}
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Format</label>
            <div className="flex gap-2">
              {(['png', 'jpg'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`flex-1 py-1 rounded text-xs uppercase font-mono border transition-colors ${
                    format === f
                      ? 'border-carto-primary bg-carto-primary/20 text-white'
                      : 'border-slate-600 text-slate-400 hover:border-slate-400'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Preset */}
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Résolution</label>
            <select
              value={presetIndex}
              onChange={(e) => setPresetIndex(Number(e.target.value))}
              className="input text-xs"
            >
              {PRESETS.map((p, i) => (
                <option key={i} value={i}>{p.label}</option>
              ))}
            </select>
          </div>

          {/* High-res warning */}
          {isHighRes && (
            <p className="text-[10px] text-amber-400 bg-amber-400/10 rounded px-2 py-1.5 border border-amber-400/20">
              ⚠️ Résolution élevée (&gt;4000px) — l&apos;export peut être lent ou échouer selon votre GPU.
            </p>
          )}
        </div>
      )}

      {/* Progress bar */}
      {isExporting && progress > 0 && (
        <div className="space-y-1">
          <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-carto-primary h-1.5 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 text-center">{progress}%</p>
        </div>
      )}

      {/* Export button */}
      <button
        onClick={handleExport}
        disabled={disabled || isExporting}
        className="btn w-full flex items-center justify-center gap-2 text-sm"
      >
        <Download className="w-4 h-4" />
        {isExporting ? 'Export en cours…' : `Exporter en ${format.toUpperCase()}`}
      </button>

      {disabled && (
        <p className="text-[10px] text-slate-500 text-center">Chargez la carte pour activer l&apos;export</p>
      )}
    </div>
  );
}
