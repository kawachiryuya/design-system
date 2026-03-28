import type { Preview } from '@storybook/react-vite';
import './tailwind.css';

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: ['Introduction', 'Tokens', 'Primitives', 'Composites', 'Patterns', '*'],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
    backgrounds: {
      options: {
        light: { name: 'light', value: '#FAFAFA' },
        white: { name: 'white', value: '#FFFFFF' },
        dark: { name: 'dark', value: '#262626' }
      }
    },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
        ],
      },
    },
  },

  initialGlobals: {
    backgrounds: {
      value: 'light'
    }
  }
};

export default preview;
