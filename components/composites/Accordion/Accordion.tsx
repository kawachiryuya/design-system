import React, { useState } from 'react';
import { Icon } from '../../primitives/Icon';

/**
 * Accordion の 1 項目。
 */
export interface AccordionItem {
  /** 一意 ID（aria-controls / aria-labelledby の関連付けに使用）。 */
  id: string;
  /** タイトル（クリック領域に表示）。 */
  title: React.ReactNode;
  /** 展開時の中身。 */
  content: React.ReactNode;
  /** 個別に無効化。クリック不可、aria-disabled が付く。 */
  disabled?: boolean;
}

/**
 * Accordion Props
 *
 * 折りたたみ式リスト。FAQ・詳細情報・設定セクション等に汎用的に使える。
 *
 * **type の使い分け**:
 * - `single` (default): 1 つだけ開く（FAQ など、フォーカスを 1 項目に絞りたい時）
 * - `multiple`: 複数同時に開ける（設定セクションなど、全体を見渡したい時）
 *
 * **controlled vs uncontrolled**:
 * - `openIds` を渡すと controlled モード（外部が状態管理）
 * - 渡さなければ uncontrolled、`defaultOpenIds` で初期値指定
 *
 * a11y:
 * - 各 trigger は `<button aria-expanded aria-controls>` で実装
 * - content は `role="region" aria-labelledby` で trigger と関連付け
 * - キーボード操作: Tab で trigger 間移動、Enter/Space で開閉
 *
 * @example
 *   // 基本（単一開閉、デフォルトで 1 つ目を開く）
 *   <Accordion
 *     items={[
 *       { id: 'q1', title: '質問 1', content: '回答 1' },
 *       { id: 'q2', title: '質問 2', content: '回答 2' },
 *     ]}
 *     defaultOpenIds={['q1']}
 *   />
 *
 * @example
 *   // 複数同時開閉
 *   <Accordion
 *     type="multiple"
 *     items={items}
 *   />
 *
 * @example
 *   // controlled モード（URL クエリ等と同期）
 *   <Accordion
 *     items={items}
 *     openIds={openIds}
 *     onChange={setOpenIds}
 *   />
 *
 * @see principles/README.mdx
 */
export interface AccordionProps {
  /** 項目の配列。順序通りに表示される。 */
  items: AccordionItem[];
  /**
   * 開閉モード。
   * - `single`: 1 つだけ開く
   * - `multiple`: 複数同時に開ける
   * @default 'single'
   */
  type?: 'single' | 'multiple';
  /** 初期に開く ID（uncontrolled モードのみ）。 */
  defaultOpenIds?: string[];
  /** 現在開いている ID（controlled モード）。指定すると外部が状態管理。 */
  openIds?: string[];
  /** 開閉状態が変わった時のコールバック（次の開 ID 配列を受け取る）。 */
  onChange?: (ids: string[]) => void;
}

/**
 * Accordion — Atomic Design: Composite
 *
 * @see AccordionProps for usage examples.
 */
export const Accordion = ({
  items,
  type = 'single',
  defaultOpenIds = [],
  openIds: controlledIds,
  onChange,
}: AccordionProps) => {
  const [internalIds, setInternalIds] = useState<string[]>(defaultOpenIds);
  const openIds = controlledIds ?? internalIds;

  const toggle = (id: string) => {
    const isOpen = openIds.includes(id);
    let next: string[];
    if (type === 'single') {
      next = isOpen ? [] : [id];
    } else {
      next = isOpen ? openIds.filter((x) => x !== id) : [...openIds, id];
    }
    if (!controlledIds) setInternalIds(next);
    onChange?.(next);
  };

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const contentId = `accordion-content-${item.id}`;
        const triggerId = `accordion-trigger-${item.id}`;
        return (
          <div key={item.id} className="border border-border-subtle rounded-md overflow-hidden">
            <button
              type="button"
              id={triggerId}
              aria-expanded={isOpen}
              aria-controls={contentId}
              aria-disabled={item.disabled}
              disabled={item.disabled}
              onClick={() => !item.disabled && toggle(item.id)}
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-state-hover transition-colors disabled:opacity-disabled disabled:cursor-not-allowed focus:outline-none focus-visible:ring-focus focus-visible:ring-border-focus focus-visible:ring-offset-focus focus-visible:ring-inset"
            >
              <Icon
                name={isOpen ? 'expand_less' : 'expand_more'}
                size="sm"
                color="inherit"
              />
              <span className="flex-1 text-body-md font-semibold text-onSurface">{item.title}</span>
            </button>
            {isOpen && (
              <div
                id={contentId}
                role="region"
                aria-labelledby={triggerId}
                className="px-4 pb-4 pl-11"
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
