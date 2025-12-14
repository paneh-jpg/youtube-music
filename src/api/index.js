import authorizedAxiosInstance from "../utils/authorizedAxios";
const BASE_URL = import.meta.env.VITE_API_URL;

export const getProfile = async () => {
  try {
    const response = await authorizedAxiosInstance.get(`${BASE_URL}/auth/me`);
    const userProfile = response.data;
  } catch (e) {
    console.error(e);
  }
};
