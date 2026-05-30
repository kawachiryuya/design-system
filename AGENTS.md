# AGENTS.md — AI 向け運用規約

Claude Code / Cursor などの AI コーディングエージェントが本リポを操作する際の **実装ルール** を集約。設計戦略 (なぜ・何を) は [`design-system-strategy.md`](./design-system-strategy.md) を参照。

---

## 1. 新規セッションで最初に読むもの

1. [`README.md`](./README.md) — リポ全体像とビルドコマンド
2. [`design-system-strategy.md`](./design-system-strategy.md) — Parts/Blocks 構成、common/product 分離、トークン階層
3. 本ファイル — 実装規約と禁則
4. [`tokens/source/semantic-colors.json`](./tokens/source/semantic-colors.json) — semantic 色の構造
5. [`components/primitives/Button/Button.tsx`](./components/primitives/Button/Button.tsx) — Primitive 実装パターンの参照点
6. [`components/composites/Card/Card.tsx`](./components/composites/Card/Card.tsx) — Composite 実装パターンの参照点

---

## 2. コンポーネント選択フロー

### 用途別マッピング

| やりたいこと | 第一候補 | 補足 |
|---|---|---|
| 主要アクション | `<Button variant="primary">` | 1 画面に primary は通常 1 個 |
| 副次アクション | `<Button variant="secondary">` | primary と並べて対比 |
| 補助アクション | `<Button variant="tertiary">` | 取り消し / 戻る等 |
| 遷移 / 外部リンク | `<Link>` | `<Button>` ではない |
| 状態通知 (成功/警告等) | `<Alert>` | success/error/warning/info/neutral |
| 補足ラベル | `<Badge>` | 主張の弱い情報マーカー |
| アイコン | `<Icon>` | 直接 SVG 埋込みではなく必ず `<Icon>` |
| テキストの装飾的階層 | `<Typography>` | `<h1>` 直書きより推奨 |
| ローディング | `<Spinner>` または `<Skeleton>` | 待機状態の見せ方で使い分け |

### Primitive vs Composite

- **Primitive** (`components/primitives/`): 単一 HTML 要素ラッパー (戦略上の Parts に対応)
- **Composite** (`components/composites/`): 複数 Primitive の組合せ or 状態管理あり (戦略上の Blocks に対応)

### 禁則

- `<button>` 直接使用禁止 → 必ず `<Button>`
- `<a>` 直接使用禁止 → 必ず `<Link>` (native `<a>` が必須な場面のみ例外)
- 色の primitive 直接指定禁止: `bg-blue-500` / `bg-primary-600` → 後述の semantic 色を使う
- インラインスタイルでの色指定禁止: `style={{ color: '#xxx' }}`

---

## 3. トークン参照ルール

### トークン階層

```
tokens/source/colors.json          ← primitive tokens (10-step scale: primary-50〜900 等)
tokens/source/semantic-colors.json ← semantic tokens (WHERE × WHAT)
   └ value で primitive を参照、description で意味付け
tokens/build/variables.css         ← Style Dictionary で自動生成された CSS 変数
tokens/preset.cjs                  ← Tailwind preset、各 PJ tailwind.config.js が継承
```

### 参照優先順位 (厳守)

1. **Semantic を最優先**: `bg-surface-primary` / `text-onSurface-default` / `border-border-default`
2. **Primitive 直参照は禁止**: PJ override 互換性のため
3. **インラインスタイルでの色指定は禁止**

### 例

```tsx
// ✅ OK
<div className="bg-surface-primary text-onSurface-inverse">CTA</div>
<div className="bg-surface-success-muted border border-border-success-muted">成功</div>

// ❌ NG
<div className="bg-primary-600 text-white">CTA</div>
<div style={{ backgroundColor: '#008965' }}>CTA</div>
```

### 例外

PJ 側 (本リポを依存として使う product 側) で、ブランド固有の見栄え調整のために primitive スケールを extend する場合は OK (ただし semantic を上書きする方を推奨)。

---

## 4. ビルドコマンド

| コマンド | 用途 |
|---|---|
| `npm install` | 依存インストール |
| `npm run tokens:build` | Style Dictionary でトークンを `tokens/source/` から `tokens/build/` へビルド |
| `npm run tokens:watch` | トークンソース変更を監視して自動ビルド |
| `npm run tokens:typecheck` | `tokens/index.ts` の型整合性をチェック |
| `npm run storybook` | Storybook ローカル起動 (http://localhost:6006) |
| `npm run build-storybook` | Storybook 静的書き出し (`storybook-static/`) |
| `npm run build` | コンポーネント + tokens の TS コンパイル (→ `dist/`) |

### トークン参照の使い分け

- **TypeScript / 型付き参照**: `import { COLORS, SPACING } from '../tokens'` → `tokens/index.ts` 経由
- **CSS 変数**: `var(--color-surface-primary)` → `tokens/build/variables.css` を `@import`
- **Tailwind**: `tokens/preset.cjs` 経由。各 PJ の `tailwind.config.js` で `presets: [require('.../tokens/preset.cjs')]` で継承

---

## 5. 新規コンポーネント追加時の規約

各コンポーネントは **4 ファイル構成**:

| ファイル | 内容 |
|---|---|
| `ComponentName.tsx` | React 実装 (`React.forwardRef` + JSDoc 必須) |
| `ComponentName.stories.tsx` | Storybook Story |
| `ComponentName.md` | 設計ドキュメント |
| `index.ts` | named export + 型 re-export |

### 配置ルール

```
Primitive (Parts) → components/primitives/ComponentName/
Composite (Blocks) → components/composites/ComponentName/
```

### Props 規約

- `interface ComponentProps extends React.HTMLAttributes<...>` で native 属性を継承
- 各 Props に JSDoc コメント (日本語可)
- コンポーネント本体に `@example` JSDoc を最低 1 例
- `forwardRef` で ref 透過

参考実装: [`components/primitives/Button/Button.tsx`](./components/primitives/Button/Button.tsx)

### 新規追加時の依頼プロンプト例

```
このデザインシステムに新しい Composite コンポーネント「XXX」を追加してください。

【配置ルール】
- Primitive → components/primitives/XXX/
- Composite → components/composites/XXX/

【参照ファイル】
- components/primitives/Button/Button.tsx (Primitive 実装パターン)
- components/composites/Card/Card.tsx (Composite 実装パターン)
- AGENTS.md §3 トークン参照ルール
- principles/ の関連ドキュメント

【作成するファイル】
- components/{primitives|composites}/XXX/XXX.tsx
- components/{primitives|composites}/XXX/XXX.stories.tsx
- components/{primitives|composites}/XXX/XXX.md
- components/{primitives|composites}/XXX/index.ts
```

---

## 6. アクセシビリティ前提

- フォーカスリング: `focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-border-focus` を Primitive に標準装備
- 最小タッチターゲット: 44x44px (WCAG 2.5.5 AAA)
- セマンティック HTML: `<button>` / `<a>` / `<label>` を Primitive 内で適切に使用
- aria 属性: 状態を持つコンポーネント (Tabs, Pagination, Switch 等) は aria-* を実装済み
- 詳細は [`principles/Foundation/accessibility.mdx`](./principles/Foundation/accessibility.mdx) 参照

---

## 7. 検証フロー

コンポーネント / トークン変更時:

1. design-system 本体を編集
2. `npm run storybook` で http://localhost:6006 起動、該当コンポーネントを目視確認
3. 必要なら `npm run build` で型エラーをチェック
4. 本リポを依存として使う product 側のビルドが壊れないか確認 (本リポを `npm link` または公開済みパッケージ経由で参照)

検証用のリアルアプリは別リポジトリで管理 (例: [`rail-demo`](https://github.com/kawachiryuya/rail-demo))。本リポは common (npm 化単位) のみを扱う。

---

## 8. 変更時に守ること

- semantic 色を追加したら `tokens/build/variables.css` が自動生成されることを `npm run tokens:build` で確認
- 依存している product 側のビルドが壊れないか、本リポを `npm link` または公開バージョン経由で確認
- 戦略レベルの変更 (Parts/Blocks 分類の変更、新カテゴリ追加等) は [`design-system-strategy.md`](./design-system-strategy.md) も同 PR で更新
