# Webパフォーマンス

## メタ情報
- カテゴリ: プラットフォーム原則 > Web
- 適用範囲: 全階層
- ステータス: Approved
- 最終更新: 2024-02-17

## 原則の定義

**すべてのユーザーに、通信環境に関わらず、3秒以内に使える状態を提供する**

パフォーマンスはUXの一部であり、アクセシビリティの問題でもあります。低速回線のユーザーを排除しない設計を。

## パフォーマンス目標

### Core Web Vitals

Googleが定義する3つの指標。SEOにも影響。

| 指標 | 説明 | 目標値 |
|------|------|--------|
| **LCP** (Largest Contentful Paint) | 最大コンテンツの表示時間 | **2.5秒以内** |
| **FID** (First Input Delay) | 初回入力の遅延 | **100ms以内** |
| **CLS** (Cumulative Layout Shift) | レイアウトのずれ | **0.1未満** |

### その他の重要指標

| 指標 | 説明 | 目標値 |
|------|------|--------|
| **FCP** (First Contentful Paint) | 最初のコンテンツ表示 | 1.8秒以内 |
| **TTI** (Time to Interactive) | 操作可能になるまで | 3.8秒以内 |
| **Total Page Size** | ページ全体のサイズ | 1MB以内（理想）|

## 最適化の優先順位

### 1. 画像の最適化（最も効果が高い）

```
✅ 必須対応:
- WebP形式を使用（JPEGより25〜35%小さい）
- srcsetでレスポンシブ画像
- loading="lazy"で遅延読み込み
- 適切なサイズにリサイズ（原寸大を避ける）

目標:
- ヒーロー画像: 200KB以下
- カード画像: 50KB以下
- アイコン: SVGを使用（10KB以下）
```

→ [Imagery: Quality & Optimization](../../content/imagery/quality-optimization.md) 参照

### 2. JavaScriptの削減

```
✅ 対応:
- 未使用コードの削除（Tree Shaking）
- Code Splitting（ルート別に分割）
- 重いライブラリを避ける（moment.js → date-fns等）
- defer / async で非同期読み込み

目標:
- 初回JSバンドル: 200KB以下（gzip後）
```

**例: Code Splitting**
```javascript
// ❌ 全部を最初に読み込む
import { HeavyComponent } from './heavy';

// ✅ 必要になったら読み込む
const HeavyComponent = lazy(() => import('./heavy'));
```

### 3. CSSの最適化

```
✅ 対応:
- Critical CSS（初回表示に必要なCSSのみ<head>に）
- 未使用CSSの削除（PurgeCSS等）
- CSS圧縮

目標:
- Critical CSS: 14KB以下（初回レンダリングを高速化）
```

### 4. フォントの最適化

```
✅ 対応:
- WOFF2形式を使用
- font-display: swap（フォント読み込み中もテキスト表示）
- サブセット化（使う文字だけ含める）
- 変数フォント（複数ウェイトを1ファイルに）

目標:
- フォント合計: 100KB以下
```

```css
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap; /* 重要: フォント読み込み中もテキストを表示 */
}
```

## リソース読み込みの最適化

### preload / prefetch

```html
<!-- Critical リソースを優先読み込み -->
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/hero.webp" as="image" />

<!-- 次のページで使うリソースを先読み -->
<link rel="prefetch" href="/next-page.js" />
```

**使い分け**:
- `preload`: **現在のページで確実に使う**重要リソース（フォント・ヒーロー画像）
- `prefetch`: 次のページで使うかもしれないリソース

### defer / async

```html
<!-- 推奨: defer（順序を保ちつつ非同期読み込み） -->
<script src="/app.js" defer></script>

<!-- async（順序不問の独立スクリプト・Analytics等） -->
<script src="/analytics.js" async></script>

<!-- ❌ 何もなし（HTML解析をブロックする） -->
<script src="/app.js"></script>
```

## キャッシュ戦略

### Cache-Control ヘッダー

```
静的アセット（CSS/JS/画像）:
  Cache-Control: public, max-age=31536000, immutable
  → 1年間キャッシュ、ファイル名にハッシュを含める

HTML:
  Cache-Control: no-cache
  → 毎回サーバーに確認（更新をすぐ反映）

API:
  Cache-Control: private, max-age=300
  → 5分間キャッシュ（ユーザー固有データ）
```

### Service Worker

```javascript
// オフライン対応・高速化
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
```

## レンダリング最適化

### Cumulative Layout Shift (CLS) の防止

```html
<!-- ❌ 画像のサイズ未指定 → 読み込み後にレイアウトがずれる -->
<img src="image.jpg" alt="..." />

<!-- ✅ サイズを明示 → ずれない -->
<img src="image.jpg" alt="..." width="800" height="600" />

<!-- または aspect-ratio を使う -->
<img src="image.jpg" alt="..." style="aspect-ratio: 16/9; width: 100%;" />
```

**広告・埋め込みコンテンツ**:
```css
/* プレースホルダーで領域を確保 */
.ad-container {
  min-height: 250px; /* 広告が読み込まれる前から領域を確保 */
}
```

### First Input Delay (FID) の改善

```javascript
// ❌ メインスレッドをブロックする重い処理
function processHugeData(data) {
  // 100msを超える処理
}
processHugeData(data);

// ✅ Web Workerで別スレッド処理
const worker = new Worker('worker.js');
worker.postMessage(data);
worker.onmessage = (e) => {
  // 処理結果を受け取る
};
```

## 測定ツール

### Lighthouse（Chrome DevTools）

```
1. Chrome DevToolsを開く
2. Lighthouseタブ
3. "Generate report"

確認項目:
- Performance Score（90以上が理想）
- Core Web Vitals
- 改善提案
```

### WebPageTest

```
https://www.webpagetest.org/

世界各地・様々な回線速度でテスト可能
- 3G回線でのテスト → 低速環境の確認
```

### Chrome UX Report (CrUX)

```
実際のユーザーの体験データ（フィールドデータ）
Google Search Consoleで確認可能
```

## チェックリスト

### 画像
- [ ] WebP形式を使用
- [ ] srcset実装
- [ ] loading="lazy"
- [ ] 適切なサイズにリサイズ

### JavaScript
- [ ] Code Splitting実装
- [ ] 未使用コード削除
- [ ] defer/async使用
- [ ] 初回バンドル200KB以下

### CSS
- [ ] Critical CSS抽出
- [ ] 未使用CSS削除
- [ ] CSS圧縮

### フォント
- [ ] WOFF2形式
- [ ] font-display: swap
- [ ] 合計100KB以下

### Core Web Vitals
- [ ] LCP 2.5秒以内
- [ ] FID 100ms以内
- [ ] CLS 0.1未満

## 関連ドキュメント

- [Browser Support](./browser-support.md): ブラウザサポート
- [SEO](./seo.md): SEO最適化
- **[Imagery: Quality & Optimization](../../content/imagery/quality-optimization.md)**: 画像最適化
- **[Responsiveness](../../foundation/responsiveness.md)**: レスポンシブ対応

## バージョン履歴

| 日付 | バージョン | 変更内容 | 変更理由 |
|------|-----------|----------|----------|
| 2024-02-17 | 1.0.0 | 初版作成 | Phase 4 |
