import axios from "axios";

const baseURL = "https://coach-ticket-management-api.onrender.com";

const staffService = axios.create({
  baseURL,
});

staffService.interceptors.request.use(
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

export const getAllStaffs = async () => {
  try {
    const response = await staffService.get("/api/staffs");
    return response.data;
  } catch (error) {
    console.error("Error fetching staffs:", error);
    throw error;
  }
};
export const getAllStaffsWorking = async () => {
  try {
    const response = await staffService.get("/api/staffs/works");
    return response.data;
  } catch (error) {
    console.error("Error fetching staffs:", error);
    throw error;
  }
};

export const createStaff = async (newStaffData) => {
  try {
    const response = await staffService.post("/api/staffs", newStaffData);
    return response.data;
  } catch (error) {
    console.error("Error creating staff:", error);
    throw error;
  }
};

export const updateStaffPassword = async (staffId, updatedStaffData) => {
  try {
    const response = await staffService.patch(
      `/api/users/${staffId}`,
      updatedStaffData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating staff:", error);
    throw error;
  }
};

export const deleteStaff = async (staffId) => {
  try {
    const response = await staffService.delete(`/api/staffs/${staffId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting staff:", error);
    throw error;
  }
};

export const createStaffWithImage = async (item) => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwidXNlck5hbWUiOiJhZG1pbiIsInJvbGUiOnsiaWQiOiIzIiwicm9sZU5hbWUiOiJBZG1pbiJ9LCJpYXQiOjE3MDIyMTY4NTUsImV4cCI6MTcwMjIyMDQ1NX0.QVtCoeVhU-p69fIR7PUFfHh6Q3v9ALfZPgpxekQKcnA";
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
  body.append("fullName",item.fullName);
  body.append("image", file);
  body.append("phoneNumber", item.phone);
  body.append("positionId", item.currentValue);
  body.append("gender", item.currentValueGender);
  body.append("userName", item.username);
  body.append("password", item.password);
  body.append("email", item.email);
  console.log(body);
  var res = await axios.post(`${baseURL}/api/staffs`, body, {
    headers:header
  })
  .then((reponse) => {
    console.log(reponse.data);
    return reponse;
  })
  .catch((err) => {
    console.log("Error creating staff:", err);
    return null;
  })
  return res;
}

export const updateStaffWithImage = async (item) => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwidXNlck5hbWUiOiJhZG1pbiIsInJvbGUiOnsiaWQiOiIzIiwicm9sZU5hbWUiOiJBZG1pbiJ9LCJpYXQiOjE3MDIyMTY4NTUsImV4cCI6MTcwMjIyMDQ1NX0.QVtCoeVhU-p69fIR7PUFfHh6Q3v9ALfZPgpxekQKcnA";
  const header = {
    "content-type":"multipart/form-data",
    Authorization: `Bearer ${token}`
  };
  let body = new FormData();
  console.log(item.id);
  const file = {
    uri: item.image,
    type: 'image/jpeg',
    name: 'image.jpeg'
  }
  console.log(item.image);
  body.append("fullName",item.fullName);
  body.append("image", file);
  body.append("phoneNumber", item.phone);
  body.append("positionId", item.currentValue);
  body.append("gender", item.currentValueGender);
  body.append("email", item.email);
  var res = await axios.patch(`${baseURL}/api/users/${item.id}`, body, {
    headers: header
  })
  .then((reponse) => {
    console.log(reponse.data);
    return reponse;
  })
  .catch((err) => {
    console.log("Error updating staff:", err);
    return null;
  })
  return res;
}

