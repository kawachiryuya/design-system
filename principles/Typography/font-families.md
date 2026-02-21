# フォントファミリーの原則

## メタ情報
- カテゴリ: コンテンツ原則（技術）
- 適用範囲: 全階層
- ステータス: Approved
- 最終更新: 2024-01-15

## 原則の定義

**適切なフォントファミリーを選択し、パフォーマンスとブランド表現のバランスを取りながら、すべてのプラットフォームで美しく読みやすいテキストを提供する**

フォント選択は、ブランドアイデンティティ、可読性、パフォーマンス、アクセシビリティのすべてに影響します。システムフォントとWebフォントの特性を理解し、適切に使い分けることが重要です。

## フォントの種類と用途

### Sans-serif（ゴシック体）

**特徴**: 装飾のないシンプルな書体

**用途**:
- UI要素全般（ボタン、ラベル、フォーム）
- 見出し
- 本文（Webでは標準的）
- モバイルアプリ

**推奨理由**:
- 画面表示での可読性が高い
- 小さいサイズでも読みやすい
- モダンで洗練された印象

### Serif（明朝体）

**特徴**: 装飾（セリフ）がある伝統的な書体

**用途**:
- 長文記事（ブログ、ニュース）
- 印刷物風のデザイン
- 高級感・信頼性を表現したい場合

**注意点**:
- 画面では読みにくい場合がある（特に小さいサイズ）
- モバイルでは避ける傾向

### Monospace（等幅）

**特徴**: すべての文字が同じ幅

**用途**:
- コードブロック
- ターミナル表示
- 技術文書

## システムフォントスタック

### 推奨スタック（Sans-serif）

システムフォントを使用することで、読み込み時間ゼロ、OSネイティブの美しいレンダリングを実現します。

```css
font-family:
  /* 日本語 */
  "Hiragino Sans",
  "Hiragino Kaku Gothic ProN",
  "Noto Sans JP",
  "Yu Gothic",
  "Meiryo",
  /* 欧文 */
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  "Roboto",
  "Helvetica Neue",
  "Arial",
  /* フォールバック */
  sans-serif;
```

**各フォントの役割**:
- **Hiragino Sans**: macOS/iOS（最優先）
- **Noto Sans JP**: Android、Linux
- **Yu Gothic**: Windows 10以降
- **Meiryo**: Windows 7-8.1
- **-apple-system**: macOS/iOS（San Francisco）
- **BlinkMacSystemFont**: Chrome on macOS
- **Segoe UI**: Windows
- **Roboto**: Android
- **sans-serif**: 最終フォールバック

### Serif スタック

```css
font-family:
  /* 日本語 */
  "Hiragino Mincho ProN",
  "Yu Mincho",
  "YuMincho",
  /* 欧文 */
  "Georgia",
  "Times New Roman",
  /* フォールバック */
  serif;
```

### Monospace スタック

```css
font-family:
  /* 日本語 */
  "SFMono-Regular",
  /* 欧文 */
  "Menlo",
  "Monaco",
  "Consolas",
  "Liberation Mono",
  "Courier New",
  /* フォールバック */
  monospace;
```

## システムフォントの利点

### パフォーマンス

- **読み込み時間ゼロ**: ネットワークリクエスト不要
- **初期表示が速い**: FOUT/FOIT（※後述）の問題なし
- **帯域幅節約**: フォントファイルのダウンロード不要

### ユーザー体験

- **慣れ親しんだフォント**: OSネイティブで違和感なし
- **アクセシビリティ**: ユーザーのシステム設定を尊重
- **レンダリング品質**: OSが最適化

### 保守性

- **シンプルな実装**: フォントファイル管理不要
- **更新不要**: OS更新で自動的に改善

## Webフォントの使用

### いつWebフォントを使うか

**使用を検討すべき場合**:
- ブランドアイデンティティが重要
- 独自性が必要
- 特定のデザイン表現が必須

**避けるべき場合**:
- パフォーマンスが最優先
- 日本語の長文（ファイルサイズ大）
- モバイルファースト

### 推奨Webフォントサービス

#### Google Fonts

**利点**:
- 無料
- CDN配信で高速
- 豊富なフォント

**使用例**:
```typescript
import { Noto_Sans_JP, Inter } from 'next/font/google';

const notoSansJP = Noto_Sans_JP({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});
```

**注意点**:
- プライバシー懸念（セルフホスト推奨）
- 必要なウェイトのみ読み込む

#### Adobe Fonts（旧Typekit）

**利点**:
- 高品質な日本語フォント
- Adobe Creative Cloudに含まれる

**注意点**:
- 商用利用にライセンス必要
- ファイルサイズが大きい（日本語）

### Webフォント最適化

#### 1. サブセット化

使用する文字のみを含めることでファイルサイズを削減。

```
フルセット: 3-5MB（日本語）
サブセット（常用漢字のみ）: 500KB-1MB
ラテン文字のみ: 20-50KB
```

#### 2. 必要最小限のウェイト

```typescript
// 悪い例: すべてのウェイトを読み込む
weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']

// 良い例: 使用するウェイトのみ
weight: ['400', '700']  // 通常と太字のみ
```

#### 3. font-display 戦略

```css
/* 推奨: swap */
@font-face {
  font-family: 'CustomFont';
  font-display: swap; /* フォールバックを先に表示、準備でき次第切り替え */
}

/* 他のオプション */
font-display: auto;    /* ブラウザのデフォルト */
font-display: block;   /* 短時間の非表示後、表示（FOIT） */
font-display: fallback; /* 短時間待機、タイムアウトでフォールバック */
font-display: optional; /* ネットワーク状況に応じて判断 */
```

**推奨**: `swap` - ユーザーは常にテキストを読める

#### 4. プリロード

```html
<link
  rel="preload"
  href="/fonts/custom-font.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

**注意**: プリロードしすぎると逆効果。重要なフォントのみ。

## FOUT と FOIT の問題

### FOUT（Flash of Unstyled Text）

**現象**: フォールバックフォントが一瞬表示され、Webフォント読み込み後に切り替わる

**影響**:
- レイアウトシフト
- ユーザー体験の低下

**対策**: `font-display: swap` で許容する（テキストが読めないよりマシ）

### FOIT（Flash of Invisible Text）

**現象**: Webフォント読み込み中、テキストが非表示になる

**影響**:
- コンテンツが読めない
- 重大なUX問題

**対策**: `font-display: swap` で回避

## 多言語対応

### CJK（中国語・日本語・韓国語）と欧文の混在

```css
/* 欧文フォントを先に指定 */
font-family:
  "Inter",           /* 欧文 */
  "Noto Sans JP",    /* 日本語 */
  sans-serif;        /* フォールバック */
```

**理由**: 
- 日本語フォントの欧文は品質が低い場合がある
- 欧文専用フォントの方が美しい

### 可変フォント（Variable Fonts）

**特徴**: 1つのファイルで複数のウェイトをサポート

**利点**:
- ファイル数削減
- 柔軟なウェイト調整

**注意点**:
- ブラウザサポート確認必要
- 日本語フォントはまだ少ない

## フォント読み込み戦略

### 戦略1: システムフォントのみ（推奨）

```css
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif;
}
```

**用途**: ほとんどのプロジェクト

### 戦略2: 欧文のみWebフォント

```css
body {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
}
```

**用途**: ブランディング重視、パフォーマンスも考慮

### 戦略3: 日本語もWebフォント

```css
body {
  font-family: "Noto Sans JP", -apple-system, sans-serif;
}
```

**用途**: 強いブランド要求、サブセット化必須

## アクセシビリティ考慮

### ユーザー設定の尊重

一部のユーザーはシステム設定でフォントを変更しています（ディスレクシア対応等）。

**推奨**: システムフォント使用、または`font-family`のCSS上書きを許可

### 読みやすいフォント選択

- **ディスレクシア対応**: Sans-serif推奨、文字間隔を広げやすい
- **弱視対応**: 十分なコントラスト、大きなフォントサイズ

## 測定方法

### パフォーマンス

- **Lighthouse**: フォント読み込み時間
- **WebPageTest**: フォントのウォーターフォール
- **CLS（Cumulative Layout Shift）**: レイアウトシフトの測定

### チェックリスト

- [ ] システムフォントスタックが適切に設定
- [ ] Webフォントは必要最小限
- [ ] font-display: swap を使用
- [ ] サブセット化（日本語Webフォント使用時）
- [ ] 必要なウェイトのみ読み込み
- [ ] プリロード（重要フォントのみ）
- [ ] フォールバックフォントでもレイアウト崩れなし

## 関連原則

- **typography-scale.md**: フォントサイズ、ウェイトの定義
- **typography-hierarchy.md**: フォント使用の階層
- **readability.md**: フォント選択と可読性

## 関連コンポーネント

- **すべてのテキストコンポーネント**: フォントファミリーの適用

## デザイントークンとの関係

```typescript
// tokens/typography.ts
export const fontFamilies = {
  sans: [
    "Hiragino Sans",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "sans-serif",
  ].join(", "),
  
  serif: [
    "Hiragino Mincho ProN",
    "Georgia",
    "serif",
  ].join(", "),
  
  mono: [
    "SFMono-Regular",
    "Menlo",
    "monospace",
  ].join(", "),
} as const;
```

## バージョン履歴

| 日付 | バージョン | 変更内容 | 変更理由 |
|------|-----------|----------|----------|
| 2024-01-15 | 1.0.0 | 初版作成 | フォント選択原則の体系化 |
