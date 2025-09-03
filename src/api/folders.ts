import { apiGet, apiPost, apiPut, apiDelete } from "./client";
import type { PostFolderDTO } from "./types";

export async function getUserFolders(userId: number) {
  return apiGet<PostFolderDTO[]>(`/folders/user/${userId}`);
}

export async function createFolder(folder: PostFolderDTO) {
  return apiPost<number>("/folders", { json: folder });
}

export async function updateFolder(folder: PostFolderDTO) {
  return apiPut<number>("/folders", { json: folder });
}

export async function deleteFolder(folderId: number) {
  return apiDelete<number>(`/folders/${folderId}`);
}
