import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ManageRoute from "./ManageRoute";
import RouteDetail from "./RouteDetail";
import AddRoute from "./AddRoute";
import EditRoute from "./EditRoute";
import EditShuttle from "./EditShuttle";
import ManageSchedule from "./ManageSchedule";
import EditSchedule from "./EditSchedule";
import DetailSchedule from "./DetailSchedule";
import AddSchedule from "./AddSchedule";

const Stack = createNativeStackNavigator();

export default function RouteStackNavigate() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ManageRoute" component={ManageRoute} />
      <Stack.Screen name="RouteDetail" component={RouteDetail} />
      <Stack.Screen name="AddRoute" component={AddRoute} />
      <Stack.Screen name="EditRoute" component={EditRoute} />
      <Stack.Screen name="EditShuttle" component={EditShuttle} />
      <Stack.Screen name="ManageSchedule" component={ManageSchedule} />
      <Stack.Screen name="EditSchedule" component={EditSchedule} />
      <Stack.Screen name="AddSchedule" component={AddSchedule} />
      <Stack.Screen name="DetailSchedule" component={DetailSchedule} />
    </Stack.Navigator>
  );
}
