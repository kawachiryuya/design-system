# Skeleton コンポーネント

**Atomic Design**: Atom  
**カテゴリ**: フィードバック / ローディング

---

## 概要

コンテンツの読み込み中に表示するプレースホルダーコンポーネント。実際のコンテンツのレイアウトを模倣することでレイアウトシフトを防ぎ、ユーザーの知覚的な待ち時間を短縮する。

---

## Props

| Prop | 型 | デフォルト | 説明 |
|------|----|-----------|------|
| `variant` | `'text' \| 'circular' \| 'rectangular' \| 'rounded'` | `'text'` | 形状 |
| `width` | `string \| number` | variant に応じた自動値 | 幅（数値は px 換算） |
| `height` | `string \| number` | variant に応じた自動値 | 高さ |
| `lines` | `number` | `1` | variant="text" 時の行数 |
| `animated` | `boolean` | `true` | pulse アニメーション |

---

## Variant の使い分け

| variant | 用途 |
|---------|------|
| `text` | テキスト行（`lines` で複数行） |
| `circular` | アバター・アイコン |
| `rectangular` | 画像・バナー（角丸なし） |
| `rounded` | カード・ボタン（角丸あり） |

---

## 使用例

```tsx
// テキスト3行
<Skeleton variant="text" lines={3} />

// アバタープレースホルダー
<Skeleton variant="circular" width={40} height={40} />

// 画像プレースホルダー
<Skeleton variant="rectangular" height={200} />

// カードスケルトン
<div className="p-4 space-y-3">
  <Skeleton variant="rectangular" height={160} />
  <div className="flex gap-3">
    <Skeleton variant="circular" width={36} height={36} />
    <Skeleton variant="text" lines={2} />
  </div>
</div>
```

---

## アクセシビリティ

- `role="status"` + `aria-busy="true"` + `aria-label="読み込み中"` で読み込み中であることをスクリーンリーダーに伝達
- コンテンツが読み込まれたら Skeleton をアンマウントし、実コンテンツに置き換える

---

## ローディング表示の選択基準

| 状況 | 推奨 |
|------|------|
| レイアウトが事前にわかる | Skeleton |
| 全画面・複数セクション | Skeleton + Spinner の組み合わせ |
| インラインの短い処理 | Spinner のみ |

参照: `principles/interaction/feedback/loading-indicators.md`
