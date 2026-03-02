# Tabs

**分類**: Composite

キーボード操作に対応したタブナビゲーション。underline / pill の2バリアント、制御・非制御の両モードに対応。

---

## Props

### TabsProps

| Prop | Type | Default | 説明 |
|------|------|---------|------|
| `tabs` | `TabItem[]` | **必須** | タブ項目 |
| `defaultActiveId` | `string` | 最初のタブ | 初期アクティブタブのID（非制御） |
| `activeId` | `string` | - | アクティブタブのID（制御） |
| `onChange` | `(id: string) => void` | - | タブ切り替え時のコールバック |
| `variant` | `'underline' \| 'pill'` | `'underline'` | 外観バリアント |
| `ariaLabel` | `string` | `'タブナビゲーション'` | タブリストの aria-label |
| `className` | `string` | `''` | 追加CSSクラス |

### TabItem

| Prop | Type | 説明 |
|------|------|------|
| `id` | `string` | タブの一意ID |
| `label` | `string` | タブのラベル |
| `content` | `React.ReactNode` | タブのパネルコンテンツ |
| `disabled` | `boolean?` | タブを無効にする |
| `badge` | `string \| number?` | ラベル右端に表示するバッジ |

---

## 使用例

### 基本（非制御）

```tsx
import { Tabs } from '@/components/Tabs';

<Tabs
  tabs={[
    { id: 'profile', label: 'プロフィール', content: <ProfilePane /> },
    { id: 'settings', label: '設定', content: <SettingsPane /> },
  ]}
  defaultActiveId="profile"
/>
```

### 制御モード

```tsx
const [activeTab, setActiveTab] = useState('profile');

<Tabs
  tabs={[...]}
  activeId={activeTab}
  onChange={setActiveTab}
/>
```

### Pill バリアント

```tsx
<Tabs variant="pill" tabs={[...]} />
```

### バッジ付き

```tsx
<Tabs tabs={[
  { id: 'inbox', label: '受信箱', badge: 3, content: <InboxPane /> },
  { id: 'sent', label: '送信済み', content: <SentPane /> },
]} />
```

---

## デザイン原則

### バリアントの使い分け

- **underline**: ページ内のセクション切り替え（デフォルト）
- **pill**: コンテンツのフィルタリング、よりカジュアルな切り替え

### 使用ガイドライン

- タブの数は2〜6個を推奨
- タブラベルは短く簡潔に（2〜4文字が理想）
- タブの順序は重要度・使用頻度順にする

参照: [principles/patterns/navigation.md](../../principles/patterns/navigation.md)

---

## アクセシビリティ

### ARIA

- `role="tablist"` / `role="tab"` / `role="tabpanel"` の3層構造
- `aria-selected` でアクティブタブを示す
- `aria-controls` / `aria-labelledby` でタブとパネルを関連付け
- `aria-disabled` で無効なタブを示す

### キーボード操作

- `←` / `→`: 隣のタブへ移動（ループ）
- `Home`: 最初のタブへ移動
- `End`: 最後のタブへ移動
- アクティブタブのみ `tabIndex={0}`、他は `tabIndex={-1}`（ロービングタブインデックス）

参照: [principles/foundation/accessibility/keyboard-navigation.md](../../principles/foundation/accessibility/keyboard-navigation.md)

---

## 実装詳細

### 使用トークン

| トークン | 使用箇所 |
|---------|---------|
| `colors.primary` | アクティブタブ（underline のボーダー、pill の背景） |
| `colors.neutral` | 非アクティブタブのテキスト・ボーダー |
| `animation.duration.DEFAULT` | transition-colors（200ms） |
| `radius.full` | pill バリアントの角丸 |

### Tailwind クラス

```
underline アクティブ: text-primary-600 after:bg-primary-600
underline 非アクティブ: text-neutral-500 hover:text-neutral-700
pill アクティブ: bg-primary-600 text-white shadow-sm
pill 非アクティブ: text-neutral-600 hover:bg-neutral-100
バッジ: text-xs font-semibold px-1.5 py-0.5 rounded-full
```

---

## バージョン履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|----------|
| 2026-02-19 | 1.0.0 | 初版作成 |
