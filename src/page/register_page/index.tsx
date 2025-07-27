import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import HeaderApp from "../../components/HeaderApp";
import InputComponent from "../../components/InputComponent";
import { Controller, useForm } from "react-hook-form";
import TextComponent from "../../components/TextComponent";

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
            <TextComponent text={"Tên đăng nhập"} />
            <InputComponent
              value={value}
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
            <TextComponent text={"Email"} />
            <InputComponent
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
            <TextComponent text={"Mật khẩu"} />
            <InputComponent
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
            <TextComponent text={"Nhập lại mật khẩu"} />
            <InputComponent
              value={value}
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
      <TouchableOpacity onPress={handleSubmit(onSubmit)}>
        <Text>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};
export default RegisterPage;
const styles = StyleSheet.create({});
