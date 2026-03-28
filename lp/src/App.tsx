import MobileLp from './MobileLp';
import DesktopWrapper from './DesktopWrapper';

export default function App() {
  return (
    <>
      {/* Mobile-only layout (< sm) */}
      <div className="sm:hidden flex justify-center">
        <MobileLp />
      </div>

      {/* Desktop layout with branding (>= sm) */}
      <div className="hidden sm:block">
        <DesktopWrapper />
      </div>
    </>
  );
}
