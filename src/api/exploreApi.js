import authorizedAxiosInstance from "../utils/authorizedAxios";
const BASE_URL = import.meta.env.VITE_API_URL;

export const getNewestAlbumList = async (limit) => {
  return await authorizedAxiosInstance.get(`${BASE_URL}/explore/albums`, {
    params: { limit },
  });
};

export const getNewestVideoList = async (limit) => {
  return await authorizedAxiosInstance.get(`${BASE_URL}/explore/videos`, {
    params: { limit },
  });
};

export const getMetaList = async (limit) => {
  return await authorizedAxiosInstance.get(`${BASE_URL}/explore/meta`, {
    params: { limit },
  });
};
