import { Typography } from '@ds/primitives/Typography/Typography';

export const Footer = () => (
  <footer className="border-t border-border-muted mt-auto">
    <div className="w-full md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 text-center">
      <Typography variant="caption" color="muted" as="span">
        Rail Demo — デザインシステム実証用デモサイト
      </Typography>
    </div>
  </footer>
);
