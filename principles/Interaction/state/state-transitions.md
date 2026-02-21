# 状態遷移

## メタ情報
- カテゴリ: インタラクション原則 > States
- 適用範囲: Atom〜Organism
- ステータス: Approved
- 最終更新: 2024-01-15

## 原則の定義

**状態間の遷移を滑らかにし、予測可能で心地よいユーザー体験を提供する**

## トランジション時間

### 推奨値

| 遷移タイプ | 時間 | 用途 |
|-----------|------|------|
| 高速 | 100-150ms | Hover, Focus |
| 標準 | 200-300ms | 展開/折りたたみ |
| 低速 | 300-500ms | ページ遷移、大きな変化 |

### 設計根拠

- **100ms以下**: 瞬時と感じる
- **100-300ms**: 滑らか、自然
- **300ms以上**: 明確な動き、注意を引く
- **1000ms以上**: 遅いと感じる、ストレス

## イージング関数

### 推奨値

```css
/* 標準 */
transition: all 200ms ease-in-out;

/* 進入 */
transition: all 200ms ease-out;

/* 退出 */
transition: all 150ms ease-in;

/* バウンス（特別な場合のみ） */
transition: all 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### イージングの選択

- **ease-in-out**: 汎用、自然
- **ease-out**: 進入時（フェードイン、スライドイン）
- **ease-in**: 退出時（フェードアウト、スライドアウト）
- **linear**: 進捗バー、スピナー

## 状態遷移パターン

### Default ↔ Hover

```css
button {
  background: #3b82f6;
  transition: background 150ms ease;
}

button:hover {
  background: #2563eb;
}
```

**時間**: 150ms（高速）

### Hover → Active → Default

```css
button:active {
  background: #1d4ed8;
  transform: scale(0.98);
  transition: all 100ms ease-in;
}
```

**時間**: 100ms（瞬時）

### Loading → Success → Default

```
1. ボタンクリック → Loading（瞬時）
2. 処理完了 → Success（200ms）
3. 2秒後 → Default（300ms フェードアウト）
```

### Error表示

```
1. エラー発生 → Error表示（200ms スライドイン）
2. ユーザーが修正 → Error消去（200ms フェードアウト）
```

## 複数要素の遷移

### スタガー（段階的アニメーション）

リスト項目等を順番にアニメーション。

```css
.list-item {
  opacity: 0;
  animation: fadeIn 300ms ease-out forwards;
}

.list-item:nth-child(1) { animation-delay: 0ms; }
.list-item:nth-child(2) { animation-delay: 50ms; }
.list-item:nth-child(3) { animation-delay: 100ms; }

@keyframes fadeIn {
  to { opacity: 1; }
}
```

**ディレイ**: 50-100ms間隔

## モバイルでの考慮

### パフォーマンス

- transform, opacityのみアニメーション（GPUアクセラレーション）
- width, height等のレイアウト変更は避ける

### タッチフィードバック

```css
button:active {
  transform: scale(0.95);
  transition: transform 100ms ease-out;
}
```

## アクセシビリティ

### prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

ユーザーが「アニメーション削減」を設定している場合、アニメーションを最小化。

## チェックリスト

- [ ] トランジション時間が適切（100-300ms）
- [ ] イージング関数が自然
- [ ] Hover等の高頻度な遷移は高速（100-150ms）
- [ ] prefers-reduced-motion対応
- [ ] パフォーマンス考慮（transform, opacityのみ）

## 関連ドキュメント

- [Overview](./overview.md)
- [Interactive States](./interactive-states.md)
- [Motion Overview](../../motion/overview.md) (未作成)

## バージョン履歴

| 日付 | バージョン | 変更内容 | 変更理由 |
|------|-----------|----------|----------|
| 2024-01-15 | 1.0.0 | 初版作成 | states.mdから分離 |
