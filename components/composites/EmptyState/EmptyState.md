# EmptyState

**分類**: Composite

データなし・エラー・検索結果ゼロ時に表示するプレースホルダー。アイコン・タイトル・説明・アクションで構成。

---

## Props

### EmptyStateProps

| Prop | Type | Default | 説明 |
|------|------|---------|------|
| `icon` | `React.ReactNode` | デフォルトアイコン | SVG要素またはカスタムコンテンツ |
| `title` | `string` | **必須** | タイトル |
| `description` | `string` | - | 説明文 |
| `action` | `EmptyStateAction` | - | プライマリアクション |
| `secondaryAction` | `EmptyStateAction` | - | セカンダリアクション |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | サイズ |
| `className` | `string` | `''` | 追加CSSクラス |

### EmptyStateAction

| Prop | Type | 説明 |
|------|------|------|
| `label` | `string` | ボタンのラベル |
| `onClick` | `() => void` | クリックハンドラー |
| `href` | `string?` | リンクURL |
| `variant` | `'primary' \| 'secondary' \| 'tertiary'` | ボタンバリアント |

---

## 使用例

### 基本

```tsx
import { EmptyState } from '@/components/EmptyState';

<EmptyState
  title="データがありません"
  description="まだ登録されているアイテムがありません。"
/>
```

### アクション付き

```tsx
<EmptyState
  title="プロジェクトがありません"
  description="最初のプロジェクトを作成しましょう。"
  action={{ label: '新規作成', onClick: handleCreate }}
  secondaryAction={{ label: 'インポート', variant: 'tertiary', onClick: handleImport }}
/>
```

### サイズ

```tsx
<EmptyState size="sm" title="結果なし" />
<EmptyState size="md" title="結果なし" description="条件を変えてください" />
<EmptyState size="lg" title="結果なし" description="条件を変えてください" />
```

---

## デザイン原則

### 使いどころ

- テーブル・リストにデータがない場合
- 検索結果が0件の場合
- フィルタリング後にマッチするアイテムがない場合
- 初回利用時（オンボーディング）

### コンテンツのガイドライン

- タイトルは状態を端的に伝える（「データがありません」）
- 説明文は次のアクションを提案する（「最初のアイテムを作成しましょう」）
- アクションボタンで直接的な解決手段を提供する

参照: [principles/patterns/data-display.md](../../principles/patterns/data-display.md)

---

## アクセシビリティ

- タイトル・説明文はテキストとして読み上げ可能
- デフォルトアイコンに `aria-hidden="true"` を付与（装飾的要素として扱う）
- アクションボタンは Button コンポーネントを使用（キーボード操作に対応済み）

---

## 実装詳細

### 使用トークン

| トークン | 使用箇所 |
|---------|---------|
| `colors.neutral` | アイコン色・テキスト色 |
| `spacing` | gap・padding |
| `typography` | title / description のフォントサイズ |

### Tailwind クラス

```
基本: flex flex-col items-center justify-center text-center
アイコン: w-{12,16,24} h-{12,16,24} text-neutral-300
タイトル: font-semibold text-neutral-700
説明: text-neutral-500 max-w-sm
```

---

## バージョン履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|----------|
| 2026-02-19 | 1.0.0 | 初版作成 |
