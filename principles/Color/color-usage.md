# カラー使用ガイド

## メタ情報
- カテゴリ: カラー原則
- 適用範囲: 全階層
- ステータス: Approved
- 最終更新: 2024-01-15

## 原則の定義

**定義されたカラーパレットを適切なコンテキストで使用する**

## コンポーネント別の使用

### Button

| バリアント | 背景 | テキスト | ボーダー |
|-----------|------|---------|---------|
| Primary | brand-600 | white | - |
| Secondary | transparent | neutral-900 | neutral-300 |
| Destructive | transparent | error-600 | error-600 |

### Alert/Notification

| タイプ | 背景 | ボーダー | アイコン | テキスト |
|--------|------|---------|---------|---------|
| Success | success-50 | success-600 | success-600 | neutral-900 |
| Error | error-50 | error-600 | error-600 | neutral-900 |
| Warning | warning-50 | warning-600 | warning-600 | neutral-900 |
| Info | info-50 | info-600 | info-600 | neutral-900 |

### Form

| 要素 | 状態 | 色 |
|------|------|-----|
| Input border | Default | neutral-300 |
| Input border | Focus | brand-600 |
| Input border | Error | error-600 |
| Label | Default | neutral-700 |
| Help text | Default | neutral-600 |
| Error text | Error | error-600 |

## アクセシビリティ

- テキストと背景: 最低4.5:1（AA）
- UIコンポーネント: 最低3:1
- 色だけに依存しない

→ 詳細は [Color Contrast](../foundation/accessibility/color-contrast.md)

## 関連ドキュメント

- [Semantic Colors](./semantic-colors.md)
- [Brand Colors](./brand-colors.md)
- [Button Priority](../interaction/button/priority.md)

## バージョン履歴

| 日付 | バージョン | 変更内容 | 変更理由 |
|------|-----------|----------|----------|
| 2024-01-15 | 1.0.0 | 初版作成 | color-meaning.mdから分離 |
