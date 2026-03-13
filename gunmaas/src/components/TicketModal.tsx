import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Button } from '@ds/primitives/Button/Button';
import { Icon } from '@ds/primitives/Icon/Icon';
import { Card } from '@ds/composites/Card/Card';
import { Badge } from '@ds/composites/Badge/Badge';
import { Divider } from '@ds/primitives/Divider/Divider';
import { destinations } from '../data/destinations';
import { useTicketStore } from '../store/ticketStore';
import { FadeIn } from './FadeIn';

type Step = 'detail' | 'confirm' | 'complete';

export const TicketModal = () => {
  const navigate = useNavigate();
  const { detailTicket, setDetailTicket, purchaseTicket } = useTicketStore();
  const [step, setStep] = useState<Step>('detail');

  if (!detailTicket) return null;

  const dest = destinations.find((d) => d.id === detailTicket.destId);

  const handleClose = () => {
    setDetailTicket(null);
    setStep('detail');
  };

  const handlePurchase = () => {
    purchaseTicket(detailTicket);
    setStep('complete');
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Sheet */}
      <FadeIn>
        <div
          className="relative w-full bg-surface rounded-t-lg overflow-hidden min-h-[60vh] max-h-[85vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {step === 'detail' && (
            <DetailStep
              ticket={detailTicket}
              dest={dest}
              onBuy={() => setStep('confirm')}
              onClose={handleClose}
            />
          )}
          {step === 'confirm' && (
            <ConfirmStep
              ticket={detailTicket}
              onConfirm={handlePurchase}
              onBack={() => setStep('detail')}
            />
          )}
          {step === 'complete' && (
            <CompleteStep
              ticketName={detailTicket.name}
              onViewTickets={() => {
                handleClose();
                navigate('/my-tickets');
              }}
              onClose={handleClose}
            />
          )}
        </div>
      </FadeIn>
    </div>
  );
};

/* ── Step 1: 詳細 ── */

import type { TicketWithDest, Destination } from '../data/destinations';

const DetailStep = ({
  ticket,
  dest,
  onBuy,
  onClose,
}: {
  ticket: TicketWithDest;
  dest: Destination | undefined;
  onBuy: () => void;
  onClose: () => void;
}) => (
  <>
    {/* Header */}
    <div className="px-4 pt-5 pb-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {dest && <span className="text-xl">{dest.emoji}</span>}
        <div>
          <Typography variant="body-sm" as="div" weight="bold">
            {ticket.destName}
          </Typography>
          {dest && (
            <Typography variant="caption" color="muted" as="div">
              {dest.cat} · {dest.area}
            </Typography>
          )}
        </div>
      </div>
      <button
        type="button"
        className="p-1 rounded-sm hover:bg-surface-secondary transition-colors cursor-pointer"
        onClick={onClose}
      >
        <Icon name="close" size="sm" color="disabled" />
      </button>
    </div>

    <Divider />

    {/* Ticket info */}
    <div className="px-4 py-4">
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="info" appearance="outline" size="small">
          {ticket.days}
        </Badge>
      </div>
      <Typography variant="h5" as="div" weight="bold">
        {ticket.name}
      </Typography>
      <Typography variant="caption" color="muted" as="div" className="mt-2 leading-relaxed">
        {ticket.desc}
      </Typography>

      <div className="mt-4 flex items-baseline gap-1">
        <Typography variant="caption" color="muted" as="span">
          価格
        </Typography>
        <Typography variant="h3" as="span" weight="bold" color="primary" className="font-sans ml-auto">
          {ticket.price}
        </Typography>
      </div>
    </div>

    {/* Access info */}
    {dest && dest.access.length > 0 && (
      <>
        <Divider />
        <div className="px-4 py-4">
          <Typography variant="caption" as="div" weight="bold" color="muted" className="mb-2">
            🚃 アクセス
          </Typography>
          {dest.access.map((a, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-border-muted last:border-b-0">
              <span className="text-lg flex-shrink-0">{a.icon}</span>
              <div className="flex-1 min-w-0">
                <Typography variant="caption" as="span" weight="bold">
                  {a.mode}
                </Typography>
                <Typography variant="caption" color="muted" as="div" className="leading-snug">
                  {a.detail}
                </Typography>
              </div>
              <Badge variant="neutral" size="small">
                {a.time}
              </Badge>
            </div>
          ))}
        </div>
      </>
    )}

    {/* Discount */}
    {dest?.discount && (
      <>
        <Divider />
        <div className="px-4 py-3">
          <div className="rounded-sm p-3 flex gap-2 items-start bg-surface-warning-muted">
            <span className="text-base flex-shrink-0">💡</span>
            <div>
              <Typography variant="body-sm" as="div" weight="bold">
                {dest.discount.cond}の方
              </Typography>
              <Typography variant="caption" color="muted" as="div">
                {dest.discount.detail}
              </Typography>
              <Typography variant="caption" color="subtle" as="div" className="text-[10px]">
                {dest.discount.sub}
              </Typography>
            </div>
          </div>
        </div>
      </>
    )}

    {/* Actions */}
    <div className="px-4 pb-6 pt-2 flex gap-2">
      <Button variant="secondary" fullWidth onClick={onClose}>
        閉じる
      </Button>
      <Button
        fullWidth
        onClick={onBuy}
        style={{ background: 'linear-gradient(135deg, var(--gm-accent), var(--gm-accent-dark))' }}
      >
        購入する
      </Button>
    </div>
  </>
);

/* ── Step 2: 確認 ── */

const ConfirmStep = ({
  ticket,
  onConfirm,
  onBack,
}: {
  ticket: TicketWithDest;
  onConfirm: () => void;
  onBack: () => void;
}) => (
  <>
    <div className="px-4 pt-5 pb-3">
      <Typography variant="body-sm" as="div" weight="bold">
        購入の確認
      </Typography>
    </div>

    <Divider />

    <div className="px-4 py-4">
      <Card variant="outlined">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="info" appearance="outline" size="small">
              {ticket.days}
            </Badge>
            <Typography variant="caption" color="muted" as="span">
              {ticket.destName}
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

    <div className="px-4 pb-6 flex gap-2">
      <Button variant="secondary" fullWidth onClick={onBack}>
        戻る
      </Button>
      <Button
        fullWidth
        onClick={onConfirm}
        style={{ background: 'linear-gradient(135deg, var(--gm-accent), var(--gm-accent-dark))' }}
      >
        確定する
      </Button>
    </div>
  </>
);

/* ── Step 3: 完了 ── */

const CompleteStep = ({
  ticketName,
  onViewTickets,
  onClose,
}: {
  ticketName: string;
  onViewTickets: () => void;
  onClose: () => void;
}) => (
  <>
    <div className="px-4 pt-8 pb-4 text-center">
      <div className="w-16 h-16 rounded-full bg-surface-success-muted flex items-center justify-center mx-auto mb-4">
        <Icon name="check_circle" size="lg" color="primary" />
      </div>
      <Typography variant="h5" as="div" weight="bold">
        購入が完了しました
      </Typography>
      <Typography variant="caption" color="muted" as="div" className="mt-2">
        {ticketName}
      </Typography>
    </div>

    <div className="px-4 pb-6 flex flex-col gap-2">
      <Button
        fullWidth
        onClick={onViewTickets}
        style={{ background: 'linear-gradient(135deg, var(--gm-accent), var(--gm-accent-dark))' }}
      >
        マイチケットを見る
      </Button>
      <Button variant="secondary" fullWidth onClick={onClose}>
        閉じる
      </Button>
    </div>
  </>
);
