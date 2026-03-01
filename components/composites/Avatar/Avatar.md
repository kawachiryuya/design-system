# Avatar コンポーネント

**Atomic Design**: Atom  
**カテゴリ**: ユーザーインターフェース

---

## 概要

ユーザーのプロフィール画像を表示するコンポーネント。画像 URL が未指定または読み込み失敗の場合はイニシャルを自動生成して表示する。オンライン状態インジケーターも内包する。

---

## Props

| Prop | 型 | デフォルト | 説明 |
|------|----|-----------|------|
| `src` | `string` | — | 画像URL |
| `alt` | `string` | — | 画像の代替テキスト |
| `name` | `string` | — | ユーザー名（イニシャル生成に使用） |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | アバターサイズ |
| `shape` | `'circle' \| 'square'` | `'circle'` | 形状 |
| `status` | `'online' \| 'offline' \| 'busy' \| 'away'` | — | ステータスインジケーター |

---

## サイズ対応表

| size | 直径 | 用途 |
|------|------|------|
| `xs` | 24px | コメント欄の小アバター |
| `sm` | 32px | リスト・テーブル内 |
| `md` | 40px | カード・ヘッダー（デフォルト） |
| `lg` | 56px | プロフィールページのサブ画像 |
| `xl` | 80px | プロフィールページのメイン画像 |

---

## フォールバック動作

1. `src` あり → 画像を表示
2. `src` なし または 読み込みエラー → `name` からイニシャルを生成して表示
3. `name` もなし → プレースホルダーアイコンを表示

イニシャルの背景色は `name` の文字列から決定論的に選択されるため、同じユーザーは常に同じ色になる。

---

## 使用例

```tsx
// 画像あり
<Avatar src="/user.jpg" name="田中 太郎" alt="田中 太郎のプロフィール写真" />

// イニシャル表示
<Avatar name="田中 太郎" size="lg" />

// ステータスつき
<Avatar src="/user.jpg" name="田中 太郎" status="online" />

// アバターグループ
<div className="flex -space-x-3">
  <Avatar src="/user1.jpg" name="Alice" className="ring-2 ring-white" />
  <Avatar src="/user2.jpg" name="Bob" className="ring-2 ring-white" />
</div>
```

---

## アクセシビリティ

- コンテナに `role="img"` と `aria-label`（name または alt）を付与
- 画像には適切な `alt` テキスト
- イニシャルテキストは `aria-hidden="true"`（コンテナのラベルで代替）
- ステータスドットに `role="img"` と `aria-label`（日本語のステータス名）
