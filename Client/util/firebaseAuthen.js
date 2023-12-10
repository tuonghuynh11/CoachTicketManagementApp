import axios from "axios";
const API_KEY = "AIzaSyA_mW6Lmpk_ZPSOe1l3YHxMPtppPzJK7GM";
export async function authenticate(mode, email, password) {
  const response = await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`,
    {
      email: email,
      password: password,
      returnSecureToken: true,
    }
  );
  //   console.log(response.data);
  const data = response.data;
  return data;
}
export function createUser(email, password) {
  return authenticate("signUp", email, password);
}
export function login(email, password) {
  return authenticate("signInWithPassword", email, password);
}
