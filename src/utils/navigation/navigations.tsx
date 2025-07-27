// utils/navigationUtils.ts
import { CommonActions, NavigationContainerRef, StackActions } from '@react-navigation/native';
// Update the import path below if your types file is located elsewhere
import { RootStackParamList } from '../../types/navigation'; // Import type từ file riêng

let navigator: NavigationContainerRef<RootStackParamList> | null;

/**
 * Thiết lập Navigation Container Ref
 * Gọi hàm này trong ref của NavigationContainer
 */
export function setTopLevelNavigator(
  navigatorRef: NavigationContainerRef<RootStackParamList> | null
) {
  navigator = navigatorRef;
}

/**
 * Kiểm tra navigator đã sẵn sàng chưa
 * @throws Error nếu navigator chưa được khởi tạo
 */
function checkNavigator() {
  if (!navigator) {
    throw new Error(
      'Navigator is not ready! Please ensure:\n' +
      '1. You have called setTopLevelNavigator in NavigationContainer ref\n' +
      '2. You are not calling navigation from constructor or early useEffect'
    );
  }
}

/**
 * Điều hướng đến màn hình mới
 * @param routeName - Tên route đã định nghĩa trong RootStackParamList
 * @param params - Tham số truyền vào màn hình đích
 */
export function navigate<RouteName extends keyof RootStackParamList>(
  routeName: RouteName,
  params?: RootStackParamList[RouteName]
) {
  checkNavigator();
  navigator!.dispatch(
    CommonActions.navigate({
      name: routeName,
      params,
    })
  );
}

/**
 * Quay lại màn hình trước đó
 */
export function goBack() {
  checkNavigator();
  navigator!.dispatch(CommonActions.goBack());
}

/**
 * Thêm màn hình mới vào stack (luôn tạo mới dù đã có trong stack)
 * @param routeName - Tên route
 * @param params - Tham số truyền vào
 */
export function push<RouteName extends keyof RootStackParamList>(
  routeName: RouteName,
  params?: RootStackParamList[RouteName]
) {
  checkNavigator();
  navigator!.dispatch(
    StackActions.push(routeName, params)
  );
}

/**
 * Quay về màn hình đầu tiên trong stack
 */
export function popToTop() {
  checkNavigator();
  navigator!.dispatch(StackActions.popToTop());
}

/**
 * Thay thế màn hình hiện tại bằng màn hình mới
 * @param routeName - Tên route
 * @param params - Tham số truyền vào
 */
export function replace<RouteName extends keyof RootStackParamList>(
  routeName: RouteName,
  params?: RootStackParamList[RouteName]
) {
  checkNavigator();
  navigator!.dispatch(
    StackActions.replace(routeName, params)
  );
}

/**
 * Reset toàn bộ navigation stack
 * @param routeName - Tên route sẽ thành root mới
 * @param params - Tham số truyền vào
 */
export function reset<RouteName extends keyof RootStackParamList>(
  routeName: RouteName,
  params?: RootStackParamList[RouteName]
) {
  checkNavigator();
  navigator!.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: routeName, params }],
    })
  );
}

/**
 * Quay lại 'n' màn hình trong stack
 * @param count - Số màn hình muốn quay lại
 */
export function pop(count: number = 1) {
  checkNavigator();
  navigator!.dispatch(
    StackActions.pop(count)
  );
}

// Xuất tất cả các hàm
export default {
  setTopLevelNavigator,
  navigate,
  goBack,
  push,
  popToTop,
  replace,
  reset,
  pop,
};