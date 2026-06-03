# Modal コンポーネント

**Atomic Design**: Organism (a11y 観点では Block)
**カテゴリ**: オーバーレイ

---

## 概要

ネイティブ `<dialog>` 要素 (`HTMLDialogElement.showModal()` API) ベースのモーダル。
focus trap / Esc キーでの close / ::backdrop オーバーレイ / 開閉時のフォーカス管理 (開く前のフォーカス要素への復帰) は
ブラウザ標準機能に委ねるため、JS のフォーカストラップ実装を持たない。

compound component で `Modal.Body` / `Modal.Footer` を提供する。Header は `title` prop で標準パターンを描画する。

---

## Props

| Prop | 型 | デフォルト | 説明 |
|---|---|---|---|
| `open` | `boolean` | — | 開閉状態 (必須) |
| `onClose` | `() => void` | — | 閉じる要求が発生したとき呼ばれる (必須) |
| `title` | `React.ReactNode` | — | 既定ヘッダのタイトル。`aria-labelledby` 自動接続 |
| `size` | `'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` | 最大幅 |
| `closeOnEsc` | `boolean` | `true` | Esc キーで閉じるか |
| `closeOnOverlayClick` | `boolean` | `true` | 背景クリックで閉じるか |
| `hideCloseButton` | `boolean` | `false` | 既定の close ボタンを非表示にする |

その他 `React.DialogHTMLAttributes<HTMLDialogElement>` を透過 (`aria-labelledby`, `aria-describedby` 等)。

### Modal.Body Props

| Prop | 型 | デフォルト | 説明 |
|---|---|---|---|
| `className` | `string` | — | 追加クラス |

### Modal.Footer Props

| Prop | 型 | デフォルト | 説明 |
|---|---|---|---|
| `justify` | `'start' \| 'end' \| 'between'` | `'end'` | アクション配置 |
| `className` | `string` | — | 追加クラス |

---

## 使用例

```tsx
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>削除</Button>
<Modal open={open} onClose={() => setOpen(false)} title="本当に削除しますか？">
  <Modal.Body>この操作は取り消せません。</Modal.Body>
  <Modal.Footer>
    <Button variant="tertiary" onClick={() => setOpen(false)}>キャンセル</Button>
    <Button variant="primary" onClick={handleDelete}>削除する</Button>
  </Modal.Footer>
</Modal>
```

---

## アクセシビリティ

- `<dialog>` + `showModal()` がブラウザ標準の inert / focus trap / aria-modal 相当の挙動を提供
- `title` 指定時は内部生成 id を `aria-labelledby` に接続
- 既定の close ボタンは icon-only に `VisuallyHidden` で「閉じる」テキストを併記し、スクリーンリーダ用ラベルを保証
- 開く前のフォーカス要素へ閉じた時に自動で戻る (ネイティブ挙動)

### 注意

- Safari は古いバージョンで `<dialog>` 未対応。プロダクトの対象ブラウザを `principles/Platform/web/browser-support.mdx` に従って確認すること
- 入れ子モーダルはネイティブ dialog の仕様上の制約があるため非推奨

---

## 関連原則

- [`principles/Foundation/accessibility/focus-management.mdx`](../../../principles/Foundation/accessibility/focus-management.mdx)
- [`principles/Foundation/accessibility/keyboard-navigation.mdx`](../../../principles/Foundation/accessibility/keyboard-navigation.mdx)
