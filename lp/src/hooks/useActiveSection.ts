import { useState, useEffect, useCallback, useMemo, type RefObject } from 'react';
import { navItems } from '../SectionNav';

/**
 * LP フレームのスクロール位置を監視し、現在表示中のセクション id を返す。
 * IntersectionObserver の root にスクロールコンテナ（fixed div）を指定。
 *
 * 返り値:
 *  - activeSection: 現在アクティブなセクション id
 *  - setActiveSection: クリック時に強制セットするための setter
 */
export function useActiveSection(scrollRef: RefObject<HTMLDivElement | null>) {
  const sectionIds = useMemo(() => navItems.map((item) => item.href.replace('#', '')), []);
  const [activeSection, setActiveSection] = useState(sectionIds[0]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const firstId = sectionIds[0];
    const lastId = sectionIds[sectionIds.length - 1];

    // --- IntersectionObserver: 中間セクションの検出 ---
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        root: container,
        rootMargin: '0px 0px -70% 0px',
        threshold: 0,
      }
    );

    sectionIds.forEach((id) => {
      const el = container.querySelector(`#${id}`);
      if (el) observer.observe(el);
    });

    // --- scroll イベント: 先頭・末尾の検出 ---
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      // 先頭付近（8px 以内）→ 最初のセクション
      if (scrollTop <= 8) {
        setActiveSection(firstId);
        return;
      }
      // 末尾付近（8px 以内）→ 最後のセクション
      if (scrollTop + clientHeight >= scrollHeight - 8) {
        setActiveSection(lastId);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      container.removeEventListener('scroll', handleScroll);
    };
  }, [scrollRef, sectionIds]);

  const forceSetActive = useCallback((id: string) => {
    setActiveSection(id);
  }, []);

  return { activeSection, forceSetActive };
}
