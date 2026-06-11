---
description: AGENTS.md の規約と実コードの乖離を検査し「コード修正 or 規約改訂」の判断リストを出す
argument-hint: "(任意) 対象コンポーネント名"
---

# Audit Drift — 規約と実装の乖離検査

`/audit-drift [ComponentName]` で呼び出す。引数なしなら全コンポーネント、指定があればそのコンポーネントのみ。

**目的**: AGENTS.md の規約と `components/` 実装のズレを洗い出し、各ズレを **「コードを直す」か「規約を現実に合わせ改訂する」か** の判断リストにする。**適用はしない (レポートのみ)**。「規約と実装が乖離したまま放置が一番悪い」(§5-2 forwardRef の教訓) を前提に、必ずどちらかへ倒す判断を促す。

---

## 検査項目

1. **forwardRef (§5-2)**: 規約は「primitive 必須 / composite は ref 対象が明確な場合のみ」。primitive で `forwardRef` 未使用のもの、composite で対象が明確なのに未対応のものを列挙
2. **JSDoc 必須 (§5-2)**: Props interface の各メンバに JSDoc / `@default` が欠けているもの (Props 表が空欄になる)
3. **標準ストーリー構造 (§5-3)**: `title` 命名規則、節の固定順序、`tags: ['autodocs']` の誤付与
4. **semantic token (§3)**: 生 hex / 色 bracket の混入 (lint と重複するが、lint 対象外パスや stories も含め確認)
5. **4 ファイル構成 (§5-1)**: `.tsx` / `.stories.tsx` / `.guideline.mdx` / `index.ts` の欠落
6. **barrel export**: `components/index.ts` に未 export のコンポーネント / 件数コメントのズレ
7. **a11y 例外 (§8-4)**: `test-runner.ts` の `COLOR_CONTRAST_EXEMPT` に `TODO(contrast)` が残っていないか (放置 finding の検出)

## 進め方

- `grep` / ファイル走査で機械的に候補を集める (例: `grep -rL "forwardRef" components/primitives/*/*.tsx`)
- CI で機械化済みの項目 (§5-5-1) は CI に委ね、ここでは **CI で拾えない構造・規約の乖離** に注力する

## 出力フォーマット

| 箇所 (file:line) | 規約 (§) | 現状 | 推奨 | 理由 |
|---|---|---|---|---|
| ... | §5-2 | forwardRef 未使用 | コード修正 / 規約改訂 | ... |

最後に「規約改訂を推奨する項目」をまとめ、AGENTS.md のどの § をどう直すかの提案を添える (§11 規約更新の運用に沿う)。
