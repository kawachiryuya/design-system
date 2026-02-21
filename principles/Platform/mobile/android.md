# Android固有の考慮事項

## メタ情報
- カテゴリ: プラットフォーム原則 > Mobile
- 適用範囲: 全階層
- ステータス: Approved
- 最終更新: 2024-02-17

## 原則の定義

**Material Designの原則を尊重し、Androidユーザーが期待する操作感・視覚言語を提供する**

## Material Design

Googleが策定したデザインシステム。Android標準。

**主な特徴**:
- **Elevation（高さ）**: 影で要素の重なりを表現
- **Ripple Effect**: タップ時の波紋エフェクト
- **FAB（Floating Action Button）**: 画面右下の円形ボタン

### Elevation（影）

```css
/* Material Designの影レベル */
.card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1),
              0 1px 2px rgba(0, 0, 0, 0.06); /* Elevation 2 */
}

.modal {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15),
              0 3px 6px rgba(0, 0, 0, 0.1); /* Elevation 8 */
}

.fab {
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.14),
              0 1px 18px rgba(0, 0, 0, 0.12); /* Elevation 6 */
}
```

**レベルの目安**:
- 0: 背景・ベース
- 2: カード
- 4: ボタン（通常時）
- 6: FAB
- 8: ダイアログ・モーダル
- 16: ナビゲーションドロワー

### Ripple Effect

```css
/* タップ時の波紋エフェクト */
.button {
  position: relative;
  overflow: hidden;
}

.button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.button:active::after {
  width: 300px;
  height: 300px;
}
```

## タッチターゲットサイズ

```
Material Design:
- 最小: 48dp × 48dp（= 48px × 48px）

隣接する要素間: 最低8dp（8px）の余白
```

→ [Touch Targets](../../foundation/accessibility/touch-targets.md) 参照

## Android特有のUI要素

### ナビゲーションドロワー

画面左端から右にスワイプ → メニューが開く

```
✅ 配置:
- 画面左端（iOSのスワイプバックとは逆）
- 幅: 画面幅の80%（最大320dp）

構成:
- ヘッダー（アカウント情報）
- メニュー項目
- フッター（設定・ログアウト）
```

### FAB（Floating Action Button）

```
配置: 画面右下（16dp余白）
サイズ: 56dp × 56dp（標準）/ 40dp × 40dp（小）

用途: 最も重要なアクション（+新規作成、編集ボタン等）

⚠️ 注意:
- 1画面に1つのみ
- スクロールしても固定表示
```

### Bottom Navigation

```
配置: 画面下部固定
項目数: 3〜5個（推奨）
アイコン + ラベルのセット

用途: 主要な画面間の切り替え
```

### Snackbar（トースト通知のAndroid版）

```
配置: 画面下部（FABの上）
表示時間: 4秒〜7秒
アクション: 最大1つ（「元に戻す」等）

iOSのトーストとの違い:
- 下部配置（iOSは上部または下部）
- アクションボタンを含められる
```

## システムバー（ステータスバー・ナビゲーションバー）

### ステータスバーの色

```html
<meta name="theme-color" content="#1976d2" />
```

Androidのステータスバー（上部の時刻・バッテリー表示部分）の色を変更できる。

### ナビゲーションバーの色

```css
/* Android 15以降 */
body {
  background-color: #ffffff;
}
```

画面下部のナビゲーションバー（戻る・ホーム・履歴ボタン）の背景色は、ページ背景色に自動適応する。

### ジェスチャーナビゲーション

Android 10以降、ジェスチャーナビゲーションがデフォルト。

```
操作:
- 画面下部から上にスワイプ → ホーム
- 画面左右端から内側にスワイプ → 戻る
```

**注意**: 画面端のスワイプ操作は、戻る操作と競合する可能性がある。

## フォント

### Roboto

```css
body {
  font-family: "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
```

Androidのシステムフォント。

**Roboto Flexの採用**:
Android 12以降、可変フォント「Roboto Flex」に移行。

```css
@import url('https://fonts.googleapis.com/css2?family=Roboto+Flex:wght@400;500;700&display=swap');

body {
  font-family: "Roboto Flex", sans-serif;
}
```

## PWA対応（Trusted Web Activity）

AndroidはPWAのネイティブアプリ化が進んでいる。

```html
<!-- マニフェストファイル -->
<link rel="manifest" href="/manifest.json" />

<!-- theme-color -->
<meta name="theme-color" content="#1976d2" />
```

**manifest.json**:
```json
{
  "name": "アプリ名",
  "short_name": "短縮名",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1976d2",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**アイコンサイズ**:
- 192 × 192px（必須）
- 512 × 512px（必須）
- マスク可能アイコン（adaptive icon）も推奨

## ハプティクスフィードバック

```javascript
// 振動
if ('vibrate' in navigator) {
  navigator.vibrate(50); // 50ms振動
}

// パターン振動
navigator.vibrate([100, 50, 100]); // 振動・休止・振動
```

**用途**:
- ボタンタップ: 10ms
- 重要アクション: 50ms
- エラー: [50, 100, 50]（パターン）

## バックボタンの処理

Androidには物理的な「戻る」ボタンがある（またはジェスチャー）。

```javascript
// 戻るボタンのイベントをハンドリング
window.addEventListener('popstate', (event) => {
  // モーダルが開いている場合は、ページ遷移せずにモーダルを閉じる
  if (modalOpen) {
    closeModal();
    event.preventDefault();
  }
});
```

## Android版Chromeの特徴

```
✅ メリット:
- 最新のWeb標準に対応
- 高速レンダリング
- デバッグツールが充実

⚠️ 注意:
- デバイスごとのAndroidバージョンでWebViewが異なる
- 古いAndroidではChrome非対応の可能性
```

## チェックリスト

- [ ] Material Designの影レベル使用
- [ ] Ripple Effect実装
- [ ] タッチターゲット48px以上
- [ ] theme-color設定
- [ ] Robotoフォント使用
- [ ] PWA manifest.json設置
- [ ] FAB配置（右下）
- [ ] バックボタンハンドリング

## 関連ドキュメント

- [iOS](./ios.md): iOS固有の考慮
- [Native Patterns](./native-patterns.md): ネイティブUI慣習
- **[Touch Targets](../../foundation/accessibility/touch-targets.md)**: タッチサイズ
- **[Gestures](../../interaction/gestures/overview.md)**: ジェスチャー操作
- **[Responsiveness](../../foundation/responsiveness.md)**: レスポンシブ対応

## バージョン履歴

| 日付 | バージョン | 変更内容 | 変更理由 |
|------|-----------|----------|----------|
| 2024-02-17 | 1.0.0 | 初版作成 | Phase 4 |
