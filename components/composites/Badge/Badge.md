# Badge

**Atomic Design**: Atom

ステータス・カテゴリ・数値などを簡潔に表示するラベルコンポーネント。

---

## Props

| Prop | Type | Default | 説明 |
|------|------|---------|------|
| `variant` | `'neutral' \| 'primary' \| 'success' \| 'error' \| 'warning' \| 'info'` | `'neutral'` | セマンティックカラー |
| `appearance` | `'solid' \| 'soft' \| 'outline'` | `'soft'` | 表示スタイル |
| `size` | `'small' \| 'medium'` | `'medium'` | サイズ |
| `dot` | `boolean` | `false` | 先頭にドットを表示 |
| `children` | `React.ReactNode` | **必須** | バッジの内容 |

---

## 使用例

### ステータスバッジ

```tsx
import { Badge } from '@/components/Badge';

<Badge variant="success">完了</Badge>
<Badge variant="warning">審査中</Badge>
<Badge variant="error">エラー</Badge>
<Badge variant="info">新着</Badge>
<Badge variant="neutral">下書き</Badge>
```

### Appearance（表示スタイル）

```tsx
// Soft（デフォルト・背景薄め）
<Badge variant="primary" appearance="soft">Primary</Badge>

// Solid（塗りつぶし・より目立つ）
<Badge variant="primary" appearance="solid">Primary</Badge>

// Outline（枠線のみ・控えめ）
<Badge variant="primary" appearance="outline">Primary</Badge>
```

### ドット付き（ステータスインジケーター）

```tsx
<Badge variant="success" dot>オンライン</Badge>
<Badge variant="neutral" dot>オフライン</Badge>
<Badge variant="warning" dot>応答待ち</Badge>
```

### サイズ

```tsx
<Badge size="small" variant="success">小</Badge>
<Badge size="medium" variant="success">中（デフォルト）</Badge>
```

### リスト・テーブルでの使用

```tsx
<table>
  <tbody>
    <tr>
      <td>注文 #001</td>
      <td><Badge variant="success" dot>配送済み</Badge></td>
    </tr>
    <tr>
      <td>注文 #002</td>
      <td><Badge variant="warning" dot>配送中</Badge></td>
    </tr>
    <tr>
      <td>注文 #003</td>
      <td><Badge variant="neutral" dot>準備中</Badge></td>
    </tr>
  </tbody>
</table>
```

---

## デザイン原則

### 色だけに依存しない
バッジは色 + テキスト（+ オプションでドット）で意味を伝える。色覚に関係なく内容が理解できる。

参照: [principles/color/semantic-colors.md](../../principles/color/semantic-colors.md)

### Appearance の選び方
- `soft`（デフォルト）: 一般的なステータス表示
- `solid`: より強調したい場合（通知数、重要なステータス）
- `outline`: 控えめに表示したい場合、背景色と競合する場合

---

## 実装詳細

### 使用トークン

| variant | soft背景 | solid背景 | テキスト |
|---------|---------|----------|---------|
| neutral | neutral-100 | neutral-700 | neutral-700 |
| primary | primary-100 | primary-600 | primary-700 |
| success | success-100 | success-600 | success-700 |
| error | error-100 | error-600 | error-700 |
| warning | warning-100 | warning-600 | warning-700 |
| info | info-100 | info-600 | info-700 |

---

## バージョン履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|----------|
| 2026-02-21 | 1.0.0 | 初版作成 |
