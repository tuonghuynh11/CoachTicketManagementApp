import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";

export const LngContext = createContext({
  lng: "",
  setLng: (lng) => {},
});

function LngContextProvider({ children }) {
  const [lng, setLng] = useState("en");

  useEffect(() => {
    getLng();
  }, []);
  function setLngs(lng) {
    setLng(lng);
    AsyncStorage.setItem("lng", lng);
  }
  async function getLng() {
    const lng = await AsyncStorage.getItem("lng");
    if (lng) {
      setLng(lng);
    } else {
      setLng("en");
    }
  }

  const value = {
    lng: lng,
    setLng: setLngs,
  };

  return <LngContext.Provider value={value}>{children}</LngContext.Provider>;
}

export default LngContextProvider;
