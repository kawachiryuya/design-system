import { Link, useNavigate } from 'react-router-dom';
import { Typography } from '@ds/primitives/Typography/Typography';

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-surface border-b border-border-muted px-4 py-2 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 no-underline">
        <div
          className="w-[30px] h-[30px] rounded-sm flex items-center justify-center text-white font-bold text-xs"
          style={{ background: 'linear-gradient(135deg, #2D6A4F, #40916C)' }}
        >
          G
        </div>
        <span className="font-bold text-[15px]">
          <span className="text-onSurface-primary">Gun</span>
          <span className="text-onSurface">MaaS</span>
        </span>
      </Link>
      <div className="flex gap-4">
        <Typography
          variant="caption"
          color="muted"
          as="span"
          weight="medium"
          className="cursor-pointer"
          onClick={() => navigate('/tickets')}
        >
          チケット
        </Typography>
        <Typography variant="caption" color="muted" as="span" weight="medium" className="cursor-pointer">
          FAQ
        </Typography>
      </div>
    </header>
  );
};
