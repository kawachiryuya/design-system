# Icon

**Atomic Design**: Atom

SVGアイコンのラッパーコンポーネント。サイズ・カラー・アクセシビリティを統一的に管理する。
推奨アイコンソース: **Material Symbols Outlined**（Apache 2.0）

---

## Props

| Prop | Type | Default | 説明 |
|------|------|---------|------|
| `name` | `string` | - | レジストリからアイコンを取得（`children` と排他） |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | アイコンのサイズ |
| `color` | `'inherit' \| 'neutral' \| 'primary' \| 'success' \| 'error' \| 'warning' \| 'disabled'` | `'inherit'` | アイコンの色 |
| `label` | `string` | - | アクセシブルなラベル（省略時は装飾扱いで aria-hidden） |
| `variant` | `'fill' \| 'stroke'` | - | レンダリングモード。`name` 指定時はレジストリから自動判定 |
| `children` | `React.ReactNode` | - | カスタム SVG のパス要素（`name` と排他） |

`SVGAttributes<SVGSVGElement>` を継承しているため、標準のSVG属性はすべて利用可能。

---

## サイズ一覧

| size | px | 用途 |
|------|----|------|
| `sm` | 20px | Body テキスト・Inputアイコン |
| `md` | 24px | UI要素の標準（ボタン内等）**デフォルト** |
| `lg` | 32px | 大きなCTA・ヒーロー要素 |
| `xl` | 48px | 空状態・イラスト的な用途 |

---

## 使用例

### レジストリからアイコンを取得（推奨）

```tsx
import { Icon } from '@/components/Icon';

// name prop でレジストリから取得（fill/stroke は自動判定）
<Icon name="search" size="md" />

// ラベル付き（アクセシビリティ）
<Icon name="search" size="md" label="検索" />
```

### カスタム SVG（children）

```tsx
// stroke 系（デフォルト）
<Icon size="md" variant="stroke">
  <circle cx="11" cy="11" r="8" />
  <path d="m21 21-4.35-4.35" />
</Icon>

// fill 系
<Icon size="md" variant="fill">
  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10..." />
</Icon>
```

### カラー

```tsx
<Icon name="info" size="md" color="primary" />
<Icon name="error" size="md" color="error" />
<Icon name="check_circle" size="md" color="success" />
<Icon name="warning" size="md" color="warning" />
<Icon name="info" size="md" color="disabled" />
```

### ボタンと組み合わせる

```tsx
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';

<Button icon={<Icon name="check_circle" size="sm" />}>
  保存
</Button>
```

### アイコンボタン（テキストなし）

```tsx
// ラベル必須（テキストが存在しないため）
<button
  type="button"
  aria-label="検索"
  className="w-11 h-11 flex items-center justify-center rounded hover:bg-state-hover"
>
  <Icon name="search" size="md" color="neutral" />
</button>
```

---

## アイコンレジストリ

### 登録済みアイコン

| name | label | 用途 |
|------|-------|------|
| `search` | 検索 | SearchBar |
| `close` | 閉じる | Alert, SearchBar |
| `check_circle` | 成功 | Alert success |
| `info` | 情報 | Alert info/neutral |
| `warning` | 警告 | Alert warning |
| `error` | エラー | Alert error |
| `chevron_left` | 前へ | Pagination |
| `chevron_right` | 次へ | Pagination, Breadcrumb |
| `first_page` | 最初のページ | Pagination |
| `last_page` | 最後のページ | Pagination |
| `expand_more` | 展開 | Select |
| `person` | ユーザー | Avatar fallback |
| `image` | 画像 | Image fallback |
| `open_in_new` | 外部リンク | Link |

### アイコンの追加手順

1. [Material Symbols](https://fonts.google.com/icons?icon.style=Outlined) で Outlined スタイルのアイコンを探す
2. SVG をダウンロードし、`<path d="...">` の `d` 属性値をコピー
3. `iconRegistry.ts` に追加:

```ts
myIcon: {
  label: '説明',
  mode: 'fill',
  paths: ['M12 2C6.48 2...'],
},
```

4. Storybook の「アイコン一覧」で表示を確認

---

## デザイン原則

### アイコン単独では意味を保証しない
- アイコンは**必ずテキストと組み合わせる**
- テキストなしの場合は `label` prop か `aria-label` で補完する
- 例外: ✕（閉じる）など極めて普遍的なアイコン

参照: [principles/Typography/iconography/overview.md](../../principles/Typography/iconography/overview.md)

### スタイルの統一
- Material Symbols **Outlined** をデフォルトとする
- カスタム SVG を使う場合は `variant` prop でレンダリングモードを指定
- 1つのプロダクト内でアイコンスタイルを混在させない

参照: [principles/Typography/iconography/styles.md](../../principles/Typography/iconography/styles.md)

### テキストサイズとの対応

| テキスト | アイコンサイズ |
|---------|-------------|
| Body SM (14px) | `sm` (20px) |
| Body (16px) | `sm` (20px) |
| H3 (24px) | `md` (24px) |
| H2以上 | `lg` (32px) |

参照: [principles/Typography/iconography/sizes.md](../../principles/Typography/iconography/sizes.md)

---

## アクセシビリティ

### 装飾アイコン（`label` なし）
- `aria-hidden="true"` が自動で付与される
- `name` 指定時はレジストリの `label` が自動で使われる
- スクリーンリーダーは完全に無視する場合は `label=""` を明示

### 意味を持つアイコン（`label` あり）
- `aria-label` + `role="img"` が設定される
- ボタン内でテキストなしの場合は `label` を必ず指定

### タッチターゲット
- アイコン自体が小さくても、クリック可能な領域は **最小 44px** を確保する
- アイコンボタンは `w-11 h-11`（44px）をコンテナに設定する

```tsx
// アイコンボタンのパターン
<button className="w-11 h-11 flex items-center justify-center">
  <Icon name="search" size="md" color="neutral" />
</button>
```

参照: [principles/foundation/accessibility/screen-readers.md](../../principles/foundation/accessibility/screen-readers.md)

---

## 実装詳細

### レンダリングモード

| mode | fill | stroke | strokeWidth | 用途 |
|------|------|--------|-------------|------|
| `'fill'` | `currentColor` | `none` | - | Material Symbols（レジストリのデフォルト） |
| `'stroke'` | `none` | `currentColor` | `2` | Heroicons 系カスタム SVG |

### 使用トークン

| Tailwind クラス | セマンティックトークン |
|----------------|---------------------|
| `text-current` | `color="inherit"` |
| `text-onSurface` | `color="neutral"` |
| `text-onSurface-primary` | `color="primary"` |
| `text-onSurface-success` | `color="success"` |
| `text-onSurface-error` | `color="error"` |
| `text-onSurface-warning` | `color="warning"` |
| `text-onSurface-info` | `color="info"` |
| `text-onSurface-disabled` | `color="disabled"` |

---

## バージョン履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|----------|
| 2026-03-03 | 2.0.0 | Material Symbols Outlined 対応、`name` / `variant` prop 追加、アイコンレジストリ導入 |
| 2026-02-21 | 1.0.0 | 初版作成 |
