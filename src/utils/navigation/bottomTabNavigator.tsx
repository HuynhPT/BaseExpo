import { View, Text } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AppRoutes } from "../../app_navigator";
import HomePage from "../../page/home_page";
import SettingPage from "../../page/setting_page";
import Ionicons from "@expo/vector-icons/Ionicons";
import CategoryPage from "../../page/category";
import ProductPage from "../../page/product";

const Tab = createBottomTabNavigator();
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const iconNames = () => {
            switch (route.name) {
              case AppRoutes.Home:
                return "storefront-outline";
              case AppRoutes.ProductPage:
                return "cube-outline";
              case AppRoutes.Category:
                return "apps-outline";
              case AppRoutes.Settings:
                return "cog-outline";
            }
          };
          return <Ionicons name={iconNames()} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name={AppRoutes.Home} component={HomePage} />
      <Tab.Screen name={AppRoutes.ProductPage} component={ProductPage} />
      <Tab.Screen name={AppRoutes.Category} component={CategoryPage} />
      <Tab.Screen name={AppRoutes.Settings} component={SettingPage} />
    </Tab.Navigator>
  );
};
export default BottomTabNavigator;
