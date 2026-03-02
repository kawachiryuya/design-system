import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Composites/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {
    currentPage: { control: { type: 'number', min: 1 } },
    totalPages: { control: { type: 'number', min: 1 } },
    maxVisible: { control: { type: 'number', min: 3, max: 11 } },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    showEdges: { control: 'boolean' },
  },
  args: { currentPage: 5, totalPages: 20, size: 'md', maxVisible: 7 },
  render: (args) => {
    const [page, setPage] = useState(args.currentPage);
    return <Pagination {...args} currentPage={page} onPageChange={setPage} />;
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 初期状態：5ページ目
    await expect(canvas.getByLabelText('5ページ目')).toHaveAttribute('aria-current', 'page');

    // 次のページボタンで6ページ目へ
    await userEvent.click(canvas.getByLabelText('次のページ'));
    await expect(canvas.getByLabelText('6ページ目')).toHaveAttribute('aria-current', 'page');

    // 前のページボタンで5ページ目へ戻る
    await userEvent.click(canvas.getByLabelText('前のページ'));
    await expect(canvas.getByLabelText('5ページ目')).toHaveAttribute('aria-current', 'page');
  },
};

export const WithEdges: Story = {
  args: { showEdges: true },
};

export const AllSizes: Story = {
  render: () => {
    const [p1, setP1] = useState(3);
    const [p2, setP2] = useState(3);
    const [p3, setP3] = useState(3);
    return (
      <div className="flex flex-col gap-4">
        <Pagination size="sm" currentPage={p1} totalPages={10} onPageChange={setP1} />
        <Pagination size="md" currentPage={p2} totalPages={10} onPageChange={setP2} />
        <Pagination size="lg" currentPage={p3} totalPages={10} onPageChange={setP3} />
      </div>
    );
  },
};

export const FewPages: Story = {
  args: { currentPage: 2, totalPages: 4 },
};

export const ManyPages: Story = {
  args: { currentPage: 50, totalPages: 100 },
};

export const FirstPage: Story = {
  args: { currentPage: 1, totalPages: 20 },
};

export const LastPage: Story = {
  args: { currentPage: 20, totalPages: 20 },
};

export const ArticleListExample: Story = {
  name: '実践例: 記事一覧ページ',
  render: () => {
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
        <p className="text-sm text-neutral-500">
          全 {total} 件中 {(page - 1) * perPage + 1}〜{Math.min(page * perPage, total)} 件を表示
        </p>
        <ul className="divide-y divide-neutral-100 border border-neutral-200 rounded-lg">
          {items.map((title) => (
            <li key={title} className="px-4 py-3 text-sm text-neutral-700">{title}</li>
          ))}
        </ul>
        <div className="flex justify-center">
          <Pagination currentPage={page} totalPages={totalPages}
            onPageChange={setPage} showEdges />
        </div>
      </div>
    );
  },
};
