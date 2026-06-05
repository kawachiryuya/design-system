import type { Meta, StoryObj } from '@storybook/react-vite';
import { TokenPageHeader } from '@sb-blocks/TokenPageHeader';

const meta: Meta = {
  title: 'Tokens/Z-Index',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

type Layer = { key: string; value: number; description: string; example: string };

const LAYERS: Layer[] = [
  { key: 'dropdown', value: 1000, description: 'Select / SearchBar suggest 等の inline overlay', example: 'Select の選択肢リスト' },
  { key: 'sticky',   value: 1100, description: 'sticky header / sticky table column',         example: 'スクロール時に固定される TableHeader' },
  { key: 'overlay',  value: 1200, description: '汎用 overlay (drawer / sheet 背景)',           example: 'Side Drawer の背景マスク' },
  { key: 'modal',    value: 1300, description: 'modal 本体 (ネイティブ dialog は OS 管理)',     example: 'Modal / FullscreenDialog' },
  { key: 'popover',  value: 1400, description: 'modal より前面の popover',                     example: 'モーダル内で表示するメニュー' },
  { key: 'toast',    value: 1500, description: '通知 (常に最前面のテンポラリ UI)',              example: 'Toast の通知エリア' },
  { key: 'tooltip',  value: 1600, description: 'tooltip (最後に被さる軽量説明)',                 example: 'icon-only Button の説明 tooltip' },
];

export const Layers: Story = {
  name: 'レイヤ',
  render: () => (
    <div className="max-w-[900px]">
      <TokenPageHeader
        title="Z-Index"
        intro="重なり順を意味のあるラベルで表現する semantic スケール。Tailwind 既定の z-0/10/.../50 も並存。"
        utility="z-{key}"
      >
        Modal は <code className="bg-surface-inset text-onSurface px-[6px] py-[1px] rounded-sm font-mono text-xs">&lt;dialog&gt;</code> を採用しているため OS の top layer 管理で z-index 指定が実質不要。将来 Popover/Tooltip/Dropdown 追加時の予約スケール。
      </TokenPageHeader>

      <div className="flex flex-col gap-2">
        {LAYERS.map((l) => (
          <div
            key={l.key}
            className="grid items-center gap-4 py-3 px-4 rounded-md border border-border-muted bg-surface"
            style={{ gridTemplateColumns: '140px 80px 1fr' }}
          >
            <code className="bg-surface-inset text-onSurface px-2 py-1 rounded-sm font-mono text-xs">
              z-{l.key}
            </code>
            <code className="font-mono text-xs text-onSurface-muted">{l.value}</code>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-onSurface">{l.description}</span>
              <span className="text-xs text-onSurface-muted">例: {l.example}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};
