# Atomic Design コンポーネント階層ガイド

最終更新: 2026-02-24

UIを5つの階層に分けて設計・実装する方法論です。PM・Designer・Engineer の共通言語として使います。

> **最も重要な判断基準:「別のサービス・別のプロジェクトにそのまま持っていけるか？」**
>
> - 持っていける → Molecule 以下
> - 持っていけない（特定の業務知識が必要）→ Organism 以上

---

## 各階層の定義

### Atom（原子）— レゴの1ブロック

**これ以上分解できない最小のUI要素。**

どんな画面でも、どんなサービスでも使える汎用パーツです。

| こういうもの | 例 |
|---|---|
| テキスト表示 | 見出し、本文、キャプション |
| 入力欄 | テキスト入力、チェックボックス、トグル |
| 操作ボタン | ボタン、リンク |
| 装飾・表示 | アイコン、バッジ、アバター、区切り線 |

**判断チェックリスト:**

- [ ] これ以上分解すると意味を失う
- [ ] 1つの役割だけを持っている
- [ ] 他のAtomに依存しない

---

### Molecule（分子）— どんな作品にも使えるパーツ

**複数のAtomを組み合わせた、汎用的な機能のまとまり。**

ポイントは **ドメイン非依存** であること。「検索」「入力フォーム」「カード枠」など、業務内容を問わず使い回せるものです。

| こういうもの | 構成 |
|---|---|
| 入力フィールド | ラベル + 入力欄 + エラーメッセージ |
| 検索バー | 入力欄 + ボタン |
| カード | 白背景 + 枠線の汎用コンテナ |
| ラベル+値セット | 小テキスト "お名前" + 大テキスト "田中太郎" |
| タブ、ページネーション、パンくずリスト | |

**判断チェックリスト:**

- [ ] 2つ以上のAtomで構成されている
- [ ] 1つの機能を完結して提供する
- [ ] **別サービスにそのまま持っていける（ドメイン非依存）**

---

### Organism（有機体）— 特定の目的を持った機能ブロック

**Molecule や Atom を組み合わせた、業務知識を持つ独立ブロック。**

「何のためのUIか」が決まっている時点で Organism です。見た目が Molecule と同じでも、中身に業務固有の意味があれば Organism になります。

| こういうもの | なぜ Organism か |
|---|---|
| ヘッダー | 「サイトナビゲーション」という目的がある |
| 支払い情報カード | 「支払い」というドメイン知識が必要 |
| 予約情報カード | 「予約」というドメイン知識が必要 |
| 商品カード | 「商品」というドメイン知識が必要 |
| モーダル、データテーブル | |

**判断チェックリスト:**

- [ ] 独立した機能ブロックとして成立する
- [ ] **特定の業務知識（ドメイン）を持っている**
- [ ] Molecule や Atom で構成されている

---

### Template（テンプレート）— 間取り図

**Organism をどこに配置するかを決めたページの骨格。実際のデータは入っていない状態。**

- 「ヘッダーは上、サイドバーは左、メインコンテンツは右」のようなレイアウト定義
- レスポンシブ対応（PC / タブレット / スマホでの配置変更）もここ

---

### Page（ページ）— 完成した部屋

**Template に実際のデータを流し込んだ完成形。**

- ユーザーが実際に目にする画面そのもの
- URL を持つ

---

## Molecule と Organism の境界

ここが最も迷いやすいポイントです。

### 見た目が同じでも階層が違う例

白背景＋グレー枠線のカードUIを考えます。

| パターン | 中身 | 階層 | 理由 |
|---|---|---|---|
| 汎用カード | タイトル + 本文 + ボタン（何にでも使える） | Molecule | ドメイン非依存 |
| 支払い情報カード | 支払い金額 + VISA下4桁（「支払い」前提） | Organism | ドメイン依存 |
| 予約情報カード | 予約番号 + 日時（「予約」前提） | Organism | ドメイン依存 |

**見た目（箱のスタイル）ではなく、「何のための箱か」で階層が決まります。**

### 迷った時の問いかけ

1. **この UI パーツを、全く別のサービスにコピーしてそのまま使えるか？**
   - Yes → Molecule
   - No → Organism

2. **このパーツの中身を説明する時に、業務用語（支払い、予約、商品…）が出てくるか？**
   - 出てくる → Organism
   - 出てこない → Molecule

---

## 階層判断フローチャート

```
UIパーツを作りたい
  ↓
これ以上分解できない？
  Yes → Atom
  No  ↓

複数の Atom の組み合わせ？ かつ 別サービスでも使える？
  Yes → Molecule
  No  ↓

特定の業務知識を持った独立ブロック？
  Yes → Organism
  No  ↓

ページ全体のレイアウト構造？
  Yes → Template
  No  ↓

実際のデータを含む完成画面？
  Yes → Page
```

---

## よくある間違いと解決策

### 間違い1: Atom に機能を詰め込みすぎ

**NG**: ボタン1つに「確認ダイアログ表示」「ツールチップ」まで含める

**OK**: ボタンはシンプルに保ち、確認ダイアログは上位の Organism で実装する

Atom は「押せる」「入力できる」「表示する」だけに専念させます。

<details>
<summary>Engineer 向け: コード例</summary>

```tsx
// ❌ Buttonが複雑すぎる
<Button
  tooltip="変更を保存します"
  confirmDialog={{ title: "保存しますか？", message: "取り消せません" }}
/>

// ✅ Buttonはシンプルに。確認は上位階層で
<ConfirmButton onConfirm={handleSave}>
  <Button icon={<SaveIcon />}>保存</Button>
</ConfirmButton>
```

</details>

### 間違い2: Molecule にドメイン知識を入れてしまう

**NG**: 「商品入力フィールド」という Molecule を作る（商品という概念が前提になっている）

**OK**: 汎用の「入力フィールド」を Molecule として作り、「商品フォーム」という Organism の中で使う

Molecule は業務用語から自由にしておきます。

<details>
<summary>Engineer 向け: コード例</summary>

```tsx
// ❌ Moleculeが「商品」ドメインに依存
const ProductFormField = ({ product }) => { ... };

// ✅ Moleculeは汎用、ドメインはOrganismで
const FormField = ({ label, value, onChange }) => { ... };

const ProductForm = ({ product, onChange }) => (
  <form>
    <FormField label="商品名" value={product.name} onChange={...} />
    <FormField label="価格"   value={product.price} onChange={...} />
  </form>
);
```

</details>

### 間違い3: 階層をスキップして Atom を大量に並べる

**NG**: ヘッダー（Organism）の中にボタンを5つ直接並べる

**OK**: ナビゲーション（Molecule）とアクションボタン群（Molecule）にまとめてからヘッダーに配置する

中間の Molecule を挟むことで、各パーツが独立してテスト・再利用できるようになります。

<details>
<summary>Engineer 向け: コード例</summary>

```tsx
// ❌ Organism が Atom を大量に直接使用
const Header = () => (
  <header>
    <Button>Home</Button>
    <Button>About</Button>
    <Button>Contact</Button>
    <Button>Login</Button>
    <Button>Signup</Button>
  </header>
);

// ✅ Molecule を経由する
const Navigation = () => (
  <nav>
    <Button>Home</Button>
    <Button>About</Button>
    <Button>Contact</Button>
  </nav>
);

const Header = () => (
  <header>
    <Logo />
    <Navigation />
    <ButtonGroup buttons={[...]} />
  </header>
);
```

</details>

---

## レビュー時の確認ポイント

デザインレビューやコードレビューで使える3つの問い:

1. **このパーツはもっと分解できるか？** → できるなら下の階層へ
2. **別サービスにそのまま持っていけるか？** → No なら Organism 以上
3. **業務用語なしで説明できるか？** → できないなら Organism 以上

---

## 命名ルール

| 階層 | 命名パターン | 例 |
|---|---|---|
| Atom | 機能を表す名詞 | Button, Input, Icon |
| Molecule | 機能を表す複合名詞 | SearchBar, FormField, Card |
| Organism | 業務ドメイン＋名詞 | Header, ProductCard, PaymentSummaryCard |
| Template | 用途 + Template | DashboardTemplate |
| Page | 用途 + Page | ProductListPage |
