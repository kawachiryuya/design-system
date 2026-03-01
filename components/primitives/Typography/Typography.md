# Typography

**Atomic Design**: Atom

タイポグラフィヒエラルキーを実装したテキストコンポーネント。`variant` で視覚スタイルを、`as` で意味論的なHTML要素を独立して指定できる。

---

## Props

| Prop | Type | Default | 説明 |
|------|------|---------|------|
| `variant` | `TypographyVariant` | `'body'` | 視覚スタイルを決定するバリアント |
| `as` | `PolymorphicElement` | variantに対応するタグ | レンダリングするHTML要素 |
| `color` | `TypographyColor` | `'default'` | テキストカラー |
| `truncate` | `boolean` | `false` | 1行で省略（overflow ellipsis） |
| `children` | `React.ReactNode` | **必須** | テキスト内容 |

`HTMLAttributes<HTMLElement>` を継承しているため、標準のHTML属性はすべて利用可能。

### TypographyVariant

| variant | タグ | サイズ | ウェイト | 用途 |
|---------|------|--------|---------|------|
| `display` | `h1` | 48px | bold | ランディングページ・ヒーロー |
| `h1` | `h1` | 36px | bold | ページタイトル（1ページに1つ） |
| `h2` | `h2` | 30px | bold | 主要セクション見出し |
| `h3` | `h3` | 24px | semibold | サブセクション見出し |
| `h4` | `h4` | 20px | semibold | 小見出し |
| `h5` | `h5` | 18px | semibold | 小見出し |
| `h6` | `h6` | 16px | semibold | 小見出し |
| `body-lg` | `p` | 18px | regular | リード文・イントロ |
| `body` | `p` | 16px | regular | 標準本文 **デフォルト** |
| `body-sm` | `p` | 14px | regular | 補足情報 |
| `caption` | `p` | 12px | regular | キャプション・フッター |
| `label` | `span` | 14px | medium | フォームラベル・UIラベル |
| `button` | `span` | 16px | medium | ボタンテキスト |

### TypographyColor

| color | 説明 |
|-------|------|
| `default` | `neutral-800`（標準テキスト） |
| `muted` | `neutral-600`（控えめな補足テキスト） |
| `subtle` | `neutral-400`（最も控えめ・プレースホルダー等） |
| `primary` | `primary-600`（アクセント・リンク等） |
| `success` | `success-600`（成功メッセージ） |
| `error` | `error-600`（エラーメッセージ） |
| `warning` | `warning-600`（警告メッセージ） |
| `inherit` | 親要素の色を継承 |

---

## 使用例

### 基本

```tsx
import { Typography } from '@/components/Typography';

<Typography variant="h1">ページタイトル</Typography>
<Typography variant="body">本文テキスト</Typography>
```

### 全バリアント

```tsx
<Typography variant="display">Display テキスト</Typography>
<Typography variant="h1">H1 見出し</Typography>
<Typography variant="h2">H2 見出し</Typography>
<Typography variant="h3">H3 見出し</Typography>
<Typography variant="h4">H4 見出し</Typography>
<Typography variant="h5">H5 見出し</Typography>
<Typography variant="h6">H6 見出し</Typography>
<Typography variant="body-lg">Body Large テキスト</Typography>
<Typography variant="body">Body テキスト</Typography>
<Typography variant="body-sm">Body Small テキスト</Typography>
<Typography variant="caption">Caption テキスト</Typography>
<Typography variant="label">Label テキスト</Typography>
<Typography variant="button">Button テキスト</Typography>
```

### `as` prop による意味論と視覚の分離

```tsx
// H2のスタイルで <h3> タグ（見出し階層を崩さずにスタイル適用）
<Typography variant="h2" as="h3">
  サブセクション
</Typography>

// H1のスタイルで <p> タグ（ページに複数の大きなテキストが必要な場合）
<Typography variant="h1" as="p">
  ヒーローコピー
</Typography>
```

### カラー

```tsx
<Typography variant="body" color="muted">補足テキスト</Typography>
<Typography variant="body-sm" color="subtle">プレースホルダー的なテキスト</Typography>
<Typography variant="body" color="error">エラーメッセージ</Typography>
<Typography variant="body" color="success">成功メッセージ</Typography>
```

### テキスト省略

```tsx
<Typography variant="body" truncate>
  非常に長いテキストが入るとこが省略されて...と表示される
</Typography>
```

### セクション見出しのパターン

```tsx
<section>
  <Typography variant="h2">サービス紹介</Typography>
  <Typography variant="body-lg" color="muted">
    私たちのサービスについて詳しくご紹介します。
  </Typography>
</section>
```

---

## デザイン原則

### 見出し階層の論理的な順序
- h1 → h2 → h3 の順で使用（スキップ禁止）
- `as` prop を使うと視覚スタイルを変えずに意味論を維持できる

```tsx
// ❌ h1 → h3（h2 をスキップ）
<Typography variant="h1">ページ</Typography>
<Typography variant="h3">セクション</Typography>  // 意味論的に問題

// ✅ h1 → h2 スタイルに h3 タグ
<Typography variant="h1">ページ</Typography>
<Typography variant="h2" as="h2">セクション</Typography>
```

参照: [principles/Typography/hierarchy.md](../../principles/Typography/hierarchy.md)

### 本文フォントサイズは 16px 以上
- `body`（16px）以上を標準として使用する
- `caption`（12px）は補足情報のみに限定する
- 12px 未満は使用しない（WCAG アクセシビリティ要件）

### 行長の制限
- 日本語本文: 35文字以内
- 英語本文: 65文字（65ch）以内
- `max-w-prose` クラスで制限できる

参照: [principles/Typography/readability.md](../../principles/Typography/readability.md)

---

## アクセシビリティ

### 見出し構造
- すべてのページに `<h1>` を1つ
- 論理的な順序（スキップなし）
- スクリーンリーダーは見出し一覧でページを把握する

### コントラスト比（WCAG AA）
- 通常テキスト（14〜18px）: 4.5:1 以上
- 大きなテキスト（18px 以上）: 3:1 以上
- `default`（neutral-800 on white）: 約 16:1 ✓

### ズーム対応
- Tailwind のデフォルトは `rem` 単位なので 200% ズームに対応している

参照: [principles/Typography/hierarchy.md](../../principles/Typography/hierarchy.md)

---

## 実装詳細

### 使用トークン

| トークン | 使用箇所 |
|---------|---------|
| `typography.fontSize.*` | 各 variant のフォントサイズ |
| `typography.fontWeight.*` | 各 variant のウェイト |
| `typography.lineHeight.*` | 各 variant の行間 |
| `typography.letterSpacing.*` | 見出し系の文字間隔 |
| `colors.neutral.*` | default / muted / subtle |
| `colors.primary.600` | primary |
| `colors.error.600` | error |
| `colors.success.600` | success |
| `colors.warning.600` | warning |

### Tailwind クラス

```
見出し: text-{4xl,3xl,2xl,xl} font-{bold,semibold} leading-tight tracking-tight
本文: text-{lg,base,sm,xs} font-normal leading-normal
特殊: label(font-medium), button(tracking-wide leading-none)
```

---

## バージョン履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|----------|
| 2026-02-21 | 1.0.0 | 初版作成 |
