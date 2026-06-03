import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';
import { Icon } from '../Icon';

const meta: Meta<typeof Input> = {
  title: 'Primitives/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date'],
      description: 'HTML input type。`email` / `tel` / `number` 等はモバイルキーボード切替やネイティブバリデーションに効く。',
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large'],
      description: '44x44px のタッチターゲット (WCAG 2.5.5) を満たすのは medium / large。',
    },
    error: { control: 'boolean', description: 'true で枠線エラー色 + aria-invalid。errorMessage と組で指定する。' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean', description: 'ラベルに * を付与し aria-required を立てる。' },
    fullWidth: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helpText: { control: 'text', description: 'フィールド直下の補助説明。error 時は errorMessage に差し替わる。' },
    errorMessage: { control: 'text' },
  },
  args: {
    label: 'メールアドレス',
    placeholder: 'example@email.com',
    type: 'email',
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

/**
 * 既定の Input。Controls から `type` / `size` / `error` / `disabled` / `required` / `fullWidth` を切り替えて挙動を確認できる。
 */
export const Default: Story = {};

/**
 * 使い方の手本: エラー状態。`error` と `errorMessage` は型レベルでセット (discriminated union)。
 * `aria-invalid` / `aria-describedby` が自動付与され、SR がエラーを読み上げる。
 */
export const ErrorState: Story = {
  args: {
    label: 'パスワード',
    type: 'password',
    error: true,
    errorMessage: '8 文字以上、英数字を組み合わせてください',
  },
};

/**
 * 使い方の手本: leading / trailing アイコン。`React.ReactNode` のため Controls からは設定できない。
 */
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-72">
      <Input label="検索" type="search" placeholder="キーワード" leadingIcon={<Icon name="search" />} />
      <Input label="メール" type="email" placeholder="example@email.com" trailingIcon={<Icon name="info" />} />
    </div>
  ),
};

/**
 * 使い方の手本: フォーム全体での組合せ。ラベル / 必須印 / エラーメッセージ / `fullWidth` レイアウトを確認できる。
 */
export const LoginForm: Story = {
  name: '実践例: ログインフォーム',
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input label="メールアドレス" type="email" required placeholder="example@email.com" fullWidth />
      <Input
        label="パスワード"
        type="password"
        required
        fullWidth
        error
        errorMessage="パスワードが正しくありません"
      />
    </div>
  ),
};
