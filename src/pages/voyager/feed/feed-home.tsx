import { useEffect, useState } from 'react';
import FeedCard from './feed-card';
import { postService } from '@/services/postService';
import type { Post } from '@/pages/guide/types/types';
import { useNavigate } from 'react-router-dom';

export default function FeedHome() {
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resp = await postService.getPaginatedPosts(1, 9);
        if (!mounted) return;
        setItems(resp.data || []);
      } catch (err) {
        console.warn('Failed to load feed posts', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="p-6">Loading feed…</div>;

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.length === 0 && (
        <div className="col-span-full text-center text-gray-500 py-12">No posts yet.</div>
      )}
      {items.map((p) => (
        <FeedCard key={p.id} item={{
          id: p.id,
          title: p.title,
          content: p.content,
          imgLink: p.imgLink,
          tag: undefined,
          emoji: undefined,
          locationName: undefined,
          userName: undefined,
        }} onClick={() => navigate(`/voyager/feed/${p.id}`)} />
      ))}
    </div>
  );
}