'use client';

import { useEffect, useState, type RefObject } from 'react';

/**
 * 領域そのものに Tab で止まる必要があるかを、描画後に測る (#136、AGENTS §8-2)。
 *
 * 領域に `tabIndex=0` を付ける理由は 2 つだけで、理由が無いときは付けない
 * (意味のない所にフォーカスが来ると、キーボードの人は何もできないまま Tab を 1 回余計に押す):
 *
 * - `content-does-not-start-with-tabbable` — 中身が Tab で来られる要素で**始まるとき以外**は止まる。
 *   つまり「中に Tab で来られる要素が無い」または「中身の最初のもの (文書順で最初の、空白でない文字、
 *   または img・input などの中身を持つ要素) が、Tab で来られる要素でもその中でもない」とき止まる。
 *   タブのパネル用 (WAI-ARIA Authoring Practices のタブの作法と同じ)。文章の後にボタンがあるパネルにも
 *   止まるのは、Tab だけで進む読み上げの人が、パネルを飛ばしてボタンへ行き、文章を読み落とさないため
 * - `scrollable-without-tabbable` — **実際にスクロールでき** (縦か横のどちらか)、かつ中に Tab で来られる要素が
 *   **無い**ときだけ止まる。独立してスクロールする領域用 (キーボードでスクロールするため。
 *   axe の scrollable-region-focusable と同じ条件。中に押せるものがあれば、そこへのフォーカスでスクロールできる)
 *
 * 中身と大きさは変わるので、prop で渡させず、要素を見て決める (中身の変化・リサイズに追従する)。
 * 最初の描画 (SSR を含む) は「止まる」にしておき、測ってから外す (測れない環境でも、
 * キーボードで届かない領域を作らない側に倒す)。
 *
 * 領域そのものにフォーカスがある間は「止まる → 止まらない」に変えない (tabindex が外れると
 * フォーカスが body に飛ぶため)。フォーカスが外れたときに測り直して、そのとき外す。
 */
export type FocusStopWhen = 'content-does-not-start-with-tabbable' | 'scrollable-without-tabbable';

const CANDIDATES =
  'a[href],button,input,select,textarea,summary,[tabindex],[contenteditable=""],[contenteditable="true"],audio[controls],video[controls]';

/** 中身として数える要素 (文字が無くても「中身」になるもの) */
const CONTENT_ELEMENTS = 'img,svg,canvas,video,audio,iframe,object,embed,input,select,textarea,button,meter,progress';

/**
 * el が、閉じた `<details>` の中で隠れているか (root の中で見る)。
 * 閉じた details でも、その直下の `summary` (とその中) は見えるので数える。
 */
function isInClosedDetails(el: Element, root: HTMLElement): boolean {
  let node: Element | null = el;
  while (node && node !== root) {
    const parent: Element | null = node.parentElement;
    if (parent instanceof HTMLDetailsElement && !parent.open) {
      const isOwnSummary = node.tagName === 'SUMMARY' && parent.querySelector(':scope > summary') === node;
      if (!isOwnSummary) return true;
    }
    node = parent;
  }
  return false;
}

/**
 * el が Tab で来られる要素か。数えないもの: tabindex が負 / `:disabled` (`<fieldset disabled>` の中を含む) /
 * type=hidden / 表示されていない (display:none・hidden の中) / `visibility: hidden` / inert の中 / 閉じた details の中。
 * shadow DOM の中・iframe の中は見ない (数えない = 止まる側に倒れるので、届かない領域は作らない)。
 */
function isTabbable(el: Element, root: HTMLElement): el is HTMLElement {
  if (!(el instanceof HTMLElement) || !el.matches(CANDIDATES)) return false;
  if (el.tabIndex < 0) return false;
  if (el.matches(':disabled')) return false;
  if (el instanceof HTMLInputElement && el.type === 'hidden') return false;
  if (el.getClientRects().length === 0) return false;
  const visibility = getComputedStyle(el).visibility;
  if (visibility === 'hidden' || visibility === 'collapse') return false;
  const inert = el.closest('[inert]');
  if (inert && root.contains(inert)) return false;
  if (isInClosedDetails(el, root)) return false;
  return true;
}

/** root の中に、Tab で来られる要素があるか */
function hasTabbableInside(root: HTMLElement): boolean {
  for (const el of root.querySelectorAll(CANDIDATES)) {
    if (isTabbable(el, root)) return true;
  }
  return false;
}

/** el (root の中) が、Tab で来られる要素か、その中にあるか */
function isInsideTabbable(el: Element, root: HTMLElement): boolean {
  let node: Element | null = el;
  while (node && node !== root) {
    if (isTabbable(node, root)) return true;
    node = node.parentElement;
  }
  return false;
}

/**
 * root の中身が、Tab で来られる要素で始まるか。
 * 中身の最初のもの = 文書順で最初の、空白でない文字、または img・input などの中身を持つ要素 (見えないものは飛ばす)。
 * 中身が無ければ false。
 */
function contentStartsWithTabbable(root: HTMLElement): boolean {
  const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const parent = node.parentElement;
        if (!node.textContent?.trim() || !parent) return NodeFilter.FILTER_SKIP;
        const visibility = getComputedStyle(parent).visibility;
        return visibility === 'hidden' || visibility === 'collapse' ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT;
      }
      const el = node as Element;
      // 表示されないもの (display:none・hidden・inert・閉じた details の中) は、中ごと飛ばす
      if (getComputedStyle(el).display === 'none' || el.hasAttribute('inert') || isInClosedDetails(el, root)) {
        return NodeFilter.FILTER_REJECT;
      }
      // visibility は子が上書きできるので、この要素だけ飛ばして中は見る
      const visibility = getComputedStyle(el).visibility;
      if (visibility === 'hidden' || visibility === 'collapse') return NodeFilter.FILTER_SKIP;
      if (el.matches(CONTENT_ELEMENTS) || isTabbable(el, root)) return NodeFilter.FILTER_ACCEPT;
      return NodeFilter.FILTER_SKIP;
    },
  });
  const first = walker.nextNode();
  if (!first) return false;
  const el = first.nodeType === Node.TEXT_NODE ? first.parentElement : (first as Element);
  return !!el && isInsideTabbable(el, root);
}

/** 実際にスクロールできるか (縦か横のどちらかで、スクロールの枠で、中身があふれている) */
function isScrollable(el: HTMLElement): boolean {
  const style = getComputedStyle(el);
  const scrolls = (overflow: string) => overflow === 'auto' || overflow === 'scroll';
  const y = scrolls(style.overflowY) && el.scrollHeight - el.clientHeight > 1;
  const x = scrolls(style.overflowX) && el.scrollWidth - el.clientWidth > 1;
  return x || y;
}

function computeNeeded(el: HTMLElement, when: FocusStopWhen): boolean {
  const tabbable = hasTabbableInside(el);
  if (when === 'content-does-not-start-with-tabbable') {
    return !tabbable || !contentStartsWithTabbable(el);
  }
  return isScrollable(el) && !tabbable;
}

export function useFocusStop(ref: RefObject<HTMLElement | null>, when: FocusStopWhen): boolean {
  const [needed, setNeeded] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      // 領域ごと表示されていない間は測れないので、前の値のままにする (表示されたら測り直す)
      if (el.getClientRects().length === 0) return;
      const next = computeNeeded(el, when);
      // 領域そのものにフォーカスがある間は外さない (外すとフォーカスが body に飛ぶ)。focusout で測り直す
      if (!next && el.ownerDocument.activeElement === el) return;
      setNeeded(next);
    };

    // 測り直しは 1 フレームに 1 回にまとめる (変化が続いても毎回は測らない)
    let frame = 0;
    let sizesDirty = false;
    const schedule = () => {
      if (typeof requestAnimationFrame !== 'function') {
        if (sizesDirty) observeSizes();
        measure();
        return;
      }
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (sizesDirty) observeSizes();
        measure();
      });
    };

    // 大きさの変化: 領域そのもの (幅で縦積みに変わる等) と、直下の中身 (あふれ方が変わる)
    const resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule);
    const observeSizes = () => {
      sizesDirty = false;
      if (!resize) return;
      resize.disconnect();
      resize.observe(el);
      for (const child of el.children) resize.observe(child);
    };
    // 中身の変化: 要素の出入りと、Tab で来られるかを変える属性
    const mutation =
      typeof MutationObserver === 'undefined'
        ? null
        : new MutationObserver(() => {
            sizesDirty = true;
            schedule();
          });
    mutation?.observe(el, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['disabled', 'tabindex', 'href', 'hidden', 'inert', 'contenteditable', 'open', 'class', 'style'],
    });
    // フォーカスが領域から外れたら測り直す (フォーカス中に外さなかった分を、ここで外す)
    el.addEventListener('focusout', schedule);
    observeSizes();
    measure();

    return () => {
      if (frame && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(frame);
      frame = 0;
      el.removeEventListener('focusout', schedule);
      resize?.disconnect();
      mutation?.disconnect();
    };
  }, [ref, when]);

  return needed;
}
