# Image コンポーネント

**Atomic Design**: Atom  
**カテゴリ**: メディア

---

## 概要

アスペクト比の維持、遅延読み込み、エラーフォールバック、アクセシビリティ対応を備えた画像コンポーネント。アスペクト比コンテナにより CLS（Cumulative Layout Shift）を防止する。

---

## Props

| Prop | 型 | デフォルト | 説明 |
|------|----|-----------|------|
| `src` | `string` | 必須 | 画像URL |
| `alt` | `string` | 必須 | 代替テキスト（装飾画像は `""` を明示） |
| `aspectRatio` | `'square' \| 'video' \| 'portrait' \| 'wide' \| 'auto'` | `'auto'` | アスペクト比コンテナ |
| `objectFit` | `'cover' \| 'contain' \| 'fill'` | `'cover'` | 画像のフィット方法 |
| `rounded` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'none'` | 角丸 |
| `lazy` | `boolean` | `true` | 遅延読み込み |
| `fallback` | `ReactNode` | プレースホルダーアイコン | エラー時の代替コンテンツ |

---

## aspectRatio の対応表

| 値 | 比率 | 用途 |
|----|------|------|
| `square` | 1:1 | アバター・サムネイル・グリッド |
| `video` | 16:9 | 動画・ヒーロー画像 |
| `portrait` | 3:4 | 縦型写真・ポートレート |
| `wide` | 21:9 | バナー・シネマスコープ |
| `auto` | なし | 自然なサイズ（コンテナなし） |

---

## 使用例

```tsx
// ブログサムネイル
<Image src="/photo.jpg" alt="山岳の風景" aspectRatio="video" rounded="md" />

// 装飾画像（スクリーンリーダーが読み上げない）
<Image src="/bg.jpg" alt="" aspectRatio="wide" />

// プロフィール写真
<Image src="/avatar.jpg" alt="田中 太郎" aspectRatio="square" rounded="full"
  className="w-20" />

// カスタムフォールバック
<Image src="/..." alt="..." fallback={<div>読み込めませんでした</div>} />
```

---

## アクセシビリティ

- `alt=""` を渡すと `role="presentation"` が自動付与（装飾画像をスクリーンリーダーから隠す）
- `alt` の省略はエラー（TypeScript の型で必須指定）
- `loading="lazy"` がデフォルト（ビューポート外の画像を遅延読み込み）

---

## パフォーマンス

- アスペクト比コンテナ（`aspect-*`）でレイアウトシフトを防止
- `loading="lazy"` で初期表示の帯域を節約
- エラー時はフォールバックに切り替え（壊れた画像アイコンを表示しない）
