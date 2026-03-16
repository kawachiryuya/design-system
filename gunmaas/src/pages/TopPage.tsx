import { useState } from 'react';
import { Typography } from '@ds/primitives/Typography/Typography';
import { destinations } from '../data/destinations';
import type { CategoryId } from '../data/destinations';
import type { DemandZone } from '../data/railLines';
import { MapBackground } from '../components/MapBackground';
import { BottomSheet } from '../components/BottomSheet';
import { SearchBar } from '../components/SearchBar';
import { CategoryChips } from '../components/CategoryChips';
import { PlacePopup } from '../components/PlacePopup';
import { ZonePopup } from '../components/ZonePopup';
import { LayerControl } from '../components/LayerControl';

export const TopPage = () => {
  const [activeCat, setActiveCat] = useState<CategoryId>('all');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<DemandZone | null>(null);
  const [sheetHeight, setSheetHeight] = useState(52);
  const [layers, setLayers] = useState({ network: true, demand: true });

  const selectedPlace = selectedPlaceId
    ? destinations.find((d) => d.id === selectedPlaceId) ?? null
    : null;

  const filteredPlaces =
    activeCat === 'all' ? destinations : destinations.filter((d) => d.cat === activeCat);

  const handlePinClick = (id: string) => {
    setSelectedZone(null);
    setSelectedPlaceId((prev) => (prev === id ? null : id));
  };

  const handleZoneClick = (zone: DemandZone) => {
    setSelectedPlaceId(null);
    setSelectedZone((prev) => (prev?.id === zone.id ? null : zone));
  };

  const handleLayerToggle = (key: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="relative w-full" style={{ height: 'calc(100dvh - 64px)' }}>
      {/* Map */}
      <div className="absolute inset-0">
        <MapBackground
          activeCat={activeCat}
          selectedPlaceId={selectedPlaceId}
          layers={layers}
          onPinClick={handlePinClick}
          onZoneClick={handleZoneClick}
        />
      </div>

      {/* Search + Chips overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
        <div className="px-4 pt-3">
          <SearchBar onClose={() => {}} />
        </div>
        <CategoryChips active={activeCat} onChange={setActiveCat} />
      </div>

      {/* Place popup */}
      {selectedPlace && (
        <PlacePopup
          place={selectedPlace}
          onClose={() => setSelectedPlaceId(null)}
          bottomOffset={sheetHeight}
        />
      )}

      {/* Zone popup */}
      {selectedZone && (
        <ZonePopup
          zone={selectedZone}
          onClose={() => setSelectedZone(null)}
          bottomOffset={sheetHeight}
        />
      )}

      {/* Layer control */}
      <LayerControl
        layers={layers}
        onToggle={handleLayerToggle}
        bottomOffset={sheetHeight}
      />

      {/* Bottom sheet */}
      <BottomSheet height={sheetHeight} onHeightChange={setSheetHeight}>
        <div className="flex-1 overflow-y-auto px-4">
          <Typography variant="caption" color="muted" as="div" weight="bold" className="mb-2">
            {activeCat === 'all' ? 'すべての行き先' : activeCat} · {filteredPlaces.length}件
          </Typography>
          {filteredPlaces.map((p) => (
            <div
              key={p.id}
              onClick={() => handlePinClick(p.id)}
              className="flex items-center gap-3 py-3 cursor-pointer border-b border-border-muted last:border-b-0"
            >
              <div
                className="w-10 h-10 rounded-sm flex items-center justify-center text-[20px] flex-shrink-0"
                style={{ background: '#F0FAF4' }}
              >
                {p.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <Typography variant="body-sm" as="div" weight="bold">
                  {p.name}
                </Typography>
                <Typography variant="caption" color="muted" as="div">
                  {p.cat} · {p.area}
                </Typography>
              </div>
              {p.ticket && (
                <Typography variant="caption" color="primary" as="span" weight="semibold" className="flex-shrink-0">
                  🎫 {p.ticket}
                </Typography>
              )}
            </div>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
};
