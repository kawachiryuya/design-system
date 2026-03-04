import { NavLink } from 'react-router-dom';
import { Icon } from '@ds/primitives/Icon';

const navItems = [
  { to: '/', icon: 'home' as const, label: 'ホーム' },
  { to: '/reservations', icon: 'list_alt' as const, label: '予約一覧' },
  { to: '/mypage', icon: 'person' as const, label: 'マイページ' },
];

export const Sidebar = () => {
  return (
    <aside className="hidden lg:flex flex-col w-[240px] shrink-0 sticky top-0 h-screen border-r border-border-muted bg-surface overflow-y-auto">
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-surface-secondary text-onSurface-primary'
                  : 'text-onSurface-muted hover:bg-surface-inset hover:text-onSurface'
              }`
            }
          >
            <Icon name={item.icon} size="sm" color="inherit" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
