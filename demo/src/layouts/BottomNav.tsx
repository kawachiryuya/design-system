import { NavLink } from 'react-router-dom';
import { Icon } from '@ds/primitives/Icon';

const navItems = [
  { to: '/', icon: 'home' as const, label: 'ホーム' },
  { to: '/reservations', icon: 'list_alt' as const, label: '予約一覧' },
  { to: '/mypage', icon: 'person' as const, label: 'マイページ' },
];

export const BottomNav = () => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 lg:hidden z-50 bg-surface border-t border-border-muted shadow-sm"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 flex-1 h-full text-xs font-medium transition-colors ${
                isActive
                  ? 'text-onSurface-primary'
                  : 'text-onSurface-muted'
              }`
            }
          >
            <Icon name={item.icon} size="sm" color="inherit" />
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
