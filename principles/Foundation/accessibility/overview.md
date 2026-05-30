# アクセシビリティ概要

## メタ情報
- カテゴリ: 基盤原則
- 適用範囲: 全階層（Atom〜Page）
- ステータス: Approved
- 最終更新: 2024-01-15

## 原則の定義

**すべてのユーザーが、能力や環境に関わらず、等しく情報にアクセスし、機能を利用できるようにする**

アクセシビリティは「特定のユーザーへの配慮」ではなく、すべてのユーザーにとってより良い体験を提供するための基盤です。

## なぜアクセシビリティが重要か

### 影響を受けるユーザー

- WHO推計で約15%が何らかの障害を持つ
- 一時的な障害（怪我、疲労、環境制約）を含めるとさらに多い
- 高齢ユーザーの増加

### もたらす価値

- **法的コンプライアンス**: 多くの国で法的要件
- **ユーザーベースの拡大**: より多くのユーザーがサービスを利用可能
- **SEO向上**: スクリーンリーダー対応はクローラビリティ向上
- **コード品質向上**: セマンティックなHTMLは保守性を高める
- **ユニバーサルな改善**: すべてのユーザーに利益をもたらす

## WCAG 2.1の4つの原則（POUR）

1. **Perceivable（知覚可能）**: 情報を知覚できる方法で提示
2. **Operable（操作可能）**: インターフェースを操作できる
3. **Understandable（理解可能）**: 情報と操作方法が理解できる
4. **Robust（堅牢）**: 支援技術を含む様々な技術で解釈できる

### 適合レベル

- **Level A**: 最低限の要件
- **Level AA**: 推奨レベル（本デザインシステムの目標）
- **Level AAA**: 最高レベル（可能な限り達成）

## この章のドキュメント

### [1. Keyboard Navigation](./keyboard-navigation.md)
キーボードのみでの操作。フォーカス順序、ショートカット、フォーカストラップ。

### [2. Screen Readers](./screen-readers.md)
スクリーンリーダー対応。ARIA属性、セマンティックHTML、ランドマーク。

### [3. Color Contrast](./color-contrast.md)
色のコントラスト比。WCAG基準、テキストと背景、状態の表現。

### [4. Focus Management](./focus-management.md)
フォーカスの適切な管理。インジケーター、順序、動的コンテンツ。

### [5. Touch Targets](./touch-targets.md)
タッチターゲットのサイズ。最小サイズ、間隔、モバイル対応。

### [6. Testing](./testing.md)
アクセシビリティテスト。自動テスト、手動テスト、支援技術。

## 推奨読書順序

### 初めて学ぶ
1. 概要（このページ）
2. keyboard-navigation.md
3. screen-readers.md
4. color-contrast.md

### コンポーネント別

**Button**: keyboard-navigation, touch-targets, focus-management  
**Modal**: keyboard-navigation, focus-management, screen-readers  
**Form**: keyboard-navigation, screen-readers, focus-management

## 関連原則

- [Typography Hierarchy](../../content/typography/hierarchy.md)
- [Color](../../color/overview.md)
- [Button Priority](../../interaction/button/priority.md)

## バージョン履歴

| 日付 | バージョン | 変更内容 | 変更理由 |
|------|-----------|----------|----------|
| 2024-01-15 | 1.0.0 | 初版作成 | トピック別の理解促進 |
