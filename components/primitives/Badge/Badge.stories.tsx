import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Badge } from './Badge';
import { Caption } from '@sb-blocks/Caption';

/**
 * Badge stories — 標準ストーリー構造に準拠
 *
 * 順序: Playground → Variants → Sizes → EdgeCases
 * (States は Badge が非 interactive な `<span>` で hover/focus/active 等の状態を
 *  持たないため省略 — Skeleton / Spinner / Divider と同じ扱い。
 *  WithIcon は icon prop が無いため省略。dot は EdgeCases で扱う)
 *
 * Docs (Guideline) は Badge.guideline.mdx 側で `<Meta of={...} />` 経由で統合される。
 */
const meta: Meta<typeof Badge> = {
  title: 'Primitives/Badge',
  component: Badge,
  argTypes: {
    variant: {
      control: 'select',
      options: ['neutral', 'primary', 'success', 'error', 'warning', 'info'],
    },
    appearance: { control: 'radio', options: ['solid', 'soft', 'outline'] },
    size: { control: 'radio', options: ['small', 'medium'] },
    dot: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    children: 'ラベル',
    variant: 'neutral',
    appearance: 'soft',
    size: 'medium',
    dot: false,
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

// ── 1. Playground ──────────────────────────────────────────────
// args を全開放、Controls から props を探索する起点。
// `<span>` がレンダリングされ children テキストが反映されることを play test で保証。

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Controls から variant / appearance / size / dot を切り替えて見え方を確認する起点。Badge は非 interactive な `<span>` で、ARIA role は付かない (テキストそのものが意味を伝える前提)。',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const badge = canvas.getByText(args.children as string);
    await expect(badge.tagName).toBe('SPAN');
  },
};

// ── 2. Variants ────────────────────────────────────────────────
// 6 つの semantic color × 3 つの appearance を静的にマトリックスで並べる。
// 「どの context でどの組合せを選ぶか」の判断材料を一覧で見せる。

const VARIANTS = ['neutral', 'primary', 'success', 'error', 'warning', 'info'] as const;
const APPEARANCES = ['solid', 'soft', 'outline'] as const;

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: '6 つの variant (色の意味) を 3 つの appearance (強度) で組み合わせたマトリックス。solid は強調・カウント、soft はリスト内ステータス、outline は控えめなカテゴリラベル。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <Caption text="variant (color semantics) — default appearance = soft">
        <div className="flex flex-wrap gap-2">
          {VARIANTS.map((variant) => (
            <Badge key={variant} variant={variant}>{variant}</Badge>
          ))}
        </div>
      </Caption>

      <Caption text="appearance × variant マトリックス">
        <div className="flex flex-col gap-3">
          {APPEARANCES.map((appearance) => (
            <div key={appearance} className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-onSurface-muted w-14 shrink-0">{appearance}</span>
              {VARIANTS.map((variant) => (
                <Badge key={variant} variant={variant} appearance={appearance}>
                  {variant}
                </Badge>
              ))}
            </div>
          ))}
        </div>
      </Caption>
    </div>
  ),
};

// ── 3. Sizes ───────────────────────────────────────────────────

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'small (px-2 py-[2px]) / medium (px-[10px] py-1) の見比べ。small は高密度 UI / テーブル / 数値カウント、medium は標準的なステータス表示。',
      },
    },
  },
  render: () => (
    <div className="flex gap-4 items-center">
      <Caption text="small">
        <Badge size="small" variant="success">Small</Badge>
      </Caption>
      <Caption text="medium (default)">
        <Badge size="medium" variant="success">Medium</Badge>
      </Caption>
    </div>
  ),
};

// ── 4. EdgeCases ───────────────────────────────────────────────
// dot 付き / 長文 / 数値カウント / 実践例ステータスリスト など、
// 実際の組み合わせで起こる視覚バランスや崩れ方の確認用。

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: 'dot 付き (リアルタイム性) / 長文ラベル (whitespace-nowrap で 1 行固定) / 数値カウント / リスト内ステータス表示など、組合せで発生する視覚パターン。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <Caption text="dot — リアルタイム性 (処理中 / 接続中 / 新着等) を示唆">
        <div className="flex flex-wrap gap-2">
          {VARIANTS.map((variant) => (
            <Badge key={variant} variant={variant} dot>{variant}</Badge>
          ))}
        </div>
      </Caption>

      <Caption text="長文ラベル — whitespace-nowrap で改行せず 1 行で表示 (折返ししたい場合は親側で wrap を許可)">
        <div className="flex flex-wrap gap-2 max-w-md">
          <Badge variant="primary" appearance="soft">とても長いラベルテキストが入る場合</Badge>
          <Badge variant="success" dot>非常に長い説明文のあるバッジ</Badge>
          <Badge variant="neutral" appearance="outline">Long English text badge example</Badge>
        </div>
      </Caption>

      <Caption text="数値カウント — small + solid で通知バッジ風 (1〜3 桁を想定)">
        <div className="flex gap-2 items-center">
          <Badge size="small" variant="error" appearance="solid">1</Badge>
          <Badge size="small" variant="error" appearance="solid">12</Badge>
          <Badge size="small" variant="error" appearance="solid">99+</Badge>
          <Badge size="small" variant="primary" appearance="solid">NEW</Badge>
        </div>
      </Caption>

      <Caption text="実践例 — リスト内ステータス表示 (カードや行末に揃える定型パターン)">
        <div className="flex flex-col gap-2 w-80">
          {([
            { label: '公開中', variant: 'success', appearance: 'soft', dot: true, item: '記事「公開中の設定」' },
            { label: '下書き', variant: 'neutral', appearance: 'outline', dot: false, item: '記事「下書きの設定」' },
            { label: '要レビュー', variant: 'warning', appearance: 'soft', dot: true, item: '記事「要レビューの設定」' },
            { label: '非公開', variant: 'error', appearance: 'soft', dot: false, item: '記事「非公開の設定」' },
            { label: 'NEW', variant: 'primary', appearance: 'solid', dot: false, item: 'プロ機能' },
          ] as const).map(({ label, variant, appearance, dot, item }) => (
            <div key={label} className="flex items-center justify-between px-3 py-2 rounded-xs border border-border-default">
              <span className="text-sm text-onSurface">{item}</span>
              <Badge variant={variant} appearance={appearance} dot={dot}>{label}</Badge>
            </div>
          ))}
        </div>
      </Caption>
    </div>
  ),
};
