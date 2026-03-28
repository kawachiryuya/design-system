import { Typography } from '@ds/Typography';
import { Button } from '@ds/Button';
import Placeholder from '../components/Placeholder';
import { useFadeIn } from '../hooks/useFadeIn';

export default function TrialCtaSection() {
  const [contentRef, contentVisible] = useFadeIn();
  const [ctaRef, ctaVisible] = useFadeIn();

  return (
    <section className="bg-gradient-to-b from-[#e9f2ef] to-[#f2f5f4] flex flex-col gap-6 items-center px-6 py-12 relative" id="trial">
      {/* Decorative ribbon */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60px] h-[28px] bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />

      <div
        ref={contentRef}
        className={`fade-in-up flex flex-col gap-2 items-center ${contentVisible ? 'is-visible' : ''}`}
      >
        <Placeholder label="ロゴアセット想定" className="h-14 w-[200px]" />
        <Typography variant="h3" weight="semibold" className="text-center">
          先行体験してみませんか？
        </Typography>
      </div>

      <Typography variant="body" color="default" className="text-center leading-relaxed">
        XXXX年XX月XX日より
        <br />
        エントリーいただいた方の中から
        <br />
        抽選で先行試用版をご利用いただけます！
        <br />
        抽選は毎月行います。
      </Typography>

      <div
        ref={ctaRef}
        className={`fade-in-up delay-100 pulse-once w-full ${ctaVisible ? 'is-visible' : ''}`}
      >
        {/* TODO: 納品時に実 URL を設定 */}
        <a href="" target="_blank" rel="noopener noreferrer" onClick={(e) => e.preventDefault()}>
          <Button variant="primary" size="large" fullWidth>
            申し込む
          </Button>
        </a>
      </div>
    </section>
  );
}
