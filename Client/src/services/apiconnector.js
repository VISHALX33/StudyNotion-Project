import axios from "axios";

export const axiosInstance = axios.create({
  withCredentials: true,
});

// Response interceptor (token expiry)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const message = error.response?.data?.message || "";

      if (message.includes("expired") || message.includes("invalid")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const apiConnector = (
  method,
  url,
  bodyData = null,
  headers = {},
  params = null
) => {
  const token = localStorage.getItem("token");

  // 🛑 HARD GUARD
  if (!url || url.includes("undefined")) {
    throw new Error(`❌ Invalid API URL: ${url}`);
  }

  const finalHeaders = {
    ...headers,
  };

  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  return axiosInstance({
    method,
    url,               // ✅ FULL URL ONLY
    data: bodyData,
    headers: finalHeaders,
    params,
  });
};
