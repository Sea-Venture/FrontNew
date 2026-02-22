import { useState, useEffect } from "react";
import { useLocationStore } from "../../../store/locationStore";

type Props = {
  id?: number;
  location?: any;
  onBack?: () => void;
  onUpdated?: () => void;
};

export default function UpdateLocationPage({ id, location, onBack, onUpdated }: Props) {
  const [form, setForm] = useState({ name: "", description: "", latitude: "", longitude: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const locations = useLocationStore((s) => s.locations);
  const updateLocation = useLocationStore((s) => s.updateLocation);

  useEffect(() => {
    let src = location;
    if (!src && typeof id === "number") {
      src = locations.find((l: any) => l?.id === id) as any | undefined;
    }

    if (src) {
      setForm({
        name: src.name || "",
        description: src.description || "",
        latitude: src.latitude?.toString() || "",
        longitude: src.longitude?.toString() || "",
      });
    }
  }, [id, location, locations]);

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
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const targetId = typeof id === "number" ? id : (location?.id as number | undefined);
    if (typeof targetId !== "number") {
      setErrors({ submit: "Unable to determine location to update." });
      return;
    }

    setSubmitting(true);
    try {
      await updateLocation(targetId, {
        name: form.name,
        description: form.description,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
      });
      if (onUpdated) onUpdated();
      if (onBack) onBack();
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : "Failed to update location" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-5 flex items-center gap-3">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 transition-colors p-1.5">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Update Location</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Edit details and save changes</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Basic Info</h2>

            <div className="flex flex-col gap-1.5 mb-4">
              <label className="text-xs sm:text-xs font-medium text-gray-600">Name <span className="text-red-400">*</span></label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Galle"
                className={`w-full border rounded-lg px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-colors placeholder-gray-300 ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`} />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-xs font-medium text-gray-600">Description <span className="text-red-400">*</span></label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4}
                placeholder="e.g. Galle is a city in down south"
                className={`w-full border rounded-lg px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-colors resize-none placeholder-gray-300 ${errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`} />
              {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Coordinates</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600">Latitude <span className="text-red-400">*</span></label>
                <div className="relative">
                  <input name="latitude" value={form.latitude} onChange={handleChange} placeholder="6.0535" type="number" step="any"
                    className={`w-full border rounded-lg px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-colors placeholder-gray-300 pr-12 ${errors.latitude ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-300 pointer-events-none">lat</span>
                </div>
                {errors.latitude && <p className="text-xs text-red-500">{errors.latitude}</p>}
                <p className="text-xs text-gray-400">-90 to 90</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600">Longitude <span className="text-red-400">*</span></label>
                <div className="relative">
                  <input name="longitude" value={form.longitude} onChange={handleChange} placeholder="80.2202" type="number" step="any"
                    className={`w-full border rounded-lg px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-colors placeholder-gray-300 pr-12 ${errors.longitude ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-300 pointer-events-none">lng</span>
                </div>
                {errors.longitude && <p className="text-xs text-red-500">{errors.longitude}</p>}
                <p className="text-xs text-gray-400">-180 to 180</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
            <button type="button" onClick={onBack} className="w-full sm:w-auto text-sm text-gray-500 border border-gray-200 bg-white hover:bg-gray-50 px-5 py-2.5 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={submitting} className="w-full sm:w-auto text-sm bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-medium px-6 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm">
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>

          {errors.submit && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
              {errors.submit}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
