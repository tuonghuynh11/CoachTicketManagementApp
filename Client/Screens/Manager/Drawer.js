import { createDrawerNavigator } from "@react-navigation/drawer";
import ManageCoach from "./ManageCoach";
import ManageSchedule from "./ManageSchedule";
import ManageUserTicket from "./ManageUserTicket";
import ManageStaff from "./ManageStaff";
import { NavigationContainer } from "@react-navigation/native";
import CoachStackNavigate from "./CoachStackNavigate";
import ScheduleStackNavigate from "./ScheduleStackNavigate";
import UserTicketStackNavigate from "./UserTicketStackNavigate";
import StaffStackNavigate from "./StaffStackNavigate";
import RouteStackNavigate from "./RouteStackNavigate";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import CustomDrawer from "./CustomDrawer";
import StatisticsScreen from "../User/Admin/StatisticsScreen";
import ManageDiscount from "../User/Admin/ManageDiscount";
import ManageUser from "../User/Admin/ManageUser";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import i18next from "../../Services/i18next";
import { useTranslation } from "react-i18next";

const Drawer = createDrawerNavigator();

function MyDrawer() {
  const { t } = useTranslation();
  return (
    <Drawer.Navigator
      initialRouteName="ManageCoach"
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: "70%",
        },
        drawerActiveTintColor: "#72C6A1",
        drawerInactiveTintColor: "#283663",
      }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        name={t("manage-coach")}
        component={CoachStackNavigate}
        options={{
          drawerIcon: ({ focused, size }) => (
            <Ionicons
              name="bus"
              size={24}
              color={focused ? "#72C6A1" : "#283663"}
            />
          ),
        }}
      />
      {/* <Drawer.Screen name="Manage Schedule" component={ScheduleStackNavigate} options={{
        drawerIcon: ({focused, size}) => (
          <MaterialIcons name="schedule" size={24} color={focused?'#72C6A1':"#283663"} />
        )
      }}/> */}
      <Drawer.Screen
        name={t("manage-user-ticket")}
        component={UserTicketStackNavigate}
        options={{
          drawerIcon: ({ focused, size }) => (
            <FontAwesome
              name="ticket"
              size={24}
              color={focused ? "#72C6A1" : "#283663"}
            />
          ),
        }}
      />
      <Drawer.Screen
        name={t("manage-staff")}
        component={StaffStackNavigate}
        options={{
          drawerIcon: ({ focused, size }) => (
            <Ionicons
              name="person"
              size={24}
              color={focused ? "#72C6A1" : "#283663"}
            />
          ),
        }}
      />
      <Drawer.Screen
        name={t("manage-route")}
        component={RouteStackNavigate}
        options={{
          drawerIcon: ({ focused, size }) => (
            <FontAwesome5
              name="route"
              size={24}
              color={focused ? "#72C6A1" : "#283663"}
            />
          ),
        }}
      />

      <Drawer.Screen
        name={t("manage-discount")}
        component={ManageDiscount}
        options={{
          drawerIcon: ({ focused, size }) => (
            <MaterialCommunityIcons
              name="sale"
              size={24}
              color={focused ? "#72C6A1" : "#283663"}
            />
          ),
        }}
      />
      <Drawer.Screen
        name={t("statistics")}
        component={StatisticsScreen}
        options={{
          // headerShown: true,

          drawerIcon: ({ focused, size }) => (
            <Ionicons
              name="bar-chart"
              size={24}
              color={focused ? "#72C6A1" : "#283663"}
            />
          ),
        }}
      />
      <Drawer.Screen
        name={t("manage-user")}
        component={ManageUser}
        options={{
          // headerShown: true,
          drawerIcon: ({ focused, size }) => (
            <MaterialCommunityIcons
              name="account-multiple"
              size={24}
              color={focused ? "#72C6A1" : "#283663"}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default function DrawerManager() {
  return <MyDrawer />;
}
