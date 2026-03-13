import { Typography } from '@ds/primitives/Typography/Typography';
import { Icon } from '@ds/primitives/Icon/Icon';
import type { Discount } from '../data/destinations';

interface PersonalDiscountBannerProps {
  discount: Discount;
}

export const PersonalDiscountBanner = ({ discount }: PersonalDiscountBannerProps) => {
  return (
    <div className="mt-3 rounded-sm p-3 flex gap-2 items-start" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}>
      <Icon name="check_circle" size="sm" color="inherit" />
      <div>
        <Typography variant="body-sm" as="div" weight="bold" color="inherit">
          あなたは対象です
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
