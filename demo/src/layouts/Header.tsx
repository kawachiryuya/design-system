import { Link, useLocation, useNavigate } from 'react-router-dom';
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
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full transition-colors hover:bg-white/10"
              aria-label="戻る"
            >
              <Icon name="arrow_back" size="sm" color="inherit" />
            </button>
            <span className="font-semibold text-base ml-1">{title ?? 'Rail Demo'}</span>
          </>
        )}
      </div>
    </header>
  );
};
