import { Typography } from '@ds/Typography';
import { Button } from '@ds/Button';
import { urls } from '../assets';
import ExternalLink from './ExternalLink';

interface CtaBandProps {
  text?: string;
  buttonLabel?: string;
}

export default function CtaBand({
  text = 'CTAのための一言テキストが入ります。CTAのための一言テキストが入ります。',
  buttonLabel = '申し込む',
}: CtaBandProps) {
  return (
    <section aria-label="申し込み案内" className="bg-[#f5f7f5] flex flex-col gap-6 items-center justify-center px-6 py-8">
      <Typography variant="body" color="default" className="text-center">
        {text}
      </Typography>
      <ExternalLink href={urls.apply} label={buttonLabel} className="w-full">
        <Button variant="primary" size="large" fullWidth>
          {buttonLabel}
        </Button>
      </ExternalLink>
    </section>
  );
}
