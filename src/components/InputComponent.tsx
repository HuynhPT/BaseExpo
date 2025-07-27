import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { FC } from "react";
interface IProps {
  errors?: string;
  placeholder?: string;
  onChangeText: (value: string) => void;
  onBlur: (val: any) => void;
  value: string | undefined;
}
const InputComponent: FC<IProps> = ({
  errors,
  placeholder,
  onChangeText,
  onBlur,
  value,
}) => {
  return (
    <View>
      <TextInput
        placeholder={placeholder}
        onBlur={onBlur}
        onChangeText={onChangeText}
        value={value}
      />
      {errors && <Text>{errors}</Text>}
    </View>
  );
};
export default InputComponent;
const styles = StyleSheet.create({});
