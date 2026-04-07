import axios from "axios";
import Cookies from "js-cookie";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://c4r-platform-backend.vercel.app/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized (optional: automatic logout)
    if (error.response && error.response.status === 401) {
      // dispatch logout action if needed or just reject
    }
    return Promise.reject(error);
  },
);

// Auth Services
export const authService = {
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },
  forgotPassword: async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },
  resetPassword: async (token, newPassword) => {
    const response = await api.post("/auth/reset-password", {
      token,
      newPassword,
    });
    return response.data;
  },
  changePassword: async (passwords) => {
    const response = await api.put("/auth/change-password", passwords);
    return response.data;
  },
  logout: async () => {
    const response = await api.get("/auth/logout");
    return response.data;
  },
};

// User Services
export const userService = {
  getAll: async (params) => {
    const response = await api.get("/users", { params });
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get("/users/profile");
    return response.data;
  },
  updateProfile: async (userData) => {
    const response = await api.put("/users/profile", userData);
    return response.data;
  },
};

// Booking Services (for Dashboard)
export const bookingService = {
  create: async (bookingData) => {
    const response = await api.post("/bookings", bookingData);
    return response.data;
  },
  getAll: async (params) => {
    const response = await api.get("/bookings", { params });
    return response.data;
  },
  getOne: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },
  approve: async (id) => {
    const response = await api.patch(`/bookings/${id}/approve`);
    return response.data;
  },
  reject: async (id) => {
    const response = await api.patch(`/bookings/${id}/reject`);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },
};

// Car Services (for Admin Dashboard)
export const carService = {
  getAll: async (params) => {
    const response = await api.get("/cars", { params });
    return response.data;
  },
  getOne: async (id) => {
    const response = await api.get(`/cars/${id}`);
    return response.data;
  },
  create: async (carData) => {
    const response = await api.post("/cars", carData);
    return response.data;
  },
  update: async (id, carData) => {
    const response = await api.put(`/cars/${id}`, carData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/cars/${id}`);
    return response.data;
  },
};

// Review Services
export const reviewService = {
  create: async (reviewData) => {
    const response = await api.post("/reviews", reviewData);
    return response.data;
  },
  getAllCarReviews: async (carId) => {
    const response = await api.get(`/reviews/car/${carId}`);
    return response.data;
  },
  getUserReviews: async () => {
    const response = await api.get("/reviews/user");
    return response.data;
  },
  getRecent: async () => {
    const response = await api.get("/reviews/recent");
    return response.data;
  },
  // Admin only - ideally this endpoint should exist, or we filter by admin
  getAllAdmin: async () => {
    // Assuming backend endpoint exists or we use a general one.
    // Based on reviewController, there isn't a "get ALL reviews" for admin yet.
    // I will use `getCarReviews` loop or add a new endpoint later.
    // BUT for now, let's assume I'll add `getAllReviews` to controller or use a placeholder.
    // Let's stick to what's safer: I'll add it to the backend controller in a moment.
    const response = await api.get("/reviews/admin/all");
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },
};

export default api;
