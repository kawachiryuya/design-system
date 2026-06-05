import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Tokens/Focus Ring',
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const Tokens: Story = {
  name: 'width / offset',
  render: () => (
    <div style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif', maxWidth: '900px' }}>
      <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700, color: '#171717' }}>Focus Ring</h2>
      <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#737373', lineHeight: 1.6 }}>
        a11y 上重要なフォーカスリングを semantic 化。下流で <code style={{ backgroundColor: '#F5F5F5', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>tailwind.config.js</code>
        の token override で一括変更可能。<strong>色は <code style={{ backgroundColor: '#F5F5F5', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>border-focus</code></strong>
        (semantic-colors.json) と <strong>組合せて使う</strong>。
      </p>
      <p style={{ margin: '0 0 24px', fontSize: '13px', color: '#737373', lineHeight: 1.6 }}>
        利用 utility: <code style={{ backgroundColor: '#F5F5F5', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>focus-visible:ring-focus focus-visible:ring-offset-focus focus-visible:ring-border-focus</code>
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
        {[
          { key: 'width',  value: '2px', description: 'リング太さ。WCAG 2.4.11 (3:1 視認性) を満たす' },
          { key: 'offset', value: '2px', description: '要素境界とリング間の隙間。要素の角丸感を保つ' },
        ].map((e) => (
          <div
            key={e.key}
            style={{
              display: 'grid',
              gridTemplateColumns: '200px 80px 1fr',
              gap: '16px',
              alignItems: 'center',
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid #E5E5E5',
              backgroundColor: '#FFFFFF',
            }}
          >
            <code style={{ fontSize: '13px', fontFamily: 'monospace', color: '#525252', backgroundColor: '#F5F5F5', padding: '4px 8px', borderRadius: '4px' }}>
              ring-{e.key === 'offset' ? 'offset-focus' : 'focus'}
            </code>
            <code style={{ fontSize: '12px', fontFamily: 'monospace', color: '#737373' }}>{e.value}</code>
            <span style={{ fontSize: '13px', color: '#171717' }}>{e.description}</span>
          </div>
        ))}
      </div>

      <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 600, color: '#171717' }}>視覚サンプル (forced focus)</h3>
      <p style={{ margin: '0 0 16px', fontSize: '12px', color: '#737373', lineHeight: 1.6 }}>
        強制的にリングを出した状態の例。`Tab` キーでフォーカスする実際の挙動は各 component の States story 参照。
      </p>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', padding: '24px', backgroundColor: '#FAFAFA', borderRadius: '8px' }}>
        <button
          type="button"
          className="ring-focus ring-offset-focus ring-border-focus"
          style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: '#006F50', color: '#FFFFFF', fontSize: '14px', fontWeight: 500 }}
        >
          Button (primary)
        </button>
        <input
          type="text"
          defaultValue="Input (focused)"
          className="ring-focus ring-offset-focus ring-border-focus"
          style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #D4D4D4', fontSize: '14px' }}
        />
        <a
          href="#sample"
          className="ring-focus ring-offset-focus ring-border-focus"
          style={{ padding: '4px 6px', borderRadius: '4px', color: '#006F50', textDecoration: 'underline', fontSize: '14px' }}
        >
          Link (focused)
        </a>
      </div>
    </div>
  ),
};
