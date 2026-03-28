import { Typography } from '@ds/Typography';

export default function FooterSection() {
  return (
    <footer className="bg-[#e6e8e6] flex flex-col items-center py-6">
      <Typography variant="caption" weight="semibold" color="default" className="text-center">
        Copyright © XXXXXXXX Company All
        <br />
        Rights Reserved.
      </Typography>
    </footer>
  );
}
