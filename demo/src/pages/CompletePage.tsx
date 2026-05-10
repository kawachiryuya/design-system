import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@ds/primitives/Button/Button';
import { Icon } from '@ds/primitives/Icon';
import { Typography } from '@ds/primitives/Typography/Typography';

export const CompletePage = () => {
  const [_params] = useSearchParams();
  const navigate = useNavigate();
  // demo では既存の予約データ（RD-001）に遷移
  const bookingId = 'RD-001';
  void _params;

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 xl:gap-8">
      <div className="col-span-12 flex flex-col items-center py-10 text-center">
        <div className="w-16 h-16 rounded-full bg-surface-success-muted flex items-center justify-center mb-4">
          <Icon name="check_circle" size="lg" color="success" />
        </div>

        <Typography variant="h4" as="h1" className="mb-2">
          ご予約が完了しました
        </Typography>
        <Typography variant="body-sm" color="muted" className="mb-8">
          ご予約ありがとうございます。確認メールをお送りしました。
        </Typography>

        {/* IC カード登録動線（背景なしの裸ボタン） */}
        <div className="flex flex-col gap-2 max-w-md w-full">
          <Button
            variant="primary"
            size="medium"
            fullWidth
            onClick={() => navigate(`/reservations/${bookingId}/ic-register`)}
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
      </div>
    </div>
  );
};
