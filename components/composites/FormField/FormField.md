# FormField コンポーネント

**Atomic Design**: Molecule  
**組み合わせ**: Label + children（任意のフォームコントロール）+ helpText + errorMessage

---

## 概要

ラジオボタングループ・チェックボックスグループ・カスタムコントロールなど、ラベルを外部から与えたいフォームフィールドを統一レイアウトで包むラッパー。

> **Input / Select / Textarea との使い分け**  
> これらのコンポーネントはすでに `label` prop を内包しているため、単体入力には FormField 不要。  
> FormField は複数の Atom を束ねてひとつのフィールドとして扱う場合に使う。

---

## Props

| Prop | 型 | デフォルト | 説明 |
|------|----|-----------|------|
| `label` | `string` | 必須 | フィールドラベル |
| `required` | `boolean` | `false` | 必須マーク（* ） |
| `optional` | `boolean` | `false` | 任意マーク（任意） |
| `helpText` | `string` | — | ヘルプテキスト（エラー非表示時に表示） |
| `error` | `boolean` | `false` | エラー状態 |
| `errorMessage` | `string` | — | エラーメッセージ（error=true 時に表示） |
| `htmlFor` | `string` | 自動生成 | ラベルと紐付けるコントロールの id |
| `children` | `ReactNode \| (id) => ReactNode` | 必須 | フォームコントロール |
| `labelSize` | `'small' \| 'medium' \| 'large'` | `'medium'` | ラベルサイズ |
| `disabled` | `boolean` | `false` | 全体の無効状態 |

---

## 使用例

```tsx
// RadioGroup のラッパーとして
<FormField label="配送方法" required>
  <RadioGroup legend="配送方法">
    <Radio name="delivery" value="standard" label="標準配送" />
    <Radio name="delivery" value="express" label="速達" />
  </RadioGroup>
</FormField>

// Checkbox グループ
<FormField label="通知設定" optional helpText="複数選択できます">
  <div className="flex flex-col gap-2">
    <Checkbox label="メール" />
    <Checkbox label="プッシュ" />
  </div>
</FormField>

// レンダープロップで id を自動紐付け
<FormField label="カスタムコントロール">
  {(id) => <MyCustomInput id={id} />}
</FormField>

// エラー状態
<FormField label="配送方法" required error errorMessage="選択してください">
  ...
</FormField>
```

---

## レイアウト構成

```
┌─────────────────────────────┐
│ [Label] フィールド名 *必須   │  ← Label Atom
├─────────────────────────────┤
│  [children]                 │  ← 任意のフォームコントロール
├─────────────────────────────┤
│  ℹ ヘルプテキスト           │  ← error=false 時のみ
│  ⚠ エラーメッセージ        │  ← error=true 時のみ
└─────────────────────────────┘
```

---

## アクセシビリティ

- `Label` の `htmlFor` でコントロールと明示的に紐付け
- エラー時: `role="alert"` で即座に読み上げ
- `aria-describedby` で helpText / errorMessage をコントロールに関連付け
- `disabled` 時: ラベルの色が薄くなり、関連コントロールと視覚的に一致

---

## 設計原則

- `helpText` と `errorMessage` は同時に表示しない（エラーが優先）
- `required` と `optional` は排他的（`required` を優先）
- フォームコントロール自体のスタイルはこのコンポーネントに依存しない（疎結合）

参照: `principles/patterns/forms.md`
