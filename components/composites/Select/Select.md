# Select

**Atomic Design**: Atom

ドロップダウン選択コンポーネント。選択肢が多い場合（7個以上）や、スペースが限られている場合に Radio の代わりに使用する。

---

## Props

| Prop | Type | Default | 説明 |
|------|------|---------|------|
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | サイズ |
| `label` | `string` | - | ラベル |
| `placeholder` | `string` | - | 先頭に表示する無効な選択肢 |
| `error` | `boolean` | `false` | エラー状態 |
| `errorMessage` | `string` | - | エラーメッセージ |
| `helpText` | `string` | - | ヘルプテキスト |
| `fullWidth` | `boolean` | `false` | 全幅表示 |
| `disabled` | `boolean` | `false` | 無効状態 |
| `required` | `boolean` | `false` | 必須 |

`SelectHTMLAttributes<HTMLSelectElement>` を継承（`size` は除く）。

---

## 使用例

### 基本

```tsx
import { Select } from '@/components/Select';

<Select label="都道府県">
  <option value="tokyo">東京都</option>
  <option value="osaka">大阪府</option>
</Select>
```

### プレースホルダー付き

```tsx
<Select label="都道府県" placeholder="選択してください" required>
  <option value="tokyo">東京都</option>
  <option value="osaka">大阪府</option>
</Select>
```

### エラー状態

```tsx
<Select label="カテゴリ" error errorMessage="カテゴリを選択してください">
  <option value="">選択してください</option>
</Select>
```

### ヘルプテキスト

```tsx
<Select label="言語" helpText="UIの表示言語を選択します">
  <option value="ja">日本語</option>
  <option value="en">English</option>
</Select>
```

### オプショングループ

```tsx
<Select label="地域">
  <optgroup label="関東">
    <option value="tokyo">東京都</option>
    <option value="kanagawa">神奈川県</option>
  </optgroup>
  <optgroup label="関西">
    <option value="osaka">大阪府</option>
    <option value="kyoto">京都府</option>
  </optgroup>
</Select>
```

---

## デザイン原則

### Radio vs Select の使い分け
- 選択肢が **2〜6個** → Radio（全選択肢が見える）
- 選択肢が **7個以上** → Select（スペース効率が良い）
- スペースが限られている → Select

参照: [principles/patterns/forms.md](../../principles/patterns/forms.md)

---

## アクセシビリティ

- `<label htmlFor>` で関連付け必須
- `aria-required` / `aria-invalid` を設定
- カスタムの下矢印アイコンは `pointer-events-none` + `aria-hidden`
- `<optgroup>` でグループを意味論的に区別

---

## バージョン履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|----------|
| 2026-02-21 | 1.0.0 | 初版作成 |
