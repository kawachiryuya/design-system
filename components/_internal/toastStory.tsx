'use client';

import React from 'react';
import type { ToastOptions, ToastProviderProps } from '../composites/Toast/Toast';

/**
 * Toast の story だけが使う、内側の切り替え (公開しない。`components/index.ts` から出さない)。
 *
 * 秒数は部品が決め、使う側に止める手段を渡さない (#91)。それでも視覚回帰 (Chromatic)・axe・フォーカスの輪の検査は、
 * 出した Toast を撮り終えるまで残す必要があるので、story は `ToastProvider` をこの Provider で包んで止める。
 * - `frozen`: 自動で消えるタイマーを動かさず、出る動きも飛ばす (はじめから定位置)
 * - `inline`: 置き場を画面の下に固定せず、その場に置く (Overview で、いくつもの形を 1 枚に並べるため)
 */
export interface ToastStoryOptions {
  /** タイマーを動かさない・出る動きを飛ばす */
  frozen?: boolean;
  /** 置き場を固定せず、描いた場所に置く */
  inline?: boolean;
}

export const ToastStoryContext = React.createContext<ToastStoryOptions>({});

/**
 * Toast の Props 表のための、描かない部品 (story の meta の `component`)。
 * Toast の入口は `<ToastProvider>` (`children`) と `showToast(options)` の 2 つで、`showToast` に渡すもの
 * (`ToastOptions`) は部品の props ではないので、そのままでは autodocs の表に出ない。両方の型をこの部品の props にして、
 * `.tsx` の JSDoc (正本) を guideline の `<ArgTypes>` に流す (AGENTS §5-2 / §5-4)
 */
export const ToastPropsTable: React.FC<ToastOptions & ToastProviderProps> = () => null;
