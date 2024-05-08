import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../Store/authContex";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
global.Buffer = require("buffer").Buffer;
// const BASE_URL = "http://localhost:3000/api";

// const BASE_URL = "http://192.168.0.3:3000/api";
const BASE_URL = "https://coach-ticket-management-api.onrender.com/api";
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYThiYzY5MzBmYjQ2ZTAxYmFmZTRkNDJhOGY4OWE2NiIsInN1YiI6IjY0MWM1YTYzMjRiMzMzMDBkNzI2MDQzNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-6PmEyqlyAb6rgUsHzTXBopALplnBcDCJS7Al3z1v3E",
  },
};

export async function Login(user) {
  const loginUser = {
    userName: user.userName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    password: user.password,
  };
  var response = await axios
    .post(`${BASE_URL}/auth/login`, loginUser)
    .then((res) => {
      console.log("login: ", res.data.data);
      const temp = res.request.responseHeaders["Set-Cookie"]
        ? res.request.responseHeaders["Set-Cookie"]
        : res.request.responseHeaders["set-cookie"];
      return {
        accessToken: res.data.data["access_token"],
        refreshToken: temp.split("=")[1].split(";")[0],
        userId: res.data.data.userId,
        roleId: res.data.data.role.id,
        userName: res.data.data.userName,
        idPosition: res?.data?.data?.position?.id,
      };
    })
    .catch((err) => {
      return null;
    });
  // if (response !== null) {
  //   const refresh = await ResetToken(response);
  //   response.accessToken = refresh.accessToken;
  //   response.refreshToken = refresh.refreshToken;
  // }

  return response;
}
export async function logOut(user) {
  const param = {
    userName: user.userName,
  };
  // const refresh = await ResetToken(user);

  console.log("Log out user:", user);
  const header = {
    Authorization: `${user.accessToken}`,
    "content-type": "application/json; charset=utf-8",
    "Set-Cookie": `refreshToken=${user.refreshToken}`,
    accept: "application/json",
  };
  const response = await axios
    .delete(`${BASE_URL}/auth/logout`, param, {
      headers: header,
    })
    .then((res) => {
      console.log("Log out success:", res.data);

      return res.data;
    })
    .catch((err) => {
      console.log("Log out:", err.message);
      return null;
    });
  return response;
}
export async function Register(user, isCreate = true) {
  const registerUser = {
    userName: user.userName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    password: user.password,
    isCreate: isCreate,
  };

  var response = await axios.post(`${BASE_URL}/auth/register`, registerUser);
  return response;
}

export async function ResetToken(user) {
  const param = {
    userName: user.userName,
  };
  const response = await axios
    .post(`${BASE_URL}/auth/refresh`, param, {
      headers: {
        accept: "application/json",
        "content-type": "application/json; charset=utf-8",
        "Set-Cookie": `refreshToken=${user.refreshToken}`,
      },
    })
    .then((res) => {
      const temp = res.request.responseHeaders["Set-Cookie"]
        ? res.request.responseHeaders["Set-Cookie"]
        : res.request.responseHeaders["set-cookie"];
      return {
        accessToken: res.data.data["accessToken"],
        refreshToken: temp.split("=")[1].split(";")[0],
      };
    })
    .catch((err) => {
      console.log("Reset Token: ", err.message);
      return null;
    });
  return response;
}

export async function checkEmailOrPhoneNumberExist({ email, phoneNumber }) {
  let request = {};
  if (email != null) {
    request = {
      email: email,
    };
  } else {
    request = {
      phoneNumber: phoneNumber,
    };
  }

  var res = await axios
    .post(`${BASE_URL}/auth/check-email-phone-number`, request)
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.log("err: ", err);
      return null;
    });
  return res;
}
export async function resetPassword(email, phoneNumber, newPassword) {
  let request = {
    newPassword: newPassword,
  };
  if (email !== null) {
    request.email = email;
  } else {
    request.phoneNumber = phoneNumber;
  }

  var res = await axios
    .patch(`${BASE_URL}/auth/reset-password`, request)
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.log("err: ", err);
      return null;
    });
  // console.log(res.data);
  return res;
}

export async function getCurrentUser(token, idUser) {
  console.log(token);
  const header = {
    accept: "application/json",
    Authorization: `${token}`,
  };
  var res = await axios
    .get(`${BASE_URL}/users/currentAccount`, {
      headers: header,
    })
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.log("err: ", err);
      return null;
    });
  // console.log(res.data);
  return res;
}

export async function updateUserInformation(user) {
  const header = {
    "Content-Type": "multipart/form-data",
    Authorization: `${user.accessToken}`,
  };
  console.log("update user information: ", user);
  let body = new FormData();
  if (user.userName) {
    body.append("userName", user.userName);
  }
  if (user.avatar) {
    body.append("image", user.avatar);
  }
  if (user.fullName) {
    body.append("fullName", user.fullName);
  }
  if (user.email) {
    body.append("email", user.email);
  }
  if (user.phoneNumber) {
    body.append("phoneNumber", user.phoneNumber);
  }
  if (user.address) {
    body.append("address", user.address);
  }
  var res = await axios
    .patch(`${BASE_URL}/users/${user.userId}`, body, {
      headers: header,
    })
    .then((response) => {
      console.log(response.data);
      return response;
    })
    .catch((err) => {
      console.log("err: ", err.message);
      return null;
    });
  return res;
}

export async function getAllTicketsOfUser(token, idUser, page = 1, limit = 10) {
  console.log(token);
  const header = {
    accept: "application/json",
    Authorization: `${token}`,
  };
  var res = await axios
    .get(
      `${BASE_URL}/tickets/user?userId=${idUser}&page=${page}&limit=${limit}`,
      {
        headers: header,
      }
    )
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.log("err: ", err);
      return null;
    });
  // console.log(res.data);
  return res;
}

export async function getAllRoutes(token) {
  console.log(token);
  const header = {
    accept: "application/json",
    Authorization: `${token}`,
  };
  var res = await axios
    .get(`${BASE_URL}/routes?limit=50`, {
      headers: header,
    })
    .then((response) => {
      return response.data.data;
    })
    .catch((err) => {
      console.log("err: ", err);
      return null;
    });
  // console.log(res.data);
  return res;
}
export async function getAllPlaces(token) {
  console.log(token);
  const header = {
    accept: "application/json",
    Authorization: `${token}`,
  };
  var res = await axios
    .get(`${BASE_URL}/places?limit=50`, {
      headers: header,
    })
    .then((response) => {
      return response.data.data;
    })
    .catch((err) => {
      console.log("err: ", err);
      return null;
    });
  // console.log(res.data);
  return res;
}

export async function searchTrip(
  token,
  from,
  to,
  departureTime,
  seats,
  roundTrip,
  startPlace,
  arrivalPlace
) {
  console.log(token);
  const header = {
    accept: "application/json",
    Authorization: `${token}`,
  };

  let url = "";
  if (from) {
    url += `from=${from}&`;
  }
  if (to) {
    url += `to=${to}&`;
  }
  if (departureTime) {
    url += `departureTime=${departureTime}&`;
  }
  if (seats) {
    url += `seats=${seats}&`;
  }
  if (roundTrip) {
    url += `roundTrip=true&roundTime=${roundTrip}&`;
  }
  if (startPlace) {
    url += `startPlace=${startPlace}&`;
  }
  if (arrivalPlace) {
    url += `arrivalPlace=${arrivalPlace}&`;
  }
  console.log(url.slice(0, -1));
  var res = await axios
    .get(`${BASE_URL}/trips?${url.slice(0, -1)}`, {
      headers: header,
    })
    .then((response) => {
      console.log(response.data);
      return response.data.data;
    })
    .catch((err) => {
      console.log("err: ", err);
      return null;
    });
  // console.log(res.data);
  return res;
}

export async function getDiscountOfUser(token, userId) {
  console.log(token);
  const header = {
    accept: "application/json",
    Authorization: `${token}`,
  };
  var res = await axios
    .get(`${BASE_URL}/userDiscounts?userId=${userId}&limit=50`, {
      headers: header,
    })
    .then((response) => {
      return response.data.data;
    })
    .catch((err) => {
      console.log("err: ", err);
      return null;
    });
  // console.log(res.data);
  return res;
}
export async function getShuttleRouteOfSchedule(token, scheduleId) {
  console.log(token);
  const header = {
    accept: "application/json",
    Authorization: `${token}`,
  };

  var res = await axios
    .get(`${BASE_URL}/shuttles?scheduleId=${scheduleId}&limit=50`, {
      headers: header,
    })
    .then((response) => {
      return response.data.data;
    })
    .catch((err) => {
      console.log("err: ", err);
      return null;
    });
  // console.log(res.data);
  return res;
}
export async function getPopularTrip(token) {
  console.log(token);
  const header = {
    accept: "application/json",
    Authorization: `${token}`,
  };
  var res = await axios
    .get(`${BASE_URL}/trips/popularTrip`, {
      headers: header,
    })
    .then((response) => {
      return response.data.data;
    })
    .catch((err) => {
      console.log("err: ", err);
      return null;
    });
  // console.log(res.data);
  return res;
}

////Booking
export async function createBookingSession(token, body) {
  const header = {
    accept: "application/json",
    Authorization: `${token}`,
  };
  console.log("Create Booking Ticket Session Body: ", body);
  console.log("token: ", token);

  ///Body
  // {
  //   "scheduleId": "3",
  //   "seats": ["04", "05"],
  //   "paymentId": "2",
  //   "departurePoint": "1",
  //   "arrivalPoint": "8",
  //   "shuttle": {
  //       "shuttleRouteId": "1",
  //       "quantity": 2
  //   },
  //   "roundTrip": {
  //       "scheduleId": "1",
  //       "seats": ["01", "03"],
  //       "departurePoint": "2",
  //       "arrivalPoint": "3",
  //       "shuttle": {
  //           "shuttleRouteId": "2",
  //           "quantity": 2
  //       }
  // }
  var res = await axios
    .post(`${BASE_URL}/tickets/create-booking`, body, {
      headers: header,
    })
    .then((response) => {
      console.log(response.data.data);
      return response.data.data;
    })
    .catch((err) => {
      console.log("create-booking err: ", err.response.data);
      return null;
    });
  // console.log(res.data);
  return res;
}
export async function cancelBookingSession(token, body) {
  const header = {
    accept: "application/json",
    Authorization: `${token}`,
  };
  console.log("Cancel Booking Ticket Session Body: ", body);
  console.log("Cancel Booking Ticket Session token: ", header);

  //Body
  // {
  //   "reservations": ["2", "3"],
  //   "reservationsRoundTrip": ["1", "2"]
  // }
  let send = {
    reservations: body.reservations,
  };
  if (body?.reservationsRoundTrip) {
    send.reservationsRoundTrip = body.reservationsRoundTrip;
  }
  var res = await axios({
    url: `${BASE_URL}/tickets/cancel-booking`,
    method: "delete",
    data: send,
    headers: { Authorization: `${token}` },
  })
    .then((response) => {
      console.log(response.data.code);
      return response.data.code;
    })
    .catch((err) => {
      console.log("cancel-booking err: ", err.response.data);
      console.log("cancel-booking err config: ", err.config);
      return null;
    });

  // console.log(res.data);
  return res;
}

export async function confirmBookingTicket(token, body) {
  const header = {
    accept: "application/json",
    Authorization: `${token}`,
  };
  console.log("Confirm Booking Ticket Session Body: ", body);
  console.log("token: ", token);
  // Body
  // {
  //   "passengers": [
  //     {
  //     // data of passenger
  //       "fullName": "adsasd",
  //       "phoneNumber": "0839112323",
  //     },
  //     {
  //     // data of passenger
  //       "fullName": "adsasd",
  //       "phoneNumber": "0839112323",
  //     }
  //   ],
  //   "reservations": ["2", "3"],
  //   "paymentId": "1",
  //   "discountId": "1" //optional
  // }
  var res = await axios
    .post(`${BASE_URL}/tickets/confirm-ticket-info`, body, {
      headers: header,
    })
    .then((response) => {
      console.log(response.data.code);
      return response.data.code;
    })
    .catch((err) => {
      console.log("Confirm-booking err: ", err.response.data);
      return null;
    });
  // console.log(res.data);
  return res;
}

export async function confirmBookingTicketBoughtByCreditCard(token, body) {
  const header = {
    accept: "application/json",
    Authorization: `${token}`,
  };
  console.log("Confirm Booking Ticket Bought By Credit Card Body:  ", body);
  //Body
  // {
  //   "discountId": "1", //optional
  //   "reservations": ["2", "3"],
  //   "reservationsRoundTrip": ["1", "2"] // optional
  // }
  var res = await axios
    .patch(`${BASE_URL}/payment-sheet/confirm`, body, {
      headers: header,
    })
    .then((response) => {
      console.log(response.data.code);
      return response.data.code;
    })
    .catch((err) => {
      console.log("Confirm-booking Credit Card err: ", err);
      return null;
    });
  // console.log(res.data);
  return res;
}

export async function cancelTicketWhenFinishedConfirm(token, body) {
  const header = {
    accept: "application/json",
    Authorization: `${token}`,
  };
  // console.log("Cancel Booking Ticket Session Body: ", body);
  var res = await axios
    .patch(`${BASE_URL}/tickets/cancel`, body, {
      headers: header,
    })
    .then((response) => {
      console.log(response.data.code);
      return response.data.code;
    })
    .catch((err) => {
      console.log("cancel-booking err: ", err);
      return null;
    });
  // console.log(res.data);
  return res;
}

////Export Excel file
async function ensureDirExistsOrCreateNew(gifDir) {
  const dirInfo = await FileSystem.getInfoAsync(gifDir);
  if (!dirInfo.exists) {
    console.log("Gif directory doesn't exist, creating…");
    await FileSystem.makeDirectoryAsync(gifDir, { intermediates: true });
    return false;
  }
  return true;
}
export async function exportStatisticAboutRevenueByYears(token, type) {
  //   .get(`${BASE_URL}/statistic/revenue/schedule/download`, {
  //     headers: header,
  //   })
  //   .then(async (response) => {
  //     // console.log(response);
  //     // console.log(Buffer.from(response.data, "base64"));

  //     let blob = new Blob([response.data], {
  //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     });

  //     const bufferArray = response.data; // Buffer array received from API response
  //     const base64String = bufferArray.toString("base64");
  //     const directoryPath = FileSystem.documentDirectory;
  //     await ensureDirExistsOrCreateNew(directoryPath);

  //     const filename = "example.xlsx";
  //     const filePath = `${directoryPath}${filename}`;
  //     await FileSystem.writeAsStringAsync(filePath, base64String, {
  //       encoding: FileSystem.EncodingType.Base64,
  //     }).then(() => {
  //       console.log("File saved successfully.");
  //       return true;
  //     });
  //   })
  //   .catch((err) => {
  //     console.log("Export Statistic About Revenue By Years err: ", err);
  //     return null;
  //   });

  // Make a fetch request with the headers
  // await fetch(`${BASE_URL}/statistic/revenue/schedule/download`, {
  //   method: "GET",
  //   headers: header,
  // })
  //   .then(async (response) => {
  //     // Process the response
  //     console.log("Response received");
  //     console.log(response);
  //     const arrayBuffer = await response.arrayBuffer();
  //     console.log(arrayBuffer);
  //     // console.log(response._bodyInit._data["__collector"]);
  //     // console.log(Buffer.from(response, "binary"));
  //     // console.log(response.data);
  //     // console.log(response.arrayBuffer());
  //   })
  //   .catch((error) => {
  //     // Handle any errors
  //     console.error("Error:", error);
  //   });
  // console.log(res.data);
  const headers = {
    Authorization: `${token}`,
    "Content-Type": "text/html",
    Accept: "*/*",
    "Accept-Encoding": "gzip, deflate, br",
  };
  let statisticURL = "";
  let filename = "";
  const timestamp = Date.now().toString();
  switch (type) {
    case "ticket_sold_by_month":
      filename = "ticket_sold_by_month" + timestamp + ".xlsx";
      statisticURL = "customer/months/download";
      break;
    case "ticket_sold_by_trips":
      filename = "ticket_sold_by_trips" + timestamp + ".xlsx";
      statisticURL = "customer/schedule/download";
      break;
    case "revenue_by_years":
      filename = "revenue_by_years" + timestamp + ".xlsx";
      statisticURL = "revenue/schedule/download";
      break;
    default:
      break;
  }
  const options = {
    headers,
    responseType: "arraybuffer",
  };
  const response = await axios.get(
    `${BASE_URL}/statistic/${statisticURL}`,
    options
  );
  console.log(response);
  const buff = Buffer.from(response.data, "base64");
  const bufferArray = buff.toString("base64"); // Buffer array received from API response
  const directoryPath = FileSystem.documentDirectory;
  await ensureDirExistsOrCreateNew(directoryPath);

  const filePath = `${directoryPath}${filename}`;
  await FileSystem.writeAsStringAsync(filePath, bufferArray, {
    encoding: FileSystem.EncodingType.Base64,
  });
  await Sharing.shareAsync(filePath);
  return response;
}
