# インタラクティブ状態

## メタ情報
- カテゴリ: インタラクション原則 > States
- 適用範囲: Atom〜Organism
- ステータス: Approved
- 最終更新: 2024-01-15

## 原則の定義

**ユーザーの操作に応じて変化する状態を明確に表現し、操作可能性をフィードバックする**

## 基本の4状態

### 1. Default（デフォルト）

**定義**: 通常の、何も操作されていない状態

**視覚的特徴**:
- ベースカラー
- 適度な視覚的手がかり

**用途**: 静止画面、初期表示時

### 2. Hover（ホバー）

**定義**: マウスカーソルが要素上にある状態

**視覚的特徴**:
- わずかな色の変化（10-20%明るく/暗く）
- カーソル: pointer
- オプション: シャドウ、拡大

**設計根拠**: 「クリックできる」フィードバック

**注意**: モバイルでは不使用。Hoverだけに依存しない。

### 3. Focus（フォーカス）

**定義**: キーボードでフォーカスされている状態

**視覚的特徴**:
- 2px境界線、コントラスト比3:1以上（WCAG）
- 要素全体を囲む、またはアウトライン
- オプション: 背景色変化

**設計根拠**: キーボードユーザーへの現在位置の明示

**ARIA**:
```html
<button :focus-visible>
  <!-- 自動フォーカス表示 -->
</button>
```

### 4. Active（アクティブ）

**定義**: マウス押下中、またはタッチ中

**視覚的特徴**:
- Hoverより明確な色変化
- わずかな縮小（押し込まれた印象）
- シャドウ減少

**期間**: 非常に短い（通常<100ms）

## 状態の優先度

複数の状態が同時に適用される場合の優先順位:

```
Disabled > Active > Focus > Hover > Default
```

例:
- Disabled時: 他の状態を上書き
- Focus + Hover: 両方適用（Focusを優先）

## モバイル対応

### タッチ状態

モバイルでは:
- Hover: 存在しない
- Active: タッチ中に表示
- Focus: ソフトウェアキーボード使用時

### リップル効果

Material Designのようなリップルエフェクトで視覚的フィードバック。

## 実装パターン

### CSS

```css
button {
  /* Default */
  background: #3b82f6;
  transition: all 150ms ease;
}

button:hover {
  background: #2563eb;
}

button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

button:active {
  background: #1d4ed8;
  transform: scale(0.98);
}
```

### React

```typescript
const [isHovered, setIsHovered] = useState(false);
const [isFocused, setIsFocused] = useState(false);

<button
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
  onFocus={() => setIsFocused(true)}
  onBlur={() => setIsFocused(false)}
  className={cn(
    'base-styles',
    isHovered && 'hover-styles',
    isFocused && 'focus-styles'
  )}
>
```

## チェックリスト

- [ ] すべての状態が明確に区別できる
- [ ] Focusインジケーターがコントラスト比3:1以上
- [ ] Hoverだけに依存していない
- [ ] モバイルでタッチフィードバックあり
- [ ] トランジションが滑らか（150-200ms）

## 関連ドキュメント

- [Overview](./overview.md)
- [Status States](./status-states.md)
- [Focus Management](../../foundation/accessibility/focus-management.md)

## バージョン履歴

| 日付 | バージョン | 変更内容 | 変更理由 |
|------|-----------|----------|----------|
| 2024-01-15 | 1.0.0 | 初版作成 | states.mdから分離 |
