# ブラウザサポート方針

## メタ情報
- カテゴリ: プラットフォーム原則 > Web
- 適用範囲: 全階層
- ステータス: Approved
- 最終更新: 2024-02-17

## 原則の定義

**対応ブラウザを明確に定義し、Progressive Enhancementのアプローチで、すべてのユーザーに基本機能を提供する**

## サポートブラウザの定義

### Tier 1: フルサポート（完全対応）

最新の機能・最適化されたパフォーマンス・すべてのビジュアルが意図通りに動作する。

```
デスクトップ:
- Chrome (最新版 & 最新-1)
- Firefox (最新版 & 最新-1)
- Safari (最新版 & 最新-1)
- Edge (最新版 & 最新-1)

モバイル:
- iOS Safari (最新版 & 最新-1)
- Chrome for Android (最新版 & 最新-1)
```

**「最新-1」の意味**: 最新版がリリースされても、前バージョンを使い続けるユーザーがいるため1バージョン前もサポート。

### Tier 2: 基本サポート（機能的に動作）

コア機能は動作するが、最新のCSS・JSの一部機能は使えない。見た目が若干異なる場合がある。

```
- Chrome (最新-2〜最新-5)
- Firefox (最新-2〜最新-5)
- Safari (最新-2〜最新-5)
- Edge (最新-2〜最新-5)
```

### Tier 3: レガシーサポート（読める・使える）

装飾は簡素だが、コンテンツにアクセスでき、基本的な操作ができる。

```
- IE11（企業環境で残存）
  → サポート終了済みだが、一部企業で使用継続
  → 基本機能のみ提供、モダンUIは諦める
```

**判断基準**: アクセスログで **全体の1%未満** になったブラウザは、サポート対象から外すことを検討する。

## Progressive Enhancement（段階的拡張）

新しいブラウザほど豊かな体験、古いブラウザでも基本機能は提供。

### レイヤー1: HTML（すべてのブラウザ）

```html
<!-- セマンティックなHTMLで構造を作る -->
<form action="/submit" method="POST">
  <label for="email">メール</label>
  <input type="email" id="email" name="email" required />
  <button type="submit">送信</button>
</form>
```

すべてのブラウザで動作する。CSSやJSが無効でも機能する。

### レイヤー2: CSS（モダンブラウザ）

```css
/* モダンブラウザ向けの装飾 */
.button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* レガシーブラウザ向けのフォールバック */
.button {
  background: #667eea; /* グラデーション非対応でも単色表示 */
}
```

### レイヤー3: JavaScript（インタラクション強化）

```javascript
// 機能検出してから拡張
if ('IntersectionObserver' in window) {
  // 遅延読み込みを有効化
  const observer = new IntersectionObserver(callback);
} else {
  // フォールバック: すべての画像を即座に読み込む
  images.forEach(img => img.src = img.dataset.src);
}
```

## 機能の実装戦略

### @supports による分岐

```css
/* すべてのブラウザ: フォールバック */
.grid {
  display: block;
}

/* CSS Grid対応ブラウザのみ */
@supports (display: grid) {
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
}
```

### Polyfill の使用

```javascript
// IntersectionObserver Polyfill（IE11用）
if (!('IntersectionObserver' in window)) {
  // Polyfillを読み込む
  import('intersection-observer');
}
```

**ルール**: Polyfillは必要最小限に。重いPolyfillはパフォーマンスに影響する。

### Transpile（Babel）

```javascript
// モダンJS（Optional Chaining）
const userName = user?.profile?.name;

// ↓ Babelでトランスパイル

// ES5互換コード
var userName = user && user.profile && user.profile.name;
```

## ブラウザ別の注意点

### Safari（iOS含む）

```
✅ 長所:
- プライバシー重視
- パフォーマンスが高い

⚠️ 注意:
- CSS Gridの一部機能が遅れて実装された
- 日付入力（<input type="date">）の挙動が独特
- position: sticky の挙動が異なる場合がある
- 100vh がアドレスバーの高さを含む（モバイル）
```

**対応**:
```css
/* Safari用の100vh修正 */
.full-height {
  height: 100vh;
  height: -webkit-fill-available;
}
```

### Firefox

```
✅ 長所:
- Web標準への準拠度が高い
- 開発ツールが優秀

⚠️ 注意:
- スクロールバーのスタイリングがChromiumと異なる
- flexboxの一部挙動が微妙に違う
```

### IE11（レガシー）

```
⚠️ 対応方針:
- CSS Grid → Flexboxで代替
- CSS Variables → Sass変数で代替
- Fetch API → Polyfill または XMLHttpRequest
- Promise → Polyfill
- Arrow Function → Babel
- let/const → var に変換
```

**実装例**:
```html
<!-- IE11向けのPolyfill読み込み -->
<script nomodule src="/polyfills.js"></script>

<!-- モダンブラウザはこちら -->
<script type="module" src="/app.js"></script>
```

## テスト方法

### 実機テスト

```
最低限テストすべき環境:
- Windows Chrome（最新版）
- macOS Safari（最新版）
- iOS Safari（iPhone実機）
- Android Chrome（実機またはエミュレータ）
```

### BrowserStack / Sauce Labs

実機を持っていないブラウザ・OS組み合わせをクラウドでテスト。

### Can I Use

```
https://caniuse.com/

使用前にチェック:
- CSS Grid
- flexbox
- CSS Variables
- IntersectionObserver
- Fetch API
```

## チェックリスト

- [ ] Tier 1ブラウザで完全動作を確認
- [ ] Tier 2ブラウザで基本機能を確認
- [ ] Tier 3（IE11）で読める・使えるを確認
- [ ] @supports でフォールバックを提供
- [ ] モダン機能に機能検出を追加
- [ ] Can I Useで対応状況を確認

## 関連ドキュメント

- [Performance](./performance.md): パフォーマンス最適化
- [SEO](./seo.md): 検索エンジン最適化
- **[Responsiveness](../../foundation/responsiveness.md)**: レスポンシブ対応
- **[Accessibility](../../foundation/accessibility/overview.md)**: アクセシビリティ

## バージョン履歴

| 日付 | バージョン | 変更内容 | 変更理由 |
|------|-----------|----------|----------|
| 2024-02-17 | 1.0.0 | 初版作成 | Phase 4 |
