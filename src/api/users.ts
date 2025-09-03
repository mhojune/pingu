import { apiGet, apiPost, apiPut, apiDelete } from "./client";
import type { PageResultDTO, UserDTO } from "./types";

export type GetUsersQuery = {
  page?: number;
  size?: number;
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

export async function getUsers(query: GetUsersQuery = {}) {
  const qs = toQueryString(query);
  return apiGet<PageResultDTO<UserDTO>>(`/users${qs}`);
}

export async function createUser(user: UserDTO) {
  return apiPost<number>("/users", { json: user });
}

export async function getUserById(userId: number) {
  return apiGet<UserDTO>(`/users/${userId}`);
}

export async function updateUser(userId: number, user: UserDTO) {
  return apiPut<void>(`/users/${userId}`, { json: user });
}

export async function deleteUser(userId: number) {
  return apiDelete<void>(`/users/${userId}`);
}
