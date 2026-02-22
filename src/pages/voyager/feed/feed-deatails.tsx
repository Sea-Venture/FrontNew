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

  if (loading) return <div className="p-6">Loading post…</div>;
  if (!post) return <div className="p-6">Post not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button className="mb-4 text-sm text-blue-600" onClick={() => navigate(-1)}>← Back</button>
      <article className="bg-white rounded-2xl overflow-hidden shadow-md border">
        {post.imgLink && (
          <div className="h-64 w-full overflow-hidden">
            <img src={post.imgLink} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-green-900 mb-2">{post.title}</h1>
          <div className="text-sm text-gray-500 mb-4">{new Date(post.createdAt).toLocaleString()}</div>
          <p className="text-gray-800 leading-relaxed mb-4">{post.content}</p>
          <div className="flex gap-4 text-sm text-gray-600">
            <div>Author: {userName ?? 'Unknown'}</div>
            <div>Location: {locationName ?? 'Unknown'}</div>
          </div>
        </div>
      </article>
    </div>
  );
}
