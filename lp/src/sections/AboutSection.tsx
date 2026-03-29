import { Typography } from '@ds/Typography';
import { Icon } from '@ds/Icon';
import Placeholder from '../components/Placeholder';
import { useFadeIn } from '../hooks/useFadeIn';

const features = [
  'テキストテキストテキストテキスト',
  'テキストテキストテキストテキストテキストテキスト',
  'テキストテキストテキストテキスト',
];

export default function AboutSection() {
  const [titleRef, titleVisible] = useFadeIn();
  const [listRef, listVisible] = useFadeIn();

  return (
    <section aria-label="サービス紹介" className="flex flex-col items-center pb-12 pt-10">
      <div className="flex flex-col gap-6 items-center px-6 w-full">
        {/* Title */}
        <div
          ref={titleRef}
          className={`fade-in-up flex flex-col gap-4 items-center ${titleVisible ? 'is-visible' : ''}`}
        >
          <div className="flex gap-3 items-center">
            <Placeholder label="ロゴアセット想定" className="h-14 w-[200px]" />
            <Typography variant="h4" as="h2" weight="semibold">
              とは
            </Typography>
          </div>
          <Typography variant="body" color="default" className="text-center">
            テキストテキストテキストテキストテキストテキストテキスト。
          </Typography>
        </div>

        {/* Feature list */}
        <div
          ref={listRef}
          className={`fade-in-up delay-100 bg-[#f7f7f7] p-6 rounded-lg w-full ${listVisible ? 'is-visible' : ''}`}
        >
          <ul className="flex flex-col gap-4">
            {features.map((text, i) => (
              <li key={i} className="flex gap-1 items-start w-full">
                <Icon name="check_box" color="primary" size="md" />
                <Typography variant="body" color="default" className="flex-1">
                  {text}
                </Typography>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
