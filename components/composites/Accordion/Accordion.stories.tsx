import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Accordion, type AccordionItem } from './Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Composites/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'radio', options: ['single', 'multiple'] },
  },
  args: {
    type: 'single',
    items: [
      { id: 'q1', title: '予約のキャンセルはいつまで可能ですか？', content: '出発時刻の 1 時間前までキャンセル可能です。' },
      { id: 'q2', title: '会員登録は無料ですか？', content: 'はい、完全に無料でご利用いただけます。' },
      { id: 'q3', title: '予約確認メールが届きません', content: '迷惑メールフォルダをご確認ください。' },
    ] satisfies AccordionItem[],
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {};

export const DefaultOpen: Story = {
  name: '初期で 1 つ開く',
  args: {
    defaultOpenIds: ['q1'],
  },
};

export const Multiple: Story = {
  name: '複数同時開閉',
  args: {
    type: 'multiple',
    defaultOpenIds: ['q1', 'q2'],
  },
};

export const WithDisabled: Story = {
  name: '一部 disabled',
  args: {
    items: [
      { id: 'q1', title: '通常の項目', content: '開閉できます' },
      { id: 'q2', title: '無効な項目', content: '見れません', disabled: true },
      { id: 'q3', title: '通常の項目', content: '開閉できます' },
    ],
  },
};

export const Controlled: Story = {
  name: 'Controlled（URL クエリ等と同期）',
  render: (args) => {
    const [openIds, setOpenIds] = useState<string[]>(['q2']);
    return (
      <div>
        <p className="text-sm text-onSurface-muted mb-3">
          現在開いている: {openIds.length > 0 ? openIds.join(', ') : 'なし'}
        </p>
        <Accordion {...args} openIds={openIds} onChange={setOpenIds} />
      </div>
    );
  },
};
