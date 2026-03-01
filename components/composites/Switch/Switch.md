# Switch

**Atomic Design**: Atom

トグルスイッチコンポーネント。設定が即時反映される場合に使用する（Checkbox とは異なり、保存ボタン不要）。

---

## Props

| Prop | Type | Default | 説明 |
|------|------|---------|------|
| `checked` | `boolean` | `false` | オン/オフの状態 |
| `onChange` | `(checked: boolean) => void` | - | 状態変更コールバック |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | サイズ |
| `label` | `string` | - | ラベルテキスト |
| `description` | `string` | - | 補足説明 |
| `labelPosition` | `'left' \| 'right'` | `'right'` | ラベルの位置 |
| `disabled` | `boolean` | `false` | 無効状態 |

`ButtonHTMLAttributes<HTMLButtonElement>` を継承（`onChange` は除く）。

---

## 使用例

### 基本

```tsx
import { Switch } from '@/components/Switch';

const [enabled, setEnabled] = useState(false);

<Switch
  label="メール通知"
  checked={enabled}
  onChange={setEnabled}
/>
```

### 補足説明付き

```tsx
<Switch
  label="ダークモード"
  description="画面を暗いテーマに切り替えます"
  checked={darkMode}
  onChange={setDarkMode}
/>
```

### ラベル左側

```tsx
<Switch
  label="公開設定"
  labelPosition="left"
  checked={isPublic}
  onChange={setIsPublic}
/>
```

### サイズ

```tsx
<Switch size="small" label="コンパクト" />
<Switch size="medium" label="標準" />
<Switch size="large" label="ラージ" />
```

### 無効状態

```tsx
<Switch label="管理者のみ変更可能" disabled />
```

### 設定パネルでの使用例

```tsx
<div className="space-y-4">
  <Switch label="メール通知" description="新着メッセージをメールで受け取る" checked={email} onChange={setEmail} />
  <Switch label="プッシュ通知" description="ブラウザ通知を受け取る" checked={push} onChange={setPush} />
  <Switch label="SMS通知" disabled description="現在利用不可" />
</div>
```

---

## デザイン原則

### Checkbox vs Switch の使い分け

| | Checkbox | Switch |
|--|---------|--------|
| 反映タイミング | 保存ボタンを押した時 | 即時 |
| 選択 | 複数選択可能 | 単一のオン/オフ |
| 用途 | フォーム内の選択 | 設定・プリファレンス |

参照: [principles/patterns/forms.md](../../principles/patterns/forms.md)

---

## アクセシビリティ

- `role="switch"` + `aria-checked` でスクリーンリーダーがオン/オフを読み上げる
- `<button>` 要素として実装（`Space` / `Enter` キーで操作可能）
- ラベルをクリックしてもトグルが切り替わる

---

## バージョン履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|----------|
| 2026-02-21 | 1.0.0 | 初版作成 |
