# SearchBar コンポーネント

**Atomic Design**: Molecule  
**組み合わせ**: SearchIcon + Input[type=search] + ClearButton（+ LoadingSpinner）

---

## 概要

検索用途に特化した入力フィールド。検索アイコン・クリアボタン・ローディング状態を一体化し、キーボード操作（Enter で検索実行・Escape でクリア）をサポートする。

---

## Props

| Prop | 型 | デフォルト | 説明 |
|------|----|-----------|------|
| `value` | `string` | 必須 | 入力値（制御コンポーネント） |
| `onChange` | `(value: string) => void` | 必須 | 値変更ハンドラー |
| `onSearch` | `(value: string) => void` | — | Enter 押下時のコールバック |
| `onClear` | `() => void` | — | クリア時のコールバック（省略時は onChange('') を実行） |
| `placeholder` | `string` | `'検索...'` | プレースホルダー |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | サイズ |
| `fullWidth` | `boolean` | `false` | 全幅 |
| `isLoading` | `boolean` | `false` | ローディング中（スピナー表示） |
| `disabled` | `boolean` | `false` | 無効状態 |
| `ariaLabel` | `string` | `'検索'` | スクリーンリーダー用ラベル |

---

## キーボード操作

| キー | 動作 |
|-----|------|
| `Enter` | `onSearch` を実行 |
| `Escape` | 値をクリアしてフォーカスを外す |

---

## 使用例

```tsx
// 基本
const [query, setQuery] = useState('');
<SearchBar
  value={query}
  onChange={setQuery}
  onSearch={(v) => fetchResults(v)}
  placeholder="記事を検索..."
/>

// ヘッダーに全幅で配置
<SearchBar value={query} onChange={setQuery} fullWidth size="small" />

// テーブルフィルター（リアルタイム）
<SearchBar value={filter} onChange={setFilter} size="small" />

// 検索中にスピナーを表示
<SearchBar value={query} onChange={setQuery} isLoading={isPending} />
```

---

## 設計方針

- **制御コンポーネント**: `value` / `onChange` は必須（非制御は非対応）
- **クリアボタン**: 値あり・非disabled 時のみ表示（UX のシンプルさを維持）
- **ローディングとクリア**: 同時には表示しない（ローディングが優先）
- `type="search"` + `role="searchbox"` で検索フィールドをセマンティックに表現

---

## アクセシビリティ

- `role="searchbox"` + `aria-label` でスクリーンリーダーに用途を伝達
- クリアボタンに `aria-label="検索をクリア"` を付与
- フォーカスリング: `focus:ring-2 focus:ring-primary-200`
- Escape キーでクリア後、フォーカスを input に戻す

参照: `principles/patterns/forms.md`
