import type { Preview } from '@storybook/react-vite';
import './tailwind.css';

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: [
          // 検討 (DDR の検討ページ) をいちばん上に。検討のプレビューを開く人は検討のページを見に来ていて、
          // 末尾に置くとスマホではサイドバーの下まで届かず押せなかった (#131)
          '検討',
          'Introduction',
          'Principles',
          ['Overview', 'Foundation', 'Color', 'Typography', 'Visual', 'Layout', 'Interaction', 'Patterns', '*'],
          'Tokens',
          [
            'Overview',
            'Animation',
            'Breakpoints',
            'Color', ['Primitive', 'Semantic', 'Regression'],
            'Focus Ring',
            'Layout',
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
