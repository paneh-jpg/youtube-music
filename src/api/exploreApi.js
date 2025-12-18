import axiosInstance from "../utils/authorizedAxios.js";

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

// Chi tiết dòng nhạc:  ${BASE_URL}/lines/:slug
export const getLineBySlug = async (slug) => {
  return await axiosInstance.get(`${BASE_URL}/lines/${slug}`);
};

//Lấy danh sách bài hát theo dòng
export const getSongsByLineSlug = async (slug) => {
  return await axiosInstance.get(`${BASE_URL}/lines/${slug}/songs`);
};

//Lấy playlist nổi bật theo dòng nhạc
export const getPlaylistsByLineSlug = async (slug) => {
  return await axiosInstance.get(`${BASE_URL}/lines/${slug}/playlists`);
};

// Lấy album theo dòng nhạc
export const getAlbumsByLineSlug = async (slug) => {
  return await axiosInstance.get(`${BASE_URL}/lines/${slug}/albums`);
};

// Lấy video theo dòng nhạc
export const getVideosByLineSlug = async (slug) => {
  return await axiosInstance.get(`${BASE_URL}/lines/${slug}/videos`);
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

// Lấy bài hát theo Id
export const getSongById = async (id) => {
  return await axiosInstance.get(`${BASE_URL}/songs/details/${id}`);
};
