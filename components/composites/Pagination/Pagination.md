# Pagination

**分類**: Composite

ページ番号ナビゲーション。省略記号による折りたたみと、最初・最後ページへのジャンプに対応。

---

## Props

| Prop | Type | Default | 説明 |
|------|------|---------|------|
| `currentPage` | `number` | **必須** | 現在のページ番号（1始まり） |
| `totalPages` | `number` | **必須** | 総ページ数 |
| `onPageChange` | `(page: number) => void` | **必須** | ページ変更コールバック |
| `maxVisible` | `number` | `7` | 表示するページボタンの最大数 |
| `showEdges` | `boolean` | `false` | 最初・最後のページボタンを表示する |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | サイズ |
| `className` | `string` | `''` | 追加CSSクラス |

---

## 使用例

### 基本

```tsx
import { Pagination } from '@/components/Pagination';

const [page, setPage] = useState(1);

<Pagination
  currentPage={page}
  totalPages={20}
  onPageChange={setPage}
/>
```

### 最初・最後ボタン付き

```tsx
<Pagination
  currentPage={page}
  totalPages={100}
  onPageChange={setPage}
  showEdges
/>
```

### サイズ

```tsx
<Pagination size="sm" currentPage={1} totalPages={10} onPageChange={setPage} />
<Pagination size="md" currentPage={1} totalPages={10} onPageChange={setPage} />
<Pagination size="lg" currentPage={1} totalPages={10} onPageChange={setPage} />
```

---

## デザイン原則

### ページ番号の省略

- `maxVisible` を超える場合、省略記号（…）で折りたたむ
- 現在ページの前後に常に隣接ページを表示する
- 最初と最後のページは常に表示される

### 使いどころ

- テーブルやリストのページ分割
- 記事一覧・検索結果など大量データの分割表示

参照: [principles/patterns/navigation.md](../../principles/patterns/navigation.md)

---

## アクセシビリティ

### ARIA

- `<nav aria-label="ページネーション">` でランドマーク化
- 各ページボタンに `aria-label="Nページ目"` を付与
- 現在ページに `aria-current="page"` を付与
- 前後ボタンに `aria-label="前のページ"` / `aria-label="次のページ"` を付与
- 無効なボタン（最初のページで「前へ」等）は `disabled` 属性で制御

### キーボード操作

- `Tab`: ボタン間のフォーカス移動
- `Enter` / `Space`: ページ選択

参照: [principles/foundation/accessibility/keyboard-navigation.md](../../principles/foundation/accessibility/keyboard-navigation.md)

---

## 実装詳細

### 使用トークン

| トークン | 使用箇所 |
|---------|---------|
| `colors.primary` | アクティブページのボタン背景 |
| `colors.neutral` | 非アクティブページ・省略記号 |
| `radius.DEFAULT` | rounded |
| `animation.duration.fast` | transition-colors（150ms） |

### Tailwind クラス

```
nav: flex items-center gap-1
ページボタン: inline-flex items-center justify-center rounded font-medium
アクティブ: bg-primary-600 text-white
非アクティブ: text-neutral-700 hover:bg-neutral-100
無効: text-neutral-300 cursor-not-allowed
```

---

## バージョン履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|----------|
| 2026-02-19 | 1.0.0 | 初版作成 |
