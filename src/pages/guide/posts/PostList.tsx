import type { Post } from "../types/types";
import PostCard from "./PostCard";

export default function PostList({ posts, onCreate, onEdit, onDelete }: {
  posts: Post[]; onCreate: () => void; onEdit: (p: Post) => void; onDelete: (id: number) => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-green-100 font-sans">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white opacity-50 animate-bounce"
            style={{ width: `${5 + (i % 3) * 3}px`, height: `${5 + (i % 3) * 3}px`, left: `${(i * 14 + 5) % 90}%`, top: `${(i * 19 + 10) % 80}%`, animationDuration: `${3 + i * 0.8}s`, animationDelay: `${i * 0.5}s` }} />
        ))}
      </div>

      <div className="relative z-10 bg-white/70 backdrop-blur-sm border-b border-green-200/50 px-8 py-5 flex items-center justify-between sticky top-0">
        <div>
          <h1 className="text-xl font-semibold text-green-900">Posts</h1>
          <p className="text-sm text-green-500 mt-0.5 italic" style={{ fontFamily: "'Lora', serif" }}>
            {posts.length} guide{posts.length !== 1 ? "s" : ""} published
          </p>
        </div>
        <button onClick={onCreate} className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm">
          <span className="text-base leading-none">+</span> Create Post
        </button>
      </div>

      <div className="relative z-10 p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {posts.length === 0 && (
          <div className="col-span-full text-center py-20 text-green-400">
            <div className="text-4xl mb-3">🌿</div>
            <p className="text-sm italic">No posts yet. Create the first one!</p>
          </div>
        )}
        {posts.map((p) => <PostCard key={p.id} post={p} onEdit={onEdit} onDelete={onDelete} />)}
      </div>
    </div>
  );
}
