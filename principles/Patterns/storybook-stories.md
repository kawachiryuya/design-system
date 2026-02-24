# Storybook ストーリー構成ガイドライン

## このドキュメントについて

このデザインシステムにおける Storybook ストーリーの書き方・構成ルールを定義する。新しいストーリーを書くとき、または既存ストーリーを整理するときはこのガイドラインを参照する。

**最終更新**: 2026年2月24日

---

## 基本方針

ストーリーの目的は「**Controls で再現できないことを可視化する**」こと。Controls パネルで確認できるものは独立したストーリーにしない。

---

## 標準ストーリー構成（最大4つ）

| # | Story名 | 用途 | 必須 |
|---|---|---|---|
| 1 | `Default` | Controls で全プロパティをインタラクティブに操作できる基本ストーリー | 必須 |
| 2 | `AllVariants` | 複数バリアントを横並びで視覚比較する | variant が複数ある場合 |
| 3 | `States` | Loading・Disabled など Controls だけでは再現しにくい状態をまとめる | 状態を持つ場合 |
| 4 | 追加ストーリー | Controls では並べて比較できない機能に限定（例: WithIcon） | 必要な場合のみ |

---

## 各ストーリーの書き方

### 1. Default

- `args` のみで定義し、Controls パネルで操作できる状態にする
- `render` は使わない

```tsx
export const Default: Story = {};
// または
export const Default: Story = {
  args: {
    children: 'ラベル',
    variant: 'primary',
  },
};
```

### 2. AllVariants

- `render` を使い、全バリアントを横並びで表示する
- バリアントが1種類しかないコンポーネントには作らない

```tsx
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Component variant="primary">Primary</Component>
      <Component variant="secondary">Secondary</Component>
    </div>
  ),
};
```

### 3. States

- Loading・Disabled など、ユーザーが実際に目にする「状態」を1ストーリーにまとめる
- 状態ごとに独立したストーリーを作らない

```tsx
export const States: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Component isLoading>処理中...</Component>
      <Component disabled>無効</Component>
    </div>
  ),
};
```

### 4. 追加ストーリー（判断基準）

以下の条件をすべて満たす場合のみ作成する：

- Controls のドロップダウン/ラジオでは確認しにくい
- 複数パターンを並べて比較することに意味がある
- `Default` や `AllVariants` に含めるとストーリーの意図が曖昧になる

例: `WithIcon`（左右配置の比較）、`WithAvatar`（スロットに要素が入る場合）

---

## 削除すべきストーリーのパターン

以下は Controls で確認できるため、独立したストーリーにしない。

| 削除対象 | 理由 | 代替 |
|---|---|---|
| `AllSizes` | サイズは Controls の radio で切り替え可能 | Controls |
| `FullWidth` | boolean フラグは Controls で操作可能 | Controls |
| `Large` / `Small` 等 | 単一 arg の変更のみ | Controls の `args` |
| `実践例: ○○` | コンポーネント単体の責務を超える | Molecule/Organism のストーリーに移す |

---

## ファイルの命名・エクスポート規則

```ts
// Story名はパスカルケース
export const Default: Story = {};
export const AllVariants: Story = {};
export const States: Story = {};
export const WithIcon: Story = {};

// name プロパティで表示名を変える場合（日本語化など）は使わない
// → サイドバーに日本語が並ぶと検索しにくくなるため
```

---

## 適用状況

| コンポーネント | 整理済み |
|---|---|
| Button | ✅ 2026年2月24日 |
| Input | ⬜ |
| Label | ⬜ |
| Icon | ⬜ |
| Typography | ⬜ |
| Checkbox | ⬜ |
| Radio | ⬜ |
| Select | ⬜ |
| Textarea | ⬜ |
| Switch | ⬜ |
| Badge | ⬜ |
| Spinner | ⬜ |
| Link | ⬜ |
| Avatar | ⬜ |
| Divider | ⬜ |
| Skeleton | ⬜ |
| ProgressBar | ⬜ |
| Image | ⬜ |
| FormField | ⬜ |
| SearchBar | ⬜ |
| Card | ⬜ |
| Alert | ⬜ |
| EmptyState | ⬜ |
| Breadcrumb | ⬜ |
| Tabs | ⬜ |
| Pagination | ⬜ |
