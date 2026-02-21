# デザインシステム 理想的ドキュメント構造

## 設計思想

### 原則
1. **1ドキュメント = 1コンセプト**: 1つのドキュメントは1つの明確なコンセプトのみを扱う
2. **適切な粒度**: 大きすぎず（読むのが大変）、小さすぎず（分散しすぎ）
3. **明確な階層**: 基礎→応用の順に学べる
4. **相互参照**: 関連ドキュメントへの適切なリンク
5. **実装との分離**: 原則（なぜ・何を）とコンポーネント（どうやって）を明確に分離

### ドキュメントサイズの目安
- **小**: 100-200行（1つの具体的なルール）
- **中**: 200-400行（1つの体系的な原則）
- **大**: 400-600行（複数の関連概念、ただし避けるべき）

### フォルダ vs 1ファイルの判断基準

**フォルダに分割する**:
- トピックが5つ以上で、それぞれが独立して読める
- 各トピックが100行以上になる
- overview.mdで全体像を示せる

**1ファイルにまとめる**:
- 200-400行程度に収まる
- トピックが密接に関連していて、分割すると逆に分かりにくい

---

## 📚 完全ドキュメント構造

### 🏗️ 1. Foundation（基盤原則）

すべての原則の基礎となる概念。

#### 1.1 Accessibility（アクセシビリティ）

```
foundation/accessibility/
├── overview.md              # アクセシビリティとは（WCAG概要）
├── keyboard-navigation.md   # キーボード操作・Tab順序
├── screen-readers.md        # スクリーンリーダー対応（ARIA）
├── color-contrast.md        # 色のコントラスト比
├── focus-management.md      # フォーカス管理・フォーカストラップ
├── touch-targets.md         # タッチターゲットサイズ（モバイル）
└── testing.md               # アクセシビリティテスト
```

**状態**: ✅ 完成（7ファイル）
**サイズ**: 各150-250行

#### 1.2 Consistency（一貫性）

```
foundation/consistency.md    # 一貫性の原則
```

**状態**: ✅ 完成
**サイズ**: 240行
**内容**: 視覚・機能・パターン・プラットフォーム慣習の4レベル

#### 1.3 Hierarchy（視覚的ヒエラルキー）

```
foundation/hierarchy.md      # 視覚的ヒエラルキーの原則
```

**状態**: ✅ 完成
**サイズ**: 290行
**内容**: サイズ・色・余白・位置・太さの5つの手段と組み合わせ方

#### 1.4 Responsiveness（レスポンシブ）

```
foundation/responsiveness.md # レスポンシブデザインの原則
```

**状態**: ⬜ 未作成
**サイズ**: 200-300行（目安）
**内容**: モバイルファースト思想、コンテンツ優先、タッチ対応
**依存**: grid.md, spacing.md

---

### 📐 2. Layout（レイアウト原則）

#### 2.1 Spacing（余白システム）

```
layout/spacing.md            # 余白システム（8pxベース）
```

**状態**: ✅ 完成（1ファイル）
**サイズ**: 431行（許容範囲。トピックが密接に関連しているため分割しない）

#### 2.2 Grid（グリッドシステム）

```
layout/grid.md               # グリッドシステム（12カラム・ブレークポイント）
```

**状態**: ✅ 完成（1ファイル）
**サイズ**: 270行
**内容**: 12カラム・ブレークポイント・ガターを1ファイルに統合

#### 2.3 Alignment（整列）

```
layout/alignment.md          # 整列の原則
```

**状態**: ⬜ 未作成
**サイズ**: 150-250行（目安）
**内容**: グリッドへの整列、視覚的整列 vs 光学的整列、左/中央/右の使い分け
**依存**: grid.md, spacing.md

---

### 🖱️ 3. Interaction（インタラクション原則）

#### 3.1 Button（ボタン）

```
interaction/button/
├── priority.md              # ボタン優先度（Primary/Secondary/Tertiary）
└── placement.md             # ボタン配置（横並び・縦並び・破壊的アクション）
```

**状態**: ✅ 完成（2ファイル）
**サイズ**: 各250-300行
**Note**: 破壊的アクションはplacement.mdに含めて済み。独立ファイル不要と判断。

#### 3.2 States（状態）

```
interaction/states/
├── overview.md              # 状態の概要・2つのカテゴリ
├── interactive-states.md    # hover, focus, active
├── status-states.md         # loading, error, success, disabled
└── state-transitions.md     # 状態遷移・トランジション時間
```

**状態**: ✅ 完成（4ファイル）
**サイズ**: 各150-250行

#### 3.3 Feedback（フィードバック）

```
interaction/feedback/
├── overview.md              # フィードバック概要
├── toast-notifications.md   # トースト通知
├── inline-validation.md     # インラインバリデーション
├── loading-indicators.md    # ローディングインジケーター
└── progress-indicators.md   # 進捗表示
```

**状態**: ⬜ 未作成
**サイズ**: 各150-200行
**依存**: color/, states/

#### 3.4 Gestures（ジェスチャー）

```
interaction/gestures/
├── overview.md              # ジェスチャー概要
├── tap.md                   # タップ
├── swipe.md                 # スワイプ
├── pinch-zoom.md            # ピンチ・ズーム
└── long-press.md            # 長押し
```

**状態**: ⬜ 未作成
**サイズ**: 各100-150行
**依存**: accessibility/touch-targets.md

---

### ✍️ 4. Content（コンテンツ原則）

#### 4.1 Typography（タイポグラフィ）

```
content/typography/
├── scale.md                 # スケール（サイズ・ウェイト・行間・字間）
├── hierarchy.md             # 階層（H1-H6, Body等の使い分け）
├── readability.md           # 可読性（行長・段落間隔）
└── font-families.md         # フォント選択・Webフォント
```

**状態**: ✅ 完成（4ファイル）
**サイズ**: 各250-300行
**Note**: overview.mdは未作成だが、各ファイルが独立して読めるため当面不要。

#### 4.2 Iconography（アイコン）

```
content/iconography/
├── overview.md              # アイコン概要・使用原則
├── sizes.md                 # サイズ定義
├── styles.md                # スタイル（outline, filled等）
└── semantic-icons.md        # 意味的アイコン（警告・成功等）
```

**状態**: ⬜ 未作成
**サイズ**: 各100-150行
**依存**: accessibility/screen-readers.md, color/semantic-colors.md

#### 4.3 Imagery（画像）

```
content/imagery/
├── overview.md              # 画像使用の原則
├── aspect-ratios.md         # アスペクト比
├── quality-optimization.md  # 品質と最適化
└── alt-text.md              # 代替テキスト
```

**状態**: ⬜ 未作成
**サイズ**: 各100-150行
**依存**: accessibility/screen-readers.md

#### 4.4 Writing（文章）

```
content/writing/
├── tone-voice.md            # トーンとボイス
├── microcopy.md             # マイクロコピー
└── error-messages.md        # エラーメッセージ
```

**状態**: ⬜ 未作成
**サイズ**: 各150-200行

---

### 🎨 5. Color（カラー原則）

```
color/
├── overview.md              # カラーシステム概要・分類説明
├── palette.md               # 50-900スケール定義・使い分け
├── semantic-colors.md       # セマンティックカラー（Success/Error/Warning/Info）
├── brand-colors.md          # ブランドカラー・Primaryカラー
├── neutral-colors.md        # ニュートラルカラー（グレースケール）
└── color-usage.md           # コンポーネント別の色使用ガイド
```

**状態**: ✅ 完成（6ファイル）
**サイズ**: 各100-200行
**Note**: コントラストはaccessibility/color-contrast.md、色覚異常はcolor-contrast.md内に含む。独立ファイル不要と判断。

---

### 🎬 6. Motion（モーション原則）

```
motion/
├── animation.md             # アニメーション（タイミング・イージング）
└── transitions.md           # トランジション（ページ遷移・状態変化・マイクロインタラクション）
```

**状態**: ⬜ 未作成
**サイズ**: 各200-300行
**Note**: state-transitions.mdで基礎は網羅済みのため、モーション全体の原則として2ファイルに集約。
**依存**: states/state-transitions.md, accessibility/

---

### 📱 7. Platform（プラットフォーム原則）

```
platform/
├── web/
│   ├── browser-support.md   # ブラウザサポート方針
│   ├── performance.md       # パフォーマンス
│   └── seo.md               # SEO考慮
└── mobile/
    ├── ios.md               # iOS固有の考慮
    ├── android.md           # Android固有の考慮
    └── native-patterns.md   # ネイティブパターン
```

**状態**: ⬜ 未作成
**サイズ**: 各150-250行
**Note**: responsive-designはfoundation/responsiveness.mdに統合。touch-targetsはaccessibility/touch-targets.mdに統合済み。

---

### 🔧 8. Patterns（パターン原則）

```
patterns/
├── atomic-design-implementation.md  # Atomic Design階層での実装パターン
├── forms.md                         # フォームパターン
├── navigation.md                    # ナビゲーションパターン
└── data-display.md                  # データ表示パターン（テーブル・リスト・カード）
```

**状態**: atomic-design-implementation.md のみ ✅ 完成
**サイズ**: 各200-300行
**Note**: 内容量を見てからフォルダ分割を判断。現時点では4ファイルフラット構成で開始。

---

## 📊 ディレクトリツリー（現在の実態）

```
principles/
├── README.md                          ✅
├── MASTER_PLAN.md                     ✅
├── IDEAL_STRUCTURE.md                 ✅（このファイル）
│
├── foundation/
│   ├── accessibility/
│   │   ├── overview.md                ✅
│   │   ├── keyboard-navigation.md     ✅
│   │   ├── screen-readers.md          ✅
│   │   ├── color-contrast.md          ✅
│   │   ├── focus-management.md        ✅
│   │   ├── touch-targets.md           ✅
│   │   └── testing.md                 ✅
│   ├── consistency.md                 ✅
│   ├── hierarchy.md                   ✅
│   └── responsiveness.md              ⬜
│
├── layout/
│   ├── spacing.md                     ✅
│   ├── grid.md                        ✅
│   └── alignment.md                   ⬜
│
├── interaction/
│   ├── button/
│   │   ├── priority.md                ✅
│   │   └── placement.md               ✅
│   ├── states/
│   │   ├── overview.md                ✅
│   │   ├── interactive-states.md      ✅
│   │   ├── status-states.md           ✅
│   │   └── state-transitions.md       ✅
│   ├── feedback/
│   │   ├── overview.md                ⬜
│   │   ├── toast-notifications.md     ⬜
│   │   ├── inline-validation.md       ⬜
│   │   ├── loading-indicators.md      ⬜
│   │   └── progress-indicators.md     ⬜
│   └── gestures/
│       ├── overview.md                ⬜
│       ├── tap.md                     ⬜
│       ├── swipe.md                   ⬜
│       ├── pinch-zoom.md              ⬜
│       └── long-press.md              ⬜
│
├── content/
│   ├── typography/
│   │   ├── scale.md                   ✅
│   │   ├── hierarchy.md               ✅
│   │   ├── readability.md             ✅
│   │   └── font-families.md           ✅
│   ├── iconography/
│   │   ├── overview.md                ⬜
│   │   ├── sizes.md                   ⬜
│   │   ├── styles.md                  ⬜
│   │   └── semantic-icons.md          ⬜
│   ├── imagery/
│   │   ├── overview.md                ⬜
│   │   ├── aspect-ratios.md           ⬜
│   │   ├── quality-optimization.md    ⬜
│   │   └── alt-text.md                ⬜
│   └── writing/
│       ├── tone-voice.md              ⬜
│       ├── microcopy.md               ⬜
│       └── error-messages.md          ⬜
│
├── color/
│   ├── overview.md                    ✅
│   ├── palette.md                     ✅
│   ├── semantic-colors.md             ✅
│   ├── brand-colors.md                ✅
│   ├── neutral-colors.md              ✅
│   └── color-usage.md                 ✅
│
├── motion/
│   ├── animation.md                   ⬜
│   └── transitions.md                 ⬜
│
├── platform/
│   ├── web/
│   │   ├── browser-support.md         ⬜
│   │   ├── performance.md             ⬜
│   │   └── seo.md                     ⬜
│   └── mobile/
│       ├── ios.md                     ⬜
│       ├── android.md                 ⬜
│       └── native-patterns.md         ⬜
│
└── patterns/
    ├── atomic-design-implementation.md ✅
    ├── forms.md                        ⬜
    ├── navigation.md                   ⬜
    └── data-display.md                 ⬜
```

**総ファイル数（予定）**: 約60ファイル
**完成済み**: 29ファイル
**未作成**: 約31ファイル

---

## 🎯 粒度の判断事例（実績ベース）

実際に作成したドキュメントから得た知見。

### フォルダ分割した（正解）

| カテゴリ | ファイル数 | 理由 |
|---------|-----------|------|
| accessibility/ | 7 | トピックが独立、各150-200行で適切 |
| states/ | 4 | インタラクティブとステータスで概念が分かれる |
| color/ | 6 | パレット・意味・用途がそれぞれ独立したトピック |

### 1ファイルにした（正解）

| ドキュメント | 行数 | 理由 |
|------------|------|------|
| spacing.md | 431行 | スケール・使い方・レスポンシブが密接に関連 |
| grid.md | 270行 | カラム・ブレークポイント・ガターは一体で理解すべき |
| consistency.md | 240行 | 単一の統合概念 |
| hierarchy.md | 290行 | 5つの手段を組み合わせて語るべき |

---

## 📝 新規ドキュメント作成時のチェックリスト

1. **MASTER_PLANを確認**: 優先度・依存関係を確認
2. **このファイルを確認**: 想定ファイル構成・サイズ・内容を確認
3. **依存先ドキュメントを読む**: 重複しないようにスコープを確認
4. **作成後にMASTER_PLANを更新**: 状態を⬜→✅に変更
5. **このファイルの状態も更新**: ⬜→✅に変更

---

## 🔄 更新ルール

- **MASTER_PLANが正**: 実際の作成状況・構成はMASTER_PLANで管理
- **このファイルの役割**: 各ファイルの想定構成・サイズ・内容の設計図
- **食い違いが生じたら**: 実態に合わせてこのファイルを更新する
- **更新タイミング**: 新規ファイル作成時・構成変更時・粒度の判断が変わった時
