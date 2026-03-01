# Radio / RadioGroup

**Atomic Design**: Atom

ラジオボタンコンポーネント。相互排他的な選択肢（1つのみ選択）に使用する。  
`Radio` 単独ではなく、必ず `RadioGroup` と組み合わせて使用する。

---

## Props

### Radio

| Prop | Type | Default | 説明 |
|------|------|---------|------|
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | サイズ |
| `label` | `string` | - | ラベルテキスト |
| `description` | `string` | - | 補足説明 |
| `error` | `boolean` | `false` | エラー状態 |
| `disabled` | `boolean` | `false` | 無効状態 |
| `name` | `string` | - | グループ名（必須） |
| `value` | `string` | - | 値 |

### RadioGroup

| Prop | Type | Default | 説明 |
|------|------|---------|------|
| `legend` | `string` | **必須** | グループのラベル（`<legend>`） |
| `required` | `boolean` | `false` | 必須マーク表示 |
| `error` | `boolean` | `false` | エラー状態 |
| `errorMessage` | `string` | - | エラーメッセージ |
| `inline` | `boolean` | `false` | 横並び表示 |
| `children` | `React.ReactNode` | **必須** | Radio コンポーネント群 |

---

## 使用例

### 基本

```tsx
import { Radio, RadioGroup } from '@/components/Radio';

<RadioGroup legend="お支払い方法" required>
  <Radio name="payment" value="card" label="クレジットカード" />
  <Radio name="payment" value="bank" label="銀行振込" />
  <Radio name="payment" value="konbini" label="コンビニ払い" />
</RadioGroup>
```

### 補足説明付き

```tsx
<RadioGroup legend="プランを選択">
  <Radio name="plan" value="free" label="無料プラン" description="月3回まで利用可能" />
  <Radio name="plan" value="pro" label="Proプラン" description="無制限利用・¥980/月" />
</RadioGroup>
```

### 横並び

```tsx
<RadioGroup legend="性別" inline>
  <Radio name="gender" value="male" label="男性" />
  <Radio name="gender" value="female" label="女性" />
  <Radio name="gender" value="other" label="その他" />
</RadioGroup>
```

### エラー状態

```tsx
<RadioGroup legend="プランを選択" error errorMessage="プランを選択してください">
  <Radio name="plan" value="free" label="無料プラン" error />
  <Radio name="plan" value="pro" label="Proプラン" error />
</RadioGroup>
```

---

## デザイン原則

### Checkbox vs Radio
- **Radio**: 1つのみ選択（相互排他）
- **Checkbox**: 複数選択可能、または単一のオン/オフ

### 選択肢は2〜6個が目安
- 7個以上は Select（ドロップダウン）の使用を検討する

参照: [principles/patterns/forms.md](../../principles/patterns/forms.md)

---

## アクセシビリティ

- `<fieldset>` + `<legend>` でグループをアクセシブルに定義
- 同じ `name` 属性で同一グループを示す
- `aria-invalid` でエラー状態を伝える

---

## バージョン履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|----------|
| 2026-02-21 | 1.0.0 | 初版作成 |
