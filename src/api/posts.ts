import { apiGet, apiPostMultipart, apiPutMultipart, apiDelete } from "./client";
import type { PageResultDTO, PostResponseDTO } from "./types";

export type GetPostsQuery = {
  userId?: number | string;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: "ASC" | "DESC";
};

function toQueryString(query: Record<string, unknown>): string {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    params.set(key, String(value));
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function getPosts(query: GetPostsQuery = {}) {
  const qs = toQueryString(query);
  return apiGet<PageResultDTO<PostResponseDTO>>(`/posts${qs}`);
}

export type GetNearPostsQuery = {
  longitude: number;
  latitude: number;
  distance: number;
};

export async function getNearPosts(query: GetNearPostsQuery) {
  const qs = toQueryString(query);
  return apiGet<PostResponseDTO[]>(`/posts/near${qs}`);
}

export async function getPostById(postId: number | string, opts?: { count?: boolean }) {
  const qs = toQueryString({ count: opts?.count });
  return apiGet<PostResponseDTO>(`/posts/${postId}${qs}`);
}

export async function createPost(form: FormData) {
  // form에는 PostRequestDTO 필드와 files[]가 포함되어야 함
  return apiPostMultipart<number>(`/posts`, { formData: form });
}

export async function updatePost(postId: number | string, form: FormData) {
  return apiPutMultipart<number>(`/posts/${postId}`, { formData: form });
}

export async function deletePost(postId: number | string) {
  return apiDelete<number>(`/posts/${postId}`);
}
