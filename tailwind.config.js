/** @type {import('tailwindcss').Config} */

const spacing = require('./tokens/spacing.json');
const colors = require('./tokens/colors.json');
const typography = require('./tokens/typography.json');
const shadows = require('./tokens/shadows.json');
const radius = require('./tokens/radius.json');
const breakpoints = require('./tokens/breakpoints.json');
const animation = require('./tokens/animation.json');

module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}',
    './components/**/*.{html,js,jsx,ts,tsx,mdx}',
    './.storybook/**/*.{js,ts,tsx}',
  ],
  theme: {
    // Spacing (8px base scale)
    spacing: spacing.spacing,
    
    // Colors (Primary, Neutral, Semantic)
    colors: {
      primary: colors.primary,
      neutral: colors.neutral,
      success: colors.success,
      error: colors.error,
      warning: colors.warning,
      info: colors.info,
      white: colors.base.white,
      black: colors.base.black,
      transparent: colors.base.transparent,
    },
    
    // Typography
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,
    lineHeight: typography.lineHeight,
    letterSpacing: typography.letterSpacing,
    fontFamily: typography.fontFamily,
    
    // Shadows
    boxShadow: shadows.shadow,
    
    // Border Radius
    borderRadius: radius.radius,
    
    // Breakpoints
    screens: breakpoints.screens,
    
    // Animation
    transitionDuration: animation.duration,
    transitionTimingFunction: animation.easing,
    
    extend: {
      // Semantic spacing aliases
      spacing: spacing.semantic,
    },
  },
  plugins: [],
}
