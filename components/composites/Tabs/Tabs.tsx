import React, { useState, useRef, useId } from 'react';

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
 * **キーボード操作**:
 * - `←` `→` `↑` `↓` 矢印キー: 隣のタブへ移動（disabled をスキップ）
 * - `Home` `End`: 最初/最後のタブへ
 * - `Enter` `Space`: タブ選択
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
 *
 * @see principles/README.mdx
 * @see principles/Interaction/state/overview.mdx
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
  className = '',
}) => {
  const uid = useId();
  const isControlled = controlledId !== undefined;
  const [internalId, setInternalId] = useState(defaultActiveId ?? tabs[0]?.id);
  const currentId = isControlled ? controlledId : internalId;

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleSelect = (id: string) => {
    if (!isControlled) setInternalId(id);
    onChange?.(id);
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
      handleSelect(nextTab.id);
      const nextIndex = tabs.findIndex((t) => t.id === nextTab!.id);
      tabRefs.current[nextIndex]?.focus();
    }
  };

  const tabButtonClass = (tab: TabItem) => {
    const isActive = tab.id === currentId;

    return [
      'relative px-4 py-2 text-sm font-medium transition-colors duration-normal',
      'focus:outline-none focus-visible:ring-focus focus-visible:ring-border-focus focus-visible:ring-offset-focus',
      'whitespace-nowrap',
      tab.disabled
        ? 'text-onSurface-disabled cursor-not-allowed'
        : isActive
          ? 'text-onSurface-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-surface-primary after:rounded-full'
          : 'text-onSurface-muted hover:text-onSurface',
    ].join(' ');
  };

  const currentContent = tabs.find((t) => t.id === currentId)?.content;

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
              aria-disabled={tab.disabled}
              tabIndex={tab.id === currentId ? 0 : -1}
              disabled={tab.disabled}
              className={tabButtonClass(tab)}
              onClick={() => !tab.disabled && handleSelect(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            >
              <span className="flex items-center gap-1">
                {tab.label}
                {tab.badge !== undefined && (
                  <span className="text-xs font-semibold px-[6px] py-[2px] rounded-sm min-w-5 text-center leading-none bg-surface-skeleton text-onSurface-muted">
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
          {tab.id === currentId && currentContent}
        </div>
      ))}
    </div>
  );
};

Tabs.displayName = 'Tabs';
