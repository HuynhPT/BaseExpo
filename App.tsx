import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import AppNavigator from "./src/app_navigator";
import { useEffect } from "react";
import { initAllDatabases, initDatabase } from "./src/database";
import navigations from "./src/utils/navigation/navigations";

export default function App() {
  // Khởi tạo cơ sở dữ liệu khi ứng dụng khởi động
  useEffect(() => {
    initAllDatabases()
      .then(() => console.log("Database setup complete"))
      .catch((error) => console.error("Database setup failed:", error));
  }, []);
  return (
    <NavigationContainer
      ref={(navigatorRef) => {
        console.log("Navigator đã được gán?", !!navigatorRef); // Kiểm tra tại đây
        navigations.setTopLevelNavigator(navigatorRef);
      }}
    >
      <AppNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
