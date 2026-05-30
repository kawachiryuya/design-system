# タイポグラフィヒエラルキーの原則

## メタ情報
- カテゴリ: コンテンツ原則
- 適用範囲: Atom〜Page
- ステータス: Approved
- 最終更新: 2024-01-15

## 原則の定義

**タイポグラフィを通じて情報の階層構造を明確に表現し、読みやすさと理解しやすさを最大化する**

タイポグラフィは単なる「文字の装飾」ではなく、情報の重要度、関係性、構造を伝える重要な手段です。体系的なタイポグラフィヒエラルキーにより、ユーザーは素早く情報をスキャンし、必要な内容を見つけ、文脈を理解できます。

## 背景と目的

### なぜこの原則が必要か

不適切なタイポグラフィは以下の問題を引き起こします：

- **情報の優先順位不明**: どれが見出しで、どれが本文か分からない
- **可読性の低下**: 小さすぎる文字、行間が詰まりすぎた文章
- **スキャン困難**: 情報を素早く探せない
- **認知負荷の増大**: 視覚的なノイズが多く、集中できない
- **ブランドイメージの毀損**: 一貫性のない文字使いは、プロフェッショナルさを欠く

体系的なタイポグラフィシステムは、これらを解決し、美しく機能的な文字組みを実現します。

## 関連ドキュメント

タイポグラフィシステムは以下のドキュメントで構成されます：

- **[Typography Scale](./typography-scale.md)**: フォントサイズ、ウェイト、行間、文字間隔の定義（基盤）
- **[Readability](./readability.md)**: 行長、段落間隔、コントラスト等の可読性要件
- **[Font Families](./font-families.md)**: フォント選択、システムフォント、Webフォント

本ドキュメントでは、これらのスケールを使った**階層の定義と使い分け**に焦点を当てます。

## タイポグラフィ階層の定義

このセクションでは、[Typography Scale](./typography-scale.md) で定義されたスケールを使って、各階層を定義します。

**基盤となるスケール**:
- フォントサイズ: 1.25倍スケール（12px〜72px）
- フォントウェイト: 300〜800
- 行間: 1.0〜2.0
- 文字間隔: -0.05em〜0.1em

→ 詳細は [Typography Scale](./typography-scale.md) 参照

### Display（ディスプレイ）

**用途**: ランディングページのヒーローセクション、特別なプロモーション

```
fontSize: 60-72px (6xl-7xl)
fontWeight: 700 (bold)
lineHeight: 1.25 (tight)
letterSpacing: -0.025em (tight)
```

**設計根拠**: 大きなサイズでは文字間が広く感じられるため、わずかに詰める。行間も詰めて視覚的インパクトを高める。

### H1（最上位見出し）

**用途**: ページタイトル、記事タイトル（ページに1つのみ）

```
fontSize: 36px (4xl) - モバイル: 30px (3xl)
fontWeight: 700 (bold)
lineHeight: 1.25 (tight)
letterSpacing: -0.025em (tight)
```

**アクセシビリティ**: すべてのページに1つの `<h1>` が必要。SEOと支援技術のために、ページの主題を明確に示す。

### H2（セクション見出し）

**用途**: ページ内の主要セクションの見出し

```
fontSize: 30px (3xl) - モバイル: 24px (2xl)
fontWeight: 700 (bold)
lineHeight: 1.375 (snug)
letterSpacing: -0.025em (tight)
```

### H3（サブセクション見出し）

**用途**: セクション内のサブトピック

```
fontSize: 24px (2xl) - モバイル: 20px (xl)
fontWeight: 600 (semibold)
lineHeight: 1.5 (normal)
letterSpacing: 0 (normal)
```

### H4-H6（小見出し）

**用途**: 詳細な構造化が必要な場合（技術文書等）

```
H4:
fontSize: 20px (xl)
fontWeight: 600 (semibold)
lineHeight: 1.5 (normal)
letterSpacing: 0 (normal)

H5:
fontSize: 18px (lg)
fontWeight: 600 (semibold)
lineHeight: 1.5 (normal)
letterSpacing: 0 (normal)

H6:
fontSize: 16px (base)
fontWeight: 600 (semibold)
lineHeight: 1.5 (normal)
letterSpacing: 0 (normal)
```

**設計根拠**: H4以降は本文サイズに近づくため、太さ（font-weight）で階層を表現。

### Body Large（大きめの本文）

**用途**: リード文、イントロダクション

```
fontSize: 18px (lg)
fontWeight: 400 (normal)
lineHeight: 1.625 (relaxed)
letterSpacing: 0 (normal)
```

**設計根拠**: リード文は本文より行間を広げることで、ゆったりとした読み心地を提供。

### Body（本文）

**用途**: 標準的な文章、段落

```
fontSize: 16px (base)
fontWeight: 400 (normal)
lineHeight: 1.5 (normal)
letterSpacing: 0 (normal)
```

**設計根拠**: 16pxは、デスクトップ・モバイル共に読みやすい最適なサイズ。行間1.5は、WCAG AA基準を満たす。

### Body Small（小さめの本文）

**用途**: 補足情報、キャプション、メタ情報

```
fontSize: 14px (sm)
fontWeight: 400 (normal)
lineHeight: 1.5 (normal)
letterSpacing: 0 (normal)
```

### Caption（キャプション）

**用途**: 画像の説明、補足情報、フッター等

```
fontSize: 12px (xs)
fontWeight: 400 (normal)
lineHeight: 1.5 (normal)
letterSpacing: 0 (normal)
```

**注意**: 12px未満は避けるべき（アクセシビリティ上の懸念）。

### Label（ラベル）

**用途**: フォームラベル、UI要素のラベル

```
fontSize: 14px (sm)
fontWeight: 500 (medium)
lineHeight: 1.5 (normal)
letterSpacing: 0 (normal)
```

**設計根拠**: ラベルは少し太くすることで、入力フィールドと視覚的に区別しやすくする。

### Button Text（ボタンテキスト）

**用途**: ボタン内のテキスト

```
fontSize: 16px (base) - 小: 14px (sm), 大: 18px (lg)
fontWeight: 500 (medium)
lineHeight: 1 (none)
letterSpacing: 0.025em (wide)
```

**設計根拠**: ボタンテキストは文字間を広げることで、クリック可能に見え、読みやすくなる。行間はボタン内で詰める。

## 実装について

各階層の具体的な実装は、以下のコンポーネントドキュメントを参照してください：

- **Typography コンポーネント**: Display, H1-H6, Body等の実装
- **Article コンポーネント**: 記事レイアウトでの階層使用例
- **その他テキストコンポーネント**: 各コンポーネントでの適用

→ Atomic Design階層での実装パターンは [Atomic Design Implementation](../patterns/atomic-design-implementation.md) 参照


## 色とコントラスト

**WCAG AA基準**:
- 通常テキスト（14-18px）: 4.5:1以上
- 大きなテキスト（18px以上）: 3:1以上

→ 詳細は [Color Meaning](../color/color-meaning.md)、[Accessibility](../foundation/accessibility.md) 参照

## レスポンシブ対応

**基本パターン**: 本文は維持、見出しのみスケール

```
H1: 30px (mobile) → 48px (desktop)
H2: 24px (mobile) → 36px (desktop)
Body: 16px (全デバイス)
```

→ 詳細は [Typography Scale](./typography-scale.md) 参照

## 可読性

- **行長**: 英語65ch、日本語35ch以内
- **段落間隔**: 行間の1.5-2倍

→ 詳細は [Readability](./readability.md) 参照

## フォント選択

- **推奨**: システムフォント（Sans-serif）
- **オプション**: Webフォント（ブランディング重視時）

→ 詳細は [Font Families](./font-families.md) 参照

## アクセシビリティ

### 見出し階層

論理的な順序で使用（h1→h2→h3、スキップなし）

```
✅ 良い例: h1 → h2 → h3 → h2
❌ 悪い例: h1 → h3（h2をスキップ）
```

### ズーム対応

- rem単位使用でブラウザズームに対応
- 200%ズームテスト必須（WCAG AA）

→ 詳細は [Accessibility](../foundation/accessibility.md) 参照

## 測定方法

### チェックリスト

- [ ] 見出し階層が論理的（h1→h2→h3、スキップなし）
- [ ] 本文フォントサイズが16px以上
- [ ] 行間が1.5以上（本文）
- [ ] スケール定義された値を使用（任意の値を避ける）
- [ ] コントラスト比がWCAG AA基準
- [ ] レスポンシブ対応
- [ ] rem単位でズーム対応

## 関連原則

- **[Typography Scale](./typography-scale.md)**: フォントサイズ、ウェイト、行間、文字間隔の定義（基盤）
- **[Readability](./readability.md)**: 行長、段落間隔、可読性要件
- **[Font Families](./font-families.md)**: フォント選択とWebフォント
- **[Accessibility](../foundation/accessibility.md)**: コントラスト比、ズーム対応
- **[Spacing](../layout/spacing.md)**: 行間、段落間の余白
- **[Color Meaning](../color/color-meaning.md)**: テキストカラーの選択

## 関連コンポーネント

- **Typography**: このヒエラルキーを実装したコンポーネント
- **すべてのテキストコンポーネント**: タイポグラフィはすべてに適用

## デザイントークンとの関係

```typescript
// tokens/typography.ts（詳細は typography-scale.md）
export const typography = {
  fontSizes,
  fontWeights,
  lineHeights,
  letterSpacing,
  fontFamilies,
} as const;
```

## バージョン履歴

| 日付 | バージョン | 変更内容 | 変更理由 |
|------|-----------|----------|----------|
| 2024-01-15 | 1.0.0 | 初版作成 | タイポグラフィヒエラルキーの体系化 |
| 2024-01-15 | 1.1.0 | ドキュメント分割、スケール不整合修正 | 可読性向上、正確性向上 |
| 2024-01-15 | 1.2.0 | Atomic Design実装例を削除、参照セクションを簡潔化 | コンポーネントドキュメントへの委譲、可読性向上 |
