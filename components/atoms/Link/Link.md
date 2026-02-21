# Link コンポーネント

**Atomic Design**: Atom  
**カテゴリ**: ナビゲーション・テキスト

---

## 概要

インラインテキストリンクおよびナビゲーションリンクのための汎用コンポーネント。外部リンクの自動判別、アクセシビリティ対応、視覚的な状態管理を提供する。

---

## Props

| Prop | 型 | デフォルト | 説明 |
|------|----|-----------|------|
| `href` | `string` | 必須 | リンク先URL |
| `external` | `boolean` | `false` | 外部リンク（target="_blank" + rel="noopener noreferrer" + 外部アイコン） |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | テキストサイズ |
| `color` | `'primary' \| 'neutral' \| 'muted'` | `'primary'` | テキストカラー |
| `underline` | `'always' \| 'hover' \| 'none'` | `'hover'` | アンダーライン表示 |
| `disabled` | `boolean` | `false` | 無効状態 |
| `children` | `ReactNode` | 必須 | リンクテキスト |

---

## 使用例

```tsx
// 基本的なリンク
<Link href="/about">会社概要</Link>

// 外部リンク（自動でアイコンとrel属性を付与）
<Link href="https://example.com" external>
  公式ドキュメント
</Link>

// 本文中のインラインリンク
<p>
  詳しくは<Link href="/terms" color="muted">利用規約</Link>をご確認ください。
</p>

// ナビゲーション
<Link href="/home" color="neutral" underline="none">ホーム</Link>
```

---

## カラーの使い分け

| color | 用途 |
|-------|------|
| `primary` | メインのアクションリンク、本文内リンク |
| `neutral` | ナビゲーション、見出し近くのリンク |
| `muted` | 利用規約・プライバシーポリシーなどの副次リンク |

---

## アクセシビリティ

- `disabled` 時: `aria-disabled="true"` + `href` を削除してフォーカス移動を防止
- `external` 時: 外部リンクアイコンに `aria-label="外部リンク"` を付与
- フォーカスリング: `focus:ring-2 focus:ring-offset-1` でキーボード操作を明示
- `rel="noopener noreferrer"`: `target="_blank"` 時のセキュリティリスクを防止

---

## 設計原則

- リンクは必ずリンクとわかるスタイルにする（色またはアンダーラインの少なくとも一方）
- ホバー・フォーカス状態を常に明示する
- 外部リンクはユーザーがページを離れることを事前に把握できるようにする
- 「こちら」「クリック」などの非説明的なリンクテキストは避ける（スクリーンリーダー対応）
