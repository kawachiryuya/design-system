# iOS固有の考慮事項

## メタ情報
- カテゴリ: プラットフォーム原則 > Mobile
- 適用範囲: 全階層
- ステータス: Approved
- 最終更新: 2024-02-17

## 原則の定義

**iOS Human Interface Guidelinesに従い、iOSユーザーが期待する操作感・視覚言語を提供する**

## SafeArea（セーフエリア）

iPhone X以降、画面の上下に切り欠き（ノッチ）やホームインジケーターがあるため、コンテンツがそれらに重ならないようにする。

```css
/* SafeAreaに対応 */
.header {
  padding-top: env(safe-area-inset-top);
}

.footer {
  padding-bottom: env(safe-area-inset-bottom);
}

.sidebar {
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

**viewport設定**:
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
                                                                    ↑ 重要
```

`viewport-fit=cover` がないとSafeAreaが適用されない。

## タッチターゲットサイズ

```
iOS Human Interface Guidelines:
- 最小: 44pt × 44pt（= 44px × 44px）
- 推奨: 48pt × 48pt

隣接する要素間: 最低8pt（8px）の余白
```

→ [Touch Targets](../../foundation/accessibility/touch-targets.md) 参照

## iOS特有のUI要素

### スワイプバック

画面左端から右にスワイプ → 前の画面に戻る

```
✅ 尊重すべき慣習:
- ページ遷移でスワイプバックを妨げない
- モーダル・ドロワーは例外（閉じない）

⚠️ 注意:
横スクロールカルーセルが画面左端にある場合、スワイプバックと競合する
→ カルーセルは画面中央寄りに配置
```

### プルトゥリフレッシュ

画面を上から引っ張る → 更新

```
iOS標準の挙動:
- リスト最上部から下にスワイプ
- アニメーション付きインジケーター

実装: ネイティブの動作に似せる
```

→ [Gestures: Swipe](../../interaction/gestures/swipe.md) 参照

## フォント

### システムフォント（San Francisco）

```css
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
```

`-apple-system` がiOS/macOSのシステムフォント（San Francisco）を呼び出す。

**特徴**:
- 可読性が高い
- Dynamic Type対応（ユーザーがフォントサイズを変更可能）

### Dynamic Type

iOSユーザーは設定でフォントサイズを変更できる。

```css
/* 相対単位を使う */
body {
  font-size: 1rem; /* 16px基準だが、ユーザー設定で拡大縮小 */
}

/* 固定サイズは避ける */
body {
  font-size: 16px; /* ユーザー設定が反映されない */
}
```

## ホームスクリーンに追加（PWA対応）

```html
<!-- アプリ名 -->
<meta name="apple-mobile-web-app-title" content="アプリ名" />

<!-- スタンドアローン表示（アドレスバーなし） -->
<meta name="apple-mobile-web-app-capable" content="yes" />

<!-- ステータスバーの色 -->
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

<!-- アイコン -->
<link rel="apple-touch-icon" href="/icon-180.png" />
```

**アイコンサイズ**:
- 180 × 180px（必須）
- 透過なし・角丸なし（iOSが自動で角丸にする）

## ハプティクスフィードバック

iOSは触覚フィードバック（バイブレーション）が洗練されている。

```javascript
// Taptic Engine（振動）
if ('vibrate' in navigator) {
  navigator.vibrate(10); // 10ms振動（軽いフィードバック）
}

// 重要なアクション: 50ms
// ボタンタップ: 10ms
```

## -webkit-tap-highlight-color

```css
/* タップ時のデフォルトハイライトを無効化 */
* {
  -webkit-tap-highlight-color: transparent;
}

/* 代わりに独自のフィードバックを実装 */
button:active {
  opacity: 0.7;
  transform: scale(0.97);
}
```

## スクロール

### 慣性スクロール

```css
/* iOSでスムーズな慣性スクロール */
.scrollable {
  -webkit-overflow-scrolling: touch;
  overflow-y: scroll;
}
```

### position: sticky の挙動

iOSのSafariは `position: sticky` の挙動が他ブラウザと微妙に異なる場合がある。

```css
.sticky-header {
  position: -webkit-sticky; /* Safari用プレフィックス */
  position: sticky;
  top: 0;
}
```

## 100vh問題

iOS Safariでは `100vh` にアドレスバーの高さが含まれるため、意図しないスクロールが発生する。

```css
/* 修正 */
.full-height {
  height: 100vh;
  height: -webkit-fill-available; /* iOS Safari用 */
}
```

または JavaScript:
```javascript
// 実際のビューポート高さを取得
const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

// CSS
.full-height {
  height: calc(var(--vh, 1vh) * 100);
}
```

## iOS版Chromeの注意点

iOS版Chromeは内部的にSafariのWebKitを使用しているため、Chromeの機能が一部動作しない。

```
制限:
- WebRTC（一部機能）
- Service Worker（一部制限）
- プッシュ通知（制限あり）
```

## チェックリスト

- [ ] SafeArea対応（env(safe-area-inset-*)）
- [ ] viewport-fit=cover 設定
- [ ] タッチターゲット44px以上
- [ ] システムフォント（-apple-system）使用
- [ ] 相対単位でDynamic Type対応
- [ ] -webkit-tap-highlight-color: transparent
- [ ] 100vh問題の修正
- [ ] PWA対応（apple-touch-icon等）

## 関連ドキュメント

- [Android](./android.md): Android固有の考慮
- [Native Patterns](./native-patterns.md): ネイティブUI慣習
- **[Touch Targets](../../foundation/accessibility/touch-targets.md)**: タッチサイズ
- **[Gestures](../../interaction/gestures/overview.md)**: ジェスチャー操作
- **[Responsiveness](../../foundation/responsiveness.md)**: レスポンシブ対応

## バージョン履歴

| 日付 | バージョン | 変更内容 | 変更理由 |
|------|-----------|----------|----------|
| 2024-02-17 | 1.0.0 | 初版作成 | Phase 4 |
