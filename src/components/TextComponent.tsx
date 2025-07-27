import { StyleProp, StyleSheet, Text, TextStyle, View } from "react-native";
import React, { FC } from "react";
interface IProps {
  text: string;
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}
const TextComponent: FC<IProps> = (props) => {
  return (
    <Text {...props} style={[styles.textStyle, props.style]}>
      {props.text}
      {props.children}
    </Text>
  );
};
export default TextComponent;
const styles = StyleSheet.create({
  textStyle: {
    fontFamily: "Source Sans Pro-Regular",
    fontSize: 16,
    fontWeight: "400",
  },
});
