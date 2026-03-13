import { useRef, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { PurchaseDialog } from '../components/PurchaseDialog';
import { PurchaseToast } from '../components/PurchaseToast';

export const Layout = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div
      ref={scrollRef}
      className="max-w-[420px] mx-auto bg-background min-h-screen relative shadow-lg overflow-y-auto"
    >
      <Header />
      <Outlet />
      <BottomNav />
      <PurchaseDialog />
      <PurchaseToast />
    </div>
  );
};
