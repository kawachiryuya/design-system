# LP（ランディングページ）

Vite + React + TypeScript + Tailwind CSS で構成された SPA（シングルページアプリケーション）です。

## セットアップ

```bash
# Node.js（v18 以上）がインストールされていることを確認
node -v

# 依存パッケージをインストール（初回のみ）
npm install
```

## 開発

```bash
# 開発サーバーを起動（ホットリロード対応）
npm run dev
```

## ビルド & デプロイ

```bash
# ビルド（dist/ にファイルが生成される）
npm run build
```

`dist/` の中身をサーバーの `/site/` ディレクトリに配置してください。

```
dist/
├── index.html          ← エントリーポイント
└── assets/
    ├── index-xxx.css   ← スタイルシート
    └── index-xxx.js    ← JavaScript
```

- サーバー側のプログラム（PHP・Node.js 等）は不要です
- ファイルをそのまま Web サーバーに配置するだけで公開できます
- ファイル名のハッシュ（`-BviQuk7T` 等）はキャッシュ対策用で、ビルドごとに変わります

## テキストの変更

各セクションのテキストは `src/sections/` 以下のファイルに記述されています。

| セクション | ファイル |
|-----------|---------|
| メインビジュアル | `src/sections/HeroSection.tsx` |
| サービス紹介 | `src/sections/AboutSection.tsx` |
| 利用の流れ | `src/sections/UsageFlowSection.tsx` |
| 先行体験 CTA | `src/sections/TrialCtaSection.tsx` |
| 注意事項 | `src/sections/CautionSection.tsx` |
| 応募の流れ | `src/sections/ApplicationFlowSection.tsx` |
| よくある質問 | `src/sections/FaqSection.tsx` |
| リンク | `src/sections/LinksSection.tsx` |
| フッター | `src/sections/FooterSection.tsx` |
| 中間 CTA バンド | `src/components/CtaBand.tsx` |

テキストを変更した後は `npm run build` で再ビルドし、`dist/` を再アップロードしてください。

## 画像の変更

画像は `public/images/` に配置します。配置した画像は `dist/images/` にそのままコピーされるため、サーバー上で直接差し替えも可能です（再ビルド不要）。

### 手順

1. `public/images/` に画像ファイルを配置
2. `src/assets.ts` で対応するパスを設定

```ts
// src/assets.ts の例
export const assets = {
  logo: img('logo.png'),                           // ← ファイル名を指定
  usageSteps: [img('step1.png'), img('step2.png'), img('step3.png')],
  // ...
};
```

3. `npm run build` でビルド

### 画像カテゴリ

| 用途 | 枚数 | assets.ts のキー |
|------|------|-----------------|
| ロゴ | 1枚（共通） | `logo` |
| 利用の流れイラスト | 3枚 | `usageSteps` |
| 応募の流れイラスト | 4枚 | `applicationSteps` |
| 注意事項イラスト | 4枚 | `cautionIllustrations` |

### サーバー上で直接差し替える場合

`public/images/` の画像はビルド後もファイル名がそのまま保持されるため、サーバー上の `/site/images/logo.png` 等を直接差し替えることで、再ビルドなしに反映できます。

## URL の変更

外部リンク（CTA ボタン等）の遷移先 URL は各セクションファイル内の `<a href="">` で管理しています。`href=""` となっている箇所に URL を設定してください。変更後は再ビルドが必要です。

## 配置先パスの変更

現在は `~.com/site/` への配置を前提にビルドされています。配置先を変更する場合は `vite.config.ts` の `base` を変更して再ビルドしてください。

```ts
// vite.config.ts
export default defineConfig({
  base: '/new-path/',  // ← 変更
  // ...
});
```
