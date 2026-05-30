# SEO（検索エンジン最適化）

## メタ情報
- カテゴリ: プラットフォーム原則 > Web
- 適用範囲: Page
- ステータス: Approved
- 最終更新: 2024-02-17

## 原則の定義

**検索エンジンがコンテンツを正しく理解し、ユーザーが探しているものを見つけられるようにする**

SEOは「検索エンジン向け」ではなく「ユーザー向け」の最適化です。良いコンテンツ・良いUXがSEOの基盤。

## 基本のHTML構造

### タイトルタグ（最重要）

```html
<title>ページタイトル | サイト名</title>

✅ 良い例:
<title>デザインシステム構築ガイド | TechBlog</title>

❌ 悪い例:
<title>ホーム</title>
<title>無題のページ</title>
```

**ルール**:
- 50〜60文字以内（検索結果で切れない長さ）
- 主要キーワードを前方に
- すべてのページで一意

### メタディスクリプション

```html
<meta name="description" content="デザインシステムの構築方法を、基礎から実践まで解説。Atomic Designやアクセシビリティ対応についても詳しく紹介します。" />

✅ 良い例:
- 150〜160文字
- ページ内容の要約
- 検索意図に合ったキーワード

❌ 悪い例:
- 「このページについて」
- すべてのページで同じ文章
```

### 見出しの階層（h1〜h6）

```html
<h1>ページの主題（1ページに1つ）</h1>
  <h2>セクション1</h2>
    <h3>サブセクション1-1</h3>
    <h3>サブセクション1-2</h3>
  <h2>セクション2</h2>
    <h3>サブセクション2-1</h3>

❌ 見出しをスキップ:
<h1>主題</h1>
<h3>セクション</h3> ← h2を飛ばしている
```

**ルール**: h1 → h2 → h3 と順番に使う。見出しをスキップしない。

→ [Typography: Hierarchy](../../content/typography/hierarchy.md) 参照

## セマンティックHTML

検索エンジンは、タグの意味からコンテンツの構造を理解します。

```html
<!-- ✅ セマンティック（意味がある） -->
<article>
  <header>
    <h1>記事タイトル</h1>
    <time datetime="2024-02-17">2024年2月17日</time>
  </header>
  <p>本文...</p>
  <footer>
    <p>著者: 山田太郎</p>
  </footer>
</article>

<!-- ❌ 非セマンティック（意味がない） -->
<div class="article">
  <div class="header">
    <div class="title">記事タイトル</div>
    <div class="date">2024年2月17日</div>
  </div>
  <div class="content">本文...</div>
</div>
```

**使うべきタグ**:
- `<article>`: 独立したコンテンツ（記事・ブログ投稿）
- `<section>`: テーマごとのまとまり
- `<nav>`: ナビゲーション
- `<aside>`: 補足情報・サイドバー
- `<main>`: メインコンテンツ（1ページに1つ）
- `<header>` / `<footer>`: ヘッダー・フッター

## Open Graph（OGP）

SNSでシェアされたときの見た目を制御。

```html
<meta property="og:title" content="ページタイトル" />
<meta property="og:description" content="ページの説明文" />
<meta property="og:image" content="https://example.com/og-image.jpg" />
<meta property="og:url" content="https://example.com/page" />
<meta property="og:type" content="article" />
<meta property="og:site_name" content="サイト名" />

<!-- Twitter用 -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="ページタイトル" />
<meta name="twitter:description" content="ページの説明文" />
<meta name="twitter:image" content="https://example.com/twitter-image.jpg" />
```

**OG画像の推奨サイズ**:
- 1200 × 630px（Facebook推奨）
- 1200 × 600px（Twitter推奨）
- ファイルサイズ: 1MB以下

→ [Imagery: Quality & Optimization](../../content/imagery/quality-optimization.md) 参照

## 構造化データ（JSON-LD）

検索結果にリッチスニペットを表示。

### 記事（Article）

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "デザインシステムの構築方法",
  "author": {
    "@type": "Person",
    "name": "山田太郎"
  },
  "datePublished": "2024-02-17",
  "image": "https://example.com/article-image.jpg",
  "publisher": {
    "@type": "Organization",
    "name": "TechBlog",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  }
}
</script>
```

### パンくずリスト（BreadcrumbList）

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "ホーム",
      "item": "https://example.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "ブログ",
      "item": "https://example.com/blog"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "デザインシステム",
      "item": "https://example.com/blog/design-system"
    }
  ]
}
</script>
```

## URLの設計

```
✅ 良いURL:
https://example.com/blog/design-system-guide
https://example.com/products/shoes/nike-air-max

ポイント:
- 意味のある単語（英語）
- ハイフン区切り
- 短く・分かりやすく

❌ 悪いURL:
https://example.com/page.php?id=12345
https://example.com/blog/投稿1
https://example.com/products/p_nike_air_max_shoes_2024_new
```

## 内部リンク

```html
<!-- ✅ 説明的なアンカーテキスト -->
<a href="/blog/design-system">デザインシステムの構築方法</a>

<!-- ❌ 「こちら」「クリック」だけ -->
<a href="/blog/design-system">こちら</a>をクリック
```

重要なページへは複数のページからリンクを貼る（サイト内での重要度が伝わる）。

## ページ速度（Core Web Vitals）

Googleはページ速度をランキング要因に含める。

→ [Performance](./performance.md) 参照

**SEOに影響する指標**:
- LCP（2.5秒以内）
- FID（100ms以内）
- CLS（0.1未満）

## モバイルフレンドリー

```html
<!-- 必須 -->
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

Googleは「モバイルファースト」。モバイル版のコンテンツでランキングを決定。

→ [Responsiveness](../../foundation/responsiveness.md) 参照

## robots.txt

```
# 検索エンジンに指示を与える

User-agent: *
Disallow: /admin/          # 管理画面は非公開
Disallow: /api/            # APIエンドポイントは非公開
Allow: /                   # それ以外は公開

Sitemap: https://example.com/sitemap.xml
```

## sitemap.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2024-02-17</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/blog/design-system</loc>
    <lastmod>2024-02-17</lastmod>
    <priority>0.8</priority>
  </url>
</urlset>
```

Google Search Consoleに登録。

## 測定ツール

### Google Search Console

```
- インデックス状況
- 検索パフォーマンス
- Core Web Vitals
- モバイルユーザビリティ
```

### Lighthouse（Chrome DevTools）

```
SEOスコア（100点満点）
- タイトル・メタディスクリプションの有無
- セマンティックHTML
- 構造化データ
```

## チェックリスト

### 基本
- [ ] すべてのページに一意の`<title>`
- [ ] すべてのページに`<meta name="description">`
- [ ] h1が1つ、h2〜h6が階層的
- [ ] セマンティックHTML使用

### OGP
- [ ] og:title, og:description, og:image設定
- [ ] OG画像サイズ: 1200×630px

### 構造化データ
- [ ] JSON-LD実装（Article / BreadcrumbList等）

### URL・リンク
- [ ] URL構造が意味的
- [ ] 内部リンクが説明的

### パフォーマンス
- [ ] Core Web Vitals達成
- [ ] モバイルフレンドリー

### 管理
- [ ] robots.txt設置
- [ ] sitemap.xml設置
- [ ] Google Search Console登録

## 関連ドキュメント

- [Browser Support](./browser-support.md): ブラウザサポート
- [Performance](./performance.md): パフォーマンス最適化
- **[Typography: Hierarchy](../../content/typography/hierarchy.md)**: 見出し階層
- **[Responsiveness](../../foundation/responsiveness.md)**: モバイル対応
- **[Imagery: Quality & Optimization](../../content/imagery/quality-optimization.md)**: OG画像最適化

## バージョン履歴

| 日付 | バージョン | 変更内容 | 変更理由 |
|------|-----------|----------|----------|
| 2024-02-17 | 1.0.0 | 初版作成 | Phase 4 |
