# ステータス状態

## メタ情報
- カテゴリ: インタラクション原則 > States
- 適用範囲: Atom〜Organism
- ステータス: Approved
- 最終更新: 2024-01-15

## 原則の定義

**システムやコンテンツの状態を明確に表現し、ユーザーに現在の状況を伝える**

## 主要なステータス状態

### 1. Loading（ローディング）

**定義**: データ取得中、処理実行中

**視覚的特徴**:
- スピナー、プログレスバー
- 薄い背景、半透明オーバーレイ
- アニメーション

**ARIA**:
```html
<button aria-busy="true" disabled>
  <Spinner /> 処理中...
</button>
```

**パターン**:
- インラインローディング: 小さなスピナー
- オーバーレイ: 全画面または部分的
- スケルトン: コンテンツの形を示す

### 2. Success（成功）

**定義**: 操作が成功裏に完了

**視覚的特徴**:
- 緑色（成功を示すセマンティックカラー）
- チェックアイコン
- 一時的なトースト通知

**期間**: 2-4秒で自動消去、または手動で閉じる

**ARIA**:
```html
<div role="status" aria-live="polite">
  <CheckIcon /> 保存しました
</div>
```

### 3. Error（エラー）

**定義**: 操作が失敗、または入力が不正

**視覚的特徴**:
- 赤色（エラーを示すセマンティックカラー）
- エラーアイコン
- 具体的なエラーメッセージ

**重要**: 色だけでなく、アイコンとテキストも使用

**ARIA**:
```html
<div role="alert" aria-live="assertive">
  <ErrorIcon /> メールアドレスの形式が正しくありません
</div>

<input
  aria-invalid="true"
  aria-describedby="error-message"
/>
<span id="error-message">必須項目です</span>
```

### 4. Warning（警告）

**定義**: 注意が必要、潜在的な問題

**視覚的特徴**:
- 黄色/オレンジ（警告を示すセマンティックカラー）
- 警告アイコン
- 説明テキスト

### 5. Info（情報）

**定義**: 補足情報、ヒント

**視覚的特徴**:
- 青色（情報を示すセマンティックカラー）
- 情報アイコン
- 説明テキスト

### 6. Disabled（無効）

**定義**: 操作不可能な状態

**視覚的特徴**:
- 低コントラスト（グレーアウト）
- カーソル: not-allowed
- 透明度: 0.5-0.6

**いつ使うか**:
- 前提条件が満たされていない
- 権限がない
- 一時的に利用不可

**ARIA**:
```html
<button disabled aria-disabled="true">
  保存
</button>
```

**注意**: Disabledボタンはフォーカスできないため、理由を説明するツールチップは表示できない。代わりに、近くに説明テキストを配置。

## Empty State（空状態）

**定義**: データがない、初期状態

**視覚的特徴**:
- イラスト、アイコン
- 説明テキスト
- 行動を促すCTA

**例**:
```
[EmptyBoxIcon]
まだ項目がありません
最初の項目を追加しましょう

[+ 追加する]
```

## 色とアイコンの対応

| 状態 | 色 | アイコン | 用途 |
|------|-----|---------|------|
| Success | 緑 | ✓ | 成功メッセージ |
| Error | 赤 | ✕ | エラーメッセージ |
| Warning | 黄/橙 | ⚠ | 警告 |
| Info | 青 | ℹ | 情報 |
| Loading | - | ⟳ | 処理中 |

→ 詳細は [Color Meaning](../../color/color-meaning.md)

## 実装例

### Button with Loading

```typescript
<button disabled={isLoading}>
  {isLoading ? (
    <>
      <Spinner className="mr-2" />
      処理中...
    </>
  ) : (
    '送信'
  )}
</button>
```

### Form Field with Error

```typescript
<div>
  <input
    className={error ? 'border-red-600' : 'border-gray-300'}
    aria-invalid={!!error}
    aria-describedby={error ? 'error-msg' : undefined}
  />
  {error && (
    <span id="error-msg" className="text-red-600">
      <ErrorIcon /> {error}
    </span>
  )}
</div>
```

## チェックリスト

- [ ] Loading中はdisabled
- [ ] Error時は具体的なメッセージ
- [ ] Success通知は一時的
- [ ] Disabled時は理由を説明
- [ ] 色だけでなくアイコンも使用
- [ ] 適切なARIA属性

## 関連ドキュメント

- [Overview](./overview.md)
- [Interactive States](./interactive-states.md)
- [Color Meaning](../../color/color-meaning.md)

## バージョン履歴

| 日付 | バージョン | 変更内容 | 変更理由 |
|------|-----------|----------|----------|
| 2024-01-15 | 1.0.0 | 初版作成 | states.mdから分離 |
