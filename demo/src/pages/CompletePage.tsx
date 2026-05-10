import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@ds/primitives/Button/Button';
import { Icon } from '@ds/primitives/Icon';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Badge } from '@ds/composites/Badge/Badge';
import { Card } from '@ds/composites/Card/Card';
import { formatPassengers } from '../data/trains';

export const CompletePage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const adults = Number(params.get('adults') ?? 1);
  const children = Number(params.get('children') ?? 0);
  // demo では既存の予約データ（RD-001）を予約番号として表示
  const bookingId = 'RD-001';

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 xl:gap-8">
      <div className="col-span-12 flex flex-col items-center py-10 text-center">
        <div className="w-16 h-16 rounded-full bg-surface-success-muted flex items-center justify-center mb-4">
          <Icon name="check_circle" size="lg" color="success" />
        </div>

        <Typography variant="h4" as="h1" className="mb-2">
          {formatPassengers(adults, children)}のご予約が完了しました
        </Typography>
        <Typography variant="body-sm" color="muted" className="mb-6">
          ご予約ありがとうございます。確認メールをお送りしました。
        </Typography>

        <div className="mb-8">
          <Typography variant="caption" color="muted" className="mb-1">予約番号</Typography>
          <Badge variant="neutral" appearance="outline" size="medium">{bookingId}</Badge>
        </div>

        {/* IC カード登録動線 */}
        <Card variant="outlined" padding="md" className="max-w-md w-full">
          <div className="flex items-center justify-center mb-4">
            <Icon name="contactless" size="lg" color="primary" />
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="primary"
              size="medium"
              fullWidth
              onClick={() => navigate(`/reservations/${bookingId}#ic-section`)}
            >
              ICカード設定を続ける
            </Button>
            <Button
              variant="tertiary"
              size="medium"
              fullWidth
              onClick={() => navigate(`/reservations/${bookingId}`)}
            >
              予約詳細をみる
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
