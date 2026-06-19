import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Select } from './Select';
import { Caption } from '@sb-blocks/Caption';

/**
 * Select stories — 標準ストーリー構造に準拠
 *
 * 順序固定: Playground → Sizes → States → EdgeCases
 *
 * Select は variant / icon prop を持たないため Variants / WithIcon は省略 (§5-3)。
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

// ── 1. Playground ──────────────────────────────────────────────

export const Playground: Story = {
  parameters: {
    // Playground は Controls 探索の起点 → 視覚回帰対象外 (#78 / §5-3: 静的カタログが VR 対象)
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

// ── 2. Sizes ───────────────────────────────────────────────────

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'sm (40px) / md (48px) / lg (56px) の 3 段階。全 step +8 等差で grid 整合 (Material 3 max と同等)。WCAG 2.5.5 タッチターゲット (44×44px) は md 以上で達成 (sm は dense UI 用)。',
      },
    },
  },
  render: () => (
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
  ),
};

// ── 3. States ──────────────────────────────────────────────────

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default / Required / WithHelpText / Error (errorMessage 必須) / Disabled / FullWidth の構成パターン + Focus-visible.',
      },
    },
    pseudo: {
      focusVisible: ['#sel-focus select'],
    },
  },
  render: () => (
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
      <Caption text="Focus-visible (pseudo-states 強制)">
        <div id="sel-focus">
          <Select label="フォーカス中" placeholder="選択...">
            {prefectures.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </Select>
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
        story: '実利用例: 住所フォーム (fullWidth で並べる) と、optgroup を使った階層構造 / 多数の options (long list)。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <Caption text="住所フォーム (Layout token: px-container / max-w-container / space-y-section-sm + fullWidth)">
        <form className="w-full px-container py-container max-w-container mx-auto bg-surface border border-border-subtle rounded-md">
          <div className="space-y-section-sm">
            <h3 className="text-heading-sm text-onSurface m-0">配送情報</h3>
            <div className="flex flex-col gap-4">
              <Select label="都道府県" required placeholder="都道府県を選択" fullWidth>
                {prefectures.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </Select>
              <Select label="配送希望時間" placeholder="指定なし" fullWidth>
                {['午前中', '14〜16 時', '16〜18 時', '18〜20 時', '20〜21 時'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Select>
            </div>
          </div>
        </form>
      </Caption>
      <Caption text="optgroup を使った階層 (都道府県 → 地方カテゴリ)">
        <Select label="都道府県" placeholder="選択..." fullWidth>
          <optgroup label="関東">
            <option value="tokyo">東京都</option>
            <option value="kanagawa">神奈川県</option>
            <option value="saitama">埼玉県</option>
          </optgroup>
          <optgroup label="関西">
            <option value="osaka">大阪府</option>
            <option value="kyoto">京都府</option>
            <option value="hyogo">兵庫県</option>
          </optgroup>
        </Select>
      </Caption>
      <Caption text="長い options (47 都道府県全部、スクロール想定)">
        <Select label="都道府県 (47 件)" placeholder="選択..." fullWidth>
          {[
            '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
            '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
            '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
            '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
            '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
            '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
            '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県',
          ].map((name, i) => <option key={i} value={name}>{name}</option>)}
        </Select>
      </Caption>
    </div>
  ),
};
