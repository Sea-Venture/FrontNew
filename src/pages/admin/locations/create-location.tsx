import { useState } from "react";
import { useLocationStore } from "../../../store/locationStore";

export default function CreateLocationPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    latitude: "",
    longitude: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const createLocation = useLocationStore((state) => state.createLocation);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.description.trim()) e.description = "Description is required.";
    if (!form.latitude) {
      e.latitude = "Latitude is required.";
    } else if (isNaN(Number(form.latitude)) || Number(form.latitude) < -90 || Number(form.latitude) > 90) {
      e.latitude = "Must be a number between -90 and 90.";
    }
    if (!form.longitude) {
      e.longitude = "Longitude is required.";
    } else if (isNaN(Number(form.longitude)) || Number(form.longitude) < -180 || Number(form.longitude) > 180) {
      e.longitude = "Must be a number between -180 and 180.";
    }
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
      // Reset form after success
      setTimeout(() => {
        setForm({ name: "", description: "", latitude: "", longitude: "" });
        setSuccess(false);
      }, 2000);
    } catch (error) {
      setErrors({ submit: "Failed to create location. Please try again." });
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-5 flex items-center gap-3">
        <button className="text-gray-400 hover:text-gray-600 transition-colors p-1.5">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Create Location</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Add a new location to the system</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-8 py-6 sm:py-8">

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Basic Info</h2>

            <div className="flex flex-col gap-1.5 mb-4">
              <label className="text-xs sm:text-xs font-medium text-gray-600">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Galle"
                className={`w-full border rounded-lg px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-colors placeholder-gray-300 ${
                  errors.name
                    ? "border-red-300 bg-red-50 focus:border-red-400"
                    : "border-gray-200 bg-white focus:border-green-500"
                }`}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-xs font-medium text-gray-600">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="e.g. Galle is a city in down south"
                className={`w-full border rounded-lg px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-colors resize-none placeholder-gray-300 ${
                  errors.description
                    ? "border-red-300 bg-red-50 focus:border-red-400"
                    : "border-gray-200 bg-white focus:border-green-500"
                }`}
              />
              {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Coordinates</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600">
                  Latitude <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    name="latitude"
                    value={form.latitude}
                    onChange={handleChange}
                    placeholder="6.0535"
                    type="number"
                    step="any"
                    className={`w-full border rounded-lg px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-colors placeholder-gray-300 pr-12 ${
                      errors.latitude
                        ? "border-red-300 bg-red-50 focus:border-red-400"
                        : "border-gray-200 bg-white focus:border-green-500"
                    }`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-300 pointer-events-none">
                    lat
                  </span>
                </div>
                {errors.latitude && <p className="text-xs text-red-500">{errors.latitude}</p>}
                <p className="text-xs text-gray-400">-90 to 90</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600">
                  Longitude <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    name="longitude"
                    value={form.longitude}
                    onChange={handleChange}
                    placeholder="80.2202"
                    type="number"
                    step="any"
                    className={`w-full border rounded-lg px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-colors placeholder-gray-300 pr-12 ${
                      errors.longitude
                        ? "border-red-300 bg-red-50 focus:border-red-400"
                        : "border-gray-200 bg-white focus:border-green-500"
                    }`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-300 pointer-events-none">
                    lng
                  </span>
                </div>
                {errors.longitude && <p className="text-xs text-red-500">{errors.longitude}</p>}
                <p className="text-xs text-gray-400">-180 to 180</p>
              </div>
            </div>

            {form.latitude && form.longitude && !errors.latitude && !errors.longitude && (
              <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 h-40 bg-green-50 flex flex-col items-center justify-center gap-1 text-gray-400">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                <p className="text-xs">
                  {parseFloat(form.latitude).toFixed(4)}, {parseFloat(form.longitude).toFixed(4)}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              className="w-full sm:w-auto text-sm text-gray-500 border border-gray-200 bg-white hover:bg-gray-50 px-5 py-2.5 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto text-sm bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-medium px-6 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating…
                </>
              ) : (
                "Create Location"
              )}
            </button>
          </div>

          {success && (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm sm:text-sm">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Location created successfully!</span>
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