import axios from "axios";
import { toast } from "../components/common/toast";
import { handleLogoutAPI, refreshTokenAPI } from "../api/authApi";

// Khởi tạo 1 đối tượng Axios để custom và cấu hình chung cho dự án
let authorizedAxiosInstance = axios.create();

// Thời gian chờ tối đa của 1 request: 10p
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10;

/**
 * Cấu hình Interceptors (vào giữa mọi request & response)
 * Docs:  https://axios-http.com/docs/interceptors
 * http-status-code: https://www.npmjs.com/package/http-status-codes
 */

// Add a request interceptor: Can thiệp vào giữa các request API
authorizedAxiosInstance.interceptors.request.use(
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
// Add a response interceptor: Can thiệp vào giữa những gì response nhận về từ API
authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Mọi mã http status code nằm trong khoảng 200 - 290 sẽ là success và rơi vào luồng này
    // Do something with response data

    return response;
  },
  (error) => {
    // Any status codes that falls OUTSIDE the range of 2xx cause this function to trigger
    // Mọi mã http status code nằm ngoài khoảng 200 - 290 sẽ là error và rơi vào luồng này
    // Do something with response error

    /**Xử lý Refresh Token tự động
     * - Nếu nhân status code 401 , gọi API refresh-token hoặc logout() (Tùy vào requirements)
     * - Ở dự án này sẽ gọi API để refresh-token
     */

    /* Nếu nhận status code 410 (Khi access_token hết hạn), gọi API refresh-token
     * Lấy  request API đang bị lỗi thông qua error.config
     */
    const originalRequest = error.config;

    if (
      (error.response?.status === 410 && originalRequest) ||
      error.response?.status === 401
    ) {
      if (!refreshTokenPromise) {
        // Lấy refresh-token từ local
        const refreshToken = localStorage.getItem("refresh_token");
        refreshTokenPromise = refreshTokenAPI(refreshToken)
          .then((res) => {
            const newToken = res.data;
            console.log(newToken);

            localStorage.setItem("access_token", newToken.access_token);
            localStorage.setItem("refresh_token", newToken.refresh_token);

            authorizedAxiosInstance.defaults.headers.Authorization = `Bearer ${newToken.access_token}`;
          })
          .catch((_error) => {
            handleLogoutAPI().then(() => {
              location.href = "/";
            });

            return Promise.reject(_error);
          })
          .finally(() => {
            refreshTokenPromise = null;
          });
      }

      // Cuối cùng mới return refreshTokenPromise trong trường hợp success ở đây
      return refreshTokenPromise.then(() => {
        return authorizedAxiosInstance(originalRequest);
      });
    }

    // Xử lý tập trung phần hiển thị thông báo lỗi trả về từ mọi API ở đây (Viết 1 lần và xử lý tập trung)
    // console.log error ra là sẽ thấy cấu trúc data dẫn tới message lỗi như phía dưới
    // Dùng toast để hiển thị bất kể mọi mã lỗi lên màn hình (Ngoại trừ mã 410 -GONE phục vụ việc tự động refresh lại token)
    if (error.response?.status !== 410) {
      toast.error(error.response?.data?.message || error?.message);
      handleLogoutAPI();
    }

    return Promise.reject(error);
  }
);

export default authorizedAxiosInstance;
