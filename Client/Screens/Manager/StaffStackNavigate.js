import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ManageStaff from "./ManageStaff";
import AddStaff from "./AddStaff";
import EditStaff from "./EditStaff";
import StaffWorkingList from "./StaffWorkingList";
import TripInformation from "./TripInformation"

const Stack = createNativeStackNavigator();

export default function StaffStackNavigate(){
    return(
        <Stack.Navigator
        screenOptions={{
            headerShown: false,
          }}
        >
            <Stack.Screen name="ManageStaff" component={ManageStaff} />
            <Stack.Screen name="AddStaff" component={AddStaff} />
            <Stack.Screen name="EditStaff" component={EditStaff} />
            <Stack.Screen name="StaffWorkingList" component={StaffWorkingList} />
            <Stack.Screen name="TripInformation" component={TripInformation} />
        </Stack.Navigator>
    )
}