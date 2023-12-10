import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ManageSchedule from "./ManageSchedule";
import EditSchedule from "./EditSchedule";
import DetailSchedule from "./DetailSchedule";
import AddSchedule from "./AddSchedule";

const Stack = createNativeStackNavigator();

export default function ScheduleStackNavigate() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
        <Stack.Screen name='ManageSchedule' component={ManageSchedule}/>
        <Stack.Screen name='EditSchedule' component={EditSchedule}/>
        <Stack.Screen name='AddSchedule' component={AddSchedule}/>
        <Stack.Screen name='DetailSchedule' component={DetailSchedule}/>
    </Stack.Navigator>
  );
}
