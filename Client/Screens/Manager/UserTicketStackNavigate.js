import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ManageUserTicket from "./ManageUserTicket";
import TicketConfirmList from "./TicketConfirmList";
import TicketDetailScreen from "../User/TicketDetailScreen";
import GlobalColors from "../../Color/colors";
const Stack = createNativeStackNavigator();

export default function UserTicketStackNavigate() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ManageUserTicket" component={ManageUserTicket} />
      <Stack.Screen name="TicketConfirmList" component={TicketConfirmList} />
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
    </Stack.Navigator>
  );
}
