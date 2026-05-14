/**
 * Design System Components — public barrel export
 *
 * AI / 人間が一括で import するための入口。
 * 個別 import（ツリーシェイキング重視）の場合は各サブパス（components/primitives/Button 等）を使用。
 *
 * @example
 *   import { Button, Input, Card } from '@kawachiryuya/design-system/components';
 *   import type { ButtonProps } from '@kawachiryuya/design-system/components';
 *
 * @see components/primitives/   — 単一 HTML 要素ラッパー（11 個）
 * @see components/composites/   — 複数 Primitive の組合せ or 状態あり（19 個）
 */

// ── Primitives (11) ──
export * from './primitives/Button';
export * from './primitives/Divider';
export * from './primitives/Icon';
export * from './primitives/Image';
export * from './primitives/Input';
export * from './primitives/Label';
export * from './primitives/Link';
export * from './primitives/Skeleton';
export * from './primitives/Spinner';
export * from './primitives/Textarea';
export * from './primitives/Typography';

// ── Composites (19) ──
export * from './composites/Accordion';
export * from './composites/Alert';
export * from './composites/Avatar';
export * from './composites/Badge';
export * from './composites/Breadcrumb';
export * from './composites/Card';
export * from './composites/Checkbox';
export * from './composites/EmptyState';
export * from './composites/FilterChip';
export * from './composites/NumberInput';
export * from './composites/Pagination';
export * from './composites/ProgressBar';
export * from './composites/Radio';
export * from './composites/SearchBar';
export * from './composites/SegmentedControl';
export * from './composites/Select';
export * from './composites/Switch';
export * from './composites/Tabs';
export * from './composites/ToggleButton';
