# VisuallyHidden コンポーネント

**Atomic Design**: Atom
**カテゴリ**: アクセシビリティ基盤

---

## 概要

視覚的には非表示だがスクリーンリーダには読まれるテキストを描画する。
icon-only ボタン、装飾的アイコンの補助ラベル、ライブリージョン、フォームラベルの代替など
「画面上は記号や図形で意味を伝えつつ、a11y ツリーには文字列を残したい」場面で使う。

実装は Tailwind の `sr-only` ユーティリティ (position: absolute; width: 1px; height: 1px; clip-path: inset(50%); ...) に依存。

---

## Props

| Prop | 型 | デフォルト | 説明 |
|---|---|---|---|
| `as` | `'span' \| 'div' \| 'p' \| 'label'` | `'span'` | レンダリング先 HTML 要素 |
| `children` | `React.ReactNode` | — | スクリーンリーダに読ませる内容 (必須) |
| その他 | `React.HTMLAttributes<HTMLElement>` | — | `role` `aria-live` `htmlFor` 等を透過 |

---

## 使用例

```tsx
// icon-only Button の補助ラベル
<Button aria-label="閉じる">
  <Icon name="x" />
  <VisuallyHidden>閉じる</VisuallyHidden>
</Button>

// フォームの非表示ラベル
<VisuallyHidden as="label" htmlFor="q">検索キーワード</VisuallyHidden>
<Input id="q" placeholder="検索…" />

// 通知用 live region
<VisuallyHidden role="status" aria-live="polite">
  {statusMessage}
</VisuallyHidden>
```

---

## なぜ `display: none` ではダメか

`display: none` / `visibility: hidden` は a11y ツリーからも要素を除外する。
スクリーンリーダ向けにテキストを残すには、レイアウト的に存在しつつも視覚的に
潰す手法 (`sr-only` パターン) を使う必要がある。

---

## アクセシビリティ

- DOM に残るため、スクリーンリーダは普通のテキストとして読み上げる
- `role` / `aria-live` / `aria-atomic` 等を `{...props}` で透過するため、live region としても利用可
- `as` で `label` を指定すれば `htmlFor` 付きのフォームラベルとして機能

---

## 注意

- 装飾アイコンに対しては `<Icon aria-hidden />` で a11y ツリーから外し、隣に `<VisuallyHidden>` で説明テキストを置くのが定石
- 既に `aria-label` を持つボタンに `VisuallyHidden` テキストを追加すると、SR が重複読みする可能性。重複しないようどちらか一方に統一する
- `sr-only` を `focus:not-sr-only` で組み合わせると「skip link」(キーボードでフォーカス時のみ可視化) も実装可能。本コンポーネントは常に非表示の用途に限定
