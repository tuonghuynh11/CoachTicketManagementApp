import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
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
const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
export default function App() {
  function AuthStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: GlobalColors.background,
          },

          headerTintColor: "white",
        }}
      >
        {/* <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: "Log In",
          }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{
            title: "Sign Up",
          }}
        /> */}
      </Stack.Navigator>
    );
  }
  function AuthenticatedStack() {
    //Check each role has a different navigation
    //If user

    return (
      <Drawer.Navigator
        screenOptions={{
          drawerStyle: {
            backgroundColor: GlobalColors.background,
          },
          drawerActiveTintColor: GlobalColors.button,
          drawerInactiveTintColor: GlobalColors.second_background,
        }}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Ticket History" component={MyWork} />

        <Drawer.Screen name="Manage discount" component={ManageDiscount} />
        <Drawer.Screen name="Manage User" component={ManageUser} />
        <Drawer.Screen name="Statistics" component={StatisticsScreen} />
      </Drawer.Navigator>
    );

    //Staff

    //Manager

    //Admin
  }
  function Navigation() {
    //check isAuthenticated
    //If isAuthenticated then skip login
    //else login or register
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
        {/* {authCtx.isAuthenticated && <AuthenticatedStack />}
        {!authCtx.isAuthenticated && <AuthStack />} */}
        <AuthenticatedStack />
      </NavigationContainer>
    );
  }
  function Root() {
    //add loading when run app
    return <Navigation />;
  }

  return (
    <>
      <StatusBar style="auto" />
      <Root />
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
