import { images } from "../../../../assets/Assets";
import Icon from "react-native-vector-icons/AntDesign";
import { AntDesign } from "@expo/vector-icons";
import SwipeableFlatlist from "rn-gesture-swipeable-flatlist";
import React, { useCallback, useContext, useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import ModalSuccess from "../../Manager/Popup/ModalSuccess";
import ModalFail from "../../Manager/Popup/ModalFail";
import ModalConfirm from "../../Manager/Popup/ModalConfirm";
import {
  useRoute,
  useNavigation,
  NavigationContainer,
  useFocusEffect,
  useIsFocused,
} from "@react-navigation/native";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
  SafeAreaView,
  useWindowDimensions,
  Dimensions,
  TextInput,
  Alert,
  Pressable,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Button,
} from "react-native";
import * as NewModal from "react-native-modal";

import { SceneMap, TabView } from "react-native-tab-view";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DropDownPicker from "react-native-dropdown-picker";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import CheckBox from "expo-checkbox";
import { LogBox } from "react-native";
import axios, { formToJSON } from "axios";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import { AuthContext } from "../../../Store/authContex";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "../../../Componets/UI/Loading";
import MyModal from "../../../Componets/UI/MyModal";
import { useTranslation } from "react-i18next";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);
const standardConfig = {
  headers: {
    Authorization: "Bearer " + images.adminToken,
  },
};
const config = {
  headers: {
    Authorization: "Bearer " + images.adminToken,
  },
  params: { page: 1 },
};
let discountKey = 0;
let axiosDiscounts = [];
const getData = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    axiosDiscounts.length = 0;
    config.params.page = 1;
    let flag = true;

    do {
      const response = await axios.get(
        "https://coach-ticket-management-api.onrender.com/api/discounts",
        {
          headers: {
            Authorization: token,
          },
          params: { page: config.params.page },
        }
      );

      if (response.data.data.rows.length == 0) {
        flag = false;
      }
      discountKey = response.data.data.count;
      axiosDiscounts = axiosDiscounts.concat(response.data.data.rows);
      config.params.page++;
    } while (flag);
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
    } else if (error.request) {
      console.log(error.request.data);
    }
  }
};
let axiosUsers = [];
const getUsers = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    axiosUsers.length = 0;
    config.params.page = 1;
    let flag = true;
    do {
      const response = await axios.get(
        "https://coach-ticket-management-api.onrender.com/api/users",
        {
          headers: {
            Authorization: token,
          },
          params: { page: config.params.page },
        }
      );

      console.log(response.data.data);
      if (response.data.data.length == 0) {
        console.log("0");
        flag = false;
        console.log(flag);
      }
      axiosUsers = axiosUsers.concat(response.data.data);

      config.params.page++;
    } while (flag);
  } catch (error) {
    console.log("Error:" + error);
    if (error.response) {
      console.log("Response error: " + error.response.data);
    } else if (error.request) {
      console.log("Request error: " + error.request.data);
    }
  }
};
let axiosUserDiscounts = [];
let axiosOtherUsers = [];
const getUserDiscounts = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    axiosUserDiscounts.length = 0;
    config.params.page = 1;
    let flag = true;
    do {
      const response = await axios.get(
        "https://coach-ticket-management-api.onrender.com/api/userDiscounts",
        {
          headers: {
            Authorization: token,
          },
          params: { page: config.params.page },
        }
      );

      if (response.data.data.rows.length == 0) flag = false;
      axiosUserDiscounts = axiosUserDiscounts.concat(response.data.data.rows);

      //neu userDiscount.userId trung voi 1 user thi dua user do vao trong axiosDiscountUser

      axiosUserDiscounts.forEach((userDiscount) => {
        axiosUsers.forEach((user) => {
          if (userDiscount.userId == user.userId) {
            axiosUsers = axiosUsers.filter((u) => u.userId != user.userId);
            axiosOtherUsers.push(user);
          }
        });
      });

      config.params.page++;
    } while (flag);
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
    } else if (error.request) {
      console.log(error.request.data);
    }
  }
};

let otherUserDropDownItems = [];

let systemDiscountItems = [];
const init = () => {
  otherUserDropDownItems.length = 0;
  systemDiscountItems.length = 0;
  axiosUsers.forEach((otherUser) => {
    const newItem = {
      label: otherUser.userId + ". " + otherUser.fullName,
      value: otherUser.userId,
    };
    otherUserDropDownItems.push(newItem);
  });
  axiosDiscounts.forEach((discount) => {
    const newItem = {
      label: discount.key + ": " + discount.title + ` ${discount.value * 100}%`,
      value: discount.id,
    };
    systemDiscountItems.push(newItem);
  });
};

const Stack = createNativeStackNavigator();

const EditDiscount = function ({ navigation }) {
  const { t } = useTranslation();
  const route = useRoute();
  const item = route.params;
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [name, setName] = useState(item.title);
  const [value, setValue] = useState(item.value);
  const [items, setItems] = useState([
    { label: "5%", value: 0.05 },
    { label: "10%", value: 0.1 },
    { label: "15%", value: 0.15 },
    { label: "20%", value: 0.2 },
    { label: "25%", value: 0.25 },
    { label: "30%", value: 0.3 },
    { label: "35%", value: 0.35 },
    { label: "40%", value: 0.4 },
    { label: "45%", value: 0.45 },
    { label: "50%", value: 0.5 },
    { label: "55%", value: 0.55 },
    { label: "60%", value: 0.6 },
    { label: "65%", value: 0.65 },
    { label: "70%", value: 0.7 },
    { label: "75%", value: 0.75 },
    { label: "80%", value: 0.8 },
    { label: "85%", value: 0.85 },
  ]);

  const [quantity, setQuantity] = useState(item.quantity);
  const labelFrom1To50 = [];
  for (let i = 1; i <= 50; i++) {
    labelFrom1To50.push({ label: `${i}`, value: i });
  }
  const [quantityItem, setQuantityItems] = useState(labelFrom1To50);
  const [maximum, setMaximum] = useState(item.maximumdiscountprice);
  const [minimum, setMinimum] = useState(item.minimumpricetoapply);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const formatDate = (rawdate) => {
    const date = new Date(rawdate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const [expiredDate, setExpiredDate] = useState(formatDate(item.expireDate));

  const toggleDatePicker = function () {
    setShowDatePicker(!showDatePicker);
  };
  const dateChange = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setDate(currentDate);
      if (Platform.OS == "android") {
        toggleDatePicker();
        setExpiredDate(formatDate(currentDate));
      }
    } else {
      toggleDatePicker();
    }
  };
  function confirmIOSDate() {
    console.log("expired date:", expiredDate);
    setExpiredDate(formatDate(date));
    toggleDatePicker();
  }
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        {/* <Pressable
          style={{ top: 10, left: 16, position: "absolute", zIndex: 1000 }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons name="arrow-back" size={30} color="#283663"></Ionicons>
        </Pressable> */}
        <Text
          style={{
            fontSize: 20,
            fontWeight: "600",
            marginTop: 10,
            marginBottom: -20,
            alignSelf: "center",
          }}
        >
          {t("edit-discount")}
        </Text>
        <View
          style={[styles.discountInfo, { position: "relative", marginTop: 20 }]}
        >
          <TextInput
            placeholder={t("name")}
            value={name}
            onChangeText={setName}
            style={styles.input}
          ></TextInput>
          <DropDownPicker
            placeholder={t("select-discount-value")}
            style={styles.input}
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            containerStyle={{ zIndex: 1000, width: 340 }}
          ></DropDownPicker>
          <DropDownPicker
            placeholder={t("select-quantity")}
            style={styles.input}
            value={quantity}
            setValue={setQuantity}
            open={open2}
            setOpen={setOpen2}
            items={quantityItem}
            setItems={setQuantityItems}
            containerStyle={{ zIndex: 1, width: 340 }}
          ></DropDownPicker>
          <Pressable
            onPress={(e) => {
              toggleDatePicker();
            }}
            style={[styles.input]}
          >
            <Text
              placeholder={t("expiration-date")}
              // style={styles.input}
              style={[
                { paddingTop: 5 },
                expiredDate
                  ? { color: "black" }
                  : {
                      color: "black",
                      opacity: 0.3,
                    },
              ]}
              value={expiredDate}
              onChangeText={setExpiredDate}
              editable={false}
            >
              {expiredDate ? expiredDate : t("expiration-date")}
            </Text>
          </Pressable>
          <View>
            <Modal
              visible={showDatePicker}
              animationType="slide"
              onRequestClose={() => setShowDatePicker(false)}
              transparent={true}
            >
              <View
                style={{
                  height: "100%",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    borderRadius: 10,
                    borderWidth: 1.3,
                    borderColor: "green",
                  }}
                >
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date ? new Date(date) : new Date()}
                    mode={"date"}
                    onChange={dateChange}
                    display="inline"
                    accentColor="orange"
                    textColor="black"
                    themeVariant="light"
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                    }}
                  >
                    <TouchableOpacity
                      onPress={toggleDatePicker}
                      style={[
                        {
                          height: 50,
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 50,
                          marginTop: 10,
                          marginBottom: 15,
                          backgroundColor: GlobalColors.button,
                          paddingHorizontal: 20,
                        },
                        { backgroundColor: "#11182711" },
                      ]}
                    >
                      <Text
                        style={[
                          {
                            fontSize: 14,
                            fontWeight: "500",
                            color: "#fff",
                          },
                          { color: "#075985" },
                        ]}
                      >
                        {t("cancel")}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={confirmIOSDate}
                      style={[
                        {
                          height: 50,
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 50,
                          marginTop: 10,
                          marginBottom: 15,
                          backgroundColor: GlobalColors.button,
                          paddingHorizontal: 20,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          {
                            fontSize: 14,
                            fontWeight: "500",
                            color: "#fff",
                          },
                        ]}
                      >
                        {t("confirm")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
          <TextInput
            placeholder={t("minimum-price")}
            value={minimum + ""}
            onChangeText={setMinimum}
            style={styles.input}
            keyboardType="numeric"
          ></TextInput>
          <TextInput
            placeholder={t("maximum-price")}
            value={maximum + ""}
            onChangeText={setMaximum}
            style={styles.input}
            keyboardType="numeric"
          ></TextInput>
        </View>
        <View
          style={{
            alignItems: "center",
            zIndex: -1,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={[
              styles.input,
              {
                backgroundColor: "#b9b306",
                width: 100,
                borderWidth: 0.5,
                height: 40,
                justifyContent: "center",
              },
            ]}
            disabled={value == null || quantity == null}
            onPress={() => navigation.goBack()}
          >
            <Text
              style={{
                fontSize: 18,
                color: "#f9fdffff",
                fontWeight: "900",
                textAlign: "center",
              }}
            >
              Back
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.input,
              {
                backgroundColor: "#3fe077",
                width: 100,
                borderWidth: 0.5,
                height: 40,
              },
            ]}
            disabled={value == null || quantity == null}
            onPress={async () => {
              const newDiscount2 = {
                value: value,
                title: name,
                expireDate: date,
                quantity: quantity,
                minimumpricetoapply: minimum,
                maximumdiscountprice: maximum,
              };
              const token = await AsyncStorage.getItem("token");
              const config = {
                headers: {
                  Authorization: token,
                },
              };
              axios
                .patch(
                  "https://coach-ticket-management-api.onrender.com/api/discounts/" +
                    item.id,
                  newDiscount2,
                  config
                )
                .then((response) => {
                  console.log(response.data);
                  console.log("Update discount successfully");
                })
                .catch((error) => {
                  if (error.request) {
                    console.log(error.request);
                  }
                  if (error.response) {
                    console.log(error.response.data);
                  }
                });
              navigation.goBack();
            }}
          >
            <Text
              style={{
                fontSize: 17,
                color: "#f9fdffff",
                fontWeight: "900",
                textAlign: "center",
              }}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

let allDiscounts = [];
const User = function ({ navigation }) {
  const { t } = useTranslation();
  let axiosGoldUser = [];

  let axiosSilverUser = [];
  let axiosBronzeUser = [];
  const [goldUser, setGoldUser] = useState(axiosGoldUser);
  const [silverUser, setSilverUser] = useState(axiosSilverUser);
  const [bronzeUser, setBronzeUser] = useState([]);

  const [value, setValue] = useState(null);
  const [open, setOpen] = useState(false);
  const [goldOpen, setGoldOpen] = useState(false);
  const [silverOpen, setSilverOpen] = useState(false);
  const [bronzeOpen, setBronzeOpen] = useState(false);
  const [items, setItems] = useState(otherUserDropDownItems);
  const [systemDiscountValue, setSystemDiscountValue] = useState(null);
  const [discountopen, setdiscountopen] = useState(false);
  const [discountItems, setDiscountItems] = useState(systemDiscountItems);
  const [discountedUser, setdiscountedUser] = useState(axiosOtherUsers);
  const [modalVisible, setModalVisible] = useState(false);
  const isFocused = useIsFocused();
  const [addDiscountFlag, setAddDiscountFlag] = useState(false);

  const reload = async () => {
    await getData().then(() => {
      allDiscounts = axiosDiscounts;
      getUsers()
        .then(() => {
          if (axiosUsers.length > 0) {
            const gold = axiosUsers.filter(
              (user) => user.UserAccountData.memberShipId == "3"
            );
            const silver = axiosUsers.filter(
              (user) => user.UserAccountData.memberShipId == "2"
            );

            const bronze = axiosUsers.filter(
              (user) => user.UserAccountData.memberShipId == "1"
            );
            axiosBronzeUser = [];
            axiosBronzeUser.push(bronze);

            setBronzeUser(bronze);
            getUserDiscounts().then(() => {
              silver.forEach((user) => {
                user.isChecked = false;
                user.discountList = [];
                axiosUserDiscounts.forEach((userDiscount) => {
                  console.log("i. " + user.userId, userDiscount.userId);
                  if (user.userId == userDiscount.userId) {
                    user.discountList.push(userDiscount.DiscountData);
                  }
                });
              });
              gold.forEach((user) => {
                user.isChecked = false;
                user.discountList = [];
                axiosUserDiscounts.forEach((userDiscount) => {
                  if (user.userId == userDiscount.userId) {
                    user.discountList.push(userDiscount.DiscountData);
                  }
                });
              });
              setGoldUser(gold);
              setSilverUser(silver);
              init();
              setDiscountItems(systemDiscountItems);
            });
          }
        })
        .catch((error) => {
          console.log("I'm a success, I can't be touched!" + error);
        });
    });
  };
  useEffect(() => {
    if (isFocused) {
      const load = async () => {
        await reload();
      };
      load();
      // getData().then(() => {
      //   allDiscounts = axiosDiscounts;
      //   getUsers()
      //     .then(() => {
      //       if (axiosUsers.length > 0) {
      //         const gold = axiosUsers.filter(
      //           (user) => user.UserAccountData.memberShipId == "3"
      //         );
      //         const silver = axiosUsers.filter(
      //           (user) => user.UserAccountData.memberShipId == "2"
      //         );

      //         const bronze = axiosUsers.filter(
      //           (user) => user.UserAccountData.memberShipId == "1"
      //         );
      //         axiosBronzeUser.push(bronze);

      //         setBronzeUser(bronze);
      //         console.log("Length " + bronze.length);
      //         getUserDiscounts().then(() => {
      //           silver.forEach((user) => {
      //             user.isChecked = false;
      //             user.discountList = [];
      //             axiosUserDiscounts.forEach((userDiscount) => {
      //               console.log("i. " + user.userId, userDiscount.userId);
      //               if (user.userId == userDiscount.userId) {
      //                 user.discountList.push(userDiscount.DiscountData);
      //               }
      //             });
      //           });
      //           gold.forEach((user) => {
      //             user.isChecked = false;
      //             user.discountList = [];
      //             axiosUserDiscounts.forEach((userDiscount) => {
      //               if (user.id == userDiscount.userId) {
      //                 user.discountList.push(userDiscount.DiscountData);
      //               }
      //             });
      //           });
      //           setGoldUser(gold);
      //           setSilverUser(silver);
      //           console.log("Silver user update: " + silver);
      //           init();
      //           setDiscountItems(systemDiscountItems);
      //           console.log("Successful! w");
      //           console.log(axiosOtherUsers);
      //         });
      //       }
      //     })
      //     .catch((error) => {
      //       console.log("I'm a success, I can't be touched!" + error);
      //     });
      // });
    }
  }, [isFocused]);
  const memberships = [
    {
      id: 3,
      name: t("gold"),
      color: "#ffd700",
    },
    {
      id: 2,
      name: t("silver"),
      color: "#c0c0c0",
    },
    {
      id: 1,
      name: t("bronze"),
      color: "#cd7f32",
    },
  ];
  const [membershipFlag, setMembershipFlag] = useState(0);
  const [silverAllChecked, setSilverAllChecked] = useState(false);
  const [goldAllChecked, setGoldAllChecked] = useState(false);

  return (
    <>
      {modalVisible && (
        <View
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "absolute",
          }}
        >
          <NewModal.default
            // animationType="fade"
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
            }}
            backdropOpacity={0.7}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#fffafa",
                  padding: 20,
                  borderRadius: 30,
                  width: 330,
                  height: 260,
                  zIndex: 1,
                  borderWidth: 1.5,
                  borderColor: "black",
                }}
              >
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", color: "blue" }}
                >
                  Discounts
                </Text>
                <View style={styles.centeredView}>
                  <DropDownPicker
                    style={styles.input}
                    open={discountopen}
                    value={systemDiscountValue}
                    items={discountItems}
                    setItems={setDiscountItems}
                    setValue={setSystemDiscountValue}
                    setOpen={setdiscountopen}
                  ></DropDownPicker>
                  <View style={{ flexDirection: "row-reverse" }}>
                    <TouchableOpacity
                      onPress={async () => {
                        const token = await AsyncStorage.getItem("token");
                        if (membershipFlag == 2) {
                          silverUser.forEach((silver) => {
                            if (!silver.isChecked) return;
                            const x = silver.userId + "";
                            const y = systemDiscountValue + "";
                            const newUserDiscount = {
                              userId: [`${x}`],
                              discountId: [`${y}`],
                            };

                            axios
                              .post(
                                `${images.apiLink}userDiscounts`,
                                newUserDiscount,
                                {
                                  headers: {
                                    Authorization: token,
                                  },
                                }
                              )
                              .then((response) => {
                                Alert.alert(t("add-success"));
                                axios
                                  .get(`${images.apiLink}userDiscounts`, {
                                    headers: {
                                      Authorization: token,
                                    },
                                    params: {
                                      userId: silver.userId,
                                      discountId: systemDiscountValue,
                                    },
                                  })
                                  .then((response) => {
                                    const newlyAdded =
                                      response.data.data.rows[0].DiscountData;
                                    silver.discountList.push(newlyAdded);
                                  })
                                  .catch((error) => {
                                    if (error.request) {
                                      console.log(error.request);
                                    }
                                    if (error.response) {
                                      console.log(error.response);
                                      Alert.alert(error.response.message);
                                    }
                                  });
                                setModalVisible(!modalVisible);
                              })
                              .catch((error) => {
                                if (error.request) {
                                  console.log(error.request);
                                }
                                if (error.response) {
                                  console.log(error.response);
                                  Alert.alert(error.response.message);
                                }
                              });
                          });
                        } else if (membershipFlag == 3) {
                          goldUser.forEach((gold) => {
                            if (!gold.isChecked) return;
                            const newUserDiscount = {
                              userId: [`${gold.userId}`],
                              discountId: [`${systemDiscountValue}`],
                            };

                            axios
                              .post(
                                `${images.apiLink}userDiscounts`,
                                newUserDiscount,
                                {
                                  headers: {
                                    Authorization: token,
                                  },
                                }
                              )
                              .then(async (response) => {
                                Alert.alert(t("add-success"));
                                axios
                                  .get(`${images.apiLink}userDiscounts`, {
                                    headers: {
                                      Authorization: token,
                                    },
                                    params: {
                                      userId: gold.userId,
                                      discountId: systemDiscountValue,
                                    },
                                  })
                                  .then((response) => {
                                    console.log(response.data.data.rows);

                                    const newlyAdded =
                                      response.data.data.rows[0].DiscountData;
                                    gold.discountList =
                                      gold.discountList.concat(newlyAdded);
                                  })
                                  .catch((error) => {
                                    console.log(error);
                                    if (error.request) {
                                      console.log(error.request);
                                    }
                                    if (error.response) {
                                      console.log(error.response);
                                      Alert.alert(error.response.message);
                                    }
                                  });
                                setModalVisible(!modalVisible);
                                setAddDiscountFlag(!addDiscountFlag);
                              })
                              .catch((error) => {
                                if (error.request) {
                                  console.log(error.request);
                                }
                                if (error.response) {
                                  console.log(error.response);
                                  Alert.alert(error.response.message);
                                }
                              });
                          });
                        }
                      }}
                      style={[
                        styles.input,
                        {
                          backgroundColor: "#8ebf59",
                          width: 100,
                          borderColor: "transparent",
                          height: 40,
                        },
                      ]}
                      disabled={systemDiscountValue == null}
                    >
                      <Text style={{ textAlign: "center", color: "#ffffff" }}>
                        {t("add")}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible(!modalVisible);
                      }}
                      style={[
                        styles.input,
                        {
                          backgroundColor: "red",
                          width: 100,
                          height: 40,
                          borderColor: "transparent",
                        },
                      ]}
                    >
                      <Text style={{ textAlign: "center", color: "#ffffff" }}>
                        {t("cancel")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </NewModal.default>
        </View>
      )}

      <ScrollView style={styles.container}>
        <View
          style={{
            marginStart: 30,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: "white",
          }}
        >
          <View
            style={{
              marginLeft: -10,
              padding: 5,
              marginTop: 5,
              borderRadius: 10,
            }}
          >
            <View
              style={{
                backgroundColor: "purple",
                padding: 5,
                borderRadius: 10,
                alignSelf: "center",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 18,
                  color: "#f1e9e6",
                  fontWeight: "bold",
                }}
              >
                {t("memberships")}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ padding: 20, paddingTop: 0 }}>
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                margin: 20,
                marginHorizontal: 10,
                borderWidth: 2,
                borderColor: "orange",
                padding: 5,
                borderRadius: 10,
                marginLeft: 5,
              }}
            >
              <TouchableOpacity>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: memberships[0].color,
                  }}
                  onPress={() => {
                    setSilverOpen(false);
                    setGoldOpen(!goldOpen);
                  }}
                >
                  {memberships[0].name}
                </Text>
              </TouchableOpacity>
              {/* <CheckBox
              style={{ marginLeft: 5 }}
              value={goldAllChecked}
              onValueChange={(value) => {
                setGoldUser((goldUser) =>
                  goldUser.map((user) => {
                    return {
                      ...user,
                      isChecked: value,
                    };
                  })
                );
                setGoldAllChecked(!goldAllChecked);
              }}
            ></CheckBox> */}
              <AntDesign
                name="pluscircle"
                size={24}
                color={memberships[0].color}
                onPress={() => {
                  if (
                    goldUser.length == 0 ||
                    goldUser.every((user) => user.isChecked == false)
                  ) {
                    return;
                  }
                  setModalVisible(true);
                  setMembershipFlag(3);
                }}
              />
            </View>
            {goldOpen && goldUser.length === 0 && (
              <View
                style={{
                  borderRadius: 5,
                  padding: 3,
                  backgroundColor: "#989393",
                  width: "50%",
                  alignSelf: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    opacity: 0.6,
                    fontSize: 16,
                    fontWeight: "500",
                    textAlign: "center",
                  }}
                >
                  The list of gold members is empty!!!
                </Text>
              </View>
            )}
            {goldOpen && goldUser.length !== 0 && (
              <View style={styles.flatlist}>
                {goldOpen != 0 &&
                  goldUser.map((item, index) => {
                    return (
                      <View
                        key={item.userId + index}
                        style={{
                          flexDirection: "row",
                          flex: 1,
                          justifyContent: "space-around",
                          gap: 5,
                          alignItems: "center",
                        }}
                      >
                        <TouchableOpacity
                          style={styles.userItem}
                          onPress={
                            () => {
                              navigation.navigate("User Discount", {
                                userId: item.userId,
                                discountList: item.discountList,
                                username: item.UserAccountData.userName,
                                avatar: item.UserAccountData.avatar,
                                color: memberships[0].color,
                              });
                            }
                            // navigation.navigate("User Discount", {
                            //   discountList: item.discountList,
                            //   username: item.Name,
                            //   avatar: item.imageLink,
                            // })
                          }
                        >
                          <Text
                            style={{
                              margin: 10,
                              position: "absolute",
                              left: 0,
                              top: 0,
                              fontWeight: "600",
                            }}
                          >
                            {item.userId}
                          </Text>
                          <View
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                              marginTop: 5,
                            }}
                          >
                            <TouchableHighlight>
                              <Image
                                source={{ uri: item.UserAccountData.avatar }}
                                style={styles.avatar}
                              ></Image>
                            </TouchableHighlight>
                          </View>
                          <View
                            style={[
                              styles.avatarContainer,
                              {
                                marginTop: 5,
                              },
                            ]}
                          >
                            <View style={{ marginRight: 14, gap: 10 }}>
                              <Text style={[styles.text2, { fontSize: 13 }]}>
                                {" "}
                                {t("name")}:{" "}
                                <Text style={{ fontWeight: "bold" }}>
                                  {item.fullName}
                                </Text>
                              </Text>
                              <Text
                                style={[
                                  styles.text2,
                                  { width: 200, fontSize: 13 },
                                ]}
                              >
                                {" "}
                                {t("phone-number")}: {item.phoneNumber}
                              </Text>
                              <Text
                                style={[
                                  styles.text2,
                                  { width: 220, fontSize: 13 },
                                ]}
                              >
                                {" "}
                                Email: {item.email}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                        <CheckBox
                          style={{ marginLeft: 5 }}
                          value={item.isChecked}
                          onValueChange={() => {
                            setGoldUser((goldUser) =>
                              goldUser.map((user) =>
                                item.id === user.id
                                  ? {
                                      ...user,
                                      isChecked: !user.isChecked,
                                    }
                                  : user
                              )
                            );
                          }}
                        ></CheckBox>
                      </View>
                    );
                  })}
              </View>
            )}
          </View>
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                margin: 20,
                marginHorizontal: 10,
                borderWidth: 2,
                borderColor: "silver",
                padding: 5,
                borderRadius: 10,
                marginLeft: 5,
              }}
            >
              <TouchableOpacity>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: memberships[1].color,
                  }}
                  onPress={() => {
                    setSilverOpen(!silverOpen);
                    setGoldOpen(false);
                  }}
                >
                  {memberships[1].name}
                </Text>
              </TouchableOpacity>
              {/* <CheckBox
              style={{ marginLeft: 5 }}
              value={silverAllChecked}
              onValueChange={(value) => {
                setSilverUser((silverUser) =>
                  silverUser.map((user) => {
                    return {
                      ...user,
                      isChecked: value,
                    };
                  })
                );
                setSilverAllChecked(!silverAllChecked);
              }}
            ></CheckBox> */}
              <AntDesign
                name="pluscircle"
                size={24}
                color={memberships[1].color}
                onPress={() => {
                  if (
                    silverUser.length == 0 ||
                    silverUser.every((user) => user.isChecked == false)
                  ) {
                    return;
                  }
                  setMembershipFlag(2);

                  setModalVisible(true);
                }}
              />
            </View>
            {silverOpen && silverUser.length === 0 && (
              <View
                style={{
                  borderRadius: 5,
                  padding: 3,
                  backgroundColor: "#989393",
                  width: "50%",
                  alignSelf: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    opacity: 0.6,
                    fontSize: 16,
                    fontWeight: "500",
                    textAlign: "center",
                  }}
                >
                  The list of silver members is empty!!!
                </Text>
              </View>
            )}
            {silverOpen && silverUser.length !== 0 && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginHorizontal: 10,
                  marginLeft: 15,
                  marginBottom: -20,
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    marginLeft: 150,
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                >
                  All
                </Text>
                <CheckBox
                  style={{ marginLeft: 5 }}
                  value={silverAllChecked}
                  onValueChange={(value) => {
                    setSilverUser((silverUser) =>
                      silverUser.map((user) => {
                        return {
                          ...user,
                          isChecked: value,
                        };
                      })
                    );
                    setSilverAllChecked(!silverAllChecked);
                  }}
                ></CheckBox>
              </View>
            )}
            <View style={styles.flatlist}>
              {silverOpen &&
                silverUser.map((item, index) => {
                  return (
                    <View
                      key={item.userId + index}
                      style={{
                        flexDirection: "row",
                        flex: 1,
                        justifyContent: "space-around",
                        gap: 5,
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity
                        style={styles.userItem}
                        onPress={
                          () => {
                            navigation.navigate("User Discount", {
                              userId: item.userId,
                              discountList: item.discountList,
                              username: item.UserAccountData.userName,
                              avatar: item.UserAccountData.avatar,
                              color: memberships[1].color,
                            });
                          }
                          // navigation.navigate("User Discount", {
                          //   discountList: item.discountList,
                          //   username: item.Name,
                          //   avatar: item.imageLink,
                          // })
                        }
                      >
                        <Text
                          style={{
                            margin: 10,
                            position: "absolute",
                            left: 0,
                            top: 0,
                            fontWeight: "600",
                          }}
                        >
                          {item.userId}
                        </Text>
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 5,
                          }}
                        >
                          <TouchableHighlight>
                            <Image
                              source={{ uri: item.UserAccountData.avatar }}
                              style={styles.avatar}
                            ></Image>
                          </TouchableHighlight>
                        </View>
                        <View
                          style={[
                            styles.avatarContainer,
                            {
                              marginTop: 5,
                            },
                          ]}
                        >
                          <View style={{ marginRight: 14, gap: 10 }}>
                            <Text style={[styles.text2, { fontSize: 13 }]}>
                              {" "}
                              {t("name")}:{" "}
                              <Text style={{ fontWeight: "bold" }}>
                                {item.fullName}
                              </Text>
                            </Text>
                            <Text
                              style={[
                                styles.text2,
                                { width: 200, fontSize: 13 },
                              ]}
                            >
                              {" "}
                              {t("phone-number")}: {item.phoneNumber}
                            </Text>
                            <Text
                              style={[
                                styles.text2,
                                { width: 220, fontSize: 13 },
                              ]}
                            >
                              {" "}
                              Email: {item.email}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                      <CheckBox
                        style={{ marginLeft: 1 }}
                        value={item.isChecked}
                        onValueChange={() => {
                          setSilverUser((silverUser) =>
                            silverUser.map((user) =>
                              item.id === user.id
                                ? {
                                    ...user,
                                    isChecked: !user.isChecked,
                                  }
                                : user
                            )
                          );
                        }}
                      ></CheckBox>
                    </View>
                  );
                })}
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const getColor = (item) => {
  return item.color;
};

const UsersDiscount = function ({ navigation }) {
  const { t } = useTranslation();
  const route = useRoute();
  console.log(route);
  const [discount, setDiscount] = useState(
    route.params.discountList.map((discount) => ({
      ...discount,
      isChecked: false,
    }))
  );
  const color = route.params.color;
  const userId = route.params.userId;
  console.log("User id: " + userId);
  const [currID, setCurrID] = useState(4);
  const allUnchecked = discount.every((discount) => !discount.isChecked);
  const [modalVisible, setModalVisible] = useState(false);
  const [systemDiscountValue, setSystemDiscountValue] = useState(null);
  const [discountopen, setdiscountopen] = useState(false);
  const [discountItems, setDiscountItems] = useState(systemDiscountItems);
  const [quantity, setQuantity] = useState(0);
  const labelFrom1To50 = [];
  for (let i = 1; i <= 50; i++) {
    labelFrom1To50.push({ label: `${i}`, value: i });
  }
  const [quantityItem, setQuantityItems] = useState(labelFrom1To50);
  const renderUserDiscountItem = ({
    item,
    discount,
    setDiscount,
    color,
    userId,
  }) => {
    return (
      <Swipeable
        renderRightActions={() => (
          <TouchableOpacity
            onPress={async () => {
              const c = {
                id: [`${item.id}`],
              };
              const token = await AsyncStorage.getItem("token");

              const standardConfig2 = {
                headers: {
                  Authorization: token,
                },
                data: c,
              };
              axios
                .delete(
                  `${images.apiLink}userDiscounts/${userId}`,
                  standardConfig2
                )
                .then(() => {
                  const updatedUserDiscount = discount.filter(
                    (dc) => dc.id != item.id
                  );
                  setDiscount(updatedUserDiscount);
                  Alert.alert(t("delete-success"));
                })
                .catch((error) => {
                  if (error.request) {
                    console.log(error.request);
                  }
                  if (error.response) {
                    console.log(error.response);
                  }
                });
            }}
            style={{
              backgroundColor: "transparent",
              padding: 50,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: "red" }}>{t("delete")}</Text>
          </TouchableOpacity>
        )}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            key={item.key}
            style={[
              styles.discountitem,
              {
                backgroundColor: color,
                padding: 20,
                margin: 20,
                borderTopLeftRadius: 10,
                borderBottomRightRadius: 10,
              },
              item.quantity <= 2
                ? { backgroundColor: "red" }
                : { backgroundColor: "green" },
            ]}
            onPress={() => {
              console.log("Hello");
            }}
          >
            <View style={{ gap: 5 }}>
              <Text style={{ fontWeight: 600, fontSize: 20, color: "white" }}>
                {item.title}
              </Text>
              <Text style={{ color: "white", fontWeight: "500" }}>
                {item.value * 100}% discount
              </Text>
            </View>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text
                style={[
                  { textAlign: "right", fontWeight: "500" },
                  item.quantity <= 2
                    ? { color: "yellow" }
                    : { color: "#0cdd74" },
                ]}
              >
                {item.quantity} {t("remaining")}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Swipeable>
    );
  };
  return (
    <View>
      <Modal
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <DropDownPicker
            style={styles.input}
            open={discountopen}
            value={quantity}
            items={quantityItem}
            setItems={setQuantityItems}
            setValue={setQuantity}
            setOpen={setdiscountopen}
          ></DropDownPicker>
          <TouchableOpacity
            onPress={() => {}}
            style={[
              styles.input,
              {
                backgroundColor: "#23f3a1",
                width: 100,
                borderColor: "transparent",
              },
            ]}
            disabled={quantity == ""}
          >
            <Text style={{ textAlign: "center", color: "#ffffff" }}>
              {t("add-quantity")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
            style={[
              styles.input,
              {
                backgroundColor: "red",
                width: 100,
                borderColor: "transparent",
              },
            ]}
          >
            <Text style={{ textAlign: "center", color: "#ffffff" }}>
              {t("cancel")}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          margin: 20,
        }}
      >
        <Pressable
          style={{ left: 0, position: "absolute", top: 0 }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons name="arrow-back" size={30} color="#283663"></Ionicons>
        </Pressable>
        <View style={{ marginLeft: 125, alignItems: "center" }}>
          <Image
            source={{ uri: route.params.avatar }}
            style={{ width: 70, height: 70, borderRadius: 70 }}
          ></Image>
          <Text style={{ fontSize: 22, fontWeight: 800, marginTop: 10 }}>
            {route.params.username}
          </Text>
        </View>
        {/* <AntDesign
          style={{}}
          name="pluscircle"
          size={24}
          color="black"
          onPress={() =>
            navigation.navigate("Add Discount", {
              addDiscount: setDiscount,
              userId: route.params.userId,
            })
          }
        /> */}
      </View>
      <View style={{ borderRadius: 30 }}>
        {/* <TouchableOpacity
          onPress={() => {}}
          style={{
            backgroundColor: "#20b2aa",
            padding: 10,
            borderRadius: 20,
            marginHorizontal: 250,
            width: 80,
          }}
        >
          <Text
            style={{ textAlign: "center", color: "white", fontWeight: "bold" }}
          >
            Add
          </Text>
        </TouchableOpacity> */}
        <FlatList
          style={{ marginBottom: 100 }}
          data={discount}
          renderItem={({ item }) =>
            renderUserDiscountItem({
              item,
              discount,
              setDiscount,
              color,
              userId,
            })
          }
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 150 }}
          ListFooterComponent={<View style={{ height: 70 }} />}
        ></FlatList>
      </View>
    </View>
  );
};
const System = function () {
  axiosDiscounts = [];
  const colors = ["#FFD700", "#a24fbc", "#bc6666"];
  const [discount, setDiscount] = useState([]);
  const { t } = useTranslation();
  useFocusEffect(
    useCallback(() => {
      async function fetch() {
        console.log("Hell yeah! Sir");
        await getData().then(() => {
          console.log("Axios disount" + axiosDiscounts);
          setDiscount(axiosDiscounts);
        });
      }
      fetch();
    }, [])
  );
  discount.forEach((item, index) => {
    item.color = colors[index % 3];
    item.isChecked = false;
  });
  const [currID, setCurrID] = useState(4);
  const navigation = useNavigation();
  const [visibleSuccess, setVisibleSuccess] = useState(false);
  const showSuccess = () => {
    setVisibleSuccess(true);
  };
  const hideSuccess = () => {
    setVisibleSuccess(false);
  };

  const [visibleFail, setVisibleFail] = useState(false);
  const showFail = () => {
    setVisibleFail(true);
  };
  const hideFail = () => {
    setVisibleFail(false);
  };
  const contentSuccess = t("delete-discount-success");
  const contentFail = t("delete-discount-failed");
  const deleteDiscount = async function (discount, item, setDiscount) {
    //discount is the list of discounts
    const token = await AsyncStorage.getItem("token");

    const delConfig = {
      headers: {
        Authorization: token,
      },
    };
    axios
      .delete(`${images.apiLink}discounts/${item.id}`, delConfig)
      .then((response) => {
        Alert.prompt(t("delete-success"));
        const updateDiscount = discount.filter((i) => i.id != item.id);
        setDiscount(updateDiscount);
        showSuccess();
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request.data);
        }
        showFail();
      });
  };
  const renderDiscountItem = ({ item, navigation, discount, setDiscount }) => {
    // const { t } = useTranslation();
    return (
      <Swipeable
        renderRightActions={(item2) => (
          <TouchableOpacity
            onPress={() => {
              deleteDiscount(discount, item, setDiscount);
            }}
            style={{ backgroundColor: "transparent", padding: 20 }}
          >
            <Text style={{ color: "red" }}>{t("delete")}</Text>
          </TouchableOpacity>
        )}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Edit Discount", item);
          }}
          key={item.key}
          style={[
            styles.discountitem,
            {
              backgroundColor: getColor(item),
              padding: 20,
              margin: 20,
              borderTopLeftRadius: 10,
              borderBottomRightRadius: 10,
            },
            item.quantity <= 2
              ? { backgroundColor: "red" }
              : { backgroundColor: "green" },
          ]}
        >
          <View>
            <Text
              style={{
                fontWeight: 600,
                fontSize: 25,
                maxWidth: 220,
                marginBottom: 10,
                color: "white",
              }}
            >
              {item.title}
            </Text>
            <Text
              style={{
                color: "white",
              }}
            >
              {item.value * 100}% discount
            </Text>
          </View>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text
              style={[
                { textAlign: "right" },
                item.quantity <= 2 ? { color: "yellow" } : { color: "#0cdd74" },
              ]}
            >
              {item.quantity} {t("remaining")}
            </Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };
  return (
    <View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          marginTop: 15,
        }}
      >
        <ModalSuccess
          visible={visibleSuccess}
          hide={hideSuccess}
          content={contentSuccess}
        />
        <ModalFail
          visible={visibleFail}
          hide={hideFail}
          content={contentFail}
        />
        <Text style={styles.text}>{t("list-of-discounts")}</Text>
        <AntDesign
          style={{}}
          name="pluscircle"
          size={24}
          color="black"
          onPress={() =>
            navigation.navigate("Add Discount", {
              addDiscount: setDiscount,
              currID: currID,
              setCurrID: setCurrID,
            })
          }
        />
      </View>
      {
        <SafeAreaView style={{ borderRadius: 30, marginBottom: 140 }}>
          {/* {discount.map((item) =>
          renderDiscountItem({ item, navigation, discount, setDiscount })
        )} */}
          {discount.length === 0 && (
            <View style={{ height: "100%", width: "100%" }}>
              <Loading />
            </View>
          )}

          {discount.length !== 0 && (
            <FlatList
              data={discount}
              renderItem={({ item }) =>
                renderDiscountItem({ item, navigation, discount, setDiscount })
              }
              keyExtractor={(item) => item.id + Date.now().toString()}
              contentContainerStyle={{ paddingBottom: 150, marginBottom: 140 }}
              // renderLeftActions={renderLeftActions}
              // renderRightActions={renderRightActions}
            ></FlatList>
          )}
        </SafeAreaView>
      }
    </View>
  );
};
function AddDiscount({ navigation }) {
  const { t } = useTranslation();
  const [dname, setName] = useState("");
  const [value, setValue] = useState(null);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const [quantity, setQuantity] = useState(null);
  const [items, setItems] = useState([
    { label: "5%", value: 0.05 },
    { label: "10%", value: 0.1 },
    { label: "15%", value: 0.15 },
    { label: "20%", value: 0.2 },
    { label: "25%", value: 0.25 },
    { label: "30%", value: 0.3 },
    { label: "35%", value: 0.35 },
    { label: "40%", value: 0.4 },
    { label: "45%", value: 0.45 },
    { label: "50%", value: 0.5 },
    { label: "55%", value: 0.55 },
    { label: "60%", value: 0.6 },
    { label: "65%", value: 0.65 },
    { label: "70%", value: 0.7 },
    { label: "75%", value: 0.75 },
    { label: "80%", value: 0.8 },
    { label: "85%", value: 0.85 },
  ]);
  const labelFrom1To50 = [];
  for (let i = 1; i <= 50; i++) {
    labelFrom1To50.push({ label: `${i}`, value: i });
  }
  const [quantityItem, setQuantityItems] = useState(labelFrom1To50);
  const [minimum, setMinimum] = useState("");
  const [maximum, setMaximum] = useState("");
  const route = useRoute();
  const { addDiscount, currID, setCurrID } = route.params;
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expiredDate, setExpiredDate] = useState("");
  const formatDate = (rawdate) => {
    const date = new Date(rawdate);
    console.log("Date after format" + date);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    console.log("Month: " + month);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const toggleDatePicker = function () {
    console.log("Clicked");
    Keyboard.dismiss();
    setShowDatePicker(!showDatePicker);
  };
  const dateChange = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      console.log(currentDate);
      setDate(currentDate);
      if (Platform.OS == "android") {
        toggleDatePicker();
        setExpiredDate(formatDate(currentDate));
      }
      // setExpiredDate(formatDate(currentDate));
    } else {
      toggleDatePicker();
    }
  };
  const generateKey = function (length) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  };
  const [BTNdisabled, setBTNdisabled] = useState(true);
  function confirmIOSDate() {
    console.log("expired date:", expiredDate);
    setExpiredDate(formatDate(date));
    toggleDatePicker();
  }
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        {/* <Pressable
          style={{ left: 16, position: "absolute" }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons name="arrow-back" size={30} color="#283663"></Ionicons>
        </Pressable> */}
        <Text
          style={{
            fontSize: 20,
            fontWeight: "600",
            marginTop: 10,
            marginBottom: -10,
            alignSelf: "center",
          }}
        >
          {t("add-new-discount")}
        </Text>
        <View style={[styles.discountInfo, { position: "relative" }]}>
          <TextInput
            placeholder={t("name")}
            onChangeText={setName}
            style={styles.input}
          ></TextInput>
          <DropDownPicker
            placeholder={t("select-discount-value")}
            style={styles.input}
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            containerStyle={{ zIndex: 1000, width: 340 }}
          ></DropDownPicker>
          <DropDownPicker
            placeholder={t("select-quantity")}
            style={styles.input}
            value={quantity}
            setValue={setQuantity}
            open={open2}
            setOpen={setOpen2}
            items={quantityItem}
            setItems={setQuantityItems}
            containerStyle={{ zIndex: 1, width: 340 }}
          ></DropDownPicker>

          <Pressable
            onPress={(e) => {
              toggleDatePicker();
            }}
            style={[styles.input, { width: 300 }]}
          >
            <Text
              placeholder={t("expiration-date")}
              // style={styles.input}
              style={[
                { paddingTop: 5 },
                expiredDate
                  ? { color: "black" }
                  : {
                      color: "black",
                      opacity: 0.3,
                    },
              ]}
              value={expiredDate}
              onChangeText={setExpiredDate}
              editable={false}
            >
              {expiredDate ? expiredDate : t("expiration-date")}
            </Text>
          </Pressable>

          <View>
            <Modal
              visible={showDatePicker}
              animationType="slide"
              onRequestClose={() => setShowDatePicker(false)}
              transparent={true}
            >
              <View
                style={{
                  height: "100%",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    borderRadius: 10,
                    borderWidth: 1.3,
                    borderColor: "green",
                  }}
                >
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date ? new Date(date) : new Date()}
                    mode={"date"}
                    onChange={dateChange}
                    display="inline"
                    accentColor="orange"
                    textColor="black"
                    themeVariant="light"
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                    }}
                  >
                    <TouchableOpacity
                      onPress={toggleDatePicker}
                      style={[
                        {
                          height: 50,
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 50,
                          marginTop: 10,
                          marginBottom: 15,
                          backgroundColor: GlobalColors.button,
                          paddingHorizontal: 20,
                        },
                        { backgroundColor: "#11182711" },
                      ]}
                    >
                      <Text
                        style={[
                          {
                            fontSize: 14,
                            fontWeight: "500",
                            color: "#fff",
                          },
                          { color: "#075985" },
                        ]}
                      >
                        {t("cancel")}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={confirmIOSDate}
                      style={[
                        {
                          height: 50,
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 50,
                          marginTop: 10,
                          marginBottom: 15,
                          backgroundColor: GlobalColors.button,
                          paddingHorizontal: 20,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          {
                            fontSize: 14,
                            fontWeight: "500",
                            color: "#fff",
                          },
                        ]}
                      >
                        {t("confirm")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>

          <TextInput
            placeholder={t("minimum-price")}
            onChangeText={setMinimum}
            style={styles.input}
            keyboardType="numeric"
          ></TextInput>
          <TextInput
            placeholder={t("maximum-price")}
            onChangeText={setMaximum}
            style={styles.input}
            keyboardType="numeric"
          ></TextInput>
        </View>
        <View
          style={{
            alignItems: "center",
            zIndex: -1,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={[
              styles.input,
              {
                backgroundColor: "#b9b306",
                width: 100,
                borderWidth: 0.5,
                height: 40,
                justifyContent: "center",
              },
            ]}
            onPress={() => navigation.goBack()}
          >
            <Text
              style={{
                fontSize: 18,
                color: "#f9fdffff",
                fontWeight: "900",
                textAlign: "center",
              }}
            >
              Back
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.input,
              {
                backgroundColor: "#3fe077",
                width: 100,
                borderWidth: 0.5,
                height: 40,
              },
            ]}
            disabled={
              value == null ||
              quantity == null ||
              minimum.trim() == "" ||
              maximum.trim() == "" ||
              dname.trim() == ""
            }
            onPress={async () => {
              setCurrID(currID + 1);
              console.log("count = " + discountKey);
              let key = generateKey(14);
              const newDiscount2 = {
                value: value,
                key: key,
                title: dname,
                status: 0,
                expireDate: date,
                quantity: quantity,
                isSystem: 1,
                minimumpricetoapply: Number(minimum),
                maximumdiscountprice: Number(maximum),
              };
              const token = await AsyncStorage.getItem("token");

              const config = {
                headers: {
                  Authorization: token,
                },
              };
              axios
                .post(
                  "https://coach-ticket-management-api.onrender.com/api/discounts/",
                  newDiscount2,
                  config
                )
                .then((response) => {
                  console.log(response.data);
                  discountKey++;
                  // const newDiscount = {
                  //   id: currID,
                  //   title: name,
                  //   value: value,
                  //   color: "#abcdef",
                  //   quantity: quantity,
                  //   isChecked: false,
                  //   status: 0,
                  //   expireDate: date,
                  //   isSystem: 1,
                  // };
                  // addDiscount((discounts) => [...discounts, newDiscount]);
                })
                .catch((error) => {
                  if (error.request) {
                    console.log(error.request);
                  }
                  if (error.response) {
                    console.log(error.response.data);
                  }
                });
              navigation.goBack();
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: "#f9fdffff",
                fontWeight: "900",
                textAlign: "center",
              }}
            >
              {t("add")}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
function AddUserDiscount({ navigation }) {
  const [name, setName] = useState("");
  const [value, setValue] = useState(null);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const [quantity, setQuantity] = useState(null);
  const [items, setItems] = useState([
    { label: "5%", value: 0.05 },
    { label: "10%", value: 0.1 },
    { label: "15%", value: 0.15 },
    { label: "20%", value: 0.2 },
    { label: "25%", value: 0.25 },
    { label: "30%", value: 0.3 },
    { label: "35%", value: 0.35 },
    { label: "40%", value: 0.4 },
    { label: "45%", value: 0.45 },
    { label: "50%", value: 0.5 },
    { label: "55%", value: 0.55 },
    { label: "60%", value: 0.6 },
    { label: "65%", value: 0.65 },
    { label: "70%", value: 0.7 },
    { label: "75%", value: 0.75 },
    { label: "80%", value: 0.8 },
    { label: "85%", value: 0.85 },
  ]);
  const [quantityItem, setQuantityItems] = useState([
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4", value: 4 },
    { label: "5", value: 5 },
  ]);
  const [minimum, setMinimum] = useState("");
  const [maximum, setMaximum] = useState("");
  const route = useRoute();
  const { addDiscount, currID, setCurrID } = route.params;
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expiredDate, setExpiredDate] = useState("");
  const formatDate = (rawdate) => {
    const date = new Date(rawdate);
    console.log("Date after format" + date);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    console.log("Month: " + month);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const toggleDatePicker = function () {
    setShowDatePicker(!showDatePicker);
  };
  const dateChange = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      console.log(currentDate);
      setDate(currentDate);
      if (Platform.OS == "android") {
        toggleDatePicker();
        setExpiredDate(formatDate(currentDate));
      }
    } else {
      toggleDatePicker();
    }
  };
  const [BTNdisabled, setBTNdisabled] = useState(true);
  const { t } = useTranslation();
  //Select a discount name will automatic
  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        style={{ left: 16, position: "absolute" }}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Ionicons name="arrow-back" size={30} color="#283663"></Ionicons>
      </Pressable>
      <View style={[styles.discountInfo, { position: "relative" }]}>
        <TextInput
          placeholder={t("name")}
          onChangeText={setName}
          style={styles.input}
        ></TextInput>
        <DropDownPicker
          placeholder={t("select-discount-value")}
          style={styles.input}
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
        ></DropDownPicker>
        <DropDownPicker
          placeholder={t("select-quantity")}
          style={styles.input}
          value={quantity}
          setValue={setQuantity}
          open={open2}
          setOpen={setOpen2}
          items={quantityItem}
          setItems={setQuantityItems}
        ></DropDownPicker>
        <Pressable onPress={toggleDatePicker}>
          <TextInput
            placeholder={t("expiration-date")}
            style={styles.input}
            value={expiredDate}
            onChangeText={setExpiredDate}
            editable={false}
          ></TextInput>
        </Pressable>
        {showDatePicker && (
          <RNDateTimePicker
            onChange={dateChange}
            value={date}
            minimumDate={new Date()}
            disabled
          ></RNDateTimePicker>
        )}
        <TextInput
          placeholder={t("minimum-price")}
          onChangeText={setMinimum}
          style={styles.input}
          keyboardType="numeric"
        ></TextInput>
        <TextInput
          placeholder={t("maximum-price")}
          onChangeText={setMaximum}
          style={styles.input}
          keyboardType="numeric"
        ></TextInput>
      </View>
      <View style={{ alignItems: "center", zIndex: -1 }}>
        <TouchableOpacity
          style={[styles.input, { backgroundColor: "#23f3a1", width: 100 }]}
          disabled={value == null || quantity == null}
          onPress={async () => {
            const navigation = useNavigation();
            setCurrID(currID + 1);
            console.log("count = " + discountKey);
            let key = "key" + (discountKey + 1);
            const newDiscount2 = {
              value: value,
              key: key,
              title: name,
              status: 0,
              expireDate: date,
              quantity: quantity,
              isSystem: 1,
            };
            const token = await AsyncStorage.getItem("token");

            const config = {
              headers: {
                Authorization: token,
              },
            };
            axios
              .post(
                "https://coach-ticket-management-api.onrender.com/api/discounts/",
                newDiscount2,
                config
              )
              .then((response) => {
                console.log(response.data);
                discountKey++;
                const newDiscount = {
                  id: currID,
                  title: name,
                  value: value,
                  color: "#abcdef",
                  quantity: quantity,
                  isChecked: false,
                  status: 0,
                  expireDate: date,
                  isSystem: 1,
                };
                addDiscount((discounts) => [...discounts, newDiscount]);
              })
              .catch((error) => {
                if (error.request) {
                  console.log(error.request);
                }
                if (error.response) {
                  console.log(error.response.data);
                }
              });
            navigation.goBack();
          }}
        >
          <Text
            style={{
              fontSize: 20,
              color: "#ffffff",
              fontWeight: "900",
              textAlign: "center",
            }}
          >
            {t("add")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const renderScene = SceneMap({
  user: UserTab,
  system: SystemTab,
});
function Tab() {
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([
    { key: "user", title: "User" },
    { key: "system", title: "System" },
  ]);
  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
    ></TabView>
  );
}
const MTab = createMaterialTopTabNavigator();
const Tabs = function ({ navigation }) {
  useFocusEffect(() => {
    console.log("Focus");
  });
  return (
    <>
      <View style={styles.header}>
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

        <Text style={styles.headerText}>Manage Discount</Text>
      </View>
      <NavigationContainer independent={true}>
        <MTab.Navigator
          screenOptions={{
            tabBarActiveTintColor: "#5374e0",
            tabBarInactiveTintColor: "#3040759d",
            tabBarStyle: { backgroundColor: "#72C6A1" },
            tabBarLabelStyle: {
              fontWeight: "bold",
            },
          }}
        >
          <MTab.Screen name="User Tab" component={UserTab} />
          <MTab.Screen name="System Tab" component={SystemTab} />
        </MTab.Navigator>
      </NavigationContainer>
    </>
  );
};
function SystemTab() {
  return (
    <Stack.Navigator
      initialRouteName="System"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="System" component={System} />
      <Stack.Screen
        name="Add Discount"
        component={AddDiscount}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="Edit Discount"
        component={EditDiscount}
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}
function UserTab() {
  return (
    <Stack.Navigator
      initialRouteName="User"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="User" component={User} />
      <Stack.Screen name="User Discount" component={UsersDiscount} />
      <Stack.Screen name="Add Discount" component={AddUserDiscount} />
    </Stack.Navigator>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    backgroundColor: "#ffffff",
    // justifyContent: "center",
  },
  discountitem: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  discountInfo: {
    lineHeight: 80,
    marginStart: 30,
    minHeight: 30,
  },
  input: {
    margin: 20,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    width: 300,
    height: 50,
    zIndex: -1,
    marginBottom: 0,
    borderWidth: 1.1,
    borderColor: "black",
  },

  avatarContainer: {
    borderRadius: 200,
    height: undefined,
    width: undefined,
    flexDirection: "row",
    flex: 5,
    justifyContent: "space-between",
  },
  avatar: {
    height: 65,
    width: 65,
    borderRadius: 40,
  },

  text: {
    //paddingTop: 30,
    fontWeight: "bold",
    fontSize: 30,
    textAlign: "center",
  },
  text2: { flexWrap: "wrap", flex: 1, width: 160 },

  flatlist: {
    borderRadius: 10,
    marginTop: 20,
    padding: 10,
  },
  item: {
    marginTop: 20,
    borderRadius: 20,
    backgroundColor: "#D9D9D9",
    justifyContent: "space-between",
  },
  userItem: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 20,
    backgroundColor: "#39bd27",
    justifyContent: "space-between",
    borderColor: "rgba(237, 40, 145, 1)",
    maxWidth: "92%",
    marginVertical: 10,
    flex: 7,
    gap: 5,
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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
export default Tabs;
