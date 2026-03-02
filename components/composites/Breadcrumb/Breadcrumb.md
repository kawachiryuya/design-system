# Breadcrumb

**分類**: Composite

リンクをセパレーターで連結し、現在位置を示すパンくずリスト。

---

## Props

### BreadcrumbProps

| Prop | Type | Default | 説明 |
|------|------|---------|------|
| `items` | `BreadcrumbItem[]` | **必須** | パンくずの項目リスト |
| `separator` | `'slash' \| 'chevron' \| 'dot'` | `'chevron'` | セパレーターの種類 |
| `ariaLabel` | `string` | `'パンくずリスト'` | nav 要素の aria-label |
| `className` | `string` | `''` | 追加CSSクラス |

### BreadcrumbItem

| Prop | Type | 説明 |
|------|------|------|
| `label` | `string` | 表示ラベル |
| `href` | `string?` | リンクURL（省略すると現在ページ） |

---

## 使用例

### 基本

```tsx
import { Breadcrumb } from '@/components/Breadcrumb';

<Breadcrumb items={[
  { label: 'ホーム', href: '/' },
  { label: 'ブログ', href: '/blog' },
  { label: 'デザインシステムとは' },
]} />
```

### セパレーター

```tsx
<Breadcrumb separator="slash" items={[...]} />
<Breadcrumb separator="chevron" items={[...]} />
<Breadcrumb separator="dot" items={[...]} />
```

---

## デザイン原則

### ナビゲーション

- 階層が深いページでのみ使用する（2階層以下では不要）
- 最後の項目は現在ページとして非リンク表示される
- ラベルは簡潔にし、長い場合は `truncate`（max-width: 200px）で省略

参照: [principles/patterns/navigation.md](../../principles/patterns/navigation.md)

---

## アクセシビリティ

### ARIA

- `<nav aria-label="パンくずリスト">` でランドマーク化
- 現在ページに `aria-current="page"` を付与
- セパレーターに `aria-hidden="true"` を付与（読み上げをスキップ）

### キーボード操作

- `Tab`: リンク間のフォーカス移動
- `Enter`: リンクの遷移

参照: [principles/foundation/accessibility/keyboard-navigation.md](../../principles/foundation/accessibility/keyboard-navigation.md)

---

## 実装詳細

### 使用トークン

| トークン | 使用箇所 |
|---------|---------|
| `colors.neutral` | テキスト・セパレーター色 |
| `colors.primary` | ホバー時のリンク色 |
| `animation.duration.DEFAULT` | transition（色変化） |

### Tailwind クラス

```
nav: flex flex-wrap items-center gap-1
リンク: text-sm text-neutral-700 hover:text-primary-600
現在ページ: text-sm text-neutral-500 aria-current="page"
```

---

## バージョン履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|----------|
| 2026-02-19 | 1.0.0 | 初版作成 |
