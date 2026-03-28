import { useState, useEffect } from 'react';
import { Icon } from '@ds/Icon';
import { navItems } from '../SectionNav';

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Hamburger button — hidden when SectionNav is visible (xl+) */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden flex items-center justify-center w-10 h-10"
        aria-label="メニューを開く"
      >
        <Icon name="menu" size="md" color="inherit" />
      </button>

      {/* Overlay + slide-in panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-surface-overlay"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel (right slide-in) */}
          <nav className="absolute top-0 right-0 h-full w-full sm:w-[320px] md:w-[480px] bg-white shadow-lg flex flex-col">
            {/* Close button */}
            <div className="flex items-center justify-end h-16 px-4">
              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-10 h-10"
                aria-label="メニューを閉じる"
              >
                <Icon name="close" size="md" color="inherit" />
              </button>
            </div>

            {/* Nav items */}
            <ul className="flex flex-col px-4">
              {navItems.map((item, i) => (
                <li key={i} className={i < navItems.length - 1 ? 'border-b border-border-muted' : ''}>
                  <a
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center h-12 px-4 text-base font-semibold text-onSurface"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
