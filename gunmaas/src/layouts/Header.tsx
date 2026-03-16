import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Typography } from '@ds/primitives/Typography/Typography';
import { Icon } from '@ds/primitives/Icon/Icon';

const TOP_LEVEL_PATHS = ['/', '/search', '/my-tickets', '/mypage'];

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSubPage = !TOP_LEVEL_PATHS.includes(location.pathname);

  return (
    <header className="bg-surface border-b border-border-muted px-4 py-2 flex items-center justify-between sticky top-0 z-50">
      {isSubPage ? (
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 bg-transparent border-none cursor-pointer p-0"
        >
          <Icon name="arrow_back" size="sm" color="primary" />
          <Typography variant="caption" color="primary" as="span" weight="medium">
            戻る
          </Typography>
        </button>
      ) : (
        <Link to="/" className="flex items-center gap-2 no-underline">
          <div
            className="w-[30px] h-[30px] rounded-sm flex items-center justify-center text-white font-bold text-xs"
            style={{ background: 'linear-gradient(135deg, #2D6A4F, #40916C)' }}
          >
            つ
          </div>
          <span className="font-bold text-[15px]">
            <span className="text-onSurface-primary">つなぐ</span>
            <span className="text-onSurface">パス</span>
          </span>
        </Link>
      )}
      <div className="flex gap-4">
        <Typography variant="caption" color="muted" as="span" weight="medium" className="cursor-pointer">
          FAQ
        </Typography>
      </div>
    </header>
  );
};
