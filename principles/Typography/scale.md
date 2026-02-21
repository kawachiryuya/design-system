# タイポグラフィスケールの定義

## メタ情報
- カテゴリ: コンテンツ原則（基盤）
- 適用範囲: 全階層
- ステータス: Approved
- 最終更新: 2024-01-15

## 原則の定義

**体系的なタイポグラフィスケールにより、一貫性のある美しい文字組みを実現し、実装時の意思決定を高速化する**

タイポグラフィスケールは、フォントサイズ、ウェイト、行間、文字間隔を数学的な比率に基づいて定義します。これにより、デザイナーと開発者が「どのサイズを使うべきか」を毎回考える必要がなくなり、自動的に調和の取れた結果が得られます。

## フォントサイズスケール

### 基本スケール（1.25倍 - Major Third）

```typescript
const fontSizes = {
  xs: '12px',      // 0.75rem - 補足情報、キャプション
  sm: '14px',      // 0.875rem - 小さめのUI要素、ラベル
  base: '16px',    // 1rem - 本文（基準点）
  lg: '18px',      // 1.125rem - リード文、大きめの本文
  xl: '20px',      // 1.25rem - 小見出し
  '2xl': '24px',   // 1.5rem - 中見出し（h3相当）
  '3xl': '30px',   // 1.875rem - 大見出し（h2相当）
  '4xl': '36px',   // 2.25rem - 特大見出し（h1相当）
  '5xl': '48px',   // 3rem - ヒーロー見出し
  '6xl': '60px',   // 3.75rem - 超大見出し
  '7xl': '72px',   // 4.5rem - ディスプレイ用
};
```

### なぜ1.25倍（Major Third）か

1. **視覚的調和**: 音楽理論に基づく比率は視覚的にも心地よい
2. **十分な差異**: 階層が明確に区別できる
3. **適度なバランス**: 1.5倍（Perfect Fifth）ほど大きすぎず実用的
4. **柔軟性**: Web・モバイル両方に適用可能

### 使用ガイドライン

| サイズ | 用途 | 例 |
|--------|------|-----|
| xs (12px) | キャプション、補足 | 画像の説明、フッター |
| sm (14px) | UIラベル、小さめ本文 | フォームラベル、ボタンテキスト（小） |
| base (16px) | 本文 | 記事本文、説明文 |
| lg (18px) | リード文 | 記事イントロ |
| xl (20px) | 小見出し | h4-h6 |
| 2xl (24px) | 中見出し | h3 |
| 3xl (30px) | 大見出し | h2 |
| 4xl (36px) | 特大見出し | h1 |
| 5xl-7xl | ディスプレイ | ランディングページ、ヒーロー |

**注意**: 12px未満は避ける（アクセシビリティ上の懸念）

## フォントウェイト（太さ）

```typescript
const fontWeights = {
  light: 300,      // 軽い（装飾的、慎重に使用）
  normal: 400,     // 通常（本文）
  medium: 500,     // 中（強調したい本文、UIラベル）
  semibold: 600,   // やや太い（小見出し、h4-h6）
  bold: 700,       // 太い（見出し、h1-h3）
  extrabold: 800,  // 特に太い（特別な見出し、ブランド要素）
};
```

### 使用ガイドライン

- **本文**: 400（normal）を基本
- **強調**: 500（medium）または 600（semibold）
- **見出し**: 600-700（semibold-bold）
- **特別な見出し**: 700-800（bold-extrabold）

**原則**: フォントサイズが大きいほど、太さで差をつける必要が少ない

## 行間（Line Height）

```typescript
const lineHeights = {
  none: 1,         // 行間なし（特殊用途、通常は使用しない）
  tight: 1.25,     // 詰めた（特大見出し、ディスプレイ）
  snug: 1.375,     // やや詰めた（大見出し）
  normal: 1.5,     // 通常（本文） - WCAG推奨
  relaxed: 1.625,  // ゆったり（リード文）
  loose: 2,        // 非常にゆったり（段落間、特別な用途）
};
```

### 設計根拠

**WCAG 2.1 Success Criterion 1.4.12**:
- 段落内の行間: 最低1.5倍
- 段落間: 2倍

これは可読性を向上させ、ディスレクシア（読字障害）のユーザーにも読みやすくします。

### 使用ガイドライン

| 要素タイプ | 推奨行間 | 理由 |
|-----------|---------|------|
| 特大見出し（5xl-7xl） | 1.1-1.25 (tight) | 視覚的インパクトを優先 |
| 大見出し（3xl-4xl） | 1.25-1.375 (tight-snug) | 詰めて力強く |
| 中見出し（2xl） | 1.375 (snug) | 適度な余白 |
| 小見出し（xl） | 1.5 (normal) | 本文に近づく |
| 本文（base） | 1.5 (normal) | WCAG基準 |
| リード文（lg） | 1.625 (relaxed) | ゆったり読みやすく |
| キャプション（xs-sm） | 1.5 (normal) | 小さくても読みやすく |

**原則**: フォントサイズが大きいほど、行間は詰める

## 文字間隔（Letter Spacing）

```typescript
const letterSpacing = {
  tighter: '-0.05em',  // 非常に詰めた（特大見出し）
  tight: '-0.025em',   // やや詰めた（大見出し）
  normal: '0',         // 通常（本文、ほとんどの用途）
  wide: '0.025em',     // やや広い（大文字見出し、小さいボタン）
  wider: '0.05em',     // 広い（ボタンテキスト、ラベル）
  widest: '0.1em',     // 非常に広い（装飾的な大文字）
};
```

### 設計根拠

- **大きな文字**: 視覚的に文字間が広く見えるため、わずかに詰める
- **小さな文字**: 可読性向上のため、やや広げることがある
- **大文字**: 小文字より広げると読みやすい
- **ボタン/ラベル**: 広げるとクリック可能に見え、読みやすい

### 使用ガイドライン

| 要素タイプ | 推奨文字間隔 | 理由 |
|-----------|-------------|------|
| 特大見出し（5xl-7xl） | -0.05em to -0.025em | 大きいと間が広く見える |
| 大見出し（3xl-4xl） | -0.025em | やや詰めてバランス |
| 本文・小見出し | 0 (normal) | デフォルトが最適 |
| 大文字見出し | 0.025em to 0.05em | ALL CAPSは広げる |
| ボタンテキスト | 0.025em to 0.05em | 可読性と操作感 |
| 装飾的テキスト | 0.05em to 0.1em | ブランド表現 |

**注意**: 過度な文字間隔は可読性を損なう。基本は `normal (0)` を使用。

## スケールの組み合わせ例

### Display（ディスプレイ）

```typescript
{
  fontSize: '60px',        // 6xl
  fontWeight: 700,         // bold
  lineHeight: 1.25,        // tight
  letterSpacing: '-0.025em', // tight
}
```

### H1（最上位見出し）

```typescript
{
  fontSize: '36px',        // 4xl
  fontWeight: 700,         // bold
  lineHeight: 1.25,        // tight
  letterSpacing: '-0.025em', // tight
}
```

### H2（セクション見出し）

```typescript
{
  fontSize: '30px',        // 3xl
  fontWeight: 700,         // bold
  lineHeight: 1.375,       // snug
  letterSpacing: '-0.025em', // tight
}
```

### H3（サブセクション見出し）

```typescript
{
  fontSize: '24px',        // 2xl
  fontWeight: 600,         // semibold
  lineHeight: 1.5,         // normal
  letterSpacing: '0',      // normal
}
```

### Body（本文）

```typescript
{
  fontSize: '16px',        // base
  fontWeight: 400,         // normal
  lineHeight: 1.5,         // normal
  letterSpacing: '0',      // normal
}
```

### Body Large（リード文）

```typescript
{
  fontSize: '18px',        // lg
  fontWeight: 400,         // normal
  lineHeight: 1.625,       // relaxed
  letterSpacing: '0',      // normal
}
```

### Label（ラベル）

```typescript
{
  fontSize: '14px',        // sm
  fontWeight: 500,         // medium
  lineHeight: 1.5,         // normal
  letterSpacing: '0',      // normal
}
```

### Button Text（ボタン）

```typescript
{
  fontSize: '16px',        // base（または sm/lg）
  fontWeight: 500,         // medium
  lineHeight: 1,           // none（ボタン内は詰める）
  letterSpacing: '0.025em', // wide
}
```

## レスポンシブ対応

### ブレークポイント別のスケール調整

画面サイズに応じてフォントサイズを調整します。

```
モバイル（〜640px）:
  H1: 30px (3xl)
  H2: 24px (2xl)
  Body: 16px (base)

タブレット（641px〜1024px）:
  H1: 36px (4xl)
  H2: 30px (3xl)
  Body: 16px (base)

デスクトップ（1025px〜）:
  H1: 48px (5xl)
  H2: 36px (4xl)
  Body: 16px (base)
```

**原則**: 本文サイズは維持、見出しのみスケール

## 測定方法

### チェックリスト

- [ ] すべてのフォントサイズがスケール内の値を使用
- [ ] 本文の行間が1.5以上（WCAG基準）
- [ ] 見出しは行間を詰めて力強さを確保
- [ ] 文字間隔はほとんどの場合 `normal (0)` を使用
- [ ] 大きな見出しのみ文字間隔を調整（-0.025em程度）
- [ ] rem単位でズームに対応

## 関連原則

- **typography-hierarchy.md**: このスケールを使った階層定義
- **readability.md**: 行長、段落間隔等の可読性要件
- **accessibility.md**: コントラスト、ズーム対応

## 関連コンポーネント

- **Typography**: このスケールを実装したコンポーネント

## デザイントークンとの関係

```typescript
// tokens/typography.ts
export const typography = {
  fontSizes,
  fontWeights,
  lineHeights,
  letterSpacing,
} as const;
```

## バージョン履歴

| 日付 | バージョン | 変更内容 | 変更理由 |
|------|-----------|----------|----------|
| 2024-01-15 | 1.0.0 | 初版作成 | タイポグラフィスケールの体系化 |
