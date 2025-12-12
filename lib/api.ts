// API Service for making authenticated requests

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"
const TOKEN_STORAGE_KEY = "auth-token"

interface ApiError {
  message: string
  status: number
}

interface ApiResponse<T> {
  data: T | null
  error: ApiError | null
}

// Get token from localStorage
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

// Set token to localStorage
export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

// Remove token from localStorage
export function removeAuthToken(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!getAuthToken()
}

// Generic fetch wrapper with authentication
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = getAuthToken();
  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    // فقط اگر FormData نباشه، JSON بذار
    ...(!isFormData && { "Content-Type": "application/json" }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  // اگر FormData باشه، Content-Type رو کامل حذف کن
  if (isFormData) {
    delete (headers as any)["Content-Type"];
  }

  // بقیه کد مثل قبل...
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) removeAuthToken();
      const errorData = await response.json().catch(() => ({}));
      return {
        data: null,
        error: { message: errorData.message || errorData.detail || "Request failed", status: response.status },
      };
    }

    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const data = await response.json();
      return { data, error: null };
    }
    return { data: null as T, error: null };
  } catch (error) {
    return {
      data: null,
      error: { message: error instanceof Error ? error.message : "Network error", status: 0 },
    };
  }
}

// API GET method
export function apiGet<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiFetch<T>(endpoint, { method: "GET" })
}


// API PUT method
export function apiPut<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
  return apiFetch<T>(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  })
}

// API PATCH method
// API POST method — حالا هم JSON و هم FormData رو پشتیبانی می‌کنه
export async function apiPost<T>(
  endpoint: string,
  body?: unknown,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const isFormData = body instanceof FormData;

  const headers: HeadersInit = {
    // فقط اگر JSON باشه Content-Type رو بذار
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...options.headers,
  };

  return apiFetch<T>(endpoint, {
    method: "POST",
    body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
    headers,
    ...options,
  });
}

// API PATCH method — برای آپدیت هم همین مشکل بود
export async function apiPatch<T>(
  endpoint: string,
  body?: unknown,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const isFormData = body instanceof FormData;

  const headers: HeadersInit = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...options.headers,
  };

  return apiFetch<T>(endpoint, {
    method: "PATCH",
    body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
    headers,
    ...options,
  });
}

// API DELETE method
export function apiDelete<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiFetch<T>(endpoint, { method: "DELETE" })
}

// API object for convenience
export const api = {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  patch: apiPatch,
  delete: apiDelete,
}

// SWR fetcher with authentication
export async function swrFetcher<T>(url: string): Promise<T> {
  const response = await apiGet<T>(url)
  if (response.error) {
    throw new Error(response.error.message)
  }
  return response.data as T
}
