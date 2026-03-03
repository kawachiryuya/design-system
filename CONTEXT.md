# Cursor 作業再開ガイド

**最終更新**: 2026年2月21日  
**前回まで**: Primitives（11個）+ Composites（15個）完了、primitives/composites 構造へ再構成済み

---

## 📊 現在の状態

### ✅ 完了済み

**Phase 1〜4: 原則ドキュメント（62ファイル）**
- `principles/` に配置済み
- foundation/layout/interaction/content/color/motion/patterns/platform

**Phase A: デザイントークン（7ファイル）**
- `tokens/` に配置済み（spacing/colors/typography/shadows/radius/breakpoints/animation）

**Primitives（11個）**
- `components/primitives/Button/` — Button（variant/size/isLoading/icon/fullWidth）
- `components/primitives/Divider/` — Divider（orientation/label/color/weight）
- `components/primitives/Icon/` — Icon（size/color/label/aria）
- `components/primitives/Image/` — Image（aspectRatio/objectFit/rounded/lazy/fallback）
- `components/primitives/Input/` — Input（type/size/error/icon/label/helpText）
- `components/primitives/Label/` — Label（required/optional/disabled）
- `components/primitives/Link/` — Link（external/color/underline/disabled）
- `components/primitives/Skeleton/` — Skeleton（variant/lines/animated）
- `components/primitives/Spinner/` — Spinner（size/color/label）
- `components/primitives/Textarea/` — Textarea（maxLength/currentLength/resize）
- `components/primitives/Typography/` — Typography（variant/as/color/truncate）

**Composites（15個）**
- `components/composites/Alert/` — Alert（success/error/warning/info/neutral + 閉じるボタン）
- `components/composites/Avatar/` — Avatar（src/name/size/shape/status + イニシャルフォールバック）
- `components/composites/Badge/` — Badge（variant/appearance/dot）
- `components/composites/Breadcrumb/` — Breadcrumb（chevron/slash/dot セパレーター + aria-current）
- `components/composites/Card/` — Card（elevated/outlined/flat + Header/Body/Footer スロット）
- `components/composites/Checkbox/` — Checkbox + CheckboxGroup（indeterminate/error/description + fieldset グループ）
- `components/composites/EmptyState/` — EmptyState（アイコン + タイトル + 説明 + アクション）
- `components/composites/Pagination/` — Pagination（省略記号 + 最初・最後ボタン + サイズ）
- `components/composites/ProgressBar/` — ProgressBar（value/color/size/showValue/indeterminate）
- `components/composites/Radio/` — Radio + RadioGroup（inline/error/legend）
- `components/composites/SearchBar/` — SearchBar（SearchIcon + Input + ClearButton + LoadingSpinner）
- `components/composites/Select/` — Select（size/error/fullWidth/placeholder）
- `components/composites/Switch/` — Switch（role="switch"/labelPosition）
- `components/composites/Tabs/` — Tabs（underline/pill + キーボード操作 + バッジ + 制御/非制御）

**Phase C: Storybook セットアップ（完了）**
- `package.json` / `tsconfig.json` / `vite.config.ts` / `postcss.config.js`
- `.storybook/main.ts` / `preview.ts` / `tailwind.css`
- 全 26 コンポーネントに `*.stories.tsx` を追加
- `@storybook/addon-a11y` でアクセシビリティ自動チェック統合

---

## 🌐 公開 Storybook（Vercel）

**URL: https://design-system-storybook-murex.vercel.app**

- GitHub の `main` ブランチに push するたびに自動で最新版に更新される
- GitHub: https://github.com/kawachiryuya/design-system（Private）
- AI にコンポーネントを参照させるときはこの URL を渡すだけでよい

---

## 🚀 Storybook のローカル起動

```bash
cd /path/to/designSystem

npm install   # 初回のみ
npm run storybook
# → http://localhost:6006
```

**Node.js 未インストールの場合**:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# ターミナル再起動後
nvm install --lts
```

---

## 🌍 このデザインシステムを使ったプロジェクト

### ポートフォリオサイト（公開済み）

- **公開 URL**: https://kawachi-portfolio.vercel.app
- **リポジトリ**: https://github.com/kawachiryuya/portfolio（Private）
- `main` ブランチへの push で自動デプロイ
- Next.js 16 + Tailwind CSS v3 + デザイントークンを流用

---

## 🎯 次に進むべきこと

### 複雑なパターンについて

このデザインシステムは Primitives + Composites のみを提供する。
Modal / Dialog、Toast、DataTable などの複雑な UI パターンは、プロダクト側で Primitives と Composites を組み合わせて構築する。

---

## 📁 ディレクトリ構成

```
designSystem/
├── .storybook/
│   ├── main.ts
│   ├── preview.ts
│   └── tailwind.css
├── components/
│   ├── primitives/        ← Primitives（11個）
│   │   ├── Button/        ── Button
│   │   ├── Divider/       ── Divider
│   │   ├── Icon/          ── Icon
│   │   ├── Image/         ── Image
│   │   ├── Input/         ── Input
│   │   ├── Label/         ── Label
│   │   ├── Link/          ── Link
│   │   ├── Skeleton/      ── Skeleton
│   │   ├── Spinner/       ── Spinner
│   │   ├── Textarea/      ── Textarea
│   │   └── Typography/    ── Typography
│   └── composites/        ← Composites（15個）
│       ├── Alert/         ── Alert
│       ├── Avatar/        ── Avatar
│       ├── Badge/         ── Badge
│       ├── Breadcrumb/    ── Breadcrumb
│       ├── Card/          ── Card
│       ├── Checkbox/      ── Checkbox + CheckboxGroup
│       ├── EmptyState/    ── EmptyState
│       ├── Pagination/    ── Pagination
│       ├── ProgressBar/   ── ProgressBar
│       ├── Radio/         ── Radio + RadioGroup
│       ├── SearchBar/     ── SearchBar
│       ├── Select/        ── Select
│       ├── Switch/        ── Switch
│       └── Tabs/          ── Tabs
├── principles/
├── tokens/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── postcss.config.js
└── tailwind.config.js
```

---

## 📋 各コンポーネントの構成（共通）

| ファイル | 内容 |
|---------|------|
| `ComponentName.tsx` | React 実装 |
| `ComponentName.stories.tsx` | Storybook Story |
| `ComponentName.md` | 設計ドキュメント |
| `index.ts` | エクスポート |

---

## 🔧 技術スタック

| 技術 | バージョン | 用途 |
|------|-----------|------|
| React | 18.x | コンポーネント |
| TypeScript | 5.x | 型定義 |
| Tailwind CSS | 3.x | スタイリング |
| Vite | 6.x | バンドラー |
| Storybook | 8.x | UI カタログ |
| @storybook/addon-a11y | 8.x | アクセシビリティ自動検査 |

---

## 🚨 ディレクトリ規則

```
Primitive → components/primitives/ComponentName/
Composite → components/composites/ComponentName/
```

### 次のコンポーネントを作るときのプロンプト例

```
このデザインシステムに新しい Composite コンポーネント「XXX」を追加してください。

【ディレクトリ規則】
- Primitive → components/primitives/XXX/
- Composite → components/composites/XXX/

【参照ファイル】
- components/primitives/Button/Button.tsx（Primitive の実装パターン）
- components/composites/Card/Card.tsx（Composite の実装パターン）
- components/composites/Card/Card.stories.tsx（Story パターン）
- principles/（関連する原則ドキュメント）

【作成するファイル】
- components/composites/XXX/XXX.tsx
- components/composites/XXX/XXX.stories.tsx
- components/composites/XXX/XXX.md
- components/composites/XXX/index.ts
```

---

## 🚨 注意事項

- **Tailwind トークン**: `bg-blue-500` ではなく `bg-primary-600`（tokens/colors.json を参照）
- **iCloud 同期**: `node_modules/` は容量が大きいため `.icloud-nosync` で除外設定済み
- **Storybook glob**: `components/**/*.stories.*` は再帰的なので、新ディレクトリを作っても自動認識される
