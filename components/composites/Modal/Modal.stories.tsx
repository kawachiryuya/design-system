import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Modal } from './Modal';
import { Button } from '../../primitives/Button';
import { Input } from '../../primitives/Input';
import { Label } from '../../primitives/Label';

const meta: Meta<typeof Modal> = {
  title: 'Composites/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'ネイティブ `<dialog>` 要素ベースの Modal。focus trap / Esc キーでの close / ::backdrop オーバーレイは'
          + ' ブラウザ標準に委ねる。compound component (`Modal.Body` / `Modal.Footer`) で構成する。',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>モーダルを開く</Button>
        <Modal open={open} onClose={() => setOpen(false)} title="変更を保存しますか？">
          <Modal.Body>未保存の編集内容があります。閉じる前に保存しますか？</Modal.Body>
          <Modal.Footer>
            <Button variant="tertiary" onClick={() => setOpen(false)}>破棄</Button>
            <Button variant="primary" onClick={() => setOpen(false)}>保存</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
};

export const Sizes: Story = {
  name: 'サイズ別',
  render: () => {
    const [size, setSize] = React.useState<null | 'sm' | 'md' | 'lg' | 'full'>(null);
    return (
      <div className="flex gap-2">
        <Button onClick={() => setSize('sm')}>sm</Button>
        <Button onClick={() => setSize('md')}>md</Button>
        <Button onClick={() => setSize('lg')}>lg</Button>
        <Button onClick={() => setSize('full')}>full</Button>
        <Modal open={size !== null} onClose={() => setSize(null)} title={`size = ${size}`} size={size ?? 'md'}>
          <Modal.Body>
            <p>Modal の幅は size prop で決まる。</p>
            <p className="mt-2 text-onSurface-muted">中身が長くなれば本文だけスクロールし、ヘッダ・フッタは固定。</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setSize(null)}>閉じる</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  },
};

export const FormInside: Story = {
  name: '実践例: フォーム',
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [email, setEmail] = React.useState('');
    return (
      <>
        <Button onClick={() => setOpen(true)}>招待を送る</Button>
        <Modal open={open} onClose={() => setOpen(false)} title="メンバーを招待" size="md">
          <Modal.Body>
            <div className="flex flex-col gap-2">
              <Label htmlFor="invite-email">メールアドレス</Label>
              <Input
                id="invite-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="member@example.com"
                autoFocus
              />
            </div>
          </Modal.Body>
          <Modal.Footer justify="between">
            <Button variant="tertiary" onClick={() => setOpen(false)}>キャンセル</Button>
            <Button variant="primary" onClick={() => { setOpen(false); setEmail(''); }} disabled={!email}>
              招待を送信
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
};

export const NoTitleNoCloseButton: Story = {
  name: 'ヘッダ非表示 (完全カスタム本文)',
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>開く</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          hideCloseButton
          aria-labelledby="custom-h"
        >
          <Modal.Body>
            <h2 id="custom-h" className="text-heading-lg font-bold mb-2">カスタムヘッダ</h2>
            <p>
              既定のヘッダを使わず、Body に独自構造を入れることもできる。
              アクセシビリティのため `aria-labelledby` で見出しの id を渡す。
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setOpen(false)}>閉じる</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
};

export const DisableEscAndOverlay: Story = {
  name: 'Esc/overlay クリックで閉じない',
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>開く</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="明示的な操作のみで閉じる"
          closeOnEsc={false}
          closeOnOverlayClick={false}
        >
          <Modal.Body>
            破壊的操作の確認など、誤操作を防ぎたい場面で Esc / overlay を無効化できる。
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setOpen(false)}>確認</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
};
