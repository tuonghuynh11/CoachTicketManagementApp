import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const baseURL = "https://coach-ticket-management-api.onrender.com";

const serviceService = axios.create({
  baseURL,
});

serviceService.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getAllServices = async () => {
  try {
    const response = await coachService.get("/api/services");
    return response.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

export const createService = async (newServiceData) => {
  try {
    const response = await serviceService.post("/api/services", newServiceData);
    return response.data;
  } catch (error) {
    console.error("Error creating service:", error);
    throw error;
  }
};

export const updateService = async (serviceId, updatedServiceData) => {
  try {
    const response = await serviceService.patch(
      `/api/services/${serviceId}`,
      updatedServiceData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating service:", error);
    throw error;
  }
};

export const deleteService = async (serviceId) => {
  try {
    const response = await serviceService.delete(`/api/services/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting service:", error);
    throw error;
  }
};
