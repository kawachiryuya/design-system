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
/** Spacing semantic aliases（component / section） */
export const SPACING_SEMANTIC = TOKENS['spacing-semantic'];
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

// Type re-exports for convenience
export type Colors = typeof COLORS;
export type Spacing = typeof SPACING;
export type Typography = typeof TYPOGRAPHY;
