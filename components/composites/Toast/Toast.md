# Toast コンポーネント

**Atomic Design**: Molecule
**カテゴリ**: フィードバック (一時通知)

---

## 概要

短時間表示されて自動消滅する通知。Alert (インライン・定常) との棲み分け:
- **Alert**: コンテンツ領域内に置かれ、ユーザの操作前から存在する文脈付きメッセージ
- **Toast**: 操作結果・状態変化を画面端から一時的に通知する非モーダル UI

API は 2 系統提供:

1. **`<Toast />` 単発 controlled**: `open` / `onClose` を親で管理。`duration` で自動消滅。
2. **`<ToastProvider />` + `useToast()`**: 複数 Toast のスタック管理・自動消滅・id ベース dismiss を一括で提供。

---

## API

### Toast (単発)

| Prop | 型 | デフォルト | 説明 |
|---|---|---|---|
| `open` | `boolean` | — | 表示状態 (必須) |
| `onClose` | `() => void` | — | 閉じる要求で呼ばれる (必須) |
| `variant` | `'success' \| 'error' \| 'warning' \| 'info' \| 'neutral'` | `'info'` | セマンティックカラー |
| `title` | `React.ReactNode` | — | タイトル (省略可) |
| `description` | `React.ReactNode` | — | 本文 (必須) |
| `duration` | `number` | `5000` | 自動消滅 ms。`0` で無期限 |
| `position` | `'top' \| 'top-right' \| 'bottom' \| 'bottom-right'` | `'bottom-right'` | 表示位置 |
| `action` | `{ label: string; onClick: () => void }` | — | 「元に戻す」等のアクションボタン |

### ToastProvider

| Prop | 型 | デフォルト | 説明 |
|---|---|---|---|
| `position` | `ToastPosition` | `'bottom-right'` | 表示位置 (Provider 配下の全 Toast に適用) |
| `defaultDuration` | `number` | `5000` | 個別 Toast の `duration` 省略時の値 |
| `maxToasts` | `number` | `5` | 同時表示の上限。超過時は古いものから削除 |

### useToast() の返り値

| Method | Signature | 説明 |
|---|---|---|
| `showToast` | `(content & { duration? }) => string` | 表示。返り値の id で個別 dismiss 可能 |
| `dismissToast` | `(id: string) => void` | 指定 id を即閉じる |

---

## 使用例

```tsx
// 単発
const [open, setOpen] = useState(false);
<Toast
  open={open}
  onClose={() => setOpen(false)}
  variant="success"
  description="保存しました"
/>

// 複数管理
<ToastProvider position="top-right" defaultDuration={4000}>
  <App />
</ToastProvider>

// 子コンポーネント
const { showToast, dismissToast } = useToast();

// シンプル
showToast({ variant: 'success', description: '保存しました' });

// アクション + 自動消滅なし
const id = showToast({
  title: 'タスクをアーカイブしました',
  description: '元に戻すこともできます',
  duration: 0,
  action: { label: '元に戻す', onClick: () => { undo(); dismissToast(id); } },
});
```

---

## アクセシビリティ

- `error` variant のみ `role="alert"` + `aria-live="assertive"` で割り込み通知
- それ以外は `role="status"` + `aria-live="polite"` (進行中タスクを邪魔しない)
- `aria-atomic="true"` で全文再読み上げ
- close ボタンは icon-only に `VisuallyHidden` で「閉じる」テキストを併記
- 自動消滅は SR ユーザに不利になり得るため、重要メッセージは `duration={0}` を検討

---

## 関連原則

- [`principles/Interaction/feedback/toast-notifications.mdx`](../../../principles/Interaction/feedback/toast-notifications.mdx)
- Alert との使い分けは同ファイルの「Alert vs Toast」節を参照
