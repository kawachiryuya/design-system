import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Modal } from './Modal';
import { Button } from '../../primitives/Button';
import { Input } from '../../primitives/Input';
import { Label } from '../../primitives/Label';
import { Caption } from '@sb-blocks/Caption';

/**
 * Modal stories — 標準ストーリー構造に準拠
 *
 * 順序固定: Playground → Sizes → States → EdgeCases
 *
 * Modal は variant / icon prop を持たないため Variants / WithIcon は省略 (§5-3)。
 * 開閉に state が必要なので render 関数内でローカル state を作る。
 */
const meta: Meta<typeof Modal> = {
  title: 'Composites/Modal',
  component: Modal,
};

export default meta;
type Story = StoryObj<typeof Modal>;

// ── 1. Playground ──────────────────────────────────────────────

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story: '基本構成: title + Modal.Body + Modal.Footer。ボタンで開く → Esc / overlay クリック / × ボタンで閉じる (ネイティブ `<dialog>` の挙動)。',
      },
    },
  },
  render: () => {
    function Demo() {
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
    }
    return <Demo />;
  },
};

// ── 2. Sizes ───────────────────────────────────────────────────

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'sm (24rem、確認ダイアログ) / md (32rem、標準) / lg (42rem、フォーム) / full (90vw、大コンテンツ) の 4 段階。各ボタンで開いて比較。',
      },
    },
  },
  render: () => {
    function Demo() {
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
    }
    return <Demo />;
  },
};

// ── 3. States ──────────────────────────────────────────────────

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: 'ヘッダ非表示 (hideCloseButton + 独自タイトル) / Esc/overlay 閉じ無効化 (誤操作防止) / footer justify=between (左右配置) の構成パターン。',
      },
    },
  },
  render: () => {
    function NoHeaderDemo() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>ヘッダ非表示で開く</Button>
          <Modal open={open} onClose={() => setOpen(false)} hideCloseButton aria-labelledby="custom-h">
            <Modal.Body>
              <h2 id="custom-h" className="text-heading-lg mb-2">カスタムヘッダ</h2>
              <p>既定のヘッダを使わず、Body に独自構造を入れる。aria-labelledby で見出しの id を渡す。</p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => setOpen(false)}>閉じる</Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    }
    function DisableEscDemo() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>Esc/overlay 無効で開く</Button>
          <Modal
            open={open}
            onClose={() => setOpen(false)}
            title="明示的な操作のみで閉じる"
            closeOnEsc={false}
            closeOnOverlayClick={false}
          >
            <Modal.Body>破壊的操作の確認など、誤操作を防ぎたい場面で Esc / overlay を無効化できる。</Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={() => setOpen(false)}>確認</Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    }
    function JustifyBetweenDemo() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>footer justify=between で開く</Button>
          <Modal open={open} onClose={() => setOpen(false)} title="アカウントを削除しますか？">
            <Modal.Body>このアクションは取り消せません。</Modal.Body>
            <Modal.Footer justify="between">
              <Button variant="tertiary" onClick={() => setOpen(false)}>キャンセル</Button>
              <Button variant="destructive" onClick={() => setOpen(false)}>削除</Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    }
    return (
      <div className="flex flex-col gap-4">
        <Caption text="ヘッダ非表示 (hideCloseButton + 独自タイトル)"><NoHeaderDemo /></Caption>
        <Caption text="Esc / overlay 閉じ無効化 (破壊的操作の確認)"><DisableEscDemo /></Caption>
        <Caption text="footer justify=between (キャンセル左 / 確定右)"><JustifyBetweenDemo /></Caption>
      </div>
    );
  },
};

// ── 4. EdgeCases ───────────────────────────────────────────────

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: '実利用例: シンプルフォーム / 長文本文 / Layout token 適用 (size=full + 内部 grid-base でレスポンシブ多項目フォーム).',
      },
    },
  },
  render: () => {
    function FormDemo() {
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
    }
    function LongDemo() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>長文 Modal を開く</Button>
          <Modal open={open} onClose={() => setOpen(false)} title="プライバシーポリシー">
            <Modal.Body>
              {Array.from({ length: 12 }).map((_, i) => (
                <p key={i} className="mb-3 leading-relaxed">
                  {`第 ${i + 1} 条. 当社では、ユーザーから収集した個人情報を厳重に管理し、サービス品質の向上、本人確認、お問い合わせへの返信、新機能や重要なお知らせの通知のために利用します。第三者への提供は、法令に基づく場合や本人の同意を得た場合に限られます。`}
                </p>
              ))}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={() => setOpen(false)}>同意する</Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    }
    function ProfileFormDemo() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>プロフィール編集 (size=full + grid-base)</Button>
          <Modal open={open} onClose={() => setOpen(false)} title="プロフィール編集" size="full">
            <Modal.Body>
              <div className="grid-base">
                <div className="col-span-4 md:col-span-4 lg:col-span-6 flex flex-col gap-2">
                  <Label htmlFor="profile-first">姓</Label>
                  <Input id="profile-first" placeholder="山田" />
                </div>
                <div className="col-span-4 md:col-span-4 lg:col-span-6 flex flex-col gap-2">
                  <Label htmlFor="profile-last">名</Label>
                  <Input id="profile-last" placeholder="太郎" />
                </div>
                <div className="col-span-4 md:col-span-8 lg:col-span-12 flex flex-col gap-2">
                  <Label htmlFor="profile-email">メールアドレス</Label>
                  <Input id="profile-email" type="email" placeholder="taro@example.com" />
                </div>
                <div className="col-span-4 md:col-span-4 lg:col-span-4 flex flex-col gap-2">
                  <Label htmlFor="profile-zip">郵便番号</Label>
                  <Input id="profile-zip" placeholder="100-0001" />
                </div>
                <div className="col-span-4 md:col-span-4 lg:col-span-8 flex flex-col gap-2">
                  <Label htmlFor="profile-addr">住所</Label>
                  <Input id="profile-addr" placeholder="東京都千代田区..." />
                </div>
              </div>
              <p className="text-caption text-onSurface-muted mt-4">
                mobile: 4 col grid (全項目 1 行 1 項目)<br />
                tablet (≥ 768px): 8 col grid (姓/名 2 列、メール 1 列、郵便番号/住所 1:2)<br />
                desktop (≥ 1024px): 12 col grid (姓/名 1:1、メール 1 列、郵便番号/住所 1:2)
              </p>
            </Modal.Body>
            <Modal.Footer justify="between">
              <Button variant="tertiary" onClick={() => setOpen(false)}>キャンセル</Button>
              <Button variant="primary" onClick={() => setOpen(false)}>保存</Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    }
    return (
      <div className="flex flex-col gap-4">
        <Caption text="フォーム (Input + autoFocus + disabled until valid)"><FormDemo /></Caption>
        <Caption text="長文本文 (Body だけスクロール、header/footer 固定)"><LongDemo /></Caption>
        <Caption text="Layout token 適用 (size=full + 内部 grid-base でレスポンシブ多項目フォーム)"><ProfileFormDemo /></Caption>
      </div>
    );
  },
};
