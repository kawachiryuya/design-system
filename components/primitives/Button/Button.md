# Button

**Atomic Design**: Atom

クリック可能な要素を提供する最も基本的なコンポーネント。

---

## Props

| Prop | Type | Default | 説明 |
|------|------|---------|------|
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'quaternary'` | `'primary'` | ボタンの優先度 |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | ボタンのサイズ |
| `isLoading` | `boolean` | `false` | ローディング状態 |
| `icon` | `React.ReactNode` | - | アイコン要素 |
| `iconPosition` | `'left' \| 'right'` | `'left'` | アイコンの位置 |
| `fullWidth` | `boolean` | `false` | 全幅表示 |
| `disabled` | `boolean` | `false` | 無効状態 |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | ボタンタイプ |
| `children` | `React.ReactNode` | **必須** | ボタンの内容 |

---

## 使用例

### 基本

```tsx
import { Button } from '@/components/Button';

<Button>クリック</Button>
```

### バリアント

```tsx
// Primary（最も重要なアクション）
<Button variant="primary">保存</Button>

// Secondary（重要だが主要ではないアクション）
<Button variant="secondary">キャンセル</Button>

// Tertiary（補助的なアクション）
<Button variant="tertiary">詳細を見る</Button>

// Quaternary（最も控えめなアクション）
<Button variant="quaternary">スキップ</Button>
```

### サイズ

```tsx
<Button size="small">小</Button>
<Button size="medium">中</Button>
<Button size="large">大</Button>
```

### アイコン付き

```tsx
import { SaveIcon } from '@/icons';

<Button icon={<SaveIcon />}>保存</Button>
<Button icon={<SaveIcon />} iconPosition="right">保存</Button>
```

### ローディング状態

```tsx
<Button isLoading>保存中...</Button>
```

### 全幅

```tsx
<Button fullWidth>ログイン</Button>
```

### 無効状態

```tsx
<Button disabled>無効</Button>
```

---

## デザイン原則

このコンポーネントは以下の原則に従っています：

### ボタン優先度
- **Primary**: 最も重要なアクション（1画面に1つ）
- **Secondary**: 重要だが主要ではない
- **Tertiary**: 補助的・探索的なアクション
- **Quaternary**: 最も控えめ・破壊的でないアクション

参照: [principles/Interaction/button/priority.md](../../principles/Interaction/button/priority.md)

### 配置ルール
- Primaryは右側
- Secondaryは左側
- 横並びは2〜3個まで

参照: [principles/Interaction/button/priority.md](../../principles/Interaction/button/priority.md)

### アクションボタン群の幅統一

リスト行のアクションや、状態でラベルがトグル切り替わるボタンが並ぶ場合、`min-width` で最小幅を揃えることでレイアウトのブレを防ぐ。

```tsx
// 例: 「変更」(2文字) ⇄ 「キャンセル」(5文字) で文言がトグルするケース
<Button variant="secondary" size="small" className="min-w-[80px]">
  {isEditing ? 'キャンセル' : '変更'}
</Button>
```

**目安**:
- `size="small"` の行アクション: `min-w-[80px]`
- `size="medium"` のフォームアクション: `min-w-[96px]`
- 文言の最長想定（例: 「キャンセル」5文字）を基準に決める

**いつ使うか**:
- 同一行に異なる文言のボタンが複数並ぶ（例: 各 passenger ごとに「変更」「登録する」「未登録」など状態が混在するリスト）
- 単一ボタンでも、操作中に文言が変わる（例: 「保存」⇄「保存中…」、「登録する」⇄「キャンセル」）

`fullWidth` を使えるレイアウト（モーダル下部のアクションなど）では `fullWidth` を優先する。`min-width` は inline 配置に留めるアクション向け。

### インタラクティブ状態
- hover: 色が明るくなる
- active: 色が暗くなる
- focus: リング表示
- disabled: 透明度50%

参照: [principles/Interaction/state/overview.md](../../principles/Interaction/state/overview.md)

---

## アクセシビリティ

### キーボード操作
- `Tab`: フォーカス移動
- `Enter` / `Space`: クリック

### スクリーンリーダー
- `type`属性を適切に設定（submit/button/reset）
- `disabled`属性が適切に伝えられる

参照: [principles/Foundation/accessibility/overview.md](../../principles/Foundation/accessibility/overview.md)

---

## 実装詳細

### 使用トークン

| トークン | 使用箇所 |
|---------|---------|
| `spacing` | padding（px-4, py-2等） |
| `colors.primary` | Primary variant |
| `colors.neutral` | Secondary variant |
| `radius.DEFAULT` | rounded（8px） |
| `animation.duration.DEFAULT` | transition（200ms） |

### Tailwind クラス

```
基本: inline-flex items-center justify-center font-medium rounded
状態: hover:bg-* active:bg-* focus:ring-2 disabled:opacity-50
サイズ: px-{3,4,6} py-{1,2,3}
```

---

## バージョン履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|----------|
| 2026-02-19 | 1.0.0 | 初版作成 |
