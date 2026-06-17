'use client';

import React, { useState, useRef, useId, useEffect } from 'react';

/**
 * Tabs の 1 タブ項目。
 */
export interface TabItem {
  /** タブの一意 ID（`aria-controls` 関連付けに使用）。 */
  id: string;
  /** タブのラベル。 */
  label: string;
  /** タブパネルの内容。アクティブ時のみレンダリングされる。 */
  content: React.ReactNode;
  /**
   * タブを無効化。キーボードナビゲーションでスキップされる。
   * @default false
   */
  disabled?: boolean;
  /** ラベル右に表示するバッジ（件数等）。文字列または数値。 */
  badge?: string | number;
}

/**
 * Tabs Props
 *
 * a11y 完全対応のタブナビゲーション。`role="tablist"` / `role="tab"` / `role="tabpanel"` 自動付与。
 *
 * **キーボード操作 (automatic activation)**:
 * - `←` `→` `↑` `↓` 矢印キー: 隣のタブへ移動 = **即時選択**（disabled をスキップ）
 * - `Home` `End`: 最初/最後のタブへ（即時選択）
 * - `Enter` `Space`: フォーカス中のタブを選択
 *
 * > 矢印キー移動で即座にパネルが切り替わる (automatic activation)。パネルが遅延ロード / 通信を伴う
 * > 場合、矢印キー連打のたびに fetch が走るため不向き。将来的に
 * > `activationMode?: 'automatic' | 'manual'` の opt-in を検討 (現状は automatic 固定)。
 *
 * **controlled vs uncontrolled**:
 * - `activeId` を渡すと controlled モード（`onChange` で外部が状態管理）
 * - 渡さなければ uncontrolled モード（内部 state、`defaultActiveId` で初期値指定可）
 *
 * @example
 *   // 基本（uncontrolled）
 *   <Tabs
 *     tabs={[
 *       { id: 'profile', label: 'プロフィール', content: <ProfilePane /> },
 *       { id: 'settings', label: '設定', content: <SettingsPane /> },
 *     ]}
 *     defaultActiveId="profile"
 *   />
 *
 * @example
 *   // バッジ付き（通知数）
 *   <Tabs
 *     tabs={[
 *       { id: 'inbox', label: '受信', badge: 12, content: <Inbox /> },
 *       { id: 'sent', label: '送信', content: <Sent /> },
 *     ]}
 *   />
 *
 * @example
 *   // controlled（URL クエリ等と同期）
 *   <Tabs
 *     tabs={tabsData}
 *     activeId={searchParams.get('tab') ?? 'overview'}
 *     onChange={(id) => setSearchParams({ tab: id })}
 *   />
 *
 * @example
 *   // 一部タブ disabled
 *   <Tabs
 *     tabs={[
 *       { id: 'a', label: '利用可', content: <A /> },
 *       { id: 'b', label: '準備中', content: <B />, disabled: true },
 *     ]}
 *   />
 */
export interface TabsProps {
  /** タブ項目の配列。順序通りに表示される。 */
  tabs: TabItem[];
  /** 初期アクティブタブの ID（uncontrolled モードのみ）。未指定時は `tabs[0].id`。 */
  defaultActiveId?: string;
  /** アクティブタブの ID（controlled モード）。指定すると外部が状態管理。 */
  activeId?: string;
  /** タブ切り替え時のコールバック。新しい ID が引数。 */
  onChange?: (id: string) => void;
  /**
   * タブリスト全体の `aria-label`。
   * @default 'タブナビゲーション'
   */
  ariaLabel?: string;
  /**
   * 矢印キー移動時の選択タイミング (WAI-ARIA APG)。
   * - `automatic`: 矢印キーで移動 = 即選択 (panel も切替)。大半の UI 向け
   * - `manual`: 矢印キーは focus のみ移動し、`Enter` / `Space` で選択確定。
   *   **panel が遅延ロード / 通信を伴う場合に使う** (矢印連打ごとの fetch を防ぐ)
   * @default 'automatic'
   */
  activationMode?: 'automatic' | 'manual';
  /** 追加 CSS クラス（コンテナに適用）。 */
  className?: string;
}

/**
 * Tabs — Atomic Design: Composite (Molecule)
 *
 * @see TabsProps for usage examples.
 */
export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultActiveId,
  activeId: controlledId,
  onChange,
  ariaLabel = 'タブナビゲーション',
  activationMode = 'automatic',
  className = '',
}) => {
  const uid = useId();
  const isControlled = controlledId !== undefined;
  const [internalId, setInternalId] = useState(defaultActiveId ?? tabs[0]?.id);
  const rawCurrentId = isControlled ? controlledId : internalId;
  // activeId が tabs に存在しないと全 panel が非表示になるため tabs[0] にフォールバックする。
  const currentId = tabs.some((t) => t.id === rawCurrentId) ? rawCurrentId : tabs[0]?.id;

  if (process.env.NODE_ENV !== 'production' && rawCurrentId !== undefined && rawCurrentId !== currentId) {
    console.warn(
      `[Tabs] activeId "${rawCurrentId}" は tabs に存在しません。tabs[0] ("${tabs[0]?.id}") にフォールバックします。`
    );
  }

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // manual モードの roving 用。focus 中タブ (選択とは別軸)。automatic では currentId と一致。
  const [focusedId, setFocusedId] = useState(currentId);
  // 選択が外部 (controlled) で変わったら roving focus も追従させる。
  useEffect(() => { setFocusedId(currentId); }, [currentId]);
  const rovingId = activationMode === 'manual' ? focusedId : currentId;

  const handleSelect = (id: string) => {
    if (!isControlled) setInternalId(id);
    onChange?.(id);
    setFocusedId(id);
  };

  const enabledTabs = tabs.filter((t) => !t.disabled);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const currentEnabledIndex = enabledTabs.findIndex(
      (t) => t.id === tabs[index].id
    );

    let nextTab: TabItem | undefined;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextTab = enabledTabs[(currentEnabledIndex + 1) % enabledTabs.length];
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextTab = enabledTabs[(currentEnabledIndex - 1 + enabledTabs.length) % enabledTabs.length];
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextTab = enabledTabs[0];
    } else if (e.key === 'End') {
      e.preventDefault();
      nextTab = enabledTabs[enabledTabs.length - 1];
    }

    if (nextTab) {
      const nextIndex = tabs.findIndex((t) => t.id === nextTab!.id);
      // automatic: 移動 = 即選択。manual: focus のみ移動 (Enter/Space は button の onClick で選択)。
      if (activationMode === 'automatic') {
        handleSelect(nextTab.id);
      } else {
        setFocusedId(nextTab.id);
      }
      tabRefs.current[nextIndex]?.focus();
    }
  };

  const tabButtonClass = (tab: TabItem) => {
    const isActive = tab.id === currentId;

    return [
      'relative px-4 py-2 text-label transition-colors duration-normal',
      'focus:outline-none focus-visible:ring-focus focus-visible:ring-border-focus focus-visible:ring-offset-focus',
      'whitespace-nowrap',
      tab.disabled
        ? 'text-onSurface-disabled cursor-not-allowed'
        : isActive
          ? 'text-onSurface-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-surface-primary after:rounded-full'
          : 'text-onSurface-muted hover:text-onSurface',
    ].join(' ');
  };

  return (
    <div className={['w-full', className].join(' ')}>
      {/* タブリスト */}
      <div className="border-b border-border-subtle overflow-x-auto">
        <div
          role="tablist"
          aria-label={ariaLabel}
          className="flex -mb-px"
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={(el) => { tabRefs.current[index] = el; }}
              role="tab"
              id={`${uid}-tab-${tab.id}`}
              aria-controls={`${uid}-panel-${tab.id}`}
              aria-selected={tab.id === currentId}
              tabIndex={tab.id === rovingId ? 0 : -1}
              disabled={tab.disabled}
              className={tabButtonClass(tab)}
              onClick={() => !tab.disabled && handleSelect(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            >
              <span className="flex items-center gap-1">
                {tab.label}
                {tab.badge !== undefined && (
                  <span className="text-caption font-semibold px-1.5 py-0.5 rounded-sm min-w-5 text-center leading-none bg-surface-disabled text-onSurface-muted">
                    {tab.badge}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* タブパネル */}
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${uid}-panel-${tab.id}`}
          aria-labelledby={`${uid}-tab-${tab.id}`}
          hidden={tab.id !== currentId}
          tabIndex={0}
          className="focus:outline-none pt-4"
        >
          {tab.id === currentId && tab.content}
        </div>
      ))}
    </div>
  );
};

Tabs.displayName = 'Tabs';
