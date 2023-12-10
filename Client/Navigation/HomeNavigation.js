import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../Screens/User/HomeScreen";
import TripListsScreen from "../Screens/User/TripsListScreen";
import TripDetailScreen from "../Screens/User/TripDetailScreen";
import GlobalColors from "../Color/colors";
import HistoryScreen from "../Screens/User/HistoryScreen";
import ProfileScreen from "../Screens/User/ProfileScreen";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
const BottomTab = createBottomTabNavigator();
function HomeNavigation() {
  return (
    <BottomTab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: GlobalColors.background,
          position: "absolute",
          bottom: 25,
          left: 20,
          right: 20,
          borderRadius: 15,
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
          paddingBottom: 20,
        },
        tabBarActiveTintColor: GlobalColors.button,
        tabBarInactiveTintColor: GlobalColors.second_background,
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-home-outline" size={24} color={color} />
          ),
          headerShown: false,
        }}
      />
      <BottomTab.Screen
        name="Ticket History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="history" size={24} color={color} />
          ),
          title: "My Bookings",
          headerStyle: {
            backgroundColor: GlobalColors.headerColor,
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            color: "white",
          },
          headerShown: true,
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle-outline" size={24} color={color} />
          ),

          headerShown: false,
        }}
      />
    </BottomTab.Navigator>
  );
}
export default HomeNavigation;
