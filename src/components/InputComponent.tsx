import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { FC } from "react";
import { colors } from "../utils/colors";
import { FONT_SIZE, FONT_WEIGHT, SIZE } from "../utils/size";
interface IProps {
  errors?: string;
  placeholder?: string;
  onChangeText?: (value: string) => void;
  onBlur?: (val: any) => void;
  value: string | undefined;
  label?: string;
}
const InputComponent: FC<IProps> = ({
  errors,
  placeholder,
  onChangeText,
  onBlur,
  value,
  label,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[styles.inputContainer, errors && { borderColor: colors.red }]}
      >
        <TextInput
          placeholder={placeholder}
          onBlur={onBlur}
          onChangeText={onChangeText}
          value={value}
          style={styles.input}
        />
      </View>
      {errors && <Text style={styles.err}>{errors}</Text>}
    </View>
  );
};
export default InputComponent;
const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: colors.white,
    borderColor: colors.greyOpacity,
    borderWidth: SIZE[1],
    borderRadius: SIZE[8],
  },
  input: {
    paddingVertical: SIZE[8],
    marginHorizontal: SIZE[8],
  },
  container: {
    paddingHorizontal: SIZE[12],
  },
  err: {
    color: colors.red,
    paddingTop: SIZE[6],
  },
  label: {
    fontSize: FONT_SIZE["14"],
    fontWeight: FONT_WEIGHT["400"],
    color: colors.black,
    marginTop: SIZE[12],
    marginBottom: SIZE[6],
  },
});
