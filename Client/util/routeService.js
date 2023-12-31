import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const baseURL = "https://coach-ticket-management-api.onrender.com";

const routeService = axios.create({
  baseURL,
});

routeService.interceptors.request.use(
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

export const getAllRoutes = async () => {
  try {
    const response = await routeService.get("/api/routes?limit=30");
    return response.data;
  } catch (error) {
    console.error("Error fetching routes:", error);
    throw error;
  }
};

export const getAllRoutesId = async (routeID) => {
  try {
    const response = await routeService.get(`/api/routes?id=${routeID}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching routes:", error);
    throw error;
  }
};

export const createRoute = async (newRouteData) => {
  try {
    const response = await routeService.post("/api/routes", newRouteData);
    return response.data;
  } catch (error) {
    console.error("Error creating route:", error);
    throw error;
  }
};

export const updateRoute = async (routeId, updatedRouteData) => {
  try {
    const response = await routeService.patch(
      `/api/routes/${routeId}`,
      updatedRouteData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating route:", error);
    throw error;
  }
};

export const deleteRoute = async (routeId) => {
  try {
    console.log(routeId);
    const response = await routeService.delete(`/api/routes/${routeId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting route:", error);
    throw error;
  }
};

export const patchRoute = async (routeId, updatedRouteData) => {
  try {
    const response = await routeService.patch(
      `/api/routes/${routeId}`,
      updatedRouteData
    );
    return response.data;
  } catch (error) {
    console.error("Error patching route:", error);
    throw error;
  }
};
