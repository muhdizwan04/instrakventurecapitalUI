/**
 * Canonical client theme defaults (source of truth for fallbacks).
 * Admin can override via global_settings.themeColors; empty/missing fields fall back here.
 * "Restore default brand colours" in admin resets to CANONICAL_GLOBAL_THEME_COLORS.
 */

export const CLIENT_THEME_MODE = {
    DARK: 'dark',
    LIGHT: 'light',
};

/** Default when no visitor preference and when theme_settings.defaultTheme is unset */
export const DEFAULT_CLIENT_THEME_MODE = CLIENT_THEME_MODE.DARK;

/**
 * Per-mode accent fallbacks (used when admin leaves colours blank or for first paint).
 * Night: gold-forward accents on deep backgrounds.
 * Day: deeper gold + navy for contrast on warm light surfaces.
 */
export const CLIENT_BRAND_ACCENTS_BY_MODE = {
    [CLIENT_THEME_MODE.DARK]: {
        primary: '#E8C547',
        secondary: '#F5D78E',
        tertiary: '#38BDF8',
    },
    // Light mode accents: navy-forward for contrast on light surfaces
    [CLIENT_THEME_MODE.LIGHT]: {
        primary: '#0A3D62',
        secondary: '#B8860B',
        tertiary: '#2563EB',
    },
};

/**
 * Default row for Global Settings → Theme colours (admin form + restore button).
 * Tuned for both modes: navy primary, gold secondary, blue accent.
 */
export const CANONICAL_GLOBAL_THEME_COLORS = {
    primary: '#1A365D',
    secondary: '#C9A227',
    accent: '#2563EB',
    textPrimary: '#172554',
    textSecondary: '#5C6370',
    background: '#EDEAE4',
};

/**
 * @param {'dark'|'light'} mode
 * @param {object} [themeColors] global_settings.themeColors
 */
export function resolveClientAccentCssVars(mode, themeColors = {}) {
    const base = CLIENT_BRAND_ACCENTS_BY_MODE[mode] || CLIENT_BRAND_ACCENTS_BY_MODE[CLIENT_THEME_MODE.DARK];
    const c = themeColors || {};
    const primary = (c.primary && String(c.primary).trim()) || base.primary;
    const secondary = (c.secondary && String(c.secondary).trim()) || base.secondary;
    const tertiary = (c.accent && String(c.accent).trim()) || base.tertiary;
    return { primary, secondary, tertiary };
}

/** Normalize #RGB / #RRGGBB to #RRGGBB uppercase, or '' if not a hex color */
export function normalizeHexColor(color) {
    if (!color || typeof color !== 'string') return '';
    const s = color.trim();
    if (!s.startsWith('#')) return '';
    let h = s.slice(1);
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    if (h.length === 6) return `#${h.toUpperCase()}`;
    return '';
}

/** Relative luminance 0–1 */
export function hexLuminance(color) {
    const hex = normalizeHexColor(color);
    if (!hex) return 0.5;
    const h = hex.slice(1);
    const r = parseInt(h.slice(0, 2), 16) / 255;
    const g = parseInt(h.slice(2, 4), 16) / 255;
    const b = parseInt(h.slice(4, 6), 16) / 255;
    return 0.299 * r + 0.587 * g + 0.114 * b;
}

export function isDarkHexColor(color) {
    return hexLuminance(color) < 0.42;
}

/** True for whites/light greys meant for dark UI (bad on white navbar/footer) */
export function isLightHexColor(color) {
    return hexLuminance(color) > 0.72;
}

/** CMS may use hex, rgb(), or named colours — true if the colour reads as light on dark backgrounds */
export function isLikelyLightTextColor(color) {
    if (!color || typeof color !== 'string') return false;
    const s = color.trim().toLowerCase();
    if (s === 'white' || s === '#fff' || s === '#ffffff') return true;
    if (s.startsWith('rgb')) {
        const m = s.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
        if (!m) return false;
        const r = parseFloat(m[1]);
        const g = parseFloat(m[2]);
        const b = parseFloat(m[3]);
        if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return false;
        const lum = (0.299 * r + 0.587 * g + 0.114 * b) / (s.startsWith('rgba') ? 255 : 255);
        return lum > 0.72;
    }
    return isLightHexColor(color);
}

/**
 * Detect dark hero/page backgrounds passed as React inline style (solid or common gradients).
 * Used only to swap surfaces in client light mode.
 */
export function isDarkInlineBackground(style) {
    if (!style || typeof style !== 'object') return false;
    if (style.backgroundColor && isDarkHexColor(style.backgroundColor)) return true;
    const bg = style.background;
    if (typeof bg !== 'string') return false;
    if (/linear-gradient|radial-gradient/i.test(bg)) {
        return /#0[0-3][0-9a-f]{4}|#1a365d|#0f2942|#020617|#0b1120|#0a2540|#000000|#111827|#1e293b|#0a1628/i.test(bg);
    }
    return isDarkHexColor(bg);
}

/** Legacy CMS form headings (any casing) → current copy */
export function normalizeLegacyFormSectionTitle(title) {
    if (title == null || typeof title !== 'string') return title;
    const key = title.trim().replace(/\s+/g, ' ').toLowerCase();
    if (key === 'submit your inquiry') return 'Submit profile';
    if (key === 'investment inquiry') return 'Investment Profile';
    return title;
}
