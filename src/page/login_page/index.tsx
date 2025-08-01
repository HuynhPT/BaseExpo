import {
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import HeaderApp from "../../components/HeaderApp";
import { AppRoutes } from "../../app_navigator";
import navigations from "../../utils/navigation/navigations";
import { Controller, useForm } from "react-hook-form";
import TextComponent from "../../components/TextComponent";
import InputComponent from "../../components/InputComponent";
import ButtonComponent from "../../components/ButtonComponent";
import { Login } from "./store/services";
import { getAllUsers } from "../../database";
import Navigations from "../../utils/navigation/navigations";

const LoginPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      user_name: "admin@example.com",
      password: "admin123",
    },
  });
  const onSubmit = async (data: any) => {
    try {
      const res = await Login({
        email: data.user_name,
        password: data.password,
      });
      if (res.status === 200) {
        Navigations.replace(AppRoutes.BottomTab);
      } else {
        Alert.alert("Thông báo", res.toString());
      }
    } catch (error) {}
  };
  return (
    <View>
      <HeaderApp title={"Đăng Nhập"} rightComponent={<View />} />
      <Controller
        name="user_name"
        control={control}
        rules={{
          required: "Tên đăng nhập không được để trống",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <InputComponent
              value={value}
              label={"Tên đăng nhập"}
              placeholder={"Nhập tên đăng nhập"}
              onChangeText={onChange}
              onBlur={onBlur}
              errors={(errors.user_name && errors.user_name?.message) || ""}
            />
          </>
        )}
      />
      <Controller
        name="password"
        control={control}
        rules={{
          required: "Mật khẩu không được để trống",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <InputComponent
              value={value}
              label={"Mật khẩu"}
              placeholder={"Nhập mật khẩu"}
              onChangeText={onChange}
              onBlur={onBlur}
              errors={(errors.password && errors.password?.message) || ""}
            />
          </>
        )}
      />
      <ButtonComponent title={"Đăng nhập"} onPress={handleSubmit(onSubmit)} />
      <Pressable
        onPress={() => {
          // Handle login logic here
          navigations.navigate(AppRoutes.Register);
          console.log("Login button pressed");
        }}
        style={{
          backgroundColor: "#007BFF",
          padding: 10,
          borderRadius: 5,
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16 }}>Đăng Ký</Text>
      </Pressable>
    </View>
  );
};

export default LoginPage;

const styles = StyleSheet.create({});
