import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within, fn } from 'storybook/test';
import { Link } from './Link';
import { Caption } from '@sb-blocks/Caption';

/**
 * Link stories — VR 集約モデル (§5-3)
 *
 * 3 節構成: Playground / Overview / EdgeCases。
 *
 * Docs (Guideline) は Link.guideline.mdx 側で `<Meta of={...} />` 経由で統合される。
 */
const meta: Meta<typeof Link> = {
  title: 'Primitives/Link',
  component: Link,
  argTypes: {
    color: { control: 'radio', options: ['primary', 'neutral', 'muted'] },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    underline: { control: 'radio', options: ['always', 'hover', 'none'] },
    external: { control: 'boolean' },
    disabled: { control: 'boolean' },
    href: { control: 'text' },
    children: { control: 'text' },
  },
  args: {
    href: '#',
    children: 'リンクテキスト',
    color: 'primary',
    size: 'md',
    underline: 'hover',
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────

export const Playground: Story = {
  args: { onClick: fn((e) => e.preventDefault()) },
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls から props を切り替えて挙動を確認する起点。click で onClick が呼ばれることを play test で保証。',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link');
    await userEvent.click(link);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

// ── 2. Overview (視覚回帰対象) ──────────────────────────────────
// props で作れる内在軸を集約: color / size / state / underline / external。
// Hover/Focus/Active は pseudo-states で強制表示。

export const Overview: Story = {
  parameters: {
    docs: {
      description: {
        story: '視覚回帰用の総覧。color (primary/neutral/muted) / size (sm/md/lg) / state (Default/Hover/Focus/Active/Disabled) / underline (always/hover/none) / external (外部アイコン) を 1 枚に集約。',
      },
    },
    pseudo: {
      hover: ['#link-hover'],
      focusVisible: ['#link-focus'],
      active: ['#link-active'],
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">color (primary / neutral / muted)</div>
        <div className="flex flex-wrap gap-6 items-center">
          <Link href="#" color="primary">Primary</Link>
          <Link href="#" color="neutral">Neutral</Link>
          <Link href="#" color="muted">Muted</Link>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">size (sm 14 / md 16 / lg 18)</div>
        <div className="flex flex-wrap gap-6 items-baseline">
          <Link href="#" size="sm">Small</Link>
          <Link href="#" size="md">Medium</Link>
          <Link href="#" size="lg">Large</Link>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">state (Default / Hover / Focus / Active / Disabled)</div>
        <div className="grid grid-cols-3 gap-4 items-start">
          <Caption text="Default"><Link href="#">Default</Link></Caption>
          <Caption text="Hover"><Link href="#" id="link-hover">Hover</Link></Caption>
          <Caption text="Focus-visible"><Link href="#" id="link-focus">Focus</Link></Caption>
          <Caption text="Active"><Link href="#" id="link-active">Active</Link></Caption>
          <Caption text="Disabled"><Link href="#" disabled>Disabled</Link></Caption>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">underline (always / hover / none)</div>
        <div className="flex flex-col gap-2 items-start">
          <Link href="#" underline="always">underline=always (常に下線)</Link>
          <Link href="#" underline="hover">underline=hover (ホバー時のみ)</Link>
          <Link href="#" underline="none">underline=none (下線なし)</Link>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">external (外部アイコン自動付与 + rel/target)</div>
        <Link href="https://example.com" external>外部リンク</Link>
      </div>
    </div>
  ),
};

// ── 3. EdgeCases (視覚回帰対象) ─────────────────────────────────
// props だけでは作れない文脈依存: 制約幅での折返し / 段落中インライン / external + 長文での外部アイコン位置。

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: '長文の折返し / 段落中インライン (text-decoration が周辺テキストと分離) / external + 長文 (外部アイコンが行末に正しく来るか) など、周辺テキスト・幅に依存する文脈ケース。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <Caption text="長文 — 折返し挙動">
        <Link href="#">ここに非常に長いリンクテキストが入って折返しがどう動くかを確認する</Link>
      </Caption>
      <Caption text="段落中インライン (text-decoration が周辺と分離)">
        <p className="text-base leading-relaxed">
          このサービスをご利用の際は、<Link href="#">利用規約</Link>および
          <Link href="#">プライバシーポリシー</Link>に同意したものとみなします。
        </p>
      </Caption>
      <Caption text="external + 長文 — 外部アイコンの位置">
        <Link href="https://example.com" external>非常に長い外部リンクテキスト ここに external プロパティ付きで折返し挙動を確認する</Link>
      </Caption>
    </div>
  ),
};
