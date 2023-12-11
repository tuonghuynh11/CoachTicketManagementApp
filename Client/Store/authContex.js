import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState } from "react";

export const AuthContext = createContext({
  token: "",
  refreshToken: "",
  idUser: "",
  userName: "",
  idRole: "",
  idPosition: "",
  isAuthenticated: false,
  authenticate: (
    token,
    refreshToken,
    idUser,
    userName,
    idRole,
    idPosition
  ) => {},
  logout: () => {},
});

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState();
  const [idUser, setIdUser] = useState();
  const [userName, setUserName] = useState();
  const [idRole, setIdRole] = useState();
  const [idPosition, setIdPosition] = useState();
  const [refreshToken, setRefreshToken] = useState();
  function authenticate(
    token,
    refreshToken,
    idUser,
    userName,
    idRole,
    idPosition
  ) {
    setAuthToken(token);
    setIdUser(idUser);
    setUserName(userName);
    setRefreshToken(refreshToken);
    setIdRole(idRole);
    setIdPosition(idPosition);
    AsyncStorage.setItem("token", token);
    AsyncStorage.setItem("refreshToken", refreshToken);
    AsyncStorage.setItem("idUser", idUser);
    AsyncStorage.setItem("userName", userName);
    AsyncStorage.setItem("idRole", idRole);
    AsyncStorage.setItem("idPosition", idPosition);
  }
  function logout() {
    setAuthToken(null);
    setIdUser(null);
    setUserName(null);
    setRefreshToken(null);
    setIdRole(null);
    setIdPosition(null);
    AsyncStorage.removeItem("token");
    AsyncStorage.removeItem("refreshToken");
    AsyncStorage.removeItem("idUser");
    AsyncStorage.removeItem("userName");
    AsyncStorage.removeItem("idRole");
    AsyncStorage.removeItem("idPosition");
  }

  const value = {
    token: authToken,
    idUser: idUser,
    userName: userName,
    idRole: idRole,
    refreshToken: refreshToken,
    idPosition: idPosition,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
