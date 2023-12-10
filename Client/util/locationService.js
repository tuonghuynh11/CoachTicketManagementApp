import axios from "axios";

const baseURL = "https://vapi.vnappmob.com";

const locationService = axios.create({
  baseURL,
});

export const getAllProvince = async () => {
  try {
    const response = await locationService.get("/api/province");
    return response.data;
  } catch (error) {
    console.error("Error fetching provinces:", error);
    throw error;
  }
};

export const getAllDistrict = async (provinceId) => {
  try {
    const response = await locationService.get(`/api/province/district/${provinceId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching districts:", error);
    throw error;
  }
};

export const getAllWard = async (districtId) => {
    try {
      const response = await locationService.get(`/api/province/ward/${districtId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching wards:", error);
      throw error;
    }
  };