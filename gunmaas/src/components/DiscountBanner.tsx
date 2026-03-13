import { Typography } from '@ds/primitives/Typography/Typography';
import type { Discount } from '../data/destinations';

interface DiscountBannerProps {
  discount: Discount;
}

export const DiscountBanner = ({ discount }: DiscountBannerProps) => {
  return (
    <div className="mt-3 rounded-sm p-3 flex gap-2 items-start" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}>
      <span className="text-base flex-shrink-0">💡</span>
      <div>
        <Typography variant="body-sm" as="div" weight="bold" color="inherit">
          {discount.cond}の方
        </Typography>
        <Typography variant="caption" as="div" color="inherit" className="opacity-90 mt-0">
          {discount.detail}
        </Typography>
        <Typography variant="caption" as="div" color="inherit" className="opacity-70 mt-0 text-[10px]">
          {discount.sub}
        </Typography>
      </div>
    </div>
  );
};
