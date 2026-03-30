import { Typography } from '@ds/Typography';
import { Button } from '@ds/Button';
import { useFadeIn } from '../hooks/useFadeIn';
import { urls } from '../assets';
import ExternalLink from '../components/ExternalLink';

const links = [
  { label: 'ボタンテキスト' },
  { label: 'ボタンテキスト' },
  { label: 'ボタンテキストボタンテキスト' },
];

export default function LinksSection() {
  const [sectionRef, sectionVisible] = useFadeIn();

  return (
    <section id="links" aria-label="リンク" className="bg-[#f5f7f5] flex flex-col gap-6 items-center px-6 py-10">
      <div ref={sectionRef} className={`fade-in-up flex flex-col gap-6 items-center w-full ${sectionVisible ? 'is-visible' : ''}`}>
        <Typography variant="h3" as="h2" weight="semibold" className="text-center">
          リンク
        </Typography>

        <div className="flex flex-col gap-4 w-full">
          {links.map(({ label }, i) => (
            <ExternalLink key={i} href={urls.links[i] || ''} label={label}>
              <Button variant="secondary" size="large" fullWidth>
                {label}
              </Button>
            </ExternalLink>
          ))}
        </div>
      </div>
    </section>
  );
}
