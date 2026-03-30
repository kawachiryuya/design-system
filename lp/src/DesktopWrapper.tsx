import { useRef, useCallback } from 'react';
import Placeholder from './components/Placeholder';
import SectionNav from './SectionNav';
import MobileLp from './MobileLp';
import { useActiveSection } from './hooks/useActiveSection';
import { assets } from './assets';

export default function DesktopWrapper() {
  const lpFrameRef = useRef<HTMLDivElement>(null);
  const { activeSection, forceSetActive } = useActiveSection(lpFrameRef);

  const scrollToTop = useCallback(() => {
    lpFrameRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToSection = useCallback((href: string) => {
    const container = lpFrameRef.current;
    if (!container) return;
    const sectionId = href.replace('#', '');
    const el = container.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      // クリック時に即座にアクティブ状態を反映（スクロール不要な場合にも対応）
      forceSetActive(sectionId);
    }
  }, [forceSetActive]);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* 背景色：fixed で常に画面全体を覆う */}
      <div className="fixed inset-0 bg-[#f0f5f4] -z-10" />
      {/* Mobile LP in frame */}
      {/* >= lg: centered, max-w-500  |  < lg: right-aligned, fixed 500px */}
      <div ref={lpFrameRef} className="fixed top-0 h-screen z-10 border-x-[3px] border-border-primary overflow-y-auto scrollbar-hidden
        w-1/2 right-0
        lg:w-[38vw] lg:right-auto lg:max-w-[500px] lg:left-1/2 lg:-translate-x-1/2">
        <MobileLp />
      </div>

      {/* lg+ content wrapper — fluid 64px padding (scales down toward 1024px) */}
      <div className="hidden lg:flex flex-col items-center h-screen p-[min(64px,4.44vw)]">
        {/* White card background — 3-column grid: left | LP gap | right */}
        <div className="anim-card-enter w-full max-w-[1312px] bg-white rounded-[40px] flex-1
          grid grid-cols-[minmax(0,1fr)_min(38vw,500px)_minmax(0,1fr)]">

          {/* Col 1: Logo — top-left */}
          <div className="anim-fade col-start-1 row-start-1 self-start mt-10 ml-10" style={{ animationDelay: '200ms' }}>
            <button onClick={scrollToTop} className="cursor-pointer" aria-label="トップへ戻る">
              <Placeholder src={assets.logo} label="ロゴ" className="h-16 w-[229px] max-w-full text-lg" />
            </button>
          </div>

          {/* Col 1: Headline — vertically centered */}
          <div className="anim-slide-left col-start-1 row-start-1 self-center px-10" style={{ animationDelay: '0ms' }}>
            <h1 className="flex flex-col gap-1">
              <span className="text-2xl font-semibold tracking-wide">
                <span className="text-onSurface-primary">XXXX</span>
                <span>がはじめる</span>
              </span>
              <span className="flex flex-col text-4xl font-semibold leading-normal tracking-wide">
                <span>あたらしい</span>
                <span>XXXXサービス</span>
              </span>
            </h1>
          </div>

          {/* Col 1: Illustrations left — bottom（一旦非表示）
          <div className="anim-slide-up col-start-1 row-start-1 self-end pl-16 -mb-4" style={{ animationDelay: '400ms' }}>
            <div className="flex gap-8">
              {[0, 1, 2].map((i) => (
                <Placeholder key={i} label="イラスト想定" className="w-[69px] h-[128px] text-[10px]" />
              ))}
            </div>
          </div>
          */}

          {/* Col 3: Section nav — vertically centered */}
          <div className="anim-slide-right col-start-3 row-start-1 self-center px-10" style={{ animationDelay: '0ms' }}>
            <SectionNav activeSection={activeSection} onNavigate={scrollToSection} />
          </div>

          {/* Col 3: Illustrations right — bottom（一旦非表示）
          <div className="anim-slide-up col-start-3 row-start-1 self-end flex justify-end pr-16 -mb-4" style={{ animationDelay: '400ms' }}>
            <div className="flex gap-8">
              {[0, 1, 2].map((i) => (
                <Placeholder key={i} label="イラスト想定" className="w-[69px] h-[128px] text-[10px]" />
              ))}
            </div>
          </div>
          */}
        </div>
      </div>

      {/* Left branding for < lg (remaining space left of LP) */}
      <div className="lg:hidden fixed top-0 left-0 w-1/2 h-screen z-20">
        {/* Logo — top-left, 40px from edges */}
        <button onClick={scrollToTop} className="anim-fade absolute top-10 left-10 cursor-pointer z-10" style={{ animationDelay: '200ms' }} aria-label="トップへ戻る">
          <Placeholder src={assets.logo} label="ロゴ" className="h-16 w-[229px] max-w-full text-lg" />
        </button>
        <div className="anim-slide-left flex flex-col justify-center h-full px-8" style={{ animationDelay: '0ms' }}>
          <h1 className="flex flex-col gap-1">
            <span className="text-2xl font-semibold tracking-wide">
              <span className="text-onSurface-primary">XXXX</span>
              <span>がはじめる</span>
            </span>
            <span className="flex flex-col text-4xl font-semibold leading-normal tracking-wide">
              <span>あたらしい</span>
              <span>XXXXサービス</span>
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
}
