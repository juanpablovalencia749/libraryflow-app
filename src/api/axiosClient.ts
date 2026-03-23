import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/constants";

type RetryConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export type ApiError = {
  message: string;
  error: string;
  statusCode: number;
};

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const authClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (v?: unknown) => void;
  reject: (e: unknown) => void;
}> = [];

let refreshIntervalId: ReturnType<typeof setInterval> | null = null;

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

function requestUrl(config: { url?: string; baseURL?: string }): string {
  const path = config.url ?? "";
  if (path.startsWith("http")) return path;
  const base = config.baseURL ?? "";
  return `${base}${path}`;
}

function shouldSkipRefreshForUrl(url: string): boolean {
  return (
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/me") ||
    url.includes("/auth/refresh") ||
    url.includes("/auth/logout")
  );
}

async function getUserIdFromMe(): Promise<number | null> {
  try {
    const response = await authClient.get("/auth/me");
    const data = response.data;

    return data?.userId ?? data?.id ?? data?.sub ?? null;
  } catch {
    return null;
  }
}

async function refreshTokenWithUserId(): Promise<void> {
  const userId = await getUserIdFromMe();

  if (!userId) {
    throw new Error("No se pudo obtener userId desde /auth/me");
  }

  await authClient.post("/auth/refresh", { userId });
}

export function startAutoRefreshEvery12Minutes() {
  if (refreshIntervalId) return;

  refreshIntervalId = setInterval(
    async () => {
      try {
        await refreshTokenWithUserId();
        console.log("Token refreshed automatically");
      } catch (error) {
        console.log("Auto refresh failed", error);

        void Promise.all([import("@/store"), import("@/store/authSlice")]).then(
          ([{ store }, { logout }]) => {
            store.dispatch(logout());
          },
        );
      }
    },
    12 * 60 * 1000,
  );
}

export function stopAutoRefreshEvery12Minutes() {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId);
    refreshIntervalId = null;
  }
}

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const url = requestUrl(originalRequest);

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      shouldSkipRefreshForUrl(url)
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => axiosClient(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await refreshTokenWithUserId();
      processQueue(null);
      return axiosClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);

      void Promise.all([import("@/store"), import("@/store/authSlice")]).then(
        ([{ store }, { logout }]) => {
          store.dispatch(logout());
        },
      );

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
