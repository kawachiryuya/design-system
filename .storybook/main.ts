import type { StorybookConfig } from '@storybook/react-vite';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  stories: [
    '../components/**/*.mdx',
    '../components/**/*.stories.@(ts|tsx)',
  ],
  addons: [
    '@storybook/addon-a11y',
    {
      name: '@storybook/addon-docs',
      // MDX 3 + addon-docs はデフォルトで GFM が無効のため remark-gfm を渡す。
      // これで MDX 内の Markdown テーブル / 取消線 / タスクリスト / 自動リンクが効く。
      // rehype-slug で見出しに自動 id 付与 (Guideline ページの TOC anchor 用)。
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug],
          },
        },
      },
    },
    '@storybook/addon-mcp',
    // States story で Hover/Focus/Active を強制表示するため (個別 story の
    // parameters.pseudo で hover/focus/active を指定する)
    'storybook-addon-pseudo-states',
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  // alias `@sb-blocks/*` を Vite の resolve.alias で解決。
  // tsconfig.json の paths は TypeScript の型解決用に維持 (二重定義)。
  // - MDX / TSX 共通で `@sb-blocks/DoDontExample` 等が使える
  // - `vite-tsconfig-paths` は Storybook 環境で resolver タイミング問題があるため直接定義する
  viteFinal: async (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      '@sb-blocks': path.resolve(__dirname, 'blocks'),
    };
    return config;
  },

  // TypeScript 型 + JSDoc から Props 表の Description を抽出するには
  // react-docgen-typescript が必要 (デフォルトの react-docgen は JSDoc を拾わない)。
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      // node_modules 由来の props (React 標準など) を除外して表をシンプルに保つ
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
};

export default config;
