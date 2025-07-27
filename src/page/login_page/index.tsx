import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import HeaderApp from "../../components/HeaderApp";
import { AppRoutes } from "../../app_navigator";
import navigations from "../../utils/navigation/navigations";
import { useForm } from "react-hook-form";

const LoginPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });
  const onSubmit = (data: any) => console.log(data);
  return (
    <SafeAreaView>
      <Text>Đăng Nhập</Text>
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
    </SafeAreaView>
  );
};

export default LoginPage;

const styles = StyleSheet.create({});
