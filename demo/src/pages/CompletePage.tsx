import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
        <Card variant="outlined" padding="md" className="mb-8 max-w-md w-full text-left">
          <div className="flex items-start gap-3 mb-4">
            <Icon name="contactless" size="md" color="primary" className="shrink-0" />
            <div className="flex-1">
              <Typography variant="label" as="p">改札をタッチで通過する</Typography>
              <Typography variant="body-sm" color="muted" className="mt-1">
                IC カード（Suica / PASMO / ICOCA 等）を登録すると、当日改札にタッチするだけで乗車できます。
                登録は <strong>この予約のみ</strong> に適用され、後からでも登録可能です。
              </Typography>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="primary"
              size="medium"
              onClick={() => navigate(`/reservations/${bookingId}/ic-register`)}
            >
              今すぐ登録する
            </Button>
            <Button
              variant="tertiary"
              size="medium"
              onClick={() => navigate('/reservations')}
            >
              あとで（予約一覧へ）
            </Button>
          </div>
        </Card>

        <Typography variant="caption" color="subtle" className="mb-4">
          後から登録する場合は、予約一覧の予約詳細から再開できます
        </Typography>

        <div className="flex gap-3">
          <Link to="/">
            <Button variant="secondary">新しい予約</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
