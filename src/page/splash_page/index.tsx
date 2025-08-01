import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import LottieView from "lottie-react-native";
import { lotieFile } from "../../assets/images";
import Navigations from "../../utils/navigation/navigations";
import { AppRoutes } from "../../app_navigator";

const SplashPage = () => {
  useEffect(() => {
    setTimeout(() => {
      Navigations.replace(AppRoutes.Login);
    }, 3000);
  }, []);
  return (
    <LottieView
      source={lotieFile.splash_screens}
      autoPlay={true}
      loop={true}
      style={styles.container}
    />
  );
};
export default SplashPage;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
