// contexts/NavigationContext.tsx
import React, { createContext, useContext, useRef } from 'react';
import { NavigationContainerRef } from '@react-navigation/native';
// import { RootStackParamList } from '../types/navigation';
// TODO: Replace the below with the correct type definition or correct import path
type RootStackParamList = any;

const NavigationContext = createContext<{
  navigatorRef: React.RefObject<NavigationContainerRef<RootStackParamList> | null>;
} | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const navigatorRef = useRef<NavigationContainerRef<RootStackParamList> | null>(null);

  return (
    <NavigationContext.Provider value={{ navigatorRef }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation phải được dùng trong NavigationProvider');
  }
  return context.navigatorRef.current!;
}