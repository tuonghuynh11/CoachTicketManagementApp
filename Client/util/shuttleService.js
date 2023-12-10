import axios from "axios";

const baseURL = "https://coach-ticket-management-api.onrender.com";

const shuttleService = axios.create({
  baseURL,
});

shuttleService.interceptors.request.use(
  async (config) => {
    const token = "";
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getAllShuttles = async () => {
  try {
    const response = await coachService.get("/api/shuttles");
    return response.data;
  } catch (error) {
    console.error("Error fetching shuttles:", error);
    throw error;
  }
};

export const createShuttle = async (newShuttleData) => {
  try {
    const response = await shuttleService.post("/api/shuttles", newShuttleData);
    return response.data;
  } catch (error) {
    console.error("Error creating shuttle:", error);
    throw error;
  }
};

export const updateShuttle = async (shuttleId, updatedShuttleData) => {
  try {
    const response = await shuttleService.patch(
      `/api/shuttles/${shuttleId}`,
      updatedShuttleData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating shuttle:", error);
    throw error;
  }
};

export const deleteShuttle = async (shuttleId) => {
  try {
    const response = await shuttleService.delete(`/api/shuttles/${shuttleId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting shuttle:", error);
    throw error;
  }
};
