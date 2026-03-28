import { Typography } from '@ds/Typography';
import StepCard from '../components/StepCard';
import { useFadeIn } from '../hooks/useFadeIn';

const steps = [
  {
    heading: (
      <>
        以下のエントリーフォームより
        <br />
        ご応募ください
      </>
    ),
    footnote: '注釈テキスト注釈テキスト注釈テキスト注釈テキスト注釈テキスト注釈テキスト注釈テキスト注釈テキスト。',
  },
  {
    heading: (
      <>
        当選した方へサービス利用の
        <br />
        ご案内メールが届く
      </>
    ),
  },
  {
    heading: (
      <>
        届いたメールのリンクから
        <br />
        ご利用開始手続きをする
      </>
    ),
  },
  {
    heading: 'XXXXXX',
  },
];

export default function ApplicationFlowSection() {
  const [headingRef, headingVisible] = useFadeIn();

  return (
    <section className="flex flex-col gap-6 items-center px-6 py-10" id="application-flow">
      <div ref={headingRef} className={`fade-in-up ${headingVisible ? 'is-visible' : ''}`}>
        <Typography variant="h3" weight="semibold" className="text-center">
          応募の流れ
        </Typography>
      </div>

      <div className="flex flex-col gap-6 w-full">
        {steps.map((step, i) => (
          <StepCard
            key={i}
            stepNumber={i + 1}
            heading={step.heading}
            footnote={step.footnote}
          />
        ))}
      </div>
    </section>
  );
}
