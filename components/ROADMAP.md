# デザインシステム ロードマップ

**最終更新**: 2026年2月19日

---

## 📊 現在の状態

✅ **Phase 1〜4: 原則ドキュメント完成** (62ファイル)
- foundation/ layout/ interaction/ content/ color/ motion/ patterns/ platform/
- すべてのカテゴリで原則を文書化完了

---

## 🚀 次のフェーズ

### Phase A: デザイントークンの定義 ⬜ 開始予定

**目的**: 原則を実装可能な形式（JSON/JS）に変換

**成果物**:
- `tokens/spacing.json` - 余白トークン
- `tokens/colors.json` - カラーパレット
- `tokens/typography.json` - フォントスケール
- `tokens/shadows.json` - 影・elevation
- `tokens/radius.json` - 角丸
- `tailwind.config.js` - Tailwind設定（トークンから生成）

**期間**: 1〜2日

**優先度**: 🔴 最優先（コンポーネント実装の基盤）

---

### Phase B: コアコンポーネントの実装 ⬜ 未着手

**目的**: 最も使われるコンポーネントの実装

**成果物**:
- Button (Primary/Secondary/Tertiary)
- Input (Text/Email/Password/Number等)
- Select / Checkbox / Radio
- Modal / Dialog
- Toast / Alert
- Card
- 各コンポーネントのドキュメント(.md)

**期間**: 3〜5日

**優先度**: 🟡 高

---

### Phase C: Storybook構築 ⬜ 未着手

**目的**: インタラクティブなドキュメントサイト

**成果物**:
- Storybook環境
- 各コンポーネントのStories
- アクセシビリティチェック統合
- Props一覧の自動生成

**期間**: 2〜3日

**優先度**: 🟢 中

---

## 📋 Phase A 詳細タスク

### 1. トークン設計
- [ ] spacing.json 作成（8pxベーススケール）
- [ ] colors.json 作成（50-900スケール + セマンティック）
- [ ] typography.json 作成（font-size/weight/line-height）
- [ ] shadows.json 作成（elevation 0-16）
- [ ] radius.json 作成（角丸 0-full）
- [ ] breakpoints.json 作成（sm/md/lg/xl/2xl）

### 2. Tailwind設定
- [ ] tailwind.config.js 作成
- [ ] トークンをTailwindに統合
- [ ] カスタムユーティリティクラス追加

### 3. 検証
- [ ] 原則ドキュメントとの整合性確認
- [ ] 使用例の作成

---

## 🎯 成功基準

### Phase A完了の定義
- [ ] すべてのトークンファイルが作成済み
- [ ] Tailwind設定がトークンから生成されている
- [ ] 原則ドキュメント（spacing.md等）との一貫性が保たれている
- [ ] 使用例のHTMLが動作する

### Phase B完了の定義
- [ ] 8つのコアコンポーネントが実装済み
- [ ] 各コンポーネントにアクセシビリティ対応がある
- [ ] 各コンポーネントに.mdドキュメントがある
- [ ] すべてのコンポーネントがトークンを使用している

### Phase C完了の定義
- [ ] Storybookが起動する
- [ ] 全コンポーネントのStoriesが存在する
- [ ] アクセシビリティチェックが統合されている
- [ ] デプロイ可能な状態になっている

---

## 📝 メモ・決定事項

### 技術スタック（仮）
- React + TypeScript
- Tailwind CSS
- Storybook
- トークン形式: JSON

### ディレクトリ構造（予定）
```
design-system/
├── tokens/          # Phase A
│   ├── spacing.json
│   ├── colors.json
│   └── ...
├── components/      # Phase B
│   ├── Button/
│   ├── Input/
│   └── ...
└── .storybook/      # Phase C
```

---

**このロードマップは進捗に応じて更新されます。**
