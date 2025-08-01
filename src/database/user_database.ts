import * as SQLite from "expo-sqlite";

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  isAdmin: number;
  avatar?: string; // URL hoặc đường dẫn đến ảnh đại diện
  age?: number; // Tuổi của người dùng
  role?: string; // Chức vụ của người dùng
  status?: number; // Trạng thái đăng nhập
}

interface QueryResult {
  lastInsertRowId: number;
  changes: number;
}

// Khởi tạo cơ sở dữ liệu
export const initDatabase = async (): Promise<void> => {
  try {
    const db = await SQLite.openDatabaseAsync("user_database.db");

    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        isAdmin INTEGER NOT NULL DEFAULT 0,
        avatar TEXT,
        age INTEGER,
        role TEXT
      );
      INSERT OR IGNORE INTO users (username, email, password, isAdmin) VALUES ('admin', 'admin@example.com', 'admin123', 1);
    `);

    console.log("Database initialized with admin account");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

// Đăng ký người dùng mới
export const registerUser = async (
  username: string,
  email: string,
  password: string,
  isAdmin: number = 0,
  avatar?: string,
  age?: number,
  role?: string
): Promise<QueryResult> => {
  try {
    const db = await SQLite.openDatabaseAsync("user_database.db");

    // Kiểm tra xem email đã tồn tại chưa
    const existingEmail = await db.getFirstAsync<User>(
      `SELECT * FROM users WHERE email = ?;`,
      [email],
    );
    if (existingEmail) {
      console.log("Email already exists:", email);
      throw new Error("Email already exists");
    }

    // Kiểm tra xem username đã tồn tại chưa
    const existingUsername = await db.getFirstAsync<User>(
      `SELECT * FROM users WHERE username = ?;`,
      [username],
    );
    if (existingUsername) {
      console.log("Username already exists:", username);
      throw new Error("Username already exists");
    }

    // Chuẩn bị câu lệnh SQL và tham số dựa trên các trường có giá trị
    let sql = `INSERT INTO users (username, email, password, isAdmin`;
    const params: any[] = [username, email, password, isAdmin];
    
    if (avatar !== undefined) {
      sql += `, avatar`;
      params.push(avatar);
    }
    
    if (age !== undefined) {
      sql += `, age`;
      params.push(age);
    }
    
    if (role !== undefined) {
      sql += `, role`;
      params.push(role);
    }
    
    sql += `) VALUES (?, ?, ?, ?`;
    
    // Thêm dấu ? cho mỗi tham số đã thêm
    for (let i = 0; i < params.length - 4; i++) {
      sql += `, ?`;
    }
    
    sql += `);`;
    
    const result = await db.runAsync(sql, params);
    console.log("User registered:", {
      username,
      email,
      lastInsertRowId: result.lastInsertRowId,
    });
    return result;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Đăng nhập người dùng
export const loginUser = async (
  email: string,
  password: string,
): Promise<User> => {
  try {
    const db = await SQLite.openDatabaseAsync("user_database.db");
    const user = await db.getFirstAsync<User>(
      `SELECT * FROM users WHERE email = ? AND password = ?;`,
      [email, password],
    );
    if (user) {
      console.log("Login successful:", user);
      // Gán status vào user trước khi trả về
      user.status = 200;
      return user;
    } else {
      console.log("Invalid email or password");
      throw new Error("Tài khoản mật khẩu không chính xác");
    }
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

// Lấy tất cả người dùng (dành cho admin)
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const db = await SQLite.openDatabaseAsync("user_database.db");
    const users = await db.getAllAsync<User>(`SELECT * FROM users;`);
    console.log("Fetched users:", users);
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Lấy thông tin người dùng theo ID
export const getUserById = async (id: number): Promise<User> => {
  try {
    const db = await SQLite.openDatabaseAsync("user_database.db");
    const user = await db.getFirstAsync<User>(
      `SELECT * FROM users WHERE id = ?;`,
      [id],
    );
    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

// Cập nhật thông tin người dùng
export const updateUser = async (
  id: number,
  userData: {
    username?: string;
    email?: string;
    password?: string;
    isAdmin?: number;
    avatar?: string;
    age?: number;
    role?: string;
  }
): Promise<QueryResult> => {
  try {
    const db = await SQLite.openDatabaseAsync("user_database.db");
    
    // Kiểm tra xem người dùng có tồn tại không
    const existingUser = await db.getFirstAsync<User>(
      `SELECT * FROM users WHERE id = ?;`,
      [id],
    );
    if (!existingUser) {
      throw new Error("Không tìm thấy người dùng");
    }
    
    // Kiểm tra xem username mới có trùng với người dùng khác không
    if (userData.username && userData.username !== existingUser.username) {
      const existingUsername = await db.getFirstAsync<User>(
        `SELECT * FROM users WHERE username = ? AND id != ?;`,
        [userData.username, id],
      );
      if (existingUsername) {
        throw new Error("Tên người dùng đã tồn tại");
      }
    }
    
    // Kiểm tra xem email mới có trùng với người dùng khác không
    if (userData.email && userData.email !== existingUser.email) {
      const existingEmail = await db.getFirstAsync<User>(
        `SELECT * FROM users WHERE email = ? AND id != ?;`,
        [userData.email, id],
      );
      if (existingEmail) {
        throw new Error("Email đã tồn tại");
      }
    }
    
    // Xây dựng câu lệnh SQL động dựa trên các trường cần cập nhật
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    
    if (userData.username !== undefined) {
      updateFields.push("username = ?");
      updateValues.push(userData.username);
    }
    
    if (userData.email !== undefined) {
      updateFields.push("email = ?");
      updateValues.push(userData.email);
    }
    
    if (userData.password !== undefined) {
      updateFields.push("password = ?");
      updateValues.push(userData.password);
    }
    
    if (userData.isAdmin !== undefined) {
      updateFields.push("isAdmin = ?");
      updateValues.push(userData.isAdmin);
    }
    
    if (userData.avatar !== undefined) {
      updateFields.push("avatar = ?");
      updateValues.push(userData.avatar);
    }
    
    if (userData.age !== undefined) {
      updateFields.push("age = ?");
      updateValues.push(userData.age);
    }
    
    if (userData.role !== undefined) {
      updateFields.push("role = ?");
      updateValues.push(userData.role);
    }
    
    // Nếu không có trường nào cần cập nhật
    if (updateFields.length === 0) {
      return { lastInsertRowId: 0, changes: 0 };
    }
    
    // Thêm ID vào cuối mảng giá trị
    updateValues.push(id);
    
    const result = await db.runAsync(
      `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?;`,
      updateValues,
    );
    
    console.log("User updated:", { id, ...userData });
    return result;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Xóa người dùng
export const deleteUser = async (id: number): Promise<QueryResult> => {
  try {
    const db = await SQLite.openDatabaseAsync("user_database.db");
    
    // Kiểm tra xem người dùng có tồn tại không
    const existingUser = await db.getFirstAsync<User>(
      `SELECT * FROM users WHERE id = ?;`,
      [id],
    );
    if (!existingUser) {
      throw new Error("Không tìm thấy người dùng");
    }
    
    const result = await db.runAsync(
      `DELETE FROM users WHERE id = ?;`,
      [id],
    );
    
    console.log("User deleted:", id);
    return result;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
