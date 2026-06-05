import type { Preview } from '@storybook/react-vite';
import './tailwind.css';

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: [
          'Introduction',
          'Principles',
          ['Overview', 'Master Plan', 'Foundation', 'Color', 'Typography', 'Layout', 'Interaction', 'Patterns', 'Platform', '*'],
          'Tokens',
          [
            'Overview',
            'Animation',
            'Breakpoints',
            'Color', ['Primitive', 'Semantic'],
            'Focus Ring',
            'Opacity',
            'Radius',
            'Shadows',
            'Spacing',
            'Typography', ['Primitive', 'Semantic'],
            'Z-Index',
          ],
          'Primitives',
          ['Overview', '*'],
          'Composites',
          ['Overview', '*'],
          'Patterns',
          '*',
        ],
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
