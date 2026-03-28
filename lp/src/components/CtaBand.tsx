import { Typography } from '@ds/Typography';
import { Button } from '@ds/Button';

interface CtaBandProps {
  text?: string;
  buttonLabel?: string;
}

export default function CtaBand({
  text = 'CTAのための一言テキストが入ります。CTAのための一言テキストが入ります。',
  buttonLabel = '申し込む',
}: CtaBandProps) {
  return (
    <section className="bg-[#f5f7f5] flex flex-col gap-6 items-center justify-center px-6 py-8">
      <Typography variant="body" color="default" className="text-center">
        {text}
      </Typography>
      <Button variant="primary" size="large" fullWidth>
        {buttonLabel}
      </Button>
    </section>
  );
}
