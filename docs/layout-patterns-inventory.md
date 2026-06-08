# Layout patterns inventory (2026-06)

design-system に追加すべき **layout primitive / composite** の API 設計のため、consumer 1 号機 (rail-demo) で実装されている画面レイアウトを inventory し 5 パターンに集約した。次の段階で各パターンを DS に primitive / composite として実装 → rail-demo で dogfood ループ。

- **Source**: rail-demo `main` branch (2026-06-08 時点、design-system 0.5.1 追従済)
- **対象画面**: 19 page + 1 shell layout
- **準拠する規約**: [AGENTS.md §3-4](../AGENTS.md#3-4-spacing-層) / [layout token (`tokens/source/layout.json`)](../tokens/source/layout.json) (Container / Section / Grid utility が既に存在)
- **関連**: [`principles/_ARCHIVE_NOTE.md`](../principles/_ARCHIVE_NOTE.md) (principles 凍結) / [rail-demo の利用箇所](https://github.com/kawachiryuya/rail-demo)

## 5 パターン (集約版)

| # | Pattern | 該当画面 | DS primitive / composite 候補 |
|---|---------|----------|------------------------------|
| 1 | **AppShell** | `Layout.tsx` (全画面共通) | `composites/AppShell` (Header / TopHeader / BottomNav / main の slot) |
| 2 | **CenteredContent** | Login / Signup / ResetPassword / ICRegister / ArticleDetail / FAQ / Help / Landing | `primitives/Center` (max-width prop 受け、内部で `mx-auto`) |
| 3 | **TwoColumn** | Results (7/3) / SeatPage (8/4) / SeatMapPage (8/4) / SearchPage (6/6) | `composites/TwoColumn` (`split` prop で比率指定、`order` で SP 入れ替え) |
| 4 | **CenteredOnGrid** | ConfirmPage / CompletePage | `composites/TwoColumn` の degenerate case (左右余白 col で挟む) として吸収候補 |
| 5 | **SplitPane** | ReservationsLayout (`360px_1fr`) | `composites/SplitPane` (左固定幅、両 pane 独立スクロール) |

> **注**: 以下は独立パターンとして数えていない:
> - **ReservationsPage / ReservationDetailPage**: SplitPane の slot 内 (= ReservationsLayout の `<Outlet />` 配下) で、それぞれ単純な card stacking
> - **ArticlesPage / TokensPage**: CenteredContent (marketing) + 内側 card grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) — CenteredContent でカバー、card grid は別軸
> - **MyPage**: container 一切無し、`lg:py-4` のみ。AppShell の `max-w-[1280px]` をそのまま継承 (= bare slot)。意図的な「container 無し」用途として **`Bare` (= AppShell main slot 直貼り)** という非パターンを別途認識する

---

## 1. AppShell

**実装箇所**: [`src/layouts/Layout.tsx`](https://github.com/kawachiryuya/rail-demo/blob/main/src/layouts/Layout.tsx)

```tsx
<div className="min-h-screen flex flex-col lg:flex-row bg-background">
  <Header />        {/* mobile-only (内部で lg:hidden) */}
  <TopHeader />     {/* PC-only (内部で hidden lg:block, w-56 fixed) */}
  <div className="flex-1 min-w-0 flex flex-col">    {/* right pane */}
    {!hideSubBar && <PageSubBar title breadcrumb step />}
    <main className="flex-1 flex flex-col">
      <div className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 + 条件付き pb-20 lg:pb-6">
        <Outlet />
      </div>
    </main>
  </div>
  <BottomNav />     {/* mobile-only (内部で lg:hidden fixed bottom-0) */}
</div>
```

- **mobile**: Header (top sticky) + PageSubBar (オプション) + main + BottomNav (bottom fixed)
- **PC (`lg:`)**: TopHeader (left sidebar, w-56 = 224px) + 右 pane (PageSubBar + main)
- 外側 padding は手書きの 5 段階 (`px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16`) — **DS の `px-container` utility (現存) と乖離**
- BottomNav 表示時は main bottom に `pb-20` (= h-16 のクリアランス) を加える条件分岐あり
- `PageTitleProvider` で各 route ([page] level の meta: title / breadcrumb / step / showBottomNav / hideSubBar) を共有 → consumer 側の router-level context (DS スコープ外)

### DS 化候補

```tsx
<AppShell
  header={<Header />}                // mobile-only
  sidebar={<TopHeader />}            // PC-only
  bottomNav={<BottomNav />}          // mobile-only
  subBar={<PageSubBar ... />}        // 任意 (consumer の page-level context から流す)
  showBottomNav={true}               // mobile main の pb-20 クリアランスを連動
>
  <Outlet />  {/* または children */}
</AppShell>
```

- 内部で `px-container` / `max-w-container` / `py-section-md` を利用 → padding 揺れを消す
- `lg` breakpoint を internal hardcode (現状の rail-demo と同じ)、外部から override 不可で OK (multi-product でも同じ breakpoint 想定)
- Header / TopHeader / BottomNav / PageSubBar 自体は consumer 側で実装 (ブランド/メニュー構造が product 固有のため)
- PageTitleProvider のような context は **consumer 側で持つ** (DS は slot を提供するだけ、router 依存を持ち込まない)

### 優先度: **高** (rail-demo の全画面に影響、padding 揺れの解消効果が最大)

---

## 2. CenteredContent

**実装箇所**: 10 ページ。max-width が用途別に 4 段階で揺れている。

| max-width | 用途 | 該当ページ |
|-----------|------|------------|
| `max-w-md` (448px) | form / onboarding | Login / Signup / ResetPassword / ICRegister |
| `max-w-3xl` (768px) | reading / detail | ArticleDetail / FAQ |
| `max-w-4xl` (896px) | grid container | Help (内側で `md:grid-cols-2`) |
| `max-w-5xl` (1024px) | marketing / card grid | LandingPage (section 単位) / Articles (内側 `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) / Tokens |

全て `mx-auto py-{6|8|12}` + 手書き。

> **別軸の発見**: [`Footer.tsx`](https://github.com/kawachiryuya/rail-demo/blob/main/src/layouts/Footer.tsx) は `w-full md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1280px]` の **breakpoint 進行型 max-width** を使用。page-level の固定 max-w (md/3xl/4xl/5xl) とは別パターンで、AppShell に近い「viewport に応じて広がる」挙動。Center primitive で `max="responsive"` のような第 2 軸が必要か検討余地。

### DS 化候補

```tsx
<Center max="narrow">   {/* = max-w-md / 448px */}
<Center max="default">  {/* = max-w-3xl / 768px */}
<Center max="wide">     {/* = max-w-4xl / 896px */}
<Center max="marketing"> {/* = max-w-5xl / 1024px */}
```

- [`tokens/source/layout.json`](../tokens/source/layout.json) の `container.max-width.{narrow,default,wide,full}` を流用 (既存 4 段階あり、用途名を rail-demo の実態に揃える)
- vertical padding は `py-section-md` (semantic token、既存) を default にし `py` prop で override 可能

### 優先度: **高** (用途揺れが多く、token に既に max-width スケールがあるので即実装可能)

---

## 3. TwoColumn

**実装箇所**: 4 ページ、3 種類の比率。

| Page | grid base | 比率 (PC) | 備考 |
|------|-----------|-----------|------|
| ResultsPage | `grid-cols-10` | 7/3 (`col-span-7` / `col-span-3`) | 列車 list + 検索条件 sidebar |
| SeatPage | `grid-cols-12` | 8/4 (`col-span-8` / `col-span-4`) | 座席クラス + 料金 sidebar |
| SeatMapPage | `grid-cols-12` | 8/4 | 座席 grid + 選択中座席 sidebar |
| SearchPage | `grid-cols-12` | 6/6 (`order-2 lg:order-1`) | フォーム + 検索結果プレビュー (SP は逆順) |

全て `gap-4 md:gap-6 xl:gap-8` + outer `lg:py-4` (mobile では padding なし)。

### DS 化候補

```tsx
<TwoColumn split="8/4" gap="md" sidebarOrder="last" mobileReverse={false}>
  <TwoColumn.Main>{...}</TwoColumn.Main>
  <TwoColumn.Sidebar>{...}</TwoColumn.Sidebar>
</TwoColumn>
```

- `split` prop: `'7/3' | '8/4' | '6/6' | '9/3'` 等の enum (rail-demo の 3 種 + 余白で +1 想定)
- `gap`: layout token `layout.grid.gutter` に紐づける (`sm` = 16/16/24、既存 token)
- `mobileReverse`: SearchPage の `order-2 lg:order-1` を抽象化 (boolean)
- 内部 `grid` は CSS variable で base columns を 10 / 12 から内部解決

### 優先度: **高** (4 画面 + 今後の中規模画面で必須、`split` の enum が固まれば既存 grid を一気に置換可能)

---

## 4. CenteredOnGrid

**実装箇所**: ConfirmPage / CompletePage

```tsx
<div className="lg:py-4">
  <div className="grid grid-cols-12 gap-4 md:gap-6 xl:gap-8">
    <div className="col-span-12 lg:col-span-8 lg:col-start-3">
      {/* 単列コンテンツ */}
    </div>
  </div>
</div>
```

- PC で 12-grid 上の 8 col を中央に置く (= 左右に 2 col の余白)
- TwoColumn と同じ grid base / gap を使うため、**sibling page (Results / Seat 等) と PC 上で視覚的に整列**する
- 単純な `<Center max="wide">` だと grid system の外に出るため整列が崩れる → 専用パターン

### DS 化候補

**Option A: TwoColumn の degenerate case として吸収**
```tsx
<TwoColumn split="0/8/0">  {/* = 左右 2col 空白 + 中央 8col */}
  <TwoColumn.Main>{...}</TwoColumn.Main>
</TwoColumn>
```

**Option B: CenteredOnGrid 専用 component を作る**
```tsx
<CenteredOnGrid span="8" gridCols="12">{...}</CenteredOnGrid>
```

→ **A 推奨** (component 種類を増やさず TwoColumn の同じ API 内で表現できる、grid alignment 担保も自動)

### 優先度: **中** (2 画面のみ、TwoColumn の API 設計次第で自然に吸収できる)

---

## 5. SplitPane

**実装箇所**: [`src/pages/ReservationsLayout.tsx`](https://github.com/kawachiryuya/rail-demo/blob/main/src/pages/ReservationsLayout.tsx)

```tsx
<div className="lg:grid lg:grid-cols-[360px_1fr] lg:divide-x lg:divide-border-subtle lg:h-[calc(100vh-3rem)]">
  <div className="hidden lg:block lg:pr-8 lg:overflow-y-auto">{list}</div>
  <div className="lg:pl-8 lg:overflow-y-auto">{detail}</div>
</div>
```

- 左 = 固定幅 360px の list、右 = 流動的な detail
- **両 pane 独立スクロール** (`overflow-y-auto`)
- 高さ = `100vh - 3rem` (Layout.tsx の `py-6` 分)
- mobile では list / detail を別 route として表示 (split しない)

### DS 化候補

```tsx
<SplitPane
  leftWidth="360px"
  divider
  height="calc(100vh - var(--app-shell-padding-y))"  {/* AppShell と連動 */}
>
  <SplitPane.List>{...}</SplitPane.List>
  <SplitPane.Detail>{...}</SplitPane.Detail>
</SplitPane>
```

- `leftWidth`: 既定 `'320px' | '360px' | '400px'` の enum + `string` 自由値
- `height`: AppShell の padding と連動するため CSS variable 経由が望ましい
- mobile での切り替えは consumer 側で router-level に判断 (DS は split layout のみ提供)

### 優先度: **中** (1 画面のみだが、master-detail UI の典型なので将来の予約管理・通知センター等で再利用見込み)

---

## 全体傾向

1. **DS layout utility 利用率: 実質 0%** — `px-container` / `max-w-container` / `grid-base` 等が既に [`tokens/source/layout.json`](../tokens/source/layout.json) に定義されているのに rail-demo は全て手書き。primitive 化で機械的に置換可能。
2. **padding scale の揺れ**: AppShell は `px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16` の 5 段、page-level は `lg:py-4` のみ。token の 3 段階 (mobile/tablet/desktop) との不整合を吸収する API が必要。
3. **max-width の不統一**: `max-w-md` / `max-w-3xl` / `max-w-4xl` / `max-w-5xl` / `max-w-[1280px]` が混在。Center primitive で 4-5 段に集約。
4. **breakpoint は `lg:` 主軸** — `md:` は HelpPage の `md:grid-cols-2`、SearchPage の `md:gap-6` 等に限定。layout の主切替は `lg:` で統一されているので primitive 側も `lg:` ハードコードで OK。
5. **gap は `gap-4 md:gap-6 xl:gap-8` の 3 段** — layout token `layout.grid.gutter` (16/16/24) とほぼ一致。
6. **mobile の order 入れ替え**: SearchPage の `order-2 lg:order-1` のみ。TwoColumn の `mobileReverse` boolean prop で吸収可。

---

## 次のステップ

### Phase A: primitives 追加 ([components/primitives/](../components/primitives/))
1. `Stack` (vertical spacing) — まず最小限。`gap` prop は `layout.section.gap` token 利用。
2. `Cluster` (horizontal + wrap) — Header の menu / FilterChip 列等。
3. `Center` (#2 CenteredContent の実装) — `max` prop で 4 段。

### Phase B: composites 追加 ([components/composites/](../components/composites/))
4. `AppShell` (#1) — rail-demo の Layout.tsx の置換ターゲット。padding は `px-container` 直接利用。
5. `TwoColumn` (#3 + #4 を吸収) — `split` enum + `mobileReverse` + `gap` prop。
6. `SplitPane` (#5) — Phase A/B が安定したら最後に。

### Phase C: rail-demo dogfood
- Phase B の各 composite を rail-demo で順次置換 → PR → 違和感 / 不足 API を DS にフィードバック → 修正 → re-release
- 優先順位: AppShell → TwoColumn → CenteredContent → SplitPane (影響範囲の広い順)

### 検証ループ
- 各 primitive / composite の Storybook story を **AGENTS.md §3-6** 準拠の標準節 (Playground / Variants / States / EdgeCases) で書く
- rail-demo PR で **before/after の Playwright screenshot 比較**を行う (現状は post-only 検証だが、Chromatic 導入後は自動化、[`MEMORY.md`](../../../.claude/projects/-Users-kawachi-Develop-design-system/memory/MEMORY.md) `[Future: Chromatic for DS]` 参照)
- [`AGENTS.md §11`](../AGENTS.md#11-semver-規約) に従い、追加は `Added` セクション。既存 utility の rename / 廃止が発生する場合のみ breaking 扱い。
