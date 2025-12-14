import { showLoading, hideLoading } from "../utils/loading";
import authorizedAxiosInstance from "../utils/authorizedAxios";
import { toast } from "../components/common/toast";
const BASE_URL = import.meta.env.VITE_API_URL;

export const handleLogoutAPI = async () => {
  try {
    showLoading();

    const access_token = localStorage.getItem("access_token");
    if (access_token) {
      await axios.delete(`${BASE_URL}/auth/logout`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
    }
  } catch (e) {
    console.error(e);
  } finally {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    setTimeout(() => {
      hideLoading();
      location.href = "/";
    }, 500);
  }
};

export const refreshTokenAPI = async (refreshToken) => {
  const url = `${BASE_URL}/auth/refresh-token`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }

  // data nên là { access_token, refresh_token } (hoặc tuỳ backend)
  return data;
};
