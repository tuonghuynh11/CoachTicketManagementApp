import { StatusBar } from "expo-status-bar";
import { LogBox, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "./Client/Screens/User/HomeScreen";
import HistoryScreen from "./Client/Screens/User/HistoryScreen";
import ProfileScreen from "./Client/Screens/User/ProfileScreen";
import MyWork from "./Client/Screens/User/Admin/MyWork";
import CheckIn from "./Client/Screens/User/Admin/CheckInScreen";
import ManageUser from "./Client/Screens/User/Admin/ManageUser";
import ManageDiscount from "./Client/Screens/User/Admin/ManageDiscount";
import PassengerList from "./Client/Screens/User/Admin/PassengersList";
import StatisticsScreen from "./Client/Screens/User/Admin/StatisticsScreen";
import GlobalColors from "./Client/Color/colors";

import LoginScreen from "./Client/Screens/Login_Register/LoginScreen";
import RegisterScreen from "./Client/Screens/Login_Register/RegisterScreen";
import AuthContextProvider, { AuthContext } from "./Client/Store/authContex";
import { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "./Client/Componets/UI/Loading";
import OTP from "./Client/Componets/Authentication/OTPForm";
import ForgotPassword from "./Client/Componets/Authentication/ForgotPassword";
import ResetPassword from "./Client/Componets/Authentication/ResetPassword";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import HomeNavigation from "./Client/Navigation/HomeNavigation";
import TripDetailScreen from "./Client/Screens/User/TripDetailScreen";
import TripListsScreen from "./Client/Screens/User/TripsListScreen";
import SelectSeatsScreen from "./Client/Screens/User/SelectSeatsScreen";
import PassengerDetailsScreen from "./Client/Screens/User/PassengerDetailsScreen";
import RecheckScreen from "./Client/Screens/User/RecheckScreen";
import PaymentScreen from "./Client/Screens/User/PaymentScreen";
import PaymentResultScreen from "./Client/Screens/User/PaymentResultScreen";
import ElectronicTicketScreen from "./Client/Screens/User/ElectronicTicketScreen";
import RatingFeedbackScreen from "./Client/Screens/User/RatingFeedbackScreen";
import TimeOutBooking from "./Client/Componets/UI/TImeOutBooking";
import BookingContextProvider from "./Client/Store/bookingContext";
import TicketDetailScreen from "./Client/Screens/User/TicketDetailScreen";
import TrackingScreen from "./Client/Screens/User/TrackingScreen";
import EditProfileScreen from "./Client/Screens/User/EditProfileScreen";
import MyOfferingScreen from "./Client/Screens/User/MyOfferingScreen";
import AboutUsScreen from "./Client/Screens/User/AboutUsScreen";
import SelectPointScreen from "./Client/Screens/User/SelectPointScreen";
import ShuttleTrackingScreen from "./Client/Screens/User/ShuttleTrackingScreen";
import { ResetToken } from "./Client/util/databaseAPI";
import LoadingAnimation from "./Client/Componets/UI/LoadingAnimation";
import HistoryScreenOldTicket from "./Client/Screens/User/HistoryScreenOldTicket";


import DrawerManager from "./Client/Screens/Manager/Drawer";



const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
export default function App() {
  LogBox.ignoreLogs([
    "No native ExpoFirebaseCore module found, are you sure the expo-firebase-core module is linked properly?",
  ]);
  function AuthStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: GlobalColors.background,
          },
          presentation: "transparentModal",
          headerTintColor: "white",
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: "",
            contentStyle: {
              backgroundColor: GlobalColors.background,
            },
            presentation: "card",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Signup"
          component={RegisterScreen}
          options={{
            title: "",
            contentStyle: {
              backgroundColor: GlobalColors.background,
            },
            presentation: "card",

            headerShown: false,
          }}
        />
        <Stack.Screen
          name="OTP"
          component={OTP}
          options={{
            title: "",
            contentStyle: {
              backgroundColor: GlobalColors.background,
            },
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{
            title: "Forgot Password",
            contentStyle: {
              backgroundColor: GlobalColors.background,
            },
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{
            title: "Create New Password",
            contentStyle: {
              backgroundColor: GlobalColors.background,
            },
            presentation: "card",
          }}
        />
      </Stack.Navigator>
    );
  }
  function AuthenticatedStack({ roleId }) {
    //Check each role has a different navigation
    //If user
    if (roleId == 1) {
      return (
        <BookingContextProvider>
          <Stack.Navigator
            initialRouteName="HomeScreen"
            // screenOptions={{
            //   gestureEnabled: false,
            // }}
          >
            <Stack.Screen
              name="HomeScreen"
              component={HomeNavigation}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SearchTripsScreen"
              component={TripListsScreen}
            />
            <Stack.Screen
              name="TripDetailScreen"
              component={TripDetailScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SelectSeatsScreen"
              component={SelectSeatsScreen}
              options={{
                gestureEnabled: false,
                title: "Pick your seat",
                headerStyle: {
                  backgroundColor: GlobalColors.headerColor,
                },
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: "white",
                },
                headerShown: true,
                contentStyle: {
                  backgroundColor: GlobalColors.contentBackground,
                },
                headerBackVisible: true,
                headerTintColor: "white",
              }}
            />


            <Stack.Screen
              name="SelectPointScreen"
              component={SelectPointScreen}
              options={{
                title: "Select Pick Up Point",
                headerStyle: {
                  backgroundColor: GlobalColors.headerColor,
                },
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: "white",
                },
                headerShown: true,
                contentStyle: {
                  backgroundColor: GlobalColors.contentBackground,
                },
                headerBackVisible: true,
                headerBackTitleVisible: false,
                headerTintColor: "white",
              }}
            />

            <Stack.Screen
              name="PassengerDetailsScreen"
              component={PassengerDetailsScreen}
              options={{
                title: "Passenger Details",
                headerStyle: {
                  backgroundColor: GlobalColors.headerColor,
                },
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: "white",
                },
                headerShown: true,
                contentStyle: {
                  backgroundColor: GlobalColors.contentBackground,
                },
                headerBackVisible: true,
                headerBackTitleVisible: false,
                headerTintColor: "white",
              }}
            />
            <Stack.Screen
              name="RecheckScreen"
              component={RecheckScreen}
              options={{
                title: "Recheck Information",
                headerStyle: {
                  backgroundColor: GlobalColors.headerColor,
                },
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: "white",
                },
                headerShown: true,
                contentStyle: {
                  backgroundColor: GlobalColors.contentBackground,
                },
                headerBackVisible: true,
                headerBackTitleVisible: false,
                headerTintColor: "white",
              }}
            />

            <Stack.Screen
              name="PaymentScreen"
              component={PaymentScreen}
              options={{
                title: "Payment",
                headerStyle: {
                  backgroundColor: GlobalColors.headerColor,
                },
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: "white",
                },
                headerShown: true,
                contentStyle: {
                  backgroundColor: GlobalColors.contentBackground,
                },
                headerBackVisible: true,
                headerBackTitleVisible: false,
                headerTintColor: "white",
              }}
            />
            <Stack.Screen
              name="PaymentResultScreen"
              component={PaymentResultScreen}
              options={{
                gestureEnabled: false,
                title: "Payment Status",
                headerStyle: {
                  backgroundColor: GlobalColors.headerColor,
                },
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: "white",
                },
                headerShown: true,
                contentStyle: {
                  backgroundColor: GlobalColors.contentBackground,
                },
                headerBackVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: "white",
              }}
            />
            <Stack.Screen
              name="ElectronicTicketScreen"
              component={ElectronicTicketScreen}
              options={{
                title: "E-Tickets",
                headerStyle: {
                  backgroundColor: GlobalColors.headerColor,
                },
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: "white",
                },
                headerShown: true,
                contentStyle: {
                  backgroundColor: GlobalColors.contentBackground,
                },
                headerBackVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: "white",
              }}
            />

            <Stack.Screen
              name="TicketDetailScreen"
              component={TicketDetailScreen}
              options={{
                title: "Ticket Detail",
                headerStyle: {
                  backgroundColor: GlobalColors.headerColor,
                },
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: "white",
                },
                headerShown: true,
                contentStyle: {
                  backgroundColor: GlobalColors.contentBackground,
                },
                headerBackVisible: true,
                headerBackTitleVisible: false,
                headerTintColor: "white",
              }}
            />
            <Stack.Screen
              name="TrackingScreen"
              component={TrackingScreen}
              options={{
                title: "",
                headerStyle: {
                  backgroundColor: "transparent",
                },
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: "white",
                },
                headerShown: false,
                contentStyle: {
                  backgroundColor: GlobalColors.contentBackground,
                },
                headerBackVisible: true,
                headerBackTitleVisible: false,
                headerTintColor: "white",
              }}
            />
            <Stack.Screen
              name="ShuttleTrackingScreen"
              component={ShuttleTrackingScreen}
              options={{
                title: "",
                headerStyle: {
                  backgroundColor: "transparent",
                },
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: "white",
                },
                headerShown: false,
                contentStyle: {
                  backgroundColor: GlobalColors.contentBackground,
                },
                headerBackVisible: true,
                headerBackTitleVisible: false,
                headerTintColor: "white",
              }}
            />
            <Stack.Screen
              name="EditProfileScreen"
              component={EditProfileScreen}
              options={{
                title: "Edit Profile",
                headerStyle: {
                  backgroundColor: GlobalColors.contentBackground,
                },
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: GlobalColors.background,
                },
                headerShown: true,
                contentStyle: {
                  backgroundColor: GlobalColors.contentBackground,
                },
                headerBackVisible: true,
                headerBackTitleVisible: false,
                headerTintColor: GlobalColors.background,
              }}
            />
            <Stack.Screen
              name="MyOfferingScreen"
              component={MyOfferingScreen}
              options={{
                title: "Offering",
                headerStyle: {
                  backgroundColor: "white",
                },
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: GlobalColors.background,
                  fontWeight: "bold",
                },
                headerShown: true,
                contentStyle: {
                  backgroundColor: "white",
                },
                headerBackVisible: true,
                headerBackTitleVisible: false,
                headerTintColor: GlobalColors.background,
              }}
            />
            <Stack.Screen
              name="AboutUsScreen"
              component={AboutUsScreen}
              options={{
                title: "About Us",
                headerStyle: {
                  backgroundColor: "white",
                },
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: GlobalColors.background,
                  fontWeight: "bold",
                },
                headerShown: true,
                contentStyle: {
                  backgroundColor: "white",
                },
                headerBackVisible: true,
                headerBackTitleVisible: false,
                headerTintColor: GlobalColors.background,
              }}
            />
            <Stack.Screen
              name="HistoryScreenOldTicket"
              component={HistoryScreenOldTicket}
              options={{
                title: "Ordered History",
                headerStyle: {
                  backgroundColor: GlobalColors.background,
                },
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: "white",
                  fontWeight: "bold",
                },
                headerShown: true,
                contentStyle: {
                  backgroundColor: "white",
                },
                headerBackVisible: true,
                headerBackTitleVisible: false,
                headerTintColor: "white",
              }}
            />
          </Stack.Navigator>
        </BookingContextProvider>
      );
    }
    //Staff
    else if (roleId == 2) {
      

//     return (
//       <Drawer.Navigator
//         screenOptions={{
//           drawerStyle: {
//             backgroundColor: GlobalColors.background,
//           },
//           drawerActiveTintColor: GlobalColors.button,
//           drawerInactiveTintColor: GlobalColors.second_background,
//         }}
//       >
//         <Drawer.Screen name="Home" component={HomeScreen} />
//         <Drawer.Screen name="Ticket History" component={MyWork} />

//         <Drawer.Screen name="Manage discount" component={ManageDiscount} />
//         <Drawer.Screen name="Manage User" component={ManageUser} />
//         <Drawer.Screen name="Statistics" component={StatisticsScreen} />
//       </Drawer.Navigator>
//     );
    }
    //Admin
    else {
    }

    //Staff

    //Manager

    //Admin
  }
  function Navigation() {
    //check isAuthenticated
    //If isAuthenticated then skip login
    //else login or register
    const authCtx = useContext(AuthContext);
    return (
      <NavigationContainer
        style={styles.container}
        theme={{
          colors: {
            backgroundColor: GlobalColors.second_background,
            background: GlobalColors.second_background,
          },
        }}
      >
        {/* <AuthenticatedStack /> */}
        {/* <AuthStack /> */}
        {authCtx.isAuthenticated && (
          <AuthenticatedStack roleId={authCtx.idRole} />
        )}
        {!authCtx.isAuthenticated && <AuthStack />}
      </NavigationContainer>
    );
  }
  function Root() {
    //add loading when run app

    const [isTryLoading, setIsTryLoading] = useState(true);
    const authCtx = useContext(AuthContext);
    useEffect(() => {
      async function fetchToken() {
        // const token = await AsyncStorage.getItem("token");
        // const refreshToken = await AsyncStorage.getItem("refreshToken");
        const idUser = await AsyncStorage.getItem("idUser");
        const userName = await AsyncStorage.getItem("userName");
        const idRole = await AsyncStorage.getItem("idRole");
        const refreshToken = await AsyncStorage.getItem("refreshToken");

        if (userName) {
          const newTokens = await ResetToken({
            userName: userName,
            refreshToken: refreshToken,
          });
          authCtx.authenticate(
            newTokens.accessToken,
            newTokens.refreshToken,
            idUser,
            userName,
            idRole
          );
        }
        setIsTryLoading(false);
      }
      fetchToken();
    }, []);
    if (isTryLoading) {
      return <LoadingAnimation run={true} />;
    }
    return <Navigation />;
  }

  return (
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
       {/* <DrawerManager /> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
