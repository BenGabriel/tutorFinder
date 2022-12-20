import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, SafeAreaView } from "react-native";
import "react-native-gesture-handler";
import AvailableTime from "./src/screens/availableTime";
import BookSession from "./src/screens/bookSession";
import Course from "./src/screens/course";
import Login from "./src/screens/login";
import Profile from "./src/screens/profile";
import Register from "./src/screens/register";
import Session from "./src/screens/session";
import StudentBoard from "./src/screens/studentBoard";
import UserState from "./src/store/State";

const { Navigator, Screen } = createStackNavigator();
export default function App() {
  return (
    <UserState>
      <NavigationContainer>
        <SafeAreaView style={styles.container}>
          <Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Screen component={Login} name="Login" />
            <Screen component={Register} name="Register" />
            <Screen component={Course} name="Course" />
            <Screen component={AvailableTime} name="AvailableTime" />
            <Screen component={Profile} name="Profile" />
            <Screen component={Session} name="Session" />
            <Screen component={StudentBoard} name="StudentBoard" />
            <Screen component={BookSession} name="BookSession" />
          </Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </UserState>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#666",
    marginTop: 45
  },
});
