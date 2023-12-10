import axios from "axios";

const baseURL = "https://coach-ticket-management-api.onrender.com";

const scheduleService = axios.create({
  baseURL,
});

scheduleService.interceptors.request.use(
  async (config) => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwidXNlck5hbWUiOiJhZG1pbiIsInJvbGUiOnsiaWQiOiIzIiwicm9sZU5hbWUiOiJBZG1pbiJ9LCJpYXQiOjE3MDIyMjE0MjYsImV4cCI6MTcwMjIyNTAyNn0.yJabeqKWZVsSeaWQ6Tt8IyTmXHWBypieGHrIE_xNgIQ";
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getAllSchedules = async (routeid) => {
  try {
    const response = await scheduleService.get(`/api/schedules?routeId=${routeid}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    throw error;
  }
};

export const createSchedule = async (newScheduleData) => {
  try {
    const response = await scheduleService.post(
      "/api/schedules",
      newScheduleData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating schedule:", error);
    throw error;
  }
};

export const updateSchedule = async (scheduleId, updatedScheduleData) => {
  try {
    console.log(scheduleId);
    console.log(updatedScheduleData);
    const response = await scheduleService.patch(
      `/api/schedules/${scheduleId}`,
      updatedScheduleData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating schedule:", error);
    throw error;
  }
};

export const deleteSchedule = async (scheduleId) => {
  try {
    const response = await scheduleService.delete(`/api/schedules/${scheduleId}`); 
    return response.data;
  } catch (error) {
    console.error("Error deleting schedule:", error);
    throw error;
  }
};
