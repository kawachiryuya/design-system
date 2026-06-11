---
description: design-system の指定コンポーネントを AI 可読性高く強化する（discriminated union / JSDoc / @example / 利用箇所追従）
argument-hint: "<ComponentName>"
---

# Component Strengthen — Phase 2 / 施策 B 実行手順

ユーザーが `/strengthen-component <ComponentName>` で呼び出した時、または「Input を強化して」「Card をショーケース化」「次のコンポーネントに同パターン適用」等と発話した時に実行する。

design-system リポ内の対象コンポーネントを **AI が型補完で正しく扱える形** に変換する。Button をショーケースに、同パターンを残コンポーネントへ展開する目的。

**前提**: `git rev-parse --show-toplevel` でリポジトリルートを特定し、以降のパスはすべてルート相対で扱う。design-system リポジトリでなければ (package.json の `name` が `@kawachiryuya/design-system` でなければ) 中断してユーザーに確認する。
**親 Issue**: kawachiryuya/ai-management#34

---

## 手順

### Step 1: 対象コンポーネントの所在確認

`<ComponentName>` を引数または発話から抽出。`components/primitives/<Name>/` か `components/composites/<Name>/` のどちらに存在するか `ls` で確認。両方になければユーザーにスペル確認。

### Step 2: 現状読み込み

以下 3 ファイルを `Read` で取得:

- `components/{primitives|composites}/<Name>/<Name>.tsx` — 実装
- `components/{primitives|composites}/<Name>/<Name>.stories.tsx` — Story
- `components/{primitives|composites}/<Name>/index.ts` — Export

加えて、リポ全体での利用箇所を確認:

```bash
grep -rln "from '.*/<Name>'" --include="*.tsx" --include="*.ts" | grep -v node_modules
```

### Step 3: 改善ポイントの分析

以下 4 観点で **書き出してから着手**（user に確認は取らない、AI が判断）。

#### a. Discriminated union 化候補
「**条件付きで必須/不可** になる Props があるか？」を見る:

- `iconOnly: true` のとき icon 必須・children 不可（Button の例）
- `external: true` のとき rel 必須化（Link の典型）
- `controlled` vs `uncontrolled` で `value`/`defaultValue` 必須切替（Input 系）
- `multiple: true` で配列を返す（Select の例）
- `as` prop で要素切替（Typography）

候補が **無い** なら discriminated union 化はスキップ。素直な interface のまま JSDoc 強化のみ進める（過剰設計を避ける）。

#### b. JSDoc 充実度
各 Props に:
- 役割・用途の 1 行説明
- `@default` の明示（デフォルト値があれば必須）
- 推奨/非推奨の使い方ヒント

#### c. `@example` 追加
コンポーネント本体（または Props 型）の JSDoc に **3〜5 件** の `@example`:
- 最も典型的な使い方
- バリアント別の使い方
- アイコン/状態付き
- フォーム/特殊状態
- a11y で必要な属性付与パターン

#### d. 関連型 export
Variant / Size / 用途別 enum 等の型を index.ts で外部公開:

```ts
export type { ComponentProps, ComponentVariant, ComponentSize } from './Component';
```

### Step 4: Discriminated union 設計（必要時のみ）

Button の実装が参照点。基本構造:

```ts
interface ComponentBaseProps {
  // 共通 Props（variant, size, など）
}

interface ComponentVariantAProps extends ComponentBaseProps {
  discriminator: true;       // 判別子
  requiredFieldA: string;    // この分岐で必須
  optionalFieldB?: ...;      // 任意
  forbiddenFieldC?: never;   // この分岐では使えない
}

interface ComponentVariantBProps extends ComponentBaseProps {
  discriminator?: false;     // 判別子（デフォルト）
  requiredFieldD: string;
}

export type ComponentProps =
  (ComponentVariantAProps | ComponentVariantBProps) &
  Omit<React.HTMLAttributes<HTMLElement>, '衝突するキー'>;
```

実装側は内部 flexible 型でキャストして destructure（Button.tsx の `_InternalButtonProps` パターン）。

### Step 5: JSDoc 追加

- 各 Props に `/** ... */` 形式で説明追加
- `@default` を明示
- ボトムアップで「これだけ書けば人間が動かせる」を意識

### Step 6: `@example` 3〜5 件追加

Props 型または Component 本体の JSDoc に追加:

```ts
/**
 * @example
 *   <Component variant="primary">基本</Component>
 *
 * @example
 *   <Component variant="secondary" size="small" icon={<Icon />}>
 *     アイコン付き
 *   </Component>
 *
 * @example
 *   // 特殊ケース（a11y 強制等）
 *   <Component specialFlag aria-label="..." />
 */
```

### Step 7: index.ts に型 export 追加

```ts
export { Component } from './Component';
export type { ComponentProps, ComponentVariant, ComponentSize } from './Component';
```

### Step 8: TS check

```bash
npx tsc -p . --noEmit  # design-system root
cd demo && npx tsc --noEmit  # demo
cd .. # back to root
```

エラーが出る場合の典型:
- 既存 stories が新型に違反 → Story を修正
- demo の使用箇所が新型に違反 → demo を修正（**TS が API 改善を強制する好機**）
- discriminated union の implementation 側で destructure 失敗 → `_Internal<Name>Props` で flexible 型を作って `as` キャスト

### Step 9: 既存利用箇所の追従

Step 2 の grep 結果から得た利用箇所 + Step 8 の TS エラー指摘箇所を新 API に移行。

「TS が示してくれた違反は API 改善のチャンス」として、ためらわず直す。Button 時の demo 3 箇所（Header / ReservationDetailPage / SearchPage）が好例。

### Step 10: ビルド検証

```bash
npm run build-storybook  # design-system root
cd demo && npm run build  # demo
cd ..
```

両方成功すれば OK。失敗時は出力ログを精査して原因特定。

### Step 11: commit & push

main 直 commit。メッセージ書式:

```
feat(components): <Name> を強化（discriminated union / JSDoc / @example）

## 変更内容
- <Name>.tsx: Props を <discriminator> で分岐する union 型に
- index.ts: <Name>Variant / <Name>Size 型を export 追加
- 関連利用箇所（demo 等）を新 API に移行: <ファイル一覧>

## 確認
- npx tsc --noEmit (root + demo)
- npm run build-storybook
- demo npm run build

親 Issue: kawachiryuya/ai-management#34

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

### Step 12: 進捗コメント

`gh issue comment 34 --repo kawachiryuya/ai-management` で短く進捗追記:

- 完了したコンポーネント名
- 主要な改善点（discriminator / @example 件数等）
- 残数の可視化（例: 「Primitives 7/11 完了、残 4」）

---

## ガイドライン

- **過剰設計を避ける**: discriminated union 化が不要な単純コンポーネント（Divider / Skeleton / Spinner 等）は JSDoc 強化のみで OK
- **既存挙動を変えない**: 型レベルの強化のみ。runtime の動作変更は別 PR
- **stories は通常そのまま動く**: 既存 stories は基本パターンを使用しているため、union 化しても影響しないことが多い
- **demo の利用箇所が壊れたら歓迎**: API クリーンアップの好機、迷わず直す
- **1 PR 1 コンポーネント**: 細切れ commit で進捗が見える化

## 制約

- `git rev-parse --show-toplevel` でルートを特定できない / package.json の `name` が `@kawachiryuya/design-system` でない場合は中断してユーザーに確認
- `tokens/build/` が無い場合は `npm install` または `npm run tokens:build` を先に実行
- 同じコンポーネントが既にショーケース化済みなら、追加で改善余地があるか分析した上でユーザーに確認

## 参考: Button のショーケース化パターン（実装済み参照）

- `components/primitives/Button/Button.tsx` — discriminated union 実装
- `components/primitives/Button/index.ts` — 型 export 追加
- 関連 commit: [fe726a0](https://github.com/kawachiryuya/design-system/commit/fe726a0)

---

## 出力

- 改善 commit のハッシュ
- 進捗コメントへのリンク
- 変更したファイル一覧
- 残コンポーネント数（簡易表）
