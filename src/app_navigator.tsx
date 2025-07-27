import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
import { View, Text } from "react-native";
import React, { useEffect } from "react";
import HomePage from "./page/home_page";
import SettingPage from "./page/setting_page";
import LoginPage from "./page/login_page";
export enum AppRoutes {
  Login = "Login",
  Home = "Home",
  Settings = "Settings"
}
const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={AppRoutes.Login}>
      <Stack.Screen
        name={AppRoutes.Login}
        component={LoginPage}
        options={{
          headerShown: false // Hide the header for Login page
        }}
      />
      <Stack.Screen
        name={AppRoutes.Home}
        component={HomePage}
        options={{
          headerShown: false // Hide the header for Home page
        }}
      />
      <Stack.Screen name={AppRoutes.Settings} component={SettingPage} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
