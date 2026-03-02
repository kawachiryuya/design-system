# Storybook 更新タスク

ROADMAP.md の「コンポーネント分類と依存ルール」「Storybook カテゴリ構成」に基づき、
現在の Storybook を更新する。

---

## 1. サイドバーの並び順を固定する

**対象**: `.storybook/preview.ts`

現在 storySort が未設定のため、サイドバーはアルファベット順で並んでいる。
以下の順序を強制する。

```
Introduction（トップ固定）
Tokens/
Primitives/
Composites/
Patterns/         ← 新規（Phase E で追加時に自動表示）
[Product名]/      ← 将来のプロダクト固有カテゴリ
```

**実装**: `parameters.options.storySort.order` を追加。

---

## 2. Introduction.mdx の更新

**対象**: `components/Introduction.mdx`

### 2-a. 構成テーブルに Patterns 行を追加

現在 Tokens / Primitives / Composites の3行。以下を追加する。

| カテゴリ | 内容 |
|---------|------|
| **Patterns** | Modal・Toastなど、Composites を組み合わせたセクション単位のパターン（Phase E で追加予定） |
| **[Product名]** | プロダクト固有のコンポーネント（任意） |

### 2-b. 設計思想セクションの拡充

現在のタイトル「設計思想：Primitives / Composites」を更新し、
4層構造（Primitives → Composites → Patterns → プロダクト層）と依存ルールを記載する。

```
Primitives    他のコンポーネントを import しない
    ↑
Composites    Primitives のみ import 可
    ↑
Patterns      Composites + Primitives を import 可
    ↑
プロダクト層   すべてを import 可（デザインシステム外）
```

---

## 3. ROADMAP.md の Phase SB-2 を完了に更新

**対象**: `components/ROADMAP.md`

Phase SB-2 のタイトルに `✅` を付与する。
（インタラクションテスト追加・Button Story 補完・欠落 .md 作成がすべて完了済み）

---

## 対象ファイル一覧

| ファイル | 変更内容 |
|---------|---------|
| `.storybook/preview.ts` | `storySort.order` を追加 |
| `components/Introduction.mdx` | 構成テーブル + 設計思想セクション更新 |
| `components/ROADMAP.md` | Phase SB-2 に ✅ マーク |
