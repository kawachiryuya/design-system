# Spinner

**Atomic Design**: Atom

処理中を示すローディングインジケーター。処理時間が1秒以上かかる場合に表示する。

---

## Props

| Prop | Type | Default | 説明 |
|------|------|---------|------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | スピナーのサイズ |
| `color` | `'primary' \| 'neutral' \| 'white'` | `'primary'` | 色 |
| `label` | `string` | `'読み込み中'` | スクリーンリーダー用ラベル |

---

## サイズ一覧

| size | px | 用途 |
|------|----|------|
| `xs` | 12px | インラインテキストと同行 |
| `sm` | 16px | ボタン内・インライン |
| `md` | 24px | コンポーネント内標準 **デフォルト** |
| `lg` | 32px | コンポーネント中央に表示 |
| `xl` | 48px | 全画面オーバーレイ |

---

## 使用例

### 基本

```tsx
import { Spinner } from '@/components/Spinner';

<Spinner />
```

### ボタン内（インライン）

```tsx
<button disabled aria-busy="true">
  <Spinner size="sm" color="white" label="送信中" />
  送信中...
</button>
```

### コンポーネント中央

```tsx
<div className="flex items-center justify-center py-8">
  <Spinner size="lg" label="データを読み込んでいます" />
</div>
```

### 全画面オーバーレイ

```tsx
{isLoading && (
  <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
    <Spinner size="xl" color="white" label="処理中です。しばらくお待ちください" />
  </div>
)}
```

### カードのローディング

```tsx
<div className="relative p-6 bg-white rounded-lg shadow">
  {isLoading ? (
    <div className="flex items-center justify-center py-12">
      <Spinner size="md" />
    </div>
  ) : (
    <CardContent />
  )}
</div>
```

---

## デザイン原則

### 表示タイミング

| 待機時間 | 対応 |
|---------|------|
| 〜100ms | 表示不要 |
| 100ms〜1秒 | 任意（短時間スピナー） |
| **1〜10秒** | **必須** |
| 10秒以上 | 必須 + 進捗表示（可能なら） |

参照: [principles/interaction/feedback/loading-indicators.md](../../principles/interaction/feedback/loading-indicators.md)

### ローディング中の操作制御
- 同じアクションのボタンは `disabled` にする
- キャンセルボタンは `disabled` にしない
- `aria-busy="true"` を親要素に設定する

---

## アクセシビリティ

- `role="status"` + `aria-label` でスクリーンリーダーに通知
- SVG自体は `aria-hidden="true"` + `focusable="false"`
- 非表示テキスト（`.sr-only`）でラベルを補完
- `aria-live="polite"` で動的変化を通知

---

## バージョン履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|----------|
| 2026-02-21 | 1.0.0 | 初版作成 |
