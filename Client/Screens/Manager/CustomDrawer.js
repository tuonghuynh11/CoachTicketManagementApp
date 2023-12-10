import React, { useState } from "react";
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
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import placeholder from "../../../assets/peopleIcon.jpg";
import { MaterialIcons } from "@expo/vector-icons";

const {width} = Dimensions.get('screen');

export default function CustomDrawer(props) {
  const [image, setImage] = useState();
  const [name, setName] = useState("username");
  const logoutHandler = () => {
    console.log("logout")
  }
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: "#72C6A1" }}
      >
        <ImageBackground
          source={require("../../../assets/coachDrawer.png")}
          style={{ padding: 30, paddingLeft: 10, height: 150 }}
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
      <View style={styles.custom}>
        <Pressable
          style={({ pressed }) => [styles.press, pressed && { opacity: 0.85 }]}
          onPress={logoutHandler}
        >
          <MaterialIcons name="logout" size={24} color="#283663" />
          <Text style={{ fontWeight: "500", color: "#283663", marginLeft: 30 }}>
            Logout
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  staffImage: {
    width: 100,
    height: 100,
    borderRadius: 80,
    borderColor: "#72C6A1",
    position: 'absolute',
    borderWidth: 1,
    zIndex: 100,
    bottom: -50,
    left: width*1/3 - 100
  },
  name: {
    color: "white",
    marginLeft: 15,
    marginTop: 5,
  },
  botView: {
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
  },
});
