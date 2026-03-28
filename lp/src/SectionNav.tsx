export const navItems = [
  { label: 'XXXXXとは', href: '#about' },
  { label: 'β版を先行体験してみませんか？', href: '#trial' },
  { label: '利用の流れ', href: '#usage-flow' },
  { label: '注意事項', href: '#caution' },
  { label: '応募の流れ', href: '#application-flow' },
  { label: 'よくある質問', href: '#faq' },
  { label: 'リンク', href: '#links' },
];

interface SectionNavProps {
  className?: string;
  activeSection?: string;
  onNavigate?: (href: string) => void;
}

export default function SectionNav({ className = '', activeSection, onNavigate }: SectionNavProps) {
  return (
    <nav className={`w-full bg-white border-2 border-border rounded-lg py-2 ${className}`}>
      <ul className="flex flex-col w-full">
        {navItems.map((item, i) => {
          const isActive = activeSection
            ? item.href === `#${activeSection}`
            : i === 0;

          return (
            <li key={i} className={i < navItems.length - 1 ? 'border-b border-border-muted' : ''}>
              <a
                href={item.href}
                onClick={
                  onNavigate
                    ? (e) => {
                        e.preventDefault();
                        onNavigate(item.href);
                      }
                    : undefined
                }
                className={`flex items-center min-h-12 px-4 py-2 text-base font-semibold transition-[background-color] duration-500 ease-in-out hover:bg-[rgba(0,137,101,0.08)] ${isActive ? 'text-onSurface-primary' : 'text-onSurface'}`}
              >
                {/* Active dot — アクティブ時のみ幅が生まれてテキストを右に押し出す */}
                <span
                  className={`shrink-0 h-[6px] rounded-full bg-surface-primary ${
                    isActive
                      ? 'w-[6px] mr-2 opacity-100'
                      : 'w-0 mr-0 opacity-0'
                  }`}
                  style={{ transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1), margin 250ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms ease' }}
                />
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
