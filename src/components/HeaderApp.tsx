import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SIZE } from "../utils/size";
import { images } from "../assets/images";
import Navigations from "../utils/navigation/navigations";
interface HeaderAppProps {
  title?: string;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
}
const HeaderApp: FC<HeaderAppProps> = ({
  title,
  onBackPress,
  rightComponent,
  leftComponent,
}) => {
  const asets = useSafeAreaInsets();
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      // Default back action, if no onBackPress is provided
      Navigations.goBack();
      console.log(
        "Back button pressed, but no custom action provided. Defaulting to goBack.",
      );
    }
  };
  return (
    <View
      style={[
        styles.container,
        {
          height: SIZE[36] + asets.top,
          paddingTop: asets.top,
          paddingBottom: SIZE[10],
        },
      ]}
    >
      {rightComponent ? (
        rightComponent
      ) : (
        <TouchableOpacity
          onPress={handleBackPress}
          style={{ paddingHorizontal: SIZE[14] }}
          activeOpacity={0.6}
        >
          <Image
            source={images.ic_arrow_left}
            style={{
              width: SIZE[20],
              height: SIZE[20],
              resizeMode: "contain",
            }}
          />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title ? title : "Header"}</Text>
      {leftComponent ? leftComponent : <View />}
    </View>
  );
};

export default HeaderApp;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f8f8",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: SIZE[18],
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    paddingRight: SIZE[28],
  },
});
