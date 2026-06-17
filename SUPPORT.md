# SUPPORT — 安定性ポリシー

`@kawachiryuya/design-system` を**長寿命インフラ**として採用する利用者への安定性のコミット。
実装規約の SSoT は [`AGENTS.md §10 Semver 規約`](./AGENTS.md#10-semver-規約)。本書はその利用者向け要約。

---

## 1. 非推奨ライフサイクル

API・トークン・配信面は次の状態を持つ:

| 状態 | 意味 |
|---|---|
| `experimental` | 予告なく変更されうる (opt-in 認識で使う)。semver 保護の対象外 |
| `stable` | 完全に semver 保護。**予告なく消さない** |
| `deprecated` | まだ動くが代替がある。移行を促す信号が出る |
| `removed` | **MAJOR でのみ**削除される |

## 2. 非推奨の窓 (削除までの猶予)

- 非推奨は、**公開されてから 3 ヶ月以上経過した最初の MAJOR** で削除する。
  - 「削除は MAJOR のみ」と「3 ヶ月以上の暦の予告」を両立する (次の MAJOR が早すぎる場合は、時間床を満たす次の MAJOR まで待つ)。
- 窓は**リリースサイクル数でなく暦時間**で測る (MAJOR が速く出るほどサイクル基準だと暦の窓が縮み、目的と逆になるため)。
- **M = 3 ヶ月**: 「気づく → 自分のリリースサイクルに組み込む → 走らせる」の計画レイテンシ。保守的・大規模採用者は **6 ヶ月**を目安にしてよい。
- 非推奨は人が必ず気づく形で出す: **dev 限定 `console.warn`** + **`@deprecated` JSDoc** + **CHANGELOG**。
- **非推奨ごとに codemod / 移行手順を必ず添える** (短い窓を正当化しているのはこれ。codemod が無いものは窓を伸ばす)。

## 3. 3 つの versioned 契約

DS は次の 3 つを独立した互換面として持ち、**どれか一つでも壊れたら package は MAJOR**:

- **(a) コンポーネント / props API** — props の型・名前、variant/size/color 値、コンポーネントの配置 path。
- **(b) テーマトークン契約** — themeable な semantic トークンの集合 ([`tokens/theme-contract.json`](./tokens/theme-contract.json))。**必須層**トークンの追加・rename・削除は全テーマ作者への破壊 = MAJOR、**任意層**の追加は既定継承で後方互換 = MINOR。
- **(c) CSS + DOM 配信契約** — 出荷 CSS クラス名 (`dist/styles.css`)、`data-*` 属性、DOM 構造、CSS 変数名。

いずれも型では catch されない silent break を含む (AGENTS §10-2)。CHANGELOG の ⚠ BREAKING CHANGES に明記し、可能なら codemod / sed を添える。

## 4. React サポート窓

- **最新 2 メジャーを支える** (現状 `^18 || ^19`)。新メジャーは前倒しで拡張する。
- **支持メジャーを落とすのは DS の MAJOR**。バージョンを pin しない。
- 範囲を安く保つため、コンポーネント実装は**支持メジャー間の最小公倍数的 API** に留める (新メジャー限定 API を不要に使わない)。

---

詳細・判定基準は [`AGENTS.md §10`](./AGENTS.md#10-semver-規約) を参照。
