import * as SQLite from "expo-sqlite";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  category_id: number;
  created_at: string;
}

interface QueryResult {
  lastInsertRowId: number;
  changes: number;
}

// Khởi tạo bảng sản phẩm
export const initProductDatabase = async (): Promise<void> => {
  try {
    const db = await SQLite.openDatabaseAsync("user_database.db");

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        image_url TEXT,
        category_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories (id)
      );
      
      INSERT OR IGNORE INTO products (name, description, price, stock, category_id) 
      VALUES ('Nước suối', 'Nước suối tinh khiết', 10000, 100, 1);
      
      INSERT OR IGNORE INTO products (name, description, price, stock, category_id) 
      VALUES ('Bánh mì', 'Bánh mì tươi', 15000, 50, 2);
      
      INSERT OR IGNORE INTO products (name, description, price, stock, category_id) 
      VALUES ('Chổi quét nhà', 'Chổi quét nhà cao cấp', 50000, 20, 3);
    `);

    console.log("Product database initialized");
  } catch (error) {
    console.error("Error initializing product database:", error);
    throw error;
  }
};

// Thêm sản phẩm mới
export const addProduct = async (
  name: string,
  description: string,
  price: number,
  stock: number,
  image_url: string = "",
  category_id: number
): Promise<QueryResult> => {
  try {
    const db = await SQLite.openDatabaseAsync("user_database.db");

    // Kiểm tra xem danh mục có tồn tại không
    const existingCategory = await db.getFirstAsync<{ id: number }>(
      `SELECT id FROM categories WHERE id = ?;`,
      [category_id]
    );
    if (!existingCategory) {
      console.log("Category not found:", category_id);
      throw new Error("Danh mục không tồn tại");
    }

    const result = await db.runAsync(
      `INSERT INTO products (name, description, price, stock, image_url, category_id) 
       VALUES (?, ?, ?, ?, ?, ?);`,
      [name, description, price, stock, image_url, category_id]
    );
    console.log("Product added:", {
      name,
      price,
      category_id,
      lastInsertRowId: result.lastInsertRowId,
    });
    return result;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (
  id: number,
  name: string,
  description: string,
  price: number,
  stock: number,
  image_url: string = "",
  category_id: number
): Promise<QueryResult> => {
  try {
    const db = await SQLite.openDatabaseAsync("user_database.db");

    // Kiểm tra xem sản phẩm có tồn tại không
    const existingProduct = await db.getFirstAsync<Product>(
      `SELECT * FROM products WHERE id = ?;`,
      [id]
    );
    if (!existingProduct) {
      console.log("Product not found:", id);
      throw new Error("Không tìm thấy sản phẩm");
    }

    // Kiểm tra xem danh mục có tồn tại không
    const existingCategory = await db.getFirstAsync<{ id: number }>(
      `SELECT id FROM categories WHERE id = ?;`,
      [category_id]
    );
    if (!existingCategory) {
      console.log("Category not found:", category_id);
      throw new Error("Danh mục không tồn tại");
    }

    const result = await db.runAsync(
      `UPDATE products 
       SET name = ?, description = ?, price = ?, stock = ?, image_url = ?, category_id = ? 
       WHERE id = ?;`,
      [name, description, price, stock, image_url, category_id, id]
    );
    console.log("Product updated:", {
      id,
      name,
      price,
      category_id,
    });
    return result;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Cập nhật số lượng sản phẩm
export const updateProductStock = async (
  id: number,
  stock: number
): Promise<QueryResult> => {
  try {
    const db = await SQLite.openDatabaseAsync("user_database.db");

    // Kiểm tra xem sản phẩm có tồn tại không
    const existingProduct = await db.getFirstAsync<Product>(
      `SELECT * FROM products WHERE id = ?;`,
      [id]
    );
    if (!existingProduct) {
      console.log("Product not found:", id);
      throw new Error("Không tìm thấy sản phẩm");
    }

    const result = await db.runAsync(
      `UPDATE products SET stock = ? WHERE id = ?;`,
      [stock, id]
    );
    console.log("Product stock updated:", {
      id,
      stock,
    });
    return result;
  } catch (error) {
    console.error("Error updating product stock:", error);
    throw error;
  }
};

// Xóa sản phẩm
export const deleteProduct = async (id: number): Promise<QueryResult> => {
  try {
    const db = await SQLite.openDatabaseAsync("user_database.db");

    // Kiểm tra xem sản phẩm có tồn tại không
    const existingProduct = await db.getFirstAsync<Product>(
      `SELECT * FROM products WHERE id = ?;`,
      [id]
    );
    if (!existingProduct) {
      console.log("Product not found:", id);
      throw new Error("Không tìm thấy sản phẩm");
    }

    // Kiểm tra xem sản phẩm có trong hóa đơn không
    const orderItems = await db.getAllAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM order_items WHERE product_id = ?;`,
      [id]
    );
    if (orderItems[0]?.count > 0) {
      console.log("Product is in orders:", id);
      throw new Error("Không thể xóa sản phẩm đã có trong hóa đơn");
    }

    const result = await db.runAsync(
      `DELETE FROM products WHERE id = ?;`,
      [id]
    );
    console.log("Product deleted:", id);
    return result;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// Lấy tất cả sản phẩm
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const db = await SQLite.openDatabaseAsync("user_database.db");
    const products = await db.getAllAsync<Product>(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id;
    `);
    console.log("Fetched products:", products);
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Lấy sản phẩm theo ID
export const getProductById = async (id: number): Promise<Product> => {
  try {
    const db = await SQLite.openDatabaseAsync("user_database.db");
    const product = await db.getFirstAsync<Product>(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ?;`,
      [id]
    );
    if (!product) {
      console.log("Product not found:", id);
      throw new Error("Không tìm thấy sản phẩm");
    }
    console.log("Fetched product:", product);
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// Lấy sản phẩm theo danh mục
export const getProductsByCategory = async (categoryId: number): Promise<Product[]> => {
  try {
    const db = await SQLite.openDatabaseAsync("user_database.db");
    const products = await db.getAllAsync<Product>(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.category_id = ?;`,
      [categoryId]
    );
    console.log("Fetched products by category:", categoryId, products);
    return products;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error;
  }
};

// Tìm kiếm sản phẩm theo tên
export const searchProducts = async (keyword: string): Promise<Product[]> => {
  try {
    const db = await SQLite.openDatabaseAsync("user_database.db");
    const products = await db.getAllAsync<Product>(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.name LIKE ? OR p.description LIKE ?;`,
      [`%${keyword}%`, `%${keyword}%`]
    );
    console.log("Search products:", keyword, products);
    return products;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};