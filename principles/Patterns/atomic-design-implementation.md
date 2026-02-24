# Atomic Design実装の原則

## メタ情報
- カテゴリ: パターン原則（実装）
- 適用範囲: 全階層（Atom〜Page）
- ステータス: Approved
- 最終更新: 2026-02-24

## 原則の定義

**Atomic Designの階層構造を正しく理解し、各階層の責任範囲を明確にすることで、再利用可能で保守性の高いコンポーネントシステムを構築する**

## 背景と目的

Atomic Designを理解せずに実装すると、以下の問題が発生します：

- **階層の混乱**: ButtonにCardの機能を持たせる等、責任範囲が不明確
- **再利用性の低下**: 特定のコンテキストに依存したコンポーネントが増える
- **保守性の悪化**: 変更の影響範囲が予測できない

## Atomic Design階層の定義

```
Pages（ページ）
  ↓ 使用
Templates（テンプレート）
  ↓ 使用
Organisms（有機体）
  ↓ 使用
Molecules（分子）
  ↓ 使用
Atoms（原子）
```

**依存関係のルール**:
- 上位階層は下位階層を使用できる
- 下位階層は上位階層を使用してはいけない
- 同階層同士の依存は避ける（例外あり）

---

## Atoms（原子）

**これ以上分解できない最小のUI要素**

### 判断基準

- [ ] これ以上分解すると意味を失う
- [ ] 単一の責任を持つ
- [ ] 他のAtomsに依存しない
- [ ] 再利用性が非常に高い

### 典型例

- `Button` — クリック可能な要素。バリアント・サイズ・状態（loading/disabled）を持つ
- `Input` — テキスト入力フィールド。ラベルやエラーメッセージは含まない（Moleculeで組み合わせる）
- `Icon` — アイコン画像の表示・サイズ・色
- `Typography` — テキストスタイルの適用（h1〜h6, body, caption等）
- `Badge`, `Spinner`, `Avatar`, `Divider` など

---

## Molecules（分子）

**複数のAtomsを組み合わせて、単一の機能を提供する**

### 判断基準

- [ ] 2つ以上のAtomsで構成される
- [ ] 単一の機能を完結して提供する
- [ ] ドメイン非依存（別サービスでもそのまま使い回せる）
- [ ] 他のMoleculesに依存しない

### 典型例

- `FormField` — Label + Input + エラーメッセージ
- `SearchBar` — Input + Button
- `Card` — 汎用カードレイアウト
- `Breadcrumb`, `Tabs`, `Pagination`, `Alert` など

---

## Organisms（有機体）

**Molecules/Atomsで構成される、独立した機能ブロック**

### 判断基準

- [ ] 独立した機能ブロックとして成立する
- [ ] ページ内で再利用可能
- [ ] コンテキストを持つ（特定のドメイン知識がある）
- [ ] Molecules/Atomsで構成される

### 典型例

- `Header` — ナビゲーション・ロゴ・アクション
- `PaymentSummaryCard` — 支払い金額・クレジットカード情報（「支払い」ドメインを持つ）
- `ReservationCard` — 予約番号・日時（「予約」ドメインを持つ）
- `Modal`, `DataTable`, `Toast` など

---

## Templates（テンプレート）

**Organismsを配置したページ構造（実コンテンツなし）**

- レイアウトグリッドとブレークポイント対応を定義
- 実際のデータは含まない

### 典型例

- `DashboardTemplate` — Header + Sidebar + コンテンツエリア（slot）
- `ArticleTemplate` — タイトルエリア・本文エリア・関連記事エリア

---

## Pages（ページ）

**Templateに実際のコンテンツを流し込んだ完成形**

- 実際のデータを含む
- ユーザーフローの一部
- 固有のURL

---

## 階層判断のフローチャート

```
コンポーネントを作りたい
  ↓
これ以上分解できない？
  Yes → Atom
  No ↓

Atomの組み合わせで単一機能？ かつ ドメイン非依存？
  Yes → Molecule
  No ↓

独立した機能ブロック？ドメイン知識を持つ？
  Yes → Organism
  No ↓

ページ全体のレイアウト構造？
  Yes → Template
  No ↓

実際のコンテンツを含むページ？
  Yes → Page
```

### 早わかり判断基準

> **「別のサービス・別のプロジェクトにそのままコピーして使えるか？」**
>
> - Yes → Molecule 以下
> - No（ドメイン知識が必要）→ Organism 以上

| コンポーネント例 | 別サービスで使える？ | 階層 |
|---|---|---|
| FormField（ラベル + 入力） | Yes | Molecule |
| SearchBar（入力 + ボタン） | Yes | Molecule |
| 支払い情報カード | No（「支払い」ドメインが必要） | Organism |
| 予約情報カード | No（「予約」ドメインが必要） | Organism |

---

## よくある間違いと解決策

### 間違い1: Atomが大きすぎる

```tsx
// ❌ Buttonが複雑すぎる
<Button
  tooltip="変更を保存します"
  confirmDialog={{ title: "保存しますか？", message: "取り消せません" }}
/>

// ✅ Buttonはシンプルに。機能は上位階層で
<ConfirmButton onConfirm={handleSave} confirmTitle="保存しますか？">
  <Button icon={<SaveIcon />}>保存</Button>
</ConfirmButton>
```

### 間違い2: 階層をスキップ

```tsx
// ❌ OrganismがAtomを大量に直接使用
const Header = () => (
  <header>
    <Button>Home</Button>
    <Button>About</Button>
    <Button>Contact</Button>
    <Button>Login</Button>
    <Button>Signup</Button>
  </header>
);

// ✅ Moleculeを経由する
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

### 間違い3: コンテキスト依存が強すぎる

```tsx
// ❌ MoleculeがドメインオブジェクトのProductに依存
const ProductFormField = ({ product }) => { ... };

// ✅ MoleculeはドメインフリーにしてOrganismでドメインを扱う
const FormField = ({ label, value, onChange }) => { ... };

const ProductForm = ({ product, onChange }) => (
  <form>
    <FormField label="商品名" value={product.name} onChange={...} />
    <FormField label="価格"   value={product.price} onChange={...} />
  </form>
);
```

---

## 測定方法

### チェックリスト

- [ ] 各コンポーネントが適切な階層に配置されている
- [ ] 依存関係が下位階層のみ（上位・同階層に依存していない）
- [ ] Atomsが単一責任を持つ
- [ ] Moleculesが単一機能を提供し、ドメイン非依存
- [ ] Organismsがドメイン知識を持つ
- [ ] 命名規則に従っている

### 命名規則

```
Atoms    : 機能を表す名詞           例: Button, Input, Icon
Molecules: 機能を表す複合名詞       例: SearchBar, FormField
Organisms: ドメインを表す名詞       例: Header, ProductCard, PaymentSummaryCard
Templates: 用途 + Template         例: DashboardTemplate
Pages    : 用途 + Page             例: ProductListPage
```

### レビュー時の質問

1. **このコンポーネントは分解できるか？** → Yes なら下位階層へ
2. **上位階層に依存していないか？** → していれば設計を見直す
3. **別サービスでそのまま使えるか？** → No なら Organism 以上
