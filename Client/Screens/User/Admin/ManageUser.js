import { images } from "../../../../assets/Assets";
import Icon from "react-native-vector-icons/AntDesign";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  Switch,
  LogBox,
  Pressable,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import axios from "axios";
import CheckBox from "expo-checkbox";
import DropDownPicker from "react-native-dropdown-picker";
import { AuthContext } from "../../../Store/authContex";
import { Entypo, Ionicons } from "@expo/vector-icons";
import Vietnamese from "../../../locales/vi.json";
import English from "../../../locales/en.json";
import i18next from "i18next";
import { LngContext } from "../../../Store/languageContext";
import LngContextProvider from "../../../Store/languageContext";
import { useTranslation } from "react-i18next";
const config = {
  headers: {
    Authorization: "Bearer " + images.adminToken,
  },
  params: { page: 1 },
};

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

let currentID = "SE107";
function Screen({ navigation }) {
  const { t, i18n } = useTranslation();

  let axiosUsers = [];
  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const authCtx = useContext(AuthContext);
  const getData = async () => {
    axiosUsers = [];
    try {
      const config2 = {
        headers: {
          Authorization: authCtx.token,
        },
        params: { page: 1 },
      };
      let flag = true;
      do {
        console.log(config2.params.page);
        const response = await axios.get(
          "https://coach-ticket-management-api.onrender.com/api/users",
          config2
        );

        console.log(response.data.data);
        if (response.data.data.length == 0) {
          console.log("0");
          flag = false;
          console.log(flag);
        }
        axiosUsers = axiosUsers.concat(response.data.data);
        axiosUsers = axiosUsers.filter((user) => user.id != 1);
        console.log(axiosUsers + "@@ff@");
        config2.params.page++;
      } while (flag);
      setUsers(axiosUsers);
      setAllUsers(axiosUsers);
    } catch (error) {
      console.log(error);
      if (error.response) {
        console.log(error.response.data);
      } else if (error.request) {
        console.log(error.request.data);
      }
    }
  };

  const route = useRoute();

  const updateItem = (updatedItem) => {
    console.log(updatedItem);
    if (updatedItem == "undefined" || updatedItem == null) return;
    console.log("id = " + updateItem);
    const updateItems = users.map((item) => {
      if (item.id == updatedItem.id) {
        console.log(item.id);
        return updatedItem;
      }
      return item;
    });
    setUsers(updateItems);
    console.log(users + "  Eminem!");
  };
  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );
  const handleSearch = function (query) {
    setSearchValue(query);
    query = query.toLowerCase();
    if (query) {
      const filteredUsers = allUsers.filter((user) => {
        return (
          user.fullName.toLowerCase().includes(query) ||
          user.UserAccountData.userName.toLowerCase().includes(query) ||
          user.userId.toLowerCase().includes(query)
        );
      });
      console.log("Filtered user: " + filteredUsers);
      setUsers(filteredUsers);
    } else {
      setUsers(allUsers);
    }
  };
  const getRoleName = function (roleId) {
    if (roleId == 1) return t("customer");
    return t("staff");
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [
            styles.menuIcon,
            pressed && { opacity: 0.85 },
          ]}
          onPress={() => {
            navigation.getParent().openDrawer();
          }}
        >
          <Entypo name="menu" size={30} color="#283663" />
        </Pressable>

        <Text style={styles.headerText}>{t("manage-user")}</Text>
      </View>
      <View
        style={{
          //display: "flex",
          flexDirection: "row",
          marginStart: "10%",
          //justifyContent: "space-between",
        }}
      >
        <TextInput
          style={styles.input2}
          placeholder="Search"
          value={searchValue}
          placeholderTextColor="#FFFFFF"
          onChangeText={(query) => {
            handleSearch(query);
          }}
        ></TextInput>
        {/* <TouchableOpacity
          style={{ marginStart: 70, flex: 1, marginVertical: 20 }}
          onPress={() => {}}
        >
          <Image
            style={{ width: 30, height: 30 }}
            source={images.add_icon}
          ></Image>
        </TouchableOpacity> */}
      </View>
      <View style={styles.flatlist}>
        <FlatList
          contentContainerStyle={{ paddingBottom: 120 }}
          data={users}
          keyExtractor={(item) => item.userId}
          renderItem={({ item }) => (
            <View
              style={{
                flex: 1,
                borderRadius: 10,
                elevation: 3,
                backgroundColor: "#FFFFFF",
                shadowOffset: { width: 1, height: 1 },
                shadowColor: "#333333",
                shadowOpacity: 0.3,
                shadowRadius: 2,
                marginHorizontal: 10,
                marginVertical: 10,
              }}
            >
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  console.log(item);
                  navigation.navigate("Profile", {
                    data_mini: item,
                  });
                }}
              >
                {/* <Text style={{ marginBottom: 10, color: '#72C6A1' , fontSize: 20}}>{item.userId}</Text> */}
                <View
                  style={[
                    styles.avatarContainer,
                    { justifyContent: "space-between" },
                  ]}
                >
                  <Text
                    style={{
                      marginBottom: 10,
                      color: "#72C6A1",
                      fontSize: 20,
                      marginRight: 5,
                    }}
                  >
                    {item.userId}
                  </Text>

                  <View>
                    <Image
                      source={{ uri: item.UserAccountData.avatar }}
                      style={styles.avatar}
                    ></Image>
                  </View>
                  <View style={{ flex: 7, paddingRight: 15, marginLeft: 15 }}>
                    <Text style={styles.text2}>
                      {" "}
                      {t("name")}:{" "}
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 15,
                          color: "#283663",
                        }}
                      >
                        {item.fullName}
                      </Text>
                    </Text>
                    <Text style={styles.text2}>
                      {" "}
                      {t("phone-number")}: {item.phoneNumber}
                    </Text>
                    <Text style={styles.text2}> Email: {item.email}</Text>
                    <Text style={styles.text2}>
                      {" "}
                      {t("role")}: {getRoleName(item.UserAccountData.roleId)}
                    </Text>
                  </View>
                  <View
                    style={{ flexDirection: "row", justifyContent: "flex-end" }}
                  >
                    {item.UserAccountData.roleId == 1 && (
                      <MaterialIcons
                        onPress={() => {
                          Alert.alert(t("alert-capital"), t("delete-user"), [
                            {
                              text: "No",
                              onPress: () => {},
                            },
                            {
                              text: "Yes",
                              onPress: () => {
                                console.log(item.userId);
                                const config = {
                                  headers: {
                                    Authorization: authCtx.token,
                                  },
                                };
                                axios
                                  .delete(
                                    `${images.apiLink}users/${item.userId}`,
                                    config
                                  )
                                  .then((response) => {
                                    setUsers(
                                      users.filter(
                                        (user) => user.userId != item.userId
                                      )
                                    );
                                  })
                                  .catch((error) => {
                                    if (error.request)
                                      console.log(error.request);
                                    else if (error.response)
                                      console.log(error.response);
                                  });
                              },
                            },
                          ]);
                        }}
                        size={30}
                        name="delete"
                        color="red"
                        backgroundColor="#D9D9D9"
                        style={{ backgroundColor: "transparent" }}
                      ></MaterialIcons>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text>This is empty af</Text>}
        ></FlatList>
      </View>
    </SafeAreaView>
  );
}
function ProfileScreen({ navigation }) {
  const { t } = useTranslation();
  const route = useRoute();
  console.log(route.params);
  const { data_mini } = route.params;
  const [inputEditable, setinputEditable] = useState(false);
  const [buttonText, setButtonText] = useState("Edit");
  console.log(data_mini);
  const [name, onChangeName] = React.useState(data_mini.fullName);
  const [username, onChangeUsername] = useState(
    data_mini.UserAccountData.userName
  );
  const [email, onCHangeEmail] = React.useState(data_mini.email);
  const [phone, onChangePhone] = React.useState(data_mini.phoneNumber);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isAssistantEnabled, setIsAssistantEnabled] = useState(false);

  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(data_mini.UserAccountData.roleId);
  const [items, setItems] = useState([
    { label: t("customer"), value: "1" },
    { label: t("staff"), value: "2" },
  ]);
  const [roleDisabled, setRoleDisabled] = useState(true);
  const onDriverChange = () => {
    setIsEnabled(!isEnabled);
    if (!isEnabled && isAssistantEnabled)
      setIsAssistantEnabled(!isAssistantEnabled);
  };
  const onAssistantChange = () => {
    setIsAssistantEnabled(!isAssistantEnabled);
    if (isEnabled && !isAssistantEnabled) setIsEnabled(!isEnabled);
  };

  const authCtx = useContext(AuthContext);
  return (
    <ScrollView style={[styles.container, { backgroundColor: "#eff0ed" }]}>
      {/* <Pressable
        style={{ left: 16, position: "absolute" }}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Ionicons name="arrow-back" size={30} color="#283663"></Ionicons>
      </Pressable> */}
      <View
        style={{
          margin: 20,
          borderRadius: 10,
          backgroundColor: "#fff",
          padding: 10,
        }}
      >
        <View style={{ alignItems: "center", borderRadius: 20 }}>
          <Image
            source={{ uri: data_mini.UserAccountData.avatar }}
            style={styles.avatar2}
          ></Image>

          <Text style={styles.text}>{data_mini.UserAccountData.userName}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.label}>
            {"\n"}
            {t("full-name")}
          </Text>
          <TextInput
            editable={inputEditable}
            selectTextOnFocus={inputEditable}
            style={styles.input}
            onChangeText={onChangeName}
          >
            {data_mini.fullName}
          </TextInput>
          <Text style={styles.label}>
            {"\n"}
            {t("username")}
          </Text>
          <TextInput
            editable={inputEditable}
            selectTextOnFocus={inputEditable}
            style={styles.input}
            onChangeText={onChangeUsername}
          >
            {data_mini.UserAccountData.userName}
          </TextInput>
          <Text style={styles.label}>{"\n"}Email:</Text>
          <TextInput
            editable={inputEditable}
            selectTextOnFocus={inputEditable}
            style={styles.input}
            onChangeText={onCHangeEmail}
          >
            {data_mini.email}
          </TextInput>
          <Text style={styles.label}>
            {"\n"}
            {t("phone")}:
          </Text>
          <TextInput
            editable={inputEditable}
            selectTextOnFocus={inputEditable}
            style={styles.input}
            onChangeText={onChangePhone}
          >
            {data_mini.phoneNumber}
          </TextInput>
          <Text style={{ margin: 5 }}>{t("role")}: </Text>
          <View>
            <DropDownPicker
              style={styles.input}
              open={open}
              value={role}
              items={items}
              setItems={setItems}
              setValue={setRole}
              setOpen={setOpen}
              listMode="SCROLLVIEW"
              disabled={roleDisabled}
            ></DropDownPicker>
          </View>
        </View>

        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            style={styles.button1}
            onPress={
              () => {
                if (buttonText === "Save") {
                  const patchconfig = {
                    headers: {
                      Authorization: authCtx.token,
                      "Content-Type": "multipart/form-data",
                    },
                  };
                  let data = new FormData();
                  data.append("fullName", name);
                  data.append("email", email);
                  data.append("phoneNumber", phone);
                  axios
                    .patch(
                      `${images.apiLink}users/${data_mini.userId}`,
                      data,
                      patchconfig
                    )
                    .then((response) => {
                      const updatedUser = {
                        id: data_mini.id,
                        fullName: name,
                        email: email,
                        phoneNumber: phone,
                      };
                      navigation.navigate("ManageUser", updatedUser);
                    })
                    .catch((error) => {
                      if (error.request) {
                        console.log(error.request);
                      }
                      if (error.response) {
                        console.log(error.response);
                        Alert.alert(t("cant-update-user"));
                      }
                    });
                }
                setinputEditable(!inputEditable);
                setRoleDisabled(!setRoleDisabled);
                setButtonText(buttonText === "Edit" ? "Save" : "Edit");
              }
              //navigation.navigate("Edit Profile", { data_mini, updateData })
            }
          >
            <Text style={{ color: "#ffffff", fontWeight: "900" }}>
              {buttonText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
const AddUser = function (name, email, phone, addNewUsers) {
  const newUser = {
    id: currentID,
    imageLink: images.beavis_and_butthead,

    Name: name,
    phone: phone,
    tickets: 0,
    email: email,
  };
  addNewUsers((users) => [...users, newUser]);
  const split = currentID.split("");
  split[split.length - 1] = Number(split[split.length - 1]) + 1;
  currentID = split.join("");
};
function AddUserScreen({ navigation }) {
  const route = useRoute();
  const addNewUsers = route.params.addNewUsers;
  const { t } = useTranslation();
  const [name, onChangeName] = React.useState("");
  const [email, onCHangeEmail] = React.useState("");
  const [phone, onChangePhone] = React.useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [isAssistantEnabled, setIsAssistantEnabled] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <Image
          source={images.beavis_and_butthead}
          style={styles.avatar2}
        ></Image>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.label}>
          {"\n"}
          {t("name")}
        </Text>
        <TextInput
          placeholder={t("name")}
          onChangeText={onChangeName}
          style={styles.input}
        >
          {"\n"}
        </TextInput>
        <Text style={styles.label}>{"\n"}Email:</Text>
        <TextInput
          onChangeText={onCHangeEmail}
          keyboardType="email-address"
          placeholder="Email"
          style={styles.input}
        >
          {"\n"}
        </TextInput>
        <Text style={styles.label}>
          {"\n"}
          {t("phone")}:
        </Text>
        <TextInput
          onChangeText={onChangePhone}
          keyboardType="phone-pad"
          placeholder={t(phone)}
          style={styles.input}
        >
          {"\n"}
          {"\n"}
        </TextInput>
      </View>
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          style={styles.button1}
          onPress={() => {
            AddUser(name, email, phone, addNewUsers), navigation.goBack();
          }}
        >
          <Text style={{ color: "#ffffff", fontWeight: "900" }}>
            {t("add")}
          </Text>
        </TouchableOpacity>
        <Switch
          trackColor={{ false: "#ff5733", true: "#4a90e2" }}
          thumbColor={isEnabled ? "#b8e986" : "#d15a76"}
          value={isEnabled}
          onValueChange={setIsEnabled}
        />
      </View>
    </SafeAreaView>
  );
}

function EditProfileScreen({ navigation }) {
  const { t } = useTranslation();
  const route = useRoute();
  console.log(route);
  const { data_mini, updateData } = route.params;
  console.log(data_mini);
  const [name, onChangeName] = React.useState(data_mini.Name);
  const [email, onCHangeEmail] = React.useState(data_mini.email);
  const [phone, onChangePhone] = React.useState(data_mini.phone);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isAssistantEnabled, setIsAssistantEnabled] = useState(false);
  const authCtx = useContext(AuthContext);
  const onDriverChange = () => {
    setIsEnabled(!isEnabled);
    if (!isEnabled && isAssistantEnabled)
      setIsAssistantEnabled(!isAssistantEnabled);
  };
  const onAssistantChange = () => {
    setIsAssistantEnabled(!isAssistantEnabled);
    if (isEnabled && !isAssistantEnabled) setIsEnabled(!isEnabled);
  };
  return (
    <ScrollView style={[styles.container, { backgroundColor: "#eff0ed" }]}>
      <View
        style={{
          margin: 20,
          borderRadius: 10,
          backgroundColor: "#fff",
          padding: 10,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Image source={data_mini.imageLink} style={styles.avatar2}></Image>

          <Text style={styles.text}>{data_mini.Name}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.label}>
            {"\n"}
            {t("name")}
          </Text>
          <TextInput onChangeText={onChangeName} style={styles.input}>
            {"\n"}
            {data_mini.Name}
          </TextInput>
          <Text style={styles.label}>
            {"\n"}
            {t("name")}
          </Text>
          <TextInput onChangeText={onChangeName} style={styles.input}>
            {"\n"}
            {data_mini.Name}
          </TextInput>
          <Text style={styles.label}>{"\n"}Email:</Text>
          <TextInput
            onChangeText={onCHangeEmail}
            keyboardType="email-address"
            style={styles.input}
          >
            {"\n"}
            {data_mini.email}
          </TextInput>
          <Text style={styles.label}>
            {"\n"}
            {t("phone")}:
          </Text>
          <TextInput
            onChangeText={onChangePhone}
            style={styles.input}
            keyboardType="phone-pad"
          >
            {"\n"}
            {data_mini.phone}
            {"\n"}
          </TextInput>
          <Text style={{ margin: 5 }}>{t("role")}: </Text>
          <View style={styles.section}>
            <CheckBox
              style={{ margin: 5 }}
              value={isEnabled}
              onValueChange={onDriverChange}
            ></CheckBox>
            <Text>{t("driver-name")}</Text>
          </View>
          <View style={styles.section}>
            <CheckBox
              style={{ margin: 5 }}
              value={isAssistantEnabled}
              onValueChange={onAssistantChange}
            ></CheckBox>
            <Text>{t("assistant-name")}</Text>
          </View>
        </View>
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            style={styles.button1}
            onPress={() => {
              const updatedItem = {
                ...data_mini,
                Name: name,
                email: email,
                phone: phone,
              };
              navigation.navigate("ManageUser", updatedItem);
              // DATA.forEach((item) => {
              //   if (item.id === data_mini.id) {
              //     item.Name = data_mini.Name;
              //     item.email = data_mini.email;
              //     item.phone = data_mini.phone;
              //     console.log(DATA);
              //     navigation.navigate("ManageUser");
              //   }
              // });
            }}
          >
            <Text style={{ color: "#ffffff", fontWeight: "900" }}>Save</Text>
          </TouchableOpacity>
        </View>

        <View style={{ display: "flex", flex: 1, flexDirection: "row" }}>
          {/* <Switch
            trackColor={{ false: "#ff5733", true: "#4a90e2" }}
            thumbColor={isEnabled ? "#b8e986" : "#d15a76"}
            value={isEnabled}
            onValueChange={onDriverPermissionChange}
          />
          <Text style={{ marginTop: 13 }}>{text}</Text> */}
        </View>
      </View>
    </ScrollView>
  );
}
const Stack = createNativeStackNavigator();
function ManageUser({ navigation }) {
  return (
    <>
      {/* <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [
            styles.menuIcon,
            pressed && { opacity: 0.85 },
          ]}
          onPress={() => {
            navigation.openDrawer();
          }}
        >
          <Entypo name="menu" size={30} color="#283663" />
        </Pressable>

        <Text style={styles.headerText}>Manage User</Text>
      </View> */}
      {/* <NavigationContainer independent={true}> */}
      <Stack.Navigator
        initialRouteName="ManageUser"
        screenOptions={{
          headerStyle: {
            backgroundColor: "white",
          },
        }}
      >
        <Stack.Screen
          name="ManageUser"
          component={Screen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Edit Profile" component={EditProfileScreen} />
      </Stack.Navigator>
      {/* </NavigationContainer> */}
    </>
  );
}
const styles = StyleSheet.create({
  label: {
    color: "#72c6a1",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    fontSize: 15,
    // justifyContent: "center",
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    width: 300,
    marginVertical: 10,
    borderColor: "#283663",
    color: "#283663",
  },
  input2: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    width: 200,
    // marginVertical: 10,
    flex: 1,
    marginEnd: "10%",
    backgroundColor: "#283663",
    color: "white",
    borderColor: "#283663",
    marginBottom: -20,
  },
  banner: {
    display: "flex",
    flexDirection: "row-reverse",
    flex: 1,
    justifyContent: "flex-start",
  },
  userInfo: {
    lineHeight: 80,
    marginStart: 16,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    borderRadius: 200,
    height: 90,
    width: undefined,
    flexDirection: "row",
    flex: 5,
    justifyContent: "flex-start",
  },
  avatar: {
    height: 90,
    width: 90,
    borderRadius: 45,
  },
  avatar2: {
    height: 190,
    width: 190,
    borderRadius: 190,
  },
  image: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
  },
  text: {
    paddingTop: 30,
    fontWeight: "bold",
    fontSize: 30,
    textAlign: "center",
    color: "#283663",
  },
  text2: { flex: 1, flexWrap: "wrap", fontSize: 15, color: "#283663" },
  dumbass: {
    marginTop: 20,
    backgroundColor: "#6875B7",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  flatlist: {
    borderRadius: 20,
    backgroundColor: "white",
    marginTop: 30,
    padding: 10,
    marginBottom: 30,
  },
  dumbass2: {
    height: "100%",
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
  },
  item: {
    padding: 10,
    borderRadius: 10,
    justifyContent: "space-between",
  },
  button1: {
    borderRadius: 10,
    backgroundColor: "#72c6a1",
    alignItems: "center",
    height: 36,
    marginTop: 20,
    justifyContent: "center",

    width: 100,
  },
  button2: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 22,
    marginStart: 5,
    backgroundColor: "red",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
    marginBottom: 15,
  },
  menuIcon: {
    position: "absolute",
    left: 16,
    top: 50,
  },
  headerText: {
    fontSize: 23,
    color: "#283663",
  },
  addIconStyle: {
    position: "absolute",
    right: 16,
  },
});
export default ManageUser;
