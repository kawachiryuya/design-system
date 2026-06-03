import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { VisuallyHidden } from './VisuallyHidden';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Input } from '../Input';

const meta: Meta<typeof VisuallyHidden> = {
  title: 'Primitives/VisuallyHidden',
  component: VisuallyHidden,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '視覚的には非表示でスクリーンリーダにだけ読まれるテキストを描画する。'
          + ' DOM 上には存在するため検証ツールでも見える。'
          + ' Tailwind の `sr-only` ユーティリティを採用。',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof VisuallyHidden>;

export const Default: Story = {
  args: { children: 'スクリーンリーダ専用テキスト' },
  decorators: [
    (Story) => (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-onSurface-muted">
          下の <code>VisuallyHidden</code> はブラウザに見えないが、VoiceOver / NVDA 等では読み上げられる:
        </p>
        <Story />
        <p className="text-sm text-onSurface-muted">↑ ここに非表示テキスト</p>
      </div>
    ),
  ],
};

export const IconOnlyButton: Story = {
  name: '実践例: icon-only Button の補助ラベル',
  decorators: [
    () => (
      <div className="flex items-center gap-3">
        <Button variant="tertiary">
          <Icon name="favorite" />
          <VisuallyHidden>お気に入りに追加</VisuallyHidden>
        </Button>
        <span className="text-sm text-onSurface-muted">
          icon-only Button でアイコンは `aria-hidden`、補助テキストを VisuallyHidden に置く
        </span>
      </div>
    ),
  ],
};

export const FormLabel: Story = {
  name: '実践例: 視覚的にはプレースホルダで代替するフォームラベル',
  decorators: [
    () => (
      <form className="flex flex-col gap-2 w-80">
        <VisuallyHidden as="label" htmlFor="vh-search">
          サイト内検索キーワード
        </VisuallyHidden>
        <Input id="vh-search" type="search" placeholder="検索…" />
      </form>
    ),
  ],
};

export const LiveRegion: Story = {
  name: '実践例: 通知用 live region',
  decorators: [
    () => {
      const [message, setMessage] = React.useState('');
      return (
        <div className="flex flex-col gap-3">
          <Button onClick={() => setMessage(`保存しました (${new Date().toLocaleTimeString()})`)}>
            保存
          </Button>
          <p className="text-sm text-onSurface-muted">
            ボタンを押すと、視覚的には何も変わらないがスクリーンリーダがメッセージを読み上げる
          </p>
          <VisuallyHidden role="status" aria-live="polite">
            {message}
          </VisuallyHidden>
        </div>
      );
    },
  ],
};
