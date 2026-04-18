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
  // Admin only
  getAllAdmin: async () => {
    const response = await api.get("/reviews/admin/all");
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },
};

// Notification Services
export const notificationService = {
  getAll: async () => {
    const response = await api.get("/notifications");
    return response.data;
  },
  markAsRead: async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },
  markAllAsRead: async () => {
    const response = await api.patch("/notifications/mark-all-read");
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },
};

// Category Services
export const categoryService = {
  getAll: async () => {
    const response = await api.get("/categories");
    return response.data;
  },
  getOne: async (slug) => {
    const response = await api.get(`/categories/${slug}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post("/categories", data);
    return response.data;
  },
  update: async (slug, data) => {
    const response = await api.put(`/categories/${slug}`, data);
    return response.data;
  },
  delete: async (slug) => {
    const response = await api.delete(`/categories/${slug}`);
    return response.data;
  },
};

// Blog Services
export const blogService = {
  getAll: async (params) => {
    const response = await api.get("/blogs", { params });
    return response.data;
  },
  getOne: async (slug) => {
    const response = await api.get(`/blogs/${slug}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post("/blogs", data);
    return response.data;
  },
  update: async (slug, data) => {
    const response = await api.put(`/blogs/${slug}`, data);
    return response.data;
  },
  delete: async (slug) => {
    const response = await api.delete(`/blogs/${slug}`);
    return response.data;
  },
};

// Setting Services
export const settingService = {
  getAll: async () => {
    const response = await api.get("/settings");
    return response.data;
  },
  getOne: async (key) => {
    const response = await api.get(`/settings/${key}`);
    return response.data;
  },
  upsert: async (data) => {
    const response = await api.post("/settings", data);
    return response.data;
  },
};

export default api;
