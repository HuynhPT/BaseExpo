// Export hàm khởi tạo tất cả các bảng
export { initAllDatabases, resetAllDatabases } from './init_database';

// Export các hàm từ user_database
export {
  initDatabase, 
  registerUser, 
  getAllUsers, 
  loginUser, 
  getUserById, 
  updateUser, 
  deleteUser
} from './user_database';

// Export các hàm từ category_database
export {
  initCategoryDatabase,
  addCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById
} from './category_database';

// Export các hàm từ product_database
export {
  initProductDatabase,
  addProduct,
  updateProduct,
  updateProductStock,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts
} from './product_database';

// Export các hàm từ order_database
export {
  initOrderDatabase,
  createOrder,
  updateOrderStatus,
  getAllOrders,
  getOrderById,
  getOrdersByUser,
  getRevenueByDate,
  getTopSellingProducts,
  getTopSellingProductsByDateRange,
  compareTopSellingProducts,
  getOrderItemsByOrderId,
  updateOrderItem,
  deleteOrderItem
} from './order_database';