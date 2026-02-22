import { useState, useRef, useEffect } from "react";
import type { Post } from "../types/types";
import type { Location } from "@/services/locationService";
import { locationService } from "@/services/locationService";
import { uploadFile } from "@/services/uploadService";

const inputCls = (err?: string) =>
  `w-full border rounded-lg px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-colors placeholder-gray-300 ${
    err ? "border-red-300 bg-red-50 focus:border-red-400" : "border-gray-200 bg-white focus:border-green-500"
  }`;

export default function PostForm({
  initial,
  onSave,
  onCancel,
  mode,
}: {
  initial?: Partial<Post>;
  onSave: (data: Omit<Post, "id" | "userId">) => void;
  onCancel: () => void;
  mode: "create" | "edit";
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    content: initial?.content ?? "",
    imgLink: initial?.imgLink ?? "",
    locationId: initial?.locationId?.toString() ?? "",
    tag: initial?.tag ?? "",
    emoji: initial?.emoji ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [locations, setLocations] = useState<Location[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await locationService.getAllLocations();
        if (mounted) setLocations(list);
      } catch (err) {
        console.error("Failed to load locations", err);
        if (mounted) setLocations([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.content.trim()) e.content = "Content is required.";
    if (!form.imgLink.trim()) e.imgLink = "Image is required.";
    if (!form.locationId) e.locationId = "Location ID is required.";
    else if (isNaN(Number(form.locationId))) e.locationId = "Must be a number.";
    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files are allowed");
      return;
    }

    setUploadError(null);
    setUploading(true);
    try {
      const res = await uploadFile(file, "posts");
      const url = res?.url || res?.data?.url || res?.data || res?.filename || "";
      if (!url) throw new Error(res?.message || "Upload failed");
      setForm((p) => ({ ...p, imgLink: url }));
      setErrors((p) => ({ ...p, imgLink: "" }));
    } catch (err: any) {
      console.error("Upload failed", err);
      setUploadError(typeof err === "string" ? err : err?.message || "Upload failed");
      // clear any preview if upload failed
      setForm((p) => ({ ...p, imgLink: "" }));
      if (fileInputRef.current) fileInputRef.current.value = "";
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setSuccess(true);
    setTimeout(() => {
      onSave({ ...form, locationId: Number(form.locationId) } as any);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="bg-white border-b border-gray-200 px-8 py-5 flex items-center gap-3">
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-semibold text-gray-800">{mode === "create" ? "Create Post" : "Edit Post"}</h1>
          <p className="text-sm text-gray-400 mt-0.5">{mode === "create" ? "Publish a new guide post" : "Update the post details"}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-gray-700">Post Content</h2>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">Title <span className="text-red-400">*</span></label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Galle Beach" className={inputCls(errors.title)} />
              {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">Content <span className="text-red-400">*</span></label>
              <textarea name="content" value={form.content} onChange={handleChange} rows={5} placeholder="Write your guide content here..." className={`${inputCls(errors.content)} resize-none`} />
              {errors.content && <p className="text-xs text-red-500">{errors.content}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">Image <span className="text-red-400">*</span></label>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

              {!form.imgLink ? (
                <div onClick={() => fileInputRef.current?.click()} onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={async (e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) await handleFile(f); }} className={`w-full border-2 border-dashed rounded-xl px-4 py-10 flex flex-col items-center gap-2 cursor-pointer transition-all duration-200 ${dragging ? "border-green-400 bg-green-50 scale-[1.01]" : errors.imgLink ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50 hover:border-green-400 hover:bg-green-50"}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${dragging ? "bg-green-100" : "bg-gray-100"}`}>
                    <svg className={`w-6 h-6 transition-colors ${dragging ? "text-green-500" : "text-gray-400"}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500"><span className="text-green-600 font-medium">Click to upload</span> or drag & drop</p>
                    <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP — up to 10MB</p>
                  </div>
                </div>
              ) : (
                <div className="relative group rounded-xl overflow-hidden border border-gray-200">
                  <img src={form.imgLink} alt="preview" className="w-full h-52 object-cover" />
                  {uploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                        <span>Uploading…</span>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs bg-white text-gray-700 px-3 py-1.5 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow">Replace</button>
                    <button type="button" onClick={() => { setForm((p) => ({ ...p, imgLink: "" })); if (fileInputRef.current) fileInputRef.current.value = ""; setUploadError(null); }} className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-red-600 transition-colors shadow">Remove</button>
                  </div>
                </div>
              )}
              {errors.imgLink && <p className="text-xs text-red-500">{errors.imgLink}</p>}
              {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">Location <span className="text-red-400">*</span></label>
              {locations === null ? (
                <div className="text-sm text-gray-400">Loading locations…</div>
              ) : (
                <select name="locationId" value={form.locationId} onChange={handleChange} className={inputCls(errors.locationId)}>
                  <option value="">Select a location</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={String(loc.id)}>{loc.name}</option>
                  ))}
                </select>
              )}
              {errors.locationId && <p className="text-xs text-red-500">{errors.locationId}</p>}
            </div>
          </div>

            <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={onCancel} className="text-sm text-gray-500 border border-gray-200 bg-white hover:bg-gray-50 px-5 py-2.5 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={submitting || uploading} className="text-sm bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-medium px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 shadow-sm">
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                  {mode === "create" ? "Publishing…" : "Saving…"}
                </>
              ) : mode === "create" ? "Publish Post" : "Save Changes"}
            </button>
          </div>

          {success && (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {mode === "create" ? "Post published successfully!" : "Post updated successfully!"}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
