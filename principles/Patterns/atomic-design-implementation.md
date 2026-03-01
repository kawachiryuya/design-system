# コンポーネント階層ガイド — Primitives / Composites

最終更新: 2026-03-01

UIコンポーネントを2つの階層に分けて設計・実装する方法論です。
Atomic Design の「依存方向の制約」を継承しつつ、分類の曖昧さを排除した構造です。

> **設計思想:** デザインシステムは「部品の提供」に徹する。ビジネスロジックや部品の組み立てはプロダクト側に委ねる。

---

## 各階層の定義

### Primitives — 単一HTML要素のラッパー

**これ以上分解できない最小のUI要素。他のコンポーネントを import しない。**

どんな画面でも、どんなサービスでも使える汎用パーツです。

| こういうもの | 例 |
|---|---|
| テキスト表示 | Typography |
| 入力欄 | Input, Textarea |
| 操作 | Button, Link |
| ラベル | Label |
| 装飾・表示 | Icon, Divider, Spinner, Skeleton, Image |

**判断チェックリスト:**

- [ ] 単一のHTML要素（`<button>`, `<input>`, `<a>` 等）をラップしている
- [ ] 他のデザインシステムコンポーネントを import していない
- [ ] 1つの役割だけを持っている

**配置:** `components/primitives/ComponentName/`

---

### Composites — 複数要素を組み合わせた複合コンポーネント

**Primitives や複数のHTML要素を内部で組み合わせた、意味のある単位。**

Primitives のみ import 可。Composites 同士は実装内で import しない（stories での利用は除く）。

| こういうもの | 構成 |
|---|---|
| フォーム入力 | Checkbox, Radio, Select, Switch（input + label + description） |
| 表示系 | Avatar, Badge, ProgressBar（複数要素の組み合わせ） |
| 構造系 | Card, Alert, Tabs, FormField, Breadcrumb, Pagination |
| 状態系 | EmptyState, SearchBar |

**判断チェックリスト:**

- [ ] 内部で複数の意味ある要素を組み合わせている
- [ ] **別サービスにそのまま持っていける（ドメイン非依存）**
- [ ] 1つの機能を完結して提供する

**配置:** `components/composites/ComponentName/`

---

## 依存ルール

```
Primitives  → 他のコンポーネントを import しない
Composites  → Primitives のみ import 可。Composites 同士の import 禁止
```

このルールは ESLint `import/no-restricted-paths` で機械的に強制できます。

---

## 実装ロジックの所在ガイドライン

| ロジックの種類 | 置き場所 | 例 |
|-------------|---------|---|
| 内部UIステート | 各コンポーネント内 `useState` | Tabs のアクティブタブ、Select の開閉 |
| a11y / フォーカス管理 | コンポーネント内 or `hooks/` | フォーカストラップ、キーボードナビ |
| 共有フック | `components/hooks/` | `useId`, `useFocusTrap`, `useClickOutside` |
| 共有ユーティリティ | `components/utils/` | `cn()` (classnames合成), `mergeRefs` |
| ビジネスロジック | **デザインシステムの外** | API呼び出し、認証、バリデーションルール |

**判断基準:** 「別プロダクトでも同じロジックか？」

- Yes → デザインシステム内（hooks/ or utils/ or コンポーネント内）
- No → プロダクト側

---

## デザインシステムの責務境界

```
デザインシステム（このリポジトリ）
├── primitives/     ← 見た目だけ。ロジック持たない
├── composites/     ← UIステートのみ。ビジネスロジックなし
├── tokens/         ← カラー・スペーシング等の定義値
├── hooks/          ← 共有カスタムフック（将来）
└── utils/          ← 共有ユーティリティ（将来）

プロダクト側（別リポジトリ）
├── features/       ← composites を組み合わせ + ビジネスロジック
├── layouts/        ← ページ構造
└── pages/          ← 実際の画面
```

ビジネスロジックは一切デザインシステムに入れません。

---

## Atomic Design からの進化

このシステムは Atomic Design を学んだ上で、以下の理由から再設計しました。

### 維持したもの

- **依存方向の制約**: 下位レイヤーは上位を import しない
- **積み上げの考え方**: 小さな部品から大きなパターンを組み立てる
- **再利用性の重視**: ドメイン非依存な部品を提供する

### 変更したもの

| 課題 | Atomic Design | Primitives / Composites |
|------|--------------|----------------------|
| 分類の曖昧さ | Checkbox は Atom？Molecule？ → 正解がない | 「他コンポーネントを import するか」で機械的に判断 |
| マルチプラットフォーム | Atom/Molecule は React 実装に依存した分類 | プラットフォーム非依存な分類名 |
| Organism の肥大化 | プロダクト固有の組み合わせが全て Organism に集中 | デザインシステムの外に分離 |
| AI との協業 | 分類の曖昧さが AI の判断にもブレを生む | 依存ルールが明確で機械的に検証可能 |

---

## 迷った時の判断フロー

```
UIパーツを作りたい
  ↓
単一のHTML要素のラッパーか？ 他コンポーネントを import しないか？
  Yes → Primitive
  No  ↓

ドメイン非依存か？（別サービスでそのまま使えるか？）
  Yes → Composite
  No  → プロダクト側で実装（デザインシステムには入れない）
```

---

## レビュー時の確認ポイント

1. **Primitive が他コンポーネントを import していないか？** → していたら Composite へ
2. **Composite が Composite を import していないか？** → していたら設計を見直す
3. **ドメイン用語（商品、予約、支払い…）が含まれていないか？** → 含まれていたらプロダクト側へ

---

## 命名ルール

| 階層 | 命名パターン | 例 |
|---|---|---|
| Primitive | 機能を表す名詞 | Button, Input, Icon, Label |
| Composite | 機能を表す複合名詞 | SearchBar, FormField, Card, Tabs |
| プロダクト側 | 業務ドメイン＋名詞 | ProductCard, PaymentSummary, LoginForm |
