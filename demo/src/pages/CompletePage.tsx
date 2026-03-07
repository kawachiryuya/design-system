import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@ds/primitives/Button/Button';
import { Icon } from '@ds/primitives/Icon';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Badge } from '@ds/composites/Badge/Badge';

export const CompletePage = () => {
  const [params] = useSearchParams();
  const passengers = Number(params.get('passengers') ?? 1);
  const bookingId = `RD-${Date.now().toString(36).toUpperCase()}`;

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 xl:gap-8">
    <div className="col-span-12 flex flex-col items-center py-10 text-center">
      <div className="w-16 h-16 rounded-full bg-surface-success-muted flex items-center justify-center mb-4">
        <Icon name="check_circle" size="lg" color="success" />
      </div>

      <Typography variant="h4" as="h1" className="mb-2">{passengers}名様のご予約が完了しました</Typography>
      <Typography variant="body-sm" color="muted" className="mb-6">
        ご予約ありがとうございます。確認メールをお送りしました。
      </Typography>

      <div className="mb-8">
        <Typography variant="caption" color="muted" className="mb-1">予約番号</Typography>
        <Badge variant="neutral" appearance="outline" size="medium">{bookingId}</Badge>
      </div>

      <div className="flex gap-3">
        <Link to="/">
          <Button variant="tertiary">トップへ戻る</Button>
        </Link>
        <Link to="/">
          <Button>新しい予約</Button>
        </Link>
      </div>
    </div>
    </div>
  );
};
