export const handleLogoutAPI = async () => {
  try {
    showLoading();
    await authorizedAxiosInstance.delete(`${BASE_URL}/auth/logout`); // hoặc delete tuỳ backend
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
  return await axios.post(`${BASE_URL}/auth/refresh-token`, {
    refreshToken,
  });
};
