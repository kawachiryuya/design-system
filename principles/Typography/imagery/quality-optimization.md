# 画像の品質と最適化

## メタ情報
- カテゴリ: コンテンツ原則 > Imagery
- 適用範囲: Atom〜Page
- ステータス: Approved
- 最終更新: 2024-02-17

## 原則の定義

**適切なフォーマット・サイズ・圧縮を選択し、品質を保ちながら読み込みを速くする**

## フォーマットの選択

| フォーマット | 用途 | 理由 |
|------------|------|------|
| **WebP** | 写真・一般画像（第一選択） | JPEGより25-35%小さい |
| **AVIF** | 写真（次世代・対応ブラウザのみ） | WebPよりさらに小さい |
| **SVG** | アイコン・ロゴ・図解 | 拡大しても劣化しない |
| **PNG** | 透過が必要な画像 | ロスレス圧縮 |
| **JPEG** | WebP非対応環境のフォールバック | 広く対応 |
| **GIF** | 使わない（アニメーションはCSS/動画へ） | 低品質・大容量 |

```html
<!-- WebP + JPEGフォールバックの実装 -->
<picture>
  <source srcset="image.avif" type="image/avif" />
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" alt="..." />
</picture>
```

## サイズの最適化

### srcsetで画面サイズに応じた画像を配信

```html
<img
  src="image-800.jpg"
  srcset="
    image-400.jpg  400w,
    image-800.jpg  800w,
    image-1200.jpg 1200w,
    image-1600.jpg 1600w
  "
  sizes="
    (max-width: 640px) 100vw,
    (max-width: 1024px) 50vw,
    33vw
  "
  alt="..."
/>
```

**sizes属性の読み方**:
- 画面幅640px以下: 画面幅の100%
- 画面幅1024px以下: 画面幅の50%
- それ以上: 画面幅の33%

→ モバイルユーザーに不要な大きな画像を送らない  
→ [Responsiveness](../../foundation/responsiveness.md) 参照

### 最大解像度の目安

| 用途 | 推奨最大幅 |
|------|-----------|
| ヒーロー画像 | 1600px |
| カードサムネイル | 800px |
| プロフィールアイコン | 200px |
| アイコン（SVG以外） | 64px |

## 圧縮の目安

| フォーマット | 品質設定 | 目標ファイルサイズ |
|------------|---------|----------------|
| WebP | 品質80 | 100KB以下（カード）/ 300KB以下（ヒーロー） |
| JPEG | 品質80-85 | 同上 |
| PNG | 圧縮レベル最大 | 透過アイコン: 50KB以下 |
| SVG | SVGOで最適化 | 10KB以下 |

## 遅延読み込み（Lazy Loading）

```html
<!-- ファーストビュー外の画像はloading="lazy" -->
<img src="below-fold.jpg" alt="..." loading="lazy" />

<!-- ファーストビューの画像はloading="eager"（デフォルト）-->
<img src="hero.jpg" alt="..." loading="eager" />
```

**判断基準**:
- スクロールしないと見えない画像 → `loading="lazy"`
- ページ読み込み時に見える画像（ヒーロー等）→ `loading="eager"`

## チェックリスト

- [ ] 写真はWebP形式（JPEGフォールバック付き）
- [ ] アイコン・ロゴはSVG
- [ ] srcset で複数サイズを用意
- [ ] sizes属性が正しく設定されている
- [ ] ファーストビュー外の画像に `loading="lazy"`
- [ ] ヒーロー画像が300KB以下

## 関連ドキュメント

- [Overview](./overview.md)
- [Aspect Ratios](./aspect-ratios.md)
- **[Responsiveness](../../foundation/responsiveness.md)**: srcsetとブレークポイント

## バージョン履歴

| 日付 | バージョン | 変更内容 | 変更理由 |
|------|-----------|----------|----------|
| 2024-02-17 | 1.0.0 | 初版作成 | Phase 3 |
