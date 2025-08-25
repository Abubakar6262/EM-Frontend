import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

let isRefreshing = false;

// Each queued request will either resolve (retry) or reject (fail)
interface FailedRequest {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
}

let failedQueue: FailedRequest[] = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      p.resolve(token);
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & {
      _retry?: boolean;
      headers?: Record<string, string>;
    };

    // Skip refresh logic for login/signup
    if (original.headers?.["x-skip-refresh"]) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(original))
          .catch((err) => Promise.reject(err));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        await api.get("/auth/refresh");
        processQueue(null);
        return api(original);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
