import { apiGet, apiPost, apiPut, apiDelete } from "./client";
import type { FriendshipRequestDTO, FriendshipResponseDTO } from "./types";

export async function createFriendshipRequest(request: FriendshipRequestDTO) {
  return apiPost<number>("/friendships", { json: request });
}

export async function acceptFriendshipRequest(request: FriendshipRequestDTO) {
  return apiPut<number>("/friendships", { json: request });
}

export async function deleteFriendship(requesterId: number, receiverId: number) {
  return apiDelete<number>(`/friendships/${requesterId}/${receiverId}`);
}

export async function getAcceptedFriends(userId: number) {
  return apiGet<FriendshipResponseDTO[]>(`/friendships/accepted/${userId}`);
}

export async function getReceivedFriendshipRequests(userId: number) {
  return apiGet<FriendshipResponseDTO[]>(`/friendships/received-requests/${userId}`);
}

export async function getSentFriendshipRequests(userId: number) {
  return apiGet<FriendshipResponseDTO[]>(`/friendships/sent-requests/${userId}`);
}
