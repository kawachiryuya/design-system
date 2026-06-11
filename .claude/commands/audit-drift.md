---
description: AGENTS.md の規約と実コードの乖離を検査し「コード修正 or 規約改訂」の判断リストを出す
argument-hint: "(任意) 対象コンポーネント名"
---

# Audit Drift — 規約と実装の乖離検査

`/audit-drift [ComponentName]` で呼び出す。引数なしなら全コンポーネント、指定があればそのコンポーネントのみ。

**前提**: `git rev-parse --show-toplevel` でリポジトリルートを特定し、以降のパスはすべてルート相対で扱う。design-system リポジトリでなければ (package.json の `name` が `@kawachiryuya/design-system` でなければ) 中断してユーザーに確認する。

**目的**: AGENTS.md の規約と `components/` 実装のズレを洗い出し、各ズレを **「コードを直す」か「規約を現実に合わせ改訂する」か** の判断リストにする。**適用はしない (レポートのみ)**。「規約と実装が乖離したまま放置が一番悪い」(§5-2 forwardRef の教訓) を前提に、必ずどちらかへ倒す判断を促す。

---

> **機械化済みは CI に委譲**: 適合性の機械検査 (forwardRef の有無 / Props の JSDoc / 4 ファイル構成 / barrel 同期 / 標準ストーリー構造) は CI の **`check:conventions`** ([`scripts/check-conventions.mjs`](../../scripts/check-conventions.mjs)、§5-5-1) が常時ゲートする。semantic token (生 hex / 色 bracket) は lint が弾く。本コマンドはこれらを再検査せず、**機械化できない判断項目のみ**に注力する。

## 検査項目 (判断が要るもの)

1. **composite の forwardRef 要否 (§5-2)**: ref を当てる対象要素が明確 (例: 単一の input / dialog を露出) なのに `forwardRef` 未対応の composite を列挙。「対象が明確か」は判断なので機械化しない
2. **forwardRef allowlist の見直し (§5-2)**: `check:conventions` の `FORWARDREF_ALLOWLIST` (Stack / Cluster / Center / Divider / Image / Skeleton) を forwardRef 化すべきか (polymorphic / wrapper の debt)。Image など ref 需要が高いものから検討
3. **a11y 例外 TODO の放置 (§8-4)**: [`test-runner.ts`](../../.storybook/test-runner.ts) の `COLOR_CONTRAST_EXEMPT` に `TODO(contrast)` が残っていないか (放置 finding の検出)
4. **規約改訂の要否 (§11)**: 上記で「コードを直す」より「規約を現実に合わせ改訂する」が妥当なものを抽出

## 進め方

- `grep` / ファイル走査で機械的に候補を集める (例: composite の `useRef` / `<input>` 露出箇所)
- `check:conventions` が緑であることを前提に、**CI で拾えない構造・規約の乖離** にのみ注力する

## 出力フォーマット

| 箇所 (file:line) | 規約 (§) | 現状 | 推奨 | 理由 |
|---|---|---|---|---|
| ... | §5-2 | forwardRef 未使用 | コード修正 / 規約改訂 | ... |

最後に「規約改訂を推奨する項目」をまとめ、AGENTS.md のどの § をどう直すかの提案を添える (§11 規約更新の運用に沿う)。
