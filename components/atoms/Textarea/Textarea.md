# Textarea

**Atomic Design**: Atom

複数行テキスト入力コンポーネント。コメント・お問い合わせ内容・メモなど、長文入力に使用する。

---

## Props

| Prop | Type | Default | 説明 |
|------|------|---------|------|
| `label` | `string` | - | ラベル |
| `error` | `boolean` | `false` | エラー状態 |
| `errorMessage` | `string` | - | エラーメッセージ |
| `helpText` | `string` | - | ヘルプテキスト |
| `fullWidth` | `boolean` | `false` | 全幅表示 |
| `currentLength` | `number` | - | 現在の文字数（カウンター表示） |
| `maxLength` | `number` | - | 最大文字数（カウンター表示 + HTML制限） |
| `resize` | `'none' \| 'vertical' \| 'horizontal' \| 'both'` | `'vertical'` | リサイズ挙動 |
| `disabled` | `boolean` | `false` | 無効状態 |
| `required` | `boolean` | `false` | 必須 |
| `rows` | `number` | - | 表示行数 |

`TextareaHTMLAttributes<HTMLTextAreaElement>` を継承。

---

## 使用例

### 基本

```tsx
import { Textarea } from '@/components/Textarea';

<Textarea label="お問い合わせ内容" rows={5} required />
```

### 文字数カウンター

```tsx
const [text, setText] = useState('');

<Textarea
  label="自己紹介"
  rows={4}
  maxLength={200}
  currentLength={text.length}
  value={text}
  onChange={(e) => setText(e.target.value)}
  helpText="200文字以内で入力してください"
/>
```

### エラー状態

```tsx
<Textarea
  label="お問い合わせ内容"
  error
  errorMessage="内容を入力してください"
  rows={5}
/>
```

### リサイズ無効

```tsx
<Textarea
  label="メモ"
  rows={3}
  resize="none"
/>
```

---

## デザイン原則

### Input vs Textarea の使い分け
- 1行の短い入力 → **Input**
- 複数行の長い入力（50文字以上を想定）→ **Textarea**

### 行数の目安
- コメント・備考: `rows={3}` 〜 `rows={4}`
- お問い合わせ・説明文: `rows={5}` 〜 `rows={8}`
- 記事・詳細内容: `rows={10}` 以上

### 文字数カウンター
- 上限に近づいたら残り文字数を示す
- 上限超過時は赤色で警告

参照: [principles/patterns/forms.md](../../principles/patterns/forms.md)

---

## アクセシビリティ

- `aria-invalid` / `aria-required` / `aria-describedby` を設定
- `maxLength` は HTML 制限と合わせて `aria-describedby` でヒントを提供

---

## バージョン履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|----------|
| 2026-02-21 | 1.0.0 | 初版作成 |
