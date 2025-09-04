import { apiPost } from "./client";

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  message?: string;
  userId?: number;
};

export type LogoutResponse = {
  success: boolean;
  message?: string;
};

/**
 * 사용자 로그인
 * @param credentials 로그인 정보 (username, password)
 * @returns 로그인 성공 시 사용자 ID (number), 200 OK
 * @throws 401 Unauthorized - 로그인 실패 시
 */
export async function login(credentials: LoginRequest): Promise<number> {
  return apiPost<number>("/login", { json: credentials });
}

/**
 * 사용자 로그아웃
 * @returns 로그아웃 성공 시 세션 해제, 200 OK
 */
export async function logout(): Promise<LogoutResponse> {
  return apiPost<LogoutResponse>("/logout");
}
