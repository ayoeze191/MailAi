import axios from "axios";
// const isDev = process.env.NODE_ENV === "development";
const isDev = true;

const axiosInstance = axios.create({
  baseURL: isDev ? "" : process.env.NEXT_PUBLIC_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`Request sent to ${config.url}`);
    }

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const addedToken = config.headers.Authorization;

      if (token && !addedToken) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error?.response?.data?.statusCode === 401 &&
      error?.response?.data?.data?.message === "Access denied"
    ) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
