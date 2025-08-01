import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import HeaderApp from "../../components/HeaderApp";
import InputComponent from "../../components/InputComponent";
import { Controller, useForm } from "react-hook-form";
import TextComponent from "../../components/TextComponent";
import ButtonComponent from "../../components/ButtonComponent";

const RegisterPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    watch,
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const onSubmit = (data: any) => console.log(data);
  return (
    <View>
      <HeaderApp title={"Đăng ký tài khoản"} />
      <Controller
        name="username"
        control={control}
        rules={{
          required: "Tên đăng nhập không được để trống",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <InputComponent
              value={value}
              label={"Tên đăng nhập"}
              placeholder={"Nhập username"}
              onChangeText={onChange}
              onBlur={onBlur}
              errors={(errors.username && errors.username?.message) || ""}
            />
          </>
        )}
      />
      <Controller
        name="email"
        control={control}
        rules={{
          required: false,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <InputComponent
              label={"Email"}
              value={value}
              placeholder={"Nhập email"}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          </>
        )}
      />
      <Controller
        name="password"
        control={control}
        rules={{
          required: "Vui lòng nhập mật khẩu",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <InputComponent
              label={"Mật khẩu"}
              value={value}
              placeholder={"Nhập mật khẩu"}
              onChangeText={onChange}
              onBlur={onBlur}
              errors={(errors.password && errors.password?.message) || ""}
            />
          </>
        )}
      />
      <Controller
        name="confirmPassword"
        control={control}
        rules={{
          required: "Vui lòng nhập mật khẩu",
          validate: (value) =>
            value === watch("password") || "Mật khẩu xác nhận không khớp",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <InputComponent
              value={value}
              label={"Nhập lại mật khẩu"}
              placeholder={"Nhập lại mật khẩu"}
              onChangeText={onChange}
              onBlur={onBlur}
              errors={
                (errors.confirmPassword && errors.confirmPassword?.message) ||
                ""
              }
            />
          </>
        )}
      />
      <ButtonComponent title={"Đăng ký"} onPress={handleSubmit(onSubmit)} />
    </View>
  );
};
export default RegisterPage;
const styles = StyleSheet.create({});
