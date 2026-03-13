import { Typography } from '@ds/primitives/Typography/Typography';
import { Button } from '@ds/primitives/Button/Button';
import { Card } from '@ds/composites/Card/Card';
import { Badge } from '@ds/composites/Badge/Badge';
import { Divider } from '@ds/primitives/Divider/Divider';
import { useTicketStore } from '../store/ticketStore';
import { FadeIn } from './FadeIn';

export const PurchaseDialog = () => {
  const { pendingPurchase, setPendingPurchase, purchaseTicket } = useTicketStore();

  if (!pendingPurchase) return null;

  const { ticket, destName, destId } = pendingPurchase;

  const handleConfirm = () => {
    purchaseTicket(ticket, destName, destId);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center"
      onClick={() => setPendingPurchase(null)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Sheet */}
      <FadeIn>
        <div
          className="relative w-full max-w-[420px] bg-surface rounded-t-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-4 pt-5 pb-3">
            <Typography variant="body-sm" as="div" weight="bold">
              チケット購入の確認
            </Typography>
          </div>

          <Divider />

          {/* Ticket detail */}
          <div className="px-4 py-4">
            <Card variant="outlined">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="info" appearance="outline" size="small">
                    {ticket.days}
                  </Badge>
                  <Typography variant="caption" color="muted" as="span">
                    {destName}
                  </Typography>
                </div>
                <Typography variant="body-sm" as="div" weight="bold">
                  {ticket.name}
                </Typography>
                <Typography variant="caption" color="muted" as="div" className="mt-1 leading-relaxed">
                  {ticket.desc}
                </Typography>

                <Divider className="my-3" />

                <div className="flex justify-between items-baseline">
                  <Typography variant="caption" color="muted" as="span">
                    お支払い金額
                  </Typography>
                  <Typography variant="h3" as="span" weight="bold" color="primary" className="font-sans">
                    {ticket.price}
                  </Typography>
                </div>
              </div>
            </Card>
          </div>

          {/* Actions */}
          <div className="px-4 pb-6 flex gap-2">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setPendingPurchase(null)}
            >
              キャンセル
            </Button>
            <Button
              fullWidth
              onClick={handleConfirm}
              style={{ background: 'linear-gradient(135deg, var(--gm-accent), var(--gm-accent-dark))' }}
            >
              購入する
            </Button>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};
