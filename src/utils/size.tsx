import { Dimensions, PixelRatio } from "react-native";

// Kích thước màn hình chuẩn (dựa trên iPhone 14, width 390px)
const REFERENCE_WIDTH = 390;
const REFERENCE_HEIGHT = 844;

// Lấy kích thước màn hình hiện tại
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Hàm scale kích thước theo chiều rộng
const scaleWidth = (size: number): number => {
  return PixelRatio.roundToNearestPixel(
    (SCREEN_WIDTH / REFERENCE_WIDTH) * size,
  );
};

// Hàm scale kích thước theo chiều cao
const scaleHeight = (size: number): number => {
  return PixelRatio.roundToNearestPixel(
    (SCREEN_HEIGHT / REFERENCE_HEIGHT) * size,
  );
};

// Tạo object kích thước từ 0 đến 200, với bước 5
const generateSizes = (): { [key: number]: number } => {
  const sizes: { [key: number]: number } = {};
  for (let i = 0; i <= 200; i += 1) {
    sizes[i] = scaleWidth(i); // Scale theo chiều rộng
  }
  return sizes;
};

export const SIZE = generateSizes();
export const FONT_SIZE = {
  12: SIZE[12],
  14: SIZE[14],
  16: SIZE[16],
  17: SIZE[17],
  18: SIZE[18],
  20: SIZE[20],
  30: SIZE[30],
  40: SIZE[40],
  50: SIZE[50],
  60: SIZE[60],
};
export const FONT_WEIGHT = {
  400: "400",
  500: "500",
  600: "600",
  700: "700",
  800: "800",
  900: "900",
};
// Kích thước màn hình động
export const SCREEN = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
};

// Hàm cập nhật kích thước màn hình
export const updateScreenDimensions = (): void => {
  SCREEN.width = Dimensions.get("window").width;
  SCREEN.height = Dimensions.get("window").height;
  // Cập nhật lại SIZE khi màn hình thay đổi
  Object.assign(SIZE, generateSizes());
};

// Theo dõi thay đổi kích thước màn hình
Dimensions.addEventListener("change", () => {
  updateScreenDimensions();
});

// Khởi tạo giá trị ban đầu
updateScreenDimensions();
