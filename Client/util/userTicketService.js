import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const baseURL = "https://coach-ticket-management-api.onrender.com";

const userTicketService = axios.create({
  baseURL,
});

userTicketService.interceptors.request.use(
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

export const getAllUserTickets = async (userid) => {
  try {
    const response = await userTicketService.get(
      `/api/tickets/user?limit=100&status=0&userId=${userid}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching userTickets:", error);
    throw error;
  }
};

export const getAllUserTicketsHistory = async (userid) => {
  try {
    const response = await userTicketService.get(
      `/api/tickets/user?limit=100&status=4&userId=${userid}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching userTickets:", error);
    throw error;
  }
};

export const updateTicket = async (
  userid,
  updatedTicketData,
  reservationid
) => {
  try {
    const response = await userTicketService.patch(
      `/api/tickets/user?userId=${userid}${reservationid}`,
      updatedTicketData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating ticket:", error);
    throw error;
  }
};

export const acceptTicket = async (updateBody) => {
  try {
    const response = await userTicketService.patch(
      `/api/tickets/accept`,
      updateBody
    );
    return response.data;
  } catch (error) {
    console.error("Error accepting ticket:", error);
    throw error;
  }
};

export const cancelTicket = async (updateBody) => {
  try {
    const response = await userTicketService.patch(
      `/api/tickets/cancel`,
      updateBody
    );
    return response.data;
  } catch (error) {
    console.error("Error canceling ticket:", error);
    throw error;
  }
};

//note: need more information
//places: ???
