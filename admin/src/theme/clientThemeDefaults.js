/**
 * Admin-only copy of client theme defaults.
 *
 * Keep in sync with `src/theme/clientThemeDefaults.js` (client app).
 * We duplicate here to avoid cross-package imports breaking Vercel builds.
 */

export const CLIENT_THEME_MODE = {
  DARK: 'dark',
  LIGHT: 'light',
};

export const DEFAULT_CLIENT_THEME_MODE = CLIENT_THEME_MODE.DARK;

export const CLIENT_BRAND_ACCENTS_BY_MODE = {
  [CLIENT_THEME_MODE.DARK]: {
    primary: '#E8C547',
    secondary: '#F5D78E',
    tertiary: '#38BDF8',
  },
  [CLIENT_THEME_MODE.LIGHT]: {
    primary: '#0A3D62',
    secondary: '#B8860B',
    tertiary: '#2563EB',
  },
};

export const CANONICAL_GLOBAL_THEME_COLORS = {
  primary: '#1A365D',
  secondary: '#C9A227',
  accent: '#2563EB',
  textPrimary: '#172554',
  textSecondary: '#5C6370',
  background: '#EDEAE4',
};

