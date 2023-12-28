import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
  SafeAreaView,
  Keyboard,
  FlatList,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import placeholder from "../../../assets/peopleIcon.jpg";
import { MaterialIcons } from "@expo/vector-icons";
import LogOutPopUp from "../../Componets/UI/LogOutPopUp";
import GlobalColors from "../../Color/colors";
import Loading from "../../Componets/UI/Loading";
import { AuthContext } from "../../Store/authContex";
import { getCurrentUser } from "../../util/databaseAPI";
const { width } = Dimensions.get("screen");

export default function CustomDrawer(props) {
  const [image, setImage] = useState();
  const [name, setName] = useState("username");
  const [isLoading, setIsLoading] = useState(false);
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);

  const authCtx = useContext(AuthContext);
  const logoutHandler = () => {
    setIsLogoutVisible((curr) => !curr);
  };
  useEffect(() => {
    async function getCurrentUsers() {
      const res = await getCurrentUser(authCtx.token, authCtx.idUser);
      if (!res) {
        setImage(null);
        return;
      }
      const temp = res.data;
      if (authCtx.idRole === "3") {
        //Admin
        setImage(null);
      } else {
        // Roles còn lại
        setImage(temp.data.UserAccountData.avatar);
      }
    }
    getCurrentUsers();
  }, []);
  return (
    <>
      {isLoading && (
        <View
          style={{
            flex: 1,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            height: "100%",
            width: "150%",
            zIndex: 100,
            backgroundColor: GlobalColors.lightBackground,
            opacity: 0.9,
          }}
        >
          <Loading message={"Logging out ..."} />
        </View>
      )}
      <LogOutPopUp
        isVisible={isLogoutVisible}
        onCancel={() => {
          setIsLogoutVisible((curr) => !curr);
        }}
        onLogout={() => {
          setIsLogoutVisible(false);
          setIsLoading(true);
          setTimeout(async () => {
            setIsLoading(false);
            // await logOut({
            //   userName: authCtx.userName,
            //   accessToken: authCtx.token,
            //   refreshToken: authCtx.refreshToken,
            // });
            authCtx.logout();
          }, 2000);
        }}
      />
      <View style={{ flex: 1 }}>
        <DrawerContentScrollView
          {...props}
          contentContainerStyle={{ backgroundColor: "#72C6A1", flex: 1 }}
          style={{ zIndex: 100 }}
        >
          <ImageBackground
            source={require("../../../assets/coachDrawer.png")}
            style={{ padding: 30, paddingLeft: 10, height: 150, zIndex: 1 }}
          >
            <Image
              source={image ? { uri: image } : placeholder}
              style={styles.staffImage}
            />
          </ImageBackground>
          <View style={styles.botView}>
            <DrawerItemList {...props} />
          </View>
        </DrawerContentScrollView>

        <Pressable
          style={({ pressed }) => [
            styles.press,
            pressed && { opacity: 0.85 },
            styles.custom,
          ]}
          onPress={logoutHandler}
        >
          <MaterialIcons name="logout" size={24} color="#283663" />
          <Text style={{ fontWeight: "500", color: "#283663", marginLeft: 30 }}>
            Logout
          </Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  staffImage: {
    width: 100,
    height: 100,
    borderRadius: 80,
    borderColor: "#72C6A1",
    position: "absolute",
    borderWidth: 1,
    zIndex: 100,
    bottom: -50,
    left: (width * 1) / 3 - 100,
  },
  name: {
    color: "white",
    marginLeft: 15,
    marginTop: 5,
  },
  botView: {
    flex: 2,
    backgroundColor: "white",
    paddingTop: 55,
  },
  custom: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#283663",
  },
  press: {
    flexDirection: "row",
    backgroundColor: "white",
  },
});
