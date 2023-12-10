import axios from "axios";
import CryptoJS from "crypto-js";
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";
const chars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const Base64 = {
  btoa: (input = "") => {
    let str = input;
    let output = "";

    for (
      let block = 0, charCode, i = 0, map = chars;
      str.charAt(i | 0) || ((map = "="), i % 1);
      output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
    ) {
      charCode = str.charCodeAt((i += 3 / 4));

      if (charCode > 0xff) {
        throw new Error(
          "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."
        );
      }

      block = (block << 8) | charCode;
    }

    return output;
  },

  atob: (input = "") => {
    let str = input.replace(/=+$/, "");
    let output = "";

    if (str.length % 4 == 1) {
      throw new Error(
        "'atob' failed: The string to be decoded is not correctly encoded."
      );
    }
    for (
      let bc = 0, bs = 0, buffer, i = 0;
      (buffer = str.charAt(i++));
      ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
        ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0
    ) {
      buffer = chars.indexOf(buffer);
    }

    return output;
  },
};

////////Send email API

export async function sendEmail(email, content) {
  const MJ_APIKEY_PUBLIC = "97ef95802cb73fd61a383fc8a41491f0";
  const MJ_APIKEY_PRIVATE = "1e860af0fcbefa2ddc4f51d028b1ecff";
  const response = await fetch("https://api.mailjet.com/v3/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic " + Base64.btoa(MJ_APIKEY_PUBLIC + ":" + MJ_APIKEY_PRIVATE),
    },
    // body: '{\n\t\t"FromEmail":"pilot@mailjet.com",\n\t\t"FromName":"Mailjet Pilot",\n\t\t"Subject":"Your email flight plan!",\n\t\t"Text-part":"Dear passenger, welcome to Mailjet! May the delivery force be with you!",\n\t\t"Html-part":"<h3>Dear passenger, welcome to <a href=\\"https://www.mailjet.com/\\">Mailjet</a>!<br />May the delivery force be with you!",\n\t\t"Recipients":[{"Email":"passenger@mailjet.com"}]\n\t}',
    body: JSON.stringify({
      FromEmail: "ltwzbere@manhtuong.id.vn",
      FromName: "Faster Company",
      Subject: "OTP code for reset password",
      "Text-part": `OTP code: ${content}`,
      Recipients: [
        {
          Email: email,
        },
      ],
    }),
  }).then((response) => response);

  return response;
}

export async function sendFeedbackEmail(
  email,
  content,
  userName,
  typeOfReport
) {
  const MJ_APIKEY_PUBLIC = "97ef95802cb73fd61a383fc8a41491f0";
  const MJ_APIKEY_PRIVATE = "1e860af0fcbefa2ddc4f51d028b1ecff";

  const response = await fetch("https://api.mailjet.com/v3/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic " + Base64.btoa(MJ_APIKEY_PUBLIC + ":" + MJ_APIKEY_PRIVATE),
    },
    // body: '{\n\t\t"FromEmail":"pilot@mailjet.com",\n\t\t"FromName":"Mailjet Pilot",\n\t\t"Subject":"Your email flight plan!",\n\t\t"Text-part":"Dear passenger, welcome to Mailjet! May the delivery force be with you!",\n\t\t"Html-part":"<h3>Dear passenger, welcome to <a href=\\"https://www.mailjet.com/\\">Mailjet</a>!<br />May the delivery force be with you!",\n\t\t"Recipients":[{"Email":"passenger@mailjet.com"}]\n\t}',

    body: JSON.stringify({
      FromEmail: `${email.split("@")[0]}@manhtuong.id.vn`,
      FromName: `${userName}`,
      Subject: `Report ${typeOfReport}`,
      "Text-part": `${content}`,
      Recipients: [
        {
          Email: "len856638@gmail.com",
        },
      ],
    }),
  }).then((response) => response);

  return response;
}

export async function sendRatingEmail(email, content, userName, typeOfRating) {
  const MJ_APIKEY_PUBLIC = "97ef95802cb73fd61a383fc8a41491f0";
  const MJ_APIKEY_PRIVATE = "1e860af0fcbefa2ddc4f51d028b1ecff";

  const response = await fetch("https://api.mailjet.com/v3/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic " + Base64.btoa(MJ_APIKEY_PUBLIC + ":" + MJ_APIKEY_PRIVATE),
    },
    // body: '{\n\t\t"FromEmail":"pilot@mailjet.com",\n\t\t"FromName":"Mailjet Pilot",\n\t\t"Subject":"Your email flight plan!",\n\t\t"Text-part":"Dear passenger, welcome to Mailjet! May the delivery force be with you!",\n\t\t"Html-part":"<h3>Dear passenger, welcome to <a href=\\"https://www.mailjet.com/\\">Mailjet</a>!<br />May the delivery force be with you!",\n\t\t"Recipients":[{"Email":"passenger@mailjet.com"}]\n\t}',

    body: JSON.stringify({
      FromEmail: `${email.split("@")[0]}@manhtuong.id.vn`,
      FromName: `${userName}`,
      Subject: `Rating ${typeOfRating}`,
      "Text-part": `${content}`,
      Recipients: [
        {
          Email: "len856638@gmail.com",
        },
      ],
    }),
  }).then((response) => response);

  return response;
}

///database

//hash password to MD5, base64
function hashPasswordAndEncodeBase64(password) {
  // Hash the password using MD5
  const hashedPassword = CryptoJS.MD5(password).toString();

  // Encode the hashed password in Base64
  const base64EncodedPassword = CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Utf8.parse(hashedPassword)
  );

  return base64EncodedPassword;
}

export function addUserToDatabase({
  email = "",
  phoneNumber = "",
  password,
  fullName,
}) {
  // addUser(email, phoneNumber, hashPasswordAndEncodeBase64(password), fullName);
  console.log("add to database", email, phoneNumber, password, fullName);
  console.log(hashPasswordAndEncodeBase64(password));
}

export function updateUserPassword({ idUser = "", newPassword }) {
  // updatePassword(idUser,hashPasswordAndEncodeBase64(password));

  console.log("update user password", newPassword);
}

///Check JWT token expire

export function checkTokenExpiration(token) {
  try {
    const decodedToken = jwtDecode(token);
    // Extract the expiration timestamp from the decoded token
    const expirationTime = decodedToken.exp;

    // Get the current timestamp
    const currentTime = Math.floor(Date.now() / 1000);

    // Compare the current time with the expiration time
    // console.log("currentTime: ", currentTime);

    if (expirationTime < currentTime) {
      // Token has expired
      return true;
    } else {
      // Token is still valid
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

///Bing Map API

export async function getLocationInfo(lat, lng) {
  console.log(lat, lng);
  const baseUrl = `https://dev.virtualearth.net/REST/v1/Locations/${lat}, ${lng}?includeEntityTypes&includeNeighborhood&verboseplacenames=true&o=json&key=bL87M940PHGHkEzNpKCT~7l6e1ifOuzSkJb-SYq0aRA~AoJ-HOVsGdYPvQ2MvQKdhdzyQ-Gxxp_3ZfsE7O6_Ec0L1xosfPF27i7jAOEAlk2M`;
  var response = await axios
    .get(baseUrl)
    .then((res) => {
      return res.data.resourceSets[0].resources;
    })
    .catch((err) => {
      console.log(" Bing Map location: ", err.message);
      return null;
    });

  return response;
}

export async function getDirection(origin, destination) {
  const baseUrl = "https://dev.virtualearth.net/REST/V1/Routes/Driving";
  const apiKey =
    "bL87M940PHGHkEzNpKCT~7l6e1ifOuzSkJb-SYq0aRA~AoJ-HOVsGdYPvQ2MvQKdhdzyQ-Gxxp_3ZfsE7O6_Ec0L1xosfPF27i7jAOEAlk2M";

  try {
    const response = await axios
      .get(
        `${baseUrl}?o=json&wp.0=${origin}&wp.1=${destination}&avoid=minimizeTolls&key=${apiKey}`
      )
      .then((response) => {
        const data = response.data.resourceSets[0].resources[0].routeLegs[0];
        const obj = {
          travelDistance: data.travelDistance,
          travelDuration: (data.travelDuration / 3600).toFixed(1),
        };
        return obj;
      });
    return response;
  } catch (error) {
    console.error("Error fetching directions:", error);
    return null;
  }
}
