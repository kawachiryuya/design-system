# デザインシステム原則ドキュメント

**一貫性のある、アクセシブルで、美しいデジタル体験を構築するための完全ガイド**

---

## 👋 このデザインシステムについて

62の原則ドキュメントからなる、実践的で包括的なデザインシステムです。デザイナーと開発者が協力して、高品質なユーザー体験を効率的に作り出すための共通言語を提供します。

**最終更新**: 2026年2月19日  
**ステータス**: Phase 1〜4 完了（実用レベル）

### デザインシステムとは？

デザインとコードの間のギャップを埋める、再利用可能なコンポーネントと明確な原則の集合です。

**このシステムが提供するもの**:
- ✅ **原則**: なぜ・何を（このドキュメント群）
- ✅ **パターン**: 実装のベストプラクティス
- ✅ **ガイドライン**: アクセシビリティ・パフォーマンス・SEO

---

## 🚀 クイックスタート

### 初めての方へ

**10分で理解する**: 以下の順番で読む

1. **[Atomic Design Implementation](./patterns/atomic-design-implementation.md)** (5分)  
   コンポーネントの階層構造（Atoms, Molecules, Organisms等）を理解

2. **[Accessibility Overview](./foundation/accessibility/overview.md)** (3分)  
   すべての基礎。アクセシビリティとは何か、なぜ重要か

3. **[Button Priority](./interaction/button/priority.md)** (2分)  
   ボタンの分類（Primary, Secondary, Tertiary）。最もよく使う原則

### 役割別スタートガイド

#### 🎨 デザイナー向け

**基礎を固める（30分）**:
1. [Spacing](./layout/spacing.md) - 余白システム（8pxベース）
2. [Grid](./layout/grid.md) - 12カラムグリッド
3. [Typography Scale](./content/typography/scale.md) - 文字サイズ体系
4. [Color Overview](./color/overview.md) - カラーシステム
5. [Hierarchy](./foundation/hierarchy.md) - 視覚的ヒエラルキー

**実践する（1時間）**:
- [Forms](./patterns/forms.md) - フォーム設計
- [Navigation](./patterns/navigation.md) - ナビゲーション
- [Data Display](./patterns/data-display.md) - テーブル・カード

#### 💻 フロントエンド開発者向け

**構造を理解する（30分）**:
1. [Atomic Design Implementation](./patterns/atomic-design-implementation.md) - コンポーネント階層
2. [Consistency](./foundation/consistency.md) - 一貫性の原則
3. [Responsiveness](./foundation/responsiveness.md) - モバイルファースト

**実装する（2時間）**:
- [Button Priority](./interaction/button/priority.md) + [Placement](./interaction/button/placement.md)
- [States](./interaction/states/overview.md) - 状態管理
- [Feedback](./interaction/feedback/overview.md) - フィードバックUI
- [Accessibility](./foundation/accessibility/overview.md) - アクセシビリティ対応

**最適化する（1時間）**:
- [Performance](./platform/web/performance.md) - Core Web Vitals
- [Browser Support](./platform/web/browser-support.md) - ブラウザ対応
- [SEO](./platform/web/seo.md) - 検索エンジン最適化

#### 📋 プロダクトマネージャー向け

**UXの基礎を理解する（20分）**:
1. [Accessibility Overview](./foundation/accessibility/overview.md) - なぜアクセシビリティが重要か
2. [Forms](./patterns/forms.md) - 離脱率を下げるフォーム設計
3. [Error Messages](./content/writing/error-messages.md) - ユーザーを責めないエラー

**意思決定に活用する（30分）**:
- [Performance](./platform/web/performance.md) - パフォーマンスがコンバージョンに与える影響
- [Native Patterns](./platform/mobile/native-patterns.md) - iOS vs Android の違い

---

## 📚 ドキュメント構造（全62ファイル）

### 🏗️ Foundation（基盤原則）- 10ファイル

すべての原則の基礎。

| ドキュメント | 概要 |
|------------|------|
| **[Accessibility](./foundation/accessibility/overview.md)** | アクセシビリティ全般（7ファイル） |
| **[Consistency](./foundation/consistency.md)** | 一貫性の4レベル |
| **[Hierarchy](./foundation/hierarchy.md)** | 視覚的ヒエラルキー5つの手段 |
| **[Responsiveness](./foundation/responsiveness.md)** | モバイルファースト原則 |

### 📐 Layout（レイアウト）- 3ファイル

| ドキュメント | 概要 |
|------------|------|
| **[Spacing](./layout/spacing.md)** | 8pxベース余白システム |
| **[Grid](./layout/grid.md)** | 12カラムグリッド・ブレークポイント |
| **[Alignment](./layout/alignment.md)** | 整列の原則 |

### 🖱️ Interaction（インタラクション）- 18ファイル

| カテゴリ         | ドキュメント                                                                                                                                                                               | 概要                         |     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------- | --- |
| **Button**   | [Priority](./interaction/button/priority.md)                                                                                                                                         | Primary/Secondary/Tertiary |     |
|              | [Placement](./interaction/button/placement.md)                                                                                                                                       | 配置ルール                      |     |
| **States**   | [Overview](./interaction/states/overview.md)                                                                                                                                         | 状態の2カテゴリ                   |     |
|              | [Interactive States](./interaction/states/interactive-states.md)                                                                                                                     | hover/focus/active         |     |
|              | [Status States](./interaction/states/status-states.md)                                                                                                                               | loading/error/success      |     |
|              | [Transitions](./interaction/states/state-transitions.md)                                                                                                                             | 遷移・アニメーション値                |     |
| **Feedback** | [Overview](./interaction/feedback/overview.md)                                                                                                                                       | フィードバック3原則                 |     |
|              | [Toast](./interaction/feedback/toast-notifications.md)                                                                                                                               | トースト通知                     |     |
|              | [Inline Validation](./interaction/feedback/inline-validation.md)                                                                                                                     | フォームバリデーション                |     |
|              | [Loading](./interaction/feedback/loading-indicators.md)                                                                                                                              | ローディング表示                   |     |
|              | [Progress](./interaction/feedback/progress-indicators.md)                                                                                                                            | 進捗表示                       |     |
| **Gestures** | [Overview](./interaction/gestures/overview.md)                                                                                                                                       | ジェスチャー3原則                  |     |
|              | [Tap](./interaction/gestures/tap.md) / [Swipe](./interaction/gestures/swipe.md) / [Pinch](./interaction/gestures/pinch-zoom.md) / [Long Press](./interaction/gestures/long-press.md) | モバイル操作                     |     |

### ✍️ Content（コンテンツ）- 15ファイル

| カテゴリ | ドキュメント | 概要 |
|---------|------------|------|
| **Typography** | [Scale](./content/typography/scale.md) | フォントサイズ・ウェイト・行間 |
| | [Hierarchy](./content/typography/hierarchy.md) | H1-H6, Body等 |
| | [Readability](./content/typography/readability.md) | 可読性 |
| | [Font Families](./content/typography/font-families.md) | フォント選択 |
| **Iconography** | [Overview](./iconography/overview.md) + 3ファイル | アイコン使用原則 |
| **Imagery** | [Overview](./imagery/overview.md) + 3ファイル | 画像・alt text・最適化 |
| **Writing** | [Tone & Voice](./content/writing/tone-voice.md) | 文章のトーン |
| | [Microcopy](./content/writing/microcopy.md) | ボタンラベル・ツールチップ |
| | [Error Messages](./content/writing/error-messages.md) | エラー文言 |

### 🎨 Color（カラー）- 6ファイル

| ドキュメント | 概要 |
|------------|------|
| **[Overview](./color/overview.md)** | カラーシステム概要 |
| **[Palette](./color/palette.md)** | 50-900スケール |
| **[Semantic Colors](./color/semantic-colors.md)** | Success/Error等 |
| **[Brand Colors](./color/brand-colors.md)** | ブランドカラー |
| **[Neutral Colors](./color/neutral-colors.md)** | グレースケール |
| **[Color Usage](./color/color-usage.md)** | 実際の使い方 |

### 🎬 Motion（モーション）- 2ファイル

| ドキュメント | 概要 |
|------------|------|
| **[Animation](./motion/animation.md)** | アニメーション原則・イージング |
| **[Transitions](./motion/transitions.md)** | ページ遷移・状態遷移 |

### 🔧 Patterns（パターン）- 4ファイル

| ドキュメント | 概要 |
|------------|------|
| **[Atomic Design](./patterns/atomic-design-implementation.md)** | コンポーネント階層 |
| **[Forms](./patterns/forms.md)** | フォーム設計 |
| **[Navigation](./patterns/navigation.md)** | 6つのナビゲーションパターン |
| **[Data Display](./patterns/data-display.md)** | テーブル・リスト・カード |

### 📱 Platform（プラットフォーム）- 6ファイル

| カテゴリ | ドキュメント | 概要 |
|---------|------------|------|
| **Web** | [Browser Support](./platform/web/browser-support.md) | ブラウザサポート方針 |
| | [Performance](./platform/web/performance.md) | Core Web Vitals |
| | [SEO](./platform/web/seo.md) | 検索エンジン最適化 |
| **Mobile** | [iOS](./platform/mobile/ios.md) | iOS固有の考慮 |
| | [Android](./platform/mobile/android.md) | Material Design |
| | [Native Patterns](./platform/mobile/native-patterns.md) | iOS vs Android比較 |

---

## 🔍 ユースケース別ガイド

### 新しいコンポーネントを作る

**Button**:
1. [Button Priority](./interaction/button/priority.md) → どの種類のボタンか決める
2. [Action Placement](./interaction/button/placement.md) → 配置を決める
3. [Interactive States](./interaction/states/interactive-states.md) → hover/focus/activeを実装
4. [Keyboard Navigation](./foundation/accessibility/keyboard-navigation.md) → Tab操作対応
5. [Touch Targets](./foundation/accessibility/touch-targets.md) → 44px以上を確保

**Form**:
1. [Forms](./patterns/forms.md) → 全体設計
2. [Inline Validation](./interaction/feedback/inline-validation.md) → バリデーション
3. [Button Placement](./interaction/button/placement.md) → 送信ボタン配置
4. [Error Messages](./content/writing/error-messages.md) → エラー文言

**Modal**:
1. [Focus Management](./foundation/accessibility/focus-management.md) → フォーカストラップ
2. [Button Placement](./interaction/button/placement.md) → ボタン配置
3. [Transitions](./motion/transitions.md) → 開閉アニメーション
4. [Keyboard Navigation](./foundation/accessibility/keyboard-navigation.md) → Escで閉じる

### デザインを改善する

**読みやすくしたい**:
- [Readability](./content/typography/readability.md) → 行長・段落間隔
- [Hierarchy](./foundation/hierarchy.md) → 視覚的優先度
- [Color Contrast](./foundation/accessibility/color-contrast.md) → コントラスト比

**使いやすくしたい**:
- [Touch Targets](./foundation/accessibility/touch-targets.md) → タップ領域
- [Feedback Overview](./interaction/feedback/overview.md) → フィードバック
- [Error Messages](./content/writing/error-messages.md) → ユーザーを責めない文言

**速くしたい**:
- [Performance](./platform/web/performance.md) → Core Web Vitals
- [Imagery: Quality](./content/imagery/quality-optimization.md) → 画像最適化

---

## 💡 ドキュメントの読み方

### 効率的な学習方法

1. **overview.md から始める**  
   各カテゴリには overview.md があります。まずこれで全体像を把握。

2. **必要なトピックだけ読む**  
   62ファイルすべてを読む必要はありません。今必要なものだけでOK。

3. **関連ドキュメントを辿る**  
   各ファイルの「関連ドキュメント」セクションで関連原則を発見。

4. **チェックリストで確認**  
   各ファイルの最後にチェックリストがあります。実装時に活用。

### 各ドキュメントの構成

すべてのドキュメントは統一された構成になっています：

```
1. メタ情報（カテゴリ・適用範囲・ステータス・最終更新）
2. 原則の定義（一文で要約）
3. なぜ必要か / 背景
4. 詳細説明（✅/❌ の具体例付き）
5. チェックリスト
6. 関連ドキュメント
7. バージョン履歴
```

---

## 🤝 ドキュメント管理

### メンテナンス向けドキュメント

- **[MASTER_PLAN.md](./MASTER_PLAN.md)** - 全体設計図・作成ルール・優先順位（482行）
- **[IDEAL_STRUCTURE.md](./IDEAL_STRUCTURE.md)** - 理想的なドキュメント構造・命名規則

新しいドキュメントを作成する際は、必ずこれらを参照してください。

---

## 📖 参考リソース

### 外部ガイドライン

- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/) - アクセシビリティ
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/) - ARIA実装パターン
- [Material Design 3](https://m3.material.io/) - Googleのデザインシステム
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) - Appleのガイドライン

### ツール

- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - パフォーマンス・アクセシビリティ監査
- [axe DevTools](https://www.deque.com/axe/devtools/) - アクセシビリティチェック
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) - コントラスト比チェック
- [Can I Use](https://caniuse.com/) - ブラウザ対応確認

---

## 📊 システム統計

- **総ドキュメント数**: 62ファイル（原則） + 3ファイル（管理）
- **カテゴリ数**: 8（Foundation, Layout, Interaction, Content, Color, Motion, Patterns, Platform）
- **総行数**: 約15,000行
- **完成度**: Phase 1〜4 完了（実用レベル）
- **最終更新**: 2026年2月19日

---

## 🗺️ 次に読むべきドキュメント

あなたの状況に応じて：

| 状況 | 推奨ドキュメント |
|------|----------------|
| **全体を理解したい** | [MASTER_PLAN.md](./MASTER_PLAN.md) |
| **すぐにコンポーネントを作りたい** | [Atomic Design](./patterns/atomic-design-implementation.md) |
| **アクセシビリティを学びたい** | [Accessibility Overview](./foundation/accessibility/overview.md) |
| **フォームを作りたい** | [Forms](./patterns/forms.md) |
| **パフォーマンスを改善したい** | [Performance](./platform/web/performance.md) |
| **モバイル対応したい** | [iOS](./platform/mobile/ios.md) / [Android](./platform/mobile/android.md) |

---

**デザインシステムは、より良いユーザー体験を、より速く、より一貫して作るためのツールです。**  
**まずは必要な部分から始めて、徐々に理解を深めていきましょう！**
