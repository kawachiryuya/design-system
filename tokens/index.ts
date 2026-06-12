/**
 * Design System Tokens — public API entry point
 *
 * AI / 人間が型付きで参照するための入口。
 * 実体は Style Dictionary が tokens/source/ から生成（tokens/build/tokens.ts）。
 *
 * 使い方:
 *   import { COLORS, SPACING } from '@kawachiryuya/design-system/tokens';
 *   const cta = COLORS.surface.primary;        // "#008965" (literal type)
 *   const gap = SPACING['4'];                   // "16px"
 *   const onText = COLORS.on.default;           // "#171717"
 */

export { TOKENS, type Tokens } from './build/tokens';

import { TOKENS } from './build/tokens';

/** カラーシステム（primitive scales + semantic mapping） */
export const COLORS = TOKENS.color;
/** Spacing scale（8px base） */
export const SPACING = TOKENS.spacing;
/** Typography（font-size / weight / line-height / letter-spacing / family） */
export const TYPOGRAPHY = TOKENS.typography;
/** Typography semantic aliases（heading / body / label / caption） */
export const TYPOGRAPHY_SEMANTIC = TOKENS['typography-semantic'];
/** Box shadows（elevation） */
export const SHADOWS = TOKENS.shadow;
/** Border radius */
export const RADIUS = TOKENS.radius;
/** Responsive breakpoints */
export const BREAKPOINTS = TOKENS.screens;
/** Animation duration */
export const DURATION = TOKENS.duration;
/** Animation easing */
export const EASING = TOKENS.easing;
/** Semantic z-index layers（dropdown / sticky / overlay / modal / popover / toast / tooltip） */
export const Z_INDEX = TOKENS['z-index'];
/** Semantic opacity（disabled / muted / spinner-track / spinner-spin） */
export const OPACITY = TOKENS.opacity;
/** Focus ring（a11y semantic: width / offset） */
export const FOCUS_RING = TOKENS['focus-ring'];
/** Layout（container / section / grid 等） */
export const LAYOUT = TOKENS.layout;

// Type re-exports for convenience
export type Colors = typeof COLORS;
export type Spacing = typeof SPACING;
export type Typography = typeof TYPOGRAPHY;
export type ZIndex = typeof Z_INDEX;
export type Opacity = typeof OPACITY;
export type FocusRing = typeof FOCUS_RING;
export type Layout = typeof LAYOUT;
