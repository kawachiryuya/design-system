# アイコンサイズ

## メタ情報
- カテゴリ: コンテンツ原則 > Iconography
- 適用範囲: Atom〜Organism
- ステータス: Approved
- 最終更新: 2024-02-17

## 原則の定義

**アイコンのサイズは、隣接するテキストサイズまたはコンテキストに合わせる**

## サイズ定義

```typescript
const iconSizes = {
  xs:  12,  // 補足テキスト（Caption）と組み合わせ
  sm:  16,  // 本文テキスト（Body）と組み合わせ
  md:  20,  // UI要素の標準サイズ（ボタン内等）
  lg:  24,  // 見出しや強調要素と組み合わせ
  xl:  32,  // 大きなCTA・ヒーロー要素
  '2xl': 48, // 空状態・イラスト的な用途
};
```

## テキストとの対応

| テキストサイズ | 推奨アイコンサイズ |
|-------------|----------------|
| Caption (12px) | xs (12px) |
| Body SM (14px) | sm (16px) |
| Body (16px) | sm〜md (16〜20px) |
| H3 (20px) | md〜lg (20〜24px) |
| H2以上 | lg〜xl (24〜32px) |

**理由**: アイコンがテキストより大きすぎると視覚的なバランスが崩れる。基本はテキストと同じ高さか、わずかに大きい程度。

## コンテキスト別の使い方

### ボタン内

```
Primary Button（height: 40px）: md (20px)
Small Button（height: 32px）:   sm (16px)
Large Button（height: 48px）:   lg (24px)

[⬇ ダウンロード]  ← アイコン(20px) + テキスト
```

### インプット内

```
Input（height: 40px）: sm〜md (16〜20px)

[🔍________________]  ← 左端にsm(16px)
[________________ ✕]  ← 右端にsm(16px)（クリア）
```

### ナビゲーション

```
サイドバーナビ: md〜lg (20〜24px)
タブバー（モバイル）: lg (24px)
```

### 空状態・エラーページ

```
2xl (48px) 以上を使用。
テキストより明らかに大きく、視覚的なアンカーにする。
```

## タッチターゲットとの関係

アイコン自体が小さくても、タッチターゲット（クリック・タップ可能な領域）は最小44pxを確保する。

```css
/* アイコンボタンの例 */
.icon-button {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* アイコン自体は小さくてよい */
.icon-button svg {
  width: 20px;
  height: 20px;
}
```

→ [Touch Targets](../../foundation/accessibility/touch-targets.md) 参照

## チェックリスト

- [ ] 隣接するテキストサイズに合わせたサイズ選択
- [ ] ボタン内アイコンはボタンサイズに対応したサイズ
- [ ] タッチターゲットが最小44px確保

## 関連ドキュメント

- [Overview](./overview.md)
- [Styles](./styles.md)
- [Touch Targets](../../foundation/accessibility/touch-targets.md)

## バージョン履歴

| 日付 | バージョン | 変更内容 | 変更理由 |
|------|-----------|----------|----------|
| 2024-02-17 | 1.0.0 | 初版作成 | Phase 2 |
