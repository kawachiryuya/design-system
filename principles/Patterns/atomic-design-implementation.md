# Atomic Design実装の原則

## メタ情報
- カテゴリ: パターン原則（実装）
- 適用範囲: 全階層（Atom〜Page）
- ステータス: Approved
- 最終更新: 2024-01-15

## 原則の定義

**Atomic Designの階層構造を正しく理解し、各階層の責任範囲を明確にすることで、再利用可能で保守性の高いコンポーネントシステムを構築する**

Atomic Designは、UIを5つの階層（Atoms, Molecules, Organisms, Templates, Pages）に分けて体系的に構築する方法論です。各階層には明確な役割があり、これを守ることで、一貫性のある、拡張しやすいデザインシステムが実現できます。

## 背景と目的

### なぜこの原則が必要か

Atomic Designを理解せずに実装すると、以下の問題が発生します：

- **階層の混乱**: ButtonにCardの機能を持たせる等、責任範囲が不明確
- **再利用性の低下**: 特定のコンテキストに依存したコンポーネントが増える
- **保守性の悪化**: 変更の影響範囲が予測できない
- **命名の一貫性欠如**: 同じようなコンポーネントが異なる名前で複数存在

体系的な階層理解により、これらを防ぎ、誰が見ても理解しやすいコンポーネント構造を作れます。

## Atomic Design階層の定義

### 全体像

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

## Atoms（原子）

### 定義

**これ以上分解できない最小のUI要素**

- 単一の機能を持つ
- 他のコンポーネントに依存しない
- デザイントークンを直接使用する

### 判断基準

以下のすべてを満たすものがAtom：

- [ ] これ以上分解すると意味を失う
- [ ] 単一の責任を持つ
- [ ] 他のAtomsに依存しない
- [ ] 再利用性が非常に高い

### 典型的な例

#### Button

**責任範囲**:
- クリック可能な要素を提供
- バリエーション（primary, secondary等）
- サイズ（small, medium, large）
- 状態（default, hover, active, disabled, loading）

**含むべきもの**:
- テキストまたはアイコン
- パディング、ボーダー、背景色
- インタラクション状態

**含まないもの**:
- 複雑なレイアウト
- 他のコンポーネント（Icon以外）
- ビジネスロジック

```
✅ 良い例:
<Button variant="primary" size="medium">保存</Button>
<Button variant="secondary" icon={<SaveIcon />}>保存</Button>

❌ 悪い例:
<Button>
  <Card>...</Card>  {/* Atomが上位階層を含んでいる */}
</Button>
```

#### Input

**責任範囲**:
- テキスト入力フィールドの提供
- タイプ（text, email, password等）
- 状態（default, focus, error, disabled）

**含まないもの**:
- ラベル（Moleculeで組み合わせる）
- エラーメッセージ（Moleculeで組み合わせる）
- 複数の入力フィールド

#### Icon

**責任範囲**:
- アイコン画像の表示
- サイズ調整
- 色の適用

#### Typography

**責任範囲**:
- テキストスタイルの適用
- バリエーション（h1-h6, body, caption等）

### Atomsの実装パターン

```typescript
// Button Atom
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

// シンプル、単一責任、再利用可能
const Button: React.FC<ButtonProps> = ({ ... }) => {
  return (
    <button className={...}>
      {isLoading && <Spinner />}
      {icon}
      {children}
    </button>
  );
};
```

## Molecules（分子）

### 定義

**複数のAtomsを組み合わせて、単一の機能を提供する**

- 2つ以上のAtomsで構成
- 明確な単一機能を持つ
- 独立して動作可能

### 判断基準

- [ ] 2つ以上のAtomsで構成される
- [ ] 単一の機能を完結して提供
- [ ] コンテキストに依存しない
- [ ] 他のMoleculesに依存しない

### 典型的な例

#### FormField

**責任範囲**:
- ラベル + 入力フィールド + エラーメッセージの組み合わせ
- フォーム内の単一フィールドとして機能

**構成要素**:
- Label (Atom)
- Input (Atom)
- Typography (Atom) - エラーメッセージ用

```typescript
interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChange,
  error,
  required,
  disabled,
}) => {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <Input
        value={value}
        onChange={onChange}
        disabled={disabled}
        error={!!error}
      />
      {error && <Typography variant="caption" color="error">{error}</Typography>}
    </div>
  );
};
```

#### SearchField

**責任範囲**:
- 検索入力 + 検索ボタンの組み合わせ
- 検索という単一機能を提供

**構成要素**:
- Input (Atom)
- Button (Atom)

#### ButtonGroup

**責任範囲**:
- 複数のButtonを適切な間隔で配置
- アクション配置原則に従う

**構成要素**:
- Button (Atom) × 複数

### Moleculesの実装パターン

```typescript
// 複数のAtomsを組み合わせ、単一機能を提供
const SearchField: React.FC<SearchFieldProps> = ({ onSearch }) => {
  const [value, setValue] = useState('');

  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={setValue}
        placeholder="検索..."
      />
      <Button onClick={() => onSearch(value)}>
        <SearchIcon />
      </Button>
    </div>
  );
};
```

### MoleculesとAtomsの違い

| 観点 | Atoms | Molecules |
|------|-------|-----------|
| 構成 | 単一要素 | 複数のAtoms |
| 機能 | 基本的な機能 | 完結した機能 |
| 例 | Button, Input | FormField, SearchField |
| 依存 | なし | Atomsのみ |

## Organisms（有機体）

### 定義

**Molecules/Atomsで構成される、独立した機能ブロック**

- 複雑な機能を提供
- ドメイン知識を持つ
- ページ内で再利用可能

### 判断基準

- [ ] 独立した機能ブロックとして成立
- [ ] ページ内で再利用可能
- [ ] コンテキストを持つ（特定のドメイン知識）
- [ ] Molecules/Atomsで構成される

### 典型的な例

#### Header

**責任範囲**:
- サイト全体のヘッダー
- ナビゲーション、ロゴ、アクションボタン

**構成要素**:
- Logo (Atom)
- Navigation (Molecule または複数のButton)
- ButtonGroup (Molecule)

```typescript
const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="flex items-center justify-between p-6">
      <Logo />
      
      <nav className="flex gap-6">
        <Button variant="tertiary" href="/">ホーム</Button>
        <Button variant="tertiary" href="/products">製品</Button>
        <Button variant="tertiary" href="/about">会社概要</Button>
      </nav>
      
      <div className="flex gap-3">
        {user ? (
          <>
            <Typography>{user.name}</Typography>
            <Button variant="secondary" onClick={onLogout}>
              ログアウト
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" href="/login">ログイン</Button>
            <Button variant="primary" href="/signup">登録</Button>
          </>
        )}
      </div>
    </header>
  );
};
```

#### Card

**責任範囲**:
- コンテンツをカード形式で表示
- タイトル、説明、画像、アクション

**構成要素**:
- Typography (Atom) - タイトル、説明
- Image (Atom)
- ButtonGroup (Molecule)

#### Modal

**責任範囲**:
- モーダルダイアログの表示
- オーバーレイ、コンテンツエリア、アクション

**構成要素**:
- Typography (Atom) - タイトル
- Button (Atom) - 閉じるボタン
- 任意のコンテンツ

### Organismsの実装パターン

```typescript
// 複雑な機能ブロック、ドメイン知識を持つ
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
  };
  onAddToCart: (productId: string) => void;
  onViewDetails: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails,
}) => {
  return (
    <div className="card">
      <Image src={product.image} alt={product.name} />
      
      <div className="card-body">
        <Typography variant="h3">{product.name}</Typography>
        <Typography variant="body">{product.description}</Typography>
        <Typography variant="h4">¥{product.price.toLocaleString()}</Typography>
      </div>
      
      <div className="card-footer">
        <Button
          variant="tertiary"
          onClick={() => onViewDetails(product.id)}
        >
          詳細を見る
        </Button>
        <Button
          variant="primary"
          onClick={() => onAddToCart(product.id)}
        >
          カートに追加
        </Button>
      </div>
    </div>
  );
};
```

## Templates（テンプレート）

### 定義

**Organismsを配置したページ構造（コンテンツなし）**

- レイアウトグリッドを定義
- コンテンツ配置ルール
- ブレークポイント対応

### 判断基準

- [ ] ページ全体の構造を定義
- [ ] 実際のコンテンツを含まない
- [ ] 再利用可能なレイアウト
- [ ] レスポンシブ対応

### 典型的な例

#### DashboardTemplate

**責任範囲**:
- ダッシュボードページのレイアウト
- ヘッダー、サイドバー、メインコンテンツエリア

**構成要素**:
- Header (Organism)
- Sidebar (Organism)
- コンテンツエリア（slot）

```typescript
interface DashboardTemplateProps {
  children: React.ReactNode;
}

const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  children,
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
```

#### ArticleTemplate

**責任範囲**:
- 記事ページのレイアウト
- タイトルエリア、本文エリア、関連記事エリア

## Pages（ページ）

### 定義

**Templateに実際のコンテンツを入れた完成形**

- 実際のデータを含む
- ユーザーフローの一部
- 固有のURL

### 典型的な例

```typescript
const ProductListPage: React.FC = () => {
  const { products } = useProducts();
  
  return (
    <DashboardTemplate>
      <Typography variant="h1">製品一覧</Typography>
      
      <div className="grid grid-cols-3 gap-6 mt-8">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>
    </DashboardTemplate>
  );
};
```

## 階層判断のフローチャート

```
コンポーネントを作りたい
  ↓
これ以上分解できない？
  Yes → Atom
  No ↓
  
2-3個のAtomsの組み合わせで単一機能？
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

## 実装時のベストプラクティス

### 1. 命名規則

```
Atoms: 機能を表す名詞
  例: Button, Input, Icon, Typography

Molecules: 機能を表す複合名詞
  例: SearchField, FormField, ButtonGroup

Organisms: ドメインを表す名詞
  例: Header, ProductCard, UserProfile, CommentSection

Templates: 用途 + Template
  例: DashboardTemplate, ArticleTemplate

Pages: 用途 + Page
  例: ProductListPage, CheckoutPage
```

### 2. ディレクトリ構造

```
src/components/
├── atoms/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── index.ts
│   ├── Input/
│   └── ...
├── molecules/
│   ├── FormField/
│   ├── SearchField/
│   └── ...
├── organisms/
│   ├── Header/
│   ├── ProductCard/
│   └── ...
├── templates/
│   ├── DashboardTemplate/
│   └── ...
└── pages/
    ├── ProductListPage/
    └── ...
```

### 3. Props設計

**Atoms**:
- プリミティブな型中心
- バリエーション、サイズ、状態
- コールバック（onClick等）

**Molecules**:
- Atomsの Props を組み合わせ
- 単一機能に関連する Props

**Organisms**:
- ドメインオブジェクト（product, user等）
- ビジネスロジックのコールバック

### 4. 依存関係のルール

```typescript
// ✅ 良い例: 下位階層のみに依存
// Molecule → Atoms
const FormField = () => {
  return (
    <div>
      <Label />
      <Input />
    </div>
  );
};

// ❌ 悪い例: 上位階層に依存
// Atom → Organism
const Button = () => {
  return (
    <button>
      <Header /> {/* AtomがOrganismを使っている */}
    </button>
  );
};

// ❌ 悪い例: 同階層に依存（通常は避ける）
// Molecule → Molecule
const FormField = () => {
  return (
    <div>
      <SearchField /> {/* MoleculeがMoleculeを使っている */}
    </div>
  );
};
```

### 5. コンポーネント分割の判断

**分割すべき場合**:
- 50行を超えるコンポーネント
- 複数の責任を持っている
- 再利用可能な部分がある

**分割しない場合**:
- 1箇所でしか使わない
- 分割すると逆に複雑になる
- 密結合している

## よくある間違いと解決策

### 間違い1: Atomが大きすぎる

```typescript
// ❌ 悪い例: Buttonが複雑すぎる
<Button
  label="保存"
  icon={<SaveIcon />}
  tooltip="変更を保存します"
  confirmDialog={{
    title: "保存しますか？",
    message: "この操作は取り消せません",
  }}
/>

// ✅ 良い例: Buttonはシンプルに、機能は上位階層で
<ConfirmButton
  onConfirm={handleSave}
  confirmTitle="保存しますか？"
>
  <Button icon={<SaveIcon />}>保存</Button>
</ConfirmButton>
```

### 間違い2: 階層をスキップ

```typescript
// ❌ 悪い例: OrganismがAtomを大量に直接使用
const Header = () => {
  return (
    <header>
      <Button>Home</Button>
      <Button>About</Button>
      <Button>Contact</Button>
      <Button>Login</Button>
      <Button>Signup</Button>
    </header>
  );
};

// ✅ 良い例: Moleculeを経由
const Navigation = () => (
  <nav>
    <Button>Home</Button>
    <Button>About</Button>
    <Button>Contact</Button>
  </nav>
);

const Header = () => {
  return (
    <header>
      <Logo />
      <Navigation />
      <ButtonGroup buttons={[
        { label: 'Login', variant: 'secondary' },
        { label: 'Signup', variant: 'primary' },
      ]} />
    </header>
  );
};
```

### 間違い3: コンテキスト依存が強すぎる

```typescript
// ❌ 悪い例: Moleculeが特定のドメインに依存
const ProductFormField = ({ product }) => {
  return (
    <div>
      <Label>商品名</Label>
      <Input value={product.name} />
      <PriceFormatter price={product.price} />
    </div>
  );
};

// ✅ 良い例: 汎用的なMolecule
const FormField = ({ label, value, onChange }) => {
  return (
    <div>
      <Label>{label}</Label>
      <Input value={value} onChange={onChange} />
    </div>
  );
};

// ドメイン知識はOrganismに
const ProductForm = ({ product, onChange }) => {
  return (
    <form>
      <FormField
        label="商品名"
        value={product.name}
        onChange={(name) => onChange({ ...product, name })}
      />
      <FormField
        label="価格"
        value={product.price}
        onChange={(price) => onChange({ ...product, price })}
      />
    </form>
  );
};
```

## 測定方法

### チェックリスト

- [ ] 各コンポーネントが適切な階層に配置されている
- [ ] 依存関係が下位階層のみ（上位・同階層に依存していない）
- [ ] Atomsが単一責任を持つ
- [ ] Moleculesが単一機能を提供
- [ ] Organismsがドメイン知識を持つ
- [ ] 命名規則に従っている
- [ ] ディレクトリ構造が階層を反映

### レビュー時の質問

1. **このコンポーネントは分解できるか？**
   - Yes → 分解して下位階層に
   - No → 現在の階層が適切

2. **このコンポーネントは他のコンポーネントに依存しているか？**
   - 上位階層に依存 → 設計を見直す
   - 下位階層に依存 → OK

3. **このコンポーネントは再利用可能か？**
   - 特定のコンテキストに依存 → 階層を上げる
   - 汎用的 → 現在の階層が適切

## 関連原則

本原則で定義したAtomic Design階層は、以下の原則で具体的に適用されます：

- **[Accessibility](./foundation/accessibility.md)**: 各階層でのアクセシビリティ実装
- **[Action Placement](./interaction/action-placement.md)**: ボタン配置パターン
- **[Spacing](./layout/spacing.md)**: 各階層での余白適用
- **[States](./interaction/states.md)**: 各階層での状態管理
- **[Typography Hierarchy](./content/typography-hierarchy.md)**: テキスト階層の適用
- **[Color Meaning](./color/color-meaning.md)**: 各階層での色使用

## 関連コンポーネント

- **すべてのコンポーネント**: この原則に従って構築

## バージョン履歴

| 日付 | バージョン | 変更内容 | 変更理由 |
|------|-----------|----------|----------|
| 2024-01-15 | 1.0.0 | 初版作成 | Atomic Design実装パターンの体系化 |
