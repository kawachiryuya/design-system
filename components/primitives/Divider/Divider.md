# Divider コンポーネント

**Atomic Design**: Atom  
**カテゴリ**: レイアウト

---

## 概要

コンテンツエリアを視覚的に区切るための区切り線コンポーネント。水平・垂直の両方向に対応し、中央ラベルの挿入も可能。

---

## Props

| Prop | 型 | デフォルト | 説明 |
|------|----|-----------|------|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | 向き |
| `label` | `string` | — | 中央に表示するテキスト（horizontal のみ） |
| `color` | `'neutral' \| 'primary'` | `'neutral'` | 線の色 |
| `weight` | `'thin' \| 'normal'` | `'thin'` | 線の太さ |

---

## 使用例

```tsx
// 基本的な水平区切り
<Divider />

// ラベルつき（「または」区切り）
<Divider label="または" />

// 垂直区切り（flexコンテナ内で使用）
<div className="flex items-center h-8">
  <span>左</span>
  <Divider orientation="vertical" />
  <span>右</span>
</div>

// プライマリカラー
<Divider color="primary" />
```

---

## アクセシビリティ

- `role="separator"` を付与
- `orientation="vertical"` 時は `aria-orientation="vertical"` を付与
- `label` あり時は `aria-label` でラベル内容をスクリーンリーダーに伝達
- `<hr>` は HTML のセマンティクスでも区切り要素として認識される

---

## 注意

- 垂直区切りは `flex` コンテナ内で `self-stretch` が効く必要がある
- デコレーション目的のみであれば `aria-hidden="true"` を className で隠す実装も検討
