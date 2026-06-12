# Layout patterns inventory (2026-06)

design-system に layout primitive / composite を追加するにあたり、consumer プロダクトで実装されていた画面レイアウトを inventory し、**5 つのパターン**に集約した記録。Phase A (primitives) + Phase B (composites) を経て、現在は全パターンが DS の primitive / composite として実装済み。

- **準拠する規約**: [AGENTS.md §3 トークン参照ルール](../AGENTS.md) / [layout token (`tokens/source/layout.json`)](../tokens/source/layout.json) (Container / Section / Grid utility が既に存在)

---

## 5 パターンと実装の対応

| # | Pattern | 典型用途 | 実装 | release |
|---|---------|----------|------|---------|
| 1 | **AppShell** | header / sidebar / bottom-nav / main の骨格 (全画面共通) | [`components/composites/AppShell/`](../components/composites/AppShell/) | 0.11.0 |
| 2 | **CenteredContent** | 単列コンテンツの水平センタリング (form / reading / detail / marketing) | [`components/primitives/Center/`](../components/primitives/Center/) (`max="form/reading/wide/marketing"`) | 0.6.0 |
| 3 | **TwoColumn** | main + sidebar の 2 列 (mobile 縦積み → PC 横並び grid) | [`components/composites/TwoColumn/`](../components/composites/TwoColumn/) (`split="6/6"/"7/3"/"8/4"` + `mobileReverse`) | 0.12.0 |
| 4 | **CenteredOnGrid** | grid 上で中央 col を左右余白で挟む (sibling page と整列) | TwoColumn の degenerate case として吸収候補 (現状は scope 外) | - |
| 5 | **SplitPane** | master-detail (固定幅 list + 流動 detail、両 pane 独立スクロール) | [`components/composites/SplitPane/`](../components/composites/SplitPane/) (`listWidth` + `divider` + `height`) | 0.13.0 |

補助 primitive / patch:

| primitive | release | 役割 |
|-----------|---------|------|
| `Stack` | 0.7.0 | 垂直方向 flex + gap (`gap` 6 段、`as` 8 種) |
| `Cluster` | 0.9.0 | 水平方向 flex-wrap + gap (`gap` 6 段、`align`/`justify` 制御) |
| Stack/Center rest props | 0.8.0 | `React.HTMLAttributes<HTMLElement>` 継承で `onSubmit` / `aria-*` / `data-*` pass-through |
| Cluster/Stack `'span'` | 0.10.0 | inline 文脈で semantic な `<span>` 使用可能化 |

---

## inventory から得た設計方針

1. **DS layout utility への集約**: `px-container` / `max-w-container` / `grid-base` 等が [`tokens/source/layout.json`](../tokens/source/layout.json) に定義済み。手書き layout は primitive / composite に置換することで padding / max-width / gap の揺れを解消できる。
2. **max-width は 4〜5 段に集約**: 用途別に散らばっていた `max-w-*` を Center の `max` prop (form / reading / wide / marketing) に統一。
3. **gap は 3 段** (`gap-4 md:gap-6 xl:gap-8`) が layout token `layout.grid.gutter` とほぼ一致。
4. **breakpoint は `lg:` 主軸**: layout の主切替は `lg:` に統一されているため primitive 側も `lg:` をハードコードしてよい (multi-product でも同 breakpoint 想定)。
5. **slot 形式 (positional children)**: 全 composite で採用。consumer の typing 量が増えず導入しやすい。
6. **router / state context は DS スコープ外**: AppShell は slot を提供するだけで、page-level の title / breadcrumb 等の context は consumer 側が持つ。フレームワーク差 (Next.js / Remix / React Router) を吸収不要。

---

## 今後 (本 inventory の範囲外)

- **CenteredOnGrid 再評価**: 別 product で同 pattern が繰り返し現れた場合、TwoColumn の degenerate case として吸収するか専用 composite を作るか再検討。
- **AppShell の footer slot**: 将来 footer を slot として AppShell に追加するか、consumer 側に委ねるか判断。
