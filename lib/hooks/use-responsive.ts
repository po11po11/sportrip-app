import { Platform, useWindowDimensions } from 'react-native'

export function useResponsive() {
  const { width } = useWindowDimensions()
  const safeWidth = width || 390
  const isWeb = Platform.OS === 'web'
  const isDesktop = isWeb && safeWidth >= 1024
  const isTablet = isWeb && safeWidth >= 768 && safeWidth < 1024
  const isMobile = !isWeb || safeWidth < 768
  const showWebShell = isDesktop || isTablet

  return {
    width: safeWidth,
    isWeb,
    isDesktop,
    isTablet,
    isMobile,
    showWebShell,
  }
}
