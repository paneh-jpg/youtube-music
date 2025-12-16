import axiosInstance from "../utils/authorizedAxios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getNewestAlbumList = async (limit) => {
  return await axiosInstance.get(`${BASE_URL}/explore/albums`, {
    params: { limit },
  });
};

export const getNewestVideoList = async (limit) => {
  return await axiosInstance.get(`${BASE_URL}/explore/videos`, {
    params: { limit },
  });
};

export const getMetaList = async (limit) => {
  return await axiosInstance.get(`${BASE_URL}/explore/meta`, {
    params: { limit },
  });
};

//Chi tiết category: ${BASE_URL}/categories/:slug
export const getCategoryBySlug = async (slug) => {
  return await axiosInstance.get(`${BASE_URL}/categories/${slug}`);
};

// Chi tiết album: ${BASE_URL}/albums/details/:slug
export const getAlbumBySlug = async (slug) => {
  return await axiosInstance.get(`${BASE_URL}/albums/details/${slug}`);
};

// Chi tiết video: ${BASE_URL}/videos/details/:slug
export const getVideoBySlug = async (slug) => {
  return await axiosInstance.get(`${BASE_URL}/videos/details/${slug}`);
};

// Các bản phát hành mới
export const getNewsRelease = async () => {
  return await axiosInstance.get(`${BASE_URL}/explore/new-releases`);
};
