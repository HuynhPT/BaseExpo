import { Dimensions, PixelRatio } from 'react-native';

// Kích thước màn hình chuẩn (dựa trên iPhone 14, width 390px)
const REFERENCE_WIDTH = 390;
const REFERENCE_HEIGHT = 844;

// Lấy kích thước màn hình hiện tại
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Hàm scale kích thước theo chiều rộng
const scaleWidth = (size: number): number => {
  return PixelRatio.roundToNearestPixel((SCREEN_WIDTH / REFERENCE_WIDTH) * size);
};

// Hàm scale kích thước theo chiều cao
const scaleHeight = (size: number): number => {
  return PixelRatio.roundToNearestPixel((SCREEN_HEIGHT / REFERENCE_HEIGHT) * size);
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

// Kích thước màn hình động
export const SCREEN = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
};

// Hàm cập nhật kích thước màn hình
export const updateScreenDimensions = (): void => {
  SCREEN.width = Dimensions.get('window').width;
  SCREEN.height = Dimensions.get('window').height;
  // Cập nhật lại SIZE khi màn hình thay đổi
  Object.assign(SIZE, generateSizes());
};

// Theo dõi thay đổi kích thước màn hình
Dimensions.addEventListener('change', () => {
  updateScreenDimensions();
});

// Khởi tạo giá trị ban đầu
updateScreenDimensions();