import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

import { useAuthStore } from "@/store/auth-store";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5001";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

/**
 * Separate Axios instance for refreshing the access token.
 *
 * This prevents the refresh request itself from going
 * through the main interceptor.
 */
const refreshApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/**
 * Get the current access token.
 *
 * Zustand may still be hydrating when a request fires,
 * so localStorage is used as a fallback.
 */
function getAccessToken(): string | null {
  let accessToken =
    useAuthStore.getState().accessToken;

  if (
    !accessToken &&
    typeof window !== "undefined"
  ) {
    const storedAuth =
      localStorage.getItem("faultmart-auth");

    if (storedAuth) {
      try {
        const parsedAuth =
          JSON.parse(storedAuth);

        accessToken =
          parsedAuth?.state?.accessToken ?? null;
      } catch (error) {
        console.error(
          "Failed to parse faultmart-auth:",
          error
        );
      }
    }
  }

  return accessToken;
}

/**
 * Attach access token to protected requests.
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      config.headers.set(
        "Authorization",
        `Bearer ${accessToken}`
      );
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Refresh access token when a protected request
 * receives a 401 response.
 */
let refreshPromise: Promise<string> | null = null;

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest =
      error.config as
        | InternalAxiosRequestConfig
        | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const alreadyRetried =
      (originalRequest as any)._retry;

    const isRefreshRequest =
      originalRequest.url?.includes(
        "/api/auth/refresh"
      );

    if (
      error.response?.status !== 401 ||
      alreadyRetried ||
      isRefreshRequest
    ) {
      return Promise.reject(error);
    }

    (originalRequest as any)._retry = true;

    try {
      /**
       * If multiple requests fail simultaneously,
       * share one refresh request.
       */
      if (!refreshPromise) {
        refreshPromise =
          refreshApi
            .post("/api/auth/refresh")
            .then((response) => {
              const newAccessToken =
                response.data?.accessToken;

              if (!newAccessToken) {
                throw new Error(
                  "No access token returned from refresh."
                );
              }

              const currentAuth =
                useAuthStore.getState();

              if (currentAuth.user) {
                useAuthStore
                  .getState()
                  .setAuth(
                    currentAuth.user,
                    newAccessToken
                  );
              }

              return newAccessToken;
            })
            .finally(() => {
              refreshPromise = null;
            });
      }

      const newAccessToken =
        await refreshPromise;

      /**
       * Retry original request with
       * the fresh access token.
       */
      originalRequest.headers.set(
        "Authorization",
        `Bearer ${newAccessToken}`
      );

      return api(originalRequest);
    } catch (refreshError) {
      console.error(
        "TOKEN REFRESH FAILED:",
        refreshError
      );

      useAuthStore.getState().logout();

      return Promise.reject(refreshError);
    }
  }
);

export default api;