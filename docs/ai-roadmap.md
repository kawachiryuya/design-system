# AI 活用 SSOT 化ロードマップ（実装ガイド）

> **戦略メモ**: `kawachiryuya/ai-management` リポの `01_areas/work/design-dev/DESIGN-SYSTEM.md` に集約。本ドキュメントはその **実装ロードマップ** を design-system リポ側で詳細化したもの。
>
> **最終更新**: 2026-05-10
> **親 Issue**: [kawachiryuya/ai-management#14](https://github.com/kawachiryuya/ai-management/issues/14)

---

## ロードマップ全体像

| Phase | 内容 | 関連 Issue |
|---|---|---|
| **Phase 0** | 方針メモ完成、優先施策の Issue 起票 | （完了） |
| **Phase 1** | 施策 A（Style Dictionary 化 + TS エクスポート）+ 施策 C（AGENTS.md + 本ファイル） | [#32](https://github.com/kawachiryuya/ai-management/issues/32) / [#33](https://github.com/kawachiryuya/ai-management/issues/33) |
| **Phase 2** | 施策 B（型強化）+ npm パッケージ化 | [#34](https://github.com/kawachiryuya/ai-management/issues/34) / [#35](https://github.com/kawachiryuya/ai-management/issues/35) |
| **Phase 3** | 受託案件で実運用 → 50% 工数削減検証 | [#36](https://github.com/kawachiryuya/ai-management/issues/36) |
| **Phase 4** | iOS / Android / RN 向けビルダー追加 + monorepo 化判断 | （Phase 4 トリガー時） |

---

## アーキテクチャ階層モデル

```
┌──────────────────────────────────────────────────┐
│ Layer 1: Tokens (Style Dictionary / W3C DTCG)    │  ← プラットフォーム非依存 SSOT
│   tokens/source/*.json                           │
│   ↓ npm run tokens:build                         │
├──────────────┬───────────────┬───────────────────┤
│ Layer 2-Web  │ Layer 2-iOS   │ Layer 2-Android   │  ← 各プラットフォーム実装
│ (TS/CSS/Tw)  │ (Swift)       │ (XML/Kotlin)      │     コンポーネントは別実装
│ React 26 個  │ Phase 4       │ Phase 4           │
├──────────────┴───────────────┴───────────────────┤
│ Layer 3: Principles (プラットフォーム横断)        │  ← principles/ 既存 62 ファイル
├──────────────────────────────────────────────────┤
│ Layer 4: PJ-specific Overrides                   │  ← gunmaas/, lp/, demo*/, 受託 PJ
│   CSS 変数 override / Tailwind preset 継承       │
└──────────────────────────────────────────────────┘
```

---

## Phase 1: 施策 A & C（自由時間枠で進行中）

### 施策 A: Style Dictionary 化 + TS エクスポート — [#32](https://github.com/kawachiryuya/ai-management/issues/32)

#### 現状

- `tokens/*.json` × 8 ファイル（colors / semantic-colors / spacing / typography / shadows / radius / breakpoints / animation）
- `tailwind.config.js` で直接 `require` して統合
- `semantic-colors.json` は `{ value, description }` 形式 → **W3C DTCG に近い**（`$value`/`$description` への変換は機械的）
- TS エクスポートなし → AI が型補完できない

#### 移行ステップ

1. **Style Dictionary 導入**:
   ```bash
   npm install -D style-dictionary
   ```

2. **既存 JSON を `tokens/source/` に移動**（既存 `tokens/*.json` は最小変更）:
   - `tokens/colors.json` → `tokens/source/colors.json`
   - `tokens/semantic-colors.json` → `tokens/source/semantic-colors.json`
   - 他 6 ファイルも同様

3. **DTCG 互換への軽微変換**（オプション、Phase 1 後半）:
   - `value` → `$value`、`description` → `$description`
   - 型情報追加: `$type: "color"` 等

4. **`style-dictionary.config.json` を新設**（雛形は本ドキュメント末尾を参照）

5. **ビルド成果物を `tokens/build/` に出力**:
   - `tokens/build/colors.json`（Tailwind 互換 JSON）
   - `tokens/build/variables.css`（CSS 変数、現在 `.storybook/tailwind.css` に手書きの内容を自動生成へ）
   - `tokens/build/tokens.ts`（TS const エクスポート）
   - `tokens/build/tailwind-preset.js`（Tailwind preset、Phase 2 の npm 化で活躍）

6. **`tokens/index.ts` を新設して TS エクスポート**:
   - 雛形は本ドキュメント末尾を参照

7. **`tailwind.config.js` を build 成果物参照に切り替え**（リポ本体 + 各 PJ）:
   - 既存の `require('./tokens/colors.json')` → `require('./tokens/build/colors.json')`
   - リポルートの `tailwind.config.js`、および `demo/`, `gunmaas/`, `lp/`, `demo2/` 各 PJ の `tailwind.config.js` 全てに反映
   - 既存の `tailwind.config.js` 構造は維持（PJ ビルドが壊れない）

8. **手書き CSS 変数を build 成果物の import に置き換え**:
   - 現状 `.storybook/tailwind.css` と `demo/src/index.css` の **2 箇所に CSS 変数が手書き同期**されている
   - `tokens/build/variables.css` を Style Dictionary が自動生成
   - 両ファイルから `@import "../tokens/build/variables.css"` または相対パスで読み込む形に変更
   - 同期維持コストがゼロになる

9. **検証サイト（demo）で動作確認**:
   ```bash
   cd demo
   npm install
   npm run dev      # http://localhost:5173 で目視確認
   npm run build    # ビルドエラーチェック
   ```
   - 主要画面: `/`（検索）/ `/results`（結果一覧）/ `/seat`（座席選択）/ `/confirm`（確認）等
   - 色・余白・角丸・フォント等が変化していないことを確認

10. **その他 PJ のビルド確認**:
    ```bash
    npm run build:gunmaas
    npm run build:demo
    ```

#### 注意点

- gunmaas, lp 等の既存 PJ ビルドが壊れないよう、現行 `tailwind.config.js` が認識する形式は保つ（破壊的変更を避ける）
- iOS/Android 用 platforms は **コメントアウト状態で残す**（Phase 4 で有効化、設計だけ残す）
- 検証は `demo/` で行う（AGENTS.md §5 参照）。`gunmaas/` `lp/` は触らないことが多いので、回帰テストには `demo/` が最適

### 施策 C: AI コンテキスト整備 — [#33](https://github.com/kawachiryuya/ai-management/issues/33)

#### 内容

- ✅ `AGENTS.md`（リポルート、本 PR で追加） — AI 操作規約集
- ✅ `docs/ai-roadmap.md`（本ファイル、本 PR で追加） — 実装ロードマップ
- 🔲 `docs/ai-roadmap.md` の Phase 1 完了時点更新（[#32](https://github.com/kawachiryuya/ai-management/issues/32) 完了時）

---

## Phase 2: 施策 B & npm 化

### 施策 B: コンポーネント型の AI 可読性向上 — [#34](https://github.com/kawachiryuya/ai-management/issues/34)

#### 対象範囲（優先順）

1. Primitives 11 個（Button から着手）
2. Composites 15 個（Phase 2 後半）

#### 改善内容

- **discriminated union 化**:
  ```ts
  // Before
  interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'tertiary';
    iconOnly?: boolean;
  }

  // After
  type ButtonProps =
    | { variant: 'primary' | 'secondary'; iconOnly?: false; children: React.ReactNode }
    | { variant: 'primary' | 'secondary'; iconOnly: true; icon: React.ReactNode; children?: never }
    | { variant: 'tertiary'; ... };
  ```
- **`@example` JSDoc 必須**: 各 Props に最低 1 例
- **`components/index.ts` 新設**: 全コンポーネントを集約 export
  ```ts
  export * from './primitives/Button';
  export * from './primitives/Input';
  // ... 全 26 個
  ```

### npm パッケージ化 — [#35](https://github.com/kawachiryuya/ai-management/issues/35)

#### 公開先

- **GitHub Packages**（private）
- パッケージ名: `@kawachiryuya/design-system`

#### `package.json` の `exports` 整備

```json
{
  "name": "@kawachiryuya/design-system",
  "exports": {
    "./tokens": "./tokens/build/tokens.js",
    "./tailwind": "./tokens/build/tailwind-preset.js",
    "./components": "./components/index.ts",
    "./styles/variables.css": "./tokens/build/variables.css"
  }
}
```

#### 検証

- 1 つの実 PJ（候補: 受託案件 or `kawachi-portfolio`）で `npm link` 検証
- preset 継承 + CSS 変数 override が機能することを確認

---

## Phase 3: 受託案件への適用と工数計測 — [#36](https://github.com/kawachiryuya/ai-management/issues/36)

### 計測方法

- **before / after の 2 比較条件**:
  - UI 実装の合計工数（コンポーネント実装 / レイアウト / トークン適用）
  - AI 生成 UI のトーン揃え工数（生成→修正までのラウンドトリップ数）
- **目標**: 50% 削減（[#14](https://github.com/kawachiryuya/ai-management/issues/14) のターゲット）
- **記録先**: `00_context/memories/` または `04_knowledge/`（ai-management リポ）

---

## Phase 4: マルチプラットフォーム展開（条件付き）

### トリガー

- iOS / Android / React Native 展開の意思決定があった時のみ
- 単一 React 用途で完結する間は **着手しない**

### 着手内容

- `style-dictionary.config.json` の iOS/Android platforms をアクティブ化
- monorepo 化判断（`packages/tokens`, `packages/react`, `packages/ios` 等への分割）
- npm scope の見直し（必要なら `@kawachiryuya/design-system-ios` 等を別パッケージ化）

---

## 付録: 雛形

### A. `tokens/index.ts` の TS エクスポート（Style Dictionary build 後）

```ts
// tokens/index.ts — Style Dictionary build 成果物の集約エクスポート
import colorsRaw from './build/colors.json';
import semanticColorsRaw from './build/semantic-colors.json';
import spacingRaw from './build/spacing.json';
import typographyRaw from './build/typography.json';
import shadowsRaw from './build/shadows.json';
import radiusRaw from './build/radius.json';
import breakpointsRaw from './build/breakpoints.json';
import animationRaw from './build/animation.json';

export const COLORS = colorsRaw as const;
export const SEMANTIC_COLORS = semanticColorsRaw as const;
export const SPACING = spacingRaw as const;
export const TYPOGRAPHY = typographyRaw as const;
export const SHADOWS = shadowsRaw as const;
export const RADIUS = radiusRaw as const;
export const BREAKPOINTS = breakpointsRaw as const;
export const ANIMATION = animationRaw as const;

// 型推論用の再エクスポート
export type Colors = typeof COLORS;
export type SemanticColors = typeof SEMANTIC_COLORS;
export type SpacingKey = keyof typeof SPACING.spacing;
export type TypographyKey = keyof typeof TYPOGRAPHY.fontSize;

// 利用例:
//   import { SEMANTIC_COLORS } from '@kawachiryuya/design-system/tokens';
//   const surface = SEMANTIC_COLORS.surface.primary; // { value: 'primary-600', description: '...' }
```

### B. `style-dictionary.config.json` 雛形

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "source": ["tokens/source/**/*.json"],
  "platforms": {
    "web-json": {
      "transformGroup": "js",
      "buildPath": "tokens/build/",
      "files": [
        { "destination": "colors.json", "format": "json/flat", "filter": { "attributes": { "category": "color" } } },
        { "destination": "spacing.json", "format": "json/flat", "filter": { "attributes": { "category": "size" } } },
        { "destination": "typography.json", "format": "json/flat", "filter": { "attributes": { "category": "typography" } } }
      ]
    },
    "web-ts": {
      "transformGroup": "js",
      "buildPath": "tokens/build/",
      "files": [
        { "destination": "tokens.ts", "format": "javascript/es6" }
      ]
    },
    "web-css": {
      "transformGroup": "css",
      "buildPath": "tokens/build/",
      "files": [
        { "destination": "variables.css", "format": "css/variables", "options": { "selector": ":root" } }
      ]
    },
    "web-tailwind": {
      "transformGroup": "js",
      "buildPath": "tokens/build/",
      "files": [
        { "destination": "tailwind-preset.js", "format": "javascript/module-flat" }
      ]
    }
    // Phase 4 で有効化:
    // "ios": {
    //   "transformGroup": "ios-swift",
    //   "buildPath": "tokens/build/ios/",
    //   "files": [{ "destination": "Tokens.swift", "format": "ios-swift/class.swift", "className": "Tokens" }]
    // },
    // "android": {
    //   "transformGroup": "android",
    //   "buildPath": "tokens/build/android/",
    //   "files": [{ "destination": "colors.xml", "format": "android/colors" }]
    // }
  }
}
```

### C. ビルドスクリプト

```json
// package.json scripts への追加
{
  "scripts": {
    "tokens:build": "style-dictionary build",
    "tokens:watch": "style-dictionary build --watch",
    "prebuild-storybook": "npm run tokens:build"
  }
}
```
