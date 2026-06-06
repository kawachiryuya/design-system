import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { useState } from 'react';
import { SearchBar } from './SearchBar';
import { Caption } from '@sb-blocks/Caption';

/**
 * SearchBar stories — 標準ストーリー構造に準拠
 *
 * 順序固定: Playground → Sizes → States → EdgeCases
 *
 * SearchBar は variant prop を持たないため Variants は省略。Icon は内部実装で WithIcon も省略 (§5-3)。
 */
const meta: Meta<typeof SearchBar> = {
  title: 'Composites/SearchBar',
  component: SearchBar,
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    fullWidth: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    value: { control: 'text' },
  },
  args: {
    value: '',
    placeholder: '検索...',
    size: 'md',
  },
  render: (args) => {
    function Demo() {
      const [v, setV] = useState(args.value);
      return <SearchBar {...args} value={v} onChange={setV} />;
    }
    return <Demo />;
  },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

// ── 1. Playground ──────────────────────────────────────────────

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Controls から size / fullWidth / isLoading / disabled / placeholder / value を切替。テキスト入力 → クリアボタン click で値が消えることを play test で保証。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('searchbox');
    await expect(input).toHaveValue('');
    await userEvent.type(input, 'デザイン');
    await expect(input).toHaveValue('デザイン');
    const clearBtn = canvas.getByRole('button', { name: '検索をクリア' });
    await userEvent.click(clearBtn);
    await expect(input).toHaveValue('');
    await expect(input).toHaveFocus();
  },
};

// ── 2. Sizes ───────────────────────────────────────────────────

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'sm (32px、テーブルフィルタ) / md (40px、標準) / lg (48px、ヘッダー検索) の 3 段階。',
      },
    },
  },
  render: () => {
    function Demo() {
      const [q1, setQ1] = useState('');
      const [q2, setQ2] = useState('');
      const [q3, setQ3] = useState('');
      return (
        <div className="flex flex-col gap-3 w-80">
          <SearchBar size="sm" value={q1} onChange={setQ1} placeholder="sm" />
          <SearchBar size="md" value={q2} onChange={setQ2} placeholder="md (デフォルト)" />
          <SearchBar size="lg" value={q3} onChange={setQ3} placeholder="lg" />
        </div>
      );
    }
    return <Demo />;
  },
};

// ── 3. States ──────────────────────────────────────────────────

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Empty / With value (クリアボタン表示) / Loading (spinner) / Disabled / Focus-visible / FullWidth の構成パターン.',
      },
    },
    pseudo: {
      focusVisible: ['#sb-focus input'],
    },
  },
  render: () => {
    function Demo() {
      const [empty, setEmpty] = useState('');
      const [val, setVal] = useState('入力済み');
      const [loadV, setLoadV] = useState('検索中...');
      const [focusV, setFocusV] = useState('');
      const [fullV, setFullV] = useState('');
      return (
        <div className="flex flex-col gap-3 w-96">
          <Caption text="Empty (placeholder のみ表示)">
            <SearchBar value={empty} onChange={setEmpty} placeholder="検索..." />
          </Caption>
          <Caption text="With value (クリアボタン表示)">
            <SearchBar value={val} onChange={setVal} placeholder="検索..." />
          </Caption>
          <Caption text="Loading (spinner 表示、クリアボタンは隠れる)">
            <SearchBar value={loadV} onChange={setLoadV} isLoading placeholder="検索..." />
          </Caption>
          <Caption text="Disabled">
            <SearchBar value="" onChange={() => {}} disabled placeholder="検索..." />
          </Caption>
          <Caption text="Focus-visible (pseudo-states 強制)">
            <div id="sb-focus">
              <SearchBar value={focusV} onChange={setFocusV} placeholder="検索..." />
            </div>
          </Caption>
          <Caption text="fullWidth (親要素幅に追従)">
            <SearchBar value={fullV} onChange={setFullV} fullWidth placeholder="記事・タグ・著者で検索..." />
          </Caption>
        </div>
      );
    }
    return <Demo />;
  },
};

// ── 4. EdgeCases ───────────────────────────────────────────────

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: '実利用例: onSearch (Enter で実行) / ヘッダー検索 (候補表示) / テーブルフィルタ (sm、リアルタイム絞り込み).',
      },
    },
  },
  render: () => {
    function SearchCallbackDemo() {
      const [value, setValue] = useState('');
      const [result, setResult] = useState<string | null>(null);
      return (
        <div className="space-y-3">
          <SearchBar value={value} onChange={setValue} onSearch={(v) => setResult(v)} placeholder="Enter で検索実行..." />
          {result !== null && (
            <p className="text-sm text-onSurface-muted">検索クエリ: <strong>{result || '(空)'}</strong></p>
          )}
        </div>
      );
    }
    function HeaderSearchDemo() {
      const [value, setValue] = useState('');
      const [results, setResults] = useState<string[]>([]);
      const [isLoading, setIsLoading] = useState(false);
      const suggestions = ['デザインシステム', 'Tailwind CSS', 'React Hooks', 'TypeScript', 'Storybook'];
      const handleChange = (v: string) => {
        setValue(v);
        if (!v) { setResults([]); return; }
        setIsLoading(true);
        setTimeout(() => {
          setResults(suggestions.filter((s) => s.toLowerCase().includes(v.toLowerCase())));
          setIsLoading(false);
        }, 300);
      };
      return (
        <div className="relative">
          <SearchBar value={value} onChange={handleChange} isLoading={isLoading} fullWidth placeholder="記事を検索..." />
          {results.length > 0 && (
            <ul className="absolute top-full mt-1 w-full bg-surface border border-border-subtle rounded-sm shadow-sm z-dropdown overflow-hidden">
              {results.map((r) => (
                <li key={r}>
                  <button type="button" onClick={() => { setValue(r); setResults([]); }}
                    className="w-full text-left px-3 py-2 text-sm text-onSurface hover:bg-state-hover transition-colors">
                    {r}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }
    function TableFilterDemo() {
      const data = ['田中 太郎', '鈴木 花子', '佐藤 一郎', '山田 次郎', '木村 三郎'];
      const [query, setQuery] = useState('');
      const filtered = data.filter((name) => name.includes(query));
      return (
        <div className="space-y-3">
          <SearchBar value={query} onChange={setQuery} size="sm" fullWidth placeholder="ユーザーを検索..." />
          <ul className="divide-y divide-border-subtle border border-border-subtle rounded-sm">
            {filtered.length > 0
              ? filtered.map((name) => (<li key={name} className="px-3 py-2 text-sm text-onSurface">{name}</li>))
              : <li className="px-3 py-4 text-sm text-onSurface-muted text-center">見つかりませんでした</li>}
          </ul>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-6 w-80">
        <Caption text="onSearch (Enter で検索実行)"><SearchCallbackDemo /></Caption>
        <Caption text="ヘッダー検索 (候補表示、isLoading 連動)"><HeaderSearchDemo /></Caption>
        <Caption text="テーブルフィルタ (sm、リアルタイム絞り込み)"><TableFilterDemo /></Caption>
      </div>
    );
  },
};
