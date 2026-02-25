import { useEffect, useState } from "react"
import type { Location } from "../../../services/locationService"
import { locationService } from "../../../services/locationService"

type SelectLocation = { id: number; name: string } | null;

export default function SelectLocationPage({ onSelect }: { onSelect?: (loc: SelectLocation) => void }) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await locationService.getAllLocations();
        if (mounted && Array.isArray(data)) setLocations(data as Location[]);
      } catch (e) {
        console.error("Failed to load locations", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="relative flex justify-center items-center min-h-[220px] p-8 font-serif">
      <div className="absolute top-1.5 left-3 text-3xl opacity-40 -rotate-12 pointer-events-none select-none z-0">
        🌿
      </div>
      <div className="absolute top-1 right-3 text-2xl opacity-35 rotate-12 pointer-events-none select-none z-0">
        🍃
      </div>
      <div className="absolute bottom-1.5 right-4 text-2xl opacity-30 -rotate-6 pointer-events-none select-none z-0">
        🍀
      </div>

      <div className="relative z-10 w-full min-w-[300px] max-w-md rounded-2xl border-2 border-green-600 bg-gradient-to-br from-amber-50 to-stone-100 px-8 py-7 shadow-lg">

        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-base">🌱</span>
          <h2 className="m-0 text-xl font-bold tracking-wide text-green-900">
            Select Location
          </h2>
          <span className="text-base">🌱</span>
        </div>

        <div className="h-px mb-5 rounded bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-70" />

            {loading ? (
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="w-7 h-7 rounded-full border-4 border-green-200 border-t-green-700 animate-spin" />
            <p className="m-0 text-sm italic text-green-700 opacity-80">
              Gathering locations from the forest…
            </p>
          </div>
        ) : (
          <div className="relative flex items-center">
            <select
              value={selectedLocation}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedLocation(val);
                    const loc = locations.find((l) => String(l.id) === val) || null;
                    if (onSelect) onSelect(loc ? { id: loc.id, name: loc.name } : null);
                  }}
              className="w-full appearance-none cursor-pointer rounded-xl border border-green-500 bg-gradient-to-b from-amber-50 to-stone-200 px-4 py-2.5 pr-9 text-base font-serif text-green-900 shadow-inner outline-none transition-all duration-200 focus:border-green-700 focus:ring-2 focus:ring-green-300"
            >
              <option value="">— Choose a location —</option>
              {locations.map((loc) => (
                        <option key={loc.id} value={String(loc.id)}>
                          {loc.name}
                        </option>
              ))}
            </select>
            <span className="absolute right-3 text-lg text-green-700 pointer-events-none select-none">
              ▾
            </span>
          </div>
        )}

        {selectedLocation && (
          <p className="mt-4 mb-0 text-center text-sm italic text-green-800 opacity-90">
            ✦ <em>{locations.find(l => String(l.id) === selectedLocation)?.name}</em> selected
          </p>
        )}
      </div>
    </div>
  );
}