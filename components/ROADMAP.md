# デザインシステム ロードマップ

**最終更新**: 2026年2月22日

---

## ✅ 完了済み

### Phase 1〜4: 原則ドキュメント（62ファイル）
`principles/` に配置済み（foundation / layout / interaction / content / color / motion / patterns / platform）

### Phase A: デザイントークン（7ファイル）
`tokens/` に配置済み（spacing / colors / typography / shadows / radius / breakpoints / animation）

### Phase B: Atom コンポーネント（18個）
`components/atoms/` に配置済み。詳細は `ATOMS_LIST.md` を参照。

### Phase C: Storybook
- ローカル: `npm run storybook` → http://localhost:6006
- 公開 URL: https://design-system-storybook-murex.vercel.app
- GitHub: https://github.com/kawachiryuya/design-system（Private）
- `main` ブランチへの push で自動デプロイ

### Phase D: Molecule コンポーネント（8個）
`components/molecules/` に配置済み。

| コンポーネント | 概要 |
|---|---|
| FormField | Label + 任意のフォームコントロール + helpText / error のラッパー |
| SearchBar | SearchIcon + Input + ClearButton + LoadingSpinner |
| Card | elevated / outlined / flat + Header / Body / Footer スロット |
| Alert | success / error / warning / info / neutral + 閉じるボタン |
| EmptyState | アイコン + タイトル + 説明 + アクション |
| Breadcrumb | chevron / slash / dot セパレーター + aria-current |
| Tabs | underline / pill + キーボード操作 + バッジ + 制御 / 非制御 |
| Pagination | 省略記号 + 最初・最後ボタン + サイズ |

---

## 🚧 未着手

### Phase E: Organism（未着手）

Molecule を複数組み合わせた複雑なセクション。
ポートフォリオサイト制作を通じて必要なものを都度追加予定。

| コンポーネント | 概要 |
|---|---|
| Header | ロゴ + ナビゲーション + SearchBar + ユーザーメニュー |
| Footer | ソーシャルリンク + コピーライト |
| Modal / Dialog | オーバーレイ + Card + フォーカストラップ |
| Toast | Alert ベースの画面端通知 |
| DataTable | テーブル + Pagination + SearchBar + EmptyState |

### Phase F: ポートフォリオサイト（未着手）

このデザインシステムを使って実際のサイトを構築する。
`designSystem/` と並列に `portfolio/` ディレクトリを作成予定。

---

## 📁 ディレクトリ規則

```
Atom     → components/atoms/ComponentName/
Molecule → components/molecules/ComponentName/
Organism → components/organisms/ComponentName/（将来）
```

各コンポーネントは `ComponentName.tsx` / `ComponentName.stories.tsx` / `ComponentName.md` / `index.ts` の4ファイル構成。
