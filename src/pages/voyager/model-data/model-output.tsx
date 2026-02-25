import { useEffect, useState } from 'react';
import type { WeatherDetails, WeatherForecastItem } from '@/services/weatherService';
import { weatherService } from '@/services/weatherService';

// ── tiny icon helpers ──────────────────────────────────────────────────────
function WindIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
    </svg>
  );
}
function DropIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C12 2 5 10.4 5 15a7 7 0 0 0 14 0c0-4.6-7-13-7-13Z" />
    </svg>
  );
}
function WaveIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" d="M2 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0" />
    </svg>
  );
}
function TempIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0Z" />
    </svg>
  );
}

function waveStatusColor(status: string) {
  if (!status) return 'text-green-300';
  const s = status.toLowerCase();
  if (s.includes('good') || s.includes('excel')) return 'text-emerald-400';
  if (s.includes('fair') || s.includes('ok')) return 'text-yellow-300';
  if (s.includes('poor') || s.includes('bad')) return 'text-red-400';
  return 'text-green-300';
}

function waveStatusDot(status: string) {
  const s = (status || '').toLowerCase();
  if (s.includes('good') || s.includes('excel')) return 'bg-emerald-400';
  if (s.includes('fair') || s.includes('ok')) return 'bg-yellow-300';
  if (s.includes('poor') || s.includes('bad')) return 'bg-red-400';
  return 'bg-green-400';
}

// ── component ──────────────────────────────────────────────────────────────
export default function ModelOutput({ city }: { city: string | null }) {
  const [data, setData] = useState<WeatherDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'forecast' | 'prediction' | 'current'>('current');

  useEffect(() => {
    if (!city) return;
    let mounted = true;
    setLoading(true);
    setError(null);
    setData(null);
    (async () => {
      try {
        const resp = await weatherService.getWeatherDetails(city.toLowerCase());
        if (mounted) setData(resp || null);
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Failed to load weather');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [city]);

  // ── empty / loading / error states ─────────────────────────────────────
  if (!city) return (
    <div className="mt-4 flex flex-col items-center justify-center gap-2 py-10 text-green-300/60 font-serif">
      <span className="text-4xl opacity-40">🌍</span>
      <p className="text-sm italic tracking-wide">Choose a location to reveal the weather…</p>
    </div>
  );

  if (loading) return (
    <div className="mt-4 flex flex-col items-center justify-center gap-3 py-10">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-green-800" />
        <div className="absolute inset-0 rounded-full border-4 border-t-lime-400 animate-spin" />
      </div>
      <p className="text-sm italic text-green-300/70 tracking-wide">
        Reading the winds over <span className="font-semibold text-lime-300">{city}</span>…
      </p>
    </div>
  );

  if (error) return (
    <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-900/20 p-6 text-center text-sm text-red-300 italic">
      ⚠ {error}
    </div>
  );

  if (!data) return null;

  const { forecast, prediction, current } = data as any;

  const tabs = [
    { id: 'current', label: 'Now', icon: '🌡' },
    { id: 'forecast', label: 'Waves', icon: '🌊' },
    { id: 'prediction', label: 'Outlook', icon: '🔭' },
  ] as const;

  return (
    <div className="mt-4 font-serif">

      {/* ── Top city banner ── */}
      <div className="mb-3 flex items-center gap-3 px-1">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />
        <span className="text-xs uppercase tracking-[0.2em] text-green-400/80 italic">
          📍 {city}
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />
      </div>

      {/* ── Tab bar — zoom.earth-style pill switcher ── */}
      <div className="mb-4 flex rounded-2xl bg-green-950/60 p-1 border border-green-800/50 backdrop-blur-sm gap-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold tracking-wide transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-green-700/80 text-lime-200 shadow-lg shadow-green-900/50'
                : 'text-green-400/70 hover:text-green-200 hover:bg-green-800/30'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── CURRENT WEATHER ── */}
      {activeTab === 'current' && current && (
        <div className="space-y-3">

          {/* Hero temp strip */}
          <div className="rounded-2xl border border-green-700/40 bg-gradient-to-br from-green-900/70 to-green-950/80 p-5 backdrop-blur-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-green-400/70 mb-1">Current Conditions</p>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold text-lime-200 leading-none">
                    {current.summary?.temperature?.avg}
                  </span>
                  <span className="text-xl text-green-400 mb-1">°C</span>
                </div>
                <p className="mt-1 text-xs text-green-300/60 italic">
                  ↑ {current.summary?.temperature?.max}° &nbsp;↓ {current.summary?.temperature?.min}°
                </p>
              </div>
              <div className="text-5xl opacity-60">🌿</div>
            </div>

  
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 rounded-xl bg-green-800/30 px-3 py-2">
                <span className="text-blue-300"><DropIcon /></span>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-green-400/60">Precipitation</p>
                  <p className="text-sm font-semibold text-green-100">{current.summary?.total_precipitation_mm} <span className="text-xs font-normal text-green-400">mm</span></p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-green-800/30 px-3 py-2">
                <span className="text-cyan-300"><WindIcon /></span>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-green-400/60">Wind avg / max</p>
                  <p className="text-sm font-semibold text-green-100">
                    {current.summary?.wind?.avg_speed_kmh} / {current.summary?.wind?.max_speed_kmh}
                    <span className="text-xs font-normal text-green-400"> km/h</span>
                  </p>
                </div>
              </div>
            </div>
          </div>


          {current.hourly_data?.length > 0 && (
            <div>
              <p className="mb-2 px-1 text-[10px] uppercase tracking-widest text-green-400/60">Hourly breakdown</p>
              <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
                {(current.hourly_data as any[]).slice(0, 12).map((h: any) => {
                  const hour = new Date(h.time).getHours();
                  const isDay = hour >= 6 && hour < 19;
                  return (
                    <div
                      key={h.time}
                      className="snap-start shrink-0 w-[88px] rounded-2xl border border-green-700/30 bg-green-900/50 p-3 text-center backdrop-blur-sm"
                    >
                      <p className="text-[10px] text-green-400/70">
                        {new Date(h.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="my-1 text-xl">{isDay ? '☀️' : '🌙'}</p>
                      <p className="text-base font-bold text-lime-200">{h.temperature_celsius}°</p>
                      <p className="mt-0.5 text-[10px] text-green-300/60 leading-tight line-clamp-2">{h.weather_description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}


      {activeTab === 'forecast' && forecast && (
        <div className="space-y-3">
          {forecast.verdict && (
            <div className="rounded-2xl border border-emerald-700/40 bg-emerald-900/20 px-4 py-3 text-sm italic text-emerald-300">
              🌊 {forecast.verdict}
            </div>
          )}

          <div className="rounded-2xl border border-green-700/40 bg-green-950/60 overflow-hidden backdrop-blur-sm">

            <div className="grid grid-cols-4 gap-0 border-b border-green-800/50 px-4 py-2">
              {['Time', 'Status', 'Height', 'Period'].map(h => (
                <span key={h} className="text-[10px] uppercase tracking-widest text-green-400/50">{h}</span>
              ))}
            </div>


            <div className="divide-y divide-green-800/30 max-h-64 overflow-y-auto">
              {(forecast.items || []).map((it: WeatherForecastItem) => (
                <div key={it.time} className="grid grid-cols-4 gap-0 px-4 py-3 hover:bg-green-800/20 transition-colors">
                  <span className="text-xs text-green-300/80">
                    {new Date(it.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    <br />
                    <span className="text-[10px] text-green-400/50">
                      {new Date(it.time).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </span>
                  <span className={`flex items-center gap-1 text-xs font-medium capitalize ${waveStatusColor(it.status)}`}>
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${waveStatusDot(it.status)}`} />
                    {it.status}
                  </span>
                  <span className="text-xs text-green-200 font-semibold">{it.wave_height.toFixed(2)} <span className="text-green-400/60 font-normal">m</span></span>
                  <span className="text-xs text-green-200 font-semibold">{it.wave_period.toFixed(2)} <span className="text-green-400/60 font-normal">s</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'prediction' && prediction && (
        <div className="space-y-3">
          <div className="rounded-2xl border border-green-700/40 bg-gradient-to-br from-green-900/70 to-green-950/80 p-5 backdrop-blur-sm">
            <p className="text-[10px] uppercase tracking-widest text-green-400/60 mb-3">Tomorrow's Outlook</p>

 
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-600/40 bg-green-800/40 px-3 py-1">
              <span className="text-lg">🌤</span>
              <span className="text-sm font-semibold text-lime-200 capitalize">
                {prediction.predictions?.condition || '—'}
              </span>
            </div>


            <div className="mb-4">
              <div className="flex justify-between text-[10px] text-green-400/60 mb-1">
                <span>Min</span><span>Max</span>
              </div>
              <div className="relative h-3 rounded-full bg-green-950/60 overflow-hidden border border-green-800/40">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-blue-500 via-lime-400 to-orange-400"
                  style={{ width: '100%', opacity: 0.8 }}
                />
              </div>
              <div className="flex justify-between text-xs font-semibold text-green-100 mt-1">
                <span>{prediction.predictions?.min_temperature_celsius}°C</span>
                <span>{prediction.predictions?.max_temperature_celsius}°C</span>
              </div>
            </div>


            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center justify-between rounded-xl bg-green-800/30 px-4 py-3">
                <div className="flex items-center gap-2 text-blue-300">
                  <DropIcon />
                  <span className="text-xs text-green-300/70">Precipitation</span>
                </div>
                <span className="text-sm font-semibold text-green-100">
                  {prediction.predictions?.precipitation_mm}
                  <span className="text-xs font-normal text-green-400 ml-1">mm</span>
                </span>
              </div>
            </div>
          </div>

          <p className="text-center text-[10px] italic text-green-400/40 tracking-wide">
            ✦ Prediction for {prediction.city} ✦
          </p>
        </div>
      )}

    </div>
  );
}