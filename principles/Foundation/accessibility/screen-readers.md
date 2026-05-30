# スクリーンリーダー対応

## メタ情報
- カテゴリ: 基盤原則 > アクセシビリティ
- 適用範囲: 全階層
- ステータス: Approved
- 最終更新: 2024-01-15

## 原則の定義

**スクリーンリーダーユーザーが、視覚的情報と同等の情報を音声で得られるようにする**

## ARIA属性の使用

### 基本原則

1. **ネイティブHTML優先**: `<button>`、`<input>`等を優先
2. **ARIAは補完**: HTMLで表現できない場合のみ
3. **役割の明示**: role属性
4. **状態の通知**: aria-expanded、aria-selected等
5. **関係性の定義**: aria-labelledby、aria-describedby

## 主要なARIA属性

### ラベル付け

- `aria-label`: 要素自体にラベル
- `aria-labelledby`: 他要素のテキストを参照  
- `aria-describedby`: 補足説明を関連付け

### 状態

- `aria-expanded`: 開閉状態
- `aria-selected`: 選択状態
- `aria-checked`: チェック状態
- `aria-disabled`: 無効状態
- `aria-hidden`: 支援技術から隠す
- `aria-current`: 現在位置

### ライブリージョン

- `aria-live="polite|assertive"`: 更新通知レベル
- `aria-atomic`: 領域全体を読み上げるか
- `role="status"`: 状態メッセージ
- `role="alert"`: 重要な通知

## ランドマーク

```html
<header role="banner">
<nav role="navigation" aria-label="メイン">
<main role="main">
<aside role="complementary">
<footer role="contentinfo">
```

## 代替テキスト

### 画像

```html
<!-- 情報を伝える画像 -->
<img src="chart.png" alt="2024年売上推移。30%増加" />

<!-- 装飾的な画像 -->
<img src="decoration.png" alt="" role="presentation" />

<!-- 複雑な図表 -->
<figure>
  <img src="chart.png" alt="市場シェア分析" 
       aria-describedby="desc" />
  <figcaption id="desc">
    当社35%、B社28%、C社20%、その他17%
  </figcaption>
</figure>
```

## 関連ドキュメント

- [Keyboard Navigation](./keyboard-navigation.md)
- [Testing](./testing.md)

## バージョン履歴

| 日付 | バージョン | 変更内容 | 変更理由 |
|------|-----------|----------|----------|
| 2024-01-15 | 1.0.0 | 初版作成 | accessibility.mdから分離 |
