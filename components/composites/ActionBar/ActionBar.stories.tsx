import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { ActionBar } from './ActionBar';
import { Button } from '../../primitives/Button';
import { Caption } from '@sb-blocks/Caption';

/**
 * ActionBar stories — VR 集約モデル (§5-3): Playground / Overview / EdgeCases
 *
 * - Overview = props で作れる内在パターン: orientation (vertical/horizontal の確定形) と align。
 *   responsive の「縦↔横の切替」は container 幅依存なので Overview ではなく EdgeCases で固定幅で見せる。
 * - EdgeCases = responsive を **固定 container 幅**で凍結 (閾値未満=縦 full-width / 以上=横 hug)。
 *   Controls では container 幅を変えられないため、構造ケースとして固定幅で撮る。
 * - 状態を持たない layout composite のため States は無し。
 */
const meta: Meta<typeof ActionBar> = {
  title: 'Composites/ActionBar',
  component: ActionBar,
  // 既定 (preview.ts) の layout='centered' は中身を shrink-wrap し、ActionBar の
  // `@container` (container-type:inline-size) が確定幅をもらえず 0 幅に潰れる。
  // padded で full-width block 文脈にし、container query が利用可能幅を測れるようにする。
  parameters: { layout: 'padded' },
  argTypes: {
    orientation: { control: 'radio', options: ['responsive', 'vertical', 'horizontal'] },
    align: { control: 'radio', options: ['start', 'center', 'end', 'between'] },
    collapseAt: { control: 'radio', options: ['sm', 'md', 'lg'] },
    gap: { control: 'radio', options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] },
    children: { control: false },
  },
  args: {
    orientation: 'responsive',
    align: 'end',
    collapseAt: 'md',
    gap: 'sm',
  },
};

export default meta;
type Story = StoryObj<typeof ActionBar>;

/** ActionBar の幅 = @container の幅。Controls 探索を分かりやすくするため枠付きの中幅で包む。 */
const Frame = ({ children, width = 'w-full max-w-md' }: { children: React.ReactNode; width?: string }) => (
  <div className={[width, 'bg-surface-layer-2 border border-dashed border-border-subtle rounded-md p-4'].join(' ')}>
    {children}
  </div>
);

// ── 1. Playground ──────────────────────────────────────────────

export const Playground: Story = {
  decorators: [(Story) => <Frame>{Story()}</Frame>],
  render: (args) => (
    <ActionBar {...args}>
      <Button variant="tertiary">キャンセル</Button>
      <Button variant="primary">保存</Button>
    </ActionBar>
  ),
  parameters: {
    // Playground は Controls 探索の起点 → 視覚回帰対象外 (§5-3: 静的カタログが VR 対象)
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story:
          'Controls で `orientation` / `align` / `collapseAt` / `gap` を切替えて確認。`responsive` の縦↔横は ActionBar 自身の幅 (= 枠 max-w-md ≈ 448px) で決まるため、container 幅依存の切替は EdgeCases の固定幅で見る。DOM順は優先度昇順 (tertiary→primary) で、横では primary が右端・縦では最下に来る。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: '保存' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument();
  },
};

// ── 2. Overview (視覚回帰対象) ──────────────────────────────────
// props で作れる内在パターン: orientation の確定形 (vertical/horizontal) と align。

export const Overview: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '内在パターンの総覧。orientation の確定形 (vertical = 縦 full-width / horizontal = 横 hug) と、横並び時の align (end=footer / center=終端画面 / start / between)。予約完了パターン (ホーム=secondary / 詳細=primary, align="center") を末尾に例示。responsive の container 幅による切替は EdgeCases。',
      },
    },
  },
  render: () => (
    // ActionBar の @container は確定幅の祖先が必須 (Caption の items-start では stretch されず
    // 0 幅に潰れるため)。Overview の各 Frame には明示幅を与え、VR も決定的にする。
    <div className="flex flex-col gap-6">
      <Caption text="orientation — vertical (縦 full-width) / horizontal (横 hug + min-w)">
        <div className="flex flex-wrap gap-4">
          <Frame width="w-[320px]">
            <ActionBar orientation="vertical">
              <Button variant="tertiary">キャンセル</Button>
              <Button variant="primary">保存</Button>
            </ActionBar>
          </Frame>
          <Frame width="w-[440px]">
            <ActionBar orientation="horizontal">
              <Button variant="tertiary">キャンセル</Button>
              <Button variant="primary">保存</Button>
            </ActionBar>
          </Frame>
        </div>
      </Caption>

      <Caption text="align — 横並び時の整列 (end が既定 / 終端画面は center)">
        <div className="flex flex-col gap-2">
          {(['end', 'center', 'start', 'between'] as const).map((a) => (
            <div key={a} className="flex items-center gap-2">
              <div className="w-28 shrink-0 text-xs text-onSurface-muted font-mono">align={a}</div>
              <Frame width="w-[360px]">
                <ActionBar orientation="horizontal" align={a}>
                  <Button variant="secondary">戻る</Button>
                  <Button variant="primary">次へ</Button>
                </ActionBar>
              </Frame>
            </div>
          ))}
        </div>
      </Caption>

      <Caption text='予約完了パターン — ホーム=secondary / 詳細=primary, align="center"'>
        <Frame width="w-[400px]">
          <ActionBar orientation="horizontal" align="center">
            <Button variant="secondary">ホームに戻る</Button>
            <Button variant="primary">予約詳細を見る</Button>
          </ActionBar>
        </Frame>
      </Caption>
    </div>
  ),
};

// ── 3. EdgeCases (視覚回帰対象) ─────────────────────────────────
// responsive の縦↔横切替は ActionBar 自身の幅 (container query) 依存。Controls では幅を変えられない
// 構造ケースなので、閾値 (collapseAt="md" = 400px) を挟む固定幅 (360 / 480px) で凍結する。

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'responsive を固定 container 幅で凍結。collapseAt="md" (400px) を挟み、360px (閾値未満) では縦 full-width で primary が最下、480px (閾値以上) では横 hug で primary が右端になる。判断基準は viewport ではなく群自身の幅 (狭い pane 内でも正しく縦に畳む)。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <Caption text="container 360px (閾値 400px 未満) — 縦 full-width、primary は最下 (親指ゾーン)">
        <Frame width="w-[360px]">
          <ActionBar>
            <Button variant="tertiary">キャンセル</Button>
            <Button variant="primary">保存</Button>
          </ActionBar>
        </Frame>
      </Caption>

      <Caption text="container 480px (閾値 400px 以上) — 横 hug、primary は右端 (align=end 既定)">
        <Frame width="w-[480px]">
          <ActionBar>
            <Button variant="tertiary">キャンセル</Button>
            <Button variant="primary">保存</Button>
          </ActionBar>
        </Frame>
      </Caption>
    </div>
  ),
};
