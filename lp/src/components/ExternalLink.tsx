import { ReactNode } from 'react';

interface ExternalLinkProps {
  href: string;
  label: string;
  className?: string;
  children: ReactNode;
}

/**
 * URL が設定されていれば <a> でラップし、空なら children をそのまま表示する。
 * URL 設定後に自動でリンク化されるため、各セクションで条件分岐する必要がない。
 */
export default function ExternalLink({ href, label, className, children }: ExternalLinkProps) {
  if (!href) {
    return <div className={className}>{children}</div>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label}（別ウィンドウで開きます）`}
      className={className}
    >
      {children}
    </a>
  );
}
