import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';
import { Button } from '../../primitives/Button/Button';
import { Badge } from '../../primitives/Badge/Badge';
import { Caption } from '@sb-blocks/Caption';

/**
 * Card stories — 標準ストーリー構造に準拠
 *
 * 順序固定: Playground → Variants → States → EdgeCases
 *
 * Card は size / icon prop を持たないため Sizes / WithIcon は省略 (§5-3)。
 */
const meta: Meta<typeof Card> = {
  title: 'Composites/Card',
  component: Card,
  argTypes: {
    variant: { control: 'radio', options: ['elevated', 'outlined', 'filled'] },
    padding: { control: 'radio', options: ['none', 'sm', 'md', 'lg'] },
    clickable: { control: 'boolean' },
  },
  args: { variant: 'outlined' },
  // 全 story を w-80 でラップする (parameters.noWrap=true で個別に解除可能、memory: storybook-decorator-inheritance)
  decorators: [(Story, ctx) =>
    ctx.parameters.noWrap ? <Story /> : <div className="w-80"><Story /></div>,
  ],
};

export default meta;
type Story = StoryObj<typeof Card>;

// ── 1. Playground ──────────────────────────────────────────────

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Controls から variant / padding / clickable を切替。compound パターン (Card.Header / Card.Body / Card.Footer) で構成。',
      },
    },
  },
  render: (args) => (
    <Card {...args}>
      <Card.Header>カードタイトル</Card.Header>
      <Card.Body>
        <p className="text-sm text-onSurface-muted">ここにコンテンツが入ります。</p>
      </Card.Body>
      <Card.Footer>
        <Button size="sm" variant="tertiary">キャンセル</Button>
        <Button size="sm">保存</Button>
      </Card.Footer>
    </Card>
  ),
};

// ── 2. Variants ────────────────────────────────────────────────

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: 'elevated (影付き、強調) / outlined (枠線、標準) / filled (塗りつぶし、控えめ区切り) の 3 種。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      {(['elevated', 'outlined', 'filled'] as const).map((variant) => (
        <Card key={variant} variant={variant}>
          <Card.Body>
            <p className="text-sm font-medium text-onSurface">{variant}</p>
            <p className="text-xs text-onSurface-muted mt-1">カードのバリアントサンプル</p>
          </Card.Body>
        </Card>
      ))}
    </div>
  ),
};

// ── 3. States ──────────────────────────────────────────────────

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Compound パターン (Header/Body/Footer) と Padding 指定 (Header/Body/Footer なし) / divider 非表示 / Clickable / Link card (href) の構成パターン.',
      },
    },
    pseudo: {
      hover: ['#card-hover'],
      focusVisible: ['#card-focus button'],
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Caption text="Compound (Header + Body + Footer)">
        <Card>
          <Card.Header>カードタイトル</Card.Header>
          <Card.Body><p className="text-sm text-onSurface-muted">本文</p></Card.Body>
          <Card.Footer><Button size="sm">保存</Button></Card.Footer>
        </Card>
      </Caption>
      <Caption text="Padding 指定 (compound なし、直接 children)">
        <Card padding="md">
          <p className="text-sm text-onSurface">シンプルなテキストカード</p>
        </Card>
      </Caption>
      <Caption text="Divider 非表示 (Header/Footer の境界線なし)">
        <Card>
          <Card.Header divider={false}>タイトル</Card.Header>
          <Card.Body><p className="text-sm text-onSurface-muted">divider=false で境界線が消える</p></Card.Body>
          <Card.Footer divider={false}><Button size="sm">OK</Button></Card.Footer>
        </Card>
      </Caption>
      <Caption text="Clickable (role=button + onClick)">
        <Card clickable onClick={() => alert('クリック')}>
          <Card.Body>
            <p className="text-sm font-medium text-onSurface">クリック可能</p>
            <p className="text-xs text-onSurface-muted mt-1">onClick でハンドラー、キーボード Enter/Space も対応</p>
          </Card.Body>
        </Card>
      </Caption>
      <Caption text="Link card (href、<a> タグでレンダリング)">
        <Card href="#" target="_blank">
          <Card.Body>
            <p className="text-sm font-medium text-onSurface">リンクカード</p>
            <p className="text-xs text-onSurface-muted mt-1">href 指定で a タグ</p>
          </Card.Body>
        </Card>
      </Caption>
      <Caption text="Hover (pseudo-states 強制、clickable のみ反応)">
        <div id="card-hover">
          <Card clickable>
            <Card.Body><p className="text-sm">Hover 中</p></Card.Body>
          </Card>
        </div>
      </Caption>
    </div>
  ),
};

// ── 4. EdgeCases ───────────────────────────────────────────────

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: '実利用例: お知らせカード (header に Badge) / 統計カード (grid) / 長文 (折返し) / Layout token grid-base 適用 (Dashboard KPI 6 card レスポンシブ).',
      },
    },
    // meta 側の w-80 decorator を解除 (Layout token grid-base 例で全幅レスポンシブを示す)
    noWrap: true,
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="w-80 flex flex-col gap-4">
      <Caption text="お知らせカード (header に Badge、href でリンク化)">
        <Card href="#">
          <Card.Header divider={false}>
            <div className="flex items-center justify-between">
              <span>メンテナンスのお知らせ</span>
              <Badge variant="warning" appearance="soft" size="sm">重要</Badge>
            </div>
          </Card.Header>
          <Card.Body>
            <p className="text-sm text-onSurface-muted">3 月 10 日 02:00〜06:00 にサーバーメンテナンスを実施します。</p>
            <p className="text-xs text-onSurface-muted mt-2">2026.03.04</p>
          </Card.Body>
        </Card>
      </Caption>
      <Caption text="統計カード (grid、padding=md、compound 不使用)">
        <div className="grid grid-cols-2 gap-3 w-80">
          {[
            { label: '総ユーザー数', value: '12,480', change: '+8.2%', up: true },
            { label: '月間収益', value: '¥2.4M', change: '+12.5%', up: true },
            { label: '解約率', value: '2.1%', change: '-0.3%', up: false },
            { label: '平均セッション', value: '8m 32s', change: '+1m 12s', up: true },
          ].map(({ label, value, change, up }) => (
            <Card key={label} padding="md">
              <p className="text-xs text-onSurface-muted">{label}</p>
              <p className="text-xl font-bold text-onSurface mt-1">{value}</p>
              <p className={`text-xs mt-1 ${up ? 'text-onSurface-success' : 'text-onSurface-error'}`}>{change}</p>
            </Card>
          ))}
        </div>
      </Caption>
      <Caption text="長文 + 折返しなし長単語 (overflow-wrap で破断)">
        <Card>
          <Card.Header>長いコンテンツ</Card.Header>
          <Card.Body>
            <p className="text-sm text-onSurface-muted">
              デザインシステムは、チーム全体が共有できる単一の真実を提供します。Atomic Design に基づき、Atoms / Molecules / Organisms と段階的に積み上げることで再利用性と一貫性を両立します。
            </p>
            <p className="text-sm text-onSurface-muted mt-3 break-words">
              長単語: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            </p>
          </Card.Body>
        </Card>
      </Caption>
      </div>

      <Caption text="Layout token 適用 (grid-base + col-span でレスポンシブ card grid、Dashboard KPI 典型例)">
        <div className="w-full">
          <div className="grid-base">
            {[
              { label: '総ユーザー数', value: '12,480', change: '+8.2%', up: true },
              { label: '月間収益', value: '¥2.4M', change: '+12.5%', up: true },
              { label: '解約率', value: '2.1%', change: '-0.3%', up: false },
              { label: '平均セッション', value: '8m 32s', change: '+1m 12s', up: true },
              { label: 'NPS', value: '+42', change: '+5pt', up: true },
              { label: 'サポートチケット', value: '18', change: '-3', up: true },
            ].map(({ label, value, change, up }) => (
              <Card key={label} padding="md" className="col-span-4 md:col-span-4 lg:col-span-4">
                <p className="text-caption text-onSurface-muted">{label}</p>
                <p className="text-heading-md font-bold text-onSurface mt-1">{value}</p>
                <p className={`text-caption mt-1 ${up ? 'text-onSurface-success' : 'text-onSurface-error'}`}>{change}</p>
              </Card>
            ))}
          </div>
          <p className="text-caption text-onSurface-muted mt-3">
            mobile (&lt; 768px) では 4 col grid なので col-span-4 = 1 column / 行<br />
            tablet (768〜1023px) では 8 col grid なので col-span-4 = 2 columns / 行<br />
            desktop (≥ 1024px) では 12 col grid なので col-span-4 = 3 columns / 行
          </p>
        </div>
      </Caption>
    </div>
  ),
};
