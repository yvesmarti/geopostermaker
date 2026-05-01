'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Map, {
  NavigationControl,
  GeolocateControl,
  type MapRef,
  type ViewStateChangeEvent,
} from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { BASE_STYLE } from '@/lib/map/styles/base';
import { debounce } from '@/lib/utils';

interface MapEditorProps {
  initialCenter?: [number, number];
  initialZoom?: number;
  onMapLoad?: (map: maplibregl.Map) => void;
  styleOverrides?: Partial<maplibregl.StyleSpecification>;
}

export default function MapEditor({
  initialCenter = [2.3522, 48.8566], // Paris par défaut
  initialZoom = 12,
  onMapLoad,
  styleOverrides,
}: MapEditorProps) {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState({
    longitude: initialCenter[0],
    latitude: initialCenter[1],
    zoom: initialZoom,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  const mapStyle = {
    ...BASE_STYLE,
    ...styleOverrides,
  };

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (map && isLoaded) {
      onMapLoad?.(map);
    }
  }, [isLoaded, onMapLoad]);

  const handleMove = useCallback((evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState);
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-slate-700">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={handleMove}
        onLoad={handleLoad}
        mapStyle={mapStyle}
        mapLib={import('maplibre-gl')}
        preserveDrawingBuffer={true} // ⚠️ ESSENTIEL pour l'export canvas
        antialias={true}
        fadeDuration={0}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-right" showCompass={false} />
        <GeolocateControl 
          position="top-right" 
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={false}
        />
      </Map>
      
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-carto-bg/80">
          <div className="animate-pulse text-slate-400">Chargement de la carte...</div>
        </div>
      )}
    </div>
  );
}