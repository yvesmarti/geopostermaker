'use client';

import { useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Save, Download, Palette, Type, Layers } from 'lucide-react';
import MapEditor from '@/components/map/MapEditor';
import StyleSelector from '@/components/controls/StyleSelector';
import ColorPicker from '@/components/controls/ColorPicker';
import TypographyPanel from '@/components/controls/TypographyPanel';
import LayerToggles from '@/components/controls/LayerToggles';
import ExportButton from '@/components/export/ExportButton';

// Charger MapEditor en SSR false pour éviter les erreurs WebGL
const MapEditorNoSSR = dynamic(() => Promise.resolve(MapEditor), { ssr: false });

export default function EditorPage() {
  const [activePanel, setActivePanel] = useState<'style' | 'colors' | 'typo' | 'layers'>('style');
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);
  const [exportProgress, setExportProgress] = useState(0);
  
  const handleMapLoad = useCallback((map: maplibregl.Map) => {
    setMapInstance(map);
  }, []);

  const handleExport = useCallback(async (options: {
    format: 'png' | 'jpg';
    width: number;
    height: number;
    dpi: number;
  }) => {
    if (!mapInstance) return;
    
    setExportProgress(10);
    
    // Simulation de progression (à remplacer par la vraie logique)
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);
    
    try {
      // Ici: appeler la fonction d'export réelle
      await new Promise(resolve => setTimeout(resolve, 1500));
      setExportProgress(100);
      
      // Déclencher le téléchargement
      const canvas = mapInstance.getCanvas();
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `carto-art-${Date.now()}.${options.format}`;
        a.click();
        URL.revokeObjectURL(url);
      }, `image/${options.format}`, 0.95);
      
    } catch (err) {
      console.error('Export failed:', err);
      alert('Erreur lors de l\'export. Veuillez réessayer.');
    } finally {
      clearInterval(interval);
      setTimeout(() => setExportProgress(0), 1000);
    }
  }, [mapInstance]);

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Sidebar controls */}
      <aside className="w-full lg:w-80 bg-carto-surface border-r border-slate-700 p-4 overflow-y-auto">
        <h1 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Palette className="w-5 h-5 text-carto-primary" />
          Carto-Art Editor
        </h1>
        
        {/* Navigation tabs */}
        <nav className="flex lg:flex-col gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'style', icon: Palette, label: 'Style' },
            { id: 'colors', icon: Palette, label: 'Couleurs' },
            { id: 'typo', icon: Type, label: 'Typographie' },
            { id: 'layers', icon: Layers, label: 'Calques' },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActivePanel(id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors
                ${activePanel === id 
                  ? 'bg-carto-primary text-white' 
                  : 'hover:bg-slate-700/50 text-slate-300'}`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </nav>
        
        {/* Panels */}
        <div className="space-y-4">
          {activePanel === 'style' && <StyleSelector />}
          {activePanel === 'colors' && <ColorPicker />}
          {activePanel === 'typo' && <TypographyPanel />}
          {activePanel === 'layers' && <LayerToggles />}
        </div>
        
        {/* Export section */}
        <div className="mt-8 pt-6 border-t border-slate-700">
          <ExportButton 
            onExport={handleExport} 
            progress={exportProgress}
            disabled={!mapInstance}
          />
        </div>
      </aside>
      
      {/* Map area */}
      <main className="flex-1 relative">
        <MapEditorNoSSR 
          onMapLoad={handleMapLoad}
          initialCenter={[2.3522, 48.8566]}
          initialZoom={12}
        />
        
        {/* Floating search bar (optionnel) */}
        <div className="absolute top-4 left-4 right-4 lg:left-auto lg:w-80 z-10">
          <input
            type="text"
            placeholder="Rechercher un lieu..."
            className="input shadow-lg"
            // À connecter avec l'API Nominatim
          />
        </div>
      </main>
    </div>
  );
}