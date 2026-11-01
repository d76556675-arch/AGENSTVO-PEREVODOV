import React, { useState } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow 
} from '@vis.gl/react-google-maps';
import { MapPin, Navigation, PhoneCall, Clock, ExternalLink, ShieldCheck } from 'lucide-react';

interface GoogleOfficeMapProps {
  onBookAppointment: () => void;
}

// Coordinates for г. Новосибирск, ул. Станиславского, д. 2/3 (3 этаж, офис 314)
const NOVOSIBIRSK_OFFICE = {
  lat: 54.9818,
  lng: 82.8752,
};

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBQMOnFckdzlioklO2nDTbNEKpK_WQJ8As';

export const GoogleOfficeMap: React.FC<GoogleOfficeMapProps> = ({ onBookAppointment }) => {
  const [infoOpen, setInfoOpen] = useState(true);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Новосибирск, ул. Станиславского 2/3')}`;
  const routeUrl = `https://www.google.com/maps/dir/?api=1&destination=${NOVOSIBIRSK_OFFICE.lat},${NOVOSIBIRSK_OFFICE.lng}`;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl">
      {/* Map Control Micro-Header */}
      <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">Google Maps: Офис бюро «ДИВА»</h4>
            <p className="text-xs text-slate-400">г. Новосибирск, ул. Станиславского, д. 2/3, этаж 3, офис 314</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Map Type toggle */}
          <div className="bg-slate-800 p-0.5 rounded-lg flex text-xs">
            <button
              type="button"
              onClick={() => setMapType('roadmap')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                mapType === 'roadmap' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Схема
            </button>
            <button
              type="button"
              onClick={() => setMapType('satellite')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                mapType === 'satellite' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Спутник
            </button>
          </div>

          <a
            href={routeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Маршрут</span>
          </a>
        </div>
      </div>

      {/* Interactive Map Container */}
      <div className="relative w-full h-[420px] sm:h-[480px] bg-slate-100">
        <APIProvider apiKey={MAPS_API_KEY} language="ru" region="RU">
          <Map
            defaultCenter={NOVOSIBIRSK_OFFICE}
            defaultZoom={16}
            mapId="DEMO_MAP_ID"
            mapTypeId={mapType}
            gestureHandling="greedy"
            disableDefaultUI={false}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            className="w-full h-full"
          >
            {/* Advanced Marker */}
            <AdvancedMarker
              position={NOVOSIBIRSK_OFFICE}
              onClick={() => setInfoOpen(!infoOpen)}
              title="Бюро переводов «ДИВА» — ул. Станиславского, 2/3, оф. 314"
            >
              <Pin
                background="#4f46e5"
                glyphColor="#fbbf24"
                borderColor="#1e1b4b"
                scale={1.2}
              />
            </AdvancedMarker>

            {/* Info Window */}
            {infoOpen && (
              <InfoWindow
                position={NOVOSIBIRSK_OFFICE}
                onCloseClick={() => setInfoOpen(false)}
                pixelOffset={[0, -42]}
              >
                <div className="p-1 max-w-[260px] text-left text-slate-900">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <strong className="text-xs font-extrabold text-indigo-700">Бюро переводов «ДИВА»</strong>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-tight mb-2">
                    г. Новосибирск, ул. Станиславского, д. 2/3, <strong>3 этаж, офис 314</strong>
                  </p>
                  
                  <div className="space-y-1 text-[10px] text-slate-600 border-t border-slate-100 pt-1.5 mb-2">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-500 shrink-0" />
                      <span>Пн-Пт: 09:00 — 19:00 | Сб: 10:00 — 16:00</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <PhoneCall className="w-3 h-3 text-emerald-600 shrink-0" />
                      <a href="tel:+79537751997" className="font-semibold text-slate-800">
                        +7 953 775 19 97
                      </a>
                    </div>
                    <div className="flex items-center gap-1 text-indigo-600 font-medium">
                      <ShieldCheck className="w-3 h-3 shrink-0" />
                      <span>Штатный нотариус в офисе</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={onBookAppointment}
                      className="flex-1 py-1 px-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] transition-colors"
                    >
                      Записаться на прием
                    </button>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700"
                      title="Открыть в Google Maps"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>

        {/* Quick Directions Floating Card */}
        <div className="absolute bottom-4 left-4 z-10 max-w-xs bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-lg text-xs hidden sm:block">
          <div className="font-bold text-slate-900 mb-0.5 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            Как добраться:
          </div>
          <p className="text-[11px] text-slate-600 leading-snug">
            От м. «Площадь Маркса» 5-7 минут на транспорте или 15 минут пешком. Офис 314 находится на 3 этаже, вход свободный, парковка у входа.
          </p>
        </div>
      </div>
    </div>
  );
};
