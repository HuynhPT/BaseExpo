import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React, { FC } from "react";
import { FONT_SIZE, FONT_WEIGHT, SIZE } from "../utils/size";
import { colors } from "../utils/colors";
export interface ButtonProps {
  title: string;
  buttonStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;

  onPress?: () => void;
}
const ButtonComponent: FC<ButtonProps> = ({
  title,
  buttonStyle,
  onPress,
  titleStyle,
}) => {
  return (
    <TouchableOpacity style={[buttonStyle, styles.container]} onPress={onPress}>
      <Text style={[titleStyle, styles.title]}>
        {title.toLocaleUpperCase()}
      </Text>
    </TouchableOpacity>
  );
};
export default ButtonComponent;
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: SIZE[12],
    backgroundColor: colors.black,
    marginHorizontal: SIZE[12],
    borderRadius: SIZE[8],
    marginVertical: SIZE[12],
  },
  title: {
    fontSize: FONT_SIZE["14"],
    color: colors.white,
    fontWeight: FONT_WEIGHT["600"],
  },
});
