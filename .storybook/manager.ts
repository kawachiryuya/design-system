import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

const theme = create({
  base: 'light',

  // Brand
  brandTitle: 'Design System',
  brandUrl: 'https://design-system-storybook-murex.vercel.app',
  brandTarget: '_self',

  // Colors — primary 600 (#4F46E5 indigo)
  colorPrimary: '#4F46E5',
  colorSecondary: '#4F46E5',

  // UI
  appBg: '#FAFAFA',
  appContentBg: '#FFFFFF',
  appPreviewBg: '#FAFAFA',
  appBorderColor: '#E5E5E5',
  appBorderRadius: 8,

  // Text
  textColor: '#171717',
  textInverseColor: '#FFFFFF',
  textMutedColor: '#737373',

  // Toolbar
  barTextColor: '#525252',
  barHoverColor: '#4F46E5',
  barSelectedColor: '#4F46E5',
  barBg: '#FFFFFF',

  // Form
  inputBg: '#FFFFFF',
  inputBorder: '#D4D4D4',
  inputTextColor: '#171717',
  inputBorderRadius: 6,

  // Typography
  fontBase: 'ui-sans-serif, system-ui, sans-serif',
  fontCode: 'ui-monospace, SFMono-Regular, monospace',
});

addons.setConfig({
  theme,
});
