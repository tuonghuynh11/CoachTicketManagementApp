import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Platform,
  ScrollView,
  Switch,
} from "react-native";
import TimeOutBooking from "../../Componets/UI/TImeOutBooking";
import { useContext, useEffect, useState, useTransition } from "react";
import { AuthContext } from "../../Store/authContex";
import CircleImage from "../../Componets/UI/CircleImage";
import GlobalColors from "../../Color/colors";
import { MaterialIcons } from "@expo/vector-icons";
import LogOutPopUp from "../../Componets/UI/LogOutPopUp";
import Loading from "../../Componets/UI/Loading";
import FeedbackAppModal from "./FeedbackAppModal";
import { useColorScheme } from "react-native";
import { getCurrentUser, logOut } from "../../util/databaseAPI";
import UserAccountInfo from "../../Models/UserAccountInfo";
import { sendFeedbackEmail } from "../../util/apiServices";
import PopUp from "../../Componets/UI/PopUp";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import CustomSwitch from "../../Componets/UI/CustomSwitch";
import i18next from "../../Services/i18next";
import { useTranslation } from "react-i18next";
import { LngContext } from "../../Store/languageContext";
function ProfileScreen({ navigation, route }) {
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [memberShip, setMemberShip] = useState("gold");
  const [currentUser, setCurrentUser] = useState(null);
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  const [popUpType, setPopUpType] = useState("Success");
  const authCtx = useContext(AuthContext);
  const lngCtx = useContext(LngContext);

  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isFocused = useIsFocused();

  const { t } = useTranslation();
  useEffect(() => {
    //getMemberShip
    if (isFocused) {
      getCurrentUsers();
    }
  }, [isFocused]);

  async function getCurrentUsers() {
    const res = await getCurrentUser(authCtx.token, authCtx.idUser);
    if (!res) {
      setIsPopUpVisible((curr) => !curr);
      setPopUpType("Error");
      return;
    }
    const temp = res.data;
    let currentUser;
    if (authCtx.idRole === "3") {
      //Admin
      currentUser = new UserAccountInfo(
        temp.data.id,
        "",
        "",
        "",
        "",
        "",
        "male",
        temp.data
      );
    } else {
      // Roles còn lại
      currentUser = new UserAccountInfo(
        temp.data.id,
        temp.data.fullName,
        temp.data.email,
        temp.data.address,
        temp.data.phoneNumber,
        temp.data.userId,
        "male",
        temp.data.UserAccountData
      );
    }
    if (currentUser.UserAccountData.memberShipId === "1") {
      setMemberShip("brozen");
    } else if (currentUser.UserAccountData.memberShipId === "2") {
      setMemberShip("silver");
    } else {
      setMemberShip("gold");
    }
    setCurrentUser(currentUser);
  }
  function BodyItem({ children, title }) {
    return (
      <View style={styles.bodyItem}>
        <Text style={{ color: "#283663", fontSize: 18, fontWeight: "bold" }}>
          {title}
        </Text>
        {children}
      </View>
    );
  }
  function BodySubItem({ title, onPress, isHotLine, hotline, isNotSymbol }) {
    return (
      <Pressable
        style={({ pressed }) => [
          {
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 10,
            backgroundColor: "#a8dfeb",
            borderRadius: 10,
            alignItems: "center",
          },
          pressed && { opacity: 0.7 },
        ]}
        onPress={onPress}
      >
        <Text style={{ fontSize: 16, fontWeight: "500" }}>{title}</Text>
        {isHotLine && (
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: "red",
              paddingVertical: 3,
            }}
          >
            {hotline}
          </Text>
        )}
        {!isNotSymbol && (
          <MaterialIcons name="chevron-right" size={24} color="black" />
        )}
      </Pressable>
    );
  }

  async function editProfileHandler() {
    navigation.navigate("EditProfileScreen", {
      currentUser: currentUser,
    });
  }
  async function makeCallHandler() {
    if (Platform.OS === "android") {
      await Linking.openURL("tel:0123456789");
    } else {
      await Linking.openURL("telprompt:0123456789");
    }
  }

  async function submitFeedbackHandler(email, content) {
    if (content === null || content.trim() === "") {
      setIsFeedbackVisible((curr) => !curr);
      setTimeout(() => {
        setIsPopUpVisible((curr) => !curr);
        setPopUpType("Warning");
      }, 500);
    } else {
      try {
        await sendFeedbackEmail(
          email,
          content,
          currentUser.UserAccountData.userName,
          "App"
        );
        setIsFeedbackVisible((curr) => !curr);
        setTimeout(() => {
          setIsPopUpVisible((curr) => !curr);
          setPopUpType("Success");
        }, 500);
      } catch (error) {
        setIsFeedbackVisible((curr) => !curr);
        setTimeout(() => {
          setIsPopUpVisible((curr) => !curr);
          setPopUpType("Error");
        }, 500);
      }
    }
  }
  function changeLng(index) {
    console.log(index);
    if (index === 1) {
      i18next.changeLanguage("en");
      lngCtx.setLng("en");
    } else {
      i18next.changeLanguage("vi");
      lngCtx.setLng("vi");
    }
  }
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
            zIndex: 1,
            backgroundColor: GlobalColors.lightBackground,
            opacity: 0.9,
          }}
        >
          <Loading message={t("logging-out") + " ..."} />
        </View>
      )}
      <PopUp
        type={popUpType}
        isVisible={isPopUpVisible}
        title={
          popUpType == "Success"
            ? t("successful")
            : popUpType == "Warning"
            ? t("content-email-warning")
            : t("something-was-wrong") + "!!"
        }
        textBody={
          popUpType == "Success"
            ? t("feedback-sent")
            : popUpType == "Warning"
            ? t("required-entered-all-fields")
            : t("check-internet-connection")
        }
        callback={() => {
          setIsPopUpVisible((curr) => !curr);
          if (popUpType === "Warning") {
            setTimeout(() => {
              setIsFeedbackVisible((curr) => !curr);
            }, 500);
          }
        }}
      />
      <FeedbackAppModal
        isVisible={isFeedbackVisible}
        defaultEmail={
          currentUser && currentUser.email !== null ? currentUser.email : ""
        }
        onCancel={() => {
          setIsFeedbackVisible((curr) => !curr);
        }}
        onSubmit={submitFeedbackHandler}
      />
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
      <ScrollView style={[styles.root, { paddingTop: 40 }]}>
        <View style={styles.subRoot}>
          <View
            style={{
              width: "100%",
              alignItems: "flex-end",
              justifyContent: "space-between",
              alignItems: "center",
              // alignSelf: "flex-end",
              marginTop: -20,
              marginBottom: -60,
              flexDirection: "row",
            }}
          >
            <View
              style={{
                padding: 5,
                backgroundColor: GlobalColors.button,
                borderRadius: 10,
              }}
            >
              <Text style={{ fontWeight: "600", color: "white" }}>
                {t("member")}
              </Text>
            </View>
            <Image
              style={{ width: 50, height: 70 }}
              source={
                memberShip === "gold"
                  ? require("../../../icon/gold.png")
                  : memberShip === "silver"
                  ? require("../../../icon/silver.png")
                  : require("../../../icon/bronze.png")
              }
            />
          </View>

          <CircleImage
            image={currentUser && currentUser.UserAccountData.avatar}
            size={100}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              // marginLeft: 30,
            }}
          >
            <Text style={[styles.title]}>
              {currentUser && currentUser.UserAccountData.userName}
            </Text>
            {/* <TouchableOpacity onPress={editProfileHandler}>
              <MaterialIcons name="edit" size={24} color="#72C6A1" />
            </TouchableOpacity> */}
          </View>
          {/* <Text style={styles.subTitle}>0xxxxxxxxx</Text> */}
          <View style={styles.body}>
            <View style={{ marginTop: -20 }}>
              <BodyItem title={t("information")}>
                <BodySubItem
                  title={t("my-profile")}
                  onPress={editProfileHandler}
                />
                <BodySubItem
                  title={t("ordered-history")}
                  onPress={() => navigation.navigate("HistoryScreenOldTicket")}
                />
              </BodyItem>
            </View>

            <BodyItem title={t("promotions-offering")}>
              <BodySubItem
                title={t("my-offering")}
                onPress={() => {
                  navigation.navigate("MyOfferingScreen");
                }}
              />
            </BodyItem>
            <BodyItem title={"FAQ’s & " + t("support")}>
              <BodySubItem
                onPress={makeCallHandler}
                title={"HotLine"}
                isHotLine
                isNotSymbol
                hotline={"0123456789"}
              />
              <BodySubItem
                title={t("about-us")}
                onPress={() => {
                  navigation.navigate("AboutUsScreen");
                }}
              />
              <BodySubItem
                onPress={() => {
                  setIsFeedbackVisible((curr) => !curr);
                }}
                title={"Feedback"}
                isNotSymbol
              />
            </BodyItem>
            <View
              style={[
                {
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 10,
                  backgroundColor: "#a8dfeb",
                  borderRadius: 10,
                  alignItems: "center",
                },
              ]}
              onPress={() => {}}
            >
              <Text style={{ fontSize: 16, fontWeight: "500" }}>
                {t("language")}
              </Text>
              {/* <Switch
                trackColor={{ false: "purple", true: "#2877df" }}
                value={true}
                onValueChange={() => {
                  // setIsRoundTrip((curr) => !curr);
                  // setDateOfRoundTrip("");
                }}
                
              /> */}
              <CustomSwitch
                selectionMode={2}
                roundCorner={true}
                option1={"EN"}
                option2={"VI"}
                onSelectSwitch={changeLng}
                selectionColor={"white"}
                defaultSelectionIndex={lngCtx.lng == "en" ? 1 : 2}
              />

              {/* {isHotLine && (
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: "red",
              paddingVertical: 3,
            }}
          >
            {hotline}
          </Text>
        )} */}
            </View>
            <View style={{ alignItems: "center" }}>
              <Pressable
                style={({ pressed }) => [
                  {
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    padding: 10,
                    backgroundColor: "#8692e2",
                    borderRadius: 10,
                    alignItems: "center",
                    gap: 10,
                  },
                  pressed && { opacity: 0.7 },
                ]}
                onPress={() => {
                  setIsLogoutVisible((curr) => !curr);
                }}
              >
                <MaterialIcons
                  name="power-settings-new"
                  size={24}
                  color="black"
                />
                <Text style={{ fontSize: 16, fontWeight: "500" }}>
                  {t("log-out")}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* <Image
            style={{ width: 50, height: 40 }}
            source={require("../../../assets/logoText.png")}
          /> */}
          <Text style={{ marginBottom: -10 }}>{t("version")} 1.0</Text>
        </View>
        <View style={{ height: 150 }} />
      </ScrollView>
    </>
  );
}

export default ProfileScreen;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: GlobalColors.contentBackground,
    gap: 20,
  },
  subRoot: {
    backgroundColor: "white",
    alignItems: "center",
    margin: 20,
    borderRadius: 20,
    padding: 10,
    gap: 10,
    paddingVertical: 20,
  },
  title: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  body: {
    width: "100%",
    marginTop: 20,
    gap: 12,
  },
  bodyItem: {
    gap: 10,
  },
});
