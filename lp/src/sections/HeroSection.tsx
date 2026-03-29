import { useCallback, useRef } from 'react';
import { Typography } from '@ds/Typography';
import { Button } from '@ds/Button';
import Placeholder from '../components/Placeholder';
import PhoneMockup from '../components/PhoneMockup';
import HamburgerMenu from '../components/HamburgerMenu';
import { useFadeIn } from '../hooks/useFadeIn';

/** TODO: 納品時にロゴ画像パスを設定（空文字の間は Placeholder 表示） */
const LOGO_SRC = '';

export default function HeroSection() {
  const [headlineRef, headlineVisible] = useFadeIn();
  const [mockupRef, mockupVisible] = useFadeIn();
  const [ctaRef, ctaVisible] = useFadeIn();
  const logoRef = useRef<HTMLButtonElement>(null);

  const scrollToTop = useCallback(() => {
    // スクロールコンテナを探してトップへ
    let el = logoRef.current?.parentElement;
    while (el) {
      const { overflowY } = getComputedStyle(el);
      if (overflowY === 'auto' || overflowY === 'scroll') {
        el.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      el = el.parentElement;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <section id="about" aria-label="メインビジュアル" className="bg-gradient-to-b from-[#e9f2ef] to-[#f2f5f4] flex flex-col items-center overflow-clip pb-10">
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 py-2 w-full lg:hidden">
        <button ref={logoRef} onClick={scrollToTop} className="sm:invisible" aria-label="トップへ戻る">
          {LOGO_SRC
            ? <img src={LOGO_SRC} alt="ロゴ" className="h-10 w-[143px] object-contain" />
            : <Placeholder label="ロゴアセット想定" className="h-10 w-[143px] text-xs" />
          }
        </button>
        <HamburgerMenu />
      </div>

      <div className="flex flex-col gap-10 items-center pt-4 sm:pt-0 md:pt-0 lg:pt-10 px-6 w-full">
        {/* Circle decoration behind phones */}
        <div className="relative w-full flex flex-col items-center">
          {/* Headline */}
          <div
            ref={headlineRef}
            className={`fade-in-up flex flex-col gap-2 items-center mb-4 text-center ${headlineVisible ? 'is-visible' : ''}`}
          >
            <h1 className="flex flex-col gap-2 items-center">
              <span className="flex items-baseline gap-[0.5px]">
                <Typography variant="h2" weight="semibold" as="span">
                  XXXXX
                </Typography>
                <Typography variant="h3" weight="semibold" as="span">
                  を
                </Typography>
              </span>
              <span className="bg-surface-primary text-onSurface-inverse rounded-md p-3 flex items-baseline gap-[2px]">
                <span className="text-5xl font-medium leading-none">XXXXX</span>
                <span className="text-4xl font-bold leading-none">で！</span>
              </span>
            </h1>
          </div>

          {/* Phone mockups — 後ほど画像に差し替え予定 */}
          <div
            ref={mockupRef}
            className={`fade-in-up delay-200 relative w-full max-w-[400px] aspect-square mx-auto mt-4 ${mockupVisible ? 'is-visible' : ''}`}
          >
            {/* Decorative circle */}
            <div className="absolute inset-0 bg-neutral-300 rounded-full top-[12%]" />
            {/* Back phone (right, tilted right) */}
            <div className="absolute left-[49%] top-[5%] z-0 w-[47.5%]">
              <PhoneMockup rotation={6} />
            </div>
            {/* Front phone (left, tilted left) */}
            <div className="absolute left-[2%] top-0 z-10 w-[47.5%]">
              <PhoneMockup rotation={-6} />
            </div>
          </div>
        </div>

        {/* CTA */}
        <div
          ref={ctaRef}
          className={`fade-in-up delay-300 pulse-once relative z-10 w-full ${ctaVisible ? 'is-visible' : ''}`}
        >
          {/* TODO: 納品時に実 URL を設定 */}
          <a href="" target="_blank" rel="noopener noreferrer" aria-label="申し込む（別ウィンドウで開きます）" onClick={(e) => e.preventDefault()}>
            <Button variant="primary" size="large" fullWidth>
              申し込む
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
