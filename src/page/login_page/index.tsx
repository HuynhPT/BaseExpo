import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import HeaderApp from '../../components/HeaderApp'
import { AppRoutes } from '../../app_navigator'
import navigations from '../../utils/navigation/navigations'

const LoginPage = () => {
  return (
    <View>
        <HeaderApp/>
      <Text>LoginPage</Text>
      <Pressable
        onPress={() => {
          // Handle login logic here
          navigations.navigate(AppRoutes.Home)
          console.log('Login button pressed');
        }}
        style={{
          backgroundColor: '#007BFF',
          padding: 10,
          borderRadius: 5,
          alignItems: 'center',
          marginTop: 20,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16 }}>Login</Text>          
        </Pressable>
    </View>
  )
}

export default LoginPage

const styles = StyleSheet.create({})