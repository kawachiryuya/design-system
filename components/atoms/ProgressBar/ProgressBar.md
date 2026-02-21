# ProgressBar コンポーネント

**Atomic Design**: Atom  
**カテゴリ**: フィードバック / ローディング

---

## 概要

処理の進捗状況を視覚的に伝えるリニアプログレスインジケーター。確定的な進捗（0〜100%）と不確定な処理中（indeterminate）の両方に対応。

---

## Props

| Prop | 型 | デフォルト | 説明 |
|------|----|-----------|------|
| `value` | `number` | 必須 | 現在値（0〜max） |
| `max` | `number` | `100` | 最大値 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | バーの太さ |
| `color` | `'primary' \| 'success' \| 'error' \| 'warning'` | `'primary'` | カラーバリアント |
| `label` | `string` | — | ラベルテキスト（+ スクリーンリーダー用） |
| `showValue` | `boolean` | `false` | パーセント数値を右端に表示 |
| `indeterminate` | `boolean` | `false` | 不確定プログレス（処理時間不明） |

---

## 使用例

```tsx
// 基本
<ProgressBar value={60} />

// ラベルと数値表示
<ProgressBar value={45} label="アップロード中" showValue />

// カラーの使い分け
<ProgressBar value={100} color="success" label="完了" />
<ProgressBar value={30} color="error" label="失敗" />

// 不確定プログレス
<ProgressBar indeterminate label="処理中..." />

// ステップインジケーターへの応用
<ProgressBar value={50} size="sm" />  {/* ステップ2/4 */}
```

---

## ARIA 対応

- `role="progressbar"` を付与
- 確定時: `aria-valuenow` / `aria-valuemin` / `aria-valuemax`
- 不確定時: `aria-busy="true"`、`aria-valuenow` は省略
- `label` prop が `aria-label` に反映される

---

## カラーの意味

| color | 意味 |
|-------|------|
| `primary` | 通常の処理・アップロード |
| `success` | 完了・成功 |
| `error` | 失敗・エラー |
| `warning` | 注意が必要な状態（ストレージ逼迫など） |

参照: `principles/color/semantic-colors.md`
