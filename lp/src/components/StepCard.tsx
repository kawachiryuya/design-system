import { ReactNode } from 'react';
import { Typography } from '@ds/Typography';
import Placeholder from './Placeholder';
import { useFadeIn } from '../hooks/useFadeIn';

interface StepCardProps {
  stepNumber: number;
  heading: ReactNode;
  footnote?: string;
  /** イラスト画像の URL（空文字の間はプレースホルダー表示） */
  illustration?: string;
}

export default function StepCard({ stepNumber, heading, footnote, illustration }: StepCardProps) {
  const num = String(stepNumber).padStart(2, '0');
  const [cardRef, cardVisible] = useFadeIn();

  return (
    <div ref={cardRef} className={`fade-in-up flex flex-col gap-4 w-full ${cardVisible ? 'is-visible' : ''}`}>
      {/* Step header bar */}
      <div className="flex items-stretch rounded-sm w-full bg-[#f7f7f7]">
        <div className={`scale-in bg-surface-primary text-onSurface-inverse flex flex-col gap-1 items-center justify-center rounded-l-sm px-2 py-3 shrink-0 ${cardVisible ? 'is-visible' : ''}`}>
          <span className="text-sm font-semibold tracking-wide leading-none">STEP</span>
          <span className="text-2xl font-semibold tracking-wide leading-none">{num}</span>
        </div>
        <div className="flex-1 flex items-center px-4 py-2 min-h-[66px]">
          <Typography variant="body" weight="semibold" as="p" className="text-lg leading-normal">
            {heading}
          </Typography>
        </div>
      </div>

      {/* Illustration placeholder */}
      <div className="flex justify-center w-full">
        <Placeholder src={illustration} label="イラスト" className="w-[200px] h-[200px]" />
      </div>

      {/* Footnote */}
      {footnote && (
        <Typography variant="body-sm" color="default">
          {footnote}
        </Typography>
      )}
    </div>
  );
}
