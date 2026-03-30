import { Typography } from '@ds/Typography';
import { Button } from '@ds/Button';
import StepCard from '../components/StepCard';
import { useFadeIn } from '../hooks/useFadeIn';
import { assets, urls } from '../assets';
import ExternalLink from '../components/ExternalLink';

const steps = [
  { heading: 'ステップ1の見出しテキスト' },
  { heading: 'ステップ2の見出しテキスト' },
  { heading: 'ステップ3の見出しテキスト' },
];

export default function UsageFlowSection() {
  const [headingRef, headingVisible] = useFadeIn();

  return (
    <section id="usage-flow" aria-label="利用の流れ" className="flex flex-col gap-6 items-center pb-16 pt-10 px-6">
      <div ref={headingRef} className={`fade-in-up ${headingVisible ? 'is-visible' : ''}`}>
        <Typography variant="h3" as="h2" weight="semibold" className="text-center">
          利用の流れ
        </Typography>
      </div>

      <ol className="flex flex-col gap-6 w-full list-none">
        {steps.map((step, i) => (
          <li key={i}>
            <StepCard stepNumber={i + 1} heading={step.heading} illustration={assets.usageSteps[i]} />
          </li>
        ))}
      </ol>

      <ExternalLink href={urls.usageFlow} label="ボタンテキスト" className="w-full">
        <Button variant="secondary" size="large" fullWidth>
          ボタンテキスト
        </Button>
      </ExternalLink>
    </section>
  );
}
