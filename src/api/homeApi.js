import axiosInstance from "../utils/authorizedAxios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getMoods = async () => {
  return await axiosInstance.get(`${BASE_URL}/moods`);
};

export const getMoodBySlug = async (slug) => {
  return await axiosInstance.get(`${BASE_URL}/moods/${slug}`);
};

export const getAlbumsForYou = async () => {
  return await axiosInstance.get(`${BASE_URL}/home/albums-for-you`);
};

export const getTodayHits = async () => {
  return await axiosInstance.get(`${BASE_URL}/home/todays-hits`);
};

export const getPlaylistByCountry = async (country) => {
  return await axiosInstance.get(
    `${BASE_URL}/playlists/by-country?country=${country}`
  );
};

export const getQuickPick = async () => {
  return await axiosInstance.get(`${BASE_URL}/quick-picks`);
};

// Gợi ý cá nhân hóa
export const getPersonalized = async () => {
  return await axiosInstance.get(`${BASE_URL}/home/personalized`);
};

// Chi tiết playlist: ${BASE_URL}/playlists/details/:slug
export const getPLaylistBySlug = async (slug) => {
  return await axiosInstance.get(`${BASE_URL}/playlists/details/${slug}`);
};
