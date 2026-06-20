import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { useState } from 'react';
import { Pagination } from './Pagination';
import { Caption } from '@sb-blocks/Caption';

/**
 * Pagination stories — VR 集約モデル (§5-3)
 *
 * 2 節構成: Playground / Overview。
 * first/last/few/many(ellipsis)/showEdges の構造バリエーションを Overview に集約。
 * 記事一覧ページ等の usage 合成は guideline の「使用例」へ移設。
 * totalPages=1 は何も描画しない (VR 対象外、guideline に注記)。
 * variant / size prop は無し。
 */
const meta: Meta<typeof Pagination> = {
  title: 'Composites/Pagination',
  component: Pagination,
  argTypes: {
    currentPage: { control: { type: 'number', min: 1 } },
    totalPages: { control: { type: 'number', min: 1 } },
    maxVisible: { control: { type: 'number', min: 3, max: 11 } },
    showEdges: { control: 'boolean' },
  },
  args: { currentPage: 5, totalPages: 20, maxVisible: 7 },
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

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────

export const Playground: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls から currentPage / totalPages / maxVisible / showEdges を切替。前/次ボタン click で aria-current が移動することを play test で保証。',
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

// ── 2. Overview (視覚回帰対象) ──────────────────────────────────
// 構造バリエーション: 端の disabled / ellipsis の有無 / showEdges。
// currentPage は controlled なので静的値 + no-op onPageChange で凍結。

export const Overview: Story = {
  parameters: {
    docs: {
      description: {
        story: '視覚回帰用の総覧。first (前 disabled) / last (次 disabled) / few (ellipsis なし) / many (ellipsis 表示) / showEdges (« » 付き) の構造バリエーションを集約。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <Caption text="First page (1/20、前ボタン disabled)">
        <Pagination currentPage={1} totalPages={20} onPageChange={() => {}} />
      </Caption>
      <Caption text="Last page (20/20、次ボタン disabled)">
        <Pagination currentPage={20} totalPages={20} onPageChange={() => {}} />
      </Caption>
      <Caption text="Few pages (totalPages <= maxVisible、ellipsis なし)">
        <Pagination currentPage={2} totalPages={4} onPageChange={() => {}} />
      </Caption>
      <Caption text="Many pages (ellipsis 表示)">
        <Pagination currentPage={50} totalPages={100} onPageChange={() => {}} />
      </Caption>
      <Caption text="showEdges (« » の最初/最後ジャンプ)">
        <Pagination currentPage={5} totalPages={50} onPageChange={() => {}} showEdges />
      </Caption>
    </div>
  ),
};
