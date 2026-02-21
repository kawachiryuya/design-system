# 状態（States）概要

## メタ情報
- カテゴリ: インタラクション原則
- 適用範囲: Atom〜Organism
- ステータス: Approved
- 最終更新: 2024-01-15

## 原則の定義

**インタラクティブ要素のすべての状態を明確に定義し、状態間の遷移を予測可能かつ一貫性のある形で実装する**

状態管理は、ユーザーがシステムの現在の状況を理解し、次に何が起こるかを予測できるようにするための重要な要素です。

## なぜこの原則が必要か

不明確な状態管理による問題:

- **ユーザーの混乱**: 現在何が起きているのかが分からない
- **誤操作**: 押せるように見えるのに反応しない
- **フラストレーション**: ローディング中なのかフリーズなのか不明
- **アクセシビリティの欠如**: 支援技術が状態を認識できない

## 状態の2つのカテゴリ

### 1. Interactive States（インタラクティブ状態）

ユーザーの操作に応じて変化する状態。

- **Default**: 通常状態
- **Hover**: マウスオーバー
- **Focus**: キーボードフォーカス
- **Active**: 押下中

→ 詳細は [Interactive States](./interactive-states.md)

### 2. Status States（ステータス状態）

システムやコンテンツの状態を示す。

- **Loading**: 処理中
- **Success**: 成功
- **Error**: エラー
- **Disabled**: 無効

→ 詳細は [Status States](./status-states.md)

## 状態遷移

状態間の遷移は滑らかで予測可能である必要がある。

→ 詳細は [State Transitions](./state-transitions.md)

## この章のドキュメント

### [1. Interactive States](./interactive-states.md)
hover, focus, active等のインタラクティブ状態

### [2. Status States](./status-states.md)
loading, error, success, disabled等のステータス状態

### [3. State Transitions](./state-transitions.md)
状態遷移のルールとアニメーション

## 推奨読書順序

1. 概要（このページ）
2. interactive-states.md
3. status-states.md
4. state-transitions.md

## 関連原則

- [Button Priority](../button/priority.md)
- [Color Meaning](../../color/color-meaning.md)
- [Accessibility](../../foundation/accessibility/overview.md)

## バージョン履歴

| 日付 | バージョン | 変更内容 | 変更理由 |
|------|-----------|----------|----------|
| 2024-01-15 | 1.0.0 | 初版作成 | states.mdから分離 |
