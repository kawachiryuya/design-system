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
| スクリーンリーダ専用テキスト | `<VisuallyHidden>` | icon-only Button の補助ラベル / live region |
| モーダル表示 | `<Modal>` | ネイティブ `<dialog>` ベース。確認ダイアログ・フォーム入力等 |
| 一時通知 | `<Toast>` / `useToast()` | 操作結果の一時表示。Alert (インライン定常) と棲み分け |

### Primitive vs Composite

判定基準を **構造と状態の 2 軸** で厳密化する (2026-06-04 Phase 1)。

- **Primitive** (`components/primitives/`): **単一の HTML 要素を装飾**する薄いラッパー、かつ **状態管理を持たない**。戦略上の Parts に対応
- **Composite** (`components/composites/`): いずれかを満たす場合 (戦略上の Blocks に対応)
  - 複数の HTML 要素 / Primitive を組み合わせる (例: Switch の `<Label>` + `<button>` 内包)
  - 状態管理を持つ (例: Modal の open/close、CheckboxGroup の group state)
  - 振る舞いを持つ (focus trap / portal / animation / overlay 等)

判定の具体例:

| Component | 判定 | 理由 |
|---|---|---|
| Button / Link / Icon / Typography / Label | Primitive | 単一 HTML 要素、状態なし |
| Badge | Primitive | 単一 `<span>`、状態なし |
| Spinner / Skeleton / Divider / VisuallyHidden | Primitive | 単一要素、状態なし |
| Input / Textarea / Image | Primitive | 単一 HTML 要素 (`<input>` / `<textarea>` / `<img>`)、状態は uncontrolled or controlled prop のみ |
| Switch | Composite | `<Label>` 内包 + `<button role="switch">`、label position 切替 |
| Checkbox / Radio | Composite | `<Label>` + `<input>` + `<FormMessage>` を内包、`CheckboxGroup` / `RadioGroup` で group state |
| ProgressBar | Composite | label + value 表示 + track + fill の **複数 `<div>` / `<span>`** 構造 |
| Modal / Toast / Popover | Composite | portal / focus trap / overlay |
| Card / Tabs / Accordion / Pagination | Composite | 構造の組合せ + 状態管理 |

### 禁則

- `<button>` 直接使用禁止 → 必ず `<Button>`
- `<a>` 直接使用禁止 → 必ず `<Link>` (native `<a>` が必須な場面のみ例外)
- 色の primitive 直接指定禁止: `bg-blue-500` / `bg-primary-600` → §3 の semantic 色を使う
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

### トークン参照の使い分け

- **TypeScript / 型付き参照**: `import { COLORS, SPACING } from '../tokens'` → `tokens/index.ts` 経由
- **CSS 変数**: `var(--color-surface-primary)` → `tokens/build/variables.css` を `@import`
- **Tailwind**: `tokens/preset.cjs` 経由。各 PJ の `tailwind.config.js` で `presets: [require('.../tokens/preset.cjs')]` で継承

### semantic token を定義するときの規約

[`tokens/source/semantic-colors.json`](./tokens/source/semantic-colors.json) で新規 semantic token を追加・更新するときの規約 (token メンテナ向け、利用側は §3 上記まででよい)。

**3-1. value は必ず primitive 参照、生 hex は禁止**

```jsonc
// ✅ OK
"surface": { "primary": { "value": "{color.primary.700}" } }
// ❌ NG
"surface": { "primary": { "value": "#006F50" } }
```

理由: 生 hex は下流 product が primary palette を override しても connect しない (silent link)。`{color.X.Y}` で参照しておけば下流の override に自動追従する。**2026-06-04 以降、`bg.default` も含めて semantic は全て primitive 経由**。

**3-2. 透過オーバーレイは `color-mix()` で primitive と連動させる**

primitive 色に半透明を載せた overlay (`state.hover-on-primary` 等) は、CSS `color-mix()` + Style Dictionary 参照で書く:

```jsonc
// ✅ OK
"hover-on-primary": {
  "value": "color-mix(in srgb, {color.primary.700} 8%, transparent)"
}
// ❌ NG (旧バージョンのハードコード、primary.700 変更時に手動更新必要)
"hover-on-primary": {
  "value": "rgba(0, 111, 80, 0.08)"
}
```

`color-mix()` 対応ブラウザ: Safari 16.4 / Chrome 111 / Firefox 113 以降 (2023 春以降)。

中性 (黒/白) オーバーレイ (`state.hover` 等) は primitive 依存がないので `rgba(0, 0, 0, 0.08)` 等の生 rgba でよい。

**3-3. `primary.25` は `bg.default` 専用**

`color.primary.25` (#F5F7F5) は brand 色の最薄 tint として bg.default 専用に用意した。Text / Border / 他用途では使わない (description にも明記)。「ページ最下層に brand canvas を敷く」設計のための専用 token。

**3-4. semantic-only スケール (z-index / opacity / focus-ring)**

「具体値より役割名で意図が伝わる」種類のスケールは **primitive 層を持たず semantic 名のみ** で運用する。生数値での参照は禁止。

- `z-index`: `dropdown / sticky / overlay / modal / popover / toast / tooltip` の 7 layer。`z-modal` のように使う (`z-50` 等の Tailwind 既定は並存するが新規利用は避ける)
- `opacity`: `disabled / muted / spinner-track / spinner-spin` の意味付き 4 値。`opacity-disabled` のように使う
- `focus-ring`: `ring-focus` (width=2px) / `ring-offset-focus` (offset=2px)。色は `border-focus` (semantic-colors) と組合せる: `focus-visible:ring-focus focus-visible:ring-offset-focus focus-visible:ring-border-focus`

---

### サイズスケール内の `md = default` 規約

サイズスケールを持つカテゴリでは、**`md` をカノニカルなデフォルト値** とし、**中核は `sm / md / lg` の 3 段で揃える**。境界値 (`none` / `full`) は必要に応じて追加するが、`xs` / `xl` / `2xl` のような外側の段はデフォルトでは持たない (実利用が薄く、`md = default` の見え方を歪めるため)。

source token には DEFAULT キーを足さず (size label の純度を保つため)、`tokens/preset.cjs` で `DEFAULT` エイリアスを `md` にマップする:

```js
// tokens/preset.cjs
boxShadow:    { ...t.shadow,  DEFAULT: t.shadow.md  },
borderRadius: { ...t.radius,  DEFAULT: t.radius.md  },
```

これにより `rounded` ≒ `rounded-md`、`shadow` ≒ `shadow-md` で動く。

**対象カテゴリ**:
- `radius`: `none / sm / md / lg / full` (5 段、中核 sm/md/lg + 境界 none/full)
- `shadow`: `none / sm / md / lg` (4 段、中核 sm/md/lg + 境界 none)
- **コンポーネントの `size` prop**: `Input` / `Label` / `Button` / `Badge` 等の Primitive、および `SearchBar` / `Radio` / `Checkbox` / `Switch` / `SegmentedControl` / `NumberInput` / `Select` 等の Composite で **`sm / md / lg` の文字列リテラル** に統一 (`small` / `medium` / `large` 表記は禁止)。これにより `<Button size="md">` / `rounded-md` / `shadow-md` / `text-md` が同じ `md` で並ぶ。Spinner (`xs/sm/md/lg/xl/2xl`) や Icon (`sm/md/lg/xl`)、Avatar (`xs/sm/md/lg/xl`) のように境界スケールを持つ component も、ラベル流派は `sm/md/lg` で揃える
- **Button の Radius は size 連動**: `Button size="sm" → rounded-sm` / `size="md" → rounded-md` / `size="lg" → rounded-lg`。size と radius が同じラベルで揃うため設計が直感的

**非対象**:
- **`font-size`**: Tailwind の慣習で `text-base` が body text のデフォルトとして広く認知されているため、`base` ラベルをそのまま維持 (本リポでも `text-base` は 16px の body 用途)
- **`spacing`**: 0〜96 の数値スケールで size label でないため対象外
- **その他 semantic ラベル系** (font-weight, line-height, letter-spacing, animation duration/easing, font-family, breakpoints, color palette): 用途ラベル / 数値スケールであり、`md = default` 規約は適用しない

---

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

---

## 5. コンポーネント実装規約 (新規・既存共通)

新規追加・既存移行どちらも **本セクションが規約の SSoT**。進め方は §6 (新規) / §7 (既存) を参照。

### 5-1. 4 ファイル構成

情報の置き場を重複させないため、ファイルごとに担当範囲を厳密に分ける。

| ファイル | 担当 |
|---|---|
| `ComponentName.tsx` | React 実装 + 全 Props の JSDoc + `@example` (autodocs に流れる) |
| `ComponentName.stories.tsx` | Storybook Story (**標準 7 節構成** — Docs/Playground/Variants/Sizes/States/WithIcon/EdgeCases) |
| `ComponentName.guideline.mdx` | **コンポーネントの Docs ページを兼ねる** (`<Meta of={Stories} name="Guideline" />` で autodocs を置き換え)。テキスト中心の設計指針 |
| `index.ts` | named export + 型 re-export |

配置先は §2 の Primitive vs Composite 判定に従う:

```
Primitive (Parts) → components/primitives/ComponentName/
Composite (Blocks) → components/composites/ComponentName/
```

### 5-2. `.tsx` の規約

- `interface ComponentProps extends React.HTMLAttributes<...>` で native 属性を継承
- **各 Props に JSDoc コメント必須** — Storybook の autodocs (`react-docgen-typescript`) が拾い、Props 表の Description 列に自動表示される
- `@default` JSDoc タグで既定値を明記する (Props 表に出る)
- **Props の説明は `.tsx` JSDoc が唯一の情報源**。`.stories.tsx` の `argTypes` 側に `description` を書くと JSDoc を上書きしてしまうので書かない
- ネイティブ HTML 属性 (`disabled` 等、`React.ButtonHTMLAttributes` 等から継承) は **再宣言して JSDoc を上書き** する (React の型には JSDoc が付いておらず Props 表で Description 空欄になる回避)
- コンポーネント本体に `@example` JSDoc を 2〜3 例
- `forwardRef` で ref 透過
- **styling は `tailwind-variants` (`tv`)** で variant マップを宣言的に保持 (`Button.tsx` の `buttonVariants` 参照)。文字列配列の組立て・object lookup は避ける
- `@see principles/...` は **`.mdx` 拡張子で統一** (§9-1)

### 5-3. `.stories.tsx` の規約 — 標準ストーリー構造 (固定順序)

**全コンポーネントで節の命名と順序を統一する**。デザイナー以外の読者が「次のコンポーネントを見ても並びが同じ」状態を作るのが目的。

| 順 | 節名 | 役割 | 必須 | 備考 |
|---|---|---|---|---|
| 1 | (Docs) | autodocs の Docs ページ。本リポでは `.guideline.mdx` が `<Meta of={...} />` で兼ねる | 必須 | サイドバーで「Guideline」と表示される |
| 2 | **Playground** | `args` を全開放、Controls で props を探索する起点 | 必須 | play test (`onClick: fn()` 等) もここに置く |
| 3 | **Variants** | 種類違いを **静的に横並び** (`primary` / `secondary` / `tertiary` 等) | 任意 | 該当する prop が無ければ省略 |
| 4 | **Sizes** | サイズ違いを静的に横並び (`small` / `medium` / `large` 等) | 任意 | 該当する prop が無ければ省略 |
| 5 | **States** | Default / Hover / Focus-visible / Active / Disabled / Loading を **単独で並べる** | 状態を持つ component で必須 | Hover/Focus/Active は `storybook-addon-pseudo-states` で強制表示 (`parameters.pseudo`)。非 interactive (Badge / Skeleton / Spinner / Divider / VisuallyHidden) は省略可、理由を冒頭 docstring に明記 |
| 6 | **WithIcon** | `icon` / `leadingIcon` / `trailingIcon` / `iconOnly` などの ReactNode prop パターン | 任意 | icon 系 prop が無ければ省略 |
| 7 | **EdgeCases** | `fullWidth` / 長文ラベル / truncate / 空文字など壊れやすいケースの監視 | 任意 | コンポーネント固有のリスクケースを並べる |

**書き方ルール**:
- CSF3 (`Meta` + 名前付き `export`)
- `tags: ['autodocs']` は **付けない** (`.guideline.mdx` が `<Meta of>` で Docs を兼ねるため)
- 各 story に `parameters.docs.description.story` で一行説明を必須
- Variants / Sizes / States / WithIcon / EdgeCases は **args 非依存の静的 render** (視覚回帰の対象に)
- 色・余白はハードコードせず Tokens (semantic Tailwind ユーティリティ) を参照

**節省略の判断**:

| 節 | 省略してよい場合 |
|---|---|
| Variants | variant 概念がない (Skeleton, Spinner 等) |
| Sizes | サイズ違いがない |
| States | 非 interactive で hover/focus/active 等の状態がない (Badge / Skeleton / Spinner / Divider / VisuallyHidden) |
| WithIcon | icon prop がない |
| EdgeCases | 視覚的に壊れやすいケースがない (極小コンポーネント) |
| Playground | **絶対省略しない** |

参考実装: [`components/primitives/Button/Button.stories.tsx`](./components/primitives/Button/Button.stories.tsx)

### 5-4. `.guideline.mdx` の規約 — Docs を兼ねるテキスト中心ページ

**`.guideline.mdx` は `<Meta of={Stories} name="Guideline" />` で autodocs の Docs ページを置き換える**。サイドバーから「Docs」ノードが消え、「Guideline」が Docs を兼ねる。

**冒頭の必須テンプレ**:

```mdx
import { Meta, ArgTypes } from '@storybook/addon-docs/blocks';
import * as ComponentStories from './ComponentName.stories';
import { ComponentName } from './ComponentName';
import { DoDontExample } from '@sb-blocks/DoDontExample';
import { GuidelineToc } from '@sb-blocks/GuidelineToc';

<Meta of={ComponentStories} name="Guideline" />

# ComponentName

<GuidelineToc items={[
  { label: '概要', href: '#概要' },
  { label: 'Props', href: '#props' },
  { label: 'Do / Don\'t', href: '#do--dont' },
  { label: 'アクセシビリティ', href: '#アクセシビリティ' },
  { label: '関連', href: '#関連' },
]} />
```

`<GuidelineToc>` は [`.storybook/blocks/GuidelineToc.tsx`](./.storybook/blocks/GuidelineToc.tsx) 実装、H1 直下に必ず置く。anchor 用 id は rehype-slug が自動付与。

**標準セクション** (上から順、5 セクション):

1. **概要** — 1〜2 文で **「何のためのコンポーネントか / いつ使うか / いつ使わないか (代替コンポーネント名)」** を端的に書く。サブセクション禁止
2. **Props** — `<ArgTypes of={ComponentStories.Playground} />` のみ。表の Description は `.tsx` JSDoc から autodocs が自動生成。関連 principles へのリンクを末尾に置く
3. **Do / Don't** — 2 サブセクション:
   - `<DoDontExample>` を **3〜5 ペア配置**。重要な NG パターンも視覚カード化 (「色だけで意味」「横並び 4 個以上」など)
   - `### 別コンポーネントの方が適切な場面` — 「やろうとすること / 使うべき別コンポーネント / 理由」の表で他コンポーネントに誘導
4. **アクセシビリティ** — キーボード操作、ARIA、タッチターゲット、SR への配慮、各種固有 a11y 仕様
5. **関連** — `### 内部で利用するコンポーネント` のみ。Icon / Spinner など子で使う Primitive を列挙

注: `<Primary />` / `<Controls />` / `<Stories />` は本リポでは使わない。各 Story はサイドバーから個別に開く運用。

**Do / Don't カードの規約**:

- **コンポーネント**: `<DoDontExample>` ([`.storybook/blocks/DoDontExample.tsx`](./.storybook/blocks/DoDontExample.tsx))。MDX からは `import { DoDontExample } from '@sb-blocks/DoDontExample'`
- **ペア数**: 3〜5 個。基本ルール + NG パターンの両方を視覚カード化
- **色分け**: 緑=Do (推奨) / 赤=Don't (非推奨) で固定
- **構造**: `label` / `doExample` / `doCaption` / `dontExample` / `dontCaption`
- **必須**: 各 `dontCaption` に **「なぜそうなのか」の理由** を 1 行
- **プレビュー**: 必ず本物のコンポーネントを描画 (スクリーンショット画像禁止、Tokens 変更追従のため)

**書かない** (重複・陳腐化の温床):

- Props 表 → `.tsx` JSDoc から autodocs が自動生成 (5-4 セクション 2 で `<ArgTypes>` で十分)
- 使用例コードブロック (純粋な props 例) → Story と重複。ユースケース内の図解スニペットは可
- 実装詳細 (使用トークン表 / Tailwind クラス一覧)
- バージョン履歴 → `git log` で十分

**principles へのリンクは `?path=` 形式** (§9-2)。

参考実装: [`components/primitives/Button/Button.guideline.mdx`](./components/primitives/Button/Button.guideline.mdx)

### 5-5. 完了条件 (受け入れ基準)

新規・既存問わずコンポーネントを規約準拠と判定するチェックリスト:

- [ ] `.stories.tsx` が標準節 (Playground / Variants / Sizes / States / WithIcon / EdgeCases) を持ち、不要な節は省略しつつ順序が守られている
- [ ] `tags: ['autodocs']` が付いていない (`.guideline.mdx` 側が Docs を兼ねるため)
- [ ] `Playground` で `args` 全開放、Controls 操作で props 単位の挙動が見られる
- [ ] Variants / Sizes / States が静的な一覧として持たれている
- [ ] States 節が必要なら Hover / Focus-visible / Active が `parameters.pseudo` 経由で強制表示される
- [ ] 各 story に `parameters.docs.description.story` で一行説明がある
- [ ] `.guideline.mdx` が `<Meta of={...} name="Guideline" />` で Docs を兼ねる
- [ ] H1 直下に `<GuidelineToc>` を配置し、5 セクションに 1 クリックで飛べる
- [ ] `## Do / Don't` セクションに `<DoDontExample>` が **3〜5 ペア** ある
- [ ] 各 `dontCaption` に「なぜ Don't なのか」の理由が書かれている
- [ ] Do/Don't プレビューが **本物のコンポーネント** で描画されている (画像でない)
- [ ] 色・余白が semantic Tokens (`bg-surface` `text-onSurface` 等) 参照になっている
- [ ] `npx tsc --noEmit` がクリーン
- [ ] §9-3 の壊れリンクチェックが空

---

## 6. 新規コンポーネント追加の進め方

§5 の規約に従って 4 ファイルを揃える。雛形は Button をコピー。

### 6-1. 始め方

1. **配置判断** (§2): Primitive (`components/primitives/`) か Composite (`components/composites/`) か
2. **雛形コピー**: [`components/primitives/Button/`](./components/primitives/Button/) を新コンポーネント名にリネームコピー
3. **実装**: §5-2 規約に従って `.tsx`、§5-3 で `.stories.tsx`、§5-4 で `.guideline.mdx` を埋める
4. **検証**: §5-5 チェックリスト + §10 検証フロー

### 6-2. 新規追加時の依頼プロンプト例

```
このデザインシステムに新しい Composite コンポーネント「XXX」を追加してください。

【参照ファイル】
- components/primitives/Button/Button.{tsx,stories.tsx,guideline.mdx} — 規約のリファレンス実装
- components/composites/Card/Card.tsx — Composite 実装パターン
- AGENTS.md §3 トークン参照ルール / §5 コンポーネント実装規約
- principles/ の関連ドキュメント

【作成するファイル】
- components/{primitives|composites}/XXX/XXX.tsx
- components/{primitives|composites}/XXX/XXX.stories.tsx
- components/{primitives|composites}/XXX/XXX.guideline.mdx
- components/{primitives|composites}/XXX/index.ts
```

---

## 7. 既存コンポーネントの標準ストーリー構造への移行手順

§5 の規約を **既存コンポーネントに後追いで適用** するときの手順。

リファレンスは [`components/primitives/Button/`](./components/primitives/Button/) 一式。迷ったら Button をコピーして当てはめる。

### 7-1. 進める単位

**1 コンポーネント = 1 PR / 1 commit**。Primitives → Composites の順 (依存方向)。1 PR で複数を触ると review/revert の単位が壊れる。破壊的変更 (story id の変更等) は [`CHANGELOG.md`](./CHANGELOG.md) の `[Unreleased]` に都度追記 (§11)。

### 7-2. 監査 (5 分)

下記をざっと読んで **§5 規約とのギャップ** を把握する:

1. `ComponentName.tsx` — props 構造、variant の有無、icon prop の有無、styling パターン (object lookup か tailwind-variants か)
2. `ComponentName.stories.tsx` — 既存 story 数・命名、static render か args 依存か、`tags: ['autodocs']` の有無、`argTypes.description` の有無
3. `ComponentName.md` または `ComponentName.guideline.mdx` (どちらか or 両方存在しうる)

判定:

| 観察 | アクション |
|---|---|
| variant prop あり | Variants 節を作る |
| size prop あり | Sizes 節を作る |
| icon prop あり | WithIcon 節を作る |
| 非 interactive (Badge / Skeleton 系) | States 節を省略可 (理由を冒頭 docstring に明記) |
| iconOnly のようなテキスト省略モード | discriminated union で `aria-label` を型レベル必須化 ([`Button.tsx`](./components/primitives/Button/Button.tsx) の `ButtonIconOnlyProps` パターン) |
| 該当 prop なし | 節をまるごと省略 (順序は維持) |

### 7-3. `.tsx` のリファクタ (必要時のみ)

- **styling が文字列配列 / object lookup で書かれている** → `tailwind-variants` (`tv`) に移行 ([Button.tsx](./components/primitives/Button/Button.tsx) の `buttonVariants` 参照)
- **hover/active overlay を variant ごとに当てたい** → `--color-state-*` semantic token を `shadow-[inset_0_0_0_9999px_var(--color-state-...)]` で重ねる (Material state layer 同等)。下地の variant 色を残したまま半透明オーバーレイ可能
- **discriminated union がある場合** → `props as _InternalType` でキャストせず、discriminant で **render を 2 分岐** する (Button.tsx の `if (props.iconOnly) { ... } else { ... }` パターン)
- **`@see principles/...` は `.mdx` 拡張子で統一** (§9-1)

### 7-4. `.stories.tsx` の書き直し

[`Button.stories.tsx`](./components/primitives/Button/Button.stories.tsx) を雛形にコピー → コンポーネント固有の prop で差し替え。書き方は §5-3 に従う。

**特に確認**:

- `meta.title` から `_` プレフィックス等を除去
- `tags: ['autodocs']` を削除
- `argTypes.description` を削除 (JSDoc が SSoT)
- Playground に `play` で最小限の動作テスト (`click → onClick.toHaveBeenCalled` 等)
- States 節は `parameters.pseudo: { hover: ['#id'], focusVisible: ['#id'], active: ['#id'] }` で擬似状態を強制表示

**EdgeCases に入れる候補**: `fullWidth + 長文 (折返し)` / `fullWidth + 長文 + 内側 span で truncate` / 短文 (min-width 確認) / 多言語 / icon-only モード時の長文 aria-label を視覚カタログに併記。`whitespace-nowrap` 単独などの「単なる崩れ」は入れない。

### 7-5. `.guideline.mdx` の作成 / 書き直し

[`Button.guideline.mdx`](./components/primitives/Button/Button.guideline.mdx) を雛形にコピー → 内容を差し替え。冒頭テンプレと 5 節構成は §5-4 に従う。

旧 `*.md` (legacy guideline) があれば内容を吸収した上で削除 (§7-6)。

### 7-6. 旧 `*.md` の削除

`ComponentName.md` (旧 guideline 形式) が残っていれば `git rm` で削除。`.guideline.mdx` に内容を吸収済みのはず。

### 7-7. 検証

順番に走らせる:

```sh
# 1. 型チェック (新標準で型エラーゼロを保証)
npx tsc --noEmit

# 2. 壊れリンクチェック (§9-3)
grep -rn "principles/[A-Za-z/_-]*\.md\b" components --include="*.tsx"
grep -rn "(\.\./\.\./\.\./principles/" components --include="*.guideline.mdx"

# 3. Storybook 起動
npm run storybook
```

http://localhost:6006 で目視確認:

- [ ] サイドバーから旧「Docs」ノードが消え、「Guideline」が代わりに表示
- [ ] story の順序が Playground → Variants → Sizes → States → WithIcon → EdgeCases (該当節のみ)
- [ ] States story で Hover/Focus/Active が **マウス操作なしで** 強制表示されている
- [ ] Guideline ページの ArgTypes 表に props と JSDoc description が並ぶ
- [ ] DoDontExample (緑/赤バー) が表示
- [ ] a11y addon タブで violation 0

§5-5 の「完了条件チェックリスト」を全項目通ったら PR を切る。

### 7-8. PR / コミットメッセージ

- title: `refactor(<ComponentName>): 標準ストーリー構造へ移行`
- body: 監査結果と判断 (省略した節とその理由 / 新規追加した節) + 破壊的変更があれば §11 に従って CHANGELOG `[Unreleased]` に追記
- 1 PR で複数コンポーネントは触らない

### 7-9. よくある詰まりどころ

| 症状 | 原因と対処 |
|---|---|
| Guideline が Docs として表示されない / 二重に表示される | `.stories.tsx` に `tags: ['autodocs']` が残っている → 削除 |
| ArgTypes 表の Description が空欄 | `.tsx` の Props に JSDoc コメントがない / `argTypes` 側に `description` を書いて JSDoc を上書きしている → JSDoc に一元化 |
| Hover/Focus が pseudo で出ない | `parameters.pseudo` の id と story 内の `<Button id="...">` が不一致 |
| MDX で `<DoDontExample>` が `Cannot resolve module` | `@sb-blocks/*` alias が読まれていない → Storybook を再起動 (`main.ts` 変更後は必須) |
| Props 表の Default 列が消えない | sbdocs の CSS 上書きが効いていない → `.storybook/tailwind.css` の `.docblock-argstable` ルールを確認 |
| `truncate` が効かない (ellipsis 出ない) | flex 子に `min-width: 0` がない → `<ComponentName><span className="min-w-0 truncate">long text</span></ComponentName>` の inner span パターンを使う |

---

## 8. アクセシビリティ前提

- フォーカスリング: `focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-border-focus` を Primitive に標準装備
- 最小タッチターゲット: 44x44px (WCAG 2.5.5 AAA)
- セマンティック HTML: `<button>` / `<a>` / `<label>` を Primitive 内で適切に使用
- aria 属性: 状態を持つコンポーネント (Tabs, Pagination, Switch 等) は aria-* を実装済み
- 詳細は [`principles/Foundation/accessibility/overview.mdx`](./principles/Foundation/accessibility/overview.mdx) 参照

---

## 9. principles リンク規約

`.tsx` / `.guideline.mdx` から [`principles/`](./principles/) (デザイン原則) へ参照を貼る箇所は 2 つあり、それぞれ書き方を固定する。書き方を統一する目的は **grep で全リンクが拾えること** と **principles ファイル名変更時の追従コストを下げること**。

### 9-1. `.tsx` JSDoc `@see` — リポ内パス形式

```ts
/**
 * @see principles/Interaction/button/priority.mdx
 * @see principles/Foundation/accessibility/touch-targets.mdx
 */
```

- 拡張子は **必ず `.mdx`** (実体ファイルがすべて `.mdx` のため、`.md` は壊れリンク)
- リポルートからの **相対パス** で書く (IDE のジャンプは効かないが、grep で追える)
- `@see` で参照したパスは autodocs の Props 表には出ない (`react-docgen-typescript` が `@see` を拾わないため)。読者向けのリンクは下記 `.guideline.mdx` 側で書く

### 9-2. `.guideline.mdx` 関連リンク — `?path=` クエリ形式

Storybook 内でクリック遷移できるリンクは、`?path=/docs/<storyId>--docs` 形式の URL クエリで書く。

```mdx
関連: [Keyboard Navigation](?path=/docs/principles-foundation-accessibility-keyboard-navigation--docs)
```

**`<storyId>` の作り方** (principles 側 `<Meta title="..." />` の値を変換):

1. title を取得: 例 `Principles/Foundation/Accessibility/Keyboard Navigation`
2. すべて **小文字** に
3. `/` と **半角空白** を `-` に置換
4. → `principles-foundation-accessibility-keyboard-navigation`
5. 末尾に `--docs` を付与

**なぜ `?path=` 形式か**:

- `@storybook/addon-links` の `<LinkTo>` でも同じ URL を生成するが、JSX 記法は MDX の中で冗長
- 相対パス (`../../../principles/...mdx`) は Storybook docs iframe で 404 になる
- principles 側で `title` を変えると壊れるが、`<LinkTo>` でも同じく壊れるため共通

### 9-3. 壊れリンクのチェック

PR を出す前に下記コマンドで全 `.md` 参照が残っていないことを確認する:

```sh
# .tsx 内の壊れリンク (実体は .mdx)
grep -rn "principles/[A-Za-z/_-]*\.md\b" components --include="*.tsx"

# .guideline.mdx 内の相対パス形式 (?path= 形式に統一されているべき)
grep -rn "(\.\./\.\./\.\./principles/" components --include="*.guideline.mdx"
```

両コマンドの出力が空であること。

---

## 10. 検証フローと変更時に守ること

コンポーネント / トークン変更時の標準フロー:

1. design-system 本体を編集
2. `npm run storybook` で http://localhost:6006 起動、該当コンポーネントを目視確認
3. 必要なら `npm run build` で型エラーをチェック
4. 本リポを依存として使う product 側のビルドが壊れないか確認 (本リポを `npm link` または公開済みパッケージ経由で参照)

検証用のリアルアプリは別リポジトリで管理 (例: [`rail-demo`](https://github.com/kawachiryuya/rail-demo))。本リポは common (npm 化単位) のみを扱う。

**変更時に守ること**:

- semantic 色を追加したら `tokens/build/variables.css` が自動生成されることを `npm run tokens:build` で確認
- 依存している product 側のビルドが壊れないか、本リポを `npm link` または公開バージョン経由で確認
- 戦略レベルの変更 (Parts/Blocks 分類の変更、新カテゴリ追加等) は [`design-system-strategy.md`](./design-system-strategy.md) も同 PR で更新
- 破壊的変更を伴うときは §11 に従って [`CHANGELOG.md`](./CHANGELOG.md) `[Unreleased]` に追記

---

## 11. Semver 規約

本リポは [Semantic Versioning](https://semver.org/lang/ja/) に従い、変更は必ず [`CHANGELOG.md`](./CHANGELOG.md) に記録する。下流 product に **silent break (型では catch されない壊れ方)** を起こさないため、Tailwind class / Storybook URL / token CSS 変数の rename・削除も BREAKING として扱う。

### 11-1. MAJOR / MINOR / PATCH の判定基準

| 種別 | 例 |
|---|---|
| **MAJOR** (破壊的変更) | コンポーネント Props の型変更・rename・削除 / 既存 variant・size・color 値の削除 / semantic token の rename・削除 / Tailwind ユーティリティ class の rename・削除 (silent break) / コンポーネントの path 移動 (`primitives/` ↔ `composites/`) / Storybook story id の rename (URL リンク壊れ、silent break) / primary token の色相変更 (visual break、silent) |
| **MINOR** (後方互換ある追加) | 新コンポーネント追加 / 既存コンポーネントに optional prop / 新 variant・size・color の追加 / 新 semantic token / 新 Tailwind ユーティリティ |
| **PATCH** (修正・互換維持) | バグ修正 / a11y 修正で見た目同等 / 内部実装の refactor / Storybook story の追加・節内補強 (story id は維持) / docs/guideline 修正 |

### 11-2. silent break 警告

下記は **型で catch されない** ため、利用箇所を grep で機械的に洗い出せない:

- Tailwind utility class (`text-onSurface-xxx` 等) — 文字列扱いのため TS は通る
- CSS 変数 (`var(--color-xxx)`) — CSS 内・style 属性
- Storybook URL (`?path=/story/...--xxx`) — 外部ドキュメント・Slack 等に貼られる
- visual change (色相・余白の微調整) — テストではほぼ拾えない

これらに該当する変更は、コミット時点で [`CHANGELOG.md`](./CHANGELOG.md) の **⚠ BREAKING CHANGES** に明記し、可能なら Migration notes に **置換用 sed コマンド or codemod 例** を添える。

### 11-3. CHANGELOG 更新手順

1. PR 単位で `[Unreleased]` セクションに追記 (`Added` / `Changed` / `Removed` / `Fixed` / `⚠ BREAKING CHANGES` のいずれかに振り分け)
2. リリース時に `[Unreleased]` を `[x.y.z] - YYYY-MM-DD` に確定、`package.json` の `version` も同期
3. 末尾のリンク参照を更新

### 11-4. 0.x 期の運用

`0.x` の間は破壊的変更を MINOR (0.y bump) に含めて差し支えないが、CHANGELOG の **⚠ BREAKING CHANGES** には必ず明記する。1.0.0 以降は厳密に MAJOR bump とする。
