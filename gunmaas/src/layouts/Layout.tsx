import { useRef, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { TicketModal } from '../components/TicketModal';

export const Layout = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div
      className="max-w-[420px] mx-auto bg-background h-screen relative shadow-lg flex flex-col"
    >
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <Header />
        <Outlet />
      </div>
      <BottomNav />
      <TicketModal />
    </div>
  );
};
