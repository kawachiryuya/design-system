# Design Principles

コンポーネント実装時に AI / 人間が参照する、ドメイン非依存の汎用デザイン原則。

戦略上の位置付けは [`../design-system-strategy.md`](../design-system-strategy.md) を、運用規約 (トークン参照ルール・新規追加時の手順等) は [`../AGENTS.md`](../AGENTS.md) を参照。

## 一覧

| カテゴリ | ドキュメント | 概要 |
|---|---|---|
| **Foundation** | [accessibility.md](./Foundation/accessibility.md) | アクセシビリティ全般 (WCAG 準拠の前提) |
| | [hierarchy.md](./Foundation/hierarchy.md) | 視覚的ヒエラルキー |
| | [responsiveness.md](./Foundation/responsiveness.md) | モバイルファースト・ブレイクポイント |
| **Color** | [semantic-colors.md](./Color/semantic-colors.md) | セマンティックカラー (WHERE × WHAT) |
| **Typography** | [scale.md](./Typography/scale.md) | フォントサイズ・ウェイト・行間 |
| **Layout** | [grid.md](./Layout/grid.md) | グリッドとブレイクポイント |
| **Interaction** | [button.md](./Interaction/button.md) | ボタン優先度と配置 |
| | [state.md](./Interaction/state.md) | hover / focus / active / loading / error |
| **Patterns** | [forms.md](./Patterns/forms.md) | フォーム設計 |

## 編集方針

- 「コンポーネント実装時に参照する原則かどうか」を残す/削る判断基準とする
- 細分化された解説系 (Platform 個別最適化、Motion 等) は必要になった時点で追加する
- 個別カテゴリの overview は本 README に集約する
