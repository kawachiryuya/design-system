import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { Accordion, type AccordionItem } from './Accordion';
import { Caption } from '@sb-blocks/Caption';

/**
 * Accordion stories — 標準ストーリー構造に準拠
 *
 * 順序固定: Playground → Variants (type) → States → EdgeCases
 *
 * Accordion は size / icon prop を持たないため Sizes / WithIcon は省略 (§5-3)。
 */
const sampleFaq: AccordionItem[] = [
  { id: 'q1', title: '予約のキャンセルはいつまで可能ですか？', content: '出発時刻の 1 時間前までキャンセル可能です。' },
  { id: 'q2', title: '会員登録は無料ですか？', content: 'はい、完全に無料でご利用いただけます。' },
  { id: 'q3', title: '予約確認メールが届きません', content: '迷惑メールフォルダをご確認ください。' },
];

const meta: Meta<typeof Accordion> = {
  title: 'Composites/Accordion',
  component: Accordion,
  argTypes: {
    type: { control: 'radio', options: ['single', 'multiple'] },
  },
  args: {
    type: 'single',
    items: sampleFaq,
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

// ── 1. Playground ──────────────────────────────────────────────

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Controls から type を切替。最初の trigger を click → 展開を play test で検証。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstTrigger = canvas.getByRole('button', { name: /予約のキャンセル/ });
    await expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(firstTrigger);
    await expect(firstTrigger).toHaveAttribute('aria-expanded', 'true');
  },
};

// ── 2. Variants (type) ─────────────────────────────────────────

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: '`type="single"` (1 つだけ開く、FAQ 等) と `type="multiple"` (複数同時開く、設定セクション等) の比較。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <Caption text='type="single" (FAQ 等、1 つだけ開く)'>
        <Accordion items={sampleFaq} defaultOpenIds={['q1']} />
      </Caption>
      <Caption text='type="multiple" (設定セクション等、複数同時)'>
        <Accordion items={sampleFaq} type="multiple" defaultOpenIds={['q1', 'q2']} />
      </Caption>
    </div>
  ),
};

// ── 3. States ──────────────────────────────────────────────────

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Collapsed / Expanded / Disabled / Hover / Focus-visible の 5 状態。trigger は `aria-expanded` で状態を SR に伝達。',
      },
    },
    pseudo: {
      hover: ['#ac-hover button'],
      focusVisible: ['#ac-focus button'],
    },
  },
  render: () => (
    <div className="flex flex-col gap-5">
      <Caption text="Collapsed (default)">
        <Accordion items={[{ id: 'a', title: 'タイトル', content: '中身' }]} />
      </Caption>
      <Caption text="Expanded (defaultOpenIds)">
        <Accordion items={[{ id: 'a', title: 'タイトル', content: '中身が表示されている状態' }]} defaultOpenIds={['a']} />
      </Caption>
      <Caption text="Disabled (item.disabled)">
        <Accordion items={[
          { id: 'a', title: '通常', content: '開閉可' },
          { id: 'b', title: '無効な項目', content: 'クリック不可', disabled: true },
          { id: 'c', title: '通常', content: '開閉可' },
        ]} />
      </Caption>
      <Caption text="Trigger Hover (pseudo-states 強制)">
        <div id="ac-hover">
          <Accordion items={[{ id: 'a', title: 'Hover 中の trigger', content: '中身' }]} />
        </div>
      </Caption>
      <Caption text="Trigger Focus-visible (pseudo-states 強制)">
        <div id="ac-focus">
          <Accordion items={[{ id: 'a', title: 'Focus 中の trigger', content: '中身' }]} />
        </div>
      </Caption>
    </div>
  ),
};

// ── 4. EdgeCases ───────────────────────────────────────────────

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Controlled (URL クエリ同期想定) / 長文コンテンツ / 1 項目だけ / Layout token 適用 (FAQ page、max-w-container-narrow).',
      },
    },
  },
  render: () => {
    function ControlledDemo() {
      const [openIds, setOpenIds] = useState<string[]>(['q2']);
      return (
        <div>
          <p className="text-body-sm text-onSurface-muted mb-3">
            現在開いている: {openIds.length > 0 ? openIds.join(', ') : 'なし'}
          </p>
          <Accordion items={sampleFaq} openIds={openIds} onChange={setOpenIds} />
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-6">
        <Caption text="Controlled (外部から openIds 制御)">
          <ControlledDemo />
        </Caption>
        <Caption text="長文コンテンツ (折返し挙動の確認)">
          <Accordion
            type="multiple"
            defaultOpenIds={['long']}
            items={[
              {
                id: 'long',
                title: 'プライバシーポリシーについて教えてください',
                content: (
                  <p className="text-body-sm leading-relaxed">
                    当社では、ユーザーから収集した個人情報を厳重に管理し、サービス品質の向上、本人確認、お問い合わせへの返信、新機能や重要なお知らせの通知のために利用します。第三者への提供は、法令に基づく場合や本人の同意を得た場合に限られます。
                  </p>
                ),
              },
            ]}
          />
        </Caption>
        <Caption text="1 項目だけ (1 個でもうまく見える)">
          <Accordion items={[{ id: 'only', title: '唯一の項目', content: '中身' }]} />
        </Caption>
        <Caption text="Layout token 適用 (FAQ page、max-w-container-narrow + space-y-section-sm)">
          <div className="w-full px-container py-container max-w-container-narrow mx-auto">
            <div className="space-y-section-sm">
              <div>
                <h1 className="text-heading-lg text-onSurface">よくあるご質問</h1>
                <p className="text-body-md text-onSurface-muted mt-1">サービス利用について多く寄せられるご質問にお答えします。</p>
              </div>
              <Accordion
                type="multiple"
                items={[
                  { id: 'p1', title: '予約のキャンセルはいつまで可能ですか？', content: <p className="text-body-sm">出発時刻の 1 時間前までキャンセル可能です。それ以降はキャンセル料が発生します。</p> },
                  { id: 'p2', title: '会員登録は無料ですか？', content: <p className="text-body-sm">はい、完全に無料でご利用いただけます。クレジットカード登録も不要です。</p> },
                  { id: 'p3', title: '予約確認メールが届きません', content: <p className="text-body-sm">迷惑メールフォルダをご確認ください。それでも見つからない場合はサポートまでご連絡ください。</p> },
                  { id: 'p4', title: '支払い方法は何が使えますか？', content: <p className="text-body-sm">主要クレジットカード、デビットカード、QR コード決済、コンビニ決済に対応しています。</p> },
                ]}
              />
            </div>
          </div>
        </Caption>
      </div>
    );
  },
};
