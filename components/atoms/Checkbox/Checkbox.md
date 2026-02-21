# Checkbox

**Atomic Design**: Atom

チェックボックスコンポーネント。単一の選択肢のオン/オフ、または複数選択に使用する。

---

## Props

| Prop | Type | Default | 説明 |
|------|------|---------|------|
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | サイズ |
| `label` | `string` | - | ラベルテキスト |
| `description` | `string` | - | ラベルの補足説明 |
| `error` | `boolean` | `false` | エラー状態 |
| `errorMessage` | `string` | - | エラーメッセージ |
| `indeterminate` | `boolean` | `false` | 不確定状態（部分選択） |
| `disabled` | `boolean` | `false` | 無効状態 |
| `checked` | `boolean` | - | チェック状態 |
| `required` | `boolean` | `false` | 必須 |

`InputHTMLAttributes<HTMLInputElement>` を継承（`type` と `size` は除く）。

---

## 使用例

### 基本

```tsx
import { Checkbox } from '@/components/Checkbox';

<Checkbox label="利用規約に同意する" />
```

### 必須

```tsx
<Checkbox label="利用規約に同意する" required />
```

### 補足説明付き

```tsx
<Checkbox
  label="メール通知"
  description="週1回の更新メールを受け取る"
/>
```

### 不確定状態（全選択の制御）

```tsx
<Checkbox
  label="全て選択"
  indeterminate={someChecked && !allChecked}
  checked={allChecked}
  onChange={handleSelectAll}
/>
```

### エラー状態

```tsx
<Checkbox
  label="利用規約に同意する"
  error
  errorMessage="続行するには同意が必要です"
/>
```

### 複数選択グループ

```tsx
<fieldset>
  <legend className="text-sm font-semibold">通知設定</legend>
  <Checkbox label="メール通知" name="notify" value="email" />
  <Checkbox label="プッシュ通知" name="notify" value="push" />
  <Checkbox label="SMS通知" name="notify" value="sms" />
</fieldset>
```

---

## デザイン原則

### Checkbox vs Switch の使い分け
- **Checkbox**: 保存ボタンが必要な設定、複数選択、リストの選択
- **Switch**: 即時反映される設定（保存ボタン不要）

### 不確定状態
- 子要素の一部が選択されている「全選択」チェックボックスに使用
- `indeterminate` は CSS のみで表現（HTMLのデフォルトはない）

参照: [principles/patterns/forms.md](../../principles/patterns/forms.md)

---

## アクセシビリティ

- `<label htmlFor>` で関連付け（ラベルをクリックでチェック切り替え）
- `aria-invalid` でエラー状態をスクリーンリーダーに伝える
- エラーメッセージに `role="alert"` で動的変化を通知
- グループには `<fieldset>` + `<legend>` を使用する

---

## バージョン履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|----------|
| 2026-02-21 | 1.0.0 | 初版作成 |
