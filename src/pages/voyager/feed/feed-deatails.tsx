import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService } from '@/services/postService';
import { userService } from '@/services/userService';
import { locationService } from '@/services/locationService';

export default function FeedDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<any | null>(null);
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [locationName, setLocationName] = useState<string | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!id) return;
      setLoading(true);
      try {
        const pid = Number(id);
        const p = await postService.getPost(pid);
        if (!mounted) return;
        setPost(p);

        if (p?.userId) {
          const u = await userService.getUserById(p.userId);
          if (mounted) setUserName(u?.name || u?.username || u?.displayName || undefined);
        }

        if (p?.locationId) {
          const loc = await locationService.getLocationById(p.locationId);
          if (mounted) setLocationName(loc?.name);
        }
      } catch (err) {
        console.warn('Failed to load post details', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50 to-green-50 flex items-center justify-center font-serif">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-green-200" />
          <div className="absolute inset-0 rounded-full border-4 border-t-green-600 animate-spin" />
        </div>
        <p className="text-sm italic text-green-700/60 tracking-wide">Unrolling the scroll…</p>
      </div>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50 to-green-50 flex items-center justify-center font-serif">
      <div className="text-center text-stone-400 italic">
        <span className="text-5xl block mb-3 opacity-50">🍃</span>
        <p>This scroll could not be found.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50 to-green-50 font-serif p-6 md:p-10">

      {/* Soft ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-green-200 opacity-20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-amber-100 opacity-30 blur-3xl" />
      </div>

      {/* Floating leaves — light opacity */}
      <span className="fixed top-[6%] left-[4%] text-3xl opacity-20 pointer-events-none select-none animate-bounce" style={{ animationDuration: '4.5s' }}>🌿</span>
      <span className="fixed top-[12%] right-[6%] text-2xl opacity-15 pointer-events-none select-none animate-bounce" style={{ animationDuration: '5.2s', animationDelay: '1s' }}>🍃</span>
      <span className="fixed bottom-[10%] left-[7%] text-2xl opacity-15 pointer-events-none select-none animate-bounce" style={{ animationDuration: '4s', animationDelay: '2s' }}>🍀</span>

      <div className="relative z-10 max-w-3xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="group mb-6 flex items-center gap-2 text-sm text-green-700/60 hover:text-green-800 transition-colors duration-200"
        >
          <span className="inline-block transition-transform duration-200 group-hover:-translate-x-1">←</span>
          <span className="italic tracking-wide">Back to the forest</span>
        </button>

        {/* Card */}
        <article className="rounded-3xl border border-stone-200 bg-white/70 backdrop-blur-sm overflow-hidden shadow-xl shadow-stone-200/60">

          {/* Hero image */}
          {post.imgLink && (
            <div className="relative h-72 w-full overflow-hidden">
              <img
                src={post.imgLink}
                alt={post.title}
                className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700"
              />
              {/* Soft gradient over image */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/10 to-transparent" />

              {/* Title overlaid */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h1 className="text-2xl md:text-3xl font-bold text-green-900 leading-snug drop-shadow-sm">
                  {post.title}
                </h1>
              </div>
            </div>
          )}

          <div className="p-6 md:p-8">

            {/* Title (no image) */}
            {!post.imgLink && (
              <>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-green-400/60">✦</span>
                  <h1 className="text-2xl md:text-3xl font-bold text-green-900 text-center leading-snug">
                    {post.title}
                  </h1>
                  <span className="text-green-400/60">✦</span>
                </div>
                <div className="h-px mb-5 bg-gradient-to-r from-transparent via-green-300/60 to-transparent" />
              </>
            )}

            {/* Meta pills */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <div className="flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1">
                <span className="text-sm">🧑‍🌾</span>
                <span className="text-xs text-green-800/70 tracking-wide">{userName ?? 'Unknown wanderer'}</span>
              </div>

              <div className="flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1">
                <span className="text-sm">📍</span>
                <span className="text-xs text-green-800/70 tracking-wide">{locationName ?? 'Unknown land'}</span>
              </div>

              <div className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 ml-auto">
                <span className="text-sm">🕰</span>
                <span className="text-xs text-stone-400 tracking-wide">
                  {new Date(post.createdAt).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px mb-6 bg-gradient-to-r from-transparent via-green-200 to-transparent" />

            {/* Body text */}
            <p className="text-stone-700 leading-relaxed text-base tracking-wide whitespace-pre-wrap">
              {post.content}
            </p>

            {/* Footer flourish */}
            <div className="mt-8 flex items-center justify-center gap-3 opacity-25">
              <div className="h-px w-16 bg-green-400" />
              <span className="text-green-500 text-sm">🌱</span>
              <div className="h-px w-16 bg-green-400" />
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}