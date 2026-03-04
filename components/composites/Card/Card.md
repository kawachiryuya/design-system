# Card

**分類**: Composite

見出し・コンテンツ・フッターを持つ汎用コンテナ。Header / Body / Footer のスロットで構成する。

---

## Props

### CardProps

| Prop | Type | Default | 説明 |
|------|------|---------|------|
| `variant` | `'elevated' \| 'outlined' \| 'filled'` | `'outlined'` | 外観バリアント |

| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'none'` | パディング |
| `clickable` | `boolean` | `false` | クリック可能（ホバー・フォーカス状態を付与） |
| `onClick` | `React.MouseEventHandler` | - | onClick ハンドラー |
| `href` | `string` | - | リンク先 URL（指定時は `<a>` でレンダリング） |
| `target` | `string` | - | リンクの target 属性 |
| `rel` | `string` | - | リンクの rel 属性（`target="_blank"` 時は自動で `noopener noreferrer`） |
| `className` | `string` | `''` | 追加CSSクラス |
| `children` | `React.ReactNode` | **必須** | カードの内容 |

### Card.Header / Card.Body / Card.Footer

| Prop | Type | Default | 説明 |
|------|------|---------|------|
| `className` | `string` | `''` | 追加CSSクラス |
| `children` | `React.ReactNode` | **必須** | スロットの内容 |
| `divider` | `boolean` | `true` | Header/Footer のみ。ボーダーの表示 |
| `justify` | `'start' \| 'end' \| 'between'` | `'end'` | Footer のみ。アクションの配置 |

---

## 使用例

### 基本

```tsx
import { Card } from '@/components/Card';

<Card variant="outlined">
  <Card.Header>タイトル</Card.Header>
  <Card.Body>本文コンテンツ</Card.Body>
  <Card.Footer>
    <Button>保存</Button>
  </Card.Footer>
</Card>
```

### ボーダー付き Header/Footer

```tsx
<Card variant="outlined">
  <Card.Header divider>タイトル</Card.Header>
  <Card.Body>コンテンツ</Card.Body>
  <Card.Footer divider justify="end">
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

// フラット（filled）
<Card variant="filled">...</Card>
```

### リンクカード

```tsx
<Card href="/detail" variant="outlined">
  <Card.Body>クリックで詳細へ</Card.Body>
</Card>

// 外部リンク（自動で rel="noopener noreferrer"）
<Card href="https://example.com" target="_blank">
  <Card.Body>外部サイトへ</Card.Body>
</Card>
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
- **filled**: 薄い背景色＋ボーダーで控えめに区切るグルーピング

### スロット構成

- Header / Body / Footer はすべて任意。必要なスロットのみ使用する
- Footer にはアクションボタンを配置し、`justify` で揃え方を制御する
- `divider` はセクション間の区切りが必要な場合のみ使用する

### href vs clickable

- **href**: ナビゲーション用途。`<a>` としてレンダリングされ、リンクセマンティクスを持つ
- **clickable + onClick**: アクション用途。`<div role="button">` としてレンダリング

参照: [principles/patterns/data-display.md](../../principles/patterns/data-display.md)

---

## アクセシビリティ

### リンクカード

- `href` が指定された場合、`<a>` でレンダリングされネイティブなリンクセマンティクスを持つ
- `target="_blank"` 時は自動で `rel="noopener noreferrer"` を付与

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
elevated: bg-surface shadow-md
outlined: bg-surface border border-border-muted
filled: bg-surface-inset border border-border-muted
Header: px-4 py-3 font-medium (divider: + border-b border-border-muted)
Body: p-4
Footer: px-4 py-3 flex items-center gap-2 (divider: + border-t border-border-muted)
```

---

## バージョン履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|----------|
| 2026-03-04 | 1.1.0 | href prop 追加、Header/Footer ボーダー任意化 |
| 2026-02-19 | 1.0.0 | 初版作成 |
