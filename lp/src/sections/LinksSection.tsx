import { Typography } from '@ds/Typography';
import { Button } from '@ds/Button';
import { useFadeIn } from '../hooks/useFadeIn';

const links: { label: string; url: string }[] = [
  { label: 'ボタンテキスト', url: '' },
  { label: 'ボタンテキスト', url: '' },
  { label: 'ボタンテキストボタンテキスト', url: '' },
];

export default function LinksSection() {
  const [sectionRef, sectionVisible] = useFadeIn();

  return (
    <section className="bg-[#f5f7f5] flex flex-col gap-6 items-center px-6 py-10" id="links">
      <div ref={sectionRef} className={`fade-in-up flex flex-col gap-6 items-center w-full ${sectionVisible ? 'is-visible' : ''}`}>
        <Typography variant="h3" weight="semibold" className="text-center">
          リンク
        </Typography>

        <div className="flex flex-col gap-4 w-full">
          {/* TODO: 納品時に各 url を設定 */}
          {links.map(({ label, url }, i) => (
            <a key={i} href={url || ''} target="_blank" rel="noopener noreferrer" onClick={url ? undefined : (e) => e.preventDefault()}>
              <Button variant="secondary" size="large" fullWidth>
                {label}
              </Button>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
