export type JsonInit = RequestInit & { json?: unknown };
export type MultipartInit = RequestInit & { formData: FormData };

const defaultHeaders: HeadersInit = {
  "Content-Type": "application/json",
};

function buildInit(init?: JsonInit): RequestInit {
  const { json, headers, ...rest } = init ?? {};
  const body = json !== undefined ? JSON.stringify(json) : rest.body;
  return {
    credentials: "include",
    headers: { ...defaultHeaders, ...(headers || {}) },
    ...rest,
    ...(body !== undefined ? { body } : {}),
  } satisfies RequestInit;
}

function buildMultipartInit(init: MultipartInit): RequestInit {
  const { formData, headers, ...rest } = init;
  // fetch에 FormData를 주면 브라우저가 boundary 포함 Content-Type을 자동 설정
  const { ["Content-Type"]: _omit, ...restHeaders } = (headers || {}) as Record<
    string,
    string
  >;
  return {
    credentials: "include",
    headers: { ...(restHeaders || {}) },
    body: formData,
    ...rest,
  } satisfies RequestInit;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`);
  }
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }
  return (await res.text()) as unknown as T;
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, buildInit(init));
  return handleResponse<T>(res);
}

export async function apiPost<T>(path: string, init?: JsonInit): Promise<T> {
  const res = await fetch(`/api${path}`, { method: "POST", ...buildInit(init) });
  return handleResponse<T>(res);
}

export async function apiPut<T>(path: string, init?: JsonInit): Promise<T> {
  const res = await fetch(`/api${path}`, { method: "PUT", ...buildInit(init) });
  return handleResponse<T>(res);
}

export async function apiDelete<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, { method: "DELETE", ...buildInit(init) });
  return handleResponse<T>(res);
}

export async function apiPostMultipart<T>(path: string, init: MultipartInit): Promise<T> {
  const res = await fetch(`/api${path}`, { method: "POST", ...buildMultipartInit(init) });
  return handleResponse<T>(res);
}

export async function apiPutMultipart<T>(path: string, init: MultipartInit): Promise<T> {
  const res = await fetch(`/api${path}`, { method: "PUT", ...buildMultipartInit(init) });
  return handleResponse<T>(res);
}
