import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const prefectures = [
  { value: 'tokyo', label: '東京都' },
  { value: 'osaka', label: '大阪府' },
  { value: 'aichi', label: '愛知県' },
  { value: 'fukuoka', label: '福岡県' },
  { value: 'hokkaido', label: '北海道' },
];

const meta: Meta<typeof Select> = {
  title: 'Atoms/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['small', 'medium', 'large'] },
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

export const Default: Story = {};

export const Required: Story = {
  args: { required: true },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      <Select size="small" label="Small" placeholder="選択...">
        {prefectures.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
      </Select>
      <Select size="medium" label="Medium（デフォルト）" placeholder="選択...">
        {prefectures.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
      </Select>
      <Select size="large" label="Large" placeholder="選択...">
        {prefectures.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
      </Select>
    </div>
  ),
};

export const WithHelpText: Story = {
  args: { helpText: '現在お住まいの都道府県を選択してください', required: true },
};

export const ErrorState: Story = {
  args: { error: true, errorMessage: '都道府県を選択してください', required: true },
};

export const Disabled: Story = {
  args: { disabled: true, label: '国（変更不可）', placeholder: '日本' },
};

export const FullWidth: Story = {
  args: { fullWidth: true },
  decorators: [(Story) => <div className="w-96"><Story /></div>],
};

export const AddressForm: Story = {
  name: '実践例: 住所フォームの一部',
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Select label="都道府県" required placeholder="都道府県を選択" fullWidth>
        {prefectures.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
      </Select>
      <Select label="配送希望時間" placeholder="指定なし" fullWidth>
        {['午前中', '14〜16時', '16〜18時', '18〜20時', '20〜21時'].map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </Select>
    </div>
  ),
};
