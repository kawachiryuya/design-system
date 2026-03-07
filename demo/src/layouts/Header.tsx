import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@ds/primitives/Button/Button';
import { Icon } from '@ds/primitives/Icon';

const pageTitles: Record<string, string> = {
  '/results': '列車一覧',
  '/seat': '座席クラス選択',
  '/seatmap': '座席選択',
  '/confirm': '予約確認',
  '/complete': '予約完了',
};

export const Header = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isHome = pathname === '/';
  const title = pageTitles[pathname];

  return (
    <header className="lg:hidden bg-surface-primary text-onSurface-inverse">
      <div className="w-full px-4 sm:px-6 md:px-8 h-12 flex items-center">
        {isHome ? (
          <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
            <Icon name="train" size="md" color="inherit" />
            Rail Demo
          </Link>
        ) : (
          <>
            <Button
              iconOnly
              size="small"
              variant="tertiary"
              onClick={() => navigate(-1)}
              className="-ml-2 text-onSurface-inverse hover:shadow-[inset_0_0_0_9999px_rgba(255,255,255,0.1)]"
              aria-label="戻る"
            >
              <Icon name="arrow_back" size="sm" color="inherit" />
            </Button>
            <span className="font-semibold text-base ml-1">{title ?? 'Rail Demo'}</span>
          </>
        )}
      </div>
    </header>
  );
};
