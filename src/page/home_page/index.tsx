import React, { useEffect } from "react";
import { View, Text, Button, Alert, ScrollView } from "react-native";
import {
  initAllDatabases,
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllCategories,
  getAllProducts,
  getAllOrders,
  getTopSellingProducts,
  getTopSellingProductsByDateRange,
  compareTopSellingProducts,
  getOrderItemsByOrderId
} from "../../database";

// Khởi tạo tất cả các bảng khi ứng dụng khởi động
const initDB = async () => {
  try {
    await initAllDatabases();
    console.log("All databases initialized successfully!");
  } catch (error: any) {
    console.error("Error initializing databases:", error);
    Alert.alert("Error", "Failed to initialize databases");
  }
};
useEffect(() => {
  initDB();
}, []);
export default function HomePage() {
  // Hàm thử đăng ký người dùng
  const testRegister = async () => {
    try {
      await registerUser("Admin", "admin@example.com", "password123");
      Alert.alert("Success", "User registered successfully!");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to register user");
    }
  };

  // Hàm thử lấy tất cả người dùng
  const testGetUsers = async () => {
    try {
      const users = await getAllUsers();
      Alert.alert("Users", JSON.stringify(users, null, 2));
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to fetch users");
    }
  };
  
  // Hàm thử lấy thông tin người dùng theo ID
  const testGetUserById = async () => {
    try {
      // Lấy danh sách người dùng trước
      const users = await getAllUsers();
      if (users.length === 0) {
        Alert.alert("Error", "No users found. Please register a user first.");
        return;
      }
      
      // Lấy ID của người dùng đầu tiên
      const userId = users[0].id;
      const user = await getUserById(userId);
      Alert.alert("User Details", `User ID: ${userId}\n${JSON.stringify(user, null, 2)}`);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to fetch user details");
    }
  };
  
  // Hàm thử cập nhật thông tin người dùng
  const testUpdateUser = async () => {
    try {
      // Lấy danh sách người dùng trước
      const users = await getAllUsers();
      if (users.length === 0) {
        Alert.alert("Error", "No users found. Please register a user first.");
        return;
      }
      
      // Lấy ID của người dùng đầu tiên
      const userId = users[0].id;
      
      // Cập nhật thông tin người dùng
      const result = await updateUser(userId, {
        avatar: "https://example.com/avatar.jpg",
        age: 30,
        role: "Manager"
      });
      
      // Lấy thông tin người dùng sau khi cập nhật
      const updatedUser = await getUserById(userId);
      Alert.alert("User Updated", `Changes: ${result.changes}\nUpdated User: ${JSON.stringify(updatedUser, null, 2)}`);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update user");
    }
  };
  
  // Hàm thử xóa người dùng
  const testDeleteUser = async () => {
    try {
      // Đăng ký người dùng mới để xóa
      const randomUsername = `user_${Math.floor(Math.random() * 10000)}`;
      const randomEmail = `${randomUsername}@example.com`;
      
      const registerResult = await registerUser(randomUsername, randomEmail, "password123");
      const userId = registerResult.lastInsertRowId;
      
      // Xóa người dùng
      const result = await deleteUser(userId);
      Alert.alert("User Deleted", `User ID: ${userId}\nChanges: ${result.changes}`);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to delete user");
    }
  };

  // Hàm thử lấy tất cả danh mục
  const testGetCategories = async () => {
    try {
      const categories = await getAllCategories();
      Alert.alert("Categories", JSON.stringify(categories, null, 2));
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to fetch categories");
    }
  };

  // Hàm thử lấy tất cả sản phẩm
  const testGetProducts = async () => {
    try {
      const products = await getAllProducts();
      Alert.alert("Products", JSON.stringify(products, null, 2));
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to fetch products");
    }
  };

  // Hàm thử lấy tất cả hóa đơn
  const testGetOrders = async () => {
    try {
      const orders = await getAllOrders();
      Alert.alert("Orders", JSON.stringify(orders, null, 2));
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to fetch orders");
    }
  };

  // Hàm thử lấy chi tiết hóa đơn theo ID
  const testGetOrderItems = async () => {
    try {
      // Lấy danh sách hóa đơn trước
      const orders = await getAllOrders();
      if (orders.length === 0) {
        Alert.alert("Error", "No orders found. Please create an order first.");
        return;
      }
      
      // Lấy ID của hóa đơn đầu tiên
      const orderId = orders[0].id;
      const orderItems = await getOrderItemsByOrderId(orderId);
      Alert.alert("Order Items", `Order ID: ${orderId}\n${JSON.stringify(orderItems, null, 2)}`);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to fetch order items");
    }
  };

  // Hàm thử lấy sản phẩm bán chạy
  const testTopSellingProducts = async () => {
    try {
      const topProducts = await getTopSellingProducts(5);
      Alert.alert("Top Selling Products", JSON.stringify(topProducts, null, 2));
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to fetch top selling products");
    }
  };

  // Hàm thử lấy sản phẩm bán chạy theo khoảng thời gian
  const testTopSellingByDateRange = async () => {
    try {
      // Lấy sản phẩm bán chạy trong 30 ngày qua
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      
      // Chuyển đổi Date thành chuỗi định dạng YYYY-MM-DD
      const endDateStr = endDate.toISOString().split('T')[0];
      const startDateStr = startDate.toISOString().split('T')[0];
      
      const topProducts = await getTopSellingProductsByDateRange(startDateStr, endDateStr, 5);
      Alert.alert("Top Selling Products (Last 30 Days)", JSON.stringify(topProducts, null, 2));
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to fetch top selling products by date range");
    }
  };

  // Hàm thử so sánh sản phẩm bán chạy giữa hai khoảng thời gian
  const testCompareTopSelling = async () => {
    try {
      // Khoảng thời gian 1: 30-60 ngày trước
      const endDate1 = new Date();
      endDate1.setDate(endDate1.getDate() - 30);
      const startDate1 = new Date();
      startDate1.setDate(startDate1.getDate() - 60);
      
      // Khoảng thời gian 2: 30 ngày qua
      const endDate2 = new Date();
      const startDate2 = new Date();
      startDate2.setDate(startDate2.getDate() - 30);
      
      // Chuyển đổi Date thành chuỗi định dạng YYYY-MM-DD
      const startDate1Str = startDate1.toISOString().split('T')[0];
      const endDate1Str = endDate1.toISOString().split('T')[0];
      const startDate2Str = startDate2.toISOString().split('T')[0];
      const endDate2Str = endDate2.toISOString().split('T')[0];
      
      const comparison = await compareTopSellingProducts(startDate1Str, endDate1Str, startDate2Str, endDate2Str, 5);
      Alert.alert("Top Selling Products Comparison", JSON.stringify(comparison, null, 2));
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to compare top selling products");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 24, marginBottom: 20 }}>
          Mini Supermarket Database Demo
        </Text>

        <Text style={{ fontSize: 18, marginTop: 10, marginBottom: 5 }}>
          User Management
        </Text>
        <View style={{ flexDirection: "row", marginBottom: 10, flexWrap: "wrap", justifyContent: "center" }}>
          <Button title="Register User" onPress={testRegister} />
          <View style={{ width: 10 }} />
          <Button title="Get All Users" onPress={testGetUsers} />
        </View>
        <View style={{ flexDirection: "row", marginBottom: 10, flexWrap: "wrap", justifyContent: "center" }}>
          <Button title="Get User by ID" onPress={testGetUserById} />
          <View style={{ width: 10 }} />
          <Button title="Update User" onPress={testUpdateUser} />
          <View style={{ width: 10 }} />
          <Button title="Delete User" onPress={testDeleteUser} />
        </View>

        <Text style={{ fontSize: 18, marginTop: 10, marginBottom: 5 }}>
          Product Management
        </Text>
        <View style={{ flexDirection: "row", marginBottom: 10, flexWrap: "wrap", justifyContent: "center" }}>
          <Button title="Get Categories" onPress={testGetCategories} />
          <View style={{ width: 10 }} />
          <Button title="Get Products" onPress={testGetProducts} />
        </View>

        <Text style={{ fontSize: 18, marginTop: 10, marginBottom: 5 }}>
          Order Management
        </Text>
        <View style={{ flexDirection: "row", marginBottom: 10, flexWrap: "wrap", justifyContent: "center" }}>
          <Button title="Get All Orders" onPress={testGetOrders} />
          <View style={{ width: 10 }} />
          <Button title="Get Order Items" onPress={testGetOrderItems} />
        </View>

        <Text style={{ fontSize: 18, marginTop: 10, marginBottom: 5 }}>
          Sales Statistics
        </Text>
        <View style={{ flexDirection: "row", marginBottom: 10, flexWrap: "wrap", justifyContent: "center" }}>
          <Button title="Top Selling Products" onPress={testTopSellingProducts} />
          <View style={{ width: 10 }} />
          <Button title="Top Products (30 Days)" onPress={testTopSellingByDateRange} />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Button title="Compare Top Products" onPress={testCompareTopSelling} />
        </View>
      </View>
    </ScrollView>
  );
}
