import authorizedAxiosInstance from "../utils/authorizedAxios";
const BASE_URL = import.meta.env.VITE_API_URL;

export const getProfileApi = async () => {
  return await authorizedAxiosInstance.get(`${BASE_URL}/auth/me`);
};

export const updateProfileApi = async ({ name, email }) => {
  return await authorizedAxiosInstance.patch(`${BASE_URL}/auth/me`, {
    name,
    email,
  });
};

export const changePasswordApi = async ({
  oldPassword,
  password,
  confirmPassword,
}) => {
  return await authorizedAxiosInstance.patch(
    `${BASE_URL}/auth/change-password`,
    {
      oldPassword,
      password,
      confirmPassword,
    }
  );
};
