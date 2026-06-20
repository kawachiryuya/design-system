import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Modal } from './Modal';
import { Button } from '../../primitives/Button';

/**
 * Modal stories — VR 集約モデル (§5-3) + overlay 特例 (§7-10)
 *
 * 構成: Playground / Overview。
 * portal/top-layer (`<dialog>.showModal()`) は同時に 1 つしか開けないため、Overview は代表 1 枚
 * (title + Body + Footer) を `open` 固定で凍結する。size (sm/md/lg/full) / hideCloseButton /
 * closeOnEsc / footer justify 等の差は Playground (撮影外) + guideline で確認。フォーム / 長文 /
 * size=full の usage 合成、`initialFocusRef` の focus 管理は guideline (アクセシビリティ / 使用例) に記載。
 * variant / icon prop は無し。
 */
const meta: Meta<typeof Modal> = {
  title: 'Composites/Modal',
  component: Modal,
  argTypes: {
    title: { control: 'text' },
    size: { control: 'radio', options: ['sm', 'md', 'lg', 'full'] },
    hideCloseButton: { control: 'boolean' },
    closeOnEsc: { control: 'boolean' },
    closeOnOverlayClick: { control: 'boolean' },
  },
  args: {
    title: '変更を保存しますか？',
    size: 'md',
    hideCloseButton: false,
    closeOnEsc: true,
    closeOnOverlayClick: true,
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────

export const Playground: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: '基本構成: title + Modal.Body + Modal.Footer。ボタンで開く → Esc / overlay クリック / × ボタンで閉じる (ネイティブ `<dialog>` の挙動)。size / hideCloseButton / closeOnEsc / footer justify はここで切り替えて確認。',
      },
    },
  },
  render: (args) => {
    function Demo() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>モーダルを開く</Button>
          <Modal {...args} open={open} onClose={() => setOpen(false)}>
            <Modal.Body>未保存の編集内容があります。閉じる前に保存しますか？</Modal.Body>
            <Modal.Footer>
              <Button variant="tertiary" onClick={() => setOpen(false)}>破棄</Button>
              <Button variant="primary" onClick={() => setOpen(false)}>保存</Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    }
    return <Demo />;
  },
};

// ── 2. Overview (視覚回帰対象) — open 固定の代表 1 枚 ────────────
// top-layer は 1 つだけなので代表 1 枚を撮る。size/state 差は Playground + guideline。

export const Overview: Story = {
  parameters: {
    docs: {
      description: {
        story: '視覚回帰用の開状態。title + Modal.Body + Modal.Footer (tertiary / primary) の標準モーダルを `open` 固定で凍結する。',
      },
    },
  },
  render: () => (
    <Modal open onClose={() => {}} title="変更を保存しますか？">
      <Modal.Body>未保存の編集内容があります。閉じる前に保存しますか？</Modal.Body>
      <Modal.Footer>
        <Button variant="tertiary">破棄</Button>
        <Button variant="primary">保存</Button>
      </Modal.Footer>
    </Modal>
  ),
};
