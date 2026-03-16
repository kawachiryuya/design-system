# GunMaaS リブランディング — Claude Code 実装指示書

## 概要

このドキュメントは、GunMaaSリブランディングプロジェクトのプロトタイプをデザインシステムベースの実装に移植するための指示書です。

## 参照ファイル

### プロトタイプ（UIの参照実装）
- `GunMaaS_unified_prototype.jsx` — 全4タブ（ホーム・検索・チケット・マイページ）＋購入フロー＋行き先詳細を含む統合プロトタイプ

### 設計判断
- `GunMaaS_design_decisions.md` — 設計判断の経緯と理由

### デザインシステム（トークン・コンポーネント）
- リポジトリ: https://github.com/kawachiryuya/design-system
- トークン: `tokens/typography.json`, `tokens/spacing.json`, `tokens/radius.json`, `tokens/colors.json`, `tokens/shadows.json`
- Tailwind設定: `tailwind.config.js`
- コンポーネント: `components/primitives/Button/`, `components/composites/Card/`, `Tabs/`, `SearchBar/`, `Badge/`

---

## 実装方針

### アーキテクチャ
- Vite + React + TypeScript
- Storybook でコンポーネント管理
- パスエイリアス `@/` 使用

### カラートークンのマッピング

プロトタイプのカラー定数 → デザインシステムのsemantic colors構造に合わせる。
**GunMaaS独自のカラーパレットは維持**しつつ、デザインシステムのトークン構造（semantic naming）に従う。

```
プロトタイプ C.primary (#2D6A4F)  → semantic: color-primary
プロトタイプ C.accent (#E07A5F)   → semantic: color-accent
プロトタイプ C.text (#1C2833)     → semantic: color-text-primary
プロトタイプ C.textMid (#4A5568)  → semantic: color-text-secondary
プロトタイプ C.gray (#94A3B8)     → semantic: color-text-tertiary
プロトタイプ C.bg (#F7FAF8)       → semantic: color-bg-primary
プロトタイプ C.border (#E2EDE6)   → semantic: color-border-default
プロトタイプ C.ticketBg (#F0FAF4) → semantic: color-bg-success-subtle
プロトタイプ C.sand (#F2CC8F)     → semantic: color-bg-warning
プロトタイプ C.sandLight (#FDF6E8) → semantic: color-bg-warning-subtle
```

### スペーシング
プロトタイプでは px 直書き。デザインシステムの 4px ベーストークンに置き換え。
- `padding: "12px 16px"` → `p-3 px-4` (spacing-3, spacing-4)
- `gap: 8` → `gap-2` (spacing-2)
- `borderRadius: 14` → `rounded-md` (radius-md: 14px)

### タイポグラフィ
プロトタイプでは Noto Sans JP。デザインシステムのトークン（Zen Maru Gothic + DM Sans）に置き換え。
- ヒーロー: fontSize 24-28 → Display (30px/w800)
- セクションタイトル: fontSize 13-15 → Body Large (16px/w700)
- 本文: fontSize 12-14 → Body (14px/w400)
- キャプション: fontSize 10-11 → Caption (12px/w400)

---

## 画面別の実装ノート

### ホームタブ
**ファイル構成案:**
```
pages/Home/
  index.tsx          — ホームタブのルートコンポーネント
  MapView.tsx        — SVGマップ（将来的にMapbox等に置き換え）
  SearchBar.tsx      — 「どこに行く？」入力＋サジェストパネル
  CategoryChips.tsx  — フィルタリングチップス
  BottomSheet.tsx    — ドラッグ可能なボトムシート
  PlacePopup.tsx     — ピンタップ時のポップアップカード
  ZonePopup.tsx      — デマンドゾーンタップ時のポップアップ
  LayerControl.tsx   — レイヤーON/OFFパネル
```

**注意点:**
- ボトムシートは3段階スナップ（最小52px / 中間320px / 最大520px）
- マップは現在SVGダミー。将来的にMapbox GL JSに置き換える想定で、コンポーネントを抽象化しておく
- 検索バーのサジェストパネルは、行き先オブジェクトのデータから検索。タップで検索タブに遷移（目的地プリセット）

### 検索タブ
**ファイル構成案:**
```
pages/Search/
  index.tsx            — 検索タブのルート
  SearchInput.tsx      — 出発地・目的地・日時のフル入力フォーム
  SortTabs.tsx         — 早/安/楽ソートタブ
  RouteCard.tsx        — ルート候補カード（チケット情報込み）
  RouteDetail.tsx      — ルート詳細ボトムシート
  Timeline.tsx         — 経路タイムライン
  TicketSuggestion.tsx — チケット提案セクション
  ContextCard.tsx      — デマンド交通コンテキストカード
```

**注意点:**
- 出発地のデフォルトは「現在地」（Geolocation API使用）
- 出発地・目的地のアイコンはピン型SVG（出発=プライマリ色、目的地=アクセント色）
- ルート詳細はボトムシートで開く。購入ボタンタップ時はシートを閉じてから購入フローを全画面で開く
- デモ用のパターン切替（P1/P2/P3）は開発時のみ。本番では実際の経路検索APIに接続

### 購入フロー
**ファイル構成案:**
```
pages/Purchase/
  index.tsx              — 購入フローのルート（ステップ管理）
  TicketOverview.tsx     — ステップ1: チケット概要
  AuthScreen.tsx         — ステップ2: ログイン/新規登録
  ConfirmScreen.tsx      — ステップ3: 購入確認
  CompleteScreen.tsx     — ステップ4: 完了
  MynumberInline.tsx     — マイナンバーカードインライン登録UI
  PaymentMethodSelect.tsx — 決済方法選択
  ICCardSelect.tsx       — 利用ICカード選択
```

**注意点:**
- 全画面ページとして表示（ボトムシートやモーダルではない）
- ヘッダーに「← 戻る」「チケット購入」タイトル「✕」閉じる
- マイナンバー割引バナーは条件付き表示（未登録＋割引対象チケットの場合のみ）
- 完了画面の「ルート詳細に戻る」→ 購入フロー閉じ + ルート詳細ボトムシート再表示
- 完了画面の「チケットを確認する」→ チケットタブに遷移

### チケットタブ
**ファイル構成案:**
```
pages/Ticket/
  index.tsx          — チケットタブのルート
  TicketCard.tsx     — チケットカード（利用中/過去で表示分岐）
  TicketDisplay.tsx  — チケット提示画面（QRコード等）
```

**注意点:**
- 「利用中 / 過去」のサブタブ切替
- 利用中カードに「チケットを表示する」＋「取り消し・払い戻し」
- 過去カードに「もう一度購入」＋「領収書」
- チケットカードのデザイン: ヘッダーバンド（路線色）＋パンチ穴切り取り線＋詳細

### マイページ
**ファイル構成案:**
```
pages/MyPage/
  index.tsx              — マイページのルート
  ProfileCard.tsx        — 会員QR＋名前＋ID
  SetupSection.tsx       — オンボーディングセクション
  StepCard.tsx           — 展開可能なステップカード
  ChildDemandSection.tsx — こどもデマンド登録
```

**注意点:**
- 会員QRコードは100x100pxの角丸カード内に表示
- ステップカードは展開時にインラインで関連操作を表示（画面遷移なし）
- セットアップヘッダーは完了状態で文言が変化（「GunMaaSをもっと便利に使おう」→「登録済みの情報」）
- 設定セクションは不要（Webサービスのため）

### 行き先詳細ページ
**ファイル構成案:**
```
pages/PlaceDetail/
  index.tsx          — 行き先詳細のルート
  HeroSection.tsx    — ヒーロー＋CTA
  InfoTab.tsx        — 基本情報（住所・電話・営業時間）
  TicketsTab.tsx     — チケット＋予約・手配
  NearbyTab.tsx      — 周辺スポット
```

**注意点:**
- CTA「この行き先へ経路検索」はヒーロー（グリーン背景）内に配置。白背景ボタン。
- 3タブ（基本情報 / チケット / 周辺）
- 基本情報にアクセス情報は含めない（経路検索で調べる内容のため）
- 予約・手配情報はチケットタブ内に統合

---

## データモデル（参考）

### 行き先オブジェクト (Place)
```typescript
interface Place {
  id: string;
  name: string;
  emoji: string;
  category: "観光" | "駅・バス停" | "施設";
  area: string;
  description: string;
  coordinates: { lat: number; lng: number };
  info: {
    address: string;
    phone: string;
    hours: string;
  };
  tickets: Ticket[];
  booking: BookingOption[];
  nearby: NearbySpot[];
}
```

### ルート (Route)
```typescript
interface Route {
  id: string;
  departure: string;
  arrival: string;
  duration: string;
  cost: string;
  transfers: number;
  badges: Array<{ text: string; color: string }>;
  segments: Segment[];
  tickets: TicketSuggestion[];
  bestTicket: { name: string; price: string; note: string } | null;
  discount?: { condition: string; detail: string };
}
```

### デマンドゾーン (DemandZone)
```typescript
interface DemandZone {
  id: string;
  name: string;
  area: string;
  fare: string;
  booking: string;
  geometry: GeoJSON; // 将来的にGTFS-Flexと連携
}
```

---

## 実装優先順位

1. **ホームタブ** — マップ＋検索バー＋チップス＋ボトムシート（アプリの第一印象）
2. **検索タブ** — 経路検索＋ルート詳細＋チケット提案（コアの利用体験）
3. **購入フロー** — 4ステップ（コンバージョン直結）
4. **行き先詳細ページ** — 3タブ（OOUIの核心）
5. **チケットタブ** — 利用中/過去の切替（購入後の体験）
6. **マイページ** — オンボーディング＋アカウント管理（設定系）

---

## プロトタイプの制限事項（本実装で対応が必要なもの）

- マップはSVGダミー → 実際の地図APIに置き換え
- 経路データはハードコード → 経路検索APIに接続
- 認証はダミー → JRE ID OAuth連携
- マイナンバーカード読み取りはダミー → NFC API連携
- 決済はダミー → 決済ゲートウェイ連携
- 行き先データは草津温泉のみ → CMSまたはAPIからの動的取得
- 検索バーのサジェストはローカルフィルタ → 検索APIに接続
