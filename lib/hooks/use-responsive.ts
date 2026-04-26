import { Platform, useWindowDimensions } from 'react-native'

const MOBILE_BREAKPOINT = 768
const DESKTOP_BREAKPOINT = 1024
const WEB_SSR_FALLBACK_WIDTH = DESKTOP_BREAKPOINT
const NATIVE_FALLBACK_WIDTH = 390

export function useResponsive() {
  const { width } = useWindowDimensions()
  const isWeb = Platform.OS === 'web'
  const browserWidth = isWeb && typeof globalThis === 'object' && 'window' in globalThis
    ? globalThis.window?.innerWidth
    : undefined
  const safeWidth = browserWidth || width || (isWeb ? WEB_SSR_FALLBACK_WIDTH : NATIVE_FALLBACK_WIDTH)
  const isDesktop = isWeb && safeWidth >= DESKTOP_BREAKPOINT
  const isTablet = isWeb && safeWidth >= MOBILE_BREAKPOINT && safeWidth < DESKTOP_BREAKPOINT
  const isMobile = !isWeb || safeWidth < MOBILE_BREAKPOINT
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
