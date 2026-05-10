# AGENTS.md — AI 向けデザインシステム運用ガイド

> Claude Code / Cursor などの AI コーディングエージェントが、本リポを `Read` した時点で迷わず動けるよう、設計判断・運用規約・参照優先順位を集約します。人間の onboarding にも使える内容を意図しています。

**最終更新**: 2026-05-10
**戦略メモ（人生経営側）**: `kawachiryuya/ai-management` リポの `01_areas/work/design-dev/DESIGN-SYSTEM.md`
**親 Issue**: [kawachiryuya/ai-management#14](https://github.com/kawachiryuya/ai-management/issues/14)

## 関連ファイル

| ファイル | 内容 |
|---|---|
| `README.md` | クイックスタート・ディレクトリ概要（ユーザー向け） |
| `CONTEXT.md` | 過去の作業ログ・進捗履歴（Cursor 作業再開ガイド） |
| `AGENTS.md`（本ファイル） | AI コーディング規約・参照優先順位 |
| `docs/ai-roadmap.md` | AI 活用 SSOT 化のロードマップ詳細・実装ガイド |
| `principles/` | デザイン原則（62 ファイル、a11y / 色 / レイアウト等） |

---

## 1. リポを操作する前に必読

新規セッションで本リポを操作する場合、以下を順に `Read` してください:

1. `README.md` — リポ全体像とビルドコマンド
2. `AGENTS.md`（本ファイル） — 設計規約と禁則
3. `tokens/semantic-colors.json` — semantic 色の WHERE × WHAT 構造
4. `components/primitives/Button/Button.tsx` — Primitive 実装パターンの参照点
5. `components/composites/Card/Card.tsx` — Composite 実装パターンの参照点
6. 必要に応じて `principles/foundation/accessibility.md` 等の関連原則

---

## 2. コンポーネント選択フロー

### 用途別マッピング

| やりたいこと | 第一候補 | 補足 |
|---|---|---|
| 主要アクション | `<Button variant="primary">` | 1 画面に primary は通常 1 個 |
| 副次アクション | `<Button variant="secondary">` | primary と並べて対比 |
| 補助アクション | `<Button variant="tertiary">` | 取り消し / 戻る等 |
| 遷移 / 外部リンク | `<Link>` | `<Button>` ではない |
| 状態通知（成功/警告等） | `<Alert>` | success/error/warning/info/neutral |
| 補足ラベル | `<Badge>` | 主張の弱い情報マーカー |
| アイコン | `<Icon>` | 直接 SVG 埋込みではなく必ず `<Icon>` |
| テキストの装飾的階層 | `<Typography>` | `<h1>` 直書きより推奨 |
| ローディング | `<Spinner>` または `<Skeleton>` | 待機状態の見せ方で使い分け |

### Primitive vs Composite

- **Primitive** (`components/primitives/`): 単一 HTML 要素ラッパー（11 個）
- **Composite** (`components/composites/`): 複数 Primitive の組合せ or 状態管理あり（15 個）

### 禁則

- `<button>` 直接使用禁止 → 必ず `<Button>`
- `<a>` 直接使用禁止 → 必ず `<Link>`（native `<a>` が必須な場面のみ例外）
- 色の primitive 直接指定禁止: `bg-blue-500` `bg-primary-600` → 後述の semantic 色を使う
- インラインスタイルでの色指定禁止: `style={{ color: '#xxx' }}`

---

## 3. トークン参照ルール

### トークン階層

```
tokens/colors.json          ← primitive tokens（10-step scale: primary-50〜900 等）
tokens/semantic-colors.json ← semantic tokens（WHERE × WHAT）
   └ value で primitive を参照、description で意味付け
.storybook/tailwind.css     ← CSS 変数定義（semantic を実体化）
   └ Storybook 環境用、PJ 配備時は別途 export 必要（Phase 1 で整備予定）
tailwind.config.js          ← Tailwind class へマッピング
```

### 参照優先順位（厳守）

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

`gunmaas/`, `lp/`, `demo*/` 等の **PJ ディレクトリ内** で、PJ ブランド固有の見栄え調整のために primitive スケールを extend する場合は OK（ただし semantic を上書きする方を推奨）。

---

## 4. PJ オーバーライド方法

> **現状**: design-system はまだ npm パッケージ化されていない（[kawachiryuya/ai-management#35](https://github.com/kawachiryuya/ai-management/issues/35) で対応予定）。下記は **Phase 2 完了後の理想形**。

### 想定構成

```js
// PJ の tailwind.config.js
module.exports = {
  presets: [require('@kawachiryuya/design-system/tailwind')],
  content: [/* PJ の content path */],
  theme: {
    extend: {
      // PJ 固有の extend のみ。preset を上書きしないこと
    },
  },
};
```

### ブランドカラーの差し替え

PJ ルートの CSS で CSS 変数を上書き:

```css
/* PJ の globals.css */
@import "@kawachiryuya/design-system/styles/variables.css";

:root {
  --color-surface-primary: #ff6600;  /* PJ ブランド色 */
  --color-on-primary: #ff6600;       /* テキスト色も連動 */
}
```

これで `bg-surface-primary` `text-onSurface-primary` を使ったコンポーネントが PJ ブランドに切り替わる（コンポーネント実装は無変更）。

### リポ内の実例（参考）

- `gunmaas/` = サンプル PJ
- `lp/` = ランディングページ PJ
- `demo/`, `demo2/` = デモ用 PJ

各 PJ の `tailwind.config.js` を参照すると、現状のオーバーライドパターンが分かります。

---

## 5. 検証サイト（PJ ディレクトリの位置付け）

リポ内に同居する複数の PJ ディレクトリは、それぞれ役割が異なります。**検証作業は `demo/` で行う**のが基本ルールです。

| ディレクトリ | 位置付け | 用途 |
|---|---|---|
| **`demo/`** ⭐ | **デザインシステム検証サイト** | コンポーネント変更後の動作確認・回帰テスト・AI 生成 UI のトーン揃え検証はここで行う |
| `gunmaas/` | サンプル PJ（GunMaaS プロトタイプ） | 個別 PJ 例として保持 |
| `lp/` | ランディングページ | 公開用 LP |
| `demo2/` | デモ 2 | 補助的なデモ |

### `demo/` を検証サイトとして使う理由

- React Router で 8 ページ構成（鉄道予約デモ）→ ルーティング・レイアウト・状態管理を含む現実的な利用シナリオ
- Vite alias `@ds` で design-system コンポーネントを直接 import
- Tailwind config が design-system の `tokens/*.json` を相対参照
- `npm run deploy` で Vercel 配信可能 → 公開検証も可

### 検証フロー（コンポーネント / トークン変更時）

1. design-system 本体を編集
2. `cd demo && npm run dev` で http://localhost:5173 起動
3. 影響範囲の画面（例: ボタン変更なら `/results` `/confirm` 等）を目視確認
4. 必要なら `npm run build` でビルドエラーをチェック
5. 重要な変更なら Storybook（リポルートで `npm run storybook`）でも確認

### demo の現状の手書き同期（Phase 1 で解消予定）

- `demo/src/index.css` に CSS 変数のコピーがある（`.storybook/tailwind.css` と同内容を手書き同期中）
- `demo/tailwind.config.js` の semantic 部分も design-system 本体と重複
- → Style Dictionary 化（[#32](https://github.com/kawachiryuya/ai-management/issues/32)）で `tokens/build/variables.css` と `tokens/build/tailwind-preset.js` を自動生成し、両方が import / preset 参照する形に移行

---

## 6. ビルドコマンド

| コマンド | 用途 |
|---|---|
| `npm install` | 依存インストール（postinstall で `tokens:build` も自動実行） |
| `npm run tokens:build` | Style Dictionary でトークンを `tokens/source/` から `tokens/build/` へビルド |
| `npm run tokens:watch` | トークンソース変更を監視して自動ビルド |
| `npm run tokens:typecheck` | `tokens/index.ts` の型整合性をチェック |
| `npm run storybook` | Storybook ローカル起動（http://localhost:6006、tokens を pre-build） |
| `npm run build-storybook` | Storybook 静的書き出し（`storybook-static/`、tokens を pre-build） |
| `npm run build:gunmaas` | gunmaas PJ ビルド |
| `npm run build:demo` | demo PJ ビルド |

### トークン参照の使い分け

- **TypeScript / 型付き参照**: `import { COLORS, SPACING } from '../tokens'` → `tokens/index.ts` 経由でネスト構造の型付き const にアクセス（AI 用途で推奨）
- **CSS 変数**: `var(--color-surface-primary)` → `tokens/build/variables.css` を `@import` する（`.storybook/tailwind.css` と `demo/src/index.css` で実装済み）
- **Tailwind**: `tokens/preset.cjs` 経由。各 PJ の `tailwind.config.js` で `presets: [require('.../tokens/preset.cjs')]` で継承（root / demo / gunmaas で実装済み）

### Phase 1 完了時のトークン全体図

```
tokens/source/*.json         （一次ソース、人間が編集する）
        ↓ npm run tokens:build (Style Dictionary)
        ├→ tokens/build/tokens.json    （AI 用ネストJSON、gitignore）
        ├→ tokens/build/tokens.ts      （AI 用 TS const、gitignore）
        ├→ tokens/build/variables.css  （CSS 変数、gitignore）
        └→ tokens/{colors,spacing,...}.json  （旧形式、stories 用、gitignore）

tokens/index.ts              （AI 用 public API、TOKENS / COLORS / SPACING ... を export）
tokens/preset.cjs            （Tailwind preset、各 PJ tailwind.config.js が継承）
```

---

## 7. 新規コンポーネント追加時の規約

各コンポーネントは **4 ファイル構成**:

| ファイル | 内容 |
|---|---|
| `ComponentName.tsx` | React 実装（`React.forwardRef` + JSDoc 必須） |
| `ComponentName.stories.tsx` | Storybook Story |
| `ComponentName.md` | 設計ドキュメント |
| `index.ts` | エクスポート（named export + 型 re-export） |

### 配置ルール

```
Primitive → components/primitives/ComponentName/
Composite → components/composites/ComponentName/
```

### Props 規約

- `interface ComponentProps extends React.HTMLAttributes<...>` で native 属性を継承
- 各 Props に **JSDoc コメント**（日本語可）
- コンポーネント本体に **`@example` JSDoc** を最低 1 例
- `forwardRef` で ref 透過

参考実装: `components/primitives/Button/Button.tsx`

### 新規追加時の依頼プロンプト例

CONTEXT.md §「次のコンポーネントを作るときのプロンプト例」を参照。要点:

```
このデザインシステムに新しい Composite コンポーネント「XXX」を追加してください。

【ディレクトリ規則】
- Primitive → components/primitives/XXX/
- Composite → components/composites/XXX/

【参照ファイル】
- components/primitives/Button/Button.tsx（Primitive の実装パターン）
- components/composites/Card/Card.tsx（Composite の実装パターン）
- AGENTS.md §3 トークン参照ルール
- principles/（関連する原則ドキュメント）

【作成するファイル】
- components/{primitives|composites}/XXX/XXX.tsx
- components/{primitives|composites}/XXX/XXX.stories.tsx
- components/{primitives|composites}/XXX/XXX.md
- components/{primitives|composites}/XXX/index.ts
```

---

## 8. アクセシビリティ前提

- フォーカスリング: `focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-border-focus` を Primitive に標準装備
- 最小タッチターゲット: 44x44px（WCAG 2.5.5 AAA）。Button の medium が 48px、small が 40px は icon-only 用途
- セマンティック HTML: `<button>` `<a>` `<label>` を Primitive 内で適切に使用
- aria 属性: 状態を持つコンポーネント（Tabs, Pagination, Switch 等）は aria-* を実装済み
- 詳細は `principles/foundation/accessibility.md` 参照

---

## 9. リポ全体の変更時に守ること

- トークン構造を変更したら **`docs/ai-roadmap.md`** も同 PR で更新（風化防止）
- semantic 色を追加したら `.storybook/tailwind.css` の CSS 変数も同期
- 既存 PJ（gunmaas/lp/demo/demo2）のビルドが壊れないか `npm run build:gunmaas` 等で確認
- 大きな変更は `CONTEXT.md` に作業ログとして追記
