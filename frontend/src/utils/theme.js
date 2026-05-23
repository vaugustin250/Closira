// Closira Design System — Material Design 3 / Google Studio Inspired Theme

export const Colors = {
  // Brand — Vibrant Indigo primary (Material You)
  primary: '#5C6BC0',
  primaryLight: '#E8EAF6',
  primaryDark: '#3949AB',
  primaryGradientStart: '#667eea',
  primaryGradientEnd: '#764ba2',

  // Secondary accent
  secondary: '#26C6DA',
  secondaryLight: '#E0F7FA',
  secondaryDark: '#00ACC1',

  // Backgrounds — Material 3 surface tones
  background: '#F3F4FB',
  surface: '#FFFFFF',
  surfaceElevated: '#ECEDF8',
  surfaceVariant: '#F0F1FA',
  heroGradientStart: '#4A55C8',
  heroGradientEnd: '#7C4DFF',

  // Text — Rich contrast
  textPrimary: '#1A1C2E',
  textSecondary: '#5C6070',
  textMuted: '#9EA3B0',
  textInverse: '#FFFFFF',
  textOnPrimary: '#FFFFFF',

  // Status — Material You tonal colors
  statusNew: '#1976D2',
  statusNewBg: '#E3F2FD',
  statusNewGrad: '#42A5F5',
  statusQualified: '#2E7D32',
  statusQualifiedBg: '#E8F5E9',
  statusEscalated: '#C62828',
  statusEscalatedBg: '#FFEBEE',
  statusFollowUp: '#E65100',
  statusFollowUpBg: '#FBE9E7',
  statusOpen: '#2E7D32',
  statusOpenBg: '#E8F5E9',

  // Stat card gradients
  gradLeads: ['#667eea', '#764ba2'],
  gradMissed: ['#f093fb', '#f5576c'],
  gradEscalation: ['#ff5f6d', '#ffc371'],
  gradFollowUp: ['#f7971e', '#ffd200'],
  gradResolved: ['#11998e', '#38ef7d'],

  // Channel — vivid
  channelWhatsApp: '#00897B',
  channelWhatsAppBg: '#E0F2F1',
  channelEmail: '#1565C0',
  channelEmailBg: '#E3F2FD',
  channelCall: '#E65100',
  channelCallBg: '#FBE9E7',

  // Urgency
  urgencyHigh: '#B71C1C',
  urgencyHighBg: '#FFCDD2',
  urgencyMedium: '#E65100',
  urgencyMediumBg: '#FFE0B2',

  // UI chrome
  border: '#E0E3F0',
  borderLight: '#ECEDF8',
  divider: '#ECEDF8',
  shadow: 'rgba(92, 107, 192, 0.15)',
  shadowDark: 'rgba(26, 28, 46, 0.12)',

  // Semantic
  success: '#2E7D32',
  warning: '#E65100',
  error: '#C62828',
  info: '#1565C0',

  // Overlay
  overlay: 'rgba(26, 28, 46, 0.5)',
};

export const Typography = {
  // Google Inter / Material 3 type scale
  fontSizeXS: 11,
  fontSizeSM: 13,
  fontSizeMD: 15,
  fontSizeLG: 17,
  fontSizeXL: 20,
  fontSize2XL: 24,
  fontSize3XL: 32,
  fontSize4XL: 40,

  fontWeightRegular: '400',
  fontWeightMedium: '500',
  fontWeightSemiBold: '600',
  fontWeightBold: '700',
  fontWeightExtraBold: '800',

  // Google Inter font family
  fontFamily: 'Inter_400Regular',
  fontFamilyMedium: 'Inter_500Medium',
  fontFamilySemiBold: 'Inter_600SemiBold',
  fontFamilyBold: 'Inter_700Bold',

  lineHeightTight: 1.2,
  lineHeightNormal: 1.5,
  lineHeightRelaxed: 1.75,

  letterSpacingTight: -0.5,
  letterSpacingNormal: 0,
  letterSpacingWide: 0.5,
  letterSpacingWidest: 1.2,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
};

export const Shadow = {
  sm: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  md: {
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 6,
  },
  lg: {
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 10,
  },
  colored: (color) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  }),
};

export const Gradients = {
  primary: ['#667eea', '#764ba2'],
  hero: ['#4A55C8', '#7C4DFF'],
  leads: ['#667eea', '#764ba2'],
  missed: ['#f093fb', '#f5576c'],
  escalation: ['#ff5f6d', '#ffc371'],
  followUp: ['#f7971e', '#ffd200'],
  resolved: ['#11998e', '#38ef7d'],
  success: ['#56ab2f', '#a8e063'],
  info: ['#2193b0', '#6dd5ed'],
  warmCard: ['#ffecd2', '#fcb69f'],
};
