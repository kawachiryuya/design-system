import type { Meta, StoryObj } from '@storybook/react-vite';

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
    <div style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif', maxWidth: '900px' }}>
      <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700, color: '#171717' }}>Z-Index</h2>
      <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#737373', lineHeight: 1.6 }}>
        重なり順を <strong>意味のあるラベル</strong>で表現する semantic スケール。
        Tailwind の <code style={{ backgroundColor: '#F5F5F5', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>z-{'{key}'}</code> utility で使う
        (<code style={{ backgroundColor: '#F5F5F5', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>z-modal</code> /
        <code style={{ backgroundColor: '#F5F5F5', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>z-toast</code> 等)。
        Tailwind 既定の <code style={{ backgroundColor: '#F5F5F5', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>z-0/10/.../50</code>
        も並存 (上書きせず extend)。
      </p>
      <p style={{ margin: '0 0 24px', fontSize: '13px', color: '#737373', lineHeight: 1.6 }}>
        Modal は <code style={{ backgroundColor: '#F5F5F5', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>&lt;dialog&gt;</code> を採用しているため、
        OS の top layer 管理で z-index 指定が実質不要。スケールは将来 Popover/Tooltip/Dropdown 追加時の予約。
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {LAYERS.map((l) => (
          <div
            key={l.key}
            style={{
              display: 'grid',
              gridTemplateColumns: '140px 80px 1fr',
              gap: '16px',
              alignItems: 'center',
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid #E5E5E5',
              backgroundColor: '#FFFFFF',
            }}
          >
            <code style={{ fontSize: '13px', fontFamily: 'monospace', color: '#525252', backgroundColor: '#F5F5F5', padding: '4px 8px', borderRadius: '4px' }}>
              z-{l.key}
            </code>
            <code style={{ fontSize: '12px', fontFamily: 'monospace', color: '#737373' }}>{l.value}</code>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '13px', color: '#171717' }}>{l.description}</span>
              <span style={{ fontSize: '12px', color: '#A3A3A3' }}>例: {l.example}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};
