# mode① (no-Tailwind) 最小サンプル

`@kawachiryuya/design-system` を **Tailwind 抜き**で消費できること (= モード 1) を実証する最小アプリ。
DS のために Tailwind を入れたくない消費者の経路を、実際の公開エントリでなぞる。

## 何を証明するか

- **2 ファイルだけで動く**: [src/index.css](src/index.css) が import するのは DS の
  `tokens/variables.css` と `styles.css` の 2 つだけ。Tailwind / preset / `@tailwind`
  ディレクティブ・`tailwind.config` は一切無い (依存にも `tailwindcss` を入れていない)。
- **responsive が styles.css 単体で自己完結**: `AppShell` のサイドバー / ヘッダー / 下部ナビが
  1024px (`shell` breakpoint) を境に正しく出し分くこと。これが mode① の最大のリスク面。
- **見た目一致**: `Button` / `Card` / フォーム (`Input` / `Checkbox`) の border・focus ring・
  surface 色が Storybook (mode②) と一致すること。

## 実行

```sh
# リポジトリ root で DS を build (dist/ と dist/styles.css を生成)
cd ../.. && npm run build

# この例を build / 起動
cd examples/no-tailwind
npm install        # @kawachiryuya/design-system は file:../.. = 上で build した dist を参照
npm run build      # Tailwind ゼロで build が通る (CI ガードと同じ)
npm run dev        # ブラウザで目視 (幅 375px / 1280px でサイドバーの出/隠を確認)
```

## 設計メモ

- 自前の chrome (sidebar / header / bottomNav の中身) は no-Tailwind 消費者と同じく
  **素の inline style + token CSS 変数 (`var(--color-*)`)** で組んでいる。DS コンポーネントは
  `styles.css` の焼き込み済み utility で自己完結するので、このアプリに Tailwind class は書かない。
- `index.css` の app-level reset は `body { margin: 0 }` 等の **document 既定だけ**。
  `box-sizing` / `border-style` のような「Tailwind utility が動く前提」の reset は
  **DS = `styles.css` の責務**なのでここには足さない。
