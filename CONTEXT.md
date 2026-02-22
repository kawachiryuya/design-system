# Cursor 作業再開ガイド

**最終更新**: 2026年2月21日  
**前回まで**: Phase B-1 / B-2 / B-3 Atom（18個）+ Phase D Molecule（8個）完了

---

## 📊 現在の状態

### ✅ 完了済み

**Phase 1〜4: 原則ドキュメント（62ファイル）**
- `principles/` に配置済み
- foundation/layout/interaction/content/color/motion/patterns/platform

**Phase A: デザイントークン（7ファイル）**
- `tokens/` に配置済み（spacing/colors/typography/shadows/radius/breakpoints/animation）

**Phase B-1: Atom（5個）**
- `components/atoms/button/` — Button（variant/size/isLoading/icon/fullWidth）
- `components/atoms/Input/` — Input（type/size/error/icon/label/helpText）
- `components/atoms/Label/` — Label（required/optional/disabled）
- `components/atoms/Icon/` — Icon（size/color/label/aria）
- `components/atoms/Typography/` — Typography（variant/as/color/truncate）

**Phase B-2: Atom（7個）**
- `components/atoms/Checkbox/` — Checkbox（indeterminate/error/description）
- `components/atoms/Radio/` — Radio + RadioGroup（inline/error/legend）
- `components/atoms/Select/` — Select（size/error/fullWidth/placeholder）
- `components/atoms/Textarea/` — Textarea（maxLength/currentLength/resize）
- `components/atoms/Switch/` — Switch（role="switch"/labelPosition）
- `components/atoms/Badge/` — Badge（variant/appearance/dot）
- `components/atoms/Spinner/` — Spinner（size/color/label）

**Phase B-3: Atom（6個）**
- `components/atoms/Link/` — Link（external/color/underline/disabled）
- `components/atoms/Avatar/` — Avatar（src/name/size/shape/status + イニシャルフォールバック）
- `components/atoms/Divider/` — Divider（orientation/label/color/weight）
- `components/atoms/Skeleton/` — Skeleton（variant/lines/animated）
- `components/atoms/ProgressBar/` — ProgressBar（value/color/size/showValue/indeterminate）
- `components/atoms/Image/` — Image（aspectRatio/objectFit/rounded/lazy/fallback）

**Phase D: Molecule（8個）**
- `components/molecules/FormField/` — FormField（Label + children slot + helpText/error の汎用ラッパー）
- `components/molecules/SearchBar/` — SearchBar（SearchIcon + Input + ClearButton + LoadingSpinner）
- `components/molecules/Card/` — Card（elevated/outlined/flat + Header/Body/Footer スロット）
- `components/molecules/Alert/` — Alert（success/error/warning/info/neutral + 閉じるボタン）
- `components/molecules/EmptyState/` — EmptyState（アイコン + タイトル + 説明 + アクション）
- `components/molecules/Breadcrumb/` — Breadcrumb（chevron/slash/dot セパレーター + aria-current）
- `components/molecules/Tabs/` — Tabs（underline/pill + キーボード操作 + バッジ + 制御/非制御）
- `components/molecules/Pagination/` — Pagination（省略記号 + 最初・最後ボタン + サイズ）

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

### Phase E: Organisms（必要に応じて追加）

ポートフォリオや新規プロジェクトで必要になったタイミングで追加予定:
- **Modal / Dialog** — オーバーレイ + Card + フォーカストラップ
- **Toast** — Alert ベースの画面端通知
- **DataTable** — テーブル + Pagination + SearchBar + EmptyState

---

## 📁 ディレクトリ構成

```
designSystem/
├── .storybook/
│   ├── main.ts
│   ├── preview.ts
│   └── tailwind.css
├── components/
│   ├── atoms/           ← Atom（18個）
│   │   ├── button/      ── Button
│   │   ├── Input/       ── Input
│   │   ├── Label/       ── Label
│   │   ├── Icon/        ── Icon
│   │   ├── Typography/  ── Typography
│   │   ├── Checkbox/    ── Checkbox
│   │   ├── Radio/       ── Radio + RadioGroup
│   │   ├── Select/      ── Select
│   │   ├── Textarea/    ── Textarea
│   │   ├── Switch/      ── Switch
│   │   ├── Badge/       ── Badge
│   │   ├── Spinner/     ── Spinner
│   │   ├── Link/        ── Link
│   │   ├── Avatar/      ── Avatar
│   │   ├── Divider/     ── Divider
│   │   ├── Skeleton/    ── Skeleton
│   │   ├── ProgressBar/ ── ProgressBar
│   │   └── Image/       ── Image
│   └── molecules/       ← Molecule（8個）
│       ├── FormField/   ── FormField
│       ├── SearchBar/   ── SearchBar
│       ├── Card/        ── Card
│       ├── Alert/       ── Alert
│       ├── EmptyState/  ── EmptyState
│       ├── Breadcrumb/  ── Breadcrumb
│       ├── Tabs/        ── Tabs
│       └── Pagination/  ── Pagination
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
Atom     → components/atoms/ComponentName/
Molecule → components/molecules/ComponentName/
Organism → components/organisms/ComponentName/  （将来）
```

### 次のコンポーネントを作るときのプロンプト例

```
このデザインシステムに新しい Molecule コンポーネント「XXX」を追加してください。

【ディレクトリ規則】
- Atom  → components/atoms/XXX/
- Molecule → components/molecules/XXX/
- Organism → components/organisms/XXX/（将来）

【参照ファイル】
- components/atoms/button/Button.tsx（Atom の実装パターン）
- components/molecules/Card/Card.tsx（Molecule の実装パターン）
- components/molecules/Card/Card.stories.tsx（Story パターン）
- principles/（関連する原則ドキュメント）

【作成するファイル】
- components/molecules/XXX/XXX.tsx
- components/molecules/XXX/XXX.stories.tsx
- components/molecules/XXX/XXX.md
- components/molecules/XXX/index.ts
```

---

## 🚨 注意事項

- **Tailwind トークン**: `bg-blue-500` ではなく `bg-primary-600`（tokens/colors.json を参照）
- **iCloud 同期**: `node_modules/` は容量が大きいため `.icloud-nosync` で除外設定済み
- **Storybook glob**: `components/**/*.stories.*` は再帰的なので、新ディレクトリを作っても自動認識される
