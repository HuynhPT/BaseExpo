import * as SQLite from 'expo-sqlite';

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  isAdmin: number;
}

interface QueryResult {
  lastInsertRowId: number;
  changes: number;
}

// Khởi tạo cơ sở dữ liệu
export const initDatabase = async (): Promise<void> => {
  try {
    const db = await SQLite.openDatabaseAsync('user_database.db');
    
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        isAdmin INTEGER NOT NULL DEFAULT 0
      );
      INSERT OR IGNORE INTO users (username, email, password, isAdmin) VALUES ('admin', 'admin@example.com', 'admin123', 1);
    `);
    
    console.log('Database initialized with admin account');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Đăng ký người dùng mới
export const registerUser = async (
  username: string,
  email: string,
  password: string,
  isAdmin: number = 0
): Promise<QueryResult> => {
  try {
    const db = await SQLite.openDatabaseAsync('user_database.db');
    
    // Kiểm tra xem email đã tồn tại chưa
    const existingEmail = await db.getFirstAsync<User>(
      `SELECT * FROM users WHERE email = ?;`,
      [email]
    );
    if (existingEmail) {
      console.log('Email already exists:', email);
      throw new Error('Email already exists');
    }
    
    // Kiểm tra xem username đã tồn tại chưa
    const existingUsername = await db.getFirstAsync<User>(
      `SELECT * FROM users WHERE username = ?;`,
      [username]
    );
    if (existingUsername) {
      console.log('Username already exists:', username);
      throw new Error('Username already exists');
    }
    
    const result = await db.runAsync(
      `INSERT INTO users (username, email, password, isAdmin) VALUES (?, ?, ?, ?);`,
      [username, email, password, isAdmin]
    );
    console.log('User registered:', { username, email, lastInsertRowId: result.lastInsertRowId });
    return result;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Đăng nhập người dùng
export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const db = await SQLite.openDatabaseAsync('user_database.db');
    const user = await db.getFirstAsync<User>(
      `SELECT * FROM users WHERE email = ? AND password = ?;`,
      [email, password]
    );
    if (user) {
      console.log('Login successful:', user);
      return user;
    } else {
      console.log('Invalid email or password');
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

// Lấy tất cả người dùng (dành cho admin)
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const db = await SQLite.openDatabaseAsync('user_database.db');
    const users = await db.getAllAsync<User>(`SELECT * FROM users;`);
    console.log('Fetched users:', users);
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};