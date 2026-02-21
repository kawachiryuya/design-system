import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SearchBar } from './SearchBar';

const meta: Meta<typeof SearchBar> = {
  title: 'Molecules/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['small', 'medium', 'large'] },
    fullWidth: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    value: { control: 'text' },
  },
  args: {
    value: '',
    placeholder: '検索...',
    size: 'medium',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <SearchBar {...args} value={value} onChange={setValue} />;
  },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {};

export const WithValue: Story = {
  render: () => {
    const [value, setValue] = useState('デザインシステム');
    return <SearchBar value={value} onChange={setValue} placeholder="検索..." />;
  },
};

export const AllSizes: Story = {
  render: () => {
    const [q1, setQ1] = useState('');
    const [q2, setQ2] = useState('');
    const [q3, setQ3] = useState('');
    return (
      <div className="flex flex-col gap-3 w-80">
        <SearchBar size="small" value={q1} onChange={setQ1} placeholder="Small" />
        <SearchBar size="medium" value={q2} onChange={setQ2} placeholder="Medium（デフォルト）" />
        <SearchBar size="large" value={q3} onChange={setQ3} placeholder="Large" />
      </div>
    );
  },
};

export const Loading: Story = {
  render: () => {
    const [value, setValue] = useState('React hooks');
    return <SearchBar value={value} onChange={setValue} isLoading placeholder="検索..." />;
  },
};

export const Disabled: Story = {
  render: () => (
    <SearchBar value="" onChange={() => {}} disabled placeholder="検索..." />
  ),
};

export const FullWidth: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return <div className="w-96"><SearchBar value={value} onChange={setValue} fullWidth placeholder="記事・タグ・著者で検索..." /></div>;
  },
};

export const WithSearchCallback: Story = {
  name: 'onSearch コールバック（Enter で実行）',
  render: () => {
    const [value, setValue] = useState('');
    const [result, setResult] = useState<string | null>(null);
    return (
      <div className="w-80 space-y-3">
        <SearchBar
          value={value}
          onChange={setValue}
          onSearch={(v) => setResult(v)}
          placeholder="Enter で検索実行..."
        />
        {result !== null && (
          <p className="text-sm text-neutral-600">
            検索クエリ: <strong>{result || '（空）'}</strong>
          </p>
        )}
      </div>
    );
  },
};

export const HeaderSearch: Story = {
  name: '実践例: ヘッダーの検索バー',
  render: () => {
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
      <div className="relative w-80">
        <SearchBar value={value} onChange={handleChange} isLoading={isLoading}
          fullWidth placeholder="記事を検索..." />
        {results.length > 0 && (
          <ul className="absolute top-full mt-1 w-full bg-white border border-neutral-200
            rounded shadow-sm z-10 overflow-hidden">
            {results.map((r) => (
              <li key={r}>
                <button type="button" onClick={() => { setValue(r); setResults([]); }}
                  className="w-full text-left px-3 py-2 text-sm text-neutral-700
                    hover:bg-neutral-50 transition-colors">
                  {r}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  },
};

export const TableFilter: Story = {
  name: '実践例: テーブルフィルター',
  render: () => {
    const data = ['田中 太郎', '鈴木 花子', '佐藤 一郎', '山田 次郎', '木村 三郎'];
    const [query, setQuery] = useState('');
    const filtered = data.filter((name) => name.includes(query));

    return (
      <div className="w-80 space-y-3">
        <SearchBar value={query} onChange={setQuery} size="small"
          fullWidth placeholder="ユーザーを検索..." />
        <ul className="divide-y divide-neutral-100 border border-neutral-200 rounded">
          {filtered.length > 0
            ? filtered.map((name) => (
                <li key={name} className="px-3 py-2 text-sm text-neutral-700">{name}</li>
              ))
            : <li className="px-3 py-4 text-sm text-neutral-400 text-center">見つかりませんでした</li>
          }
        </ul>
      </div>
    );
  },
};
