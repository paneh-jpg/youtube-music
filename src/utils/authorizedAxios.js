import axios from "axios";
import { toast } from "../components/common/toast";
import { handleLogoutAPI, refreshTokenAPI } from "../api/authApi";

let axiosInstance = axios.create();

axiosInstance.defaults.timeout = 1000 * 60 * 10;

/**
 * Cấu hình Interceptors (vào giữa mọi request & response)
 * Docs:  https://axios-http.com/docs/interceptors
 * http-status-code: https://www.npmjs.com/package/http-status-codes
 */

axiosInstance.interceptors.request.use(
  (config) => {
    // Lấy access_token từ localStorage và đính kèm vào header
    const access_token = localStorage.getItem("access_token");

    if (access_token) {
      // "Bearer": Tuân thủ theo tiêu chuẩn OAuth 2.0 trong việc xác định loại token đang sử dụng

      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

let refreshTokenPromise = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (originalRequest?.url?.includes("/auth/refresh-token")) {
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

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken.access_token}`;

        return axiosInstance(originalRequest);
      } catch (e) {
        await handleLogoutAPI();
        return Promise.reject(e);
      }
    }

    toast.error(error.response?.data?.message || error?.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
