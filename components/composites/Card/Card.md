# Card

**分類**: Composite

見出し・コンテンツ・フッターを持つ汎用コンテナ。Header / Body / Footer のスロットで構成する。

---

## Props

### CardProps

| Prop | Type | Default | 説明 |
|------|------|---------|------|
| `variant` | `'elevated' \| 'outlined' \| 'flat'` | `'outlined'` | 外観バリアント |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'none'` | パディング |
| `clickable` | `boolean` | `false` | クリック可能（ホバー・フォーカス状態を付与） |
| `onClick` | `React.MouseEventHandler` | - | onClick ハンドラー |
| `className` | `string` | `''` | 追加CSSクラス |
| `children` | `React.ReactNode` | **必須** | カードの内容 |

### Card.Header / Card.Body / Card.Footer

| Prop | Type | Default | 説明 |
|------|------|---------|------|
| `className` | `string` | `''` | 追加CSSクラス |
| `children` | `React.ReactNode` | **必須** | スロットの内容 |
| `justify` | `'start' \| 'end' \| 'between'` | `'end'` | Footer のみ。アクションの配置 |

---

## 使用例

### 基本

```tsx
import { Card } from '@/components/Card';

<Card variant="outlined">
  <Card.Header>タイトル</Card.Header>
  <Card.Body>本文コンテンツ</Card.Body>
  <Card.Footer justify="end">
    <Button>保存</Button>
  </Card.Footer>
</Card>
```

### バリアント

```tsx
// 影付き（elevated）
<Card variant="elevated">...</Card>

// ボーダー（outlined）
<Card variant="outlined">...</Card>

// フラット（flat）
<Card variant="flat">...</Card>
```

### クリック可能なカード

```tsx
<Card clickable onClick={() => navigate('/detail')}>
  <Card.Body>クリックで詳細へ</Card.Body>
</Card>
```

---

## デザイン原則

### バリアントの使い分け

- **elevated**: 重要度が高い情報、ダッシュボードのウィジェット
- **outlined**: 一般的な情報のグルーピング（デフォルト）
- **flat**: 背景と同化させたい控えめなグルーピング

### スロット構成

- Header / Body / Footer はすべて任意。必要なスロットのみ使用する
- Footer にはアクションボタンを配置し、`justify` で揃え方を制御する

参照: [principles/patterns/data-display.md](../../principles/patterns/data-display.md)

---

## アクセシビリティ

### インタラクティブなカード

- `clickable` または `onClick` が指定された場合、`role="button"` と `tabIndex={0}` を付与
- `Enter` / `Space` キーでクリック操作が可能
- `focus-visible:ring-2` でフォーカスインジケーターを表示

### キーボード操作

- `Tab`: カード内のインタラクティブ要素間でフォーカス移動
- `Enter` / `Space`: クリック可能なカードの操作

参照: [principles/foundation/accessibility/keyboard-navigation.md](../../principles/foundation/accessibility/keyboard-navigation.md)

---

## 実装詳細

### 使用トークン

| トークン | 使用箇所 |
|---------|---------|
| `shadows.md` | elevated バリアント |
| `colors.neutral` | ボーダー・背景色 |
| `colors.primary` | フォーカスリング |
| `radius.lg` | rounded-lg |
| `animation.duration.DEFAULT` | hover 時の shadow transition |

### Tailwind クラス

```
基本: overflow-hidden rounded-lg
elevated: bg-white shadow-md
outlined: bg-white border border-neutral-200
flat: bg-neutral-50
Header: px-4 py-3 border-b font-medium
Body: p-4
Footer: px-4 py-3 border-t flex items-center gap-2
```

---

## バージョン履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|----------|
| 2026-02-19 | 1.0.0 | 初版作成 |
