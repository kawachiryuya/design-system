import React, { useState, useRef, useId } from 'react';

/**
 * Tabs Props
 * Reference: principles/patterns/navigation.md / principles/interaction/state/interactive-states.md
 *
 * Molecule: キーボード操作に対応したタブナビゲーション
 * ARIA: role="tablist" / role="tab" / role="tabpanel"
 */
export interface TabItem {
  /** タブの一意ID */
  id: string;
  /** タブのラベル */
  label: string;
  /** タブのパネルコンテンツ */
  content: React.ReactNode;
  /** タブを無効にする */
  disabled?: boolean;
  /** タブラベルの右端に表示するバッジ（件数など） */
  badge?: string | number;
}

export interface TabsProps {
  /** タブ項目 */
  tabs: TabItem[];
  /** 初期アクティブタブのID（非制御） */
  defaultActiveId?: string;
  /** アクティブタブのID（制御） */
  activeId?: string;
  /** タブ切り替え時のコールバック */
  onChange?: (id: string) => void;
  /** タブリスト全体のaria-label */
  ariaLabel?: string;
  /** 追加CSSクラス（コンテナ） */
  className?: string;
}

/**
 * Tabs Component
 *
 * Atomic Design: Molecule
 *
 * キーボード操作:
 * - ←/→ 矢印キーで隣のタブへ移動
 * - Home/End で最初/最後のタブへ移動
 * - Enter/Space でタブを選択
 *
 * @example
 * <Tabs
 *   tabs={[
 *     { id: 'profile', label: 'プロフィール', content: <ProfilePane /> },
 *     { id: 'settings', label: '設定', content: <SettingsPane /> },
 *   ]}
 *   defaultActiveId="profile"
 * />
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
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-1',
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
      <div className="border-b border-border-muted overflow-x-auto">
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
                  <span className="text-xs font-semibold px-[6px] py-[2px] rounded-xs min-w-5 text-center leading-none bg-surface-skeleton text-onSurface-muted">
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
