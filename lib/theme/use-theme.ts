import { useColorScheme } from 'react-native'
import { colors } from './tokens'

export function useAppTheme() {
  const scheme = useColorScheme()
  const isDark = scheme === 'dark'

  return {
    isDark,
    scheme: isDark ? 'dark' : 'light',
    colors: {
      background: isDark ? colors.black : colors.grey[50],
      surface: isDark ? colors.grey[900] : colors.white,
      mutedSurface: isDark ? colors.grey[800] : colors.grey[100],
      border: isDark ? colors.grey[800] : colors.grey[200],
      text: isDark ? colors.white : colors.black,
      textMuted: isDark ? colors.grey[400] : colors.grey[600],
      accent: isDark ? colors.accent[500] : colors.accent[600],
      accentSoft: isDark ? colors.accent[900] : colors.accent[100],
      subdued: isDark ? colors.grey[700] : colors.grey[300],
    },
  }
}
