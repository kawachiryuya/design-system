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
 * @see components/primitives/   — 単一 HTML 要素装飾 + 状態なし（13 個）
 * @see components/composites/   — 複数構造 or 状態管理 or 振る舞い（20 個）
 */

// ── Primitives (17) ──
export * from './primitives/Badge';
export * from './primitives/Button';
export * from './primitives/Center';
export * from './primitives/Cluster';
export * from './primitives/Divider';
export * from './primitives/Icon';
export * from './primitives/Image';
export * from './primitives/Input';
export * from './primitives/Label';
export * from './primitives/Link';
export * from './primitives/Section';
export * from './primitives/Skeleton';
export * from './primitives/Spinner';
export * from './primitives/Stack';
export * from './primitives/Textarea';
export * from './primitives/Typography';
export * from './primitives/VisuallyHidden';

// ── Composites (27) ──
export * from './composites/Accordion';
export * from './composites/Alert';
export * from './composites/AppShell';
export * from './composites/Avatar';
export * from './composites/Breadcrumb';
export * from './composites/Card';
export * from './composites/Checkbox';
export * from './composites/DropdownMenu';
export * from './composites/EmptyState';
export * from './composites/FilterChip';
export * from './composites/Grid';
export * from './composites/Modal';
export * from './composites/NumberInput';
export * from './composites/Pagination';
export * from './composites/Popover';
export * from './composites/ProgressBar';
export * from './composites/Radio';
export * from './composites/SearchBar';
export * from './composites/SegmentedControl';
export * from './composites/Select';
export * from './composites/SplitPane';
export * from './composites/Switch';
export * from './composites/Tabs';
export * from './composites/Toast';
export * from './composites/ToggleButton';
export * from './composites/Tooltip';
export * from './composites/TwoColumn';
