# Icon

**Atomic Design**: Atom

SVGアイコンのラッパーコンポーネント。サイズ・カラー・アクセシビリティを統一的に管理する。  
推奨ライブラリ: **Heroicons (Outline)**

---

## Props

| Prop | Type | Default | 説明 |
|------|------|---------|------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | `'md'` | アイコンのサイズ |
| `color` | `'inherit' \| 'neutral' \| 'primary' \| 'success' \| 'error' \| 'warning' \| 'disabled'` | `'inherit'` | アイコンの色 |
| `label` | `string` | - | アクセシブルなラベル（省略時は装飾扱いで aria-hidden） |
| `children` | `React.ReactNode` | **必須** | SVGのパス要素 |

`SVGAttributes<SVGSVGElement>` を継承しているため、標準のSVG属性はすべて利用可能。

---

## サイズ一覧

| size | px | 用途 |
|------|----|------|
| `xs` | 12px | Caption テキストと組み合わせ |
| `sm` | 16px | Body テキスト・Inputアイコン |
| `md` | 20px | UI要素の標準（ボタン内等）**デフォルト** |
| `lg` | 24px | 見出しと組み合わせ・タブバー |
| `xl` | 32px | 大きなCTA・ヒーロー要素 |
| `2xl` | 48px | 空状態・イラスト的な用途 |

---

## 使用例

### 基本（装飾アイコン）

```tsx
import { Icon } from '@/components/Icon';

// label なし → aria-hidden="true"（スクリーンリーダーは無視）
<Icon size="md">
  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
</Icon>
```

### 意味を持つアイコン

```tsx
// label あり → aria-label + role="img" で意味を伝える
<Icon size="md" label="検索">
  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
</Icon>
```

### カラー

```tsx
<Icon size="md" color="primary">...</Icon>
<Icon size="md" color="error">...</Icon>
<Icon size="md" color="success">...</Icon>
<Icon size="md" color="warning">...</Icon>
<Icon size="md" color="disabled">...</Icon>
```

### ボタンと組み合わせる

```tsx
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';

<Button icon={
  <Icon size="sm">
    <path d="..." />
  </Icon>
}>
  保存
</Button>
```

### アイコンボタン（テキストなし）

```tsx
// ラベル必須（テキストが存在しないため）
<button
  type="button"
  aria-label="検索"
  className="w-11 h-11 flex items-center justify-center rounded hover:bg-neutral-100"
>
  <Icon size="md" color="neutral">
    <path d="..." />
  </Icon>
</button>
```

---

## デザイン原則

### アイコン単独では意味を保証しない
- アイコンは**必ずテキストと組み合わせる**
- テキストなしの場合は `label` prop か `aria-label` で補完する
- 例外: ✕（閉じる）など極めて普遍的なアイコン

参照: [principles/Typography/iconography/overview.md](../../principles/Typography/iconography/overview.md)

### スタイルの統一
- システム内でアイコンライブラリを1つに絞る
- Outline をデフォルト、Filled をアクティブ・状態表現に使う

参照: [principles/Typography/iconography/styles.md](../../principles/Typography/iconography/styles.md)

### テキストサイズとの対応

| テキスト | アイコンサイズ |
|---------|-------------|
| Caption (12px) | `xs` (12px) |
| Body SM (14px) | `sm` (16px) |
| Body (16px) | `sm`〜`md` (16〜20px) |
| H3 (24px) | `md`〜`lg` (20〜24px) |
| H2以上 | `lg`〜`xl` (24〜32px) |

参照: [principles/Typography/iconography/sizes.md](../../principles/Typography/iconography/sizes.md)

---

## アクセシビリティ

### 装飾アイコン（`label` なし）
- `aria-hidden="true"` が自動で付与される
- スクリーンリーダーは完全に無視する

### 意味を持つアイコン（`label` あり）
- `aria-label` + `role="img"` が設定される
- ボタン内でテキストなしの場合は `label` を必ず指定

### タッチターゲット
- アイコン自体が小さくても、クリック可能な領域は **最小 44px** を確保する
- アイコンボタンは `w-11 h-11`（44px）をコンテナに設定する

```tsx
// アイコンボタンのパターン
<button className="w-11 h-11 flex items-center justify-center">
  <Icon size="md" color="neutral">...</Icon>
</button>
```

参照: [principles/foundation/accessibility/screen-readers.md](../../principles/foundation/accessibility/screen-readers.md)

---

## 実装詳細

### SVG デフォルト設定

| 属性 | 値 | 説明 |
|------|-----|------|
| `viewBox` | `0 0 24 24` | Heroicons 標準 |
| `fill` | `none` | Outline スタイル |
| `stroke` | `currentColor` | 親要素の色を継承 |
| `strokeWidth` | `2` | 標準ストローク幅 |
| `focusable` | `false` | IE/Edge の SVG フォーカス問題を防ぐ |

### 使用トークン

| トークン | 使用箇所 |
|---------|---------|
| `colors.neutral.700` | `color="neutral"` |
| `colors.primary.600` | `color="primary"` |
| `colors.error.600` | `color="error"` |
| `colors.success.600` | `color="success"` |
| `colors.warning.600` | `color="warning"` |
| `colors.neutral.400` | `color="disabled"` |

---

## バージョン履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|----------|
| 2026-02-21 | 1.0.0 | 初版作成 |
