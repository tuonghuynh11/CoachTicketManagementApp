import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const baseURL = "http://dev.virtualearth.net/REST/v1/Locations";

const routeService = axios.create({
  baseURL,
});

export const getLocation = async (location) => {
  try {
    console.log(location);
    const response = await routeService.get(
      `?key=bL87M940PHGHkEzNpKCT~7l6e1ifOuzSkJb-SYq0aRA~AoJ-HOVsGdYPvQ2MvQKdhdzyQ-Gxxp_3ZfsE7O6_Ec0L1xosfPF27i7jAOEAlk2M&q=${location}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching location:", error);
    throw error;
  }
};
