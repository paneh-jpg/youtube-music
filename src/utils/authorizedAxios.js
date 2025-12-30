import axios from "axios";
import { toast } from "../components/common/Toast.js";
import { handleLogoutAPI, refreshTokenAPI } from "../api/authApi.js";

let axiosInstance = axios.create();

axiosInstance.defaults.timeout = 1000 * 60 * 10;

/**
 * Cấu hình Interceptors (vào giữa mọi request & response)
 * Docs:  https://axios-http.com/docs/interceptors
 * http-status-code: https://www.npmjs.com/package/http-status-codes
 */

axiosInstance.interceptors.request.use(
  (config) => {
    const access_token = localStorage.getItem("access_token");

    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let refreshTokenPromise = null;
let isLoggingOut = false;

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (originalRequest?.url?.includes("/auth/refresh-token")) {
      if (!isLoggingOut) {
        isLoggingOut = true;
        await handleLogoutAPI();
      }
      return Promise.reject(error);
    }

    if (
      (status === 401 || status === 410) &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (!refreshTokenPromise) {
        const refreshToken = localStorage.getItem("refresh_token");
        refreshTokenPromise = refreshTokenAPI(refreshToken)
          .then((newToken) => {
            localStorage.setItem("access_token", newToken.access_token);
            localStorage.setItem("refresh_token", newToken.refresh_token);
            return newToken;
          })
          .finally(() => {
            refreshTokenPromise = null;
          });
      }

      try {
        const newToken = await refreshTokenPromise;

        originalRequest.headers.Authorization = `Bearer ${newToken.access_token}`;
        return axiosInstance(originalRequest);
      } catch (e) {
        if (!isLoggingOut) {
          isLoggingOut = true;
          await handleLogoutAPI();
        }
        return Promise.reject(e);
      }
    }

    // ❗ Chỉ toast khi không phải case refresh
    toast.error(error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
