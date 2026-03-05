import { Link, NavLink } from 'react-router-dom';
import { Icon } from '@ds/primitives/Icon';

const navItems = [
  { to: '/', label: 'ホーム' },
  { to: '/reservations', label: '予約一覧' },
  { to: '/mypage', label: 'マイページ' },
];

export const Header = () => {
  return (
    <header className="lg:hidden bg-surface-primary text-onSurface-inverse">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
          <Icon name="train" size="md" color="inherit" />
          Rail Demo
        </Link>

        {/* モバイル/タブレット用ナビ（lg以上はサイドバーに委譲） */}
        <nav className="flex lg:hidden items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};
