import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
import { View, Text } from "react-native";
import React, { useEffect } from "react";
import HomePage from "./page/home_page";
import SettingPage from "./page/setting_page";
import LoginPage from "./page/login_page";
import RegisterPage from "./page/register_page";
import Splash_page from "./page/splash_page";
import BottomTabNavigator from "./utils/navigation/bottomTabNavigator";
export enum AppRoutes {
  Login = "Login",
  Home = "Home",
  Settings = "Settings",
  Register = "Register",
  SplashScreen = "SplashScreen",
  Category = "Category",
  ProductPage = "Product",
  BottomTab = "BottomTab",
}
const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={AppRoutes.SplashScreen}>
      <Stack.Screen
        name={AppRoutes.BottomTab}
        component={BottomTabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={AppRoutes.SplashScreen}
        component={Splash_page}
        options={{
          headerShown: false, // Hide the header for Login page
        }}
      />
      <Stack.Screen
        name={AppRoutes.Login}
        component={LoginPage}
        options={{
          headerShown: false, // Hide the header for Login page
        }}
      />
      <Stack.Screen
        name={AppRoutes.Register}
        component={RegisterPage}
        options={{
          headerShown: false, // Hide the header for Home page
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
