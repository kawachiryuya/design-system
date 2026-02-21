# Input

**Atomic Design**: Atom

テキスト入力を受け付ける最も基本的なフォームコンポーネント。ラベル・ヘルプテキスト・エラーメッセージをまとめて管理する。

---

## Props

| Prop | Type | Default | 説明 |
|------|------|---------|------|
| `type` | `'text' \| 'email' \| 'password' \| 'number' \| 'tel' \| 'url' \| 'search'` | `'text'` | 入力タイプ |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | 入力フィールドのサイズ |
| `error` | `boolean` | `false` | エラー状態 |
| `errorMessage` | `string` | - | エラー時に表示するメッセージ |
| `helpText` | `string` | - | 補足説明テキスト（エラー時は非表示） |
| `fullWidth` | `boolean` | `false` | 全幅表示 |
| `leadingIcon` | `React.ReactNode` | - | 左側アイコン |
| `trailingIcon` | `React.ReactNode` | - | 右側アイコン |
| `label` | `string` | - | フィールドラベル |
| `id` | `string` | - | 一意のID（省略時は label から自動生成） |
| `disabled` | `boolean` | `false` | 無効状態 |
| `required` | `boolean` | `false` | 必須フィールド |
| `placeholder` | `string` | - | プレースホルダーテキスト |

`InputHTMLAttributes<HTMLInputElement>` を継承しているため、標準のinput属性はすべて利用可能。

---

## 使用例

### 基本

```tsx
import { Input } from '@/components/Input';

<Input label="名前" placeholder="山田 太郎" />
```

### 必須フィールド

```tsx
<Input
  label="メールアドレス"
  type="email"
  placeholder="example@email.com"
  required
  helpText="登録に使用するメールアドレスを入力してください"
/>
```

### エラー状態

```tsx
<Input
  label="パスワード"
  type="password"
  error
  errorMessage="8文字以上、英数字を組み合わせてください"
/>
```

### サイズ

```tsx
<Input size="small" label="小" placeholder="Small" />
<Input size="medium" label="中" placeholder="Medium" />
<Input size="large" label="大" placeholder="Large" />
```

### アイコン付き

```tsx
import { SearchIcon, EyeIcon } from '@/icons';

// 左側アイコン（検索など）
<Input leadingIcon={<SearchIcon />} placeholder="検索" />

// 右側アイコン（パスワード表示など）
<Input type="password" trailingIcon={<EyeIcon />} label="パスワード" />
```

### 無効状態

```tsx
<Input label="ユーザー名" value="kawachi" disabled />
```

### 全幅

```tsx
<Input label="メールアドレス" type="email" fullWidth />
```

### フォームでの使用例

```tsx
<form noValidate>
  <Input
    id="email"
    label="メールアドレス"
    type="email"
    required
    helpText="ログインに使用します"
  />
  <Input
    id="password"
    label="パスワード"
    type="password"
    required
    error={hasError}
    errorMessage="パスワードが正しくありません"
  />
</form>
```

---

## デザイン原則

このコンポーネントは以下の原則に従っています：

### ラベルの配置
- ラベルは常にフィールドの上に配置（プレースホルダーのみは禁止）
- ラベルが消えると、入力後に何を入力したか確認できなくなるため

参照: [principles/patterns/forms.md](../../principles/patterns/forms.md)

### 必須・任意の明示
- 必須項目には `*` を表示（`aria-label="必須"` でスクリーンリーダーにも伝える）
- ヘルプテキストはフィールド直下に表示
- エラー時はヘルプテキストをエラーメッセージに置き換える

参照: [principles/patterns/forms.md](../../principles/patterns/forms.md)

### インタラクティブ状態
- **default**: グレーの枠線
- **hover**: 枠線をやや濃く
- **focus**: Primary色の枠線 + フォーカスリング
- **error**: エラー色の枠線 + 薄い背景
- **disabled**: 透明度50% + グレー背景

---

## アクセシビリティ

### ARIA属性
- `aria-invalid`: エラー時に `true` を設定（スクリーンリーダーがエラーを通知）
- `aria-required`: 必須時に `true` を設定
- `aria-describedby`: エラーメッセージ・ヘルプテキストと関連付け
- `role="alert"`: エラーメッセージに設定（動的な変化をスクリーンリーダーが読み上げ）

### ラベル関連付け
- `<label htmlFor>` で input と関連付け（クリック領域が広がる）
- `id` を省略した場合は label から自動生成

### キーボード操作
- `Tab`: フォーカス移動
- `Shift + Tab`: 逆方向にフォーカス移動

参照: [principles/foundation/accessibility/keyboard-navigation.md](../../principles/foundation/accessibility/keyboard-navigation.md)

---

## 実装詳細

### 使用トークン

| トークン | 使用箇所 |
|---------|---------|
| `spacing` | padding（px-3, py-2等） |
| `colors.primary` | フォーカス時の枠線・リング |
| `colors.neutral` | デフォルト枠線・テキスト |
| `colors.error` | エラー状態の枠線・背景・メッセージ |
| `radius.DEFAULT` | rounded（8px） |
| `animation.duration.DEFAULT` | transition（200ms） |

### Tailwind クラス

```
基本: block rounded border bg-white text-neutral-800
状態: focus:ring-2 focus:border-primary-600 disabled:opacity-50
エラー: border-error-500 focus:ring-error-300 bg-error-50
サイズ: px-{3,4} py-{1,2,3}
```

---

## バージョン履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|----------|
| 2026-02-21 | 1.0.0 | 初版作成 |
