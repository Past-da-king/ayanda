export interface ColorSet {
  // Base AIDA variables (source of truth)
  accentColorVal: string;
  accentColorHsl: string; 
  primaryForegroundVal: string; // Text color for on primary/accent backgrounds
  backgroundColorVal: string;
  widgetBackgroundVal: string; // For cards, popovers, distinct element backgrounds
  textColorVal: string;
  textMutedColorVal: string;
  borderColorVal: string;
  inputBgVal: string;
  dangerColorVal: string;

  // Pre-resolved shadcn variable values for direct setting by ThemeProvider
  // This avoids relying on CSS alias interpretation if there are issues.
  // These will be set directly on :root by JS.
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
  '--accent': string; 
  '--accent-foreground': string;
  '--destructive': string;
  '--destructive-foreground': string;
  '--border': string;
  '--input': string; 
  '--ring': string;  
}

export interface Theme {
  key: string;
  displayName: string;
  previewColor: string; 
  light: ColorSet;
  dark: ColorSet;
}

const toHslString = (hue: number, saturation: number, lightness: number) => `${hue} ${saturation}% ${lightness}%`;

function createThemeColors(
    isDark: boolean,
    // AIDA source values
    accentHex: string, 
    accentHslParts: [number, number, number], 
    primaryFgHex: string, // Explicit foreground for primary
    backgroundHex: string,
    widgetBgHex: string, // This is for cards, popovers etc.
    textHex: string,
    textMutedHex: string,
    borderHex: string,
    inputBgHex: string,
    dangerHex: string = '#FF4757'
): ColorSet {
    const accentHslStr = toHslString(...accentHslParts);

    return {
        // AIDA source variables
        accentColorVal: accentHex,
        accentColorHsl: accentHslStr,
        primaryForegroundVal: primaryFgHex,
        backgroundColorVal: backgroundHex,
        widgetBackgroundVal: widgetBgHex, // This is the important one for popovers/cards
        textColorVal: textHex,
        textMutedColorVal: textMutedHex,
        borderColorVal: borderHex,
        inputBgVal: inputBgHex,
        dangerColorVal: dangerHex,

        // Directly resolved shadcn variables
        '--background': backgroundHex,
        '--foreground': textHex,
        '--card': widgetBgHex, // Card uses widgetBgHex
        '--card-foreground': textHex,
        '--popover': widgetBgHex, // Popover uses widgetBgHex
        '--popover-foreground': textHex,
        '--primary': accentHex,
        '--primary-foreground': primaryFgHex,
        '--secondary': inputBgHex, 
        '--secondary-foreground': textHex,
        '--muted': inputBgHex, 
        '--muted-foreground': textMutedHex,
        '--accent': `hsl(${accentHslStr} / 0.1)`,
        '--accent-foreground': accentHex,
        '--destructive': dangerHex,
        '--destructive-foreground': textHex, 
        '--border': borderHex,
        '--input': borderHex, 
        '--ring': `hsl(${accentHslStr} / 0.5)`,
    };
}

export const themes: Theme[] = [
  {
    key: 'default-cyan',
    displayName: 'Default Cyan',
    previewColor: '#00DCFF',
    light: createThemeColors(
        false,    // isDark
        '#00A0B8',// accentHex (Primary buttons)
        [188, 100, 36], // accentHslParts
        '#FFFFFF',// primaryFgHex (Text on primary buttons)
        '#F0F4F8',// backgroundHex (Page background)
        '#FFFFFF',// widgetBgHex (Cards, Popovers background)
        '#101820',// textHex
        '#505A6A',// textMutedHex
        '#DDE2E8',// borderHex
        '#E8ECF1',// inputBgHex
        '#E53E3E' // dangerHex
    ),
    dark: createThemeColors(
        true,     // isDark
        '#00DCFF',// accentHex
        [190, 100, 50], // accentHslParts
        '#0A0F14',// primaryFgHex
        '#0A0F14',// backgroundHex
        '#101820',// widgetBgHex
        '#E0E7FF',// textHex
        '#707A8A',// textMutedHex
        'rgba(0, 220, 255, 0.15)',// borderHex (increased opacity slightly)
        'rgba(255, 255, 255, 0.03)',// inputBgHex
        '#FF4757' // dangerHex
    ),
  },
  {
    key: 'sakura-pink',
    displayName: 'Sakura Pink',
    previewColor: '#FFB6C1',
    light: createThemeColors(
        false, '#F472B6', [330, 87, 70], '#FFFFFF',
        '#FFF0F5', '#FFFFFF', '#522236', '#A47086',
        '#FFD9E1', '#FFE5EA', '#E53E3E'
    ),
    dark: createThemeColors(
        true, '#FFB6C1', [351, 100, 85], '#1A1114',
        '#1A1114', '#2A1A20', '#FFE0E5', '#B88091',
        'rgba(255, 182, 193, 0.2)', '#rgba(255, 182, 193, 0.07)', '#FF6B81'
    ),
  },
  {
    key: 'forest-green',
    displayName: 'Forest Green',
    previewColor: '#2F855A', 
    light: createThemeColors(
        false, '#2F855A', [147, 46, 35], '#FFFFFF',
        '#F0FFF4', '#FFFFFF', '#1A4731', '#5A806B',
        '#C6F6D5', '#E6FFFA', '#E53E3E'
    ),
    dark: createThemeColors(
        true, '#68D391', [145, 50, 61], '#0E1A14',
        '#0E1A14', '#14251C', '#D8FEE6', '#609077',
        'rgba(104, 211, 145, 0.2)', 'rgba(104, 211, 145, 0.07)', '#FF7878'
    ),
  },
  {
    key: 'solar-yellow',
    displayName: 'Solar Yellow',
    previewColor: '#F6E05E', 
    light: createThemeColors( // Solar Yellow Light with distinct widget/popover background
        false,    // isDark
        '#D69E2E',// accentHex (Darker Gold for buttons)
        [39, 68, 51], // accentHslParts
        '#3D2B00',// primaryFgHex (Dark text on accent buttons)
        '#FFFBEB',// backgroundHex (Page background - Cornsilk)
        '#FFFFFF',// widgetBgHex (Popover/Card background - White)
        '#3D2B00',// textHex (Main text - Dark Brown)
        '#785A0C',// textMutedHex
        '#FDE68A',// borderHex (Softer gold border, was FCE9A0)
        '#FEF3C7',// inputBgHex (Light yellow, was FFF5D1)
        '#E53E3E' // dangerHex
    ),
    dark: createThemeColors(
        true, '#F6E05E', [50, 90, 67], '#1A160A',
        '#1A160A', '#2A220F', '#FFFACD', '#C0A549',
        'rgba(246, 224, 94, 0.2)', 'rgba(246, 224, 94, 0.07)', '#FF8C8C'
    ),
  },
];

export const defaultThemeKey = 'default-cyan';
