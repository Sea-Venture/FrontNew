import type { Post } from "../types/types";
import { useEffect, useState } from 'react';
import { locationService } from '../../../services/locationService';
import { userService } from '../../../services/userService';

const isSafeImageUrl = (url?: string) => {
  if (!url) return false;
  if (url.startsWith('data:')) return true;
  try {
    const u = new URL(url);
    if (!['http:', 'https:'].includes(u.protocol)) return false;
    const host = u.hostname || '';
    if (!host.includes('.') && host !== 'localhost' && !/^\d+\.\d+\.\d+\.\d+$/.test(host)) return false;
    return true;
  } catch (e) {
    return false;
  }
};

export default function PostCard({ post, onEdit, onDelete }: { post: Post; onEdit: (p: Post) => void; onDelete: (id: number) => void }) {
  const [locationName, setLocationName] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  // simple in-memory caches to avoid duplicate network requests across cards
  const staticLocationCache: Map<number, string> = (globalThis as any).__locationCache || ((globalThis as any).__locationCache = new Map());
  const staticUserCache: Map<number, string> = (globalThis as any).__userCache || ((globalThis as any).__userCache = new Map());

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (post.locationId) {
        const cached = staticLocationCache.get(post.locationId);
        if (cached) {
          setLocationName(cached);
        } else {
          const loc = await locationService.getLocationById(post.locationId);
          const name = loc?.name || null;
          if (!cancelled && name) {
            staticLocationCache.set(post.locationId, name);
            setLocationName(name);
          }
        }
      }

      if (post.userId) {
        const cachedU = staticUserCache.get(post.userId);
        if (cachedU) {
          setUserName(cachedU);
        } else {
          const user = await userService.getUserById(post.userId);
          const uname = user?.username || user?.name || null;
          if (!cancelled && uname) {
            staticUserCache.set(post.userId, uname);
            setUserName(uname);
          }
        }
      }
    };

    load();
    return () => { cancelled = true; };
  }, [post.locationId, post.userId]);

  return (
    <article className="group relative bg-amber-50 rounded-2xl overflow-hidden border border-green-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <span className="absolute top-3 right-4 text-xl z-10 opacity-30 rotate-12 select-none group-hover:opacity-70 transition-opacity">🌿</span>

      <div className="relative h-48 overflow-hidden">
        {isSafeImageUrl(post.imgLink) ? (
          <img src={post.imgLink} alt={post.title}
            onError={(e) => { const t = e.currentTarget as HTMLImageElement; t.onerror = null; t.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"></svg>'; }}
            className="w-full h-full object-cover brightness-95 group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">No image</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/5 via-green-700/10 to-amber-50/75" />
        {post.tag && (
          <span className="absolute bottom-3 left-4 z-10 bg-green-800 text-green-100 text-xs italic tracking-wider px-3 py-1 rounded-full shadow-md" style={{ fontFamily: "'Lora', serif" }}>
            {post.tag}
          </span>
        )}
      </div>

      <div className="px-6 pt-4 pb-5">
        <svg viewBox="0 0 200 12" className="w-full mb-3 opacity-30" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,6 Q25,0 50,6 Q75,12 100,6 Q125,0 150,6 Q175,12 200,6" stroke="#4ade80" strokeWidth="1.5" fill="none" />
        </svg>
        <div className="flex items-start gap-2 mb-2">
          {post.emoji && <span className="text-xl mt-0.5">{post.emoji}</span>}
          <h2 className="font-semibold text-green-900 leading-snug text-base">{post.title}</h2>
        </div>
        <p className="text-sm text-green-800/70 leading-relaxed line-clamp-3 italic" style={{ fontFamily: "'Lora', serif" }}>
          {post.content}
        </p>
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
          <span>Location {locationName ? `· ${locationName}` : `#${post.locationId}`}</span>
          <span>·</span>
          <span>User {userName ? `· ${userName}` : `#${post.userId}`}</span>
        </div>
        <div className="flex gap-2 mt-4 pt-4 border-t border-green-100">
          <button onClick={() => onEdit(post)} className="flex-1 text-xs text-gray-600 border border-gray-200 rounded-lg py-1.5 hover:bg-gray-50 transition-colors">Edit</button>
          <button onClick={() => onDelete(post.id)} className="flex-1 text-xs text-red-500 border border-red-100 rounded-lg py-1.5 hover:bg-red-50 transition-colors">Delete</button>
        </div>
      </div>
    </article>
  );
}
