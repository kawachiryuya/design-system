import { useRef, useState, useEffect, type RefObject } from 'react';

/**
 * IntersectionObserver で要素が viewport に入ったら isVisible を true にする。
 * 一度 true になったら observer を解除（戻りスクロールで再発火しない）。
 *
 * rootRef を渡すと、そのコンテナ内での交差を検出する（LP フレーム対応）。
 */
export function useFadeIn<T extends HTMLElement = HTMLDivElement>(
  rootRef?: RefObject<HTMLElement | null>
): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        root: rootRef?.current ?? null,
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isVisible, rootRef]);

  return [ref, isVisible];
}
