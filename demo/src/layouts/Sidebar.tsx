import { NavLink } from 'react-router-dom';
import { Icon } from '@ds/primitives/Icon';

type NavItem = { to: string; icon: string; label: string };

const mainNav: NavItem[] = [
  { to: '/', icon: 'home', label: 'ホーム（検索）' },
  { to: '/lp', icon: 'campaign', label: 'サービス紹介' },
  { to: '/reservations', icon: 'list_alt', label: '予約一覧' },
  { to: '/mypage', icon: 'person', label: 'マイページ' },
];

const contentNav: NavItem[] = [
  { to: '/articles', icon: 'article', label: '記事' },
  { to: '/help', icon: 'help', label: 'ヘルプ' },
  { to: '/faq', icon: 'quiz', label: 'FAQ' },
];

const utilNav: NavItem[] = [
  { to: '/settings', icon: 'settings', label: '設定' },
  { to: '/tokens', icon: 'palette', label: 'Tokens' },
];

const NavSection = ({ items, label }: { items: NavItem[]; label?: string }) => (
  <div className="space-y-1">
    {label && (
      <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-onSurface-subtle">
        {label}
      </p>
    )}
    {items.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.to === '/'}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
              ? 'bg-surface-inset text-onSurface-primary'
              : 'text-onSurface-muted hover:bg-surface-inset hover:text-onSurface'
          }`
        }
      >
        <Icon name={item.icon} size="sm" color="inherit" />
        {item.label}
      </NavLink>
    ))}
  </div>
);

export const Sidebar = () => {
  return (
    <aside className="hidden lg:flex flex-col w-[240px] shrink-0 sticky top-0 h-screen border-r border-border-muted bg-surface overflow-y-auto">
      {/* ロゴ */}
      <div className="flex items-center gap-2 px-6 h-[56px] shrink-0 border-b border-border-muted">
        <Icon name="train" size="md" color="primary" />
        <span className="font-bold text-lg tracking-tight text-onSurface">Rail Demo</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-3">
        <NavSection items={mainNav} />
        <NavSection items={contentNav} label="情報・ヘルプ" />
        <NavSection items={utilNav} label="ユーティリティ" />
      </nav>
    </aside>
  );
};
