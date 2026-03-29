import { Typography } from '@ds/Typography';
import { Icon } from '@ds/Icon';
import Placeholder from '../components/Placeholder';
import { useFadeIn } from '../hooks/useFadeIn';

const conditions = [
  { text: '条件1 ※' },
  { text: '条件2' },
  { text: '条件3' },
  { text: '条件4のテキストが入ります' },
];

export default function CautionSection() {
  const [contentRef, contentVisible] = useFadeIn();

  return (
    <section id="caution" aria-label="注意事項" className="bg-surface-warning-muted flex flex-col gap-6 items-center px-6 py-10 relative">
      {/* Warning icon */}
      <div aria-hidden="true" className="absolute -top-[27px] left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-surface-warning-muted flex items-center justify-center z-0">
        <Icon name="warning" color="warning" size="xl" />
      </div>

      <div
        ref={contentRef}
        className={`fade-in-up flex flex-col items-center w-full relative z-10 ${contentVisible ? 'is-visible' : ''}`}
      >
        <div className="pb-4 w-full">
          <Typography variant="h3" as="h2" weight="semibold" className="text-center">
            注意事項
          </Typography>
        </div>

        <div className="flex flex-col gap-6 w-full">
          {/* 2x2 grid */}
          <ul className="grid grid-cols-2 gap-x-6 gap-y-4 list-none">
            {conditions.map((cond, i) => (
              <li key={i} className="flex flex-col gap-4">
                <Placeholder label="イラスト想定" className="aspect-square w-full" />
                <Typography variant="body" color="default">
                  {cond.text}
                </Typography>
              </li>
            ))}
          </ul>

          {/* Footnote */}
          <Typography variant="body-sm" color="default" className="leading-relaxed">
            ※ 注釈テキスト注釈テキスト注釈テキスト注釈テキスト注釈テキスト注釈テキスト注釈テキスト注釈テキスト。
          </Typography>
        </div>
      </div>
    </section>
  );
}
