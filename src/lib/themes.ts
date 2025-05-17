export interface ColorSet {
  // Base AYANDA variables
  accentColorVal: string;
  accentColorHsl: string; // For shadcn HSL-based variables like ring, accent
  backgroundColorVal: string;
  widgetBackgroundVal: string;
  textColorVal: string;
  textMutedColorVal: string;
  borderColorVal: string;
  inputBgVal: string;
  dangerColorVal: string; // Typically consistent, but can be themed

  // Direct shadcn variable values derived from the palette
  // These will be set on :root by ThemeProvider
  // Their names match the CSS variables shadcn expects.
  '--background': string;
  '--foreground': string;
  '--card': string;
  '--card-foreground': string;
  '--popover': string;
  '--popover-foreground': string;
  '--primary': string;
  '--primary-foreground': string;
  '--secondary': string;
  '--secondary-foreground': string;
  '--muted': string;
  '--muted-foreground': string;
  '--accent': string; // Often a semi-transparent version of primary/accentColorVal
  '--accent-foreground': string;
  '--destructive': string;
  '--destructive-foreground': string;
  '--border': string;
  '--input': string; // Often same as border
  '--ring': string;  // Often derived from accentColorHsl
}

export interface Theme {
  key: string;
  displayName: string;
  previewColor: string; // A dominant color for the swatch
  light: ColorSet;
  dark: ColorSet;
}

// Helper to create HSL string for shadcn
const toHslString = (hue: number, saturation: number, lightness: number) => `${hue} ${saturation}% ${lightness}%`;

// Define base values for a theme and derive shadcn vars
function createThemeColors(
    isDark: boolean,
    accent: string, // hex
    accentHslParts: [number, number, number], // [hue, saturation, lightness]
    background: string,
    widgetBg: string,
    text: string,
    textMuted: string,
    border: string,
    inputBg: string,
    danger: string = '#FF4757', // Default danger
    primaryFgOverride?: string // Optional override for text on primary
): ColorSet {
    const accentHsl = toHslString(...accentHslParts);
    const primaryForeground = primaryFgOverride || (isDark ? background : '#FFFFFF'); // Contrast for primary

    return {
        accentColorVal: accent,
        accentColorHsl: accentHsl,
        backgroundColorVal: background,
        widgetBackgroundVal: widgetBg,
        textColorVal: text,
        textMutedColorVal: textMuted,
        borderColorVal: border,
        inputBgVal: inputBg,
        dangerColorVal: danger,

        '--background': background,
        '--foreground': text,
        '--card': widgetBg,
        '--card-foreground': text,
        '--popover': widgetBg,
        '--popover-foreground': text,
        '--primary': accent,
        '--primary-foreground': primaryForeground,
        '--secondary': inputBg, // Example mapping
        '--secondary-foreground': text,
        '--muted': inputBg, // Example mapping
        '--muted-foreground': textMuted,
        '--accent': `hsl(${accentHsl} / 0.1)`,
        '--accent-foreground': accent,
        '--destructive': danger,
        '--destructive-foreground': text, // Assuming danger text is primary text color
        '--border': border,
        '--input': border,
        '--ring': `hsl(${accentHsl} / 0.5)`,
    };
}

export const themes: Theme[] = [
  {
    key: 'default-cyan',
    displayName: 'Default Cyan',
    previewColor: '#00DCFF',
    light: createThemeColors(
        false,                      // isDark
        '#00A0B8',                  // accent (slightly darker for light mode primary)
        [188, 100, 36],             // accentHslParts for #00A0B8
        '#F0F4F8',                  // background
        '#FFFFFF',                  // widgetBg
        '#101820',                  // text
        '#505A6A',                  // textMuted
        '#DDE2E8',                  // border
        '#E8ECF1',                  // inputBg
        '#E53E3E',                   // danger
        '#FFFFFF'                    // primaryFg
    ),
    dark: createThemeColors(
        true,                       // isDark
        '#00DCFF',                  // accent
        [190, 100, 50],             // accentHslParts for #00DCFF
        '#0A0F14',                  // background
        '#101820',                  // widgetBg
        '#E0E7FF',                  // text
        '#707A8A',                  // textMuted
        'rgba(0, 220, 255, 0.08)',  // border
        'rgba(255, 255, 255, 0.03)',// inputBg
        '#FF4757',                   // danger
        '#0A0F14'                    // primaryFg
    ),
  },
  {
    key: 'sakura-pink',
    displayName: 'Sakura Pink',
    previewColor: '#FFB6C1',
    light: createThemeColors(
        false,
        '#F472B6',        // accent (Hot Pink)
        [330, 87, 70],    // accentHslParts for #F472B6
        '#FFF0F5',        // background (Lavender Blush)
        '#FFFFFF',        // widgetBg
        '#522236',        // text (Dark Pink/Purple)
        '#A47086',        // textMuted
        '#FFD9E1',        // border
        '#FFE5EA',        // inputBg
        '#E53E3E',
        '#FFFFFF'
    ),
    dark: createThemeColors(
        true,
        '#FFB6C1',        // accent (Light Pink)
        [351, 100, 85],   // accentHslParts for #FFB6C1
        '#1A1114',        // background (Very Dark Pink/Purple)
        '#2A1A20',        // widgetBg
        '#FFE0E5',        // text (Light Pinkish White)
        '#B88091',        // textMuted
        'rgba(255, 182, 193, 0.15)', // border
        'rgba(255, 182, 193, 0.05)', // inputBg
        '#FF6B81',        // danger (Softer Red for Pink Theme)
        '#1A1114'
    ),
  },
  {
    key: 'forest-green',
    displayName: 'Forest Green',
    previewColor: '#2F855A', // Dark Green
    light: createThemeColors(
        false,
        '#2F855A',        // accent (Dark Green)
        [147, 46, 35],    // accentHslParts for #2F855A
        '#F0FFF4',        // background (Honeydew)
        '#FFFFFF',        // widgetBg
        '#1A4731',        // text (Very Dark Green)
        '#5A806B',        // textMuted
        '#C6F6D5',        // border (Light Green)
        '#E6FFFA',        // inputBg
        '#E53E3E',
        '#FFFFFF'
    ),
    dark: createThemeColors(
        true,
        '#68D391',        // accent (Lighter Green)
        [145, 50, 61],    // accentHslParts for #68D391
        '#0E1A14',        // background (Very Dark Green)
        '#14251C',        // widgetBg
        '#D8FEE6',        // text (Pale Green)
        '#609077',        // textMuted
        'rgba(104, 211, 145, 0.15)', // border
        'rgba(104, 211, 145, 0.05)', // inputBg
        '#FF7878',        // danger
        '#0E1A14'
    ),
  },
  {
    key: 'solar-yellow',
    displayName: 'Solar Yellow',
    previewColor: '#F6E05E', // Saffron
    light: createThemeColors(
        false,
        '#D69E2E',        // accent (Darker Gold/Mustard)
        [39, 68, 51],     // accentHslParts for #D69E2E
        '#FFFFF0',        // background (Ivory)
        '#FFFFFF',        // widgetBg
        '#42340C',        // text (Dark Brown)
        '#8C6D22',        // textMuted
        '#FEFCBF',        // border (Pale Yellow)
        '#FFFDE7',        // inputBg
        '#E53E3E',
        '#42340C'         // Dark text on yellow
    ),
    dark: createThemeColors(
        true,
        '#F6E05E',        // accent (Saffron)
        [50, 90, 67],     // accentHslParts for #F6E05E
        '#1A160A',        // background (Very Dark Brown/Yellow)
        '#2A220F',        // widgetBg
        '#FFFACD',        // text (Lemon Chiffon)
        '#C0A549',        // textMuted
        'rgba(246, 224, 94, 0.15)', // border
        'rgba(246, 224, 94, 0.05)', // inputBg
        '#FF8C8C',        // danger
        '#1A160A'
    ),
  },
];

export const defaultThemeKey = 'default-cyan';
