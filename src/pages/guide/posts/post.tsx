import { useState, useEffect, useCallback } from "react";
import type { Post } from "../types/types";
import PostForm from "./PostForm";
import PostList from "./PostList";
import { postService } from "@/services/postService";


type Page = { view: "list" } | { view: "create" } | { view: "edit"; post: Post };

export default function PostContainer() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<Page>({ view: "list" });
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  const fetchPage = useCallback(async (p = pageNumber, l = limit) => {
    try {
      const resp = await postService.getPaginatedPosts(p, l);
      setPosts(resp.data || []);
      setTotal(resp.total || 0);
      setPageNumber(resp.page || p);
      setLimit(resp.limit || l);
    } catch (err) {
      console.warn('Could not load paginated posts from API', err);
    }
  }, [pageNumber, limit]);

  useEffect(() => {
    let mounted = true;
    if (!mounted) return;
    fetchPage();
    return () => { mounted = false; };
  }, [fetchPage]);

  const handleCreate = async (data: Omit<Post, "id" | "userId">) => {
    try {
      const created = await postService.createPost(data as Partial<Post>);
      // refresh current page after creating
      await fetchPage();
      setPage({ view: "list" });
    } catch (err) {
      console.error('Failed to create post', err);
    }
  };

  const handleUpdate = async (data: Omit<Post, "id" | "userId">) => {
    if (page.view !== "edit") return;
    try {
      const updated = await postService.updatePost(page.post.id, data as Partial<Post>);
      await fetchPage();
      setPage({ view: "list" });
    } catch (err) {
      console.error('Failed to update post', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await postService.deletePost(id);
      await fetchPage();
    } catch (err) {
      console.error('Failed to delete post', err);
    }
  };

  if (page.view === "create")
    return <PostForm mode="create" onSave={handleCreate} onCancel={() => setPage({ view: "list" })} />;

  if (page.view === "edit")
    return <PostForm mode="edit" initial={page.post} onSave={handleUpdate} onCancel={() => setPage({ view: "list" })} />;

  return (
    <>
      <PostList posts={posts} onCreate={() => setPage({ view: "create" })} onEdit={(post) => setPage({ view: "edit", post })} onDelete={handleDelete} />
      <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
        <div className="text-sm text-green-600">Showing page {pageNumber} — {posts.length} items — total {total}</div>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded bg-gray-100" onClick={() => { if (pageNumber > 1) { setPageNumber((n) => n - 1); fetchPage(pageNumber - 1, limit); } }}>Previous</button>
          <button className="px-3 py-1 rounded bg-gray-100" onClick={() => { const next = pageNumber + 1; const maxPage = Math.max(1, Math.ceil(total / Math.max(1, limit))); if (next <= maxPage) { setPageNumber(next); fetchPage(next, limit); } }}>Next</button>
        </div>
      </div>
    </>
  );
}
