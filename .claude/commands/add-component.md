---
description: AGENTS.md §5 準拠で新規コンポーネントの 4 ファイルを scaffold→実装→検証する
argument-hint: "<ComponentName> <primitive|composite>"
---

# Add Component — §5 準拠の新規コンポーネント追加

`/add-component <ComponentName> <primitive|composite>` で呼び出す。`$1` = コンポーネント名、`$2` = 層。

**前提**: cwd が `~/Develop/design-system`。AGENTS.md §5 / §5-5 / §3 に厳密準拠すること。

---

## 手順

1. **配置判断 (§2)**: `$2` が `primitive` なら `components/primitives/$1/`、`composite` なら `components/composites/$1/`。判断が曖昧なら §2 の「構造 / 状態」2 軸で再確認する。

2. **4 ファイルを作成** (Button をひな形にコピーして埋める):
   - **`$1.tsx`**: `interface $1Props extends React.〜HTMLAttributes<...>` で native 属性継承 / **各 Props に JSDoc 必須** (`@default` 含む、Props 表に出る) / 本体に `@example` 2〜3 / **forwardRef は ref 対象要素が明確な場合のみ** (primitive は必須) / styling は `tailwind-variants` + **semantic token のみ** (生 hex・色 bracket 禁止 = §3 / lint で弾かれる)
   - **`$1.stories.tsx`**: `title: '<Primitives|Composites>/$1'` / 標準節を固定順序で (Playground は `args` 全開放 + **play test**、必要に応じ Variants / Sizes / States / EdgeCases) / **`tags: ['autodocs']` は付けない** (guideline が Docs を兼ねる)
   - **`$1.guideline.mdx`**: `<Meta of={...} name="Guideline" />` + H1 直下に `<GuidelineToc>` + `## Do / Don't` に `<DoDontExample>` **3〜5 ペア** (各 `dontCaption` に理由、本物のコンポーネント描画) + アクセシビリティ + 関連
   - **`index.ts`**: `export { $1 } from './$1'; export type { $1Props } from './$1';`

3. **barrel に追加**: `components/index.ts` の該当層ブロックに `export * from './<layer>/$1';` をアルファベット順で追記し、`// ── Composites (N) ──` 等の件数コメントを更新。

4. **CHANGELOG**: `[Unreleased]` の `Added` に新コンポーネントを追記 (§10-1: 新規コンポーネント = **MINOR**)。

5. **検証 (機械 / §5-5-1)**: 以下をすべて pass させる:
   ```bash
   npm run tokens:build && npm run typecheck && npm run lint && npm run check:links && npm run build-storybook
   ```
   可能なら `npm run test-storybook` (別端末で storybook-static を serve) で play + axe も確認。

---

## 完了条件

- §5-5-1 (機械) がローカルで全 pass
- §5-5-2 (人間判断) を自己レビュー: API 設計の粒度・命名、Do/Don't の内容妥当性、配置判断の妥当性
