import axios from "axios";

const baseURL = "https://coach-ticket-management-api.onrender.com";

const userService = axios.create({
  baseURL,
});

userService.interceptors.request.use(
  async (config) => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwidXNlck5hbWUiOiJhZG1pbiIsInJvbGUiOnsiaWQiOiIzIiwicm9sZU5hbWUiOiJBZG1pbiJ9LCJpYXQiOjE3MDIyMTc3MTIsImV4cCI6MTcwMjIyMTMxMn0.uLsJQqGA1NWX8gonW7u1Z7Uglp560DKDYdNypeeB5dE";
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getAllUsers = async () => {
    try {
      const response = await userService.get("/api/users?roleId=2&roleId=1");
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  };
