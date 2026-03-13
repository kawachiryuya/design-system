import { useNavigate } from 'react-router-dom';
import { Card } from '@ds/composites/Card/Card';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Button } from '@ds/primitives/Button/Button';
import type { TicketWithDest } from '../data/destinations';
import { useTicketStore } from '../store/ticketStore';

interface TicketListItemProps {
  ticket: TicketWithDest;
  /** 購入ボタンを表示するか */
  showBuy?: boolean;
}

export const TicketListItem = ({ ticket: t, showBuy = false }: TicketListItemProps) => {
  const navigate = useNavigate();
  const { setPendingPurchase } = useTicketStore();

  return (
    <Card
      variant="outlined"
      clickable
      onClick={() => navigate(`/place/${t.destId}`)}
      className="mb-2 transition-all duration-normal hover:shadow-md"
    >
      <div className="p-3 flex justify-between items-center">
        <div className="min-w-0 flex-1">
          <Typography variant="caption" as="span" weight="bold" className="tracking-wide text-accent">
            {t.destName} · {t.days}
          </Typography>
          <Typography variant="body-sm" as="div" weight="bold" className="mt-0">
            {t.name}
          </Typography>
          {t.desc && (
            <Typography variant="caption" color="subtle" as="div" className="mt-1 leading-snug">
              {t.desc}
            </Typography>
          )}
        </div>
        <div className="text-right flex-shrink-0 ml-3">
          <Typography variant="h5" as="div" weight="bold" color="primary" className="font-sans">
            {t.price}
          </Typography>
          {showBuy && (
            <Button
              size="small"
              className="mt-1 !text-xs !h-8 !min-w-0 !px-3"
              onClick={(e) => {
                e.stopPropagation();
                setPendingPurchase({ ticket: t, destName: t.destName, destId: t.destId });
              }}
              style={{ background: 'linear-gradient(135deg, var(--gm-accent), var(--gm-accent-dark))' }}
            >
              購入
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
