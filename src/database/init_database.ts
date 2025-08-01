import * as SQLite from "expo-sqlite";
import { initDatabase } from "./user_database";
import { initCategoryDatabase } from "./category_database";
import { initProductDatabase } from "./product_database";
import { initOrderDatabase } from "./order_database";

// Khởi tạo tất cả các bảng trong database
export const initAllDatabases = async (): Promise<void> => {
  try {
    console.log("Initializing all databases...");

    // Khởi tạo bảng users
    await initDatabase();

    // Khởi tạo bảng categories
    await initCategoryDatabase();

    // Khởi tạo bảng products
    await initProductDatabase();

    // Khởi tạo bảng orders và order_items
    await initOrderDatabase();

    console.log("All databases initialized successfully!");
  } catch (error) {
    console.error("Error initializing databases:", error);
    throw error;
  }
};

// Xóa tất cả dữ liệu trong database (chỉ sử dụng cho mục đích phát triển)
export const resetAllDatabases = async (): Promise<void> => {
  try {
    console.log("Resetting all databases...");

    const db = await SQLite.openDatabaseAsync("user_database.db");

    // Xóa tất cả các bảng theo thứ tự để tránh lỗi khóa ngoại
    await db.execAsync(`
      PRAGMA foreign_keys = OFF;
      
      DROP TABLE IF EXISTS order_items;
      DROP TABLE IF EXISTS orders;
      DROP TABLE IF EXISTS products;
      DROP TABLE IF EXISTS categories;
      DROP TABLE IF EXISTS users;
      
      PRAGMA foreign_keys = ON;
    `);

    // Khởi tạo lại tất cả các bảng
    await initAllDatabases();

    console.log("All databases reset successfully!");
  } catch (error) {
    console.error("Error resetting databases:", error);
    throw error;
  }
};
