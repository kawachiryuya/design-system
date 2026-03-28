import { useState, useRef, useEffect } from 'react';
import { Typography } from '@ds/Typography';
import { Button } from '@ds/Button';
import { useFadeIn } from '../hooks/useFadeIn';

const faqItems = [
  {
    q: '質問テキストが入ります',
    a: '回答テキストが入ります回答テキストが入ります回答テキストが入ります回答テキストが入ります回答テキストが入ります回答テキストが入ります回答テキストが入ります',
  },
  {
    q: '質問テキストが入ります',
    a: '回答テキストが入ります回答テキストが入ります回答テキストが入ります回答テキストが入ります回答テキストが入ります回答テキストが入ります回答テキストが入ります',
  },
  {
    q: '質問テキストが入ります',
    a: '回答テキストが入ります回答テキストが入ります回答テキストが入ります回答テキストが入ります回答テキストが入ります回答テキストが入ります回答テキストが入ります',
  },
  {
    q: '質問テキストが入ります',
    a: '回答テキストが入ります回答テキストが入ります回答テキストが入ります回答テキストが入ります回答テキストが入ります回答テキストが入ります回答テキストが入ります',
  },
  {
    q: '質問テキストが入ります',
    a: '回答テキストが入ります回答テキストが入ります回答テキストが入ります回答テキストが入ります回答テキストが入ります回答テキストが入ります回答テキストが入ります',
  },
];

/** 途中まで見せる高さ (px) */
const PEEK_HEIGHT = 80;

function FaqCard({ q, a }: { q: string; a: string }) {
  return (
    <div className="border-2 border-border flex flex-col gap-4 p-6 rounded-lg w-full">
      {/* Question */}
      <div className="flex gap-3 items-center">
        <span className="bg-surface-primary text-onSurface-inverse rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shrink-0">Q</span>
        <Typography variant="body" color="default" className="flex-1">
          {q}
        </Typography>
      </div>
      {/* Answer */}
      <div className="flex gap-3 items-start">
        <span className="bg-error-500 text-onSurface-inverse rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shrink-0 mt-[2px]">A</span>
        <Typography variant="body" color="default" className="flex-1 leading-relaxed">
          {a}
        </Typography>
      </div>
    </div>
  );
}

export default function FaqSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [headingRef, headingVisible] = useFadeIn();
  const expandableRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  // 展開コンテンツの実高さを計測
  useEffect(() => {
    if (!expandableRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setContentHeight(entry.contentRect.height);
    });
    ro.observe(expandableRef.current);
    return () => ro.disconnect();
  }, []);

  const handleExpand = () => setIsExpanded(true);

  // 展開エリアの高さ: 閉じ = PEEK_HEIGHT, 開き = 実コンテンツ高さ
  const wrapperHeight = isExpanded ? contentHeight : PEEK_HEIGHT;

  return (
    <section className="flex flex-col gap-6 items-center px-6 py-10" id="faq">
      {/* Heading */}
      <div ref={headingRef} className={`fade-in-up flex flex-col items-center ${headingVisible ? 'is-visible' : ''}`}>
        <Typography variant="h3" weight="semibold" className="text-center">
          よくある質問
        </Typography>
        <Typography variant="h5" weight="semibold" className="text-center">
          見出し補足テキストが入る
        </Typography>
      </div>

      {/* 常に表示: 1件目 */}
      <FaqCard {...faqItems[0]} />

      {/* 2件目以降: 高さアニメーションで開閉 */}
      <div
        className="w-full overflow-hidden relative transition-[height] duration-300 ease-in-out"
        style={{ height: wrapperHeight }}
      >
        <div ref={expandableRef} className="flex flex-col gap-6 w-full">
          {faqItems.slice(1).map((item, i) => (
            <div
              key={i}
              className={i === 0
                ? ''
                : `stagger-item ${isExpanded ? 'is-visible' : ''}`
              }
              style={i > 0 ? { transitionDelay: isExpanded ? `${i * 50}ms` : '0ms' } : undefined}
            >
              <FaqCard {...item} />
            </div>
          ))}
        </div>
        {/* 閉じている時のグラデーション */}
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent transition-opacity duration-300" />
        )}
      </div>

      {/* CTA ボタン — 展開後は非表示 */}
      {!isExpanded && (
        <Button variant="secondary" size="large" fullWidth onClick={handleExpand}>
          すべてのFAQをみる +
        </Button>
      )}
    </section>
  );
}
