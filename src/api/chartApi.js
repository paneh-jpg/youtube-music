import axiosInstance from "../utils/authorizedAxios";

const BASE_URL = import.meta.env.VITE_API_URL;

// Danh sách quốc gia
export async function getCountries() {
  return await axiosInstance.get(`${BASE_URL}/charts/countries`);
}

// BXH Nghệ sĩ
export async function getTopArtists(countryCode) {
  return await axiosInstance.get(
    `${BASE_URL}/charts/top-artists?country=${countryCode}`
  );
}

// BXH Video
export async function getTopVideos(countryCode) {
  return await axiosInstance.get(
    `${BASE_URL}/charts/videos?country=${countryCode}`
  );
}
