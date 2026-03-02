# Alert

**分類**: Composite

アイコン・タイトル・本文・閉じるボタンを組み合わせたインラインアラート。

---

## Props

| Prop | Type | Default | 説明 |
|------|------|---------|------|
| `variant` | `'success' \| 'error' \| 'warning' \| 'info' \| 'neutral'` | `'info'` | セマンティックカラーバリアント |
| `title` | `string` | - | アラートのタイトル |
| `children` | `React.ReactNode` | **必須** | アラートの本文 |
| `onClose` | `() => void` | - | 閉じるボタンのハンドラー（省略時は非表示） |
| `hideIcon` | `boolean` | `false` | アイコンを非表示にする |
| `className` | `string` | `''` | 追加CSSクラス |

---

## 使用例

### 基本

```tsx
import { Alert } from '@/components/Alert';

<Alert variant="info">お知らせがあります。</Alert>
```

### タイトル付き

```tsx
<Alert variant="success" title="保存しました">
  変更内容が正常に保存されました。
</Alert>
```

### 閉じるボタン付き

```tsx
<Alert variant="warning" title="注意" onClose={() => setVisible(false)}>
  この操作は取り消せません。
</Alert>
```

### バリアント

```tsx
<Alert variant="success">成功メッセージ</Alert>
<Alert variant="error">エラーメッセージ</Alert>
<Alert variant="warning">警告メッセージ</Alert>
<Alert variant="info">情報メッセージ</Alert>
<Alert variant="neutral">補足情報</Alert>
```

---

## デザイン原則

### バリアントの使い分け

- **success**: 操作の完了・保存成功など肯定的なフィードバック
- **error**: 入力エラー・処理失敗など対処が必要な状態
- **warning**: 注意喚起・取り消し不可の操作の確認
- **info**: 一般的なお知らせ・補足情報
- **neutral**: 特に緊急度のない参考情報

参照: [principles/color/semantic-colors.md](../../principles/color/semantic-colors.md)

### フィードバック

- アラートは即座にユーザーへフィードバックを返す手段として使用する
- 一時的な通知には Toast（未実装）、永続的な情報には Alert を使い分ける

参照: [principles/interaction/feedback/](../../principles/interaction/feedback/)

---

## アクセシビリティ

### ARIA

- コンテナに `role="alert"` を付与（スクリーンリーダーに即座に通知）
- 閉じるボタンに `aria-label="閉じる"` を付与
- エラーバリアント使用時は `aria-live="assertive"` 相当の通知が発生

### キーボード操作

- `Tab`: 閉じるボタン・内部のリンクへフォーカス移動
- `Enter` / `Space`: 閉じるボタンのクリック

参照: [principles/foundation/accessibility/keyboard-navigation.md](../../principles/foundation/accessibility/keyboard-navigation.md)

---

## 実装詳細

### 使用トークン

| トークン | 使用箇所 |
|---------|---------|
| `colors.success` | success バリアントの背景・ボーダー・テキスト |
| `colors.error` | error バリアントの背景・ボーダー・テキスト |
| `colors.warning` | warning バリアントの背景・ボーダー・テキスト |
| `colors.info` | info バリアントの背景・ボーダー・テキスト |
| `colors.neutral` | neutral バリアントの背景・ボーダー・テキスト |
| `radius.lg` | rounded-lg（8px） |
| `spacing` | padding（p-4） |

### Tailwind クラス

```
基本: flex gap-3 rounded-lg p-4
状態: border bg-{variant}-50 text-{variant}-800
閉じるボタン: transition-colors focus:ring-2
```

---

## バージョン履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|----------|
| 2026-02-19 | 1.0.0 | 初版作成 |
