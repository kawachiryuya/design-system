import { useNavigate } from 'react-router-dom';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Button } from '@ds/primitives/Button/Button';
import { Icon } from '@ds/primitives/Icon/Icon';
import { Card } from '@ds/composites/Card/Card';
import { Badge } from '@ds/composites/Badge/Badge';
import { Divider } from '@ds/primitives/Divider/Divider';
import { type TicketStatus } from '../data/myTickets';
import { useTicketStore } from '../store/ticketStore';
import { FadeIn } from '../components/FadeIn';

const statusConfig: Record<TicketStatus, { label: string; variant: 'success' | 'neutral' | 'error' }> = {
  active: { label: '有効', variant: 'success' },
  used: { label: '使用済み', variant: 'neutral' },
  expired: { label: '期限切れ', variant: 'error' },
};

export const MyTicketsPage = () => {
  const navigate = useNavigate();
  const { tickets: myTickets } = useTicketStore();
  const activeTickets = myTickets.filter((t) => t.status === 'active');
  const pastTickets = myTickets.filter((t) => t.status !== 'active');

  return (
    <div>
      {/* Hero */}
      <div
        className="px-4 pt-5 pb-6 text-white"
        style={{ background: 'linear-gradient(160deg, #1B4332, #2D6A4F)' }}
      >
        <Typography variant="h3" as="div" color="inherit" className="mt-1">
          マイチケット
        </Typography>
        <Typography variant="body-sm" color="inherit" as="div" className="opacity-75 mt-1">
          {myTickets.length}枚のチケット
        </Typography>
      </div>

      {/* Active tickets */}
      <div className="px-4 pt-5">
        <Typography variant="body-sm" as="div" weight="bold" className="mb-3">
          有効なチケット
        </Typography>

        {activeTickets.length === 0 && (
          <FadeIn>
            <div className="text-center py-8">
              <Icon name="confirmation_number" size="lg" color="disabled" />
              <Typography variant="body-sm" color="disabled" as="div" className="mt-3">
                有効なチケットはありません
              </Typography>
              <Button
                size="small"
                className="mt-3"
                style={{ background: 'linear-gradient(135deg, var(--gm-accent), var(--gm-accent-dark))' }}
                onClick={() => navigate('/tickets')}
              >
                チケットを探す
              </Button>
            </div>
          </FadeIn>
        )}

        {activeTickets.map((t, i) => (
          <FadeIn key={t.id} delay={i * 80}>
            <Card variant="outlined" className="mb-3 overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={statusConfig[t.status].variant} dot size="small">
                        {statusConfig[t.status].label}
                      </Badge>
                      <Typography variant="caption" color="subtle" as="span">
                        {t.days}
                      </Typography>
                    </div>
                    <Typography variant="body-sm" as="div" weight="bold" className="mt-2">
                      {t.name}
                    </Typography>
                    <Typography variant="caption" color="disabled" as="div" className="mt-1">
                      {t.destName}
                    </Typography>
                  </div>
                  <Typography variant="h4" as="div" weight="bold" color="primary" className="font-sans ml-3">
                    {t.price}
                  </Typography>
                </div>

                <Divider className="my-3" />

                {/* QR Code placeholder */}
                <div className="flex flex-col items-center py-3">
                  <div className="w-[140px] h-[140px] bg-surface-disabled rounded-sm flex items-center justify-center">
                    <Icon name="qr_code" size="lg" color="disabled" />
                  </div>
                  <Typography variant="caption" color="disabled" as="div" className="mt-2">
                    乗車時にこのQRコードを提示してください
                  </Typography>
                </div>

                <div className="flex justify-between">
                  <Typography variant="caption" color="subtle" as="span">
                    購入日: {t.purchasedAt}
                  </Typography>
                  <Typography variant="caption" color="subtle" as="span">
                    有効期限: {t.validUntil}
                  </Typography>
                </div>
              </div>
            </Card>
          </FadeIn>
        ))}
      </div>

      {/* Past tickets */}
      {pastTickets.length > 0 && (
        <div className="px-4 pt-3 pb-10">
          <Typography variant="body-sm" as="div" weight="bold" className="mb-3">
            過去のチケット
          </Typography>
          {pastTickets.map((t, i) => (
            <FadeIn key={t.id} delay={i * 80}>
              <Card variant="outlined" className="mb-2 opacity-60">
                <div className="p-3 flex justify-between items-center">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={statusConfig[t.status].variant} size="small">
                        {statusConfig[t.status].label}
                      </Badge>
                    </div>
                    <Typography variant="body-sm" as="div" weight="bold" className="mt-1">
                      {t.name}
                    </Typography>
                    <Typography variant="caption" color="subtle" as="div" className="mt-1">
                      {t.destName} · {t.purchasedAt}
                    </Typography>
                  </div>
                  <Typography variant="body-sm" as="div" weight="bold" color="disabled" className="font-sans ml-3">
                    {t.price}
                  </Typography>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>
      )}

      {/* Browse tickets link */}
      <div className="px-4 pb-10">
        <Button
          variant="secondary"
          fullWidth
          onClick={() => navigate('/tickets')}
        >
          チケットを探す
        </Button>
      </div>
    </div>
  );
};
