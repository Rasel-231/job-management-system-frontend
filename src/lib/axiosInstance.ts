"use client";

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { toast } from "react-toastify";

// CLIENT-SIDE HTTP client. Used inside Client Components for mutations
// (create/update/delete, form submits) and any refetch-after-action.
// Talks to the backend with the browser-managed accessToken cookie +
// automatic silent refresh on 401. Server Components never import this —
// they use lib/serverFetch.ts instead.
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // sends httpOnly accessToken/refreshToken cookies automatically
});

let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (error: unknown) => void }[] = [];

const processQueue = (error: unknown, success = false) => {
  failedQueue.forEach(({ resolve, reject }) => (success ? resolve(null) : reject(error)));
  failedQueue = [];
};

// The refreshToken cookie is httpOnly so JS can never see it via
// document.cookie. Instead we use the non-httpOnly `role` cookie — it is set
// and cleared together with the tokens — as a reliable "live session" marker.
// If the browser has no session at all there is nothing to refresh — skip the
// silent-refresh + redirect path entirely so the AuthRehydrator's /auth/me 401
// just resolves to "logged out" instead of sending the page into an endless
// reload loop.
const hasSessionCookie = (): boolean => {
  if (typeof document === "undefined") return false;
  return new RegExp("(?:^|; )role=[^;]").test(document.cookie);
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    const isAuthEndpoint =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/refresh-token");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint &&
      hasSessionCookie()
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(axiosInstance(originalRequest)),
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axiosInstance.post("/auth/refresh-token");
        processQueue(null, true);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, false);
        toast.error("Session expired. Please log in again.");
        // Single redirect — never reload the current URL. Guarded so a dead
        // refreshToken can't bounce /login into itself in an endless loop.
        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          const loginUrl = `/login${window.location.pathname !== "/" ? `?redirectTo=${encodeURIComponent(window.location.pathname)}` : ""}`;
          window.location.replace(loginUrl);
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 403) {
      toast.error("You don't have permission for this action");
    } else if (error.response?.status !== 401) {
      const message = error.response?.data?.message || error.message || "Something went wrong";
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
