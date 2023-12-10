import axios from "axios";

const baseURL = "https://coach-ticket-management-api.onrender.com";

const coachService = axios.create({
  baseURL,
});



coachService.interceptors.request.use(
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

export const getAllCoaches = async () => {
  try {
    const response = await coachService.get("/api/coaches?limit=40");
    return response.data;
  } catch (error) {
    console.error("Error fetching buses:", error);
    throw error;
  }
};

export const createCoach = async (newCoachData) => {
  try {
    const response = await coachService.post("/api/coaches", newCoachData);
    return response.data;
  } catch (error) {
    console.error("Error creating coach:", error);
    throw error;
  }
};

export const updateCoach = async (coachId, updatedCoachData) => {
  try {
    const response = await coachService.patch(
      `/api/coaches/${coachId}`,
      updatedCoachData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating coach:", error);
    throw error;
  }
};

export const deleteCoach = async (coachId) => {
  try {
    const response = await coachService.delete(`/api/coaches/${coachId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting coach:", error);
    throw error;
  }
};

export const createCoachWithImage = async (item) => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwidXNlck5hbWUiOiJhZG1pbiIsInJvbGUiOnsiaWQiOiIzIiwicm9sZU5hbWUiOiJBZG1pbiJ9LCJpYXQiOjE3MDIyMDg2NDcsImV4cCI6MTcwMjIxMjI0N30.nZrq9Q6R3zmvcHNceRMRx8WkQkHCyaFeKJ_-AMj623I";
  const header = {
    "Content-Type":"multipart/form-data",
    Authorization: `Bearer ${token}`
  };

  let body = new FormData();
  const file = {
    uri: item.image,
    type: 'image/jpeg',
    name: 'image.jpeg'
  }
  
  body.append("coachNumber",item.coachNumber);
  body.append("image", file);
  body.append("idCoachType", item.idCoachType);
  body.append("capacity", item.capacity);
  body.append("services", JSON.stringify(item.services));
  var res = await axios.post(`${baseURL}/api/coaches`, body, {
    headers:header
  })
  .then((reponse) => {
    console.log(reponse.data);
    return reponse;
  })
  .catch((err) => {
    console.log("Error creating coach:", err);
    return null;
  })
  return res;
}

export const updateCoachWithImage = async (item) => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwidXNlck5hbWUiOiJhZG1pbiIsInJvbGUiOnsiaWQiOiIzIiwicm9sZU5hbWUiOiJBZG1pbiJ9LCJpYXQiOjE3MDIyMDg2NDcsImV4cCI6MTcwMjIxMjI0N30.nZrq9Q6R3zmvcHNceRMRx8WkQkHCyaFeKJ_-AMj623I";
  const header = {
    "content-type":"multipart/form-data",
    Authorization: `Bearer ${token}`
  };
  let body = new FormData();
  console.log(item.id);
  const file = {
    uri: item.imageCoach,
    type: 'image/jpeg',
    name: 'image.jpeg'
  }
  console.log(item.imageCoach);
  body.append("coachNumber",item.coachNumber);
  body.append("image", file);
  body.append("idCoachType", item.idCoachType);
  body.append("capacity", item.capacity);
  body.append("services", JSON.stringify(item.services));
  var res = await axios.patch(`${baseURL}/api/coaches/${item.id}`, body, {
    headers: header
  })
  .then((reponse) => {
    console.log(reponse.data);
    return reponse;
  })
  .catch((err) => {
    console.log("Error updating coach:", err);
    return null;
  })
  return res;
}
