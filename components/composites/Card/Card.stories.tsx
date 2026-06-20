import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';
import { Button } from '../../primitives/Button/Button';
import { Caption } from '@sb-blocks/Caption';

/**
 * Card stories — VR 集約モデル (§5-3)
 *
 * 3 節構成: Playground / Overview / EdgeCases。
 * Card は size/icon prop を持たない。
 *
 * Docs (Guideline) は Card.guideline.mdx 側で `<Meta of={...} />` 経由で統合される。
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
  decorators: [(Story, ctx) =>
    ctx.parameters.noWrap ? <Story /> : <div className="w-80"><Story /></div>,
  ],
};

export default meta;
type Story = StoryObj<typeof Card>;

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────

export const Playground: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
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

// ── 2. Overview (視覚回帰対象) ──────────────────────────────────
// props で作れる内在軸を集約: variant (3) / 構成 (compound・padding・divider・clickable・link) / hover。

export const Overview: Story = {
  parameters: {
    noWrap: true,
    docs: {
      description: {
        story: '視覚回帰用の総覧。variant (elevated/outlined/filled) と構成パターン (compound / padding 直 children / divider=false / clickable / link card / hover) を 1 枚に集約。',
      },
    },
    pseudo: {
      hover: ['#card-hover'],
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">variant (elevated / outlined / filled)</div>
        <div className="flex flex-col gap-4 w-80">
          {(['elevated', 'outlined', 'filled'] as const).map((variant) => (
            <Card key={variant} variant={variant}>
              <Card.Body>
                <p className="text-sm font-medium text-onSurface">{variant}</p>
                <p className="text-xs text-onSurface-muted mt-1">カードのバリアントサンプル</p>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">構成 (compound / padding 直 children / divider=false / clickable / link / hover)</div>
        <div className="flex flex-col gap-4 w-80">
          <Caption text="Compound (Header + Body + Footer)">
            <Card>
              <Card.Header>カードタイトル</Card.Header>
              <Card.Body><p className="text-sm text-onSurface-muted">本文</p></Card.Body>
              <Card.Footer><Button size="sm">保存</Button></Card.Footer>
            </Card>
          </Caption>
          <Caption text="padding 指定 (compound なし、直接 children)">
            <Card padding="md"><p className="text-sm text-onSurface">シンプルなテキストカード</p></Card>
          </Caption>
          <Caption text="divider=false (Header/Footer の境界線なし)">
            <Card>
              <Card.Header divider={false}>タイトル</Card.Header>
              <Card.Body><p className="text-sm text-onSurface-muted">divider=false で境界線が消える</p></Card.Body>
              <Card.Footer divider={false}><Button size="sm">OK</Button></Card.Footer>
            </Card>
          </Caption>
          <Caption text="Clickable (role=button + onClick)">
            <Card clickable onClick={() => {}}>
              <Card.Body>
                <p className="text-sm font-medium text-onSurface">クリック可能</p>
                <p className="text-xs text-onSurface-muted mt-1">Enter/Space も対応</p>
              </Card.Body>
            </Card>
          </Caption>
          <Caption text="Link card (href、<a> でレンダリング)">
            <Card href="#" target="_blank">
              <Card.Body>
                <p className="text-sm font-medium text-onSurface">リンクカード</p>
                <p className="text-xs text-onSurface-muted mt-1">href 指定で a タグ</p>
              </Card.Body>
            </Card>
          </Caption>
          <Caption text="Hover (pseudo 強制、clickable のみ反応)">
            <div id="card-hover">
              <Card clickable>
                <Card.Body><p className="text-sm">Hover 中</p></Card.Body>
              </Card>
            </div>
          </Caption>
        </div>
      </div>
    </div>
  ),
};

// ── 3. EdgeCases (視覚回帰対象) ─────────────────────────────────
// props だけでは作れない文脈依存: 長文の折返し / 折返しなし長単語の break-words。
// ※ お知らせカード / 統計カード grid / Layout token grid などの usage 合成は guideline の「使用例」へ移設。

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: '長文の自然折返し / 折返しなし長単語 (overflow-wrap で破断)。実利用の card grid 等の usage 合成は guideline 参照。',
      },
    },
  },
  render: () => (
    <div className="w-80">
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
    </div>
  ),
};
