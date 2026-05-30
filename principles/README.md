# Design Principles

コンポーネント実装時に AI / 人間が参照する、ドメイン非依存の汎用デザイン原則。

戦略上の位置付けは [`../design-system-strategy.md`](../design-system-strategy.md) を、運用規約 (トークン参照ルール・新規追加時の手順等) は [`../AGENTS.md`](../AGENTS.md) を参照。

## 一覧

| カテゴリ | ドキュメント | 概要 |
|---|---|---|
| **Foundation** | [accessibility.mdx](./Foundation/accessibility.mdx) | アクセシビリティ全般 (WCAG 準拠の前提) |
| | [hierarchy.mdx](./Foundation/hierarchy.mdx) | 視覚的ヒエラルキー |
| | [responsiveness.mdx](./Foundation/responsiveness.mdx) | モバイルファースト・ブレイクポイント |
| **Color** | [semantic-colors.mdx](./Color/semantic-colors.mdx) | セマンティックカラー (WHERE × WHAT) |
| **Typography** | [scale.mdx](./Typography/scale.mdx) | フォントサイズ・ウェイト・行間 |
| **Layout** | [grid.mdx](./Layout/grid.mdx) | グリッドとブレイクポイント |
| **Interaction** | [button.mdx](./Interaction/button.mdx) | ボタン優先度と配置 |
| | [state.mdx](./Interaction/state.mdx) | hover / focus / active / loading / error |
| **Patterns** | [forms.mdx](./Patterns/forms.mdx) | フォーム設計 |

## 編集方針

- 「コンポーネント実装時に参照する原則かどうか」を残す/削る判断基準とする
- 細分化された解説系 (Platform 個別最適化、Motion 等) は必要になった時点で追加する
- 個別カテゴリの overview は本 README に集約する
