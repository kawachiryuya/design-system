import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { useState } from 'react';
import { Pagination } from './Pagination';
import { Caption } from '@sb-blocks/Caption';

/**
 * Pagination stories — 標準ストーリー構造に準拠
 *
 * 順序固定: Playground → Sizes → States → EdgeCases
 *
 * Pagination は variant prop を持たないため Variants は省略。Icon は内部実装で WithIcon も省略 (§5-3)。
 */
const meta: Meta<typeof Pagination> = {
  title: 'Composites/Pagination',
  component: Pagination,
  argTypes: {
    currentPage: { control: { type: 'number', min: 1 } },
    totalPages: { control: { type: 'number', min: 1 } },
    maxVisible: { control: { type: 'number', min: 3, max: 11 } },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    showEdges: { control: 'boolean' },
  },
  args: { currentPage: 5, totalPages: 20, size: 'md', maxVisible: 7 },
  render: (args) => {
    function Demo() {
      const [page, setPage] = useState(args.currentPage);
      return <Pagination {...args} currentPage={page} onPageChange={setPage} />;
    }
    return <Demo />;
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

// ── 1. Playground ──────────────────────────────────────────────

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Controls から currentPage / totalPages / maxVisible / size / showEdges を切替。前/次ボタン click で aria-current が移動することを play test で保証。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText('5ページ目')).toHaveAttribute('aria-current', 'page');
    await userEvent.click(canvas.getByLabelText('次のページ'));
    await expect(canvas.getByLabelText('6ページ目')).toHaveAttribute('aria-current', 'page');
    await userEvent.click(canvas.getByLabelText('前のページ'));
    await expect(canvas.getByLabelText('5ページ目')).toHaveAttribute('aria-current', 'page');
  },
};

// ── 2. Sizes ───────────────────────────────────────────────────

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'sm (28px、フッター / サイドバー) / md (32px、標準) / lg (40px、モバイル CTA) の 3 段階。',
      },
    },
  },
  render: () => {
    function Demo() {
      const [p1, setP1] = useState(3);
      const [p2, setP2] = useState(3);
      const [p3, setP3] = useState(3);
      return (
        <div className="flex flex-col gap-4">
          <Caption text="sm (28px)">
            <Pagination size="sm" currentPage={p1} totalPages={10} onPageChange={setP1} />
          </Caption>
          <Caption text="md (32px) — デフォルト">
            <Pagination size="md" currentPage={p2} totalPages={10} onPageChange={setP2} />
          </Caption>
          <Caption text="lg (40px)">
            <Pagination size="lg" currentPage={p3} totalPages={10} onPageChange={setP3} />
          </Caption>
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
        story: 'First / Middle / Last の各位置と、Few pages (1〜5) / Many pages (ellipsis 表示) / showEdges (« » 付き) のパターン。',
      },
    },
  },
  render: () => {
    function Demo() {
      const [p1, setP1] = useState(1);
      const [p2, setP2] = useState(20);
      const [p3, setP3] = useState(2);
      const [p4, setP4] = useState(50);
      const [p5, setP5] = useState(5);
      return (
        <div className="flex flex-col gap-4">
          <Caption text="First page (1/20、前ボタン disabled)">
            <Pagination currentPage={p1} totalPages={20} onPageChange={setP1} />
          </Caption>
          <Caption text="Last page (20/20、次ボタン disabled)">
            <Pagination currentPage={p2} totalPages={20} onPageChange={setP2} />
          </Caption>
          <Caption text="Few pages (totalPages <= maxVisible、ellipsis なし)">
            <Pagination currentPage={p3} totalPages={4} onPageChange={setP3} />
          </Caption>
          <Caption text="Many pages (ellipsis 表示)">
            <Pagination currentPage={p4} totalPages={100} onPageChange={setP4} />
          </Caption>
          <Caption text="showEdges (« » の最初/最後ジャンプ)">
            <Pagination currentPage={p5} totalPages={50} onPageChange={setP5} showEdges />
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
        story: '実利用例: 記事一覧ページ (件数表示 + Pagination + showEdges) / totalPages=1 (描画されない検証)。',
      },
    },
  },
  render: () => {
    function ArticleList() {
      const [page, setPage] = useState(1);
      const perPage = 5;
      const total = 47;
      const totalPages = Math.ceil(total / perPage);
      const items = Array.from({ length: perPage }, (_, i) => {
        const num = (page - 1) * perPage + i + 1;
        return num <= total ? `記事タイトル #${num}` : null;
      }).filter(Boolean) as string[];
      return (
        <div className="w-96 space-y-4">
          <p className="text-sm text-onSurface-muted">
            全 {total} 件中 {(page - 1) * perPage + 1}〜{Math.min(page * perPage, total)} 件を表示
          </p>
          <ul className="divide-y divide-border-subtle border border-border-subtle rounded-md">
            {items.map((title) => (
              <li key={title} className="px-4 py-3 text-sm text-onSurface">{title}</li>
            ))}
          </ul>
          <div className="flex justify-center">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} showEdges />
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-8">
        <Caption text="記事一覧ページ (件数 + Pagination + showEdges)">
          <ArticleList />
        </Caption>
        <Caption text="totalPages = 1 (描画されない、null 返す)">
          <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
          <p className="text-xs text-onSurface-muted mt-2">↑ 何も描画されない (1 ページしかないときに pagination は不要)</p>
        </Caption>
      </div>
    );
  },
};
