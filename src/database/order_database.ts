import * as SQLite from "expo-sqlite";

interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string; // 'pending', 'completed', 'cancelled'
  created_at: string;
}

interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product_name?: string;
}

interface OrderWithItems extends Order {
  items: OrderItem[];
}

interface QueryResult {
  lastInsertRowId: number;
  changes: number;
}

// Khởi tạo bảng hóa đơn và chi tiết hóa đơn
export const initOrderDatabase = async (): Promise<void> => {
  try {
    const db = await SQLite.openDatabaseAsync("user_database.db");

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        total_amount REAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
      
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
      );
    `);

    console.log("Order database initialized");
  } catch (error) {
    console.error("Error initializing order database:", error);
    throw error;
  }
};

// Tạo hóa đơn mới
export const createOrder = async (
  user_id: number,
  items: { product_id: number; quantity: number }[]
): Promise<number> => {
  try {
    const db = await SQLite.openDatabaseAsync("user_database.db");

    // Kiểm tra xem người dùng có tồn tại không
    const existingUser = await db.getFirstAsync<{ id: number }>(
      `SELECT id FROM users WHERE id = ?;`,
      [user_id]
    );
    if (!existingUser) {
      console.log("User not found:", user_id);
      throw new Error("Người dùng không tồn tại");
    }

    // Kiểm tra sản phẩm và tính tổng tiền
    let totalAmount = 0;
    const productDetails = [];

    for (const item of items) {
      const product = await db.getFirstAsync<{ id: number; name: string; price: number; stock: number }>(
        `SELECT id, name, price, stock FROM products WHERE id = ?;`,
        [item.product_id]
      );

      if (!product) {
        throw new Error(`Sản phẩm với ID ${item.product_id} không tồn tại`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Sản phẩm ${product.name} không đủ số lượng trong kho`);
      }

      totalAmount += product.price * item.quantity;
      productDetails.push({
        ...product,
        quantity: item.quantity,
      });
    }

    // Bắt đầu giao dịch
    await db.execAsync('BEGIN TRANSACTION;');

    try {
      // Tạo hóa đơn
      const orderResult = await db.runAsync(
        `INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, 'pending');`,
        [user_id, totalAmount]
      );

      const orderId = orderResult.lastInsertRowId;

      // Thêm chi tiết hóa đơn
      for (const product of productDetails) {
        await db.runAsync(
          `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?);`,
          [orderId, product.id, product.quantity, product.price]
        );

        // Cập nhật số lượng sản phẩm trong kho
        await db.runAsync(
          `UPDATE products SET stock = stock - ? WHERE id = ?;`,
          [product.quantity, product.id]
        );
      }

      // Hoàn thành giao dịch
      await db.execAsync('COMMIT;');

      console.log("Order created:", {
        orderId,
        user_id,
        totalAmount,
        items: productDetails,
      });

      return orderId;
    } catch (error) {
      // Nếu có lỗi, hủy giao dịch
      await db.execAsync('ROLLBACK;');
      throw error;
    }
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Cập nhật trạng thái hóa đơn
export const updateOrderStatus = async (
  id: number,
  status: 'pending' | 'completed' | 'cancelled'
): Promise<QueryResult> => {
  try {
    const db = await SQLite.openDatabaseAsync("user_database.db");

    // Kiểm tra xem hóa đơn có tồn tại không
    const existingOrder = await db.getFirstAsync<Order>(
      `SELECT * FROM orders WHERE id = ?;`,
      [id]
    );
    if (!existingOrder) {
      console.log("Order not found:", id);
      throw new Error("Không tìm thấy hóa đơn");
    }

    // Nếu hủy đơn hàng, hoàn lại số lượng sản phẩm
    if (status === 'cancelled' && existingOrder.status !== 'cancelled') {
      await db.execAsync('BEGIN TRANSACTION;');

      try {
        // Lấy chi tiết đơn hàng
        const orderItems = await db.getAllAsync<OrderItem>(
          `SELECT * FROM order_items WHERE order_id = ?;`,
          [id]
        );

        // Hoàn lại số lượng sản phẩm
        for (const item of orderItems) {
          await db.runAsync(
            `UPDATE products SET stock = stock + ? WHERE id = ?;`,
            [item.quantity, item.product_id]
          );
        }

        // Cập nhật trạng thái đơn hàng
        const result = await db.runAsync(
          `UPDATE orders SET status = ? WHERE id = ?;`,
          [status, id]
        );

        // Hoàn thành giao dịch
        await db.execAsync('COMMIT;');

        console.log("Order status updated:", {
          id,
          status,
        });

        return result;
      } catch (error) {
        // Nếu có lỗi, hủy giao dịch
        await db.execAsync('ROLLBACK;');
        throw error;
      }
    } else {
      // Cập nhật trạng thái đơn hàng bình thường
      const result = await db.runAsync(
        `UPDATE orders SET status = ? WHERE id = ?;`,
        [status, id]
      );

      console.log("Order status updated:", {
        id,
        status,
      });

      return result;
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

// Lấy tất cả hóa đơn
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const db = await SQLite.openDatabaseAsync("user_database.db");
    const orders = await db.getAllAsync<Order>(`
      SELECT o.*, u.username as user_name 
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id 
      ORDER BY o.created_at DESC;
    `);
    console.log("Fetched orders:", orders);
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

// Lấy hóa đơn theo ID kèm chi tiết
export const getOrderById = async (id: number): Promise<OrderWithItems> => {
  try {
    const db = await SQLite.openDatabaseAsync("user_database.db");

    // Lấy thông tin hóa đơn
    const order = await db.getFirstAsync<Order>(
      `SELECT o.*, u.username as user_name 
       FROM orders o 
       LEFT JOIN users u ON o.user_id = u.id 
       WHERE o.id = ?;`,
      [id]
    );

    if (!order) {
      console.log("Order not found:", id);
      throw new Error("Không tìm thấy hóa đơn");
    }

    // Lấy chi tiết hóa đơn
    const orderItems = await db.getAllAsync<OrderItem>(
      `SELECT oi.*, p.name as product_name 
       FROM order_items oi 
       LEFT JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?;`,
      [id]
    );

    const orderWithItems: OrderWithItems = {
      ...order,
      items: orderItems,
    };

    console.log("Fetched order with items:", orderWithItems);
    return orderWithItems;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

// Lấy hóa đơn theo người dùng
export const getOrdersByUser = async (userId: number): Promise<Order[]> => {
  try {
    const db = await SQLite.openDatabaseAsync("user_database.db");
    const orders = await db.getAllAsync<Order>(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC;`,
      [userId]
    );
    console.log("Fetched orders by user:", userId, orders);
    return orders;
  } catch (error) {
    console.error("Error fetching orders by user:", error);
    throw error;
  }
};

// Lấy thống kê doanh thu theo ngày
export const getRevenueByDate = async (startDate: string, endDate: string): Promise<any[]> => {
  try {
    const db = await SQLite.openDatabaseAsync("user_database.db");
    const revenue = await db.getAllAsync<{ date: string; total: number; count: number }>(
      `SELECT date(created_at) as date, SUM(total_amount) as total, COUNT(*) as count 
       FROM orders 
       WHERE status = 'completed' 
       AND date(created_at) BETWEEN date(?) AND date(?) 
       GROUP BY date(created_at) 
       ORDER BY date(created_at);`,
      [startDate, endDate]
    );
    console.log("Fetched revenue by date:", revenue);
    return revenue;
  } catch (error) {
    console.error("Error fetching revenue by date:", error);
    throw error;
  }
};

// Lấy thống kê sản phẩm bán chạy
export const getTopSellingProducts = async (limit: number = 10): Promise<any[]> => {
  try {
    const db = await SQLite.openDatabaseAsync("user_database.db");
    const products = await db.getAllAsync<{ product_id: number; product_name: string; total_quantity: number; total_revenue: number }>(
      `SELECT oi.product_id, p.name as product_name, SUM(oi.quantity) as total_quantity, SUM(oi.quantity * oi.price) as total_revenue 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       JOIN orders o ON oi.order_id = o.id 
       WHERE o.status = 'completed' 
       GROUP BY oi.product_id 
       ORDER BY total_quantity DESC 
       LIMIT ?;`,
      [limit]
    );
    console.log("Fetched top selling products:", products);
    return products;
  } catch (error) {
    console.error("Error fetching top selling products:", error);
    throw error;
  }
};

// Lấy thống kê sản phẩm bán chạy theo khoảng thời gian
export const getTopSellingProductsByDateRange = async (
  startDate: string,
  endDate: string,
  limit: number = 10
): Promise<any[]> => {
  try {
    const db = await SQLite.openDatabaseAsync("user_database.db");
    const products = await db.getAllAsync<{ product_id: number; product_name: string; total_quantity: number; total_revenue: number }>(
      `SELECT oi.product_id, p.name as product_name, SUM(oi.quantity) as total_quantity, SUM(oi.quantity * oi.price) as total_revenue 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       JOIN orders o ON oi.order_id = o.id 
       WHERE o.status = 'completed' 
       AND date(o.created_at) BETWEEN date(?) AND date(?) 
       GROUP BY oi.product_id 
       ORDER BY total_quantity DESC 
       LIMIT ?;`,
      [startDate, endDate, limit]
    );
    console.log("Fetched top selling products by date range:", products);
    return products;
  } catch (error) {
    console.error("Error fetching top selling products by date range:", error);
    throw error;
  }
};

// So sánh thống kê sản phẩm bán chạy giữa hai khoảng thời gian
export const compareTopSellingProducts = async (
  startDate1: string,
  endDate1: string,
  startDate2: string,
  endDate2: string,
  limit: number = 10
): Promise<any[]> => {
  try {
    const db = await SQLite.openDatabaseAsync("user_database.db");
    const products = await db.getAllAsync<{
      product_id: number;
      product_name: string;
      period1_quantity: number;
      period1_revenue: number;
      period2_quantity: number;
      period2_revenue: number;
      quantity_change: number;
      revenue_change: number;
    }>(
      `SELECT 
        p.id as product_id, 
        p.name as product_name,
        COALESCE(period1.total_quantity, 0) as period1_quantity,
        COALESCE(period1.total_revenue, 0) as period1_revenue,
        COALESCE(period2.total_quantity, 0) as period2_quantity,
        COALESCE(period2.total_revenue, 0) as period2_revenue,
        COALESCE(period2.total_quantity, 0) - COALESCE(period1.total_quantity, 0) as quantity_change,
        COALESCE(period2.total_revenue, 0) - COALESCE(period1.total_revenue, 0) as revenue_change
      FROM products p
      LEFT JOIN (
        SELECT 
          oi.product_id, 
          SUM(oi.quantity) as total_quantity, 
          SUM(oi.quantity * oi.price) as total_revenue
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        WHERE o.status = 'completed'
        AND date(o.created_at) BETWEEN date(?) AND date(?)
        GROUP BY oi.product_id
      ) period1 ON p.id = period1.product_id
      LEFT JOIN (
        SELECT 
          oi.product_id, 
          SUM(oi.quantity) as total_quantity, 
          SUM(oi.quantity * oi.price) as total_revenue
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        WHERE o.status = 'completed'
        AND date(o.created_at) BETWEEN date(?) AND date(?)
        GROUP BY oi.product_id
      ) period2 ON p.id = period2.product_id
      WHERE period1.total_quantity IS NOT NULL OR period2.total_quantity IS NOT NULL
      ORDER BY ABS(quantity_change) DESC
      LIMIT ?;`,
      [startDate1, endDate1, startDate2, endDate2, limit]
    );
    console.log("Compared top selling products between periods:", products);
    return products;
  } catch (error) {
    console.error("Error comparing top selling products:", error);
    throw error;
  }
};

// Lấy chi tiết hóa đơn theo ID hóa đơn
export const getOrderItemsByOrderId = async (orderId: number): Promise<OrderItem[]> => {
  try {
    const db = await SQLite.openDatabaseAsync("user_database.db");
    const orderItems = await db.getAllAsync<OrderItem>(
      `SELECT oi.*, p.name as product_name 
       FROM order_items oi 
       LEFT JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?;`,
      [orderId]
    );
    console.log("Fetched order items by order ID:", orderId, orderItems);
    return orderItems;
  } catch (error) {
    console.error("Error fetching order items by order ID:", error);
    throw error;
  }
};

// Cập nhật chi tiết hóa đơn
export const updateOrderItem = async (
  id: number,
  quantity: number,
  price: number
): Promise<QueryResult> => {
  try {
    const db = await SQLite.openDatabaseAsync("user_database.db");

    // Kiểm tra xem chi tiết hóa đơn có tồn tại không
    const existingOrderItem = await db.getFirstAsync<OrderItem>(
      `SELECT * FROM order_items WHERE id = ?;`,
      [id]
    );
    if (!existingOrderItem) {
      console.log("Order item not found:", id);
      throw new Error("Không tìm thấy chi tiết hóa đơn");
    }

    // Lấy thông tin hóa đơn
    const order = await db.getFirstAsync<Order>(
      `SELECT * FROM orders WHERE id = ?;`,
      [existingOrderItem.order_id]
    );
    if (!order) {
      throw new Error("Không tìm thấy hóa đơn");
    }

    // Không cho phép cập nhật nếu hóa đơn đã hoàn thành hoặc đã hủy
    if (order.status !== 'pending') {
      throw new Error("Không thể cập nhật chi tiết hóa đơn đã hoàn thành hoặc đã hủy");
    }

    // Tính toán sự thay đổi số lượng
    const quantityDiff = quantity - existingOrderItem.quantity;

    // Kiểm tra số lượng tồn kho nếu tăng số lượng
    if (quantityDiff > 0) {
      const product = await db.getFirstAsync<{ stock: number }>(
        `SELECT stock FROM products WHERE id = ?;`,
        [existingOrderItem.product_id]
      );
      if (!product || product.stock < quantityDiff) {
        throw new Error("Không đủ số lượng sản phẩm trong kho");
      }
    }

    await db.execAsync('BEGIN TRANSACTION;');

    try {
      // Cập nhật chi tiết hóa đơn
      const result = await db.runAsync(
        `UPDATE order_items SET quantity = ?, price = ? WHERE id = ?;`,
        [quantity, price, id]
      );

      // Cập nhật số lượng sản phẩm trong kho
      await db.runAsync(
        `UPDATE products SET stock = stock - ? WHERE id = ?;`,
        [quantityDiff, existingOrderItem.product_id]
      );

      // Cập nhật tổng tiền hóa đơn
      const orderItems = await db.getAllAsync<{ total: number }>(
        `SELECT SUM(quantity * price) as total FROM order_items WHERE order_id = ?;`,
        [existingOrderItem.order_id]
      );

      await db.runAsync(
        `UPDATE orders SET total_amount = ? WHERE id = ?;`,
        [orderItems[0]?.total || 0, existingOrderItem.order_id]
      );

      await db.execAsync('COMMIT;');

      console.log("Order item updated:", {
        id,
        quantity,
        price,
      });

      return result;
    } catch (error) {
      await db.execAsync('ROLLBACK;');
      throw error;
    }
  } catch (error) {
    console.error("Error updating order item:", error);
    throw error;
  }
};

// Xóa chi tiết hóa đơn
export const deleteOrderItem = async (id: number): Promise<QueryResult> => {
  try {
    const db = await SQLite.openDatabaseAsync("user_database.db");

    // Kiểm tra xem chi tiết hóa đơn có tồn tại không
    const existingOrderItem = await db.getFirstAsync<OrderItem>(
      `SELECT * FROM order_items WHERE id = ?;`,
      [id]
    );
    if (!existingOrderItem) {
      console.log("Order item not found:", id);
      throw new Error("Không tìm thấy chi tiết hóa đơn");
    }

    // Lấy thông tin hóa đơn
    const order = await db.getFirstAsync<Order>(
      `SELECT * FROM orders WHERE id = ?;`,
      [existingOrderItem.order_id]
    );
    if (!order) {
      throw new Error("Không tìm thấy hóa đơn");
    }

    // Không cho phép xóa nếu hóa đơn đã hoàn thành hoặc đã hủy
    if (order.status !== 'pending') {
      throw new Error("Không thể xóa chi tiết hóa đơn đã hoàn thành hoặc đã hủy");
    }

    await db.execAsync('BEGIN TRANSACTION;');

    try {
      // Xóa chi tiết hóa đơn
      const result = await db.runAsync(
        `DELETE FROM order_items WHERE id = ?;`,
        [id]
      );

      // Hoàn lại số lượng sản phẩm trong kho
      await db.runAsync(
        `UPDATE products SET stock = stock + ? WHERE id = ?;`,
        [existingOrderItem.quantity, existingOrderItem.product_id]
      );

      // Cập nhật tổng tiền hóa đơn
      const orderItems = await db.getAllAsync<{ total: number }>(
        `SELECT SUM(quantity * price) as total FROM order_items WHERE order_id = ?;`,
        [existingOrderItem.order_id]
      );

      await db.runAsync(
        `UPDATE orders SET total_amount = ? WHERE id = ?;`,
        [orderItems[0]?.total || 0, existingOrderItem.order_id]
      );

      // Nếu không còn chi tiết hóa đơn nào, xóa hóa đơn
      const remainingItems = await db.getAllAsync<{ count: number }>(
        `SELECT COUNT(*) as count FROM order_items WHERE order_id = ?;`,
        [existingOrderItem.order_id]
      );

      if (remainingItems[0]?.count === 0) {
        await db.runAsync(
          `DELETE FROM orders WHERE id = ?;`,
          [existingOrderItem.order_id]
        );
      }

      await db.execAsync('COMMIT;');

      console.log("Order item deleted:", id);

      return result;
    } catch (error) {
      await db.execAsync('ROLLBACK;');
      throw error;
    }
  } catch (error) {
    console.error("Error deleting order item:", error);
    throw error;
  }
};