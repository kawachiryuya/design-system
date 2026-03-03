# デザインシステム ロードマップ

**最終更新**: 2026年3月2日

---

## ✅ 完了済み

### Phase 1〜4: 原則ドキュメント（62ファイル）
`principles/` に配置済み（foundation / layout / interaction / content / color / motion / patterns / platform）

### Phase A: デザイントークン（7ファイル）
`tokens/` に配置済み（spacing / colors / typography / shadows / radius / breakpoints / animation）

### Phase B: Primitive コンポーネント（11個）
`components/primitives/` に配置済み。

### Phase C: Storybook
- ローカル: `npm run storybook` → http://localhost:6006
- 公開 URL: https://design-system-storybook-murex.vercel.app
- GitHub: https://github.com/kawachiryuya/design-system（Private）
- `main` ブランチへの push で自動デプロイ

### Phase D: Composite コンポーネント（15個）
`components/composites/` に配置済み。

| コンポーネント | 概要 |
|---|---|
| CheckboxGroup | fieldset + legend + helpText / error のチェックボックスグループラッパー |
| SearchBar | SearchIcon + Input + ClearButton + LoadingSpinner |
| Card | elevated / outlined / flat + Header / Body / Footer スロット |
| Alert | success / error / warning / info / neutral + 閉じるボタン |
| EmptyState | アイコン + タイトル + 説明 + アクション |
| Breadcrumb | chevron / slash / dot セパレーター + aria-current |
| Tabs | underline / pill + キーボード操作 + バッジ + 制御 / 非制御 |
| Pagination | 省略記号 + 最初・最後ボタン + サイズ |

---

## 🔧 Storybook ブラッシュアップ

### Phase SB-1: 一貫性の修正 ✅

- サイドバー命名統一（`Components/` → `Composites/`）— 15ファイル + Introduction.mdx
- ROADMAP.md の旧構造名（atoms/molecules）を primitives/composites に修正
- Token Stories（Colors / Typography / Spacing）を `tokens/*.json` からの import に切り替え

### Phase SB-2: ストーリーの充実 ✅

**Interaction Tests 追加**
現在 play function があるのは 4 コンポーネントのみ。以下に追加する。

| 優先度 | コンポーネント | テスト内容 |
|--------|--------------|-----------|
| 高 | Button | クリック・ローディング状態・disabled の動作 |
| 高 | Switch | トグル操作・状態切替 |
| 高 | Alert | 閉じるボタンの dismiss 動作 |
| 中 | Select | ドロップダウン開閉・選択 |
| 中 | Radio | 選択切替・グループ内移動 |
| 中 | Pagination | ページ遷移・省略記号の挙動 |

※ 既存: Checkbox, CheckboxGroup, Tabs, SearchBar（変更なし）

**Button Story 補完**
- `AllSizes` — small / medium / large の横並び比較
- `FullWidth` — 全幅表示

**欠落 .md の作成**（既存の Button.md フォーマットに準拠）

| コンポーネント | パス |
|---|---|
| Alert | `components/composites/Alert/Alert.md` |
| Breadcrumb | `components/composites/Breadcrumb/Breadcrumb.md` |
| Card | `components/composites/Card/Card.md` |
| EmptyState | `components/composites/EmptyState/EmptyState.md` |
| Pagination | `components/composites/Pagination/Pagination.md` |
| Tabs | `components/composites/Tabs/Tabs.md` |

### Phase SB-3: トークン可視化の拡充 ✅

`tokens/` の残り 3 トークン（Shadows / Radius / Animation）の Story を追加。
デザイントークンの全体像が Storybook 上で確認可能に。

| ファイル | 内容 |
|---------|------|
| `components/tokens/Shadows.stories.tsx` | none → 2xl のエレベーション段階を視覚化 |
| `components/tokens/Radius.stories.tsx` | none → full の角丸バリエーション表示 |
| `components/tokens/Animation.stories.tsx` | duration × easing のトランジションデモ |

※ Breakpoints は Story での可視化が難しいため、必要に応じて後日検討。

### Phase SB-4: ドキュメント改善（検討）

- autodocs の出力品質向上（JSDoc コメント・props の description 充実）
- Introduction.mdx への使い方ガイド追加（「はじめ方」「コンポーネントの選び方」など）
- 各 `.md` を `.mdx` に変換し Storybook 上で閲覧可能にする案は、メンテナンスコスト増のため保留

---

## 🚧 未着手

### Phase E: Patterns（複合パターン）

Composites を複数組み合わせたセクション単位のコンポーネント。
`components/patterns/` に配置する。

#### 採用基準

**「複数プロダクトで再利用される汎用パターン」のみ採用する。**

- 特定プロダクトでしか使わないパターンは、プロダクト側の `components/` に置く
- 「2つ目のプロダクトで同じパターンが必要になった時点」で Pattern に昇格させる
- ビジネスロジックを含まない。レイアウト・インタラクションの枠組みのみ提供する

#### import ルール

```
Patterns は Composites と Primitives を import できる。
Composites は Patterns を import できない（依存方向は常に上→下）。
```

#### 候補

| パターン | 構成要素 | 備考 |
|---|---|---|
| Modal / Dialog | オーバーレイ + Card + フォーカストラップ | ほぼすべてのプロダクトで必要 |
| Toast | Alert ベースの画面端通知 | 通知はどのプロダクトにもある |
| Header | ロゴ + ナビゲーション + SearchBar | サイト共通 |
| Footer | リンク + コピーライト | サイト共通 |

※ DataTable は管理画面特有のため、必要になった時点で再評価する。

### Phase F: ポートフォリオサイト ✅

このデザインシステムを基盤として構築・Vercel 公開済み。

- **公開 URL**: https://kawachi-portfolio.vercel.app（自動デプロイ）
- **リポジトリ**: https://github.com/kawachiryuya/portfolio（Private）
- **ディレクトリ**: `designSystem/` と並列の `portfolio/`

---

## 📁 ディレクトリ規則

```
Primitive  → components/primitives/ComponentName/
Composite  → components/composites/ComponentName/
Pattern    → components/patterns/ComponentName/
```

各コンポーネントは `ComponentName.tsx` / `ComponentName.stories.tsx` / `ComponentName.md` / `index.ts` の4ファイル構成。

---

## 📐 コンポーネント分類と依存ルール

```
Primitives    他のコンポーネントを import しない
    ↑
Composites    Primitives のみ import 可
    ↑
Patterns      Composites + Primitives を import 可
    ↑
プロダクト層   すべてを import 可（デザインシステム外）
```

- **Primitives / Composites / Patterns** → このリポジトリで管理（汎用層）
- **プロダクト層** → 各プロダクトのリポジトリで管理

### Storybook のカテゴリ構成

```
Tokens/          デザイントークンの可視化
Primitives/      単一 HTML 要素ラッパー（11個）
Composites/      Primitives の組み合わせ（15個）
Patterns/        Composites の組み合わせ（Phase E）
[Product名]/     プロダクト固有のコンポーネント（任意）
```

プロダクト固有のコンポーネントも同じ Storybook 上で確認可能にする。
プロダクトが増えて管理が煩雑になった場合は、プロダクト側に Storybook を分離する。
