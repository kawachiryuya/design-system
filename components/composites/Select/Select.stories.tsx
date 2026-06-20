import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Select } from './Select';
import { Caption } from '@sb-blocks/Caption';

/**
 * Select stories — VR 集約モデル (§5-3)
 *
 * 2 節構成: Playground / Overview。
 * size (sm/md/lg) と states (default/required/helpText/error/disabled/focus) を Overview に集約。
 * 住所フォーム等の usage は guideline の「使用例」へ移設。
 * optgroup / 長い options は native ドロップダウンを開いた時のみ見え、閉じた静的状態では撮れない
 *   (VR 非対象) → guideline に注記。
 * variant / icon prop は無し。
 */
const prefectures = [
  { value: 'tokyo', label: '東京都' },
  { value: 'osaka', label: '大阪府' },
  { value: 'aichi', label: '愛知県' },
  { value: 'fukuoka', label: '福岡県' },
  { value: 'hokkaido', label: '北海道' },
];

const meta: Meta<typeof Select> = {
  title: 'Composites/Select',
  component: Select,
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helpText: { control: 'text' },
    errorMessage: { control: 'text' },
  },
  args: {
    label: '都道府県',
    placeholder: '選択してください',
    children: prefectures.map((p) => (
      <option key={p.value} value={p.value}>{p.label}</option>
    )),
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────

export const Playground: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls から size / required / disabled / error / fullWidth 等を切替。selectOptions で値が反映されることを play test で保証。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByLabelText('都道府県');
    await userEvent.selectOptions(select, 'tokyo');
    await expect(select).toHaveValue('tokyo');
    await userEvent.selectOptions(select, 'osaka');
    await expect(select).toHaveValue('osaka');
  },
};

// ── 2. Overview (視覚回帰対象) ──────────────────────────────────
// size (sm/md/lg) と states (default/required=*/helpText/error/disabled/focus)。
// optgroup / 長い options は native ドロップダウン内部で静的に撮れないため Overview に並べない。

export const Overview: Story = {
  parameters: {
    // Select は focus-visible でなく focus: で ring を出す (Input.tsx と同方式) → pseudo は focus を強制
    pseudo: {
      focus: ['#sel-focus select'],
    },
    docs: {
      description: {
        story: '視覚回帰用の総覧。size (sm 40px / md 48px / lg 56px) と states (default / required=label に * / helpText / error=赤枠+errorMessage / disabled / focus) を集約。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">size (sm 40px / md 48px / lg 56px、md 以上で WCAG 2.5.5 達成)</div>
        <div className="flex flex-col gap-4 w-64">
          <Select size="sm" label="sm (40px)" placeholder="選択...">
            {prefectures.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </Select>
          <Select size="md" label="md (48px) — デフォルト" placeholder="選択...">
            {prefectures.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </Select>
          <Select size="lg" label="lg (56px)" placeholder="選択...">
            {prefectures.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">states</div>
        <div className="flex flex-col gap-4 w-64">
          <Caption text="Default">
            <Select label="都道府県" placeholder="選択...">
              {prefectures.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </Select>
          </Caption>
          <Caption text="Required (label の右に *)">
            <Select label="都道府県" required placeholder="選択...">
              {prefectures.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </Select>
          </Caption>
          <Caption text="With help text">
            <Select label="プラン" helpText="後から変更可能" placeholder="選択...">
              <option value="free">Free</option>
              <option value="pro">Pro</option>
            </Select>
          </Caption>
          <Caption text="Error (errorMessage 必須、aria-invalid 自動付与)">
            <Select label="支払い方法" error errorMessage="支払い方法を選択してください" required placeholder="選択...">
              <option value="card">クレジットカード</option>
            </Select>
          </Caption>
          <Caption text="Disabled">
            <Select label="国 (変更不可)" disabled placeholder="日本">
              <option value="jp">日本</option>
            </Select>
          </Caption>
          <Caption text="Focus (pseudo 強制、focus: で border + inset ring)">
            <div id="sel-focus">
              <Select label="フォーカス中" placeholder="選択...">
                {prefectures.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </Select>
            </div>
          </Caption>
        </div>
      </div>
    </div>
  ),
};
