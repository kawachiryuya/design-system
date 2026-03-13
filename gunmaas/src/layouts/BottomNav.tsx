import { NavLink } from 'react-router-dom';
import { Icon } from '@ds/primitives/Icon/Icon';

const navItems = [
  { to: '/', icon: 'home' as const, label: 'ホーム' },
  { to: '/search', icon: 'search' as const, label: '検索' },
  { to: '/my-tickets', icon: 'confirmation_number' as const, label: 'チケット' },
  { to: '/mypage', icon: 'person' as const, label: 'マイページ' },
];

export const BottomNav = () => {
  return (
    <nav className="sticky bottom-0 bg-surface border-t border-border-muted z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item, i) => (
          <NavLink
            key={i}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 flex-1 h-full text-xs font-medium transition-colors ${
                isActive
                  ? 'text-onSurface-primary'
                  : 'text-onSurface-subtle'
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
