import { useState, useEffect } from "react";
import { useLocationStore } from "../../../store/locationStore";
import UpdateLocationPage from "./update-location";
import type { Location } from "../../../services/locationService";

const categories = ["All", "Café", "Wellness", "Market", "Landmark"];


function CreateLocationPage({ onBack, onLocationCreated }: { onBack: () => void; onLocationCreated: () => void }) {
  const [form, setForm] = useState({ name: "", description: "", latitude: "", longitude: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const createLocation = useLocationStore((state) => state.createLocation);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.description.trim()) e.description = "Description is required.";
    if (!form.latitude) e.latitude = "Latitude is required.";
    else if (isNaN(Number(form.latitude)) || Number(form.latitude) < -90 || Number(form.latitude) > 90)
      e.latitude = "Must be between -90 and 90.";
    if (!form.longitude) e.longitude = "Longitude is required.";
    else if (isNaN(Number(form.longitude)) || Number(form.longitude) < -180 || Number(form.longitude) > 180)
      e.longitude = "Must be between -180 and 180.";
    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    
    setSubmitting(true);
    try {
      await createLocation({
        name: form.name,
        description: form.description,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
      });
      setSuccess(true);
      setTimeout(() => {
        onLocationCreated();
        onBack();
      }, 1500);
    } catch (error) {
      setErrors({ submit: "Failed to create location. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const field = (key: keyof typeof form) =>
    `w-full border rounded-lg px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-colors placeholder-gray-300 ${
      errors[key] ? "border-red-300 bg-red-50 focus:border-red-400" : "border-gray-200 bg-white focus:border-green-500"
    }`;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="bg-white border-b border-gray-200 px-8 py-5 flex items-center gap-3">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Create Location</h1>
          <p className="text-sm text-gray-400 mt-0.5">Add a new location to the system</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Basic Info</h2>

            <div className="flex flex-col gap-1.5 mb-4">
              <label className="text-xs font-medium text-gray-600">Name <span className="text-red-400">*</span></label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Galle" className={field("name")} />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">Description <span className="text-red-400">*</span></label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4}
                placeholder="e.g. Galle is a city in down south"
                className={`${field("description")} resize-none`} />
              {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Coordinates</h2>
            <div className="grid grid-cols-2 gap-4">
              {(["latitude", "longitude"] as const).map((key) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600 capitalize">
                    {key} <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input name={key} value={form[key]} onChange={handleChange} type="number" step="any"
                      placeholder={key === "latitude" ? "6.0535" : "80.2202"}
                      className={`${field(key)} pr-12`} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-300 pointer-events-none">
                      {key === "latitude" ? "lat" : "lng"}
                    </span>
                  </div>
                  {errors[key] && <p className="text-xs text-red-500">{errors[key]}</p>}
                  <p className="text-xs text-gray-400">{key === "latitude" ? "-90 to 90" : "-180 to 180"}</p>
                </div>
              ))}
            </div>

            {form.latitude && form.longitude && !errors.latitude && !errors.longitude && (
              <div className="mt-4 rounded-lg border border-gray-200 h-32 bg-green-50 flex flex-col items-center justify-center gap-1 text-gray-400">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                <p className="text-xs">{parseFloat(form.latitude).toFixed(4)}, {parseFloat(form.longitude).toFixed(4)}</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={onBack}
              className="text-sm text-gray-500 border border-gray-200 bg-white hover:bg-gray-50 px-5 py-2.5 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="text-sm bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-medium px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 shadow-sm">
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating…
                </>
              ) : "Create Location"}
            </button>
          </div>

          {success && (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Location created successfully!
            </div>
          )}
          {errors.submit && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
              {errors.submit}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}


export default function UsersPage() {
  const [page, setPage] = useState<"list" | "create" | "update">("list");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  const locations = useLocationStore((state) => state.locations);
  const isLoading = useLocationStore((state) => state.isLoading);
  const error = useLocationStore((state) => state.error);
  const fetchAllLocations = useLocationStore((state) => state.fetchAllLocations);
  const deleteLocation = useLocationStore((state) => state.deleteLocation);

  useEffect(() => {
    fetchAllLocations(search || undefined);
  }, [search, fetchAllLocations]);

  const handleLocationCreated = () => {
    fetchAllLocations(search || undefined);
  };

  const handleLocationUpdated = () => {
    fetchAllLocations(search || undefined);
    setEditingLocation(null);
  };

  if (page === "create") {
    return <CreateLocationPage onBack={() => setPage("list")} onLocationCreated={handleLocationCreated} />;
  }

  if (page === "update") {
    return (
      <UpdateLocationPage
        id={editingLocation?.id}
        location={editingLocation || undefined}
        onBack={() => setPage("list")}
        onUpdated={() => {
          handleLocationUpdated();
          setPage("list");
        }}
      />
    );
  }

  const filtered = locations.filter((l) => {
    if (!l) return false;
    const matchCat = activeCategory === "All" || (l.name && l.name.includes(activeCategory));
    const matchStatus = statusFilter === "All";
    return matchCat && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Locations</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">{locations.length} total locations</p>
        </div>
        <button
          onClick={() => setPage("create")}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors duration-150 shadow-sm"
        >
          <span className="text-base leading-none">+</span> Create Location
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 sm:px-8 py-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 w-full sm:w-64">
          <input type="text" placeholder="Search locations..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full" />
        </div>
        <span className="text-xs sm:text-sm text-gray-400 whitespace-nowrap sm:ml-auto">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="p-4 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading && (
          <div className="col-span-full text-center py-20 text-gray-400">
            <p className="text-sm">Loading locations...</p>
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-400">
            <p className="text-sm">No locations match your filters.</p>
          </div>
        )}

        {filtered.map((loc) => (
          <div key={loc.id}
            className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 hover:shadow-md hover:border-gray-300 transition-all duration-200 flex flex-col gap-4">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm leading-snug">{loc.name}</h3>
              <p className="text-xs text-gray-400 mt-1">{loc.description}</p>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
              <span className="text-gray-500">
                {loc.latitude}, {loc.longitude}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingLocation(loc);
                  setPage("update");
                }}
                className="flex-1 text-xs text-gray-600 border border-gray-200 rounded-lg py-2 hover:bg-gray-50 transition-colors">
                Edit
              </button>
              <button
                onClick={() => {
                  deleteLocation(loc.id);
                }}
                className="flex-1 text-xs text-red-500 border border-red-100 rounded-lg py-2 hover:bg-red-50 transition-colors">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}