import * as SQLite from "expo-sqlite";

interface Category {
    id: number;
    name: string;
    description: string;
    created_at: string;
}

interface QueryResult {
    lastInsertRowId: number;
    changes: number;
}

// Khởi tạo bảng danh mục
export const initCategoryDatabase = async (): Promise<void> => {
    try {
        const db = await SQLite.openDatabaseAsync("user_database.db");

        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      INSERT OR IGNORE INTO categories (name, description) VALUES ('Đồ uống', 'Các loại nước giải khát');
      INSERT OR IGNORE INTO categories (name, description) VALUES ('Thực phẩm', 'Các loại thực phẩm');
      INSERT OR IGNORE INTO categories (name, description) VALUES ('Đồ gia dụng', 'Các sản phẩm gia dụng');
    `);

        console.log("Category database initialized");
    } catch (error) {
        console.error("Error initializing category database:", error);
        throw error;
    }
};

// Thêm danh mục mới
export const addCategory = async (
    name: string,
    description: string
): Promise<QueryResult> => {
    try {
        const db = await SQLite.openDatabaseAsync("user_database.db");

        // Kiểm tra xem danh mục đã tồn tại chưa
        const existingCategory = await db.getFirstAsync<Category>(
            `SELECT * FROM categories WHERE name = ?;`,
            [name]
        );
        if (existingCategory) {
            console.log("Category already exists:", name);
            throw new Error("Danh mục đã tồn tại");
        }

        const result = await db.runAsync(
            `INSERT INTO categories (name, description) VALUES (?, ?);`,
            [name, description]
        );
        console.log("Category added:", {
            name,
            description,
            lastInsertRowId: result.lastInsertRowId,
        });
        return result;
    } catch (error) {
        console.error("Error adding category:", error);
        throw error;
    }
};

// Cập nhật danh mục
export const updateCategory = async (
    id: number,
    name: string,
    description: string
): Promise<QueryResult> => {
    try {
        const db = await SQLite.openDatabaseAsync("user_database.db");

        // Kiểm tra xem danh mục có tồn tại không
        const existingCategory = await db.getFirstAsync<Category>(
            `SELECT * FROM categories WHERE id = ?;`,
            [id]
        );
        if (!existingCategory) {
            console.log("Category not found:", id);
            throw new Error("Không tìm thấy danh mục");
        }

        const result = await db.runAsync(
            `UPDATE categories SET name = ?, description = ? WHERE id = ?;`,
            [name, description, id]
        );
        console.log("Category updated:", {
            id,
            name,
            description,
        });
        return result;
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
};

// Xóa danh mục
export const deleteCategory = async (id: number): Promise<QueryResult> => {
    try {
        const db = await SQLite.openDatabaseAsync("user_database.db");

        // Kiểm tra xem danh mục có tồn tại không
        const existingCategory = await db.getFirstAsync<Category>(
            `SELECT * FROM categories WHERE id = ?;`,
            [id]
        );
        if (!existingCategory) {
            console.log("Category not found:", id);
            throw new Error("Không tìm thấy danh mục");
        }

        // Kiểm tra xem danh mục có sản phẩm không
        const products = await db.getAllAsync<{ count: number }>(
            `SELECT COUNT(*) as count FROM products WHERE category_id = ?;`,
            [id]
        );
        if (products[0]?.count > 0) {
            console.log("Category has products:", id);
            throw new Error("Không thể xóa danh mục đã có sản phẩm");
        }

        const result = await db.runAsync(
            `DELETE FROM categories WHERE id = ?;`,
            [id]
        );
        console.log("Category deleted:", id);
        return result;
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
};

// Lấy tất cả danh mục
export const getAllCategories = async (): Promise<Category[]> => {
    try {
        const db = await SQLite.openDatabaseAsync("user_database.db");
        const categories = await db.getAllAsync<Category>(`SELECT * FROM categories;`);
        console.log("Fetched categories:", categories);
        return categories;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};

// Lấy danh mục theo ID
export const getCategoryById = async (id: number): Promise<Category> => {
    try {
        const db = await SQLite.openDatabaseAsync("user_database.db");
        const category = await db.getFirstAsync<Category>(
            `SELECT * FROM categories WHERE id = ?;`,
            [id]
        );
        if (!category) {
            console.log("Category not found:", id);
            throw new Error("Không tìm thấy danh mục");
        }
        console.log("Fetched category:", category);
        return category;
    } catch (error) {
        console.error("Error fetching category:", error);
        throw error;
    }
};