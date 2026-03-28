import { Typography } from '@ds/Typography';
import { Button } from '@ds/Button';
import StepCard from '../components/StepCard';
import { useFadeIn } from '../hooks/useFadeIn';

const steps = [
  { heading: 'ステップ1の見出しテキスト' },
  { heading: 'ステップ2の見出しテキスト' },
  { heading: 'ステップ3の見出しテキスト' },
];

export default function UsageFlowSection() {
  const [headingRef, headingVisible] = useFadeIn();

  return (
    <section className="flex flex-col gap-6 items-center pb-16 pt-10 px-6" id="usage-flow">
      <div ref={headingRef} className={`fade-in-up ${headingVisible ? 'is-visible' : ''}`}>
        <Typography variant="h3" weight="semibold" className="text-center">
          利用の流れ
        </Typography>
      </div>

      <div className="flex flex-col gap-6 w-full">
        {steps.map((step, i) => (
          <StepCard key={i} stepNumber={i + 1} heading={step.heading} />
        ))}
      </div>

      {/* TODO: 納品時に実 URL を設定 */}
      <a href="" target="_blank" rel="noopener noreferrer" onClick={(e) => e.preventDefault()} className="w-full">
        <Button variant="secondary" size="large" fullWidth>
          ボタンテキスト
        </Button>
      </a>
    </section>
  );
}
