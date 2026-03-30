interface PlaceholderProps {
  /** 画像の URL（空文字の間はプレースホルダー表示） */
  src?: string;
  /** プレースホルダー時のラベル / 画像の alt テキスト */
  label: string;
  className?: string;
}

export default function Placeholder({ src, label, className = '' }: PlaceholderProps) {
  if (src) {
    return <img src={src} alt={label} className={`object-contain ${className}`} />;
  }

  return (
    <div
      className={`bg-neutral-300 flex items-center justify-center text-black text-base ${className}`}
    >
      {label}
    </div>
  );
}
