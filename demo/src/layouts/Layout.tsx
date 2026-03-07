import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';

export const Layout = () => (
  <div className="min-h-screen flex flex-col bg-background">
    <Header />
    <div className="flex flex-1">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        <div className="w-full md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 pb-20 lg:pb-6">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
    <BottomNav />
  </div>
);
