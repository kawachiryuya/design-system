# Label

**Atomic Design**: Atom

フォームフィールドと関連付けるラベルコンポーネント。必須・任意の状態を視覚的・意味的に伝える。Input や Select などのフォームコンポーネントと組み合わせて使用する。

---

## Props

| Prop | Type | Default | 説明 |
|------|------|---------|------|
| `htmlFor` | `string` | - | 関連付けるフォームフィールドの `id` |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | ラベルのサイズ |
| `required` | `boolean` | `false` | 必須マーク（`*`）を表示 |
| `optional` | `boolean` | `false` | 任意マーク（「任意」）を表示 |
| `disabled` | `boolean` | `false` | 無効状態（関連フィールドが disabled のとき） |
| `children` | `React.ReactNode` | **必須** | ラベルのテキスト |

`LabelHTMLAttributes<HTMLLabelElement>` を継承しているため、標準の label 属性はすべて利用可能。

> **注意**: `required` と `optional` は排他的です。両方 `true` にした場合は `required` が優先されます。

---

## 使用例

### 基本

```tsx
import { Label } from '@/components/Label';

<Label htmlFor="email">メールアドレス</Label>
```

### 必須フィールド

```tsx
<Label htmlFor="email" required>メールアドレス</Label>
// → "メールアドレス *"（* は aria-label="必須"）
```

### 任意フィールド

```tsx
<Label htmlFor="nickname" optional>ニックネーム</Label>
// → "ニックネーム（任意）"
```

### サイズ

```tsx
<Label size="small" htmlFor="a">Small ラベル</Label>
<Label size="medium" htmlFor="b">Medium ラベル</Label>
<Label size="large" htmlFor="c">Large ラベル</Label>
```

### 無効状態

```tsx
<Label htmlFor="username" disabled>ユーザー名</Label>
```

### Input と組み合わせる

```tsx
import { Label } from '@/components/Label';
import { Input } from '@/components/Input';

// Label と Input を個別に使う場合
<div className="flex flex-col gap-1">
  <Label htmlFor="email" required>メールアドレス</Label>
  <Input id="email" type="email" required />
</div>
```

> **補足**: `Input` コンポーネント自身も `label` prop でラベルを内包できます。Label コンポーネントは、より細かい制御が必要な場合や、Input 以外のフォーム要素（Select, Textarea, Checkbox など）と組み合わせる場合に使用してください。

### 複数の Label で構成されるフォームグループ

```tsx
<fieldset>
  <legend>お支払い方法</legend>
  <div>
    <input type="radio" id="card" name="payment" />
    <Label htmlFor="card">クレジットカード</Label>
  </div>
  <div>
    <input type="radio" id="bank" name="payment" />
    <Label htmlFor="bank">銀行振込</Label>
  </div>
</fieldset>
```

---

## デザイン原則

### ラベルの配置
- ラベルは常にフィールドの**上**に配置する
- プレースホルダーのみでラベルを省略してはならない（入力後にラベルが消えると確認できなくなる）

参照: [principles/patterns/forms.md](../../principles/patterns/forms.md)

### 必須・任意の明示
- 必須と任意の**どちらかのみ**マークする（両方マークすると冗長）
- フォームの大半が必須項目 → `required` で必須のみマーク
- フォームの大半が任意項目 → `optional` で任意のみマーク
- 必須マーク（`*`）は `aria-label="必須"` でスクリーンリーダーにも伝える

参照: [principles/patterns/forms.md](../../principles/patterns/forms.md)

### 無効状態
- 関連するフォームフィールドが `disabled` のとき、ラベルも `disabled` にする
- 色を薄くしてクリック不可であることを視覚的に伝える

---

## アクセシビリティ

### ラベルとフィールドの関連付け
- `htmlFor` で input の `id` と関連付けることで、ラベルをクリックするとフィールドにフォーカスが移動する（クリック領域が広がり、モバイルで特に有用）
- スクリーンリーダーがフィールドを読み上げる際にラベルテキストを伝える

```html
<label for="email">メールアドレス <span aria-label="必須">*</span></label>
<input id="email" type="email" aria-required="true" />
```

### 必須マークのアクセシビリティ
- `*` は視覚的な記号であり、スクリーンリーダーは「アスタリスク」と読み上げる場合がある
- `aria-label="必須"` を設定することで「必須」と読み上げさせる

参照: [principles/foundation/accessibility/keyboard-navigation.md](../../principles/foundation/accessibility/keyboard-navigation.md)

---

## 実装詳細

### 使用トークン

| トークン | 使用箇所 |
|---------|---------|
| `typography.fontSize.sm` | Medium サイズ（14px） |
| `typography.fontSize.xs` | Small サイズ（12px） |
| `typography.fontSize.base` | Large サイズ（16px） |
| `colors.neutral.700` | デフォルトのテキスト色 |
| `colors.neutral.400` | 無効状態・任意マーク |
| `colors.error.500` | 必須マーク（`*`） |

### Tailwind クラス

```
基本: inline-flex items-center gap-1 font-medium leading-tight select-none
色: text-neutral-700（デフォルト）/ text-neutral-400（disabled）
サイズ: text-xs / text-sm / text-base
必須: text-error-500
任意: text-neutral-400 text-xs
```

---

## バージョン履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|----------|
| 2026-02-21 | 1.0.0 | 初版作成 |
