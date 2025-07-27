import React, { useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { initDatabaseUser, registerUser, loginUser, getAllUsers } from '../../database/user_database';

export default function HomePage() {

  // Hàm thử đăng ký người dùng
  const testRegister = async () => {
    try {
      await registerUser('Admin', 'adminexample.com', 'password123');
      Alert.alert('Success', 'User registered successfully!');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to register user');
    }
  };

  // Hàm thử đăng nhập
  const testLogin = async () => {
    try {
      const user = await loginUser('admin@example.com', 'admin123');
      Alert.alert('Success', `Logged in as ${user.username} (Admin: ${user.isAdmin ? 'Yes' : 'No'})`);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to login');
    }
  };

  // Hàm thử lấy tất cả người dùng
  const testGetUsers = async () => {
    try {
      const users = await getAllUsers();
      Alert.alert('Users', JSON.stringify(users, null, 2));
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to fetch users');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Expo SQLite Demo</Text>
      <Button title="Register User" onPress={testRegister} />
      <Button title="Login Admin" onPress={testLogin} />
      <Button title="Get All Users" onPress={testGetUsers} />
    </View>
  );
}